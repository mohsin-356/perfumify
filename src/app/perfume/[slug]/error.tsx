"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PerfumeDetailError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Perfume detail error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-gray-600">
        We couldn’t load this perfume. Please try again later or go back to the
        store.
      </p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Try again
        </button>
        <Link
          href="/products"
          className="inline-block border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          Back to products
        </Link>
      </div>
    </div>
  );
}
