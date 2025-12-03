import Link from "next/link";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { FiEye } from "react-icons/fi";
import { formatDate } from "@/lib/date-utils";
import { formatPrice } from "@/lib/currency";
import nextDynamic from "next/dynamic";
// Ensure Customer model is registered before populate
import "@/models/Customer";
import CopyButton from "@/components/admin/CopyButton";

export const dynamic = "force-dynamic";

const AdminAutoRefresh = nextDynamic(() => import("@/components/admin/AdminAutoRefresh"), { ssr: false });

async function getOrders() {
    await connectDB();
    const orders = await Order.find().populate("customer").sort({ createdAt: -1 });
    return orders;
}

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-6">
            <AdminAutoRefresh intervalMs={8000} />
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Tracking</th>
                            <th className="px-6 py-3">Copy</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-gray-700">{order.orderId || <span className="text-gray-400">—</span>}</td>
                                <td className="px-6 py-4">{order.trackingId ? (
                                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-mono">{String(order.trackingId).slice(0, 10)}…</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {order.orderId ? (
                                        <CopyButton text={String(order.orderId)} />
                                    ) : (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.customer?.name || "Guest"}</td>
                                <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt, 'short')}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{formatPrice(order.total)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                            order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                                                "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/orders/${order._id}`} className="text-gray-400 hover:text-indigo-600 inline-block">
                                        <FiEye className="h-5 w-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
