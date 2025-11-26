import BrandCardLoader from "@components/ui/loaders/brand-card-loader";
import ProductFeedLoader from "@components/ui/loaders/product-feed-loader";

export default function RootLoading() {
  return (
    <div className="pt-8 pb-12">
      <div className="w-full h-[280px] md:h-[340px] lg:h-[400px] bg-gray-200 animate-pulse" />

      <div className="mt-8 md:mt-10 lg:mt-12 mb-11 md:mb-12 xl:mb-14">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <BrandCardLoader key={idx} />
          ))}
        </div>
      </div>

      <div className="space-y-10">
        <ProductFeedLoader limit={8} uniqueKey="loading-best-sellers" />
        <ProductFeedLoader limit={8} uniqueKey="loading-new-arrivals" />
      </div>
    </div>
  );
}
