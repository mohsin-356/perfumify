import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import ChatRoom from "@/components/admin/ChatRoom";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getData(id: string) {
  await connectDB();
  const chat = await Chat.findById(id).lean();
  return chat ? JSON.parse(JSON.stringify(chat)) : null;
}

export default async function ChatDetailPage({ params }: { params: { id: string } }) {
  const chat = await getData(params.id);
  if (!chat) return <div className="text-gray-600">Chat not found.</div>;
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-3">
        <Link href="/admin/chats" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          ← Back
        </Link>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Chat with {chat.clientName || "Visitor"}</h2>
        <p className="text-gray-600 text-sm">{chat.clientEmail || "No email provided"}</p>
      </div>
      <ChatRoom chatId={chat._id} initial={chat.messages || []} />
    </div>
  );
}
