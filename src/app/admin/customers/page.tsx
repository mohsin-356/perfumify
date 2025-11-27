import Link from "next/link";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { FiEye } from "react-icons/fi";
import { formatDate } from "@/lib/date-utils";

async function getCustomers() {
    await connectDB();
    const customers = await Customer.find().sort({ createdAt: -1 });
    return customers;
}

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
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
