
import { Product } from '@/types/product';
import { PRODUCTS, getProductBySlug } from '@/data/products';

export const getProduct = async (slug?: string): Promise<Product | null> => {
  if (!slug) return null;
  
  // Simulate API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = getProductBySlug(slug);
      resolve(product || null);
    }, 300);
  });
};

export const getProductsByCategory = async (categorySlug?: string): Promise<Product[]> => {
  // Simulate API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!categorySlug) {
        resolve(PRODUCTS);
        return;
      }
      
      const products = PRODUCTS.filter(product => product.category.slug === categorySlug);
      resolve(products);
    }, 300);
  });
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  // Simulate API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      const products = PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.name.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
      );
      resolve(products);
    }, 300);
  });
};
