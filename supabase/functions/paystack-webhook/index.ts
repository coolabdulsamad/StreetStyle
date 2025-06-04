// supabase/functions/paystack-webhook/index.ts
// This function acts as a webhook endpoint for Paystack to notify your system
// about payment events (e.g., successful charges). It now creates the order.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { PaystackClient } from '../_shared/paystackClient.ts';
import { crypto } from 'https://deno.land/std@0.207.0/crypto/mod.ts';
import { toUint8Array } from 'https://deno.land/std@0.207.0/encoding/hex.ts';

const PAYSTACK_WEBHOOK_SECRET = Deno.env.get('PAYSTACK_WEBHOOK_SECRET')!;
const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!;
const paystack = new PaystackClient(PAYSTACK_SECRET_KEY);

// Helper to verify HMAC signature
async function verifyPaystackSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"]
  );

  const signatureBytes = toUint8Array(signature);
  const dataBytes = encoder.encode(payload);

  return crypto.subtle.verify("HMAC", key, signatureBytes, dataBytes);
}

serve(async (req) => {
  // CORS Preflight (Webhooks are server-to-server, but keep for local testing if needed)
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Paystack-Signature, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

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
    const paystackSignature = req.headers.get('x-paystack-signature');
    if (!paystackSignature) {
      return new Response('No Paystack signature header', { status: 400 });
    }

    const rawBody = await req.text();
    const isSignatureValid = await verifyPaystackSignature(rawBody, paystackSignature, PAYSTACK_WEBHOOK_SECRET);

    if (!isSignatureValid) {
      console.warn('Paystack Webhook: Invalid signature.');
      return new Response('Invalid signature', { status: 403 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data; // This 'data' object contains transaction details

    console.log(`Paystack Webhook Event: ${event} for reference: ${data.reference}`);

    // The reference from Paystack is now our temp_checkout_session ID
    const tempSessionId = data.reference;

    // Fetch the temporary checkout session
    const { data: tempSession, error: tempSessionError } = await supabaseClient
      .from('temp_checkout_sessions')
      .select('*')
      .eq('id', tempSessionId)
      .single();

    if (tempSessionError || !tempSession) {
      console.error('Paystack Webhook: Temporary checkout session not found or error:', tempSessionError);
      return new Response('Temporary session not found', { status: 404 });
    }

    // Handle different Paystack events
    switch (event) {
      case 'charge.success':
        // Verify the transaction again with Paystack (recommended for security)
        const verificationResult = await paystack.verifyPayment(tempSessionId);
        if (!verificationResult.status || verificationResult.data.status !== 'success' || verificationResult.data.amount !== data.amount) {
          console.error(`Paystack Webhook: Failed second-tier verification for temp session ${tempSessionId}.`);
          // Mark the order as failed or for manual review if it was already created
          // If not created, log and exit.
          // For now, we'll just return a 400 and let it retry if needed.
          return new Response('Payment verification failed', { status: 400 });
        }

        // --- CRITICAL: Create the final order and order items here ---
        const { data: orderData, error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            user_id: tempSession.user_id,
            total: tempSession.total_amount,
            status: 'completed', // Mark as completed
            payment_method: tempSession.payment_method,
            shipping_address_id: tempSession.shipping_address_id,
            billing_address_id: tempSession.billing_address_id,
            paystack_reference: data.reference, // Store Paystack's reference
            payment_details: data, // Store full Paystack transaction details
            // Add other relevant order fields from tempSession if needed
          })
          .select('id')
          .single();

        if (orderError) {
          console.error('Supabase Webhook: Error creating final order:', orderError);
          return new Response('Error creating final order', { status: 500 });
        }
        const finalOrderId = orderData.id;

        // Create order items
        const orderItemsToInsert = tempSession.cart_items.map((item: any) => ({
          order_id: finalOrderId,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: orderItemsError } = await supabaseClient
          .from('order_items')
          .insert(orderItemsToInsert);

        if (orderItemsError) {
          console.error('Supabase Webhook: Error creating order items:', orderItemsError);
          return new Response('Error creating order items', { status: 500 });
        }

        // Delete the temporary checkout session
        const { error: deleteTempSessionError } = await supabaseClient
          .from('temp_checkout_sessions')
          .delete()
          .eq('id', tempSessionId);

        if (deleteTempSessionError) {
          console.error('Supabase Webhook: Error deleting temporary session:', deleteTempSessionError);
          // Log but don't fail, as the order is already created
        }

        console.log(`Order ${finalOrderId} created and status updated to 'completed' via webhook.`);
        break;

      case 'charge.failed':
      case 'charge.abandoned': // Handle abandoned payments explicitly
        console.warn(`Charge Failed/Abandoned: Ref=${tempSessionId}, Reason=${data.gateway_response || event}`);
        // Optionally, update the temp_checkout_sessions status or delete it
        // For now, we'll just let it expire or be manually cleaned up if not deleted.
        // If you want to explicitly mark the temp session as failed:
        // await supabaseClient.from('temp_checkout_sessions').update({ status: 'failed' }).eq('id', tempSessionId);
        break;

      default:
        console.log(`Unhandled Paystack event: ${event}`);
        break;
    }

    // Always return a 200 OK response to Paystack to acknowledge receipt
    return new Response('Webhook received', { status: 200 });

  } catch (error: any) {
    console.error('Paystack Webhook Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
