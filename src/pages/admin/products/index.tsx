import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@components/admin/AdminLayout';

// Inline SVG components
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  sale_price?: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  created_at: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let t = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(t);
  }, [page, statusFilter, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: searchTerm,
        status: statusFilter,
      });
      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        const transformedProducts = result.data.map((product: any) => ({
          id: String(product._id || product.id),
          name: product.name,
          brand: product.brand,
          price: product.price,
          sale_price: product.sale_price,
          stock: product.quantity,
          status: product.status,
          image: product.image?.original || '/assets/placeholder.jpg',
          created_at: product.created_at ? product.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        }));

        setProducts(transformedProducts);
        setTotal(result?.paginatorInfo?.total || transformedProducts.length);
        setHasNext(!!result?.paginatorInfo?.hasNextPage);
      } else {
        setProducts([]);
        setTotal(0);
        setHasNext(false);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setTotal(0);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setProducts(products.filter(p => p.id !== id));
          alert('Product deleted successfully!');
        } else {
          alert('Error deleting product: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredProducts = products;

  if (loading) {
    return (
      <AdminLayout title="Products">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your perfume products, inventory, and pricing
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/admin/products/add">
              <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Product
              </a>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Products
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Products ({total})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm font-medium text-gray-900">
                            £{product.sale_price || product.price}
                          </p>
                          {product.sale_price && (
                            <p className="ml-2 text-sm text-gray-500 line-through">
                              £{product.price}
                            </p>
                          )}
                          <p className="ml-4 text-sm text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/products/${product.id}`}>
                        <a className="text-indigo-600 hover:text-indigo-900">
                          <EyeIcon className="h-5 w-5" />
                        </a>
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <a className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </a>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">Page {page} • Total {total}</div>
            <div className="space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext || loading}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
