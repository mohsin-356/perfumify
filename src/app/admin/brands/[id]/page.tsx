import { connectDB } from "@/lib/db";
import BrandForm from "@/components/admin/BrandForm";
import { notFound } from "next/navigation";

async function getData(id: string) {
    await connectDB();
    const Brand = (await import("@/models/Brand")).default;
    const brand = await Brand.findById(id).lean();
    if (!brand) return null;
    return JSON.parse(JSON.stringify(brand));
}

export default async function EditBrandPage({ params }: { params: { id: string } }) {
    const brand = await getData(params.id);

    if (!brand) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Brand</h2>
            <BrandForm initialData={brand} />
        </div>
    );
}
