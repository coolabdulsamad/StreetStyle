// @/lib/services/orderService.ts
import { supabase } from '@/integrations/supabase/client'; // Adjust path if necessary
import { Database } from '@/integrations/supabase/types'; // Adjust path if necessary
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating tracking numbers

// Define types from your schema for clarity and type safety
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
type UserAddressRow = Database['public']['Tables']['user_addresses']['Row'];
type RiderRow = Database['public']['Tables']['riders']['Row'];

// Define a type for the data returned by the products_with_main_image view
interface ProductWithMainImage extends ProductRow {
  main_image_url?: string | null; // The new column from the view
}

// Extended Order interface now includes profile data, order items, addresses, and delivery details
export interface ExtendedOrder extends OrderRow {
  user_profile?: Pick<ProfileRow, 'id' | 'first_name' | 'last_name' | 'phone' | 'avatar_url'> | null;
  order_items: (OrderItemRow & {
    products: Pick<ProductWithMainImage, 'id' | 'name' | 'slug' | 'price' | 'sku' | 'main_image_url'>;
    product_variants: Pick<ProductVariantRow, 'id' | 'name' | 'sku' | 'color' | 'size'> | null;
  })[];
  shipping_address: UserAddressRow | null;
  billing_address: UserAddressRow | null;
  assigned_rider?: Pick<RiderRow, 'id' | 'first_name' | 'last_name' | 'phone'> | null;
}

// Interface for a simplified Rider object for dropdowns
export interface SimpleRider {
  id: string;
  name: string;
}

interface GetOrdersOptions {
  status?: string; // For filtering by status
  limit?: number;
  offset?: number;
  userId?: string; // For fetching orders specific to a user
}

/**
 * Fetches a list of orders with associated user profile names.
 * Can be filtered by status and userId.
 * @param options - Filtering and pagination options.
 * @returns An object containing the fetched orders and any error.
 */
export const getOrders = async (options?: GetOrdersOptions) => {
  const { status, limit = 100, offset = 0, userId } = options || {};

  try {
    let query = supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total,
        status,
        user_id,
        user_profile:profiles (first_name, last_name),
        delivery_status,
        tracking_number,
        assigned_rider:riders (first_name, last_name, phone)
      `);

    if (status && status !== 'All') { // Apply status filter if not 'All'
      query = query.eq('status', status);
    }

    if (userId) { // Filter by user ID if provided
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error fetching orders:', error);
      throw new Error(error.message);
    }

    // Map data to ExtendedOrder type, handling potential nulls from joins
    const orders: ExtendedOrder[] = (data || []).map((order: any) => ({
      ...order,
      user_profile: order.user_profile || null,
      order_items: [], // Initialize as empty, as getOrders doesn't fetch items for list view
      shipping_address: null,
      billing_address: null,
      assigned_rider: order.assigned_rider || null, // Map assigned rider
    }));

    return { orders, error: null };

  } catch (err: any) {
    console.error('Error in getOrders service:', err);
    return { orders: [], error: err };
  }
};

/**
 * Fetches a single order by its ID with all related details.
 * This includes order items, product details (with main image), product variants, user profile, addresses, and delivery details.
 * @param orderId The ID of the order to fetch.
 * @returns An object containing the fetched ExtendedOrder and any error.
 */
export const getOrderDetail = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user_profile:profiles!fk_orders_user_id(id,first_name,last_name,phone,avatar_url),
        order_items!fk_order_items_order_id(
          id, quantity, price,
          products:products_with_main_image!fk_order_items_product_id(
            id, name, slug, price, sku, main_image_url
          ),
          product_variants!fk_order_items_variant_id(
            id, name, sku, color, size
          )
        ),
        shipping_address:user_addresses!orders_shipping_address_id_fkey(
          id, street_address, city, state, postal_code, country
        ),
        billing_address:user_addresses!orders_billing_address_id_fkey(
          id, street_address, city, state, postal_code, country
        ),
        assigned_rider:riders!fk_orders_rider_id(id, first_name, last_name, phone)
      `)
      .eq('id', orderId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Supabase error fetching order detail:', error);
      throw new Error(error.message);
    }

    if (!data) {
      return { order: null, error: new Error('Order not found.') };
    }

    // Map data to ExtendedOrder type
    const order: ExtendedOrder = {
      ...data,
      user_profile: data.user_profile || null,
      order_items: data.order_items.map((item: any) => ({
        ...item,
        products: item.products,
        product_variants: item.product_variants,
      })),
      shipping_address: data.shipping_address || null,
      billing_address: data.billing_address || null,
      assigned_rider: data.assigned_rider || null,
    };

    return { order, error: null };

  } catch (err: any) {
    console.error('Error in getOrderDetail service:', err);
    toast.error(`Failed to load order details: ${err.message}`);
    return { order: null, error: err };
  }
};

/**
 * Fetches a single order by its tracking number with all related details.
 * This is for public tracking, so no user_id filter is applied.
 * @param trackingNumber The tracking number of the order to fetch.
 * @returns An object containing the fetched ExtendedOrder and any error.
 */
