/**
 * Perfume Product Type Definition
 * Extends the existing Product interface for perfume-specific fields
 */

export interface PerfumeProduct {
  // Basic Information
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  
  // Pricing
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  
  // Images
  image: {
    thumbnail: string;
    original: string;
    gallery?: string[];
  };
  
  // Stock & Inventory
  quantity: number;
  inStock: boolean;
  sku: string;
  
  // Categories
  categories: Array<{
    id: number | string;
    name: string;
    slug: string;
  }>;
  
  // Tags
  tags: string[];
  
  // ========== PERFUME-SPECIFIC FIELDS ==========
  
  perfumeDetails: {
    // Concentration Type
    concentration: 'Parfum' | 'EDP' | 'EDT' | 'EDC' | 'Oil';
    
    // Available Sizes with prices
    sizes: Array<{
      ml: string;
      price: number;
      sku: string;
      inStock: boolean;
    }>;
    
    // Gender Classification
    gender: 'Men' | 'Women' | 'Unisex';
    
    // Scent Profile - The Heart of Perfume
    scentProfile: {
      topNotes: string[];      // First 15 minutes
      middleNotes: string[];   // Heart - 30 min to 2 hours
      baseNotes: string[];     // Dry down - 2+ hours
    };
    
    // Fragrance Classification
    fragranceFamily: string[];  // Can belong to multiple families
    
    // Performance Characteristics
    longevity: 'Short (1-3h)' | 'Moderate (3-6h)' | 'Long (6-10h)' | 'Very Long (10+h)';
    sillage: 'Intimate' | 'Moderate' | 'Strong' | 'Enormous';
    projection: 'Light' | 'Moderate' | 'Heavy';
    
    // Usage Context
    seasons: string[];          // When to wear
    occasions: string[];        // Where to wear
    timeOfDay: 'Day' | 'Night' | 'Any';
    
    // Additional Information
    yearLaunched?: number;
    perfumer?: string;         // Nose/Creator
    ingredients?: string;      // List of ingredients
    story?: string;           // Brand story or inspiration
  };
  
  // Product Features
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  giftWrappingAvailable: boolean;
  sampleAvailable: boolean;
  
  // Reviews & Ratings
  rating: number;              // Average rating (0-5)
  ratingCount: number;        // Total number of ratings
  reviews?: PerfumeReview[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Review Type
export interface PerfumeReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpful: number;
  date: string;
  scentRating?: {
    longevity: number;
    sillage: number;
    value: number;
  };
}

// Cart Item Type (for shopping cart)
export interface CartItem {
  productId: string;
  productName: string;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  giftWrapping: boolean;
}

// Order Type
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// User Type
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];        // Product IDs
  orders: string[];          // Order IDs
  createdAt: string;
}

// Filter Options Type
export interface PerfumeFilterOptions {
  gender?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  fragranceFamily?: string[];
  concentration?: string[];
  occasions?: string[];
  seasons?: string[];
  rating?: number;
  inStock?: boolean;
}

// Product List Response
export interface PerfumeProductListResponse {
  products: PerfumeProduct[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
