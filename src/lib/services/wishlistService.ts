
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export async function getUserWishlist(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        product_id,
        product:product_id (
          *,
          category:category_id (
            id,
            name,
            slug
          ),
          brand:brand_id (
            id,
            name,
            slug,
            logo_url
          )
        )
      `);
    
    if (error) throw error;
    
    // Extract products from the response and add images
    const products = await Promise.all(data.map(async (item) => {
      const product = item.product as Product;
      
      // Get product images
      const { data: imageData } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });
      
      product.images = imageData?.map(img => img.image_url) || [];
      
      return {
        ...product,
        is_in_wishlist: true
      };
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    toast.error('Failed to load your wishlist');
    return [];
  }
}

export async function addToWishlist(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wishlists')
      .insert([{ product_id: productId }]);
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast.info('This product is already in your wishlist');
        return true;
      }
      throw error;
    }
    
    toast.success('Added to wishlist');
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
    return false;
  }
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('product_id', productId);
    
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
    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('product_id', productId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not PGRST116 (no rows returned)
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
}
