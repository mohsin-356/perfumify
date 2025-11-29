import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductDetailProvider } from "@contexts/product-detail.context";
import ProductGallery from "@components/product/detail/product-gallery";
import ProductInfo from "@components/product/detail/product-info";
import VariantSelector from "@components/product/detail/variant-selector";
import QuantitySelector from "@components/product/detail/quantity-selector";
import AddToCart from "@components/product/detail/add-to-cart";
import ProductTabs from "@components/product/detail/product-tabs";
import TrustBadges from "@components/product/detail/trust-badges";
import RelatedProducts from "@components/product/detail/related-products";
import RecentlyViewed from "@components/product/detail/recently-viewed";
import ReviewList from "@components/product/detail/review-list";
import ReviewForm from "@components/product/detail/review-form";
import Breadcrumb from "@components/common/breadcrumb";

// Force dynamic rendering since we are fetching from DB
export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  await connectDB();

  // Fetch product and populate brand/category if needed (though we store slugs now)
  // We might need to fetch brand/category details if we want to show more than just the slug/name
  const product = await Product.findOne({ slug }).lean();

  if (!product) return null;

  // Transform _id to string for serialization
  return JSON.parse(JSON.stringify(product));
}

type PageProps = {
  params: { slug: string };
};

export default async function PerfumeDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  console.log("Fetched Product:", JSON.stringify(product, null, 2));

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailProvider product={product}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-2">/</span>
          <a href="/search" className="hover:text-black">All Products</a>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Gallery */}
          <div className="w-full lg:w-3/5">
            <ProductGallery />
          </div>

          {/* Right Column: Info & Actions */}
          <div className="w-full lg:w-2/5 space-y-8 sticky top-24 self-start">
            <ProductInfo />
            <VariantSelector />
            <QuantitySelector />
            <AddToCart />
            <TrustBadges />
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="mt-16">
          <ProductTabs />
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ReviewList />
          <ReviewForm />
        </div>

        <RelatedProducts />
        <RecentlyViewed />
      </div>
    </ProductDetailProvider>
  );
}
