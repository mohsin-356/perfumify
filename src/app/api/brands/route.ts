import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import { z } from "zod";

const brandSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    description: z.string().optional(),
});

export async function GET() {
    try {
        await connectDB();
        const brands = await Brand.find().sort({ createdAt: -1 });
        return NextResponse.json(brands);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const validation = brandSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const { name, description } = validation.data;
        const slug = validation.data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const existingBrand = await Brand.findOne({ slug });
        if (existingBrand) {
            return NextResponse.json({ error: "Brand already exists" }, { status: 400 });
        }

        const brand = await Brand.create({ name, slug, description });
        return NextResponse.json(brand, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
    }
}
