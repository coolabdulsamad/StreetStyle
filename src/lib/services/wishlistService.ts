import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
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
      `)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) throw error;
    
    // Extract products from the response and add images
    const products = await Promise.all((data || []).map(async (item) => {
      const product = item.product as unknown as Product;
      
      // Get product images
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });

      if (imageError) throw imageError;
      
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

export async function addToWishlist(productId: string): Promise<void> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { data: existingItem, error: checkError } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (!existingItem) {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: userId,
          product_id: productId,
        });

      if (error) throw error;
      toast.success('Added to wishlist');
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
  }
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

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
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

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
