import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();
        const slug = params.slug;

        const product = await Product.findOne({ slug })
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .lean();

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch product", details: error.message },
            { status: 500 }
        );
    }
}
