'use client';

import { useCallback, useState } from 'react';

type UploadingImage = {
    file: File;
    previewUrl: string;
    status: 'idle' | 'uploading' | 'uploaded' | 'error';
    error?: string;
    cloudinary?: {
        url: string;
        public_id: string;
        width?: number;
        height?: number;
    };
};

export default function AdminProductsPage() {
    const [dragActive, setDragActive] = useState(false);
    const [images, setImages] = useState<UploadingImage[]>([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const onFilesSelected = useCallback((files: FileList | null) => {
        if (!files) return;
        const newImages: UploadingImage[] = Array.from(files).map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'idle',
        }));
        setImages((prev) => [...prev, ...newImages]);
    }, []);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        onFilesSelected(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            const next = [...prev];
            const removed = next[index];
            if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
            next.splice(index, 1);
            return next;
        });
    };

    const uploadAll = async () => {
        setImages((prev) =>
            prev.map((img) => ({
                ...img,
                status: img.status === 'uploaded' ? 'uploaded' : 'uploading',
                error: undefined,
            })),
        );

        const updated: UploadingImage[] = [];

        for (const img of images) {
            if (img.status === 'uploaded' && img.cloudinary) {
                updated.push(img);
                continue;
            }

            const formData = new FormData();
            formData.append('file', img.file);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(`Upload failed: ${res.status}`);
                }

                const data = await res.json();

                updated.push({
                    ...img,
                    status: 'uploaded',
                    cloudinary: {
                        url: data.secure_url ?? data.url,
                        public_id: data.public_id,
                        width: data.width,
                        height: data.height,
                    },
                });
            } catch (error: any) {
                console.error('Upload error', error);
                updated.push({
                    ...img,
                    status: 'error',
                    error: error?.message ?? 'Upload failed',
                });
            }
        }

        setImages(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage(null);

        if (!name || !slug || !price) {
            setMessage('Name, slug, and price are required.');
            return;
        }

        const uploadedImages = images
            .filter((img) => img.status === 'uploaded' && img.cloudinary)
            .map((img) => img.cloudinary!);

        if (!uploadedImages.length) {
            setMessage('Upload at least one product image.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? '', // or set in runtime config
                },
                body: JSON.stringify({
                    name,
                    slug,
                    price: Number(price),
                    description,
                    images: uploadedImages,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create product');
            }

            setMessage('Product created successfully.');
            setName('');
            setSlug('');
            setPrice('');
            setDescription('');
            setImages([]);
        } catch (error: any) {
            console.error('Create product error', error);
            setMessage(error?.message ?? 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto max-w-5xl bg-white shadow-sm rounded-lg p-6 space-y-6">
                <h1 className="text-2xl font-semibold">Admin – Create Product</h1>

                {message && (
                    <div className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-800">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                type="text"
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Slug</label>
                            <input
                                type="text"
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={price}
                                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Drag & Drop Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Product Images</label>

                        <div
                            className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-10 text-center transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <p className="text-sm text-slate-700">
                                Drag & drop images here or click to select
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="mt-4 text-sm"
                                onChange={(e) => onFilesSelected(e.target.files)}
                            />
                        </div>

                        {images.length > 0 && (
                            <div className="grid gap-4 md:grid-cols-4">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative rounded-md border bg-white overflow-hidden"
                                    >
                                        <img
                                            src={img.previewUrl}
                                            alt=""
                                            className="h-32 w-full object-cover"
                                        />
                                        <div className="p-2 flex items-center justify-between text-xs">
                                            <span
                                                className={
                                                    img.status === 'uploaded'
                                                        ? 'text-green-600'
                                                        : img.status === 'uploading'
                                                            ? 'text-blue-600'
                                                            : img.status === 'error'
                                                                ? 'text-red-600'
                                                                : 'text-slate-600'
                                                }
                                            >
                                                {img.status}
                                            </span>
                                            <button
                                                type="button"
                                                className="text-xs text-red-600 hover:underline"
                                                onClick={() => removeImage(idx)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        {img.error && (
                                            <div className="px-2 pb-2 text-[11px] text-red-600">
                                                {img.error}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            className="mt-2 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                            onClick={uploadAll}
                            disabled={images.length === 0}
                        >
                            Upload Images
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                        {submitting ? 'Saving...' : 'Save Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
