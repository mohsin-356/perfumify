import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";

const subSchema = z.object({
  email: z.string().email(),
});

export async function GET() {
  try {
    await connectDB();
    const subs = await Subscription.find().sort({ createdAt: -1 });
    return NextResponse.json(subs);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = subSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    await connectDB();
    const sub = await Subscription.findOneAndUpdate(
      { email: parsed.data.email.toLowerCase() },
      { email: parsed.data.email.toLowerCase() },
      { upsert: true, new: true }
    );
    return NextResponse.json(sub, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
