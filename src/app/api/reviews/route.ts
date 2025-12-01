import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(20, parseInt(searchParams.get("limit") || "4", 10)));
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }
    const query = { product: productId, approved: true } as any;

    const skip = (page - 1) * limit;
    const [items, totalApproved] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(query),
    ]);

    const avgAgg = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), approved: true } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    const average = avgAgg?.[0]?.avg ? Number(avgAgg[0].avg.toFixed(2)) : 0;

    return NextResponse.json({
      reviews: items,
      count: totalApproved,
      average,
      page,
      limit,
      hasMore: page * limit < totalApproved,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { product, name, email, rating, comment } = body || {};
    if (!product || !name || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const review = await Review.create({ product, name, email, rating, comment, approved: false, status: 'pending' });
    return NextResponse.json({ success: true, review });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to submit review" }, { status: 500 });
  }
}
