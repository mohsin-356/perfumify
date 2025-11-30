import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { getIO } from "@/lib/socket";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const adminToken = req.headers.get("x-admin-token");
  const hasAuthCookie = (req.headers.get("cookie") || "").includes("auth_token=");
  if (env.ADMIN_SECRET_TOKEN && adminToken !== env.ADMIN_SECRET_TOKEN && !hasAuthCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null as any);
  const text = body?.message as string | undefined;
  if (!text) return NextResponse.json({ error: "message is required" }, { status: 400 });
  await connectDB();
  const chat = await Chat.findById(params.id);
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  chat.messages.push({ sender: "admin", text, createdAt: new Date() } as any);
  chat.lastMessageAt = new Date();
  await chat.save();
  const io = getIO();
  if (io) {
    io.to(String(chat._id)).emit("message", { chatId: String(chat._id), sender: "admin", text });
    io.emit("chat:updated", { chatId: String(chat._id) });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
