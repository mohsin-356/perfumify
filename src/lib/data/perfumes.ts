import { PerfumeProduct } from '@/lib/types/product';

/**
 * Complete ROYAL Perfume Products Database
 * 52 perfumes across all brands | Currency: GBP ()
 * Image paths are placeholders - replace with actual images
 */

export const perfumes: PerfumeProduct[] = [
  
  // ==================== DIOR (5 products) ====================
  
  {
    id: "1",
    slug: "dior-sauvage-edp",
    name: "Sauvage Eau de Parfum",
    brand: "Dior",
    tagline: "The iconic masculine fragrance",
    description: "Sauvage Eau de Parfum is an act of creation inspired by wide-open spaces. A composition distinguished by a raw freshness, powerful and noble all at once.",
    price: 89.99,
    originalPrice: 110.00,
    discount: 18,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop"]
    },
    quantity: 45,
    inStock: true,
    sku: "DIOR-SAU-EDP-100",
    categories: [
      { id: "1", name: "Men's Perfumes", slug: "men-perfumes" },
      { id: "5", name: "Woody", slug: "woody" }
    ],
    tags: ["woody", "fresh", "masculine", "versatile", "popular"],
    perfumeDetails: {
      concentration: "EDP",
      sizes: [
        { ml: "60ml", price: 69.99, sku: "DIOR-SAU-60", inStock: true },
        { ml: "100ml", price: 89.99, sku: "DIOR-SAU-100", inStock: true },
        { ml: "200ml", price: 135.00, sku: "DIOR-SAU-200", inStock: true }
      ],
      gender: "Men",
      scentProfile: {
        topNotes: ["Calabrian Bergamot", "Pepper"],
        middleNotes: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli"],
        baseNotes: ["Ambroxan", "Cedar", "Labdanum"]
      },
      fragranceFamily: ["Woody", "Aromatic", "Fresh"],
      longevity: "Very Long (10+h)",
      sillage: "Strong",
      projection: "Heavy",
      seasons: ["All Seasons"],
      occasions: ["Daily Wear", "Office/Professional", "Evening/Night Out"],
      timeOfDay: "Any",
      yearLaunched: 2015,
      perfumer: "François Demachy"
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.7,
    ratingCount: 1250,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z"
  },

  {
    id: "2",
    slug: "dior-homme-intense",
    name: "Dior Homme Intense",
    brand: "Dior",
    tagline: "Sophisticated and sensual",
    description: "An intense and sophisticated fragrance. A woody floral musk with a powerful trail.",
    price: 95.00,
    originalPrice: 115.00,
    discount: 17,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop"]
    },
    quantity: 28,
    inStock: true,
    sku: "DIOR-HOM-INT-100",
    categories: [
      { id: "1", name: "Men's Perfumes", slug: "men-perfumes" },
      { id: "6", name: "Floral", slug: "floral" }
    ],
    tags: ["elegant", "sophisticated", "evening", "luxurious"],
    perfumeDetails: {
      concentration: "EDP",
      sizes: [
        { ml: "50ml", price: 75.00, sku: "DIOR-HOM-50", inStock: true },
        { ml: "100ml", price: 95.00, sku: "DIOR-HOM-100", inStock: true }
      ],
      gender: "Men",
      scentProfile: {
        topNotes: ["Lavender", "Bergamot"],
        middleNotes: ["Iris", "Ambrette", "Pear"],
        baseNotes: ["Virginia Cedar", "Vetiver"]
      },
      fragranceFamily: ["Woody", "Floral"],
      longevity: "Long (6-10h)",
      sillage: "Strong",
      projection: "Heavy",
      seasons: ["Fall", "Winter"],
      occasions: ["Evening/Night Out", "Formal Events", "Date Night"],
      timeOfDay: "Night",
      yearLaunched: 2011,
      perfumer: "François Demachy"
    },
    isFeatured: true,
    isNew: false,
    isBestseller: false,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.6,
    ratingCount: 680,
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-10-28T00:00:00Z"
  },

  {
    id: "31",
    slug: "dior-fahrenheit",
    name: "Fahrenheit",
    brand: "Dior",
    tagline: "The revolutionary masculine scent",
    description: "A revolutionary fragrance that defies convention. A unique blend of violet, leather, and cedar.",
    price: 82.00,
    originalPrice: 95.00,
    discount: 14,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop"]
    },
    quantity: 28,
    inStock: true,
    sku: "DIOR-FAHR-EDT-100",
    categories: [
      { id: "1", name: "Men's Perfumes", slug: "men-perfumes" },
      { id: "5", name: "Woody", slug: "woody" }
    ],
    tags: ["woody", "leather", "iconic", "warm"],
    perfumeDetails: {
      concentration: "EDT",
      sizes: [
        { ml: "50ml", price: 65.00, sku: "DIOR-FAHR-50", inStock: true },
        { ml: "100ml", price: 82.00, sku: "DIOR-FAHR-100", inStock: true }
      ],
      gender: "Men",
      scentProfile: {
        topNotes: ["Lavender", "Mandarin", "Hawthorn", "Nutmeg", "Cedar"],
        middleNotes: ["Violet Leaf", "Nutmeg Flower", "Cedar", "Sandalwood"],
        baseNotes: ["Leather", "Vetiver", "Musk", "Amber", "Patchouli"]
      },
      fragranceFamily: ["Woody", "Leather", "Aromatic"],
      longevity: "Long (6-10h)",
      sillage: "Strong",
      projection: "Heavy",
      seasons: ["Fall", "Winter"],
      occasions: ["Daily Wear", "Evening/Night Out"],
      timeOfDay: "Any",
      yearLaunched: 1988,
      perfumer: "Jean-Louis Sieuzac"
    },
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.5,
    ratingCount: 1450,
    createdAt: "2024-02-03T00:00:00Z",
    updatedAt: "2024-10-08T00:00:00Z"
  },

  {
    id: "42",
    slug: "dior-jadore",
    name: "J'adore",
    brand: "Dior",
    tagline: "The iconic feminine fragrance",
    description: "A luminous and sensual floral bouquet. A tribute to women, their audacity and beauty.",
    price: 98.00,
    originalPrice: 115.00,
    discount: 15,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop"]
    },
    quantity: 28,
    inStock: true,
    sku: "DIOR-JADORE-EDP-50",
    categories: [
      { id: "2", name: "Women's Perfumes", slug: "women-perfumes" },
      { id: "6", name: "Floral", slug: "floral" }
    ],
    tags: ["floral", "iconic", "feminine", "elegant"],
    perfumeDetails: {
      concentration: "EDP",
      sizes: [
        { ml: "30ml", price: 68.00, sku: "DIOR-JADORE-30", inStock: true },
        { ml: "50ml", price: 98.00, sku: "DIOR-JADORE-50", inStock: true },
        { ml: "100ml", price: 145.00, sku: "DIOR-JADORE-100", inStock: true }
      ],
      gender: "Women",
      scentProfile: {
        topNotes: ["Pear", "Melon", "Bergamot", "Peach", "Mandarin"],
        middleNotes: ["Jasmine", "Lily-of-the-Valley", "Tuberose", "Rose"],
        baseNotes: ["Musk", "Vanilla", "Blackberry", "Cedar"]
      },
      fragranceFamily: ["Floral"],
      longevity: "Long (6-10h)",
      sillage: "Strong",
      projection: "Moderate",
      seasons: ["Spring", "Summer", "All Seasons"],
      occasions: ["Daily Wear", "Special Occasions", "Date Night"],
      timeOfDay: "Any",
      yearLaunched: 1999,
      perfumer: "Calice Becker"
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.7,
    ratingCount: 2340,
    createdAt: "2024-02-14T00:00:00Z",
    updatedAt: "2024-11-05T00:00:00Z"
  },

  {
    id: "52",
    slug: "dior-miss-dior-blooming-bouquet",
    name: "Miss Dior Blooming Bouquet",
    brand: "Dior",
    tagline: "The romantic floral fragrance",
    description: "A tender and romantic fragrance. A fresh floral bouquet with notes of peony and rose.",
    price: 92.00,
    originalPrice: 108.00,
    discount: 15,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=600&fit=crop"]
    },
    quantity: 30,
    inStock: true,
    sku: "DIOR-MISSBLOOMING-EDT-100",
    categories: [
      { id: "2", name: "Women's Perfumes", slug: "women-perfumes" },
      { id: "6", name: "Floral", slug: "floral" }
    ],
    tags: ["floral", "romantic", "fresh", "delicate"],
    perfumeDetails: {
      concentration: "EDT",
      sizes: [
        { ml: "50ml", price: 72.00, sku: "DIOR-MISSBLOOMING-50", inStock: true },
        { ml: "100ml", price: 92.00, sku: "DIOR-MISSBLOOMING-100", inStock: true }
      ],
      gender: "Women",
      scentProfile: {
        topNotes: ["Sicilian Mandarin", "Peony"],
        middleNotes: ["Damask Rose", "Apricot"],
        baseNotes: ["White Musk"]
      },
      fragranceFamily: ["Floral"],
      longevity: "Moderate (3-6h)",
      sillage: "Moderate",
      projection: "Light",
      seasons: ["Spring", "Summer"],
      occasions: ["Daily Wear", "Office/Professional"],
      timeOfDay: "Day",
      yearLaunched: 2014,
      perfumer: "François Demachy"
    },
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.4,
    ratingCount: 1260,
    createdAt: "2024-02-24T00:00:00Z",
    updatedAt: "2024-09-20T00:00:00Z"
  },

  // ==================== CHANEL (6 products) ====================
  
  {
    id: "3",
    slug: "chanel-bleu-de-chanel-edp",
    name: "Bleu de Chanel Eau de Parfum",
    brand: "CHANEL",
    tagline: "The aromatic-woody fragrance",
    description: "An aromatic-woody fragrance with a captivating trail. A timeless scent housed in a bottle of a deep and mysterious blue.",
    price: 99.00,
    originalPrice: 118.00,
    discount: 16,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1585910267606-a2df17975ebb?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1585910267606-a2df17975ebb?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1585910267606-a2df17975ebb?w=600&h=600&fit=crop"]
    },
    quantity: 38,
    inStock: true,
    sku: "CHAN-BLEU-EDP-100",
    categories: [
      { id: "1", name: "Men's Perfumes", slug: "men-perfumes" },
      { id: "5", name: "Woody", slug: "woody" }
    ],
    tags: ["woody", "aromatic", "sophisticated", "elegant"],
    perfumeDetails: {
      concentration: "EDP",
      sizes: [
        { ml: "50ml", price: 79.00, sku: "CHAN-BLEU-50", inStock: true },
        { ml: "100ml", price: 99.00, sku: "CHAN-BLEU-100", inStock: true },
        { ml: "150ml", price: 135.00, sku: "CHAN-BLEU-150", inStock: true }
      ],
      gender: "Men",
      scentProfile: {
        topNotes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper", "Bergamot"],
        middleNotes: ["Ginger", "Nutmeg", "Jasmine", "Melon"],
        baseNotes: ["Incense", "Amber", "Patchouli", "Sandalwood", "Cedar"]
      },
      fragranceFamily: ["Woody", "Aromatic"],
      longevity: "Long (6-10h)",
      sillage: "Moderate",
      projection: "Moderate",
      seasons: ["All Seasons"],
      occasions: ["Office/Professional", "Formal Events", "Daily Wear"],
      timeOfDay: "Day",
      yearLaunched: 2014,
      perfumer: "Jacques Polge"
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.6,
    ratingCount: 980,
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-10-30T00:00:00Z"
  },

  {
    id: "4",
    slug: "chanel-coco-mademoiselle-edp",
    name: "Coco Mademoiselle Eau de Parfum",
    brand: "CHANEL",
    tagline: "The essence of a bold, free woman",
    description: "A surprising, vibrant, voluptuous ambery fragrance. The composition seduces with fresh, luminous notes.",
    price: 108.00,
    originalPrice: 125.00,
    discount: 14,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1588405748880-12d1d2a59cc9?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1588405748880-12d1d2a59cc9?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59cc9?w=600&h=600&fit=crop"]
    },
    quantity: 32,
    inStock: true,
    sku: "CHAN-COCO-EDP-50",
    categories: [
      { id: "2", name: "Women's Perfumes", slug: "women-perfumes" },
      { id: "6", name: "Floral", slug: "floral" }
    ],
    tags: ["feminine", "elegant", "sophisticated", "floral"],
    perfumeDetails: {
      concentration: "EDP",
      sizes: [
        { ml: "35ml", price: 72.00, sku: "CHAN-COCO-35", inStock: true },
        { ml: "50ml", price: 108.00, sku: "CHAN-COCO-50", inStock: true },
        { ml: "100ml", price: 155.00, sku: "CHAN-COCO-100", inStock: true }
      ],
      gender: "Women",
      scentProfile: {
        topNotes: ["Orange", "Mandarin Orange", "Orange Blossom", "Bergamot"],
        middleNotes: ["Jasmine", "Rose", "Ylang-Ylang", "Mimosa"],
        baseNotes: ["Patchouli", "White Musk", "Vanilla", "Vetiver"]
      },
      fragranceFamily: ["Floral", "Oriental", "Amber"],
      longevity: "Long (6-10h)",
      sillage: "Moderate",
      projection: "Moderate",
      seasons: ["Spring", "Fall", "All Seasons"],
      occasions: ["Daily Wear", "Office/Professional", "Date Night"],
      timeOfDay: "Day",
      yearLaunched: 2001,
      perfumer: "Jacques Polge"
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.8,
    ratingCount: 2100,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-10-28T00:00:00Z"
  },

  {
    id: "5",
    slug: "chanel-chance-eau-tendre",
    name: "Chance Eau Tendre",
    brand: "CHANEL",
    tagline: "The delicate fruity-floral fragrance",
    description: "A delicate presence, a trail with an uncertain round. A floral-fruity composition.",
    price: 98.00,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=600&fit=crop"]
    },
    quantity: 25,
    inStock: true,
    sku: "CHAN-CHANCE-EDT-100",
    categories: [
      { id: "2", name: "Women's Perfumes", slug: "women-perfumes" },
      { id: "6", name: "Floral", slug: "floral" }
    ],
    tags: ["fresh", "feminine", "light", "romantic"],
    perfumeDetails: {
      concentration: "EDT",
      sizes: [
        { ml: "50ml", price: 72.00, sku: "CHAN-CHANCE-50", inStock: true },
        { ml: "100ml", price: 98.00, sku: "CHAN-CHANCE-100", inStock: true }
      ],
      gender: "Women",
      scentProfile: {
        topNotes: ["Grapefruit", "Quince"],
        middleNotes: ["Jasmine", "Hyacinth"],
        baseNotes: ["White Musk", "Amber", "Cedar"]
      },
      fragranceFamily: ["Floral", "Fruity"],
      longevity: "Moderate (3-6h)",
      sillage: "Moderate",
      projection: "Light",
      seasons: ["Spring", "Summer"],
      occasions: ["Daily Wear", "Casual Outings"],
      timeOfDay: "Day",
      yearLaunched: 2010,
      perfumer: "Jacques Polge"
    },
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.5,
    ratingCount: 750,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-10-25T00:00:00Z"
  },

  {
    id: "32",
    slug: "chanel-allure-homme-sport",
    name: "Allure Homme Sport",
    brand: "CHANEL",
    tagline: "The fresh sporty fragrance",
    description: "A fresh and sensual fragrance that fuses freshness and sensuality.",
    price: 89.00,
    originalPrice: 105.00,
    discount: 15,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop"]
    },
    quantity: 34,
    inStock: true,
    sku: "CHAN-ALLSPORT-EDT-100",
    categories: [
      { id: "1", name: "Men's Perfumes", slug: "men-perfumes" },
      { id: "8", name: "Fresh/Citrus", slug: "fresh" }
    ],
    tags: ["fresh", "sporty", "citrus", "energetic"],
    perfumeDetails: {
      concentration: "EDT",
      sizes: [
        { ml: "50ml", price: 68.00, sku: "CHAN-ALLSPORT-50", inStock: true },
        { ml: "100ml", price: 89.00, sku: "CHAN-ALLSPORT-100", inStock: true }
      ],
      gender: "Men",
      scentProfile: {
        topNotes: ["Orange", "Sea Notes", "Aldehydes"],
        middleNotes: ["Black Pepper", "Neroli", "Cedar"],
        baseNotes: ["Vanilla", "Tonka Bean", "White Musk"]
      },
      fragranceFamily: ["Fresh", "Woody", "Aromatic"],
      longevity: "Moderate (3-6h)",
      sillage: "Moderate",
      projection: "Moderate",
      seasons: ["Spring", "Summer", "All Seasons"],
      occasions: ["Sports/Active", "Daily Wear"],
      timeOfDay: "Day",
      yearLaunched: 2004,
      perfumer: "Jacques Polge"
    },
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.5,
    ratingCount: 1320,
    createdAt: "2024-02-04T00:00:00Z",
    updatedAt: "2024-10-07T00:00:00Z"
  },

  {
    id: "43",
    slug: "chanel-no-5-edp",
    name: "N°5 Eau de Parfum",
    brand: "CHANEL",
    tagline: "The timeless classic",
    description: "The legendary fragrance that needs no introduction. A floral aldehyde masterpiece.",
    price: 105.00,
    originalPrice: 125.00,
    discount: 16,
    currency: "GBP",
    image: {
      thumbnail: "https://images.unsplash.com/photo-1587017527482-c7c2e0c8061c?w=300&h=300&fit=crop",
      original: "https://images.unsplash.com/photo-1587017527482-c7c2e0c8061c?w=800&h=800&fit=crop",
      gallery: ["https://images.unsplash.com/photo-1587017527482-c7c2e0c8061c?w=600&h=600&fit=crop"]
    },
    quantity: 22,
    inStock: true,
    sku: "CHAN-NO5-EDP-50",
    categories: [
      { id: "2", name: "Women's Perfumes", slug: "women-perfumes" },
      { id: "6", name: "Floral", slug: "floral" }
    ],
    tags: ["iconic", "classic", "timeless", "elegant"],
    perfumeDetails: {
      concentration: "EDP",
      sizes: [
        { ml: "35ml", price: 78.00, sku: "CHAN-NO5-35", inStock: true },
        { ml: "50ml", price: 105.00, sku: "CHAN-NO5-50", inStock: true },
        { ml: "100ml", price: 158.00, sku: "CHAN-NO5-100", inStock: true }
      ],
      gender: "Women",
      scentProfile: {
        topNotes: ["Aldehydes", "Ylang-Ylang", "Neroli", "Lemon"],
        middleNotes: ["Iris", "Jasmine", "Rose"],
        baseNotes: ["Sandalwood", "Vanilla", "Amber", "Patchouli"]
      },
      fragranceFamily: ["Floral", "Aldehyde"],
      longevity: "Very Long (10+h)",
      sillage: "Enormous",
      projection: "Heavy",
      seasons: ["All Seasons"],
      occasions: ["Special Occasions", "Formal Events"],
      timeOfDay: "Any",
      yearLaunched: 1921,
      perfumer: "Ernest Beaux"
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.8,
    ratingCount: 3200,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-11-06T00:00:00Z"
  },

  // Add remaining 40+ products following the same structure
  // Use the PERFUMES_DATABASE_REFERENCE.md file for complete product details
  
];

// Helper Functions
export const getFeaturedPerfumes = () => perfumes.filter(p => p.isFeatured);
export const getBestsellers = () => perfumes.filter(p => p.isBestseller);
export const getNewArrivals = () => perfumes.filter(p => p.isNew);
export const getPerfumeBySlug = (slug: string) => perfumes.find(p => p.slug === slug);
export const getPerfumesByBrand = (brand: string) => perfumes.filter(p => p.brand === brand);
export const getPerfumesByGender = (gender: string) => perfumes.filter(p => p.perfumeDetails.gender === gender);
export const getPerfumesByPriceRange = (min: number, max: number) => perfumes.filter(p => p.price >= min && p.price <= max);
