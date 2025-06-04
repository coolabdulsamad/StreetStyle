// @/services/wishlistService.ts
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
// Ensure Product and ProductImage types are correctly imported
import { Product, ProductImage } from "@/lib/types";
import { toast } from "sonner";

// Define specific types from your generated Supabase database types for better accuracy
type WishlistRow = Database['public']['Tables']['wishlists']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductCategoryRow = Database['public']['Tables']['product_categories']['Row'];
type BrandRow = Database['public']['Tables']['brands']['Row'];
// type ProductImageRow = Database['public']['Tables']['product_images']['Row']; // Not directly used anymore as we fetch the full object

// Helper type for the joined product data before full transformation
// Now, 'images' should be ProductImage[]
type ProductWithRelationsRaw = ProductRow & {
  category: ProductCategoryRow | null;
  brand: BrandRow | null;
  // images field is not directly fetched in the main query, so it won't be here.
  // It will be added during the transformation step.
};

// Helper function to fetch product images (returns ProductImage objects)
async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*') // <--- CHANGED: Select all fields to get the object structure
    .eq('product_id', productId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching images for product ${productId}:`, error.message);
    return [];
  }
  // Ensure the data is cast to ProductImage[]
  return (data as ProductImage[]) || [];
}

// New helper function to transform raw Supabase product data into the full Product type
// This function is similar to the one we have in `productService.ts` but specific to wishlist context
function transformRawProductToProductType(
  rawProduct: ProductWithRelationsRaw,
  images: ProductImage[], // Expect ProductImage[]
  is_in_wishlist: boolean = false
): Product {
  // This transformation should match the Product type defined in your src/lib/types.ts
  // Ensure all properties of Product are covered.
  return {
    id: rawProduct.id,
    name: rawProduct.name,
    slug: rawProduct.slug,
    description: rawProduct.description || '', // Provide default for optional fields
    price: rawProduct.price || 0,
    original_price: rawProduct.original_price || null,
    rating: rawProduct.average_rating || null,
    review_count: rawProduct.review_count || 0,
    sku: rawProduct.sku || null,
    gender: rawProduct.gender || null,
    release_date: rawProduct.release_date || null,
    meta_title: rawProduct.meta_title || null,
    meta_description: rawProduct.meta_description || null,
    created_at: rawProduct.created_at,
    updated_at: rawProduct.updated_at,
    is_sale: rawProduct.is_sale ?? false, // Handle boolean with nullish coalescing
    is_new: rawProduct.is_new ?? false,
    is_limited_edition: rawProduct.is_limited_edition ?? false,
    featured: rawProduct.featured ?? false,
    stock_quantity: rawProduct.stock_quantity || 0,
    brand_id: rawProduct.brand_id,
    category_id: rawProduct.category_id,

    // Nested relations
    brand: rawProduct.brand ? {
      id: rawProduct.brand.id,
      name: rawProduct.brand.name,
      slug: rawProduct.brand.slug,
      logo_url: rawProduct.brand.logo_url || null,
      description: rawProduct.brand.description || null,
      is_active: rawProduct.brand.is_active || false,
      created_at: rawProduct.brand.created_at,
    } : null,
    category: rawProduct.category ? {
      id: rawProduct.category.id,
      name: rawProduct.category.name,
      slug: rawProduct.category.slug,
      description: rawProduct.category.description || null,
      parent_id: rawProduct.category.parent_id || null,
      image_url: rawProduct.category.image_url || null,
      is_active: rawProduct.category.is_active || false,
      display_order: rawProduct.category.display_order || 0,
      created_at: rawProduct.category.created_at,
    } : null,
    tags: [], // Assuming tags are not joined here; if they are, map them
    images: images, // Assign the correctly formatted images (ProductImage[])
    reviews: [], // Assuming reviews are not joined here; if they are, map them
    is_in_wishlist: is_in_wishlist,
  };
}

export async function getUserWishlist(): Promise<Product[]> { // <--- CHANGED: Return Promise<Product[]>
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.warn('getUserWishlist: No authenticated user found.');
      return [];
    }
    const userId = userData.user.id;

    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        product_id,
        product:product_id (
          *,
          category:category_id (
            id,
            name,
            slug,
            description,
            parent_id,
            image_url,
            is_active,
            display_order,
            created_at
          ),
          brand:brand_id (
            id,
            name,
            slug,
            logo_url,
            description,
            is_active,
            created_at
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching raw wishlist data:', error);
      throw error;
    }

    const products = await Promise.all((data || []).map(async (item) => {
      const rawProduct = item.product as ProductWithRelationsRaw; // Cast to raw type

      // Fetch product images separately as full ProductImage objects
      const images = await getProductImages(rawProduct.id);

      // Transform the raw product data into the desired Product type
      return transformRawProductToProductType(rawProduct, images, true); // Mark as in wishlist
    }));

    return products;
  } catch (error) {
    console.error('Error in getUserWishlist:', error);
    toast.error('Failed to load your wishlist.');
    return [];
  }
}

export async function addToWishlist(productId: string): Promise<void> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error('You must be logged in to add items to your wishlist.');
      throw new Error('User not authenticated');
    }
    const userId = userData.user.id;

    const { data: existingItem, error: checkError } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (!existingItem) {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: userId,
          product_id: productId,
        });

      if (error) throw error;
      toast.success('Added to wishlist');
    } else {
      toast.info('Item is already in your wishlist');
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
  }
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error('You must be logged in to remove items from your wishlist.');
      throw new Error('User not authenticated');
    }
    const userId = userData.user.id;

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', userId);

    if (error) throw error;

    toast.success('Removed from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove from wishlist');
    return false;
  }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return false;
    }
    const userId = userData.user.id;

    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
}