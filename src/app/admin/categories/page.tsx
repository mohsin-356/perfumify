import Link from "next/link";
import { connectDB } from "@/lib/db";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import CloudImage from "@/components/ui/CloudImage";

async function getCategories() {
    await connectDB();
    const Category = (await import("@/models/Category")).default;
    const categories = await Category.find().populate("parent").sort({ createdAt: -1 });
    return categories;
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                <Link
                    href="/admin/categories/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center transition-colors"
                >
                    <FiPlus className="mr-2" />
                    Add Category
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Parent</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-gray-100">
                                        {category.image?.public_id ? (
                                            <CloudImage
                                                publicId={category.image.public_id}
                                                alt={category.name}
                                                width={40}
                                                height={40}
                                                className="object-cover h-full w-full"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 text-gray-600">{category.parent?.name || "-"}</td>
                                <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link href={`/admin/categories/${category._id}`} className="text-gray-400 hover:text-blue-600 inline-block">
                                        <FiEdit2 className="h-5 w-5" />
                                    </Link>
                                    <button className="text-gray-400 hover:text-red-600 inline-block">
                                        <FiTrash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
