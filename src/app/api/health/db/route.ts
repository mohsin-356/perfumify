import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const state = mongoose.connection.readyState; // 1=connected
    const info = {
      connected: state === 1,
      host: (mongoose.connection as any)?.host,
      name: mongoose.connection?.name,
    };
    return NextResponse.json(info);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "DB error" }, { status: 500 });
  }
}
