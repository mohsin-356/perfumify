import mongoose from "mongoose";

export interface IBrand {
    _id?: string;
    name: string;
    slug: string;
    image?: {
        url: string;
        public_id: string;
    };
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        image: {
            url: String,
            public_id: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
export default Brand;
