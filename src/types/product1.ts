
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

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category: ProductCategory;
  tags: ProductTag[];
  variants: ProductVariant[];
  featured?: boolean;
  new?: boolean;
  rating?: number;
  review_count?: number;
  stock_quantity: number;
  brand?: string;
  sku?: string;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  release_date?: string;
  is_limited_edition?: boolean;
  is_sale?: boolean;
  average_rating?: number;
  meta_title?: string;
  meta_description?: string;
};
