import { PerfumeProduct } from '../types/perfume-product';

/**
 * Perfume Products Database - Part 1 (Products 1-25)
 * Designer & Luxury Perfumes
 */

export const perfumeProductsPart1: PerfumeProduct[] = [
  {
    id: '1',
    slug: 'dior-sauvage-edp',
    name: 'Sauvage Eau de Parfum',
    brand: 'Dior',
    tagline: 'A wild and powerful fragrance',
    description: 'Sauvage Eau de Parfum is a juxtaposition of radically fresh top notes with a heart of Vanilla absolute. The new Eau de Parfum is enriched with Vanilla notes, creating a composition that is both raw and noble.',
    price: 135,
    originalPrice: 150,
    discount: 10,
    currency: 'USD',
    image: {
      thumbnail: '/assets/images/products/perfumes/dior-sauvage-thumb.jpg',
      original: '/assets/images/products/perfumes/dior-sauvage.jpg',
      gallery: [
        '/assets/images/products/perfumes/dior-sauvage-1.jpg',
        '/assets/images/products/perfumes/dior-sauvage-2.jpg',
        '/assets/images/products/perfumes/dior-sauvage-3.jpg'
      ]
    },
    quantity: 150,
    inStock: true,
    sku: 'DIOR-SAU-EDP-100',
    categories: [
      { id: 1, name: "Men's Perfumes", slug: 'men' },
      { id: 2, name: 'Designer Brands', slug: 'designer' }
    ],
    tags: ['bestseller', 'designer', 'fresh', 'woody'],
    perfumeDetails: {
      concentration: 'EDP',
      sizes: [
        { ml: '60ml', price: 95, sku: 'DIOR-SAU-EDP-60', inStock: true },
        { ml: '100ml', price: 135, sku: 'DIOR-SAU-EDP-100', inStock: true },
        { ml: '200ml', price: 185, sku: 'DIOR-SAU-EDP-200', inStock: true }
      ],
      gender: 'Men',
      scentProfile: {
        topNotes: ['Calabrian Bergamot', 'Pepper'],
        middleNotes: ['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver', 'Patchouli', 'Geranium', 'Elemi'],
        baseNotes: ['Ambroxan', 'Cedar', 'Labdanum', 'Vanilla']
      },
      fragranceFamily: ['fresh', 'woody', 'spicy'],
      longevity: 'Very Long (10+h)',
      sillage: 'Strong',
      projection: 'Heavy',
      seasons: ['fall', 'winter', 'all'],
      occasions: ['evening', 'date', 'formal', 'casual'],
      timeOfDay: 'Any',
      yearLaunched: 2018,
      perfumer: 'François Demachy',
      story: 'Sauvage is inspired by wide-open spaces and blue skies. A composition that marries strength and nobility.'
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.7,
    ratingCount: 2450,
    metaTitle: 'Dior Sauvage EDP - Best Men\'s Fragrance | LuxeScent',
    metaDescription: 'Buy Dior Sauvage Eau de Parfum online. Fresh, woody fragrance with vanilla. Free shipping on orders over $50.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-08T14:30:00Z'
  },
  {
    id: '2',
    slug: 'chanel-coco-mademoiselle-edp',
    name: 'Coco Mademoiselle Eau de Parfum',
    brand: 'Chanel',
    tagline: 'An oriental fragrance with a fresh character',
    description: 'An elegant and voluptuous fragrance that evokes a bold, free, and independent woman. Coco Mademoiselle is a luminous, radiant and modern interpretation of a floral chypre.',
    price: 155,
    currency: 'USD',
    image: {
      thumbnail: '/assets/images/products/perfumes/chanel-coco-thumb.jpg',
      original: '/assets/images/products/perfumes/chanel-coco.jpg',
      gallery: []
    },
    quantity: 120,
    inStock: true,
    sku: 'CHANEL-COCO-EDP-100',
    categories: [
      { id: 3, name: "Women's Perfumes", slug: 'women' },
      { id: 2, name: 'Designer Brands', slug: 'designer' }
    ],
    tags: ['bestseller', 'designer', 'floral', 'oriental'],
    perfumeDetails: {
      concentration: 'EDP',
      sizes: [
        { ml: '50ml', price: 125, sku: 'CHANEL-COCO-EDP-50', inStock: true },
        { ml: '100ml', price: 155, sku: 'CHANEL-COCO-EDP-100', inStock: true }
      ],
      gender: 'Women',
      scentProfile: {
        topNotes: ['Orange', 'Orange Blossom', 'Grapefruit', 'Bergamot'],
        middleNotes: ['Lychee', 'Rose', 'Jasmine'],
        baseNotes: ['Patchouli', 'Vetiver', 'Vanilla', 'Tonka Bean', 'White Musk']
      },
      fragranceFamily: ['oriental', 'floral'],
      longevity: 'Long (6-10h)',
      sillage: 'Moderate',
      projection: 'Moderate',
      seasons: ['spring', 'fall', 'all'],
      occasions: ['office', 'date', 'daily', 'evening'],
      timeOfDay: 'Any',
      yearLaunched: 2001,
      perfumer: 'Jacques Polge',
      story: 'A tribute to Gabrielle Chanel, embodying elegance, freedom, and daring spirit.'
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.8,
    ratingCount: 3200,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-11-08T14:30:00Z'
  },
  {
    id: '3',
    slug: 'tom-ford-oud-wood-edp',
    name: 'Oud Wood Eau de Parfum',
    brand: 'Tom Ford',
    tagline: 'An exotic, smoky blend',
    description: 'Oud Wood envelops you in rare oud, exotic spices and cardamom then exposes its rich and dark blend of sensuality. A composition revealing oud wood\'s richest and most decadent notes.',
    price: 240,
    originalPrice: 260,
    discount: 7,
    currency: 'USD',
    image: {
      thumbnail: '/assets/images/products/perfumes/tom-ford-oud-thumb.jpg',
      original: '/assets/images/products/perfumes/tom-ford-oud.jpg',
      gallery: []
    },
    quantity: 80,
    inStock: true,
    sku: 'TF-OUD-EDP-100',
    categories: [
      { id: 5, name: 'Unisex Perfumes', slug: 'unisex' },
      { id: 6, name: 'Luxury', slug: 'luxury' }
    ],
    tags: ['luxury', 'woody', 'oriental', 'niche'],
    perfumeDetails: {
      concentration: 'EDP',
      sizes: [
        { ml: '50ml', price: 180, sku: 'TF-OUD-EDP-50', inStock: true },
        { ml: '100ml', price: 240, sku: 'TF-OUD-EDP-100', inStock: true }
      ],
      gender: 'Unisex',
      scentProfile: {
        topNotes: ['Oud Wood', 'Rosewood', 'Cardamom', 'Chinese Pepper'],
        middleNotes: ['Sandalwood', 'Vetiver', 'Tonka Bean', 'Amber'],
        baseNotes: ['Akigalawood', 'Vanilla']
      },
      fragranceFamily: ['woody', 'oriental'],
      longevity: 'Very Long (10+h)',
      sillage: 'Moderate',
      projection: 'Moderate',
      seasons: ['fall', 'winter'],
      occasions: ['evening', 'formal', 'special'],
      timeOfDay: 'Night',
      yearLaunched: 2007,
      perfumer: 'Richard Herpin',
      story: 'Tom Ford\'s personal signature scent, a modern interpretation of the ancient oud ingredient.'
    },
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.6,
    ratingCount: 1850,
    createdAt: '2024-01-12T09:30:00Z',
    updatedAt: '2024-11-08T14:30:00Z'
  },
  {
    id: '4',
    slug: 'ysl-libre-edp',
    name: 'Libre Eau de Parfum',
    brand: 'Yves Saint Laurent',
    tagline: 'The freedom to live everything with excess',
    description: 'A lavender floral fragrance that balances the tension between hot and cold, masculine and feminine. Libre is the perfume of a strong, bold and free woman.',
    price: 128,
    currency: 'USD',
    image: {
      thumbnail: '/assets/images/products/perfumes/ysl-libre-thumb.jpg',
      original: '/assets/images/products/perfumes/ysl-libre.jpg',
      gallery: []
    },
    quantity: 95,
    inStock: true,
    sku: 'YSL-LIB-EDP-90',
    categories: [
      { id: 3, name: "Women's Perfumes", slug: 'women' },
      { id: 2, name: 'Designer Brands', slug: 'designer' }
    ],
    tags: ['designer', 'floral', 'new'],
    perfumeDetails: {
      concentration: 'EDP',
      sizes: [
        { ml: '30ml', price: 85, sku: 'YSL-LIB-EDP-30', inStock: true },
        { ml: '50ml', price: 108, sku: 'YSL-LIB-EDP-50', inStock: true },
        { ml: '90ml', price: 128, sku: 'YSL-LIB-EDP-90', inStock: true }
      ],
      gender: 'Women',
      scentProfile: {
        topNotes: ['Lavender', 'Mandarin Orange', 'Black Currant', 'Petitgrain'],
        middleNotes: ['Lavender', 'Orange Blossom'],
        baseNotes: ['Vanilla', 'Musk', 'Cedar', 'Ambergris']
      },
      fragranceFamily: ['floral', 'fougere'],
      longevity: 'Long (6-10h)',
      sillage: 'Strong',
      projection: 'Heavy',
      seasons: ['spring', 'summer', 'fall'],
      occasions: ['daily', 'office', 'evening', 'casual'],
      timeOfDay: 'Any',
      yearLaunched: 2019,
      perfumer: 'Anne Flipo & Carlos Benaim',
      story: 'Libre celebrates the freedom of living your passions and breaking the rules.'
    },
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.5,
    ratingCount: 1420,
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-11-08T14:30:00Z'
  },
  {
    id: '5',
    slug: 'versace-eros-edt',
    name: 'Eros Eau de Toilette',
    brand: 'Versace',
    tagline: 'The scent of love',
    description: 'Eros is a fragrance born of the Mediterranean, the sun, the sea and the warmth of the sand. A fresh, woody oriental perfume with a Mediterranean soul.',
    price: 89,
    originalPrice: 99,
    discount: 10,
    currency: 'USD',
    image: {
      thumbnail: '/assets/images/products/perfumes/versace-eros-thumb.jpg',
      original: '/assets/images/products/perfumes/versace-eros.jpg',
      gallery: []
    },
    quantity: 200,
    inStock: true,
    sku: 'VERS-EROS-EDT-100',
    categories: [
      { id: 1, name: "Men's Perfumes", slug: 'men' },
      { id: 2, name: 'Designer Brands', slug: 'designer' }
    ],
    tags: ['designer', 'fresh', 'aquatic', 'bestseller'],
    perfumeDetails: {
      concentration: 'EDT',
      sizes: [
        { ml: '50ml', price: 69, sku: 'VERS-EROS-EDT-50', inStock: true },
        { ml: '100ml', price: 89, sku: 'VERS-EROS-EDT-100', inStock: true },
        { ml: '200ml', price: 119, sku: 'VERS-EROS-EDT-200', inStock: true }
      ],
      gender: 'Men',
      scentProfile: {
        topNotes: ['Mint', 'Green Apple', 'Lemon'],
        middleNotes: ['Tonka Bean', 'Geranium', 'Ambroxan'],
        baseNotes: ['Madagascar Vanilla', 'Virginian Cedar', 'Atlas Cedar', 'Vetiver', 'Oakmoss']
      },
      fragranceFamily: ['fresh', 'oriental', 'woody'],
      longevity: 'Long (6-10h)',
      sillage: 'Strong',
      projection: 'Heavy',
      seasons: ['spring', 'summer', 'fall'],
      occasions: ['daily', 'date', 'casual', 'sports'],
      timeOfDay: 'Day',
      yearLaunched: 2012,
      perfumer: 'Aurélien Guichard',
      story: 'Inspired by Greek mythology and the god of love, Eros embodies passion and desire.'
    },
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    giftWrappingAvailable: true,
    sampleAvailable: true,
    rating: 4.6,
    ratingCount: 2890,
    createdAt: '2024-01-08T07:00:00Z',
    updatedAt: '2024-11-08T14:30:00Z'
  }
];
