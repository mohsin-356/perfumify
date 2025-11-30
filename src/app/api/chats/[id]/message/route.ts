import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { getIO } from "@/lib/socket";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null as any);
  const text = body?.message as string | undefined;
  const clientId = body?.clientId as string | undefined;
  if (!text || !clientId) return NextResponse.json({ error: "message and clientId are required" }, { status: 400 });
  await connectDB();
  const chat = await Chat.findById(params.id);
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (chat.clientId !== clientId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  chat.messages.push({ sender: "client", text, createdAt: new Date() } as any);
  chat.lastMessageAt = new Date();
  await chat.save();
  const io = getIO();
  if (io) {
    io.to(String(chat._id)).emit("message", { chatId: String(chat._id), sender: "client", text, clientId });
    io.emit("chat:updated", { chatId: String(chat._id) });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
