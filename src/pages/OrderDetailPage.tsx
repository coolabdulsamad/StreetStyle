// @/pages/dashboard/OrderDetailPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderDetail, ExtendedOrder } from '../lib/services/orderService'; // No update functions needed here

const UserOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthReady } = useAuth();
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    if (!isAuthReady || !user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (!orderId) {
        toast.error('Order ID is missing.');
        navigate('/dashboard/orders');
        return;
      }
      const { order: fetchedOrder, error: fetchError } = await getOrderDetail(orderId);

      if (fetchError) {
        setError(fetchError.message || 'Failed to load order details.');
        setOrder(null);
        // Do not navigate away immediately, show error to user
        return;
      }

      // Important: Ensure the fetched order belongs to the current user
      if (fetchedOrder && fetchedOrder.user_id !== user.id) {
        setError('Access Denied: This order does not belong to your account.');
        setOrder(null);
        // Optionally navigate away after a short delay
        // setTimeout(() => navigate('/dashboard/orders'), 3000);
        return;
      }

      setOrder(fetchedOrder);
      console.log('Fetched User Order Detail:', fetchedOrder); // Debug log
    } catch (err: any) {
      setError(err.message || 'Failed to load order details.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, isAuthReady, user?.id, navigate]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Please log in to view order details.</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading order details...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Order not found.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/dashboard/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Button>
        <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}...</h1>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Key details about your order.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">{format(new Date(order.created_at), 'MMM d,PPPP h:mm a')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium text-lg">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order Status</p>
            <Badge variant="outline">{order.status}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium">{order.payment_method || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Delivery & Tracking Information */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery & Tracking</CardTitle>
          <CardDescription>Current status of your delivery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Delivery Status</p>
            <Badge variant="secondary">{order.delivery_status || 'N/A'}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tracking Number</p>
            <p className="font-medium">{order.tracking_number || 'Not yet assigned'}</p>
          </div>
          {order.assigned_rider && (
            <div>
              <p className="text-sm text-muted-foreground">Assigned Rider</p>
              <p className="font-medium">
                {order.assigned_rider.first_name} {order.assigned_rider.last_name}
                {order.assigned_rider.phone && ` (${order.assigned_rider.phone})`}
              </p>
            </div>
          )}
          {order.estimated_delivery_time && (
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery Time</p>
              <p className="font-medium">{format(new Date(order.estimated_delivery_time), 'MMM d,PPPP h:mm a')}</p>
            </div>
          )}
          {order.delivery_notes && (
            <div>
              <p className="text-sm text-muted-foreground">Delivery Notes</p>
              <p className="font-medium text-wrap">{order.delivery_notes}</p>
            </div>
          )}
          {/* Future: Add a map component here for live tracking */}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Products included in this order.</CardDescription>
        </CardHeader>
        <CardContent>
          {order.order_items && order.order_items.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Product SKU</TableHead>
                    <TableHead>Variant Details</TableHead>
                    <TableHead>Variant SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price per Item</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.products?.main_image_url || `https://placehold.co/60x60/cccccc/333333?text=No+Img`}
                          alt={item.products?.name || "Product Image"}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => { e.currentTarget.src = `https://placehold.co/60x60/cccccc/333333?text=No+Img`; }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.products?.name || 'Unknown Product'}
                      </TableCell>
                      <TableCell>
                        {item.products?.sku || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {item.product_variants?.name ||
                         (item.product_variants?.color && item.product_variants?.size
                            ? `${item.product_variants.color} / ${item.product_variants.size}`
                            : 'N/A')}
                      </TableCell>
                      <TableCell>
                        {item.product_variants?.sku || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No items found for this order.</p>
          )}
        </CardContent>
      </Card>

      {/* Shipping and Billing Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            <CardDescription>Where the order will be shipped.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>{order.shipping_address?.street_address}</p>
            <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p>
            <p>{order.shipping_address?.country}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
            <CardDescription>Where the order was billed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>{order.billing_address?.street_address}</p>
            <p>{order.billing_address?.city}, {order.billing_address?.state} {order.billing_address?.postal_code}</p>
            <p>{order.billing_address?.country}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOrderDetailPage;
