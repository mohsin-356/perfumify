import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import DashboardCharts from "@/components/admin/DashboardCharts";
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";
import { formatPrice } from "@/lib/currency";

export const dynamic = "force-dynamic";

async function getStats() {
    await connectDB();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const customerCount = await Customer.countDocuments();

    // Calculate total sales
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    return {
        productCount,
        orderCount,
        customerCount,
        totalSales,
    };
}

export default async function DashboardPage() {
    const stats = await getStats();

    const statCards = [
        { name: "Total Revenue", value: formatPrice(stats.totalSales), icon: FiDollarSign, color: "bg-green-100 text-green-600" },
        { name: "Total Orders", value: stats.orderCount, icon: FiShoppingBag, color: "bg-blue-100 text-blue-600" },
        { name: "Total Products", value: stats.productCount, icon: FiBox, color: "bg-purple-100 text-purple-600" },
        { name: "Total Customers", value: stats.customerCount, icon: FiUsers, color: "bg-orange-100 text-orange-600" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-500">Welcome back to your store overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className={`p-4 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <DashboardCharts />
        </div>
    );
}
