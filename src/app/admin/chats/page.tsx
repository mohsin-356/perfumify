import { connectDB } from "@/lib/db";
import { Chat } from "@/models/Chat";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();
  const chats = await Chat.find()
    .sort({ lastMessageAt: -1 })
    .select("clientName clientEmail status lastMessageAt")
    .lean();
  return JSON.parse(JSON.stringify(chats));
}

export default async function ChatsPage() {
  const chats = await getData();
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
        <p className="text-gray-600 text-sm mt-1">Incoming customer chats and their latest activity.</p>
      </div>
      <div className="bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last message</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c: any) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.clientName || "Visitor"}</td>
                <td className="p-3">{c.clientEmail || "-"}</td>
                <td className="p-3 capitalize">{c.status}</td>
                <td className="p-3">{new Date(c.lastMessageAt).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/chats/${c._id}`} className="text-indigo-600 hover:underline">Open</Link>
                </td>
              </tr>
            ))}
            {chats.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>No chats yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
