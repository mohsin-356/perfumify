import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
            default: "Perfumify",
        },
        currency: {
            type: String,
            default: "GBP",
        },
        logo: {
            url: String,
            public_id: String,
        },
        smtp: {
            host: String,
            port: Number,
            user: String,
            pass: String,
            secure: Boolean,
        },
    },
    { timestamps: true }
);

// Ensure only one settings document exists usually, but model doesn't enforce singleton strictly without logic
export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
