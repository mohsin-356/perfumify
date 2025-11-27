import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
