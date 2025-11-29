import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../lib/mongodb";
import { Product } from "../../../models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET /api/products/[slug]
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ message: "Missing slug" });
  }

  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean<any>();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure gallery/image shape expected by front-end
    const withGallery = {
      ...product,
      gallery: product.gallery?.length
        ? product.gallery
        : product.images?.map((img: any, idx: number) => ({
            id: idx + 1,
            thumbnail: img.url,
            original: img.url,
          })) || [],
    };

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).json(withGallery);
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Server error" });
  }
}
