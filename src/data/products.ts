import { Product, ProductCategory } from '../types/product';

export const CATEGORIES: ProductCategory[] = [
  { id: 'sneakers', name: 'Sneakers', slug: 'sneakers' },
  { id: 'hoodies', name: 'Hoodies', slug: 'hoodies' },
  { id: 't-shirts', name: 'T-Shirts', slug: 't-shirts' },
  { id: 'pants', name: 'Pants', slug: 'pants' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Air Max Pulse',
    slug: 'air-max-pulse',
    description: 'Introducing the Air Max Pulse. Loaded with energy, this new Air Max is inspired by the London music scene by delivering a tough, ready-for-anything silhouette rooted in UK rave culture. Its techy and utilitarian look doesn\'t skimp on durability, with tough, no-sew skins and durable mesh.',
    price: 150,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/150d8959-8917-4598-a657-c308acbfd3f0/air-max-pulse-mens-shoes-ShS3tL.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9802e886-8485-427d-8142-24bdb7282857/air-max-pulse-mens-shoes-ShS3tL.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/08557175-9fc4-4883-acce-30bab1b7aaee/air-max-pulse-mens-shoes-ShS3tL.png'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'running', name: 'Running' },
      { id: 'lifestyle', name: 'Lifestyle' }
    ],
    variants: [
      { id: '1-1', name: 'Black/White US 8', size: 'US 8', color: 'Black/White', price: 150, stock: 10, sku: 'AM-BW-8' },
      { id: '1-2', name: 'Black/White US 9', size: 'US 9', color: 'Black/White', price: 150, stock: 8, sku: 'AM-BW-9' },
      { id: '1-3', name: 'Black/White US 10', size: 'US 10', color: 'Black/White', price: 150, stock: 5, sku: 'AM-BW-10' },
      { id: '1-4', name: 'Gray/Red US 9', size: 'US 9', color: 'Gray/Red', price: 160, stock: 3, sku: 'AM-GR-9' }
    ],
    featured: true,
    rating: 4.8
  },
  {
    id: '7',
    name: 'Air Jordan 1 High',
    slug: 'air-jordan-1-high',
    description: 'The Air Jordan 1 High is the shoe that started it all. The iconic silhouette that launched the legendary Air Jordan franchise, featuring premium materials, classic colorways, and timeless style.',
    price: 180,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/97b2c644-8b98-4adb-9fe2-e85800e7e4a1/air-jordan-1-retro-high-og-mens-shoes-VdpsB7.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fb6a1bbb-4750-494a-9891-2cace13fef4d/air-jordan-1-retro-high-og-mens-shoes-VdpsB7.png'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'basketball', name: 'Basketball' },
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'retro', name: 'Retro' }
    ],
    variants: [
      { id: '7-1', name: 'Chicago US 8', size: 'US 8', color: 'Chicago', price: 180, stock: 4, sku: 'AJ1-CH-8' },
      { id: '7-2', name: 'Chicago US 9', size: 'US 9', color: 'Chicago', price: 180, stock: 7, sku: 'AJ1-CH-9' },
      { id: '7-3', name: 'Chicago US 10', size: 'US 10', color: 'Chicago', price: 180, stock: 2, sku: 'AJ1-CH-10' },
      { id: '7-4', name: 'Royal Blue US 9', size: 'US 9', color: 'Royal Blue', price: 180, stock: 5, sku: 'AJ1-RB-9' }
    ],
    featured: true,
    rating: 4.9
  },
  {
    id: '8',
    name: 'Yeezy Boost 350 V2',
    slug: 'yeezy-boost-350-v2',
    description: 'The Yeezy Boost 350 V2 features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper. Reflective threads are woven into the laces. The midsole utilizes adidas\' innovative BOOST™ technology.',
    price: 220,
    images: [
      'https://images.unsplash.com/photo-1584735175315-9d5b23704e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'limited', name: 'Limited Edition' }
    ],
    variants: [
      { id: '8-1', name: 'Zebra US 8', size: 'US 8', color: 'Zebra', price: 220, stock: 3, sku: 'YZY-ZB-8' },
      { id: '8-2', name: 'Zebra US 9', size: 'US 9', color: 'Zebra', price: 220, stock: 2, sku: 'YZY-ZB-9' },
      { id: '8-3', name: 'Beluga US 8', size: 'US 8', color: 'Beluga', price: 240, stock: 1, sku: 'YZY-BL-8' },
      { id: '8-4', name: 'Beluga US 9', size: 'US 9', color: 'Beluga', price: 240, stock: 2, sku: 'YZY-BL-9' }
    ],
    new: true,
    rating: 4.7
  },
  {
    id: '9',
    name: 'Air Force 1 Low',
    slug: 'air-force-1-low',
    description: 'The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.',
    price: 100,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/33533fe2-1157-4001-896e-1803b30659c8/air-force-1-07-mens-shoes-5QFp5Z.png'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'classic', name: 'Classic' }
    ],
    variants: [
      { id: '9-1', name: 'White US 8', size: 'US 8', color: 'White', price: 100, stock: 15, sku: 'AF1-W-8' },
      { id: '9-2', name: 'White US 9', size: 'US 9', color: 'White', price: 100, stock: 20, sku: 'AF1-W-9' },
      { id: '9-3', name: 'White US 10', size: 'US 10', color: 'White', price: 100, stock: 12, sku: 'AF1-W-10' },
      { id: '9-4', name: 'Black US 9', size: 'US 9', color: 'Black', price: 100, stock: 10, sku: 'AF1-B-9' }
    ],
    featured: true,
    rating: 4.8
  },
  {
    id: '10',
    name: 'Converse Chuck 70 High',
    slug: 'converse-chuck-70-high',
    description: 'The Converse Chuck 70 is a premium take on the classic Chuck Taylor All Star silhouette. Built with enhanced materials and cushioning, the Chuck 70 offers superior comfort and durability while maintaining the iconic look.',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'classic', name: 'Classic' }
    ],
    variants: [
      { id: '10-1', name: 'Black US 8', size: 'US 8', color: 'Black', price: 85, stock: 8, sku: 'CV70-B-8' },
      { id: '10-2', name: 'Black US 9', size: 'US 9', color: 'Black', price: 85, stock: 12, sku: 'CV70-B-9' },
      { id: '10-3', name: 'Parchment US 8', size: 'US 8', color: 'Parchment', price: 85, stock: 6, sku: 'CV70-P-8' },
      { id: '10-4', name: 'Parchment US 9', size: 'US 9', color: 'Parchment', price: 85, stock: 9, sku: 'CV70-P-9' }
    ],
    rating: 4.6
  },
  {
    id: '11',
    name: 'New Balance 550',
    slug: 'new-balance-550',
    description: 'The New Balance 550 is a basketball shoe that was originally released in 1989 and has been reintroduced to a new generation. With its clean, classic design and premium materials, the 550 has become a streetwear staple.',
    price: 110,
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'retro', name: 'Retro' }
    ],
    variants: [
      { id: '11-1', name: 'White/Green US 8', size: 'US 8', color: 'White/Green', price: 110, stock: 7, sku: 'NB550-WG-8' },
      { id: '11-2', name: 'White/Green US 9', size: 'US 9', color: 'White/Green', price: 110, stock: 11, sku: 'NB550-WG-9' },
      { id: '11-3', name: 'White/Red US 8', size: 'US 8', color: 'White/Red', price: 110, stock: 5, sku: 'NB550-WR-8' },
      { id: '11-4', name: 'White/Red US 9', size: 'US 9', color: 'White/Red', price: 110, stock: 8, sku: 'NB550-WR-9' }
    ],
    new: true,
    rating: 4.5
  },
  {
    id: '12',
    name: 'Tech Fleece Hoodie',
    slug: 'tech-fleece-hoodie',
    description: 'The Nike Tech Fleece Hoodie is made with a lightweight, low-profile fabric that helps manage heat without adding bulk. The soft, brushed interior adds cozy warmth, while the slim fit creates a streamlined look.',
    price: 130,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80'
    ],
    category: CATEGORIES[1],
    tags: [
      { id: 'technical', name: 'Technical' },
      { id: 'streetwear', name: 'Streetwear' }
    ],
    variants: [
      { id: '12-1', name: 'Black S', size: 'S', color: 'Black', price: 130, stock: 10, sku: 'TFH-B-S' },
      { id: '12-2', name: 'Black M', size: 'M', color: 'Black', price: 130, stock: 14, sku: 'TFH-B-M' },
      { id: '12-3', name: 'Black L', size: 'L', color: 'Black', price: 130, stock: 8, sku: 'TFH-B-L' },
      { id: '12-4', name: 'Dark Gray M', size: 'M', color: 'Dark Gray', price: 130, stock: 9, sku: 'TFH-DG-M' }
    ],
    featured: true,
    rating: 4.7
  },
  {
    id: '13',
    name: 'Vintage Wash Hoodie',
    slug: 'vintage-wash-hoodie',
    description: 'This premium heavyweight cotton hoodie features a unique vintage wash treatment, giving it a lived-in feel from day one. Relaxed fit with dropped shoulders for a modern silhouette.',
    price: 95,
    images: [
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1565693413579-8a060cb94e6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    category: CATEGORIES[1],
    tags: [
      { id: 'vintage', name: 'Vintage' },
      { id: 'essentials', name: 'Essentials' }
    ],
    variants: [
      { id: '13-1', name: 'Washed Black S', size: 'S', color: 'Washed Black', price: 95, stock: 7, sku: 'VWH-WB-S' },
      { id: '13-2', name: 'Washed Black M', size: 'M', color: 'Washed Black', price: 95, stock: 11, sku: 'VWH-WB-M' },
      { id: '13-3', name: 'Washed Blue S', size: 'S', color: 'Washed Blue', price: 95, stock: 5, sku: 'VWH-WBL-S' },
      { id: '13-4', name: 'Washed Blue M', size: 'M', color: 'Washed Blue', price: 95, stock: 8, sku: 'VWH-WBL-M' }
    ],
    new: true,
    rating: 4.6
  },
  {
    id: '14',
    name: 'Logo Print Hoodie',
    slug: 'logo-print-hoodie',
    description: 'A comfortable, relaxed-fit hoodie featuring bold logo graphics. Crafted from soft cotton blend with a brushed interior for extra warmth and comfort.',
    price: 70,
    images: [
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1644&q=80',
      'https://images.unsplash.com/photo-1611040027050-472a2f162958?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    category: CATEGORIES[1],
    tags: [
      { id: 'graphic', name: 'Graphic' },
      { id: 'essentials', name: 'Essentials' }
    ],
    variants: [
      { id: '14-1', name: 'Black S', size: 'S', color: 'Black', price: 70, stock: 12, sku: 'LPH-B-S' },
      { id: '14-2', name: 'Black M', size: 'M', color: 'Black', price: 70, stock: 18, sku: 'LPH-B-M' },
      { id: '14-3', name: 'Gray S', size: 'S', color: 'Gray', price: 70, stock: 10, sku: 'LPH-G-S' },
      { id: '14-4', name: 'Gray M', size: 'M', color: 'Gray', price: 70, stock: 15, sku: 'LPH-G-M' }
    ],
    rating: 4.4
  },
  {
    id: '15',
    name: 'Heavyweight Hoodie',
    slug: 'heavyweight-hoodie',
    description: 'This premium heavyweight hoodie is constructed from 14oz cotton for exceptional warmth and durability. Features a minimalist design with subtle embroidered details for a timeless look.',
    price: 110,
    images: [
      'https://images.unsplash.com/photo-1572495641004-28421ae29k57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    category: CATEGORIES[1],
    tags: [
      { id: 'premium', name: 'Premium' },
      { id: 'essentials', name: 'Essentials' }
    ],
    variants: [
      { id: '15-1', name: 'Forest Green S', size: 'S', color: 'Forest Green', price: 110, stock: 6, sku: 'HWH-FG-S' },
      { id: '15-2', name: 'Forest Green M', size: 'M', color: 'Forest Green', price: 110, stock: 9, sku: 'HWH-FG-M' },
      { id: '15-3', name: 'Navy S', size: 'S', color: 'Navy', price: 110, stock: 5, sku: 'HWH-N-S' },
      { id: '15-4', name: 'Navy M', size: 'M', color: 'Navy', price: 110, stock: 7, sku: 'HWH-N-M' }
    ],
    new: true,
    rating: 4.8
  },
  {
    id: '16',
    name: 'Artist Collab Tee',
    slug: 'artist-collab-tee',
    description: 'This limited edition t-shirt features original artwork from renowned street artist J.Maze. Each shirt is made from organic cotton and printed using eco-friendly water-based inks.',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[2],
    tags: [
      { id: 'limited', name: 'Limited Edition' },
      { id: 'graphic', name: 'Graphic' }
    ],
    variants: [
      { id: '16-1', name: 'White S', size: 'S', color: 'White', price: 65, stock: 4, sku: 'ACT-W-S' },
      { id: '16-2', name: 'White M', size: 'M', color: 'White', price: 65, stock: 7, sku: 'ACT-W-M' },
      { id: '16-3', name: 'White L', size: 'L', color: 'White', price: 65, stock: 3, sku: 'ACT-W-L' },
      { id: '16-4', name: 'Black M', size: 'M', color: 'Black', price: 65, stock: 5, sku: 'ACT-B-M' }
    ],
    featured: true,
    rating: 4.9
  },
  {
    id: '17',
    name: 'Essential Box Tee',
    slug: 'essential-box-tee',
    description: 'This relaxed-fit t-shirt is crafted from premium heavyweight cotton for superior comfort and durability. Features a minimalist box logo print and a classic, versatile design.',
    price: 40,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=927&q=80'
    ],
    category: CATEGORIES[2],
    tags: [
      { id: 'essentials', name: 'Essentials' },
      { id: 'premium', name: 'Premium' }
    ],
    variants: [
      { id: '17-1', name: 'White S', size: 'S', color: 'White', price: 40, stock: 15, sku: 'EBT-W-S' },
      { id: '17-2', name: 'White M', size: 'M', color: 'White', price: 40, stock: 20, sku: 'EBT-W-M' },
      { id: '17-3', name: 'Black S', size: 'S', color: 'Black', price: 40, stock: 12, sku: 'EBT-B-S' },
      { id: '17-4', name: 'Black M', size: 'M', color: 'Black', price: 40, stock: 18, sku: 'EBT-B-M' }
    ],
    rating: 4.5
  },
  {
    id: '18',
    name: 'Vintage Graphic Tee',
    slug: 'vintage-graphic-tee',
    description: 'Inspired by vintage band merchandise, this t-shirt features a distressed graphic print and a soft, pre-washed fabric for that perfectly broken-in feel from day one.',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
    ],
    category: CATEGORIES[2],
    tags: [
      { id: 'vintage', name: 'Vintage' },
      { id: 'graphic', name: 'Graphic' }
    ],
    variants: [
      { id: '18-1', name: 'Washed Black S', size: 'S', color: 'Washed Black', price: 45, stock: 8, sku: 'VGT-WB-S' },
      { id: '18-2', name: 'Washed Black M', size: 'M', color: 'Washed Black', price: 45, stock: 12, sku: 'VGT-WB-M' },
      { id: '18-3', name: 'Washed Red S', size: 'S', color: 'Washed Red', price: 45, stock: 6, sku: 'VGT-WR-S' },
      { id: '18-4', name: 'Washed Red M', size: 'M', color: 'Washed Red', price: 45, stock: 9, sku: 'VGT-WR-M' }
    ],
    new: true,
    rating: 4.6
  },
  {
    id: '19',
    name: 'Striped Long Sleeve Tee',
    slug: 'striped-long-sleeve-tee',
    description: 'This premium long sleeve t-shirt features classic horizontal stripes and is crafted from soft, medium-weight cotton. Perfect for layering or wearing on its own.',
    price: 55,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1604006852748-903fccbc4019?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    category: CATEGORIES[2],
    tags: [
      { id: 'essentials', name: 'Essentials' },
      { id: 'classic', name: 'Classic' }
    ],
    variants: [
      { id: '19-1', name: 'Navy/White S', size: 'S', color: 'Navy/White', price: 55, stock: 7, sku: 'SLS-NW-S' },
      { id: '19-2', name: 'Navy/White M', size: 'M', color: 'Navy/White', price: 55, stock: 11, sku: 'SLS-NW-M' },
      { id: '19-3', name: 'Black/Gray S', size: 'S', color: 'Black/Gray', price: 55, stock: 5, sku: 'SLS-BG-S' },
      { id: '19-4', name: 'Black/Gray M', size: 'M', color: 'Black/Gray', price: 55, stock: 8, sku: 'SLS-BG-M' }
    ],
    rating: 4.7
  },
  {
    id: '20',
    name: 'Cargo Pants',
    slug: 'cargo-pants',
    description: 'These utility cargo pants feature multiple pockets and a relaxed fit. Made from durable cotton twill with a subtle stonewash finish.',
    price: 90,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[3],
    tags: [
      { id: 'utility', name: 'Utility' },
      { id: 'streetwear', name: 'Streetwear' }
    ],
    variants: [
      { id: '20-1', name: 'Olive 30', size: '30', color: 'Olive', price: 90, stock: 10, sku: 'CP-O-30' },
      { id: '20-2', name: 'Olive 32', size: '32', color: 'Olive', price: 90, stock: 14, sku: 'CP-O-32' },
      { id: '20-3', name: 'Black 30', size: '30', color: 'Black', price: 90, stock: 8, sku: 'CP-B-30' },
      { id: '20-4', name: 'Black 32', size: '32', color: 'Black', price: 90, stock: 12, sku: 'CP-B-32' }
    ],
    featured: true,
    rating: 4.8
  },
  {
    id: '21',
    name: 'Relaxed Fit Jeans',
    slug: 'relaxed-fit-jeans',
    description: 'These premium denim jeans feature a relaxed fit and straight leg. Made from high-quality denim with a subtle wash and minimal distressing for a clean, versatile look.',
    price: 120,
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[3],
    tags: [
      { id: 'premium', name: 'Premium' },
      { id: 'classic', name: 'Classic' }
    ],
    variants: [
      { id: '21-1', name: 'Blue 30', size: '30', color: 'Blue', price: 120, stock: 8, sku: 'RFJ-BL-30' },
      { id: '21-2', name: 'Blue 32', size: '32', color: 'Blue', price: 120, stock: 12, sku: 'RFJ-BL-32' },
      { id: '21-3', name: 'Dark Blue 30', size: '30', color: 'Dark Blue', price: 120, stock: 7, sku: 'RFJ-DB-30' },
      { id: '21-4', name: 'Dark Blue 32', size: '32', color: 'Dark Blue', price: 120, stock: 11, sku: 'RFJ-DB-32' }
    ],
    rating: 4.5
  },
  {
    id: '22',
    name: 'Track Pants',
    slug: 'track-pants',
    description: 'These lightweight track pants feature a tapered fit with elastic waistband and ankle cuffs. Perfect for both athletic activity and casual wear.',
    price: 75,
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80'
    ],
    category: CATEGORIES[3],
    tags: [
      { id: 'athletic', name: 'Athletic' },
      { id: 'streetwear', name: 'Streetwear' }
    ],
    variants: [
      { id: '22-1', name: 'Black S', size: 'S', color: 'Black', price: 75, stock: 12, sku: 'TP-B-S' },
      { id: '22-2', name: 'Black M', size: 'M', color: 'Black', price: 75, stock: 18, sku: 'TP-B-M' },
      { id: '22-3', name: 'Navy S', size: 'S', color: 'Navy', price: 75, stock: 10, sku: 'TP-N-S' },
      { id: '22-4', name: 'Navy M', size: 'M', color: 'Navy', price: 75, stock: 15, sku: 'TP-N-M' }
    ],
    new: true,
    rating: 4.6
  },
  {
    id: '23',
    name: 'Distressed Denim',
    slug: 'distressed-denim',
    description: 'These premium distressed jeans feature a slim fit with strategic distressing and fading. Made from high-quality denim with added stretch for comfort.',
    price: 135,
    images: [
      'https://images.unsplash.com/photo-1600717535275-0b18ede2f7fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
    ],
    category: CATEGORIES[3],
    tags: [
      { id: 'premium', name: 'Premium' },
      { id: 'vintage', name: 'Vintage' }
    ],
    variants: [
      { id: '23-1', name: 'Light Blue 30', size: '30', color: 'Light Blue', price: 135, stock: 6, sku: 'DD-LB-30' },
      { id: '23-2', name: 'Light Blue 32', size: '32', color: 'Light Blue', price: 135, stock: 9, sku: 'DD-LB-32' },
      { id: '23-3', name: 'Medium Blue 30', size: '30', color: 'Medium Blue', price: 135, stock: 5, sku: 'DD-MB-30' },
      { id: '23-4', name: 'Medium Blue 32', size: '32', color: 'Medium Blue', price: 135, stock: 8, sku: 'DD-MB-32' }
    ],
    featured: true,
    rating: 4.7
  },
  {
    id: '24',
    name: 'Beanie',
    slug: 'beanie',
    description: 'This classic beanie is made from soft, warm acrylic yarn in a rib-knit construction. Features a subtle embroidered logo and cuffed design.',
    price: 30,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1545250288-9d7104767c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'essentials', name: 'Essentials' }
    ],
    variants: [
      { id: '24-1', name: 'Black', size: 'One Size', color: 'Black', price: 30, stock: 15, sku: 'BN-B-OS' },
      { id: '24-2', name: 'Gray', size: 'One Size', color: 'Gray', price: 30, stock: 12, sku: 'BN-G-OS' },
      { id: '24-3', name: 'Navy', size: 'One Size', color: 'Navy', price: 30, stock: 10, sku: 'BN-N-OS' }
    ],
    rating: 4.6
  },
  {
    id: '25',
    name: 'Leather Wallet',
    slug: 'leather-wallet',
    description: 'This premium leather wallet features a slim, bifold design with multiple card slots and a currency compartment. Made from full-grain vegetable-tanned leather that will develop a beautiful patina over time.',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1559694933-f1e98e6295c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1570183288337-a073f034f059?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'premium', name: 'Premium' }
    ],
    variants: [
      { id: '25-1', name: 'Black', size: 'One Size', color: 'Black', price: 85, stock: 8, sku: 'LW-B-OS' },
      { id: '25-2', name: 'Brown', size: 'One Size', color: 'Brown', price: 85, stock: 12, sku: 'LW-BR-OS' },
      { id: '25-3', name: 'Tan', size: 'One Size', color: 'Tan', price: 85, stock: 7, sku: 'LW-T-OS' }
    ],
    featured: true,
    rating: 4.8
  },
  {
    id: '26',
    name: 'Sports Cap',
    slug: 'sports-cap',
    description: 'This adjustable sports cap features a curved brim and embroidered logo. Made from lightweight cotton twill with a moisture-wicking sweatband for comfort during activity.',
    price: 35,
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'athletic', name: 'Athletic' }
    ],
    variants: [
      { id: '26-1', name: 'Black', size: 'One Size', color: 'Black', price: 35, stock: 12, sku: 'SC-B-OS' },
      { id: '26-2', name: 'Navy', size: 'One Size', color: 'Navy', price: 35, stock: 10, sku: 'SC-N-OS' },
      { id: '26-3', name: 'Red', size: 'One Size', color: 'Red', price: 35, stock: 8, sku: 'SC-R-OS' }
    ],
    rating: 4.5
  },
  {
    id: '27',
    name: 'Canvas Backpack',
    slug: 'canvas-backpack',
    description: 'This durable canvas backpack features multiple compartments, including a padded laptop sleeve. With leather trim details and metal hardware for a premium look and enhanced durability.',
    price: 95,
    images: [
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'premium', name: 'Premium' }
    ],
    variants: [
      { id: '27-1', name: 'Olive', size: 'One Size', color: 'Olive', price: 95, stock: 7, sku: 'CB-O-OS' },
      { id: '27-2', name: 'Black', size: 'One Size', color: 'Black', price: 95, stock: 9, sku: 'CB-B-OS' },
      { id: '27-3', name: 'Navy', size: 'One Size', color: 'Navy', price: 95, stock: 6, sku: 'CB-N-OS' }
    ],
    new: true,
    rating: 4.7
  },
  {
    id: '28',
    name: 'Waist Bag',
    slug: 'waist-bag',
    description: 'This versatile waist bag can be worn around the waist or as a crossbody. Features multiple zippered compartments and adjustable strap. Made from durable nylon with water-resistant coating.',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1620138546344-7b2c38516edf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1463&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'streetwear', name: 'Streetwear' }
    ],
    variants: [
      { id: '28-1', name: 'Black', size: 'One Size', color: 'Black', price: 45, stock: 10, sku: 'WB-B-OS' },
      { id: '28-2', name: 'Camo', size: 'One Size', color: 'Camo', price: 45, stock: 8, sku: 'WB-C-OS' },
      { id: '28-3', name: 'Red', size: 'One Size', color: 'Red', price: 45, stock: 6, sku: 'WB-R-OS' }
    ],
    featured: true,
    rating: 4.6
  },
  {
    id: '29',
    name: 'Bucket Hat',
    slug: 'bucket-hat',
    description: 'This classic bucket hat features a soft, cotton construction with a wider brim for sun protection. A versatile streetwear accessory that complements any casual outfit.',
    price: 40,
    images: [
      'https://images.unsplash.com/photo-1534215754734-5e82281412d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1428&q=80',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'streetwear', name: 'Streetwear' }
    ],
    variants: [
      { id: '29-1', name: 'Black', size: 'One Size', color: 'Black', price: 40, stock: 12, sku: 'BH-B-OS' },
      { id: '29-2', name: 'Khaki', size: 'One Size', color: 'Khaki', price: 40, stock: 10, sku: 'BH-K-OS' },
      { id: '29-3', name: 'Denim', size: 'One Size', color: 'Denim', price: 40, stock: 8, sku: 'BH-D-OS' }
    ],
    new: true,
    rating: 4.5
  },
  {
    id: '30',
    name: 'Air Max 97',
    slug: 'air-max-97',
    description: 'The Nike Air Max 97 keeps a sneaker icon going strong with the same design details that made it famous: water-ripple lines, reflective piping and full-length Max Air cushioning.',
    price: 175,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6d827858-c0b8-4091-bf5e-3b08312a4eda/air-max-97-mens-shoes-Qv2D8H.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1f66fdbe-636f-4a8d-ba51-fc5698c5e3d5/air-max-97-mens-shoes-Qv2D8H.png'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'running', name: 'Running' },
      { id: 'lifestyle', name: 'Lifestyle' }
    ],
    variants: [
      { id: '30-1', name: 'Silver Bullet US 8', size: 'US 8', color: 'Silver Bullet', price: 175, stock: 6, sku: 'AM97-SB-8' },
      { id: '30-2', name: 'Silver Bullet US 9', size: 'US 9', color: 'Silver Bullet', price: 175, stock: 9, sku: 'AM97-SB-9' },
      { id: '30-3', name: 'Triple Black US 8', size: 'US 8', color: 'Triple Black', price: 175, stock: 5, sku: 'AM97-TB-8' },
      { id: '30-4', name: 'Triple Black US 9', size: 'US 9', color: 'Triple Black', price: 175, stock: 7, sku: 'AM97-TB-9' }
    ],
    featured: true,
    rating: 4.8
  },
  {
    id: '31',
    name: 'Track Jacket',
    slug: 'track-jacket',
    description: 'This retro-inspired track jacket features contrast stripes on the sleeves and a full zip front. Made from smooth tricot fabric with a slight sheen for a vintage sportswear look.',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1336&q=80',
      'https://images.unsplash.com/photo-1509182469511-7f0b50bfa239?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    category: CATEGORIES[1],
    tags: [
      { id: 'retro', name: 'Retro' },
      { id: 'athletic', name: 'Athletic' }
    ],
    variants: [
      { id: '31-1', name: 'Navy/White S', size: 'S', color: 'Navy/White', price: 85, stock: 8, sku: 'TJ-NW-S' },
      { id: '31-2', name: 'Navy/White M', size: 'M', color: 'Navy/White', price: 85, stock: 12, sku: 'TJ-NW-M' },
      { id: '31-3', name: 'Black/Red S', size: 'S', color: 'Black/Red', price: 85, stock: 7, sku: 'TJ-BR-S' },
      { id: '31-4', name: 'Black/Red M', size: 'M', color: 'Black/Red', price: 85, stock: 10, sku: 'TJ-BR-M' }
    ],
    rating: 4.6
  },
  {
    id: '32',
    name: 'Run Star Hike Platforms',
    slug: 'run-star-hike-platforms',
    description: 'The Converse Run Star Hike features the classic Chuck Taylor All Star silhouette atop a dramatically exaggerated platform sole. Canvas upper with reinforced toe cap and signature ankle patch.',
    price: 110,
    images: [
      'https://images.unsplash.com/photo-1626947346165-4c2288dadc2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
      'https://images.unsplash.com/photo-1544726982-a74be534ead2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'platform', name: 'Platform' }
    ],
    variants: [
      { id: '32-1', name: 'Black/White US 7', size: 'US 7', color: 'Black/White', price: 110, stock: 8, sku: 'RSH-BW-7' },
      { id: '32-2', name: 'Black/White US 8', size: 'US 8', color: 'Black/White', price: 110, stock: 10, sku: 'RSH-BW-8' },
      { id: '32-3', name: 'White/Gum US 7', size: 'US 7', color: 'White/Gum', price: 110, stock: 7, sku: 'RSH-WG-7' },
      { id: '32-4', name: 'White/Gum US 8', size: 'US 8', color: 'White/Gum', price: 110, stock: 9, sku: 'RSH-WG-8' }
    ],
    new: true,
    rating: 4.7
  },
  {
    id: '33',
    name: 'Silver Stud Earrings',
    slug: 'silver-stud-earrings',
    description: 'Minimalist sterling silver stud earrings in a geometric design. Perfect for everyday wear and adding a subtle edge to any outfit.',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'jewelry', name: 'Jewelry' },
      { id: 'accessory', name: 'Accessory' }
    ],
    variants: [
      { id: '33-1', name: 'Silver Triangle', size: 'One Size', color: 'Silver', price: 45, stock: 10, sku: 'SSE-ST-OS' },
      { id: '33-2', name: 'Silver Square', size: 'One Size', color: 'Silver', price: 45, stock: 8, sku: 'SSE-SS-OS' },
      { id: '33-3', name: 'Silver Circle', size: 'One Size', color: 'Silver', price: 45, stock: 12, sku: 'SSE-SC-OS' }
    ],
    rating: 4.8
  },
  {
    id: '34',
    name: 'Premium Cotton Socks',
    slug: 'premium-cotton-socks',
    description: 'Set of three pairs of premium combed cotton socks. Features reinforced heel and toe, and ribbed cuffs for a secure fit.',
    price: 25,
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1608&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'accessory', name: 'Accessory' },
      { id: 'essentials', name: 'Essentials' }
    ],
    variants: [
      { id: '34-1', name: 'Black 3-Pack', size: 'One Size', color: 'Black', price: 25, stock: 15, sku: 'PCS-B-OS' },
      { id: '34-2', name: 'Mixed 3-Pack', size: 'One Size', color: 'Mixed', price: 25, stock: 12, sku: 'PCS-M-OS' },
      { id: '34-3', name: 'White 3-Pack', size: 'One Size', color: 'White', price: 25, stock: 10, sku: 'PCS-W-OS' }
    ],
    rating: 4.5
  },
  {
    id: '35',
    name: 'Printed Button-Up Shirt',
    slug: 'printed-button-up-shirt',
    description: 'This lightweight button-up shirt features a unique all-over print and a relaxed fit. Made from soft, breathable viscose with a slight texture.',
    price: 65,
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'
    ],
    category: CATEGORIES[2],
    tags: [
      { id: 'graphic', name: 'Graphic' },
      { id: 'summer', name: 'Summer' }
    ],
    variants: [
      { id: '35-1', name: 'Abstract Print S', size: 'S', color: 'Abstract Print', price: 65, stock: 7, sku: 'PBS-AP-S' },
      { id: '35-2', name: 'Abstract Print M', size: 'M', color: 'Abstract Print', price: 65, stock: 10, sku: 'PBS-AP-M' },
      { id: '35-3', name: 'Floral Print S', size: 'S', color: 'Floral Print', price: 65, stock: 6, sku: 'PBS-FP-S' },
      { id: '35-4', name: 'Floral Print M', size: 'M', color: 'Floral Print', price: 65, stock: 8, sku: 'PBS-FP-M' }
    ],
    new: true,
    rating: 4.6
  },
  {
    id: '36',
    name: 'Blazer Mid 77',
    slug: 'blazer-mid-77',
    description: 'The Nike Blazer Mid \'77 is a time-tested classic with vintage appeal. The suede and leather upper combined with the retro Swoosh design and exposed foam tongue give a nod to its heritage basketball roots.',
    price: 105,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fb7eda3c-5ac8-4d05-a18f-1c2c5e82e36e/blazer-mid-77-vintage-mens-shoes-nw30B2.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8bc7d689-de2c-4b49-986c-b42139b5afb3/blazer-mid-77-vintage-mens-shoes-nw30B2.png'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'retro', name: 'Retro' }
    ],
    variants: [
      { id: '36-1', name: 'White/Black US 8', size: 'US 8', color: 'White/Black', price: 105, stock: 9, sku: 'BM77-WB-8' },
      { id: '36-2', name: 'White/Black US 9', size: 'US 9', color: 'White/Black', price: 105, stock: 12, sku: 'BM77-WB-9' },
      { id: '36-3', name: 'White/Red US 8', size: 'US 8', color: 'White/Red', price: 105, stock: 7, sku: 'BM77-WR-8' },
      { id: '36-4', name: 'White/Red US 9', size: 'US 9', color: 'White/Red', price: 105, stock: 10, sku: 'BM77-WR-9' }
    ],
    featured: true,
    rating: 4.8
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return PRODUCTS.find(product => product.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return PRODUCTS.filter(product => product.category.slug === categorySlug);
};

export const getFeaturedProducts = (): Product[] => {
  return PRODUCTS.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return PRODUCTS.filter(product => product.new);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.name.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
  );
};
