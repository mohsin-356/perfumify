import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import dynamic from "next/dynamic";

const AdminAutoRefresh = dynamic(() => import("@/components/admin/AdminAutoRefresh"), { ssr: false });

async function getSubs() {
  await connectDB();
  const subs = await Subscription.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(subs));
}

export default async function SubscriptionsPage() {
  const subs = await getSubs();
  return (
    <div className="space-y-6">
      <AdminAutoRefresh intervalMs={8000} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Subscriptions</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subs.map((s: any) => (
              <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900">{s.email}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-gray-500">No subscriptions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
