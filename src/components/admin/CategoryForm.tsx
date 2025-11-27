"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiUpload, FiX, FiLoader } from "react-icons/fi";
import CloudImage from "@/components/ui/CloudImage";

interface CategoryFormProps {
    initialData?: any;
    categories: any[];
}

export default function CategoryForm({ initialData, categories }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<any>(initialData?.image || null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {},
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Image upload failed");
            }

            if (data.secure_url || data.url) {
                setImage({ url: data.secure_url || data.url, public_id: data.public_id });
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload = { ...data, image, parent: data.parent || null };
            const url = initialData ? `/api/categories/${initialData._id}` : "/api/categories";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save category");

            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Men's Perfume"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Parent Category</label>
                    <select
                        {...register("parent")}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                        <option value="">None (Top Level)</option>
                        {categories.filter(c => c._id !== initialData?._id).map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Category description..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Image</label>
                    <div className="flex items-center gap-4">
                        {image ? (
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 group">
                                <CloudImage
                                    publicId={image.public_id}
                                    alt="Category Image"
                                    width={96}
                                    height={96}
                                    className="object-cover h-full w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <label className="h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                                {uploading ? (
                                    <FiLoader className="h-6 w-6 text-indigo-600 animate-spin" />
                                ) : (
                                    <>
                                        <FiUpload className="h-6 w-6 text-gray-400" />
                                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-4 px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
                >
                    {loading && <FiLoader className="animate-spin" />}
                    {loading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
                </button>
            </div>
        </form>
    );
}
