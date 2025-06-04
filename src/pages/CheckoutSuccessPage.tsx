// @/pages/CheckoutSuccessPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageLayout from '@/components/layout/PageLayout';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

// Define a type for your order (adjust based on your orders table schema)
interface OrderDetails {
  id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: { name: string; product_images: { image_url: string }[] | null };
    product_variants: { name: string | null };
  }>;
  shipping_address: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    full_name: string | null;
    phone_number: string | null;
  } | null;
  billing_address: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    full_name: string | null;
    phone_number: string | null;
  } | null;
}

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed' | null>(null);
  const [paymentMethodDisplay, setPaymentMethodDisplay] = useState<string>('');
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const MAX_POLLING_ATTEMPTS = 5; // Max retries for polling

  const getOrderStatus = useCallback(async (orderId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items!order_items_order_id_fkey(
            id, quantity, price,
            products!order_items_product_id_fkey(
              name,
              product_images(image_url)
            ),
            product_variants!order_items_variant_id_fkey(
              name
            )
          ),
          shipping_address:user_addresses!orders_shipping_address_id_fkey(
            street_address, city, state, postal_code, country, full_name, phone_number
          ),
          billing_address:user_addresses!orders_billing_address_id_fkey(
            street_address, city, state, postal_code, country, full_name, phone_number
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order details:', error);
        // If order not found, it might be due to webhook delay.
        // Only toast error if it's a persistent issue after polling.
        setOrder(null);
        setPaymentStatus('failed'); // Default to failed if not found
      } else if (data) {
        setOrder(data as OrderDetails);
        if (data.status === 'completed') {
          setPaymentStatus('success');
        } else if (data.status === 'pending_payment') {
          setPaymentStatus('pending'); // Payment initiated but not yet confirmed by webhook
        } else if (data.status === 'pending') { // For COD
          setPaymentStatus('success'); // COD is 'successful' in terms of placement
        } else {
          setPaymentStatus('failed'); // Any other status
        }
        setPaymentMethodDisplay(data.payment_method === 'cod' ? 'Cash on Delivery' : 'Paystack (Card)');
      } else {
        setOrder(null);
        setPaymentStatus('failed');
      }
    } catch (err: any) {
      console.error('Unexpected error fetching order:', err);
      setOrder(null);
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempSessionId = queryParams.get('tempSessionId'); // Now looking for tempSessionId
    const orderIdFromState = location.state?.orderId; // For COD payments

    let targetOrderId: string | null = null;

    if (orderIdFromState) {
      // This is for COD payments, where the order is created immediately
      targetOrderId = orderIdFromState;
      setPaymentMethodDisplay(location.state?.paymentMethod || 'Cash on Delivery');
    } else if (tempSessionId) {
      // This is for Paystack payments, where the order is created by webhook
      // We need to poll for the actual order using the tempSessionId as reference
      setPaymentMethodDisplay('Paystack (Card)');
      // We will now poll for the order that has this tempSessionId as its reference
      const pollForOrder = async () => {
        setIsLoading(true);
        try {
          const { data: orderData, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items!order_items_order_id_fkey(
                id, quantity, price,
                products!order_items_product_id_fkey(
                  name,
                  product_images(image_url)
                ),
                product_variants!order_items_variant_id_fkey(
                  name
                )
              ),
              shipping_address:user_addresses!orders_shipping_address_id_fkey(
                street_address, city, state, postal_code, country, full_name, phone_number
              ),
              billing_address:user_addresses!orders_billing_address_id_fkey(
                street_address, city, state, postal_code, country, full_name, phone_number
              )
            `)
            .eq('paystack_reference', tempSessionId) // Match by Paystack reference
            .single();

          if (error && error.code === 'PGRST116' && pollingAttempts < MAX_POLLING_ATTEMPTS) {
            // PGRST116 means "No rows found". This is expected if webhook hasn't fired yet.
            console.log(`Polling for order (attempt ${pollingAttempts + 1}/${MAX_POLLING_ATTEMPTS})...`);
            setPollingAttempts(prev => prev + 1);
            setTimeout(() => pollForOrder(), 2000); // Retry after 2 seconds
          } else if (orderData) {
            setOrder(orderData as OrderDetails);
            if (orderData.status === 'completed') {
              setPaymentStatus('success');
            } else {
              setPaymentStatus('pending'); // Still pending, but order found
            }
            setIsLoading(false);
          } else {
            // Order not found after max attempts or other error
            toast.error('Order not found or payment failed after verification.');
            setPaymentStatus('failed');
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Error during polling:', err);
          toast.error('An unexpected error occurred during order verification.');
          setPaymentStatus('failed');
          setIsLoading(false);
        }
      };

      pollForOrder(); // Start polling
    } else {
      // No valid orderId or tempSessionId, redirect
      toast.error('Invalid access to success page. Redirecting...');
      navigate('/');
      return;
    }

    // For COD orders, getOrderStatus is called directly
    if (targetOrderId) {
      getOrderStatus(targetOrderId);
    }
  }, [location.search, location.state, navigate, getOrderStatus, pollingAttempts]);


  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Verifying your order...
        </div>
      </PageLayout>
    );
  }

  if (!order || paymentStatus === 'failed') {
    return (
      <PageLayout>
        <div className="container py-10 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Order Failed or Not Found</h1>
          <p className="text-muted-foreground mb-6">There was an issue processing your order or retrieving its details. Please check your order history or contact support.</p>
          <Button onClick={() => navigate('/dashboard/orders')}>View My Orders</Button>
          <Button variant="outline" className="ml-4" onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="text-center mb-8">
          {paymentStatus === 'success' ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <Loader2 className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-spin" />
          )}
          <h1 className="text-3xl font-bold mb-2">
            {paymentStatus === 'success' ? 'Order Placed Successfully!' : 'Order Placed - Payment Pending'}
          </h1>
          <p className="text-muted-foreground">
            {paymentStatus === 'success'
              ? 'Thank you for your purchase! Your order has been confirmed.'
              : 'Your order has been placed, and we are verifying your payment. This may take a moment.'}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Order #{order.id.substring(0, 8)}...</CardTitle>
            <CardDescription>Details for your recent order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Order Summary:</h3>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span className="font-medium capitalize">{order.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Method:</span>
                <span className="font-medium">{paymentMethodDisplay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Order Date:</span>
                <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items:</h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.products?.product_images?.[0]?.image_url || `https://placehold.co/60x60/cccccc/333333?text=No+Img`}
                      alt={item.products?.name || 'Product'}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => { e.currentTarget.src = `https://placehold.co/60x60/cccccc/333333?text=No+Img`; }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.products?.name || 'N/A'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product_variants?.name || 'N/A'} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Address:</h3>
              {order.shipping_address ? (
                <div className="text-sm text-muted-foreground">
                  <p>{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.street_address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone_number && <p>{order.shipping_address.phone_number}</p>}
                </div>
              ) : (
                <p className="text-muted-foreground">Address not available.</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Billing Address:</h3>
              {order.billing_address ? (
                <div className="text-sm text-muted-foreground">
                  <p>{order.billing_address.full_name}</p>
                  <p>{order.billing_address.street_address}</p>
                  <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}</p>
                  <p>{order.billing_address.country}</p>
                  {order.billing_address.phone_number && <p>{order.billing_address.phone_number}</p>}
                </div>
              ) : (
                <p className="text-muted-foreground">Address not available.</p>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Link to="/dashboard/orders">
                <Button>View My Orders</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CheckoutSuccessPage;
