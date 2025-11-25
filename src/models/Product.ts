import mongoose, { Schema, models, model } from 'mongoose';

const ImageSchema = new Schema(
  {
    id: { type: Number },
    thumbnail: { type: String },
    original: { type: String },
  },
  { _id: false }
);

const VariationSchema = new Schema(
  {
    id: { type: Number },
    value: String,
    attribute: {
      id: Number,
      name: String,
      slug: String,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String, required: true },
    description: String,
    short_description: String,
    slug: { type: String, required: true, unique: true },
    brand: String,
    sku: String,
    image: ImageSchema,
    gallery: [ImageSchema],
    price: { type: Number, required: true, default: 0 },
    sale_price: { type: Number, default: null },
    category: String,
    quantity: { type: Number, default: 0 },
    weight: String,
    dimensions: String,
    status: { type: String, default: 'active' },
    featured: { type: Boolean, default: false },
    meta_title: String,
    meta_description: String,
    tags: [String],
    variations: [VariationSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes for faster queries
ProductSchema.index({ slug: 1 }, { unique: true, sparse: true });
ProductSchema.index({ created_at: -1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1 });

export default (models.Product as mongoose.Model<any>) || model('Product', ProductSchema);
