import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ProductImage {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
}

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: ProductImage[];
  // add any other fields you already use: category, brand, etc.
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

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Product =
  (models.Product as mongoose.Model<ProductDocument>) ||
  model<ProductDocument>('Product', ProductSchema);
