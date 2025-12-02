import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/date-utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderTimeline from "@/components/order/order-timeline";

async function getOrder(id: string) {
    await connectDB();
    const order = await Order.findById(id).populate("customer").lean();
    if (!order) return null;
    return JSON.parse(JSON.stringify(order));
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await getOrder(params.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order #{order._id.toString().slice(-6)}</h2>
                    <p className="text-gray-500">{formatDate(order.createdAt, 'datetime')}</p>
                </div>
                <OrderStatusSelect orderId={order._id} currentStatus={order.status} />
            </div>

            <OrderTimeline trackingId={(order as any)?.trackingId || (order as any)?._id} currentStatus={(order as any)?.status} history={(order as any)?.statusHistory} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                            {/* Image placeholder or actual image if stored in item snapshot */}
                                            <div className="h-full w-full bg-gray-200" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Total</span>
                            <span className="text-xl font-bold text-indigo-600">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-gray-900">{order.customer?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{order.customer?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{order.customer?.phone || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h3>
                        <div className="text-gray-600 text-sm space-y-1">
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
