"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiBox,
    FiGrid,
    FiTag,
    FiShoppingBag,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiMessageSquare,
    FiStar,
    FiUserPlus,
    FiMail,
} from "react-icons/fi";

const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
    { name: "Products", href: "/admin/products", icon: FiBox },
    { name: "Categories", href: "/admin/categories", icon: FiGrid },
    { name: "Brands", href: "/admin/brands", icon: FiTag },
    { name: "Orders", href: "/admin/orders", icon: FiShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: FiUsers },
    { name: "Leads", href: "/admin/leads", icon: FiUserPlus },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: FiMail },
    { name: "Reviews", href: "/admin/reviews", icon: FiStar },
    { name: "Chats", href: "/admin/chats", icon: FiMessageSquare },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
];

export default function AdminSidebar() {
    const pathname = usePathname() ?? "";

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Perfumify Admin</h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-gray-900" : "text-gray-400"}`} />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
