import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { z } from "zod";
import { sendCustomerEmail, sendNotificationEmail } from "@/lib/mail";
import crypto from "crypto";
import { env } from "@/lib/env";

const orderSchema = z.object({
    customer: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            zip: z.string(),
            country: z.string(),
        }),
    }),
    items: z.array(z.object({
        product: z.string(),
        quantity: z.number().min(1),
        price: z.number(),
        name: z.string(),
        image: z.string().optional(),
    })),
    total: z.number(),
    paymentInfo: z.object({
        method: z.string(),
        transactionId: z.string().optional(),
        status: z.string().optional(),
    }),
});

export async function GET() {
    try {
        await connectDB();
        const orders = await Order.find()
            .populate("customer")
            .sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // If DB URL is missing, short-circuit with a mocked order so UI can proceed in dev
        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const { customer: customerData, items, total, paymentInfo } = validation.data;

        if (!env.MONGODB_URI) {
            const trackingId = (crypto as any).randomUUID ? crypto.randomUUID() : `TRK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
            const mock = {
                _id: trackingId,
                trackingId,
                customer: { ...customerData },
                items,
                total,
                paymentInfo,
                shippingAddress: customerData.address,
                status: "Pending",
                statusHistory: [{ status: "Pending", date: new Date() }],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as any;
            // Best-effort emails
            try { await sendCustomerEmail(customerData.email, `Your Perfumify order is received – Tracking ID ${trackingId}`, `Hi ${customerData.name}, your order has been received. Tracking: ${trackingId}`); } catch {}
            try { await sendNotificationEmail("New Order Received (DEV mode)", `Tracking: ${trackingId}  Total: £${total}`); } catch {}
            return NextResponse.json(mock, { status: 201 });
        }

        await connectDB();

        // Find or create customer
        let customer = await Customer.findOne({ email: customerData.email });
        if (!customer) {
            customer = await Customer.create(customerData);
        } else {
            // Update customer info if needed
            customer.name = customerData.name;
            customer.phone = customerData.phone;
            customer.address = customerData.address;
            await customer.save();
        }

        // Generate tracking id
        const trackingId = (crypto as any).randomUUID ? crypto.randomUUID() : `TRK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

        // Sanitize items: include product only if valid ObjectId
        const sanitizedItems = items.map((it: any) => {
            const base: any = {
                quantity: it.quantity,
                price: it.price,
                name: it.name,
                image: it.image,
            };
            if (it.product && /^[a-f\d]{24}$/i.test(String(it.product))) {
                base.product = it.product;
            }
            return base;
        });

        const order = await Order.create({
            trackingId,
            customer: customer._id,
            items: sanitizedItems,
            total,
            paymentInfo,
            shippingAddress: customerData.address,
            status: "Pending",
            statusHistory: [{ status: "Pending", date: new Date() }],
        });

        // Add order to customer history
        customer.orders.push(order._id);
        await customer.save();

        // Send customer email (best-effort)
        const subject = `Your Perfumify order is received – Tracking ID ${trackingId}`;
        const text = `Hi ${customerData.name},\n\nThank you for your order.\n\nOrder total: £${total}\nTracking ID: ${trackingId}\nStatus: Pending\n\nKeep this Tracking ID to track your order or contact support.\n\n— Perfumify`;
        try { await sendCustomerEmail(customerData.email, subject, text); } catch {}
        try { await sendNotificationEmail("New Order Received", `Tracking: ${trackingId}  Total: £${total}`); } catch {}

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order create error:", error);
        const message = (error as any)?.message || "Failed to create order";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
