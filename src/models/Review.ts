import mongoose from "mongoose";

export interface IReview {
  _id?: string;
  product: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  rating: number; // 1-5
  comment: string;
  approved: boolean;
  status?: 'pending'|'approved'|'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: false },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
