import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be positive"),
    images: z.array(z.object({
        url: z.string(),
        public_id: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
    })).min(1, "At least one image is required"),
    category: z.string().nullable().optional(),
    brand: z.string().nullable().optional(),
    stock: z.number().min(0).default(0),
    sku: z.string().optional(),
    weight: z.number().optional(),
});

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const categorySlug = searchParams.get("category");
        const brandSlug = searchParams.get("brand");
        const sort = searchParams.get("sort") || "-createdAt";

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Handle Category Slug
        if (categorySlug) {
            // Support comma-separated slugs and ensure lowercase
            const slugs = categorySlug.split(",").map(s => s.toLowerCase());
            const Category = (await import("@/models/Category")).default;
            const categories = await Category.find({ slug: { $in: slugs } }).select("_id");
            if (categories.length > 0) {
                query.category = { $in: categories.map(c => c._id) };
            } else {
                // If categories not found, return empty result
                return NextResponse.json({ data: [], paginatorInfo: { total: 0, currentPage: page, lastPage: 1 } });
            }
        }

        // Handle Brand Slug
        if (brandSlug) {
            const slugs = brandSlug.split(",").map(s => s.toLowerCase());
            const Brand = (await import("@/models/Brand")).default;
            const brands = await Brand.find({ slug: { $in: slugs } }).select("_id");
            if (brands.length > 0) {
                query.brand = { $in: brands.map(b => b._id) };
            } else {
                return NextResponse.json({ data: [], paginatorInfo: { total: 0, currentPage: page, lastPage: 1 } });
            }
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(query);

        return NextResponse.json({
            data: products,
            paginatorInfo: {
                total,
                currentPage: page,
                lastPage: Math.ceil(total / limit),
                perPage: limit,
                hasMorePages: page * limit < total,
            },
        });
    } catch (error: any) {
        console.error("Fetch products error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate with Zod
        const validation = productSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.issues },
                { status: 400 }
            );
        }

        const productData = validation.data;

        // Check if slug exists
        const existingProduct = await Product.findOne({ slug: productData.slug });
        if (existingProduct) {
            return NextResponse.json(
                { error: "Product with this slug already exists" },
                { status: 400 }
            );
        }

        // Create product
        const product = await Product.create(productData);

        // Populate for response
        await product.populate([
            { path: "category", select: "name slug" },
            { path: "brand", select: "name slug" }
        ]);

        return NextResponse.json(
            { success: true, product },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: "Failed to create product", details: error.message },
            { status: 500 }
        );
    }
}
