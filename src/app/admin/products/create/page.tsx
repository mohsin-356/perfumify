import { connectDB } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

async function getData() {
    try {
        await connectDB();
        const Brand = (await import("@/models/Brand")).default;
        const Category = (await import("@/models/Category")).default;
        const brands = await Brand.find().sort({ name: 1 }).lean();
        const categories = await Category.find().sort({ name: 1 }).lean();
        return {
            brands: JSON.parse(JSON.stringify(brands)),
            categories: JSON.parse(JSON.stringify(categories))
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            brands: [],
            categories: []
        };
    }
}

export default async function CreateProductPage() {
    const { brands, categories } = await getData();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                <p className="text-gray-600 text-sm mt-1">
                    Fill in the product details below. Fields marked with * are required.
                </p>
            </div>
            <ProductForm brands={brands} categories={categories} />
        </div>
    );
}
