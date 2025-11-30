import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import { sendNotificationEmail } from "@/lib/mail";
import { getIO } from "@/lib/socket";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null as any);
  const clientId = body?.clientId as string | undefined;
  const text = body?.message as string | undefined;
  const clientName = body?.name as string | undefined;
  const clientEmail = body?.email as string | undefined;
  if (!clientId || !text) {
    return NextResponse.json({ error: "clientId and message are required" }, { status: 400 });
  }
  await connectDB();
  // Do NOT use lean() here since we need _id for update
  let chat = await Chat.findOne({ clientId });
  if (!chat) {
    chat = await Chat.create({ clientId, clientName, clientEmail, messages: [{ sender: "client", text }], lastMessageAt: new Date() });
  } else {
    await Chat.updateOne({ _id: chat._id }, { $push: { messages: { sender: "client", text } }, $set: { lastMessageAt: new Date(), status: "open" } });
  }
  const fresh: any = await Chat.findOne({ clientId }).lean();
  const io = getIO();
  if (io && fresh) {
    io.to(String(fresh._id)).emit("message", { chatId: String(fresh._id), sender: "client", text, clientId });
    io.emit("chat:updated", { chatId: String(fresh._id) });
  }
  await sendNotificationEmail("New chat message", `Client ${clientEmail || clientId}: ${text}`);
  return NextResponse.json({ chatId: String(fresh?._id) }, { status: 200 });
}
