import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });
    return NextResponse.json(leads);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    await connectDB();
    const lead = await Lead.create(parsed.data);
    return NextResponse.json(lead, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
