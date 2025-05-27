
import { Product } from '@/types/product';
import { extendedProducts, CATEGORIES } from './extendedProducts';

// Use the extended products catalog
export const PRODUCTS: Product[] = extendedProducts;

// Re-export categories
export { CATEGORIES };

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
