import mongoose, { Schema } from 'mongoose';

export interface ProductImage {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
}

const ProductImageSchema = new Schema<ProductImage>(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false },
);
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shipping_policy: { type: String },
    refund_policy: { type: String },
    sale_price: { type: Number },
    price: { type: Number, required: true },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    category: {
      type: String, // Storing slug for easier filtering
      required: true,
    },
    categories: {
      type: [String], // Additional category slugs
      default: [],
    },
    brand: {
      type: String, // Storing slug for easier filtering
      required: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    weight: {
      type: Number,
    },
    tags: [String],
    variations: Object,

    // Badge flags
    bestSeller: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema>;

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export { Product };
