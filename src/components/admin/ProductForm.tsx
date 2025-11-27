"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiUpload, FiX, FiLoader } from "react-icons/fi";
import CloudImage from "@/components/ui/CloudImage";

interface ProductFormProps {
    initialData?: any;
    brands: any[];
    categories: any[];
}

export default function ProductForm({ initialData, brands = [], categories = [] }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<any[]>(initialData?.images || []);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            brand: initialData?.brand?._id || initialData?.brand || "",
            category: initialData?.category?._id || initialData?.category || "",
            sku: initialData?.sku || "",
            weight: initialData?.weight || "",
            bestSeller: initialData?.bestSeller || false,
            newArrival: initialData?.newArrival || false,
            featured: initialData?.featured || false,
        },
    });

    // Auto-generate slug from name
    const watchName = watch("name");
    useEffect(() => {
        if (watchName && !initialData) {
            const slug = watchName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setValue("slug", slug);
        }
    }, [watchName, initialData, setValue]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const totalFiles = files.length;
            let uploadedCount = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Upload failed response:", data);
                    throw new Error(data?.error || "Image upload failed");
                }

                if (data.secure_url || data.url) {
                    setImages((prev) => [
                        ...prev,
                        {
                            url: data.secure_url || data.url,
                            public_id: data.public_id,
                            width: data.width,
                            height: data.height,
                        },
                    ]);
                    uploadedCount++;
                    setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
                }
            }

            console.log(`Successfully uploaded ${uploadedCount} image(s)`);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed. Please try again.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: any) => {
        if (images.length === 0) {
            alert("Please upload at least one product image");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: parseFloat(data.price),
                stock: parseInt(data.stock) || 0,
                brand: data.brand || null,
                category: data.category || null,
                sku: data.sku || undefined,
                weight: data.weight ? parseFloat(data.weight) : undefined,
                bestSeller: data.bestSeller ?? false,
                newArrival: data.newArrival ?? false,
                featured: data.featured ?? false,
                images,
            };

            const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to save product");
            }

            alert(initialData ? "Product updated successfully!" : "Product created successfully!");

            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            console.error("Save error:", error);
            alert(error.message || "Failed to save product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Basic Info */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g. Chanel No. 5"
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("slug", { required: "Slug is required" })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g. chanel-no-5"
                        />
                        {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message as string}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Product description..."
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Inventory</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Price (£) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", { required: "Price is required", min: 0 })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.price && <p className="text-red-500 text-xs">{errors.price.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            {...register("stock", { min: 0 })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">SKU</label>
                        <input
                            {...register("sku")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g. CH-001"
                        />
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Homepage Badges</h3>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("bestSeller")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        Best Seller
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("newArrival")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        New Arrival
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" {...register("featured")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        Featured
                    </label>
                </div>
            </div>

            {/* Classification */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Classification</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Brand</label>
                        <select
                            {...register("brand")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select Brand</option>
                            {brands && brands.length > 0 ? (
                                brands.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    No brands available
                                </option>
                            )}
                        </select>
                        {brands && brands.length === 0 && (
                            <p className="text-amber-600 text-xs">
                                No brands found. Please create a brand first.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            {...register("category")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories && categories.length > 0 ? (
                                categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    No categories available
                                </option>
                            )}
                        </select>
                        {categories && categories.length === 0 && (
                            <p className="text-amber-600 text-xs">
                                No categories found. Please create a category first.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Weight (g)</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register("weight")}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g. 100"
                        />
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Product Images <span className="text-red-500">*</span>
                </h3>

                <div className="flex flex-wrap gap-4">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-gray-200 group hover:border-indigo-400 transition-all"
                        >
                            <CloudImage
                                publicId={img.public_id}
                                alt={`Product ${idx + 1}`}
                                width={128}
                                height={128}
                                className="object-cover h-full w-full"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                Image {idx + 1}
                            </div>
                        </div>
                    ))}

                    <label className="h-32 w-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <FiLoader className="h-8 w-8 text-indigo-600 animate-spin" />
                                <span className="text-xs text-indigo-600 mt-2">{uploadProgress}%</span>
                            </div>
                        ) : (
                            <>
                                <FiUpload className="h-8 w-8 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-2">Upload</span>
                                <span className="text-xs text-gray-400">Multiple OK</span>
                            </>
                        )}
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>

                {images.length === 0 && (
                    <p className="text-amber-600 text-sm">
                        Please upload at least one product image
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                    {loading && <FiLoader className="animate-spin" />}
                    {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
}
