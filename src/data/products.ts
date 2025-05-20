
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
    id: '2',
    name: 'Street Essentials Hoodie',
    slug: 'street-essentials-hoodie',
    description: 'Made with premium heavyweight cotton and a relaxed fit, this hoodie features minimalist design with subtle embroidered logo. Perfect for layering or as a statement piece.',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80'
    ],
    category: CATEGORIES[1],
    tags: [
      { id: 'essentials', name: 'Essentials' },
      { id: 'streetwear', name: 'Streetwear' }
    ],
    variants: [
      { id: '2-1', name: 'Black S', size: 'S', color: 'Black', price: 85, stock: 15, sku: 'SEH-B-S' },
      { id: '2-2', name: 'Black M', size: 'M', color: 'Black', price: 85, stock: 20, sku: 'SEH-B-M' },
      { id: '2-3', name: 'Black L', size: 'L', color: 'Black', price: 85, stock: 12, sku: 'SEH-B-L' },
      { id: '2-4', name: 'Gray M', size: 'M', color: 'Gray', price: 85, stock: 8, sku: 'SEH-G-M' }
    ],
    new: true,
    rating: 4.5
  },
  {
    id: '3',
    name: 'Urban Tech Pants',
    slug: 'urban-tech-pants',
    description: 'Technical pants designed for the modern urban environment. Featuring water-resistant fabric, multiple utility pockets, and articulated knees for enhanced mobility.',
    price: 95,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[3],
    tags: [
      { id: 'technical', name: 'Technical' },
      { id: 'utility', name: 'Utility' }
    ],
    variants: [
      { id: '3-1', name: 'Black 30', size: '30', color: 'Black', price: 95, stock: 7, sku: 'UTP-B-30' },
      { id: '3-2', name: 'Black 32', size: '32', color: 'Black', price: 95, stock: 12, sku: 'UTP-B-32' },
      { id: '3-3', name: 'Olive 30', size: '30', color: 'Olive', price: 95, stock: 5, sku: 'UTP-O-30' },
      { id: '3-4', name: 'Olive 32', size: '32', color: 'Olive', price: 95, stock: 9, sku: 'UTP-O-32' }
    ],
    featured: true,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Graphic Print Tee',
    slug: 'graphic-print-tee',
    description: 'Premium cotton T-shirt featuring original artwork. Each design is limited edition and screen printed with eco-friendly inks.',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[2],
    tags: [
      { id: 'graphic', name: 'Graphic' },
      { id: 'limited', name: 'Limited Edition' }
    ],
    variants: [
      { id: '4-1', name: 'White S', size: 'S', color: 'White', price: 45, stock: 20, sku: 'GPT-W-S' },
      { id: '4-2', name: 'White M', size: 'M', color: 'White', price: 45, stock: 25, sku: 'GPT-W-M' },
      { id: '4-3', name: 'White L', size: 'L', color: 'White', price: 45, stock: 15, sku: 'GPT-W-L' },
      { id: '4-4', name: 'Black M', size: 'M', color: 'Black', price: 45, stock: 18, sku: 'GPT-B-M' }
    ],
    new: true,
    rating: 4.4
  },
  {
    id: '5',
    name: 'Street Chain Necklace',
    slug: 'street-chain-necklace',
    description: 'Stainless steel chain with custom pendant design. Water and tarnish resistant with secure clasp closure.',
    price: 60,
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
    ],
    category: CATEGORIES[4],
    tags: [
      { id: 'jewelry', name: 'Jewelry' },
      { id: 'accessory', name: 'Accessory' }
    ],
    variants: [
      { id: '5-1', name: 'Silver 18"', size: '18"', color: 'Silver', price: 60, stock: 10, sku: 'SCN-S-18' },
      { id: '5-2', name: 'Silver 20"', size: '20"', color: 'Silver', price: 60, stock: 8, sku: 'SCN-S-20' },
      { id: '5-3', name: 'Gold 18"', size: '18"', color: 'Gold', price: 65, stock: 6, sku: 'SCN-G-18' },
      { id: '5-4', name: 'Gold 20"', size: '20"', color: 'Gold', price: 65, stock: 4, sku: 'SCN-G-20' }
    ],
    rating: 4.6
  },
  {
    id: '6',
    name: 'Dunk Low Retro',
    slug: 'dunk-low-retro',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with classic details and throwback hoops flair. The padded, low-top collar lets you take your game anywhere—in comfort.',
    price: 110,
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5e7687f1-c13e-4bac-8ffa-a6f863ae9157/dunk-low-retro-mens-shoes-86MkTs.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3679f901-d712-4887-940a-b9c21aea28ef/dunk-low-retro-mens-shoes-86MkTs.png',
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/7da99bda-0071-4b90-9820-1499ea32a1f5/dunk-low-retro-mens-shoes-86MkTs.png'
    ],
    category: CATEGORIES[0],
    tags: [
      { id: 'basketball', name: 'Basketball' },
      { id: 'retro', name: 'Retro' }
    ],
    variants: [
      { id: '6-1', name: 'White/Blue US 8', size: 'US 8', color: 'White/Blue', price: 110, stock: 7, sku: 'DLR-WB-8' },
      { id: '6-2', name: 'White/Blue US 9', size: 'US 9', color: 'White/Blue', price: 110, stock: 10, sku: 'DLR-WB-9' },
      { id: '6-3', name: 'White/Blue US 10', size: 'US 10', color: 'White/Blue', price: 110, stock: 6, sku: 'DLR-WB-10' },
      { id: '6-4', name: 'Black/Red US 9', size: 'US 9', color: 'Black/Red', price: 115, stock: 4, sku: 'DLR-BR-9' }
    ],
    featured: true,
    rating: 4.9
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
