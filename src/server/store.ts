import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  AdminUser,
  Category,
  Product,
  Inquiry,
  Customer,
  GalleryItem,
  ProjectItem,
  ServiceItem,
  ContactMessage,
  SiteSettings
} from '../types.js';

interface DBData {
  adminUsers: AdminUser[];
  categories: Category[];
  products: Product[];
  inquiries: Inquiry[];
  customers: Customer[];
  gallery: GalleryItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  messages: ContactMessage[];
  siteSettings: SiteSettings;
  adminPasswords: Record<string, string>; // userId -> hashedPassword
}

const DB_FILE = path.join(process.cwd(), 'data.json');

// Default password helper using PBKDF2
export function hashPassword(password: string): string {
  const salt = 'mercy_shopes_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Mercy Shopes',
  logo: '/logo.png',
  phone: '+251 965 449 976',
  email: 'mihretfikre67@gmail.com',
  location: 'Maxico Shabele',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5489720485667!2d38.7491!3d9.0125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnNDUuMCJOIDM4wrA0NCc1Ni44IkU!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set',
  aboutStory: 'Mercy Shopes is focused on making quality products and materials easier for customers to discover and request. The shop provides products across different categories, including materials, cosmetics, personal care, household products, and other selected merchandise.',
  mission: 'To provide customers with quality products, convenient product discovery, responsive customer service, and a simple way to request products.',
  vision: 'To become a trusted and customer-focused shop serving customers with quality products and reliable service.',
  values: [
    { title: 'Quality', description: 'We source and provide top-grade products for long-lasting satisfaction.', icon: 'Award' },
    { title: 'Customer Satisfaction', description: 'Our highest priority is ensuring every customer order and inquiry is fulfilled seamlessly.', icon: 'Smile' },
    { title: 'Integrity', description: 'Honest pricing, clear product information, and dependable service in all transactions.', icon: 'ShieldCheck' },
    { title: 'Reliability', description: 'Dependable supply chain and consistent communication for individual and business clients.', icon: 'Clock' },
    { title: 'Innovation', description: 'Continuously expanding our product catalog and modernizing product discovery.', icon: 'Sparkles' },
    { title: 'Convenience', description: 'Effortless product inquiries, quick Telegram updates, and direct delivery support.', icon: 'ShoppingBag' }
  ],
  socialLinks: {
    telegram: 'https://t.me/Mercyyy_07',
    whatsapp: 'https://wa.me/251965449976',
    facebook: 'https://facebook.com/mercyshopes',
    instagram: 'https://instagram.com/mercyshopes'
  },
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM | Sunday: Closed',
  heroHeadline: 'Quality Cosmetics, Jewelry, Clothes, Shoes & Building Materials',
  heroSubheadline: 'Mercy Shopes provides premium cosmetics, traditional & modern jewelry, Habesha clothes, shoes, and quality building materials. Submit an inquiry or contact us directly on Telegram (@Mercyyy_07).',
  heroBannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80'
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-cosmetics',
    name: 'Cosmetics',
    description: 'Premium skincare, hair care, makeup, personal care, and beauty treatments.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-jewelry',
    name: 'Jewelry',
    description: 'Elegant Ethiopian Habesha gold jewelry, necklaces, bangles, rings, and fine accessories.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-clothes',
    name: 'Clothes',
    description: 'Traditional Ethiopian Habesha Kemis, modern dresses, jackets, suits, and fashion apparel.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-shoes',
    name: 'Shoes',
    description: 'Genuine handcrafted leather loafers, heels, sneakers, and quality footwear.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-materials',
    name: 'Materials',
    description: 'High-grade construction materials, building supplies, hardware, and industrial goods.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  // Cosmetics
  {
    id: 'prod-001',
    name: 'Hydrating Botanical Facial Serum 50ml',
    sku: 'MS-COS-001',
    categoryId: 'cat-cosmetics',
    categoryName: 'Cosmetics',
    brand: 'Mercy Glow',
    shortDescription: 'Rich nourishing facial serum for glowing and healthy skin.',
    description: 'Formulated with botanical extracts and hyaluronic acid to lock in moisture, reduce fine lines, and give your complexion a smooth, radiant finish suitable for everyday skincare routines.',
    price: 1500,
    discountPrice: 1350,
    stock: 45,
    availability: 'Available',
    featured: true,
    isNew: true,
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597309-873d9e03d09a?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Volume': '50ml',
      'Skin Type': 'All Skin Types',
      'Key Ingredients': 'Hyaluronic Acid, Vitamin C, Rosehip Oil'
    },
    sizes: ['50ml', '100ml'],
    tags: ['Skincare', 'Serum', 'Glow', 'Cosmetics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-002',
    name: 'Nourishing Argan Hair Therapy Oil 100ml',
    sku: 'MS-COS-002',
    categoryId: 'cat-cosmetics',
    categoryName: 'Cosmetics',
    brand: 'Mercy Care',
    shortDescription: 'Deep conditioning hair treatment oil for shine and strength.',
    description: 'Restores split ends, protects hair against moisture loss, and adds brilliant luster to natural and color-treated hair without greasy residue.',
    price: 980,
    stock: 30,
    availability: 'Available',
    featured: true,
    isNew: false,
    badge: 'Popular',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Volume': '100ml',
      'Hair Type': 'Dry, Damaged, Curly, Straight'
    },
    sizes: ['100ml'],
    tags: ['Haircare', 'Argan Oil', 'Cosmetics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Jewelry
  {
    id: 'prod-003',
    name: '18K Gold Plated Habesha Pendant Necklace',
    sku: 'MS-JWL-001',
    categoryId: 'cat-jewelry',
    categoryName: 'Jewelry',
    brand: 'Mercy Luxe',
    shortDescription: 'Exquisite traditional Ethiopian gold pendant with detailed filigree work.',
    description: 'Crafted with premium 18K gold plating over durable brass, featuring authentic Ethiopian cultural art patterns and a sturdy adjustable chain.',
    price: 3200,
    discountPrice: 2900,
    stock: 20,
    availability: 'Available',
    featured: true,
    isNew: true,
    badge: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Material': '18K Gold Plating over Premium Brass',
      'Chain Length': '45 cm + 5 cm extension',
      'Occasion': 'Cultural Ceremonies, Weddings, Gifting'
    },
    tags: ['Jewelry', 'Habesha Gold', 'Necklace', 'Ethiopian'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-004',
    name: 'Ethiopian Traditional Gold Plated Bangle Set (4 Pcs)',
    sku: 'MS-JWL-002',
    categoryId: 'cat-jewelry',
    categoryName: 'Jewelry',
    brand: 'Mercy Luxe',
    shortDescription: 'Set of 4 elegant textured gold bangles for traditional attire.',
    description: 'Polished with a high-shine gold finish and engraved with intricate traditional patterns, perfect for pairing with Habesha Kemis.',
    price: 4500,
    stock: 15,
    availability: 'Available',
    featured: true,
    isNew: false,
    badge: 'Popular',
    images: [
      'https://images.unsplash.com/photo-1611591475281-8ed284486c83?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Quantity': '4 Bangles',
      'Size': 'Medium (65mm Diameter)',
      'Finish': 'Polished 18K Gold Tone'
    },
    sizes: ['Small', 'Medium', 'Large'],
    tags: ['Jewelry', 'Bangles', 'Traditional', 'Gold'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Clothes
  {
    id: 'prod-005',
    name: 'Handwoven Ethiopian Habesha Kemis Dress',
    sku: 'MS-CLO-001',
    categoryId: 'cat-clothes',
    categoryName: 'Clothes',
    brand: 'Mercy Fashion',
    shortDescription: 'Authentic handwoven Shemma cotton Kemis with colorful Tilf embroidery.',
    description: 'Beautifully tailored traditional Ethiopian dress woven from 100% organic cotton, featuring handcrafted neck and hem borders in vibrant thread patterns.',
    price: 8500,
    discountPrice: 7800,
    stock: 10,
    availability: 'Available',
    featured: true,
    isNew: true,
    badge: 'Authentic',
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Fabric': '100% Handwoven Shemma Cotton',
      'Embroidery': 'Handmade Cross-stitch Tilf',
      'Includes': 'Dress + Matching Netela Shawl'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White/Gold', 'White/Red', 'White/Blue'],
    tags: ['Clothes', 'Habesha Kemis', 'Dress', 'Traditional'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-006',
    name: 'Tailored Slim Fit Men Casual Blazer',
    sku: 'MS-CLO-002',
    categoryId: 'cat-clothes',
    categoryName: 'Clothes',
    brand: 'Mercy Style',
    shortDescription: 'Modern single-breasted blazer suit jacket for business and formal events.',
    description: 'Designed with lightweight breathable wool-blend fabric, sleek notched lapels, and custom inner lining for sharp style and comfort.',
    price: 4200,
    stock: 25,
    availability: 'Available',
    featured: false,
    isNew: true,
    badge: 'New Arrival',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Material': '65% Wool, 35% Polyester Blend',
      'Fit': 'Slim Fit',
      'Closure': 'Two-Button Front'
    },
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Navy Blue', 'Charcoal Grey', 'Black'],
    tags: ['Clothes', 'Men Fashion', 'Blazer', 'Jacket'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Shoes
  {
    id: 'prod-007',
    name: 'Handcrafted Genuine Leather Loafers',
    sku: 'MS-SHO-001',
    categoryId: 'cat-shoes',
    categoryName: 'Shoes',
    brand: 'Mercy Footwear',
    shortDescription: 'Premium full-grain leather slip-on loafers with cushioned sole.',
    description: 'Expertly stitched from local Ethiopian full-grain leather, featuring a flexible rubber outer sole and breathable leather interior lining for all-day comfort.',
    price: 3400,
    discountPrice: 3100,
    stock: 30,
    availability: 'Available',
    featured: true,
    isNew: false,
    badge: 'Top Leather',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Upper Material': '100% Genuine Ethiopian Leather',
      'Sole': 'Anti-slip Rubber Cushion',
      'Closure': 'Slip-On'
    },
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Brown', 'Black', 'Tan'],
    tags: ['Shoes', 'Leather', 'Loafers', 'Footwear'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-008',
    name: 'Lightweight Breathable Athletic Sneakers',
    sku: 'MS-SHO-002',
    categoryId: 'cat-shoes',
    categoryName: 'Shoes',
    brand: 'Mercy Sport',
    shortDescription: 'Unisex mesh running sneakers with shock-absorbing soles.',
    description: 'Flexible knit mesh upper paired with responsive EVA cushioning soles, engineered for sports, walking, and daily casual wear.',
    price: 2600,
    stock: 50,
    availability: 'Available',
    featured: false,
    isNew: true,
    badge: 'Comfort',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Upper': 'Breathable Engineered Knit Mesh',
      'Outsole': 'Lightweight Shock-Absorb EVA',
      'Gender': 'Unisex'
    },
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Red/Black', 'White/Grey', 'All Black'],
    tags: ['Shoes', 'Sneakers', 'Sport', 'Casual'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Materials
  {
    id: 'prod-009',
    name: 'Premium Polished Porcelain Floor Tiles (60x60 cm)',
    sku: 'MS-MAT-001',
    categoryId: 'cat-materials',
    categoryName: 'Materials',
    brand: 'Mercy Build',
    shortDescription: 'Durable, high-gloss glazed porcelain tiles for interior floors.',
    description: 'High-grade stain-resistant porcelain tiles perfect for residential living rooms, commercial spaces, and decorative interior flooring projects.',
    price: 2400,
    stock: 500,
    availability: 'Available',
    featured: true,
    isNew: false,
    badge: 'Top Choice',
    images: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Dimensions': '60 cm x 60 cm x 10 mm',
      'Coverage': '1.44 sq meters per box (4 pcs)',
      'Finish': 'High Gloss Polished Marble Effect'
    },
    sizes: ['60x60 cm', '80x80 cm'],
    colors: ['Carrara White', 'Beige Marble'],
    tags: ['Building Supplies', 'Tiles', 'Materials'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-006',
    name: 'Solid Brass Plumbing Valve & Fitting Set',
    sku: 'MS-MAT-003',
    categoryId: 'cat-materials',
    categoryName: 'Materials',
    brand: 'Mercy Hardware',
    shortDescription: 'Corrosion-resistant brass ball valves and pipe connectors.',
    description: 'Precision-engineered lead-free brass valves and plumbing adapters suitable for residential and commercial water distribution lines.',
    price: 1200,
    stock: 120,
    availability: 'Available',
    featured: false,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Thread Size': '1/2 Inch, 3/4 Inch',
      'Pressure Rating': 'PN25',
      'Material': 'Solid Brass'
    },
    sizes: ['1/2"', '3/4"', '1"'],
    tags: ['Plumbing', 'Hardware', 'Building Supplies'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Other Products / Household
  {
    id: 'prod-007',
    name: 'Multi-Purpose Eco-Friendly Household Cleanser 5L',
    sku: 'MS-OTH-001',
    categoryId: 'cat-other',
    categoryName: 'Other Products',
    brand: 'Mercy Clean',
    shortDescription: 'Concentrated non-toxic multi-surface liquid cleaner.',
    description: 'Gentle on hands yet tough on grease and stains. Formulated for countertops, glass, tile floors, and general home and shop sanitization.',
    price: 450,
    stock: 80,
    availability: 'Available',
    featured: false,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Volume': '5 Liters',
      'Scent': 'Fresh Citrus',
      'Formula': 'Biodegradable'
    },
    sizes: ['1L', '5L'],
    tags: ['Household', 'Cleaning', 'General Merchandise'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-008',
    name: 'Stainless Steel Modular Kitchen Shelf Organizer',
    sku: 'MS-OTH-002',
    categoryId: 'cat-other',
    categoryName: 'Other Products',
    brand: 'Mercy Home',
    shortDescription: 'Rust-proof multi-tier countertop storage unit.',
    description: 'Heavy-duty stainless steel organization rack with adjustable tier heights, cutlery holders, and non-slip rubber feet.',
    price: 1850,
    discountPrice: 1650,
    stock: 15,
    availability: 'Available',
    featured: true,
    isNew: true,
    badge: 'Home Essential',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: {
      'Material': '304 Stainless Steel',
      'Tiers': '3 Tiers',
      'Dimensions': '45cm x 28cm x 60cm'
    },
    colors: ['Silver', 'Black Matte'],
    tags: ['Household', 'Organizer', 'Kitchen'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-01',
    title: 'Product Supply',
    shortDescription: 'Reliable supply of materials, cosmetics, and merchandise.',
    fullDescription: 'Mercy Shopes supplies high-quality products and materials directly to individuals, homes, contractors, and retail shops with guaranteed authenticity.',
    iconName: 'PackageCheck',
    features: ['Sourced from trusted manufacturers', 'Quality check before delivery', 'Flexible order sizes'],
    status: 'active'
  },
  {
    id: 'srv-02',
    title: 'Bulk Orders',
    shortDescription: 'Competitive pricing and dedicated handling for large quantities.',
    fullDescription: 'Planning a large construction project or stocking your retail store? Send us your bulk product requirements for special wholesale rates.',
    iconName: 'Boxes',
    features: ['Discounted bulk pricing', 'Custom packing & staging', 'Scheduled batch dispatches'],
    status: 'active'
  },
  {
    id: 'srv-03',
    title: 'Product Inquiry',
    shortDescription: 'Instant direct inquiries via website and Telegram notifications.',
    fullDescription: 'Easily request specific product details, stock availability, customized sizing, or custom quotes with a single click.',
    iconName: 'MessageSquareText',
    features: ['Instant inquiry submission', 'Direct Telegram notification routing', 'Fast phone/WhatsApp follow-up'],
    status: 'active'
  },
  {
    id: 'srv-04',
    title: 'Business Supply',
    shortDescription: 'B2B supply contracts for commercial enterprises and offices.',
    fullDescription: 'Tailored product sourcing for businesses, beauty salons, maintenance companies, and institutions requiring recurring material supply.',
    iconName: 'Building2',
    features: ['Invoicing support', 'Dedicated account coordinator', 'Custom product sourcing'],
    status: 'active'
  },
  {
    id: 'srv-05',
    title: 'Customer Support',
    shortDescription: 'Friendly guidance to help you choose the right product.',
    fullDescription: 'Our experienced staff at Maxico Shabele offer expert recommendations on product usage, specifications, and compatibility.',
    iconName: 'Headphones',
    features: ['Expert product guidance', 'In-person & remote assistance', 'Transparent order tracking'],
    status: 'active'
  },
  {
    id: 'srv-06',
    title: 'Special Requests',
    shortDescription: 'Sourcing specialized materials or cosmetics on request.',
    fullDescription: 'Can’t find a specific building material, shade of cosmetic, or hard-to-find item? Let Mercy Shopes source it for you through our direct network.',
    iconName: 'Sparkles',
    features: ['Custom item lookup', 'Fast procurement cycle', 'Pre-order confirmation'],
    status: 'active'
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Cosmetics & Skincare Display',
    description: 'High quality beauty products and skincare items in stock at Mercy Shopes.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    category: 'Products',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-02',
    title: 'Building Materials & Hardware Inventory',
    description: 'Supplies ready for pickup and dispatch at Maxico Shabele.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    category: 'Store',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-03',
    title: 'Premium Porcelain Floor Tiles Sourcing',
    description: 'Inspecting tile finishes for customer order fulfillment.',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80',
    category: 'Products',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-04',
    title: 'Household & Kitchen Goods Section',
    description: 'Selected merchandise for modern home convenience.',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80',
    category: 'Behind the Scenes',
    status: 'published',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-01',
    title: 'Commercial Building Flooring Supply',
    description: 'Supplied 1,200 sq meters of premium polished porcelain floor tiles to a modern commercial center at Maxico Shabele.',
    location: 'Maxico Shabele, Addis Ababa',
    date: 'July 2026',
    category: 'Supply Projects',
    images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80'],
    status: 'Completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj-02',
    title: 'Beauty Salon Retail Sourcing Package',
    description: 'Provided wholesale cosmetics, skincare sets, and hair care products for a premiere beauty parlor.',
    location: 'Addis Ababa',
    date: 'August 2026',
    category: 'Business Projects',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'],
    status: 'Completed',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-01',
  name: 'Mercy Shopes Admin',
  email: 'admin@mercyshopes.com',
  role: 'superadmin',
  createdAt: new Date().toISOString()
};

class Store {
  private data: DBData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DBData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);

        let loadedCategories: Category[] = parsed.categories || [];
        // Ensure standard categories exist
        for (const defaultCat of DEFAULT_CATEGORIES) {
          if (!loadedCategories.some(c => c.id === defaultCat.id || c.name.toLowerCase() === defaultCat.name.toLowerCase())) {
            loadedCategories.push(defaultCat);
          }
        }

        let loadedProducts: Product[] = parsed.products || [];
        // Ensure default products exist
        for (const defaultProd of DEFAULT_PRODUCTS) {
          if (!loadedProducts.some(p => p.id === defaultProd.id)) {
            loadedProducts.push(defaultProd);
          }
        }

        const data: DBData = {
          adminUsers: parsed.adminUsers || [DEFAULT_ADMIN],
          categories: loadedCategories,
          products: loadedProducts,
          inquiries: parsed.inquiries || [],
          customers: parsed.customers || [],
          gallery: parsed.gallery || DEFAULT_GALLERY,
          projects: parsed.projects || DEFAULT_PROJECTS,
          services: parsed.services || DEFAULT_SERVICES,
          messages: parsed.messages || [],
          siteSettings: {
            ...DEFAULT_SETTINGS,
            ...(parsed.siteSettings || {}),
            socialLinks: {
              ...DEFAULT_SETTINGS.socialLinks,
              telegram: 'https://t.me/Mercyyy_07',
              ...((parsed.siteSettings && parsed.siteSettings.socialLinks) || {})
            }
          },
          adminPasswords: parsed.adminPasswords || {
            'admin-01': hashPassword('admin123')
          }
        };

        this.saveData(data);
        return data;
      }
    } catch (e) {
      console.error('Error reading data file, re-initializing store:', e);
    }

    const initialData: DBData = {
      adminUsers: [DEFAULT_ADMIN],
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      inquiries: [],
      customers: [],
      gallery: DEFAULT_GALLERY,
      projects: DEFAULT_PROJECTS,
      services: DEFAULT_SERVICES,
      messages: [],
      siteSettings: DEFAULT_SETTINGS,
      adminPasswords: {
        'admin-01': hashPassword('admin123')
      }
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave?: DBData): void {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing database file:', e);
    }
  }

  // --- Site Settings ---
  getSettings(): SiteSettings {
    return this.data.siteSettings;
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.siteSettings = { ...this.data.siteSettings, ...settings };
    this.saveData();
    return this.data.siteSettings;
  }

  // --- Admin Auth ---
  getAdminByEmail(email: string): AdminUser | undefined {
    return this.data.adminUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  getAdminById(id: string): AdminUser | undefined {
    return this.data.adminUsers.find(u => u.id === id);
  }

  verifyAdminPassword(userId: string, pass: string): boolean {
    const hashed = this.data.adminPasswords[userId];
    if (!hashed) return false;
    return hashed === hashPassword(pass);
  }

  updateAdminPassword(userId: string, newPass: string): void {
    this.data.adminPasswords[userId] = hashPassword(newPass);
    this.saveData();
  }

  getAdminUsers(): AdminUser[] {
    return this.data.adminUsers;
  }

  addAdminUser(user: Omit<AdminUser, 'id' | 'createdAt'>, pass: string): AdminUser {
    const newUser: AdminUser = {
      ...user,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.adminUsers.push(newUser);
    this.data.adminPasswords[newUser.id] = hashPassword(pass);
    this.saveData();
    return newUser;
  }

  deleteAdminUser(id: string): boolean {
    if (this.data.adminUsers.length <= 1) return false; // Prevent removing last admin
    this.data.adminUsers = this.data.adminUsers.filter(u => u.id !== id);
    delete this.data.adminPasswords[id];
    this.saveData();
    return true;
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  getCategoryById(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id);
  }

  createCategory(cat: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    
    // Sync category name to products if changed
    if (updates.name) {
      this.data.products.forEach(p => {
        if (p.categoryId === id) {
          p.categoryName = updates.name;
        }
      });
    }

    this.saveData();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Products ---
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const cat = this.getCategoryById(prod.categoryId);
    const newProduct: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      categoryName: cat ? cat.name : 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    if (updates.categoryId) {
      const cat = this.getCategoryById(updates.categoryId);
      if (cat) updates.categoryName = cat.name;
    }

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const len = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Inquiries ---
  getInquiries(): Inquiry[] {
    return this.data.inquiries;
  }

  getInquiryById(id: string): Inquiry | undefined {
    return this.data.inquiries.find(i => i.id === id || i.inquiryNumber === id);
  }

  createInquiry(inquiryData: Omit<Inquiry, 'id' | 'inquiryNumber' | 'status' | 'createdAt' | 'updatedAt'>): Inquiry {
    const count = this.data.inquiries.length + 1;
    const inquiryNumber = `#MS-${String(count).padStart(6, '0')}`;
    
    let prodName = inquiryData.productName;
    let prodCategory = inquiryData.productCategory;

    if (inquiryData.productId && (!prodName || !prodCategory)) {
      const p = this.getProductById(inquiryData.productId);
      if (p) {
        prodName = p.name;
        prodCategory = p.categoryName;
      }
    }

    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      inquiryNumber,
      productName: prodName,
      productCategory: prodCategory,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.inquiries.unshift(newInquiry);

    // Update / Record Customer Record automatically
    this.upsertCustomer(newInquiry);

    this.saveData();
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: Inquiry['status'], adminNotes?: string): Inquiry | null {
    const idx = this.data.inquiries.findIndex(i => i.id === id || i.inquiryNumber === id);
    if (idx === -1) return null;

    this.data.inquiries[idx].status = status;
    if (adminNotes !== undefined) {
      this.data.inquiries[idx].adminNotes = adminNotes;
    }
    this.data.inquiries[idx].updatedAt = new Date().toISOString();
    this.saveData();
    return this.data.inquiries[idx];
  }

  deleteInquiry(id: string): boolean {
    const len = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter(i => i.id !== id && i.inquiryNumber !== id);
    if (this.data.inquiries.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Customers ---
  getCustomers(): Customer[] {
    return this.data.customers;
  }

  private upsertCustomer(inquiry: Inquiry): void {
    const phone = inquiry.phone.trim();
    const existing = this.data.customers.find(
      c => c.phone === phone || (inquiry.email && c.email.toLowerCase() === inquiry.email.toLowerCase())
    );

    if (existing) {
      existing.fullName = inquiry.customerName;
      if (inquiry.telegramUsername) existing.telegramUsername = inquiry.telegramUsername;
      if (inquiry.email) existing.email = inquiry.email;
      if (inquiry.location) existing.location = inquiry.location;
      existing.totalInquiries += 1;
      existing.lastInquiryDate = inquiry.createdAt;
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        fullName: inquiry.customerName,
        phone: inquiry.phone,
        telegramUsername: inquiry.telegramUsername,
        email: inquiry.email,
        location: inquiry.location,
        totalInquiries: 1,
        lastInquiryDate: inquiry.createdAt,
        createdAt: inquiry.createdAt
      };
      this.data.customers.unshift(newCustomer);
    }
  }

  // --- Gallery ---
  getGallery(): GalleryItem[] {
    return this.data.gallery;
  }

  createGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.gallery.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
    const idx = this.data.gallery.findIndex(g => g.id === id);
    if (idx === -1) return null;
    this.data.gallery[idx] = { ...this.data.gallery[idx], ...updates };
    this.saveData();
    return this.data.gallery[idx];
  }

  deleteGalleryItem(id: string): boolean {
    const len = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    if (this.data.gallery.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Projects ---
  getProjects(): ProjectItem[] {
    return this.data.projects;
  }

  createProject(proj: Omit<ProjectItem, 'id' | 'createdAt'>): ProjectItem {
    const newProj: ProjectItem = {
      ...proj,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.projects.unshift(newProj);
    this.saveData();
    return newProj;
  }

  updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
    this.saveData();
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const len = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Services ---
  getServices(): ServiceItem[] {
    return this.data.services;
  }

  createService(srv: Omit<ServiceItem, 'id'>): ServiceItem {
    const newSrv: ServiceItem = {
      ...srv,
      id: `srv-${Date.now()}`
    };
    this.data.services.push(newSrv);
    this.saveData();
    return newSrv;
  }

  updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.saveData();
    return this.data.services[idx];
  }

  deleteService(id: string): boolean {
    const len = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Contact Messages ---
  getMessages(): ContactMessage[] {
    return this.data.messages;
  }

  createMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    this.data.messages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }

  updateMessageStatus(id: string, status: ContactMessage['status']): ContactMessage | null {
    const idx = this.data.messages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.messages[idx].status = status;
    this.saveData();
    return this.data.messages[idx];
  }

  deleteMessage(id: string): boolean {
    const len = this.data.messages.length;
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    if (this.data.messages.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }
}

export const store = new Store();
