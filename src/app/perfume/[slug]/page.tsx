import { notFound } from "next/navigation";
import Image from "next/image";
import path from "path";
import fs from "fs";
import { cache } from "react";

// Cached server-side data fetch
const getProductBySlug = cache(async (slug: string) => {
  const filePath = path.join(process.cwd(), "public/api/products.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(fileContents) as any[];
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return product;
});

type PageProps = {
  params: { slug: string };
};

export default async function PerfumeDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const {
    name,
    description,
    image,
    price,
    sale_price,
    sku,
    category,
    tags,
    gallery,
  } = product;

  const displayPrice = sale_price ?? price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image */}
        <div className="flex-1">
          {image?.original ? (
            <Image
              src={image.original}
              alt={name}
              width={600}
              height={600}
              className="rounded-lg object-cover w-full h-auto"
              priority
            />
          ) : (
            <div className="bg-gray-200 rounded-lg w-full h-[600px] flex items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-2xl font-semibold">£{displayPrice}</p>
          {sale_price && (
            <p className="text-lg text-gray-400 line-through">£{price}</p>
          )}
          <p className="text-gray-700">{description}</p>
          {sku && <p className="text-sm text-gray-500">SKU: {sku}</p>}
          {category && (
            <p className="text-sm text-gray-500">
              Category: {typeof category === "object" ? category.name : category}
            </p>
          )}
          {tags && Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <span
                  key={tag.id || tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag.name || tag}
                </span>
              ))}
            </div>
          )}
          {/* Placeholder for Add to Cart/Quantity (client-side later) */}
          <div className="pt-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Add to Cart (placeholder)
            </button>
          </div>
        </div>
      </div>

      {/* Gallery thumbnails */}
      {gallery && Array.isArray(gallery) && gallery.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <div className="grid grid-cols-4 gap-4">
            {gallery.slice(0, 8).map((img: any, idx: number) => (
              <div key={idx} className="relative aspect-square">
                <Image
                  src={img?.thumbnail ?? img?.original ?? "/assets/placeholder/products/product-thumbnail.svg"}
                  alt={`${name} ${idx + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* More sections (description, shipping, reviews) can be added here */}
    </div>
  );
}
