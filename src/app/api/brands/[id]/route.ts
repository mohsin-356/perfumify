import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const brand = await Brand.findById(params.id);
        if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        return NextResponse.json(brand);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await req.json();
        const brand = await Brand.findByIdAndUpdate(params.id, body, { new: true });
        if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        return NextResponse.json(brand);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const brand = await Brand.findByIdAndDelete(params.id);
        if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        return NextResponse.json({ message: "Brand deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
    }
}
