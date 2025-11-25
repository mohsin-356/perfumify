/**
 * Product Type Definitions for ROYAL Perfume Store
 */

export interface ProductImage {
  thumbnail: string;
  original: string;
  gallery?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PerfumeSize {
  ml: string;
  price: number;
  sku: string;
  inStock: boolean;
}

export interface ScentProfile {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
}

export interface PerfumeDetails {
  concentration: "EDP" | "EDT" | "Parfum" | "EDC";
  sizes: PerfumeSize[];
  gender: "Men" | "Women" | "Unisex";
  scentProfile: ScentProfile;
  fragranceFamily: string[];
  longevity: string;
  sillage: string;
  projection: string;
  seasons: string[];
  occasions: string[];
  timeOfDay: "Day" | "Night" | "Any";
  yearLaunched: number;
  perfumer: string;
}

export interface PerfumeProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  image: ProductImage;
  quantity: number;
  inStock: boolean;
  sku: string;
  categories: ProductCategory[];
  tags: string[];
  perfumeDetails: PerfumeDetails;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  giftWrappingAvailable: boolean;
  sampleAvailable: boolean;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}
