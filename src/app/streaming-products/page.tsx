import { Suspense, cache } from "react";
import Image from "next/image";
import ProductFeedLoader from "@components/ui/loaders/product-feed-loader";

export const revalidate = 60; // ISR for this route

type Product = {
  id: string | number;
  name: string;
  price: number;
  sale_price?: number;
  image?: { original?: string; thumbnail?: string } | string;
};

const getProducts = cache(async () => {
  const res = await fetch(`/api/store/products?page=1&limit=12`, {
    // Enable Next's caching on the request
    next: { revalidate: 60 },
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to load products");
  const json = await res.json();
  const data: Product[] = Array.isArray(json?.data) ? json.data : (json?.data?.data || []);
  return data;
});

async function ProductsServer() {
  const products = await getProducts();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => {
        const img = typeof p.image === "string" ? p.image : (p.image?.thumbnail || p.image?.original) || "/assets/placeholder.jpg";
        return (
          <div key={p.id} className="border rounded-md p-3 bg-white">
            <div className="relative w-full h-40 mb-2 bg-gray-100 overflow-hidden rounded">
              <Image src={img} alt={p.name} fill className="object-cover" />
            </div>
            <div className="text-sm font-semibold truncate">{p.name}</div>
            <div className="text-sm text-gray-700">
              £{(p.sale_price ?? p.price).toString()}
              {p.sale_price && <span className="ml-2 line-through text-gray-400">£{p.price}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function StreamingProductsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Streaming Products (Demo)</h1>
      <p className="text-gray-600">This route renders with Server Components + Suspense and streams results as they become ready.</p>
      <Suspense fallback={<ProductFeedLoader limit={12} uniqueKey="streaming-products" />}> 
        {/* Server component that awaits data */}
        <ProductsServer />
      </Suspense>
    </section>
  );
}
