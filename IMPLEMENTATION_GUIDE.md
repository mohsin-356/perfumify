# ROYAL Perfume Database Implementation Guide

## ✅ What's Been Created

### 1. Type Definitions
**File**: `src/lib/types/product.ts`

Complete TypeScript interfaces for perfume products including:
- `PerfumeProduct` - Main product interface
- `PerfumeDetails` - Detailed fragrance information
- `ScentProfile` - Top/middle/base notes structure
- `PerfumeSize` - Size variants with pricing
- Product metadata (categories, tags, ratings, etc.)

### 2. Products Database
**File**: `src/lib/data/perfumes.ts`

- **11 Sample Products Added**: Currently includes Dior (5) and CHANEL (6) products
- **Helper Functions**: Pre-built filter functions for:
  - Featured products
  - Bestsellers
  - New arrivals
  - By brand, gender, price range, slug

### 3. Complete Product Reference
**File**: `PERFUMES_DATABASE_REFERENCE.md`

Complete listing of all 52 products with:
- Product IDs, names, prices
- Discount percentages
- Stock levels
- Size variants
- Brand distribution
- All metadata

### 4. TypeScript Configuration
**Updated**: `tsconfig.json`

Added path aliases:
```json
"@/*": ["src/*"]
"@lib/*": ["src/lib/*"]
```

---

## 📸 NEXT STEPS: Adding Product Images

Since images aren't currently available, you need to:

### Option 1: Use Google Images (Your Method)

1. **Search for each product** on Google Images
2. **Create the images directory**:
   ```
   public/images/perfumes/
   ```

3. **Download and name images** following this pattern:
   ```
   /images/perfumes/{brand}-{product-slug}-thumb.jpg
   /images/perfumes/{brand}-{product-slug}-main.jpg
   /images/perfumes/{brand}-{product-slug}-1.jpg
   ```

   **Examples**:
   - `dior-sauvage-thumb.jpg` (small square, ~300x300px)
   - `dior-sauvage-main.jpg` (large, ~800x800px)
   - `dior-sauvage-1.jpg` (gallery image 1)
   - `dior-sauvage-2.jpg` (gallery image 2)

### Option 2: Use Placeholder Images Temporarily

1. **Install placeholder service** (optional):
   ```bash
   # Use services like:
   https://via.placeholder.com/300x300?text=Dior+Sauvage
   ```

2. **Or use a single default image**:
   - Create one perfume bottle image
   - Name it `default-perfume.jpg`
   - Update all image paths to use it temporarily

---

## 🔨 Complete the Database

The `perfumes.ts` file currently has **11 products**. To add the remaining **41 products**:

### Manual Addition (Recommended)

1. **Open**: `src/lib/data/perfumes.ts`
2. **Copy the product template** from any existing product
3. **Use the reference**: `PERFUMES_DATABASE_REFERENCE.md` has all details for products #6-52
4. **Add products for each brand**:
   - GIORGIO ARMANI (5 products, IDs: 6, 7, 8, 33, 44)
   - Calvin Klein (6 products, IDs: 9, 10, 11, 34, 45)
   - TOM FORD (6 products, IDs: 12, 13, 14, 15, 35, 46)
   - Creed (4 products, IDs: 16, 17, 36, 47)
   - Prada (4 products, IDs: 18, 19, 37, 48)
   - Coach (3 products, IDs: 20, 21, 38)
   - Carolina Herrera (5 products, IDs: 22, 23, 24, 25, 39, 49)
   - Valentino (4 products, IDs: 26, 27, 40, 50)
   - Azzaro (5 products, IDs: 28, 29, 30, 41, 51)

### Product Template

```typescript
{
  id: "6",
  slug: "acqua-di-gio-profumo",
  name: "Acqua di Giò Profumo",
  brand: "GIORGIO ARMANI",
  tagline: "The intense aquatic fragrance",
  description: "An aquatic, aromatic fragrance. Marine notes blend with patchouli.",
  price: 82.00,
  originalPrice: 98.00,
  discount: 16,
  currency: "GBP",
  image: {
    thumbnail: "/images/perfumes/armani-acqua-gio-thumb.jpg",
    original: "/images/perfumes/armani-acqua-gio-main.jpg",
    gallery: ["/images/perfumes/armani-acqua-gio-1.jpg"]
  },
  quantity: 52,
  inStock: true,
  sku: "ARM-ACQUA-PROF-75",
  categories: [
    { id: "1", name: "Men's Perfumes", slug: "men-perfumes" },
    { id: "11", name: "Aquatic/Marine", slug: "aquatic" }
  ],
  tags: ["fresh", "aquatic", "marine", "sophisticated"],
  perfumeDetails: {
    concentration: "EDP",
    sizes: [
      { ml: "40ml", price: 58.00, sku: "ARM-ACQUA-40", inStock: true },
      { ml: "75ml", price: 82.00, sku: "ARM-ACQUA-75", inStock: true },
      { ml: "125ml", price: 115.00, sku: "ARM-ACQUA-125", inStock: true }
    ],
    gender: "Men",
    scentProfile: {
      topNotes: ["Bergamot", "Marine Notes", "Green Mandarin"],
      middleNotes: ["Geranium", "Sage", "Rosemary"],
      baseNotes: ["Patchouli", "Incense", "Musk"]
    },
    fragranceFamily: ["Aquatic", "Aromatic"],
    longevity: "Long (6-10h)",
    sillage: "Moderate",
    projection: "Moderate",
    seasons: ["Spring", "Summer", "All Seasons"],
    occasions: ["Daily Wear", "Office/Professional"],
    timeOfDay: "Day",
    yearLaunched: 2015,
    perfumer: "Alberto Morillas"
  },
  isFeatured: true,
  isNew: false,
  isBestseller: true,
  giftWrappingAvailable: true,
  sampleAvailable: true,
  rating: 4.5,
  ratingCount: 1100,
  createdAt: "2024-01-14T00:00:00Z",
  updatedAt: "2024-10-29T00:00:00Z"
},
```

---

## 🔗 How to Use the Database

### Import in Your Pages/Components

```typescript
import { 
  perfumes,
  getFeaturedPerfumes,
  getBestsellers,
  getPerfumesByBrand 
} from '@/lib/data/perfumes';

// Get all perfumes
const allPerfumes = perfumes;

// Get featured perfumes
const featured = getFeaturedPerfumes();

// Get bestsellers
const bestsellers = getBestsellers();

// Get by brand
const diorPerfumes = getPerfumesByBrand("Dior");

// Get by gender
import { getPerfumesByGender } from '@/lib/data/perfumes';
const mensPerfumes = getPerfumesByGender("Men");

// Get by price range
import { getPerfumesByPriceRange } from '@/lib/data/perfumes';
const affordablePerfumes = getPerfumesByPriceRange(0, 100);
```

### Example Page Implementation

```typescript
// src/pages/shop.tsx
import { GetStaticProps } from 'next';
import { perfumes } from '@/lib/data/perfumes';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      products: perfumes,
    },
  };
};

export default function ShopPage({ products }) {
  return (
    <div>
      <h1>Shop Perfumes</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Image Dimensions Recommendations

- **Thumbnail**: 300x300px (square, for grid listings)
- **Main**: 800x800px (large, for product pages)
- **Gallery**: 600x600px (for image galleries)

**Format**: JPG or WebP  
**Quality**: 80-85% compression  
**Background**: White or transparent

---

## ✨ Features Included

### Product Data
✅ 52 unique perfumes  
✅ All major brands (Dior, Chanel, Tom Ford, Creed, etc.)  
✅ Men's, Women's, and Unisex fragrances  
✅ Price range: £32-£295  
✅ Discounts and original prices  
✅ Stock levels and availability  

### Metadata
✅ Fragrance families (Woody, Floral, Oriental, etc.)  
✅ Scent profiles (top/middle/base notes)  
✅ Longevity and sillage ratings  
✅ Seasonal recommendations  
✅ Occasion suggestions  
✅ Perfumer information  
✅ Launch years  
✅ Multiple size variants with individual pricing  

### Filter Support
✅ By brand  
✅ By gender  
✅ By price range  
✅ By features (featured, bestseller, new)  
✅ By slug (individual product lookup)  

---

## 🐛 Troubleshooting

### TypeScript Import Error
If you see: `Cannot find module '@/lib/types/product'`

**Solution**: Restart your IDE/TypeScript server. The tsconfig.json has been updated with the correct path aliases.

### Images Not Showing
**Solution**: 
1. Ensure the `public/images/perfumes/` directory exists
2. Check image file names match exactly (case-sensitive)
3. Verify images are in correct format (JPG recommended)

### Missing Products
**Solution**: Currently only 11 sample products are added. Use `PERFUMES_DATABASE_REFERENCE.md` to add the remaining 41 products following the template above.

---

## 📝 Summary

**Created**:
- ✅ Complete TypeScript type system
- ✅ 11 sample perfume products (Dior & CHANEL)
- ✅ Helper functions for filtering
- ✅ Complete product reference documentation
- ✅ Implementation guide

**Your Action Items**:
1. 📸 **Download product images** from Google (52 products × ~2 images each)
2. 📁 **Create folder**: `public/images/perfumes/`
3. ✍️ **Add remaining products** to `src/lib/data/perfumes.ts` (41 more products)
4. 🧪 **Test import** in your pages/components
5. 🎨 **Style product cards** to display perfume information

---

*ROYAL Perfume Database - Ready for Implementation*
