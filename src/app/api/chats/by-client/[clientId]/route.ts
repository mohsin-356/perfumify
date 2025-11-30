import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { clientId: string } }) {
  await connectDB();
  const chat = await Chat.findOne({ clientId: params.clientId }).lean();
  if (!chat) return NextResponse.json({ found: false }, { status: 200 });
  return NextResponse.json({ found: true, chatId: String(chat._id), messages: chat.messages || [] }, { status: 200 });
}
