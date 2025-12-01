import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    shipping_policy: z.string().optional(),
    refund_policy: z.string().optional(),
    sale_price: z.number().optional(),
    price: z.number().min(0, "Price must be positive"),
    images: z.array(z.object({
        url: z.string(),
        public_id: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
    })).min(1, "At least one image is required"),
    category: z.string().nullable().optional(), // Receives ID from form
    brand: z.string().nullable().optional(),    // Receives ID from form
    categories: z.array(z.string()).optional(),  // Receives IDs from form (multi)
    gender: z.enum(["men", "women", "unisex"]).optional(),
    stock: z.number().min(0).default(0),
    sku: z.string().optional(),
    weight: z.number().optional(),
    bestSeller: z.boolean().optional().default(false),
    newArrival: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
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
        const gender = searchParams.get("gender");
        const sort = searchParams.get("sort") || "-createdAt";

        // Badge filters
        const bestSellerParam = searchParams.get("bestSeller");
        const newArrivalParam = searchParams.get("newArrival");
        const featuredParam = searchParams.get("featured");

        const query: any = {};

        if (bestSellerParam === "true") query.bestSeller = true;
        if (newArrivalParam === "true") query.newArrival = true;
        if (featuredParam === "true") query.featured = true;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Direct Slug Filtering (Case Insensitive)
        if (categorySlug) {
            const slugs = categorySlug.split(",").map(s => s.trim().toLowerCase());
            // Match either primary category or any in categories[]
            const orArr = [
                { category: { $in: slugs } },
                { categories: { $in: slugs } },
            ];
            if (query.$or) query.$or = [...query.$or, ...orArr]; else query.$or = orArr;
        }

        if (brandSlug) {
            const slugs = brandSlug.split(",").map(s => s.trim().toLowerCase());
            query.brand = { $in: slugs };
        }

        if (gender && ["men","women","unisex"].includes(gender)) {
            query.gender = gender;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
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

        // Convert Brand/Category IDs to Slugs
        if (productData.brand) {
            const Brand = (await import("@/models/Brand")).default;
            const brandDoc = await Brand.findById(productData.brand);
            if (brandDoc) {
                productData.brand = brandDoc.slug;
            }
        }

        if (productData.category) {
            const Category = (await import("@/models/Category")).default;
            const categoryDoc = await Category.findById(productData.category);
            if (categoryDoc) {
                productData.category = categoryDoc.slug;
            }
        }

        // Convert multi categories IDs -> slugs
        if (Array.isArray(productData.categories) && productData.categories.length) {
            const Category = (await import("@/models/Category")).default;
            const cats = await Category.find({ _id: { $in: productData.categories } }).select("slug").lean();
            productData.categories = cats.map((c: any) => c.slug);
        }

        // Create product
        const product = await Product.create(productData);

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
