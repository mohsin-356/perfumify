import Link from "next/link";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import { FiEye, FiSearch } from "react-icons/fi";
import { formatDate } from "@/lib/date-utils";

async function getCustomers(filterOrderId?: string | null) {
    await connectDB();
    if (filterOrderId) {
        const order = await Order.findOne({ orderId: filterOrderId }).populate("customer");
        if (!order?.customer) return [] as any[];
        return [order.customer];
    }
    const customers = await Customer.find().sort({ createdAt: -1 });
    return customers;
}

export default async function CustomersPage({ searchParams }: { searchParams?: { [key: string]: string } }) {
    const orderId = searchParams?.orderId || null;
    const customers = await getCustomers(orderId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
                <form className="ml-auto flex items-center gap-2" action="/admin/customers" method="get">
                    <input
                        type="text"
                        name="orderId"
                        placeholder="Search by Order ID"
                        defaultValue={orderId ?? ""}
                        className="h-9 px-3 border border-gray-300 rounded-md text-sm"
                    />
                    <button className="h-9 px-3 rounded-md bg-gray-800 text-white text-sm flex items-center gap-1">
                        <FiSearch className="h-4 w-4" />
                        Search
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((customer) => (
                            <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4 text-gray-600">{customer.phone || "-"}</td>
                                <td className="px-6 py-4 text-gray-600">{formatDate(customer.createdAt, 'short')}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/customers/${customer._id}`} className="text-gray-400 hover:text-indigo-600 inline-block">
                                        <FiEye className="h-5 w-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
