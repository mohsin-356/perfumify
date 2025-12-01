import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { sendCustomerEmail } from "@/lib/mail";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const isObjectId = /^[a-f\d]{24}$/i.test(params.id);
        const order = isObjectId
            ? await Order.findById(params.id).populate("customer")
            : await Order.findOne({ trackingId: params.id }).populate("customer");
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await req.json();
        const order = await Order.findById(params.id).populate("customer");
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        let emailText = "";
        if (body.status && body.status !== order.status) {
            order.status = body.status;
            order.statusHistory = Array.isArray(order.statusHistory)
                ? [...order.statusHistory, { status: body.status, date: new Date() }]
                : [{ status: body.status, date: new Date() }];
            emailText = `Your order (${order.trackingId || order._id}) status is now: ${body.status}`;
        }
        // Merge other updatable fields cautiously if needed
        await order.save();
        // Notify customer on status change
        if (emailText && (order as any).customer?.email) {
            try { await sendCustomerEmail((order as any).customer.email, "Order status updated", emailText); } catch {}
        }
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const order = await Order.findByIdAndDelete(params.id);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json({ message: "Order deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
