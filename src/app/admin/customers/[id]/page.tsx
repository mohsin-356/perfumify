import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { notFound } from "next/navigation";
import { formatDate, formatMonthYear } from "@/lib/date-utils";
import Link from "next/link";

async function getCustomer(id: string) {
    await connectDB();
    const customer = await Customer.findById(id).populate("orders").lean();
    if (!customer) return null;
    return JSON.parse(JSON.stringify(customer));
}

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
    const customer = await getCustomer(params.id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                                <p className="text-sm text-gray-500">Customer since {formatMonthYear(customer.createdAt)}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{customer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{customer.phone || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
                        <div className="text-gray-600 text-sm space-y-1">
                            <p>{customer.address?.street}</p>
                            <p>{customer.address?.city}, {customer.address?.state} {customer.address?.zip}</p>
                            <p>{customer.address?.country}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order History</h3>
                        <div className="space-y-4">
                            {customer.orders?.length > 0 ? (
                                customer.orders.map((order: any) => (
                                    <Link href={`/admin/orders/${order._id}`} key={order._id} className="block border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xs text-gray-500">Order ID</span>
                                                <span className="font-mono text-sm text-gray-800">{order.orderId || '-'}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                            <div>
                                                <span className="text-gray-500">Date: </span>{formatDate(order.createdAt, 'short')}
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Total: </span>£{Number(order.total || 0).toFixed(2)}
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-gray-500">Items: </span>
                                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                                    <ul className="list-disc pl-5 mt-1">
                                                        {order.items.map((it: any, idx: number) => (
                                                            <li key={idx} className="text-gray-700">{it.name} × {it.quantity}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-gray-500">Delivery Address: </span>
                                                <span>
                                                    {order.shippingAddress?.street}, {order.shippingAddress?.city} {order.shippingAddress?.zip}, {order.shippingAddress?.country}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No orders yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
