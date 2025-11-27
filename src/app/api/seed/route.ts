import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import Category from "@/models/Category";

const BRANDS = [
    "Azzaro",
    "Carolina Herrera",
    "Calvin Klein",
    "CHANEL",
    "Creed",
    "Dior",
    "GIORGIO ARMANI",
    "Prada",
    "TOM FORD",
    "Valentino"
];

const CATEGORIES = ["Men", "Women"];

export async function GET() {
    try {
        await connectDB();

        // Seed Brands
        const createdBrands = [];
        for (const name of BRANDS) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            const existing = await Brand.findOne({ slug });
            if (!existing) {
                const brand = await Brand.create({
                    name,
                    slug,
                    description: `Luxury fragrances by ${name}`,
                    image: { url: "", public_id: "" } // Placeholder
                });
                createdBrands.push(brand.name);
            }
        }

        // Seed Categories
        const createdCategories = [];
        for (const name of CATEGORIES) {
            const slug = name.toLowerCase();
            const existing = await Category.findOne({ slug });
            if (!existing) {
                const category = await Category.create({
                    name,
                    slug,
                    description: `Fragrances for ${name}`,
                    image: { url: "", public_id: "" } // Placeholder
                });
                createdCategories.push(category.name);
            }
        }

        return NextResponse.json({
            message: "Seeding complete",
            brands: createdBrands,
            categories: createdCategories
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
