"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import CloudImage from "@/components/ui/CloudImage";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { formatPrice } from "@/lib/currency";

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images?: Array<{ url: string; public_id: string }>;
    brand?: { _id: string; name: string; slug: string };
    category?: { _id: string; name: string; slug: string };
}

interface ProductsListClientProps {
    initialProducts: Product[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export default function ProductsListClient({
    initialProducts,
    totalPages,
    currentPage,
    total,
}: ProductsListClientProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; product?: Product }>({
        show: false,
    });
    const [searchQuery, setSearchQuery] = useState("");

    const handleDelete = async (productId: string) => {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete product");

            // Optimistic UI update
            setProducts((prev) => prev.filter((p) => p._id !== productId));
            setDeleteDialog({ show: false });

            // Show success message
            alert("Product deleted successfully!");

            // Refresh to get updated data
            router.refresh();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product. Please try again.");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/admin/products?search=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push("/admin/products");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Manage your product inventory ({total} total)
                    </p>
                </div>
                <Link
                    href="/admin/products/create"
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium"
                >
                    <FiPlus className="h-5 w-5" />
                    Add Product
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products by name or description..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Brand
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {product.images?.[0]?.public_id ? (
                                                    <CloudImage
                                                        publicId={product.images[0].public_id}
                                                        alt={product.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover h-full w-full"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                                <p className="text-sm text-gray-500 truncate">/{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {product.brand?.name || <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {product.category?.name || <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 10
                                                ? "bg-green-100 text-green-800"
                                                : product.stock > 0
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="View on website"
                                            >
                                                <FiEye className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/products/${product._id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit product"
                                            >
                                                <FiEdit2 className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteDialog({ show: true, product })}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete product"
                                            >
                                                <FiTrash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="text-gray-500">No products found.</p>
                                        <Link
                                            href="/admin/products/create"
                                            className="text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block"
                                        >
                                            Create your first product
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="border-t border-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/admin/products?page=${page}`}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${page === currentPage
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteDialog.show && deleteDialog.product && (
                <DeleteConfirmDialog
                    productName={deleteDialog.product.name}
                    productId={deleteDialog.product._id}
                    onClose={() => setDeleteDialog({ show: false })}
                    onConfirm={() => handleDelete(deleteDialog.product!._id)}
                />
            )}
        </div>
    );
}
