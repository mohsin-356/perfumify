import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    let action = 'approve';
    try {
      const body = await req.json();
      if (body && typeof body.action === 'string') action = body.action;
    } catch {}

    let update: any = {};
    if (action === 'approve') update = { approved: true, status: 'approved' };
    else if (action === 'reject') update = { approved: false, status: 'rejected' };
    else if (action === 'draft') update = { approved: false, status: 'pending' };
    else update = { approved: true, status: 'approved' };

    const updated = await Review.findByIdAndUpdate(params.id, update, { new: true });
    if (!updated) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json({ success: true, review: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Review.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete review" }, { status: 500 });
  }
}
