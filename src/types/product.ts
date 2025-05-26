
export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
};

export type ProductTag = {
  id: string;
  name: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
};

export type ProductReview = {
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
};

export type Product = {
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
  reviews?: ProductReview[];
  
  // Additional fields for compatibility
  brand_id?: string | null;
  sku?: string | null;
  gender?: 'men' | 'women' | 'unisex' | 'kids' | null;
  release_date?: string | null;
  is_limited_edition?: boolean | null;
  average_rating?: number | null;
  review_count?: number;
  meta_title?: string | null;
  meta_description?: string | null;
};
