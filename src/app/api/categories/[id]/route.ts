import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const category = await Category.findById(params.id).populate("parent");
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await req.json();
        const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const category = await Category.findByIdAndDelete(params.id);
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