export const getOrderByTrackingNumber = async (trackingNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user_profile:profiles!fk_orders_user_id(first_name, last_name),
        order_items!fk_order_items_order_id(
          id, quantity, price,
          products:products_with_main_image!fk_order_items_product_id(
            id, name, slug, price, sku, main_image_url
          ),
          product_variants!fk_order_items_variant_id(
            id, name, sku, color, size
          )
        ),
        shipping_address:user_addresses!orders_shipping_address_id_fkey(
          id, street_address, city, state, postal_code, country
        ),
        assigned_rider:riders!fk_orders_rider_id(first_name, last_name, phone)
      `)
      .eq('tracking_number', trackingNumber)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Supabase error fetching order by tracking number:', error);
      throw new Error(error.message);
    }

    if (!data) {
      return { order: null, error: new Error('Order not found with this tracking number.') };
    }

    // Map data to ExtendedOrder type (only relevant fields for public view)
    const order: ExtendedOrder = {
      ...data,
      user_profile: data.user_profile || null,
      order_items: data.order_items.map((item: any) => ({
        ...item,
        products: item.products,
        product_variants: item.product_variants,
      })),
      shipping_address: data.shipping_address || null,
      // Billing address is typically not shown for public tracking
      billing_address: null,
      assigned_rider: data.assigned_rider || null,
    };

    return { order, error: null };

  } catch (err: any) {
    console.error('Error in getOrderByTrackingNumber service:', err);
    toast.error(`Failed to track order: ${err.message}`);
    return { order: null, error: err };
  }
};


/**
 * Updates the status of a specific order.
 * @param orderId The ID of the order to update.
 * @param newStatus The new status for the order.
 * @returns A boolean indicating success.
 */
export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Supabase error updating order status:', error);
      toast.error(`Failed to update order status: ${error.message}`);
      return false;
    }

    toast.success(`Order status updated to "${newStatus}"!`);
    return true;
  } catch (err: any) {
    console.error('Error in updateOrderStatus service:', err);
    toast.error(`An unexpected error occurred during status update: ${err.message}`);
    return false;
  }
};

/**
 * Fetches a list of all active riders.
 * @returns An array of SimpleRider objects or an empty array on error.
 */
export const getRiders = async (): Promise<SimpleRider[]> => {
  try {
    const { data, error } = await supabase
      .from('riders')
      .select('id, first_name, last_name, phone')
      .eq('status', 'active') // Only fetch active riders for assignment
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Supabase error fetching riders:', error);
      toast.error(`Failed to load riders: ${error.message}`);
      return [];
    }

    return (data || []).map(rider => ({
      id: rider.id,
      name: `${rider.first_name} ${rider.last_name}`.trim(),
    }));
  } catch (err: any) {
    console.error('Error in getRiders service:', err);
    toast.error(`An unexpected error occurred while fetching riders: ${err.message}`);
    return [];
  }
};

/**
 * Updates delivery-related details for an order, including rider assignment.
 * Auto-generates a tracking number if one doesn't exist and a rider is assigned or status changes.
 * @param orderId The ID of the order to update.
 * @param currentOrder The current ExtendedOrder object, needed to check existing tracking number.
 * @param updates An object containing the fields to update (e.g., rider_id, delivery_status, tracking_number).
 * @returns A boolean indicating success.
 */
export const updateOrderDeliveryDetails = async (
  orderId: string,
  currentOrder: ExtendedOrder, // Pass the current order to check existing tracking number
  updates: {
    rider_id?: string | null;
    delivery_status?: string;
    tracking_number?: string | null; // This can be explicitly set by the UI
    estimated_delivery_time?: string | null;
    delivery_notes?: string | null;
  }
): Promise<boolean> => {
  try {
    const updatesToSend = { ...updates };

    // Auto-generate tracking number if:
    // 1. No tracking number currently exists (falsy, including null, undefined, empty string)
    // 2. AND (a rider is being assigned OR the delivery status is changing from 'unassigned' to something else)
    const isAssigningRider = updates.rider_id && updates.rider_id !== currentOrder.rider_id;
    const isChangingFromUnassigned = currentOrder.delivery_status === 'unassigned' && updates.delivery_status && updates.delivery_status !== 'unassigned';

    if (
      (!currentOrder.tracking_number) && // Check if current tracking number is falsy
      (isAssigningRider || isChangingFromUnassigned)
    ) {
      updatesToSend.tracking_number = uuidv4();
      toast.info(`Generated new tracking number: ${updatesToSend.tracking_number.substring(0, 8)}...`);
    }

    const { error } = await supabase
      .from('orders')
      .update({ ...updatesToSend, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Supabase error updating order delivery details:', error);
      toast.error(`Failed to update delivery details: ${error.message}`);
      return false;
    }

    toast.success('Order delivery details updated successfully!');
    return true;
  } catch (err: any) {
    console.error('Error in updateOrderDeliveryDetails service:', err);
    toast.error(`An unexpected error occurred during delivery details update: ${err.message}`);
    return false;
  }
};
