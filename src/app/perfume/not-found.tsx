import Link from "next/link";

export default function PerfumeNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold">Perfume not found</h1>
      <p className="text-gray-600">
        Sorry, we couldn’t find the perfume you’re looking for.
      </p>
      <Link href="/products" className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
        Back to products
      </Link>
    </div>
  );
}
