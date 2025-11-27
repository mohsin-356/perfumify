import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

async function getData(id: string) {
    try {
        await connectDB();
        const product = await Product.findById(id).lean();
        const brands = await Brand.find().sort({ name: 1 }).lean();
        const categories = await Category.find().sort({ name: 1 }).lean();

        if (!product) return null;

        return {
            product: JSON.parse(JSON.stringify(product)),
            brands: JSON.parse(JSON.stringify(brands)),
            categories: JSON.parse(JSON.stringify(categories)),
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const data = await getData(params.id);

    if (!data) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                <p className="text-gray-600 text-sm mt-1">
                    Update the product details below. Fields marked with * are required.
                </p>
            </div>
            <ProductForm
                initialData={data.product}
                brands={data.brands}
                categories={data.categories}
            />
        </div>
    );
}
