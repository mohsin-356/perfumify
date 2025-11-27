import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    description: z.string().optional(),
    parent: z.string().optional().nullable(),
});

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find().populate("parent").sort({ createdAt: -1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const validation = categorySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const { name, description, parent } = validation.data;
        const slug = validation.data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            parent: parent || null
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
