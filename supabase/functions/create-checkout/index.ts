// supabase/functions/create-checkout/index.ts
// This function handles creating orders in Supabase and initiating Paystack transactions.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'; // Use your Supabase JS client version

// Import the shared utility functions
import { validateCartItems } from '../_shared/validateCartItems.ts';
import { PaystackClient } from '../_shared/paystackClient.ts';

// Initialize Paystack client with secret key from environment variables.
const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!;
const paystack = new PaystackClient(PAYSTACK_SECRET_KEY);

// The main handler for the Edge Function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || '*', // Use specific URL in production
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  // Create a Supabase client with the SERVICE_ROLE_KEY.
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  try {
    const { items, shipping_address_id, billing_address_id, payment_method, user_id } = await req.json();

    if (!user_id || !items || items.length === 0 || !shipping_address_id || !payment_method) {
      throw new Error('Missing required checkout data.');
    }

    // Validate cart items and calculate total amount securely on the backend
    const { validatedItems, totalAmount, error: validationError } = await validateCartItems(supabaseClient, items);

    if (validationError) {
      throw new Error(validationError);
    }

    // 1. Create the Order in public.orders table
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user_id,
        total: totalAmount,
        status: payment_method === 'cod' ? 'pending' : 'pending_payment',
        payment_method: payment_method,
        shipping_address_id: shipping_address_id,
        billing_address_id: billing_address_id,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order.');
    }
    const orderId = orderData.id;

    // 2. Create Order Items in public.order_items table
    const orderItemsToInsert = validatedItems.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsToInsert);

    if (orderItemsError) {
      console.error('Error inserting order items:', orderItemsError);
      throw new Error('Failed to create order items.');
    }

    // 3. Clear the user's cart
    const { error: clearCartError } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (clearCartError) {
      console.error('Failed to clear cart:', clearCartError);
    }

    // 4. Handle Payment Method: Paystack or Cash on Delivery
    let responseData: any = { orderId };

    if (payment_method === 'paystack') {
      // Fetch user's email for Paystack transaction
      const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(user_id);
      if (userError || !userData.user?.email) {
        throw new Error(`Failed to get user email for Paystack: ${userError?.message}`);
      }
      const customerEmail = userData.user.email;

      const callbackUrl = `${Deno.env.get('FRONTEND_URL')}/checkout/success?orderId=${orderId}`;

      const paystackResponse = await paystack.initializePayment({
        email: customerEmail,
        amount: totalAmount * 100, // Paystack expects amount in kobo
        reference: orderId,
        callback_url: callbackUrl,
        metadata: {
          order_id: orderId,
          user_id: user_id,
        },
      });

      if (!paystackResponse.status) {
        console.error('Paystack initialization failed:', paystackResponse.message);
        throw new Error(paystackResponse.message || 'Failed to initialize Paystack payment.');
      }
      responseData.url = paystackResponse.data.authorization_url;

    } else if (payment_method === 'cod') {
      // For Cash on Delivery, return success with orderId
      console.log('COD order placed for order:', orderId);
    } else {
      throw new Error('Invalid payment method provided.');
    }

    return new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || '*', // Use specific URL in production
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Supabase Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || '*', // Use specific URL in production
      },
      status: 400,
    });
  }
});
