import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@components/admin/AdminLayout';

interface ProductForm {
  name: string;
  description: string;
  short_description: string;
  brand: string;
  category: string;
  price: string;
  sale_price: string;
  sku: string;
  stock: string;
  weight: string;
  dimensions: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  meta_title: string;
  meta_description: string;
  tags: string;
  images: File[];
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    short_description: '',
    brand: '',
    category: '',
    price: '',
    sale_price: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: '',
    status: 'active',
    featured: false,
    meta_title: '',
    meta_description: '',
    tags: '',
    images: [],
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const json = await res.json();
        if (json?.success && json.data) {
          const p = json.data;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            short_description: p.short_description || '',
            brand: p.brand || '',
            category: p.category || '',
            price: String(p.price ?? ''),
            sale_price: p.sale_price != null ? String(p.sale_price) : '',
            sku: p.sku || '',
            stock: String(p.quantity ?? ''),
            weight: p.weight || '',
            dimensions: p.dimensions || '',
            status: p.status || 'active',
            featured: !!p.featured,
            meta_title: p.meta_title || '',
            meta_description: p.meta_description || '',
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
            images: [],
          });
          const imgs: string[] = [];
          if (p?.gallery && Array.isArray(p.gallery)) {
            p.gallery.forEach((g: any) => imgs.push(g.original || g.thumbnail));
          } else if (p?.image?.original) {
            imgs.push(p.image.original);
          }
          setExistingImages(imgs);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      let uploadedUrls: string[] = [];
      if (formData.images.length > 0) {
        const fd = new FormData();
        formData.images.forEach((f) => fd.append('images', f));
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        const upJson = await up.json();
        if (upJson?.success && Array.isArray(upJson.urls)) {
          uploadedUrls = upJson.urls;
        }
      }

      const payload: any = {
        name: formData.name,
        description: formData.description,
        short_description: formData.short_description,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        sale_price: formData.sale_price || null,
        sku: formData.sku,
        stock: formData.stock,
        weight: formData.weight,
        dimensions: formData.dimensions,
        status: formData.status,
        featured: formData.featured,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        tags: formData.tags,
      };

      // If user uploaded new images, use them; otherwise, if existingImages changed, send them as images
      if (uploadedUrls.length > 0) {
        payload.images = uploadedUrls;
      } else if (existingImages.length > 0) {
        payload.images = existingImages;
      }

      const resp = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await resp.json();
      if (json?.success) {
        alert('Product updated successfully');
        router.push('/admin/products');
      } else {
        alert('Update failed');
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand *</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="brand" value={formData.brand} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="category" value={formData.category} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Regular Price (£) *</label>
              <input type="number" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Price (£)</label>
              <input type="number" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="sale_price" value={formData.sale_price} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock *</label>
              <input type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="stock" value={formData.stock} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="sku" value={formData.sku} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="weight" value={formData.weight} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dimensions</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="dimensions" value={formData.dimensions} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input id="featured" name="featured" type="checkbox" checked={formData.featured} onChange={handleInputChange} />
              <label htmlFor="featured" className="text-sm text-gray-900">Featured Product</label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea name="short_description" rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value={formData.short_description} onChange={handleInputChange} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Full Description</label>
              <textarea name="description" rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value={formData.description} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Product Images</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {existingImages.map((url, idx) => (
                <div key={`exist-${idx}`} className="relative">
                  <img src={url} className="h-24 w-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeExistingImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">×</button>
                </div>
              ))}
              {formData.images.map((file, idx) => (
                <div key={`new-${idx}`} className="relative">
                  <img src={URL.createObjectURL(file)} className="h-24 w-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeNewImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">×</button>
                </div>
              ))}
            </div>
            <div>
              <label className="inline-flex items-center px-4 py-2 border rounded-md text-sm cursor-pointer">
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                Upload Images
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meta Title</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="meta_title" value={formData.meta_title} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Meta Description</label>
              <textarea className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="meta_description" rows={2} value={formData.meta_description} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="perfume, fragrance, luxury" />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 border rounded-md" onClick={() => router.back()}>Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>
    </AdminLayout>
  );
}
