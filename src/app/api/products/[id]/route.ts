import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { z } from "zod";

const productUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    images: z.array(z.object({
        url: z.string(),
        public_id: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
    })).optional(),
    category: z.string().nullable().optional(),
    brand: z.string().nullable().optional(),
    stock: z.number().min(0).optional(),
    sku: z.string().optional(),
    weight: z.number().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const product = await Product.findById(params.id)
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .lean();

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
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
                { error: "Validation failed", details: validation.error.errors },
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

        // Update product
        const product = await Product.findByIdAndUpdate(
            params.id,
            validation.data,
            { new: true }
        ).populate([
            { path: "category", select: "name slug" },
            { path: "brand", select: "name slug" }
        ]);

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
    req: Request,
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
