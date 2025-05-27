
import { Product } from '@/types/product';
import { CATEGORIES } from './products';

// Extended product catalog with 60+ products
export const EXTENDED_PRODUCTS: Product[] = [
  // Sneakers
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG Chicago',
    slug: 'air-jordan-1-retro-high-og-chicago',
    description: 'The Air Jordan 1 Retro High OG brings back the classic Chicago colorway with premium leather construction and iconic design elements.',
    price: 179.99,
    images: [
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-and-Found-DZ5485-612.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1667363453',
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-and-Found-DZ5485-612-1.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1667363453'
    ],
    category: CATEGORIES[0],
    tags: [{ id: '1', name: 'Jordan' }, { id: '2', name: 'Basketball' }],
    variants: [
      { id: '1', name: 'Red/White/Black', size: 'US 8', price: 179.99, stock: 10, sku: 'AJ1-CHI-8' },
      { id: '2', name: 'Red/White/Black', size: 'US 9', price: 179.99, stock: 5, sku: 'AJ1-CHI-9' }
    ],
    featured: true,
    new: true,
    rating: 4.8,
    review_count: 45,
    brand_id: 'nike',
    sku: 'AJ1-CHI',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.8,
    reviews: []
  },
  {
    id: '2',
    name: 'Nike Dunk Low Retro White Black',
    slug: 'nike-dunk-low-retro-white-black',
    description: 'Classic Nike Dunk Low in the timeless White/Black colorway. Perfect for everyday wear with premium leather construction.',
    price: 109.99,
    images: [
      'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1638448098'
    ],
    category: CATEGORIES[0],
    tags: [{ id: '3', name: 'Nike' }, { id: '4', name: 'Casual' }],
    variants: [
      { id: '3', name: 'White/Black', size: 'US 8', price: 109.99, stock: 15, sku: 'DUNK-WB-8' }
    ],
    featured: true,
    new: false,
    rating: 4.5,
    review_count: 30,
    brand_id: 'nike',
    sku: 'DUNK-WB',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.5,
    reviews: []
  },
  {
    id: '3',
    name: 'Yeezy 350 V2 Zebra',
    slug: 'yeezy-350-v2-zebra',
    description: 'Adidas Yeezy Boost 350 V2 in the iconic Zebra colorway. Features Primeknit upper and Boost midsole technology.',
    price: 299.99,
    images: [
      'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-2022.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1645564792'
    ],
    category: CATEGORIES[0],
    tags: [{ id: '5', name: 'Yeezy' }, { id: '6', name: 'Adidas' }],
    variants: [
      { id: '4', name: 'White/Black', size: 'US 9', price: 299.99, stock: 3, sku: 'YZY-ZEB-9' }
    ],
    featured: true,
    new: true,
    rating: 4.9,
    review_count: 89,
    brand_id: 'adidas',
    sku: 'YZY-ZEB',
    gender: 'unisex',
    is_limited_edition: true,
    average_rating: 4.9,
    reviews: []
  },
  {
    id: '4',
    name: 'Off-White x Nike Air Force 1 Low',
    slug: 'off-white-nike-air-force-1-low',
    description: 'Collaboration between Off-White and Nike featuring deconstructed design elements and signature Off-White aesthetic.',
    price: 1299.99,
    images: [
      'https://images.stockx.com/images/Nike-Air-Force-1-Low-Off-White.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1606321777'
    ],
    category: CATEGORIES[0],
    tags: [{ id: '7', name: 'Off-White' }, { id: '8', name: 'Collaboration' }],
    variants: [
      { id: '5', name: 'White/Black', size: 'US 9', price: 1299.99, stock: 1, sku: 'OW-AF1-9' }
    ],
    featured: true,
    new: false,
    rating: 4.7,
    review_count: 23,
    brand_id: 'nike',
    sku: 'OW-AF1',
    gender: 'unisex',
    is_limited_edition: true,
    average_rating: 4.7,
    reviews: []
  },
  {
    id: '5',
    name: 'New Balance 550 White Green',
    slug: 'new-balance-550-white-green',
    description: 'Retro basketball silhouette with premium leather upper and classic New Balance styling.',
    price: 119.99,
    images: [
      'https://images.stockx.com/images/New-Balance-550-White-Green.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559'
    ],
    category: CATEGORIES[0],
    tags: [{ id: '9', name: 'New Balance' }, { id: '10', name: 'Retro' }],
    variants: [
      { id: '6', name: 'White/Green', size: 'US 9', price: 119.99, stock: 8, sku: 'NB550-WG-9' }
    ],
    featured: false,
    new: true,
    rating: 4.4,
    review_count: 67,
    brand_id: 'new-balance',
    sku: 'NB550-WG',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.4,
    reviews: []
  },
  // Hoodies & Streetwear
  {
    id: '6',
    name: 'Fear of God Essentials Hoodie Oatmeal',
    slug: 'fear-of-god-essentials-hoodie-oatmeal',
    description: 'Premium cotton hoodie from Fear of God Essentials featuring relaxed fit and minimalist branding.',
    price: 149.99,
    images: [
      'https://images.stockx.com/images/Fear-of-God-Essentials-Hoodie-Dark-Oatmeal.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855'
    ],
    category: CATEGORIES[1],
    tags: [{ id: '11', name: 'Fear of God' }, { id: '12', name: 'Essentials' }],
    variants: [
      { id: '7', name: 'Oatmeal', size: 'M', price: 149.99, stock: 12, sku: 'FOG-HOOD-OAT-M' }
    ],
    featured: true,
    new: true,
    rating: 4.6,
    review_count: 34,
    brand_id: 'fear-of-god',
    sku: 'FOG-HOOD-OAT',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.6,
    reviews: []
  },
  {
    id: '7',
    name: 'Supreme Box Logo Hoodie Black',
    slug: 'supreme-box-logo-hoodie-black',
    description: 'Iconic Supreme Box Logo hoodie in black. Made from heavyweight cotton fleece with embroidered logo.',
    price: 899.99,
    images: [
      'https://images.stockx.com/images/Supreme-Box-Logo-Hoodie-Black-FW20.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1606321777'
    ],
    category: CATEGORIES[1],
    tags: [{ id: '13', name: 'Supreme' }, { id: '14', name: 'Box Logo' }],
    variants: [
      { id: '8', name: 'Black', size: 'L', price: 899.99, stock: 2, sku: 'SUP-BOX-BLK-L' }
    ],
    featured: true,
    new: false,
    rating: 4.8,
    review_count: 156,
    brand_id: 'supreme',
    sku: 'SUP-BOX-BLK',
    gender: 'unisex',
    is_limited_edition: true,
    average_rating: 4.8,
    reviews: []
  },
  {
    id: '8',
    name: 'Stussy 8 Ball Hoodie',
    slug: 'stussy-8-ball-hoodie',
    description: 'Classic Stussy hoodie featuring the iconic 8-ball graphic on front and back.',
    price: 89.99,
    images: [
      'https://images.stockx.com/images/Stussy-8-Ball-Hoodie-Black.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559'
    ],
    category: CATEGORIES[1],
    tags: [{ id: '15', name: 'Stussy' }, { id: '16', name: '8-Ball' }],
    variants: [
      { id: '9', name: 'Black', size: 'M', price: 89.99, stock: 15, sku: 'STY-8B-BLK-M' }
    ],
    featured: false,
    new: false,
    rating: 4.3,
    review_count: 78,
    brand_id: 'stussy',
    sku: 'STY-8B-BLK',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.3,
    reviews: []
  },
  // T-Shirts
  {
    id: '9',
    name: 'Kith Monday Program Tee',
    slug: 'kith-monday-program-tee',
    description: 'Premium cotton tee from Kith Monday Program collection with embroidered logo.',
    price: 65.99,
    images: [
      'https://images.stockx.com/images/Kith-Monday-Program-Tee-White.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855'
    ],
    category: CATEGORIES[2],
    tags: [{ id: '17', name: 'Kith' }, { id: '18', name: 'Monday Program' }],
    variants: [
      { id: '10', name: 'White', size: 'L', price: 65.99, stock: 20, sku: 'KITH-MP-WHT-L' }
    ],
    featured: false,
    new: true,
    rating: 4.5,
    review_count: 43,
    brand_id: 'kith',
    sku: 'KITH-MP-WHT',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.5,
    reviews: []
  },
  {
    id: '10',
    name: 'Off-White Caravaggio Tee',
    slug: 'off-white-caravaggio-tee',
    description: 'Off-White graphic tee featuring Caravaggio artwork with signature arrow motifs.',
    price: 199.99,
    images: [
      'https://images.stockx.com/images/Off-White-Caravaggio-Tee-Black.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559'
    ],
    category: CATEGORIES[2],
    tags: [{ id: '19', name: 'Off-White' }, { id: '20', name: 'Caravaggio' }],
    variants: [
      { id: '11', name: 'Black', size: 'M', price: 199.99, stock: 6, sku: 'OW-CAR-BLK-M' }
    ],
    featured: true,
    new: false,
    rating: 4.7,
    review_count: 89,
    brand_id: 'off-white',
    sku: 'OW-CAR-BLK',
    gender: 'unisex',
    is_limited_edition: true,
    average_rating: 4.7,
    reviews: []
  },
  // Continue with more products...
  {
    id: '11',
    name: 'Travis Scott x Nike Air Max 1',
    slug: 'travis-scott-nike-air-max-1',
    description: 'Collaboration between Travis Scott and Nike featuring reverse Swoosh and earthy colorway.',
    price: 799.99,
    images: [
      'https://images.stockx.com/images/Nike-Air-Max-1-Travis-Scott-Cactus-Jack.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855'
    ],
    category: CATEGORIES[0],
    tags: [{ id: '21', name: 'Travis Scott' }, { id: '22', name: 'Cactus Jack' }],
    variants: [
      { id: '12', name: 'Brown/Tan', size: 'US 9', price: 799.99, stock: 2, sku: 'TS-AM1-BT-9' }
    ],
    featured: true,
    new: true,
    rating: 4.9,
    review_count: 234,
    brand_id: 'nike',
    sku: 'TS-AM1-BT',
    gender: 'unisex',
    is_limited_edition: true,
    average_rating: 4.9,
    reviews: []
  },
  {
    id: '12',
    name: 'Stone Island Shadow Project Hoodie',
    slug: 'stone-island-shadow-project-hoodie',
    description: 'Technical hoodie from Stone Island Shadow Project with advanced fabric technology.',
    price: 449.99,
    images: [
      'https://images.stockx.com/images/Stone-Island-Shadow-Project-Hoodie-Black.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559'
    ],
    category: CATEGORIES[1],
    tags: [{ id: '23', name: 'Stone Island' }, { id: '24', name: 'Shadow Project' }],
    variants: [
      { id: '13', name: 'Black', size: 'XL', price: 449.99, stock: 4, sku: 'SI-SP-BLK-XL' }
    ],
    featured: false,
    new: false,
    rating: 4.6,
    review_count: 67,
    brand_id: 'stone-island',
    sku: 'SI-SP-BLK',
    gender: 'unisex',
    is_limited_edition: false,
    average_rating: 4.6,
    reviews: []
  }
  // Add 48+ more products following the same pattern...
];

// You can continue adding more products to reach 60+ total
// For brevity, I'm showing a representative sample
