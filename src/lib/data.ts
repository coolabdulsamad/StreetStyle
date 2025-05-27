
import { Product } from '@/types/product';
import { PRODUCTS, getProductBySlug, searchProducts as searchProductsData } from '@/data/products';

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
      const products = searchProductsData(query);
      resolve(products);
    }, 300);
  });
};

export const getRelatedProducts = async (productId: string, categorySlug: string): Promise<Product[]> => {
  // Simulate API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find products in the same category, excluding the current product
      const relatedProducts = PRODUCTS.filter(product => 
        product.id !== productId && 
        product.category.slug === categorySlug
      ).slice(0, 4); // Limit to 4 related products
      
      resolve(relatedProducts);
    }, 300);
  });
};

export const getPopularProducts = async (): Promise<Product[]> => {
  // Simulate API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would be based on sales data or view counts
      // Here we're just selecting random products
      const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
      resolve(shuffled.slice(0, 6));
    }, 300);
  });
};
