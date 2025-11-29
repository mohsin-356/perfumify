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
    price: { type: Number, required: true },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    category: {
      type: String, // Storing slug for easier filtering
      required: true,
    },
    brand: {
      type: String, // Storing slug for easier filtering
      required: true,
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
