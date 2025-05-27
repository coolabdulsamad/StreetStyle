
export type Gender = 'men' | 'women' | 'unisex' | 'kids';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  tags: ProductTag[];
  variants: ProductVariant[];
  featured?: boolean;
  new?: boolean;
  rating?: number;
  review_count: number;
  
  // Additional fields that were missing
  brand_id: string | null;
  brand?: string;
  sku: string | null;
  gender: Gender | null;
  release_date: string | null;
  is_limited_edition: boolean | null;
  is_limited?: boolean;
  is_sale?: boolean;
  stock_quantity: number;
  average_rating: number | null;
  meta_title: string | null;
  meta_description: string | null;
  reviews?: ProductReview[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
}

export interface ProductTag {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  userName?: string;
  rating: number;
  review_text: string | null;
  verified_purchase: boolean;
  helpful_votes: number;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}
