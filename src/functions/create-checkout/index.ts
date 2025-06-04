// supabase/functions/create-checkout/index.ts
// This function handles creating orders in Supabase and initiating Paystack transactions.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'; // Use your Supabase JS client version

// The main handler for the Edge Function
serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Parse the request body to get checkout details
  const {
    items, // Array of cart items (expected to have product, variant, quantity)
    shipping_address_id,
    billing_address_id,
    payment_method,
    user_id // User ID from the authenticated session
  } = await req.json();

  // Create a Supabase client with the SERVICE_ROLE_KEY.
  // This client has full bypass privileges and is used for secure backend operations.
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: {
        persistSession: false, // Important for server-side clients
      },
    }
  );

  try {
    let orderTotal = 0;
    const orderItemsToInsert: any[] = [];

    // Validate and calculate total from items by fetching prices from the database.
    // This prevents users from manipulating prices on the frontend.
    for (const item of items) {
      const { data: productVariant, error: variantError } = await supabaseClient
        .from('product_variants')
        .select('price, product_id')
        .eq('id', item.variant.id)
        .single();

      if (variantError || !productVariant) {
        throw new Error(`Variant not found for item ${item.variant.id}: ${variantError?.message}`);
      }

      const itemPrice = productVariant.price; // Authoritative price from DB
      orderTotal += itemPrice * item.quantity;

      // Prepare data for public.order_items table
      orderItemsToInsert.push({
        order_id: null, // Will be filled after order creation
        product_id: productVariant.product_id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // 1. Create the Order in public.orders table
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user_id,
        total: orderTotal,
        status: payment_method === 'cod' ? 'pending' : 'pending_payment', // 'pending_payment' for Paystack
        shipping_address_id: shipping_address_id,
        billing_address_id: billing_address_id,
        payment_method: payment_method,
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }
    const orderId = orderData.id; // Get the ID of the newly created order

    // 2. Create Order Items in public.order_items table
    const finalOrderItems = orderItemsToInsert.map(item => ({ ...item, order_id: orderId }));

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(finalOrderItems);

    if (orderItemsError) {
      throw new Error(`Failed to create order items: ${orderItemsError.message}`);
    }

    // 3. Clear the user's cart after successful order creation
    const { error: clearCartError } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (clearCartError) {
      console.error('Failed to clear cart:', clearCartError);
    }

    // 4. Handle Payment Method: Paystack or Cash on Delivery
    if (payment_method === 'paystack') {
      // Fetch user's email from auth.users for Paystack transaction
      const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(user_id);
      if (userError || !userData.user?.email) {
        throw new Error(`Failed to get user email for Paystack: ${userError?.message}`);
      }
      const customerEmail = userData.user.email;

      // Paystack API call to initialize transaction
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: Math.round(orderTotal * 100), // Paystack expects amount in kobo (cents)
          currency: 'NGN', // IMPORTANT: Set currency to NGN
          reference: orderId, // Use your order ID as reference
          callback_url: `${Deno.env.get('FRONTEND_URL')}/checkout/success?orderId=${orderId}&paymentMethod=paystack`,
          metadata: {
            order_id: orderId,
            user_id: user_id,
            // You can add more metadata here if needed
          },
        }),
      });

      const paystackData = await paystackResponse.json();

      if (!paystackResponse.ok || !paystackData.status) {
        console.error('Paystack API Error:', paystackData);
        throw new Error(`Paystack initialization failed: ${paystackData.message || 'Unknown error'}`);
      }

      // Return the authorization URL to the frontend for redirection
      return new Response(JSON.stringify({ url: paystackData.data.authorization_url, orderId: orderId }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });

    } else if (payment_method === 'cod') {
      // For Cash on Delivery, no external redirect is needed.
      // Return success with the order ID directly.
      return new Response(JSON.stringify({ orderId: orderId, message: 'Cash on Delivery order placed successfully!' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      throw new Error('Invalid payment method provided.');
    }

  } catch (error: any) {
    console.error('Supabase Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400, // Bad Request for client-side errors
    });
  }
});
