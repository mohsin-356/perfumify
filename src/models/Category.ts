import mongoose from "mongoose";

export interface ICategory {
    _id?: string;
    name: string;
    slug: string;
    image?: {
        url: string;
        public_id: string;
    };
    description?: string;
    parent?: string | ICategory | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const CategorySchema = new mongoose.Schema(
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
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
    },
    { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
