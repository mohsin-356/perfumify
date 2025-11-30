import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const chat: any = await Chat.findById(params.id).lean();
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ messages: chat.messages || [] }, { status: 200 });
}
