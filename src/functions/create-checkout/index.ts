import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

serve(async (req) => {
  // CORS preflight handler
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const {
    items,
    shipping_address_id,
    billing_address_id,
    payment_method,
    user_id
  } = await req.json();

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: { persistSession: false },
    }
  );

  try {
    let orderTotal = 0;
    const orderItemsToInsert: any[] = [];

    for (const item of items) {
      const { data: productVariant, error: variantError } = await supabaseClient
        .from('product_variants')
        .select('price, product_id')
        .eq('id', item.variant.id)
        .single();

      if (variantError || !productVariant) {
        throw new Error(`Variant not found for item ${item.variant.id}: ${variantError?.message}`);
      }

      const itemPrice = productVariant.price;
      orderTotal += itemPrice * item.quantity;

      orderItemsToInsert.push({
        order_id: null,
        product_id: productVariant.product_id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user_id,
        total: orderTotal,
        status: payment_method === 'cod' ? 'pending' : 'pending_payment',
        shipping_address_id: shipping_address_id,
        billing_address_id: billing_address_id,
        payment_method: payment_method,
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    const orderId = orderData.id;

    const finalOrderItems = orderItemsToInsert.map(item => ({ ...item, order_id: orderId }));

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(finalOrderItems);

    if (orderItemsError) {
      throw new Error(`Failed to create order items: ${orderItemsError.message}`);
    }

    await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (payment_method === 'paystack') {
      const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(user_id);
      if (userError || !userData.user?.email) {
        throw new Error(`Failed to get user email for Paystack: ${userError?.message}`);
      }

      const customerEmail = userData.user.email;

      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: Math.round(orderTotal * 100),
          currency: 'NGN',
          reference: orderId,
          callback_url: `${Deno.env.get('FRONTEND_URL')}/checkout/success?orderId=${orderId}&paymentMethod=paystack`,
          metadata: { order_id: orderId, user_id: user_id },
        }),
      });

      const paystackData = await paystackResponse.json();

      if (!paystackResponse.ok || !paystackData.status) {
        throw new Error(`Paystack initialization failed: ${paystackData.message || 'Unknown error'}`);
      }

      return new Response(JSON.stringify({ url: paystackData.data.authorization_url, orderId }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } else if (payment_method === 'cod') {
      return new Response(JSON.stringify({ orderId, message: 'Cash on Delivery order placed successfully!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      throw new Error('Invalid payment method provided.');
    }

  } catch (error: any) {
    console.error('Supabase Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
