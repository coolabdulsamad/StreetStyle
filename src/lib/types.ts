// Core types for the e-commerce application

export type Address = {
  id: string;
  user_id: string;
  address_type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  first_name: string | null;
  last_name: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  shipping_address_id: string | null;
  billing_address_id: string | null;
  shipping_method: string | null;
  shipping_cost: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields for UI display
  shipping_address?: Address;
  billing_address?: Address;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string | null;
  product_id: string | null;
  variant_id: string | null;
  name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  created_at: string;
  // Additional fields for UI display
  product?: Product;
};

export type Gender = 'men' | 'women' | 'unisex' | 'kids';

// Update the ExtendedProduct interface to make it compatible with Product
export interface ExtendedProduct extends Omit<Product, 'category'> {
  category?: ProductCategory;
  brand?: Brand;
  reviews?: ProductReview[];
  is_in_wishlist?: boolean;
}

// Update the Product type to include new fields
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
  reviews?: ProductReview[];
  
  // New fields
  brand_id: string | null;
  sku: string | null;
  gender: Gender | null;
  release_date: string | null;
  is_limited_edition: boolean | null;
  average_rating: number | null;
  review_count: number;
  meta_title: string | null;
  meta_description: string | null;
}

// Existing types remain the same
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
