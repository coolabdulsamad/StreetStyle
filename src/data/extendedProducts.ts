
import { Product, ProductCategory } from '@/types/product';

// Categories definition moved here to avoid circular dependency
export const CATEGORIES: ProductCategory[] = [
  { id: '1', name: 'Sneakers', slug: 'sneakers', description: 'Premium sneakers and athletic footwear' },
  { id: '2', name: 'Hoodies', slug: 'hoodies', description: 'Comfortable and stylish hoodies' },
  { id: '3', name: 'T-Shirts', slug: 't-shirts', description: 'Trendy t-shirts and tops' },
  { id: '4', name: 'Jackets', slug: 'jackets', description: 'Stylish jackets and outerwear' },
  { id: '5', name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and gear' },
];

// Extended product catalog with working image URLs
export const EXTENDED_PRODUCTS: Product[] = [
  // Sneakers
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG Chicago',
    slug: 'air-jordan-1-retro-high-og-chicago',
    description: 'The Air Jordan 1 Retro High OG brings back the classic Chicago colorway with premium leather construction and iconic design elements.',
    price: 179.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Nike',
    sku: 'AJ1-CHI',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 15,
    average_rating: 4.8,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '2',
    name: 'Nike Dunk Low Retro White Black',
    slug: 'nike-dunk-low-retro-white-black',
    description: 'Classic Nike Dunk Low in the timeless White/Black colorway. Perfect for everyday wear with premium leather construction.',
    price: 109.99,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Nike',
    sku: 'DUNK-WB',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 15,
    average_rating: 4.5,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '3',
    name: 'Yeezy 350 V2 Zebra',
    slug: 'yeezy-350-v2-zebra',
    description: 'Adidas Yeezy Boost 350 V2 in the iconic Zebra colorway. Features Primeknit upper and Boost midsole technology.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Adidas',
    sku: 'YZY-ZEB',
    gender: 'unisex',
    is_limited_edition: true,
    is_limited: true,
    is_sale: false,
    stock_quantity: 3,
    average_rating: 4.9,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '4',
    name: 'Off-White x Nike Air Force 1 Low',
    slug: 'off-white-nike-air-force-1-low',
    description: 'Collaboration between Off-White and Nike featuring deconstructed design elements and signature Off-White aesthetic.',
    price: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Nike',
    sku: 'OW-AF1',
    gender: 'unisex',
    is_limited_edition: true,
    is_limited: true,
    is_sale: false,
    stock_quantity: 1,
    average_rating: 4.7,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '5',
    name: 'New Balance 550 White Green',
    slug: 'new-balance-550-white-green',
    description: 'Retro basketball silhouette with premium leather upper and classic New Balance styling.',
    price: 119.99,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'New Balance',
    sku: 'NB550-WG',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 8,
    average_rating: 4.4,
    release_date: null,
    meta_title: null,
    meta_description: null,
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
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Fear of God',
    sku: 'FOG-HOOD-OAT',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 12,
    average_rating: 4.6,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '7',
    name: 'Supreme Box Logo Hoodie Black',
    slug: 'supreme-box-logo-hoodie-black',
    description: 'Iconic Supreme Box Logo hoodie in black. Made from heavyweight cotton fleece with embroidered logo.',
    price: 899.99,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Supreme',
    sku: 'SUP-BOX-BLK',
    gender: 'unisex',
    is_limited_edition: true,
    is_limited: true,
    is_sale: false,
    stock_quantity: 2,
    average_rating: 4.8,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '8',
    name: 'Stussy 8 Ball Hoodie',
    slug: 'stussy-8-ball-hoodie',
    description: 'Classic Stussy hoodie featuring the iconic 8-ball graphic on front and back.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Stussy',
    sku: 'STY-8B-BLK',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 15,
    average_rating: 4.3,
    release_date: null,
    meta_title: null,
    meta_description: null,
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
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Kith',
    sku: 'KITH-MP-WHT',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 20,
    average_rating: 4.5,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '10',
    name: 'Off-White Caravaggio Tee',
    slug: 'off-white-caravaggio-tee',
    description: 'Off-White graphic tee featuring Caravaggio artwork with signature arrow motifs.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Off-White',
    sku: 'OW-CAR-BLK',
    gender: 'unisex',
    is_limited_edition: true,
    is_limited: true,
    is_sale: false,
    stock_quantity: 6,
    average_rating: 4.7,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '11',
    name: 'Travis Scott x Nike Air Max 1',
    slug: 'travis-scott-nike-air-max-1',
    description: 'Collaboration between Travis Scott and Nike featuring reverse Swoosh and earthy colorway.',
    price: 799.99,
    images: [
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Nike',
    sku: 'TS-AM1-BT',
    gender: 'unisex',
    is_limited_edition: true,
    is_limited: true,
    is_sale: false,
    stock_quantity: 2,
    average_rating: 4.9,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  },
  {
    id: '12',
    name: 'Stone Island Shadow Project Hoodie',
    slug: 'stone-island-shadow-project-hoodie',
    description: 'Technical hoodie from Stone Island Shadow Project with advanced fabric technology.',
    price: 449.99,
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    brand: 'Stone Island',
    sku: 'SI-SP-BLK',
    gender: 'unisex',
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 4,
    average_rating: 4.6,
    release_date: null,
    meta_title: null,
    meta_description: null,
    reviews: []
  }
];
