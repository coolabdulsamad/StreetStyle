
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, Address } from "@/lib/types";
import { toast } from "sonner";

export async function getUserOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders' as any)
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    toast.error('Failed to load your orders');
    return [];
  }
  
  return (data || []) as unknown as Order[];
}

export async function getOrderDetails(orderId: string): Promise<Order | null> {
  // First, get the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders' as any)
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    console.error('Error fetching order:', orderError);
    toast.error('Failed to load order details');
    return null;
  }
  
  const order = orderData as unknown as Order;
  
  // Get order items
  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items' as any)
    .select(`
      *,
      product:product_id (
        id,
        name,
        slug,
        price,
        images
      )
    `)
    .eq('order_id', orderId);
  
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
  } else {
    order.items = itemsData as unknown as OrderItem[];
  }
  
  // Get shipping address
  if (order.shipping_address_id) {
    const { data: shippingAddress, error: shippingError } = await supabase
      .from('addresses' as any)
      .select('*')
      .eq('id', order.shipping_address_id)
      .single();
    
    if (!shippingError) {
      order.shipping_address = shippingAddress as unknown as Address;
    }
  }
  
  // Get billing address
  if (order.billing_address_id) {
    const { data: billingAddress, error: billingError } = await supabase
      .from('addresses' as any)
      .select('*')
      .eq('id', order.billing_address_id)
      .single();
    
    if (!billingError) {
      order.billing_address = billingAddress as unknown as Address;
    }
  }
  
  return order;
}

export async function createOrder(
  orderData: { 
    shipping_address_id: string; 
    billing_address_id: string;
    shipping_method: string;
    payment_method: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total: number;
    notes?: string;
  },
  orderItems: Array<{
    product_id: string;
    variant_id: string;
    name: string;
    variant_name: string;
    price: number;
    quantity: number;
  }>
): Promise<Order | null> {
  // Start a Supabase transaction
  const { data, error } = await supabase
    .from('orders' as any)
    .insert([orderData as any])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create your order');
    return null;
  }
  
  const order = data as unknown as Order;
  
  // Now insert order items
  const orderItemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items' as any)
    .insert(orderItemsWithOrderId as any);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    toast.error('Order created but there was an issue with the items');
    return order;
  }
  
  toast.success('Order placed successfully!');
  return order;
}

export async function updateOrderStatus(orderId: string, status: Order['order_status']): Promise<boolean> {
  const { error } = await supabase
    .from('orders' as any)
    .update({ order_status: status, updated_at: new Date().toISOString() } as any)
    .eq('id', orderId);
  
  if (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return false;
  }
  
  toast.success('Order status updated');
  return true;
}

export async function cancelOrder(orderId: string): Promise<boolean> {
  return await updateOrderStatus(orderId, 'cancelled');
}

export async function updateTrackingNumber(orderId: string, trackingNumber: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders' as any)
    .update({ 
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString()
    } as any)
    .eq('id', orderId);
  
  if (error) {
    console.error('Error updating tracking number:', error);
    toast.error('Failed to update tracking number');
    return false;
  }
  
  toast.success('Tracking number updated');
  return true;
}
