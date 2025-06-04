// supabase/functions/initiate-paystack-payment/index.ts
// This function creates a temporary checkout session and initializes Paystack payment.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

// Import the shared utility functions
import { validateCartItems } from '../_shared/validateCartItems.ts';
import { PaystackClient } from '../_shared/paystackClient.ts';

// Initialize Paystack client with secret key from environment variables.
const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!;
const paystack = new PaystackClient(PAYSTACK_SECRET_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || '*',
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

    if (!user_id || !items || items.length === 0 || !shipping_address_id || !billing_address_id || !payment_method) {
      throw new Error('Missing required checkout data.');
    }

    // 1. Validate cart items and calculate total amount securely on the backend
    const { validatedItems, totalAmount, error: validationError } = await validateCartItems(supabaseClient, items);

    if (validationError) {
      throw new Error(validationError);
    }

    // 2. Clear the user's cart (moved here, as order creation is now later)
    // This prevents double orders if user goes back to cart after initiating payment
    const { error: clearCartError } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (clearCartError) {
      console.error('Failed to clear cart:', clearCartError);
      // Don't throw, as this is not critical for payment initiation
    }

    // 3. Create a temporary checkout session record
    const { data: tempSessionData, error: tempSessionError } = await supabaseClient
      .from('temp_checkout_sessions')
      .insert({
        user_id: user_id,
        cart_items: validatedItems, // Store validated items
        shipping_address_id: shipping_address_id,
        billing_address_id: billing_address_id,
        payment_method: payment_method,
        total_amount: totalAmount,
      })
      .select('id')
      .single();

    if (tempSessionError) {
      console.error('Error creating temporary checkout session:', tempSessionError);
      throw new Error('Failed to prepare checkout session.');
    }
    const tempSessionId = tempSessionData.id; // This will be our Paystack reference

    // 4. Handle Payment Method: Paystack or Cash on Delivery
    let responseData: any = { tempSessionId }; // Return tempSessionId instead of orderId

    if (payment_method === 'paystack') {
      // Fetch user's email for Paystack transaction
      const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(user_id);
      if (userError || !userData.user?.email) {
        throw new Error(`Failed to get user email for Paystack: ${userError?.message}`);
      }
      const customerEmail = userData.user.email;

      // Paystack callback URL will include the tempSessionId
      const callbackUrl = `${Deno.env.get('FRONTEND_URL')}/checkout/success?tempSessionId=${tempSessionId}`;
      console.log("Paystack Callback URL:", callbackUrl);

      const paystackResponse = await paystack.initializePayment({
        email: customerEmail,
        amount: totalAmount * 100, // Paystack expects amount in kobo
        reference: tempSessionId, // Use tempSessionId as Paystack reference
        callback_url: callbackUrl,
        metadata: {
          temp_session_id: tempSessionId,
          user_id: user_id,
          // Add other crucial data here if needed, but temp_session_id should be enough
        },
      });

      if (!paystackResponse.status) {
        console.error('Paystack initialization failed:', paystackResponse.message);
        throw new Error(paystackResponse.message || 'Failed to initialize Paystack payment.');
      }
      responseData.url = paystackResponse.data.authorization_url;

    } else if (payment_method === 'cod') {
      // For Cash on Delivery, no external redirect is needed.
      // We can directly create the order here as no payment gateway is involved.
      const { data: orderData, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          user_id: user_id,
          total: totalAmount,
          status: 'pending', // COD orders start as 'pending'
          payment_method: payment_method,
          shipping_address_id: shipping_address_id,
          billing_address_id: billing_address_id,
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('Error creating COD order:', orderError);
        throw new Error('Failed to create COD order.');
      }
      responseData.orderId = orderData.id; // Return the actual order ID for COD
      responseData.message = 'Cash on Delivery order placed successfully!';

    } else {
      throw new Error('Invalid payment method provided.');
    }

    return new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || '*',
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Initiate Paystack Payment Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': Deno.env.get('FRONTEND_URL') || '*',
      },
      status: 400,
    });
  }
});
