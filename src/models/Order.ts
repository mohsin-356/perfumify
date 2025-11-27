import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                name: String, // Snapshot of product name
                image: String, // Snapshot of product image
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
        paymentInfo: {
            method: String, // e.g., 'Stripe', 'PayPal', 'COD'
            transactionId: String,
            status: String,
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
