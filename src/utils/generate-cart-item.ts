import isEmpty from "lodash/isEmpty";

interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  [key: string]: unknown;
}
export function generateCartItem(item: any, attributes: object) {
  if (!item) throw new Error("generateCartItem: item is undefined");
  // Accept either `id` or Mongo `_id`
  const baseId = (item as any).id ?? (item as any)._id;
  const { name, slug, image, price, sale_price } = item as any;
  return {
    id: !isEmpty(attributes)
      ? `${baseId}.${Object.values(attributes).join(".")}`
      : baseId,
    name,
    slug,
    image: image.thumbnail,
    price: sale_price ? sale_price : price,
    attributes,
  };
}
