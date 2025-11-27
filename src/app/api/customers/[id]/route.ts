import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const customer = await Customer.findById(params.id).populate("orders");
        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}
