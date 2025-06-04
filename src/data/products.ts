// @/data/products.ts

// This file previously contained mock product data.
// It is now emptied as product data will be fetched from the Supabase database
// via `src/services/productService.ts`.

// Any components or hooks that were directly importing from here should be updated
// to use the actual data fetching services.

export const PRODUCTS: any[] = [];
export const CATEGORIES: any[] = [];

export const getFeaturedProducts = () => [];
export const getNewProducts = () => [];
export const getProductBySlug = (slug: string) => undefined;
export const searchProducts = (query: string) => [];