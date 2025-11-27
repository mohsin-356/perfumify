import { connectDB } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

async function getData(id: string) {
    await connectDB();
    const Category = (await import("@/models/Category")).default;
    const category = await Category.findById(id).lean();
    if (!category) return null;
    return JSON.parse(JSON.stringify(category));
}

async function getCategories() {
    await connectDB();
    const Category = (await import("@/models/Category")).default;
    const categories = await Category.find().lean();
    return JSON.parse(JSON.stringify(categories));
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const [category, categories] = await Promise.all([
        getData(params.id),
        getCategories()
    ]);

    if (!category) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Category</h2>
            <CategoryForm initialData={category} categories={categories} />
        </div>
    );
}
