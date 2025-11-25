/**
 * Complete perfume category system
 * Use this for navigation, filtering, and product classification
 */

export const perfumeCategories = {
  // Main Gender Categories
  gender: [
    {
      id: 'men',
      name: "Men's Perfumes",
      slug: 'men-perfumes',
      description: 'Masculine fragrances for the modern man',
      image: '/images/categories/men.jpg'
    },
    {
      id: 'women',
      name: "Women's Perfumes",
      slug: 'women-perfumes',
      description: 'Elegant scents for women',
      image: '/images/categories/women.jpg'
    },
    {
      id: 'unisex',
      name: 'Unisex Perfumes',
      slug: 'unisex-perfumes',
      description: 'Gender-neutral fragrances',
      image: '/images/categories/unisex.jpg'
    }
  ],

  // Concentration Types
  concentration: [
    {
      id: 'parfum',
      name: 'Parfum/Extrait',
      code: 'PARFUM',
      percentage: '20-40%',
      longevity: 'Very Long',
      description: 'Highest concentration, longest lasting'
    },
    {
      id: 'edp',
      name: 'Eau de Parfum',
      code: 'EDP',
      percentage: '15-20%',
      longevity: 'Long',
      description: 'Strong and long-lasting'
    },
    {
      id: 'edt',
      name: 'Eau de Toilette',
      code: 'EDT',
      percentage: '5-15%',
      longevity: 'Moderate',
      description: 'Light and fresh for daily wear'
    },
    {
      id: 'edc',
      name: 'Eau de Cologne',
      code: 'EDC',
      percentage: '2-5%',
      longevity: 'Short',
      description: 'Light and refreshing'
    },
    {
      id: 'oil',
      name: 'Perfume Oil',
      code: 'OIL',
      percentage: 'Pure',
      longevity: 'Very Long',
      description: 'Alcohol-free concentrated oil'
    }
  ],

  // Fragrance Families
  fragranceFamily: [
    { id: 'floral', name: 'Floral', description: 'Flower-based scents' },
    { id: 'oriental', name: 'Oriental/Amber', description: 'Warm, exotic, spicy' },
    { id: 'woody', name: 'Woody', description: 'Earthy, warm wood notes' },
    { id: 'fresh', name: 'Fresh/Citrus', description: 'Clean, zesty, energizing' },
    { id: 'fruity', name: 'Fruity', description: 'Sweet fruit notes' },
    { id: 'gourmand', name: 'Gourmand', description: 'Edible, dessert-like' },
    { id: 'aquatic', name: 'Aquatic/Marine', description: 'Water-inspired, clean' },
    { id: 'spicy', name: 'Spicy', description: 'Warm spices' },
    { id: 'green', name: 'Green/Herbal', description: 'Fresh cut grass, herbs' },
    { id: 'chypre', name: 'Chypre', description: 'Sophisticated, mossy' },
    { id: 'fougere', name: 'Fougère', description: 'Fern-like, aromatic' },
    { id: 'leather', name: 'Leather', description: 'Rich, animalic' }
  ],

  // Occasions
  occasion: [
    { id: 'daily', name: 'Daily Wear', icon: '☀️' },
    { id: 'office', name: 'Office/Professional', icon: '💼' },
    { id: 'evening', name: 'Evening/Night Out', icon: '🌙' },
    { id: 'special', name: 'Special Occasions', icon: '🎉' },
    { id: 'date', name: 'Date Night', icon: '💕' },
    { id: 'sports', name: 'Sports/Active', icon: '⚡' },
    { id: 'formal', name: 'Formal Events', icon: '🎩' },
    { id: 'casual', name: 'Casual Outings', icon: '👕' }
  ],

  // Seasons
  season: [
    { id: 'spring', name: 'Spring', months: 'Mar-May' },
    { id: 'summer', name: 'Summer', months: 'Jun-Aug' },
    { id: 'fall', name: 'Fall', months: 'Sep-Nov' },
    { id: 'winter', name: 'Winter', months: 'Dec-Feb' },
    { id: 'all', name: 'All Seasons', months: 'Year-round' }
  ],

  // Price Ranges
  priceRange: [
    { id: 'budget', name: 'Under $50', min: 0, max: 49.99 },
    { id: 'mid', name: '$50 - $100', min: 50, max: 99.99 },
    { id: 'premium', name: '$100 - $200', min: 100, max: 199.99 },
    { id: 'luxury', name: 'Luxury ($200+)', min: 200, max: 999999 }
  ],

  // Brand Types
  brandType: [
    { id: 'designer', name: 'Designer Brands' },
    { id: 'niche', name: 'Niche/Artisan' },
    { id: 'celebrity', name: 'Celebrity Fragrances' },
    { id: 'arabic', name: 'Arabic/Attar' },
    { id: 'indie', name: 'Indie Brands' }
  ],

  // Popular Brands (for filter)
  brands: [
    'Dior', 'Chanel', 'Tom Ford', 'Versace', 'Giorgio Armani',
    'Yves Saint Laurent', 'Gucci', 'Prada', 'Burberry', 'Calvin Klein',
    'Dolce & Gabbana', 'Jean Paul Gaultier', 'Carolina Herrera',
    'Creed', 'Parfums de Marly', 'Maison Francis Kurkdjian',
    'Le Labo', 'Byredo', 'Amouage', 'Montale',
    'Ajmal', 'Al Haramain', 'Rasasi', 'Swiss Arabian'
  ]
};

// Helper functions
export const getCategoryBySlug = (slug: string) => {
  return perfumeCategories.gender.find(cat => cat.slug === slug);
};

export const getFragranceFamilyById = (id: string) => {
  return perfumeCategories.fragranceFamily.find(ff => ff.id === id);
};

export const getBrandsByType = (_type?: string) => {
  // Can be extended to filter brands by type in the future
  return perfumeCategories.brands;
};

export const getConcentrationByCode = (code: string) => {
  return perfumeCategories.concentration.find(c => c.code === code);
};
