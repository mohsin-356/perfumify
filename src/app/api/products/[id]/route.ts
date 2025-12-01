import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const productUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    shipping_policy: z.string().optional(),
    refund_policy: z.string().optional(),
    sale_price: z.number().optional(),
    price: z.number().min(0).optional(),
    images: z.array(z.object({
        url: z.string(),
        public_id: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
    })).optional(),
    category: z.string().nullable().optional(),
    brand: z.string().nullable().optional(),
    categories: z.array(z.string()).optional(),
    gender: z.enum(["men","women","unisex"]).optional(),
    stock: z.number().min(0).optional(),
    sku: z.string().optional(),
    weight: z.number().optional(),
    bestSeller: z.boolean().optional(),
    newArrival: z.boolean().optional(),
    featured: z.boolean().optional(),
});

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const product = await Product.findById(params.id).lean();

        if (!product || Array.isArray(product)) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Work with a mutable, loosely-typed copy to avoid Mongoose TS inference issues
        const prod: any = product;

        // Manual population for frontend compatibility
        if (prod.brand && typeof prod.brand === 'string') {
            const Brand = (await import("@/models/Brand")).default;
            const brandDoc = await Brand.findOne({ slug: prod.brand }).lean();
            if (brandDoc) prod.brand = brandDoc;
        }

        if (prod.category && typeof prod.category === 'string') {
            const Category = (await import("@/models/Category")).default;
            const categoryDoc = await Category.findOne({ slug: prod.category }).lean();
            if (categoryDoc) prod.category = categoryDoc;
        }

        return NextResponse.json(prod);
    } catch (error: any) {
        console.error("Fetch product error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate with Zod
        const validation = productUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.issues },
                { status: 400 }
            );
        }

        // Check if product exists
        const existingProduct = await Product.findById(params.id);
        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // If slug is being updated, check for duplicates
        if (body.slug && body.slug !== existingProduct.slug) {
            const duplicateSlug = await Product.findOne({
                slug: body.slug,
                _id: { $ne: params.id },
            });
            if (duplicateSlug) {
                return NextResponse.json(
                    { error: "Product with this slug already exists" },
                    { status: 400 }
                );
            }
        }

        const updateData = { ...validation.data };

        // Convert Brand/Category fields: accept ObjectId or slug
        const looksLikeObjectId = (v: any) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);

        if (updateData.brand && looksLikeObjectId(updateData.brand)) {
            const Brand = (await import("@/models/Brand")).default;
            const brandDoc = await Brand.findById(updateData.brand);
            if (brandDoc) updateData.brand = brandDoc.slug;
        }

        if (updateData.category && looksLikeObjectId(updateData.category)) {
            const Category = (await import("@/models/Category")).default;
            const categoryDoc = await Category.findById(updateData.category);
            if (categoryDoc) updateData.category = categoryDoc.slug;
        }

        if (Array.isArray(updateData.categories) && updateData.categories.length) {
            const Category = (await import("@/models/Category")).default;
            const ids = updateData.categories.filter((c: string) => looksLikeObjectId(c));
            let slugs: string[] = updateData.categories.filter((c: string) => !looksLikeObjectId(c));
            if (ids.length) {
                const cats = await Category.find({ _id: { $in: ids } }).select("slug").lean();
                slugs = slugs.concat(cats.map((c: any) => c.slug));
            }
            updateData.categories = slugs;
        }

        // Update product
        const product = await Product.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        );

        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error("Update product error:", error);
        return NextResponse.json(
            { error: "Failed to update product", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const product = await Product.findByIdAndDelete(params.id);

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Note: We keep images in Cloudinary as per user's request (Option B)
        // This provides faster deletion and prevents accidental data loss

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete product error:", error);
        return NextResponse.json(
            { error: "Failed to delete product", details: error.message },
            { status: 500 }
        );
    }
}
