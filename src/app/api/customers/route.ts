import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET() {
    try {
        await connectDB();
        const customers = await Customer.find().sort({ createdAt: -1 });
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
