import { Product, ProductCategory } from '@/types/product';
import { EXTENDED_PRODUCTS } from './extendedProducts';

export const CATEGORIES: ProductCategory[] = [
  { id: '1', name: 'Sneakers', slug: 'sneakers', description: 'Premium sneakers and athletic footwear' },
  { id: '2', name: 'Hoodies', slug: 'hoodies', description: 'Comfortable and stylish hoodies' },
  { id: '3', name: 'T-Shirts', slug: 't-shirts', description: 'Trendy t-shirts and tops' },
  { id: '4', name: 'Jackets', slug: 'jackets', description: 'Stylish jackets and outerwear' },
  { id: '5', name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and gear' },
];

// Use the extended products catalog
export const PRODUCTS: Product[] = EXTENDED_PRODUCTS;

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
