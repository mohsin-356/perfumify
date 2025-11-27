import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import CategoryForm from "@/components/admin/CategoryForm";

async function getCategories() {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
}

export default async function CreateCategoryPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h2>
            <CategoryForm categories={categories} />
        </div>
    );
}
