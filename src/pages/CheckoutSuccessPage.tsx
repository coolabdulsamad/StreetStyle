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

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products?: { name: string; product_images?: { image_url: string }[] };
  product_variants?: { name: string | null };
}

interface Address {
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  full_name: string | null;
  phone_number: string | null;
}

interface OrderDetails {
  id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
  shipping_address: Address | null;
  billing_address: Address | null;
}

function isOrderDetails(obj: any): obj is OrderDetails {
  return obj && typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.total === 'number' &&
    typeof obj.status === 'string' &&
    typeof obj.payment_method === 'string' &&
    typeof obj.created_at === 'string' &&
    Array.isArray(obj.order_items);
}

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed' | null>(null);
  const [paymentMethodDisplay, setPaymentMethodDisplay] = useState<string>('');
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const MAX_POLLING_ATTEMPTS = 5;

  const fetchOrder = useCallback(async (filter: { id?: string; paystack_reference?: string }) => {
    setIsLoading(true);
    setOrder(null);
    setPaymentStatus(null);
    try {
      let query = supabase
        .from('orders')
        .select(`
          id, total, status, payment_method, created_at,
          order_items:order_items!fk_order_items_order_id(
            id, quantity, price,
            products:products!fk_order_items_product_id(
              name,
              product_images(image_url)
            ),
            product_variants:product_variants!fk_order_items_variant_id(
              name
            )
          ),
          shipping_address:user_addresses!orders_shipping_address_id_fkey(
            street_address, city, state, postal_code, country
          ),
          billing_address:user_addresses!orders_billing_address_id_fkey(
            street_address, city, state, postal_code, country
          )
        `);
      if (filter.id) query = query.eq('id', filter.id as any);
      if (filter.paystack_reference) query = query.eq('paystack_reference', filter.paystack_reference as any);
      console.log('Fetching order with:', filter);
      const { data, error } = await query.single();
      console.log('Supabase data:', data, 'error:', error);
      if (error) {
        setOrder(null);
        setPaymentStatus('failed');
        return;
      }
      if (isOrderDetails(data)) {
        setOrder(data);
        if (data.status === 'completed') setPaymentStatus('success');
        else if (data.status === 'pending_payment') setPaymentStatus('pending');
        else if (data.status === 'pending') setPaymentStatus('success');
        else setPaymentStatus('failed');
        setPaymentMethodDisplay(data.payment_method === 'cod' ? 'Cash on Delivery' : 'Paystack (Card)');
      } else {
        setOrder(null);
        setPaymentStatus('failed');
      }
    } catch (err) {
      setOrder(null);
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempSessionId = queryParams.get('tempSessionId');
    const orderIdFromState = location.state?.orderId;
    const paymentMethodFromState = location.state?.paymentMethod;
    console.log('location.state:', location.state);
    console.log('orderIdFromState:', orderIdFromState);
    console.log('tempSessionId:', tempSessionId);
    let targetOrderId: string | null = null;
    if (orderIdFromState) {
      targetOrderId = orderIdFromState;
      setPaymentMethodDisplay(paymentMethodFromState || 'Cash on Delivery');
      if (!orderIdFromState) {
        toast.error('Order ID missing from navigation state. Please contact support or try again.');
        console.error('COD: Missing orderId in navigation state:', location.state);
      } else {
        console.log('COD: Navigating to success page with orderId:', orderIdFromState);
      }
    } else if (tempSessionId) {
      setPaymentMethodDisplay('Paystack (Card)');
      const pollForOrder = async () => {
        setIsLoading(true);
        try {
          await fetchOrder({ paystack_reference: tempSessionId });
          if (!order && pollingAttempts < MAX_POLLING_ATTEMPTS) {
            setPollingAttempts(prev => prev + 1);
            setTimeout(pollForOrder, 2000);
          }
        } catch {
          setPaymentStatus('failed');
        }
      };
      pollForOrder();
      return;
    }
    // Fallback to a hardcoded order ID for testing if nothing is found
    if (!targetOrderId) {
      console.warn('No orderId found in state or query params, using fallback test order ID.');
      toast.error('Order ID not found. Showing test order for debugging.');
      targetOrderId = 'e5d369dd-08c2-4325-82f5-9623d258e2bc'; // Replace with a real order UUID for your test
    }
    if (targetOrderId) fetchOrder({ id: targetOrderId });
  }, [location.search, location.state, fetchOrder, pollingAttempts]);

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
