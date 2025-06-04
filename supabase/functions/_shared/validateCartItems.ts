// supabase/functions/_shared/validateCartItems.ts
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'; // Use your Supabase JS client version

// Define a type for a cart item as it comes from the frontend
interface CartItem {
  id: string; // cart_item_id
  product: {
    id: string;
    name: string;
    images: { image_url: string }[];
  };
  variant: {
    id: string;
    name: string;
    price: number; // This price is from frontend, will be validated
  };
  quantity: number;
}

// Define the structure for a validated cart item
interface ValidatedCartItem {
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number; // The authoritative price from the database
}

/**
 * Validates cart items against the database to ensure correct pricing and stock.
 * Calculates the total amount based on database prices.
 * @param supabaseClient The Supabase client initialized with service role key.
 * @param items The array of cart items from the frontend.
 * @returns An object containing validated items, total amount, and any error.
 */
export async function validateCartItems(
  supabaseClient: SupabaseClient,
  items: CartItem[]
): Promise<{ validatedItems: ValidatedCartItem[]; totalAmount: number; error: string | null }> {
  let totalAmount = 0;
  const validatedItems: ValidatedCartItem[] = [];

  if (!items || items.length === 0) {
    return { validatedItems: [], totalAmount: 0, error: 'Cart is empty.' };
  }

  for (const item of items) {
    if (!item.variant || !item.variant.id || !item.quantity || item.quantity <= 0) {
      return { validatedItems: [], totalAmount: 0, error: 'Invalid cart item structure or quantity.' };
    }

    // Fetch the authoritative product variant from the database
    const { data: productVariant, error: variantError } = await supabaseClient
      .from('product_variants')
      .select('id, product_id, price, stock')
      .eq('id', item.variant.id)
      .single();

    if (variantError || !productVariant) {
      return { validatedItems: [], totalAmount: 0, error: `Product variant not found for ID: ${item.variant.id}` };
    }

    // Check stock availability
    if (productVariant.stock < item.quantity) {
      return { validatedItems: [], totalAmount: 0, error: `Insufficient stock for ${item.product.name} (${item.variant.name}). Available: ${productVariant.stock}, Requested: ${item.quantity}` };
    }

    const authoritativePrice = productVariant.price;
    const itemSubtotal = authoritativePrice * item.quantity;

    totalAmount += itemSubtotal;
    validatedItems.push({
      product_id: productVariant.product_id,
      variant_id: productVariant.id,
      quantity: item.quantity,
      price: authoritativePrice,
    });
  }

  return { validatedItems, totalAmount, error: null };
}
