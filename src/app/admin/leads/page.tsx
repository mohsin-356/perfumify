import { connectDB } from "@/lib/db";
import Lead from "@/models/Lead";
import { formatDate } from "@/lib/date-utils";
import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const AdminAutoRefresh = nextDynamic(() => import("@/components/admin/AdminAutoRefresh"), { ssr: false });

async function getLeads() {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(leads));
}

export default async function LeadsPage() {
  const leads = await getLeads();
  return (
    <div className="space-y-6">
      <AdminAutoRefresh intervalMs={8000} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead: any) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                <td className="px-6 py-4 text-gray-600">{lead.phone || "-"}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xl truncate" title={lead.message}>{lead.message || "-"}</td>
                <td className="px-6 py-4 text-gray-600">{formatDate(lead.createdAt, 'short')}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
