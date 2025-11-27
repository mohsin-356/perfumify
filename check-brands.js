const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/perfumify";

const BrandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

async function checkBrands() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const brands = await Brand.find({}).sort({ name: 1 });
        console.log(`Found ${brands.length} brands:`);

        const seen = new Set();
        const duplicates = [];

        brands.forEach(b => {
            console.log(`- ${b.name} (${b.slug}) [${b._id}]`);
            if (seen.has(b.slug)) {
                duplicates.push(b.slug);
            }
            seen.add(b.slug);
        });

        if (duplicates.length > 0) {
            console.log("\nDUPLICATES FOUND:", duplicates);
        } else {
            console.log("\nNo duplicates found based on slug.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkBrands();
