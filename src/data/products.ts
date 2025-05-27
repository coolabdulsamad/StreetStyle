
import { Product, ProductCategory } from '@/types/product';

export const CATEGORIES: ProductCategory[] = [
  { id: '1', name: 'Sneakers', slug: 'sneakers', description: 'Premium sneakers and athletic footwear' },
  { id: '2', name: 'Hoodies', slug: 'hoodies', description: 'Comfortable and stylish hoodies' },
  { id: '3', name: 'T-Shirts', slug: 't-shirts', description: 'Trendy t-shirts and tops' },
  { id: '4', name: 'Jackets', slug: 'jackets', description: 'Stylish jackets and outerwear' },
  { id: '5', name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and gear' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG',
    slug: 'air-jordan-1-retro-high-og',
    description: 'The Air Jordan 1 Retro High OG is a classic sneaker with a timeless design. It features a leather upper, a cushioned midsole, and a durable rubber outsole.',
    price: 179.99,
    images: [
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-and-Found-DZ5485-612.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1667363453',
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-and-Found-DZ5485-612-1.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1667363453',
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-and-Found-DZ5485-612-2.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1667363453',
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Lost-and-Found-DZ5485-612-3.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1667363453',
    ],
    category: CATEGORIES[0],
    tags: [{ id: '1', name: 'Jordan' }, { id: '2', name: 'Basketball' }],
    variants: [
      { id: '1', name: 'Red/White/Black', size: 'US 8', price: 179.99, stock: 10, sku: 'AJ1-RWB-8' },
      { id: '2', name: 'Red/White/Black', size: 'US 9', price: 179.99, stock: 5, sku: 'AJ1-RWB-9' },
    ],
    featured: true,
    new: true,
    rating: 4.8,
    review_count: 45,
    reviews: [
      {
        id: '1',
        product_id: '1',
        user_id: '1',
        userName: 'John Doe',
        rating: 5,
        review_text: 'Great shoes! Very comfortable and stylish.',
        verified_purchase: true,
        helpful_votes: 12,
        images: [],
        created_at: '2023-01-15T12:00:00.000Z',
        updated_at: '2023-01-15T12:00:00.000Z',
      },
      {
        id: '2',
        product_id: '1',
        user_id: '2',
        userName: 'Jane Smith',
        rating: 4,
        review_text: 'Good quality but a bit expensive.',
        verified_purchase: true,
        helpful_votes: 8,
        images: [],
        created_at: '2023-02-01T10:00:00.000Z',
        updated_at: '2023-02-01T10:00:00.000Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Nike Dunk Low Retro',
    slug: 'nike-dunk-low-retro',
    description: 'The Nike Dunk Low Retro is a classic sneaker with a clean and simple design. It features a leather upper, a cushioned midsole, and a durable rubber outsole.',
    price: 109.99,
    images: [
      'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1638448098',
      'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-1.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1638448098',
      'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-2.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1638448098',
      'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-3.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1638448098',
    ],
    category: CATEGORIES[0],
    tags: [{ id: '3', name: 'Nike' }, { id: '4', name: 'Casual' }],
    variants: [
      { id: '3', name: 'White/Black', size: 'US 8', price: 109.99, stock: 15, sku: 'NK-DUNK-WB-8' },
      { id: '4', name: 'White/Black', size: 'US 9', price: 109.99, stock: 10, sku: 'NK-DUNK-WB-9' },
    ],
    featured: true,
    new: false,
    rating: 4.5,
    review_count: 30,
    reviews: [
      {
        id: '3',
        product_id: '2',
        user_id: '3',
        userName: 'Alice Brown',
        rating: 5,
        review_text: 'Love these shoes! They go with everything.',
        verified_purchase: true,
        helpful_votes: 10,
        images: [],
        created_at: '2023-03-10T14:00:00.000Z',
        updated_at: '2023-03-10T14:00:00.000Z',
      },
      {
        id: '4',
        product_id: '2',
        user_id: '4',
        userName: 'Bob Wilson',
        rating: 3,
        review_text: 'They are okay, but not as comfortable as I expected.',
        verified_purchase: false,
        helpful_votes: 5,
        images: [],
        created_at: '2023-03-15T16:00:00.000Z',
        updated_at: '2023-03-15T16:00:00.000Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Fear of God Essentials Hoodie',
    slug: 'fear-of-god-essentials-hoodie',
    description: 'The Fear of God Essentials Hoodie is a comfortable and stylish hoodie made from premium materials. It features a relaxed fit, a drawstring hood, and a kangaroo pocket.',
    price: 149.99,
    images: [
      'https://images.stockx.com/images/Fear-of-God-Essentials-Hoodie-Dark-Oatmeal.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855',
      'https://images.stockx.com/images/Fear-of-God-Essentials-Hoodie-Dark-Oatmeal-1.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855',
      'https://images.stockx.com/images/Fear-of-God-Essentials-Hoodie-Dark-Oatmeal-2.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855',
      'https://images.stockx.com/images/Fear-of-God-Essentials-Hoodie-Dark-Oatmeal-3.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1672874855',
    ],
    category: CATEGORIES[1],
    tags: [{ id: '5', name: 'Essentials' }, { id: '6', name: 'Streetwear' }],
    variants: [
      { id: '5', name: 'Dark Oatmeal', size: 'S', price: 149.99, stock: 20, sku: 'FOG-HOOD-DO-S' },
      { id: '6', name: 'Dark Oatmeal', size: 'M', price: 149.99, stock: 15, sku: 'FOG-HOOD-DO-M' },
    ],
    featured: false,
    new: true,
    rating: 4.7,
    review_count: 25,
    reviews: [
      {
        id: '5',
        product_id: '3',
        user_id: '5',
        userName: 'Charlie Davis',
        rating: 5,
        review_text: 'The best hoodie I have ever owned! So soft and comfortable.',
        verified_purchase: true,
        helpful_votes: 15,
        images: [],
        created_at: '2023-04-01T09:00:00.000Z',
        updated_at: '2023-04-01T09:00:00.000Z',
      },
      {
        id: '6',
        product_id: '3',
        user_id: '6',
        userName: 'Diana White',
        rating: 4,
        review_text: 'Great quality, but the sizing runs a bit large.',
        verified_purchase: true,
        helpful_votes: 7,
        images: [],
        created_at: '2023-04-05T11:00:00.000Z',
        updated_at: '2023-04-05T11:00:00.000Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Carhartt WIP Detroit Jacket',
    slug: 'carhartt-wip-detroit-jacket',
    description: 'The Carhartt WIP Detroit Jacket is a durable and stylish jacket made from heavyweight cotton canvas. It features a corduroy collar, a zip front, and multiple pockets.',
    price: 199.99,
    images: [
      'https://images.stockx.com/images/Carhartt-WIP-Detroit-Jacket-Black.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559',
      'https://images.stockx.com/images/Carhartt-WIP-Detroit-Jacket-Black-1.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559',
      'https://images.stockx.com/images/Carhartt-WIP-Detroit-Jacket-Black-2.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559',
      'https://images.stockx.com/images/Carhartt-WIP-Detroit-Jacket-Black-3.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1635437559',
    ],
    category: CATEGORIES[3],
    tags: [{ id: '7', name: 'Carhartt' }, { id: '8', name: 'Workwear' }],
    variants: [
      { id: '7', name: 'Black', size: 'M', price: 199.99, stock: 12, sku: 'CRHT-JKT-BK-M' },
      { id: '8', name: 'Black', size: 'L', price: 199.99, stock: 8, sku: 'CRHT-JKT-BK-L' },
    ],
    featured: false,
    new: false,
    rating: 4.6,
    review_count: 20,
    reviews: [
      {
        id: '7',
        product_id: '4',
        user_id: '7',
        userName: 'Eve Green',
        rating: 5,
        review_text: 'Great jacket! Very durable and stylish.',
        verified_purchase: true,
        helpful_votes: 11,
        images: [],
        created_at: '2023-05-01T10:00:00.000Z',
        updated_at: '2023-05-01T10:00:00.000Z',
      },
      {
        id: '8',
        product_id: '4',
        user_id: '8',
        userName: 'Frank Blue',
        rating: 4,
        review_text: 'Good quality, but the fit is a bit boxy.',
        verified_purchase: true,
        helpful_votes: 6,
        images: [],
        created_at: '2023-05-05T12:00:00.000Z',
        updated_at: '2023-05-05T12:00:00.000Z',
      },
    ],
  },
  {
    id: '5',
    name: 'Stussy Basic T-Shirt',
    slug: 'stussy-basic-t-shirt',
    description: 'The Stussy Basic T-Shirt is a classic t-shirt made from soft cotton. It features a crew neck and a simple Stussy logo on the chest.',
    price: 39.99,
    images: [
      'https://images.stockx.com/images/Stussy-Basic-Logo-T-shirt-Black.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1606321777',
      'https://images.stockx.com/images/Stussy-Basic-Logo-T-shirt-Black-1.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1606321777',
      'https://images.stockx.com/images/Stussy-Basic-Logo-T-shirt-Black-2.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1606321777',
      'https://images.stockx.com/images/Stussy-Basic-Logo-T-shirt-Black-3.png?auto=format,compress&w=576&q=90&dpr=2&updated_at=1606321777',
    ],
    category: CATEGORIES[2],
    tags: [{ id: '9', name: 'Stussy' }, { id: '10', name: 'Streetwear' }],
    variants: [
      { id: '9', name: 'Black', size: 'S', price: 39.99, stock: 25, sku: 'STSY-TEE-BK-S' },
      { id: '10', name: 'Black', size: 'M', price: 39.99, stock: 20, sku: 'STSY-TEE-BK-M' },
    ],
    featured: false,
    new: false,
    rating: 4.4,
    review_count: 15,
    reviews: [
      {
        id: '9',
        product_id: '5',
        user_id: '9',
        userName: 'Grace Gold',
        rating: 5,
        review_text: 'Great t-shirt! Very comfortable and fits perfectly.',
        verified_purchase: true,
        helpful_votes: 9,
        images: [],
        created_at: '2023-06-01T11:00:00.000Z',
        updated_at: '2023-06-01T11:00:00.000Z',
      },
      {
        id: '10',
        product_id: '5',
        user_id: '10',
        userName: 'Henry Silver',
        rating: 3,
        review_text: 'Good quality, but the logo is a bit too small.',
        verified_purchase: false,
        helpful_votes: 4,
        images: [],
        created_at: '2023-06-05T13:00:00.000Z',
        updated_at: '2023-06-05T13:00:00.000Z',
      },
    ],
  },
];

export const getFeaturedProducts = () => {
  return PRODUCTS.filter((product) => product.featured);
};

export const getNewProducts = () => {
  return PRODUCTS.filter((product) => product.new);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return PRODUCTS.find(product => product.slug === slug);
};

export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.name.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
  );
};
