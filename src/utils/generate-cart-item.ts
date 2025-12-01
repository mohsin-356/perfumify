import isEmpty from "lodash/isEmpty";
export function generateCartItem(item: any, attributes: object) {
  if (!item) throw new Error("generateCartItem: item is undefined");
  // Accept either `id` or Mongo `_id`
  const baseId = (item as any).id ?? (item as any)._id ?? (item as any).slug;
  const { name, slug, price, sale_price } = item as any;

  // Resolve a safe image URL from various possible shapes
  const imgObj = (item as any).image;
  const imagesArr = Array.isArray((item as any).images) ? (item as any).images : [];
  const galleryArr = Array.isArray((item as any).gallery) ? (item as any).gallery : [];

  // Helper to pull string if value is string
  const asString = (v: any): string | undefined => (typeof v === "string" ? v : undefined);

  const firstGallery = galleryArr[0];
  const imageUrl =
    // Prefer explicit image.thumbnail / image.original
    (imgObj && (imgObj.thumbnail || imgObj.original)) ||
    // Cloudinary images array
    (imagesArr[0]?.url as string | undefined) ||
    // Some data models keep a direct string at image
    asString((item as any).image) ||
    // Gallery item could be string or object with urls
    asString(firstGallery) ||
    (firstGallery && (firstGallery.thumbnail || firstGallery.original)) ||
    // Final placeholder
    "/assets/placeholder/cart-item.svg";
  return {
    id: !isEmpty(attributes)
      ? `${baseId}.${Object.values(attributes).join(".")}`
      : baseId,
    name,
    slug,
    image: imageUrl,
    price: sale_price ? sale_price : price,
    attributes,
  };
}
