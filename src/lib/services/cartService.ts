// src/lib/services/cartService.ts
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant, ProductImage } from '@/lib/types';
import { CartItem } from '@/contexts/CartContext'; // Import CartItem type from context

/**
 * Fetches the user's cart items from the database,
 * joining with product and product_variants data to get full details.
 * @param userId The ID of the current user.
 * @returns A Promise that resolves to an array of CartItem objects.
 */
export const fetchUserCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data: cartItemsData, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_id,
        variant_id,
        product:products (
          id,
          name,
          price,
          stock_quantity,
          slug,
          description,
          images:product_images (
            image_url,
            display_order
          )
        ),
        variant:product_variants (
          id,
          name,
          price,
          stock,
          color,
          color_hex,
          size
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart items from database:', error.message);
      throw new Error('Failed to fetch cart items.');
    }

    if (!cartItemsData) {
      return [];
    }

    // Map the fetched data to your CartItem type
    const mappedCartItems: CartItem[] = cartItemsData.map((dbItem: any) => {
      // Handle product data
      const product: Product = {
        id: dbItem.product.id,
        name: dbItem.product.name,
        price: dbItem.product.price,
        stock_quantity: dbItem.product.stock_quantity,
        slug: dbItem.product.slug,
        description: dbItem.product.description,
        // Map images, ensuring only the image_url is extracted
        images: dbItem.product.images?.map((img: ProductImage) => ({
          image_url: img.image_url,
          display_order: img.display_order,
          // Add other required image properties if your ProductImage type has them
          // For simplicity, we'll just take the URL for now for CartPage display
          id: '', // Dummy ID if not fetched
          created_at: '', // Dummy if not fetched
          product_id: '', // Dummy if not fetched
        })) || [],
        // Fill in other required Product properties with defaults or nulls
        brand_id: '', category_id: '', is_sale: false, new: false, featured: false, is_limited_edition: false,
        reviews: [], tags: [], // Initialize empty arrays for relations not fetched here
      };

      // Handle variant data
      let variant: ProductVariant | SimpleProductVariant;
      if (dbItem.variant) {
        variant = {
          id: dbItem.variant.id,
          name: dbItem.variant.name || 'Default',
          price: dbItem.variant.price,
          stock: dbItem.variant.stock,
          color: dbItem.variant.color || null,
          color_hex: dbItem.variant.color_hex || null,
          size: dbItem.variant.size || null,
          // Fill in other required ProductVariant properties with defaults
          product_id: dbItem.product_id, sku: '', created_at: '', updated_at: '',
        };
      } else {
        // Fallback for simple products (no variant_id in cart_items)
        variant = {
          id: `simple-${dbItem.product.id}`,
          name: 'Default',
          price: dbItem.product.price,
          stock: dbItem.product.stock_quantity,
          color: null,
          color_hex: null,
        };
      }

      return {
        id: dbItem.id, // This is the cart_item ID from the database
        product: product,
        variant: variant,
        quantity: dbItem.quantity,
      };
    });

    return mappedCartItems;

  } catch (error) {
    console.error('Failed to fetch user cart items:', error);
    return [];
  }
};