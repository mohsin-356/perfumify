import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const adminToken = req.headers.get("x-admin-token");
  if (env.ADMIN_SECRET_TOKEN && adminToken !== env.ADMIN_SECRET_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const chats = await Chat.find().sort({ lastMessageAt: -1 }).select("clientEmail clientName status lastMessageAt").lean();
  return NextResponse.json({ chats }, { status: 200 });
}
