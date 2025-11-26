export default function PerfumeDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image skeleton */}
        <div className="flex-1">
          <div className="bg-gray-200 rounded-lg w-full h-[600px] animate-pulse" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-12 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>

      {/* Gallery skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
