import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import ProductsListClient from "@/components/admin/ProductsListClient";

export const dynamic = "force-dynamic";

async function getProducts(searchParams: { page?: string; search?: string }) {
    try {
        await connectDB();
        const page = parseInt(searchParams.page || "1");
        const limit = 20;
        const skip = (page - 1) * limit;
        const search = searchParams.search || "";

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(query)
            .populate("category", "name slug")
            .populate("brand", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(query);

        return {
            products: JSON.parse(JSON.stringify(products)),
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
            total: 0,
            totalPages: 0,
            currentPage: 1,
        };
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string };
}) {
    const { products, total, totalPages, currentPage } = await getProducts(searchParams);

    return (
        <ProductsListClient
            initialProducts={products}
            totalPages={totalPages}
            currentPage={currentPage}
            total={total}
        />
    );
}
