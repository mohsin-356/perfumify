import BrandForm from "@/components/admin/BrandForm";

export default function CreateBrandPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Brand</h2>
            <BrandForm />
        </div>
    );
}
