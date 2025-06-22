// @/pages/admin/AdminOrderDetail.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for manual generation
import {
  getOrderDetail,
  updateOrderStatus,
  getRiders,
  updateOrderDeliveryDetails,
  ExtendedOrder,
  SimpleRider,
} from '../../lib/services/orderService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/utils';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'];
const DELIVERY_STATUSES = ['unassigned', 'assigned', 'out_for_delivery', 'attempted_delivery', 'delivered', 'delivery_failed'];

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthReady, isAdmin } = useAuth();
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [riders, setRiders] = useState<SimpleRider[]>([]);
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);

  // State for delivery details form
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('unassigned');
  const [trackingNumber, setTrackingNumber] = useState<string>(''); // This will hold the current value in the input
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');


  const fetchOrderDetail = useCallback(async () => {
    if (!isAuthReady || !isAdmin) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      if (!orderId) {
        toast.error('Order ID is missing.');
        navigate('/admin/orders');
        return;
      }
      const { order: fetchedOrder, error } = await getOrderDetail(orderId);

      if (error) {
        toast.error(error.message || 'Failed to load order details.');
        navigate('/admin/orders');
        return;
      }
      setOrder(fetchedOrder);

      // Initialize delivery form states from fetched order
      setSelectedRiderId(fetchedOrder.rider_id || 'unassigned');
      setDeliveryStatus(fetchedOrder.delivery_status || 'unassigned');
      setTrackingNumber(fetchedOrder.tracking_number || ''); // Initialize trackingNumber state
      setEstimatedDeliveryTime(fetchedOrder.estimated_delivery_time ? format(parseISO(fetchedOrder.estimated_delivery_time), "yyyy-MM-dd'T'HH:mm") : '');
      setDeliveryNotes(fetchedOrder.delivery_notes || '');

      console.log('Fetched Order Detail:', fetchedOrder); // Debug log
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId, isAuthReady, isAdmin, navigate]);

  const fetchRiders = useCallback(async () => {
    if (!isAuthReady || !isAdmin) return;
    const fetchedRiders = await getRiders();
    setRiders(fetchedRiders);
  }, [isAuthReady, isAdmin]);

  useEffect(() => {
    fetchOrderDetail();
    fetchRiders();
  }, [fetchOrderDetail, fetchRiders]);

  const handleOrderStatusChange = async (newStatus: string) => {
    if (!order || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    const success = await updateOrderStatus(order.id, newStatus);
    if (success) {
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setIsUpdatingStatus(false);
  };

  const handleManualGenerateTrackingNumber = () => {
    const newTrackingNumber = uuidv4();
    setTrackingNumber(newTrackingNumber);
    toast.info(`Manually generated: ${newTrackingNumber.substring(0, 8)}...`);
  };

  const handleDeliveryDetailsSave = async () => {
    if (!order || isUpdatingDelivery) return;

    setIsUpdatingDelivery(true);
    const updates = {
      rider_id: selectedRiderId === 'unassigned' ? null : selectedRiderId,
      delivery_status: deliveryStatus,
      tracking_number: trackingNumber || null, // Use the current state value
      estimated_delivery_time: estimatedDeliveryTime ? new Date(estimatedDeliveryTime).toISOString() : null,
      delivery_notes: deliveryNotes || null,
    };

    // Pass the current order object to the service function for auto-gen logic
    const success = await updateOrderDeliveryDetails(order.id, order, updates);
    if (success) {
      // Re-fetch order details to ensure all updated fields (including auto-generated tracking number) are fresh
      await fetchOrderDetail();
    }
    setIsUpdatingDelivery(false);
  };


  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading order details...</div>;
  }

  if (!order) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Order not found.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}...</h1>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Key details about this order.</CardDescription>
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
            <p className="font-medium text-lg">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customer Name</p>
            <p className="font-medium">
              {order.user_profile?.first_name && order.user_profile?.last_name
                ? `${order.user_profile.first_name} ${order.user_profile.last_name}`
                : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">Customer User ID</p>
            <p className="font-medium text-sm break-all">{order.user_id}</p>
            {order.user_profile?.phone && (
              <p className="text-sm text-muted-foreground">Phone: {order.user_profile.phone}</p>
            )}
            {order.user_profile?.avatar_url && (
                <img
                    src={order.user_profile.avatar_url}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover mt-2"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/cccccc/333333?text=Avatar`; }}
                />
            )}
          </div>
          <div>
            <Label htmlFor="order-status">Order Status</Label>
            <Select value={order.status} onValueChange={handleOrderStatusChange} disabled={isUpdatingStatus}>
              <SelectTrigger id="order-status" className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin inline-block ml-2" />}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium">{order.payment_method || 'N/A'}</p>
          </div>
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
                      <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.quantity * item.price)}</TableCell>
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

      {/* Delivery & Tracking Management */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery & Tracking Management</CardTitle>
          <CardDescription>Assign a rider and update delivery details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rider Assignment */}
            <div>
              <Label htmlFor="rider-select">Assign Rider</Label>
              <Select
                value={selectedRiderId || 'unassigned'}
                onValueChange={(value) => setSelectedRiderId(value === 'unassigned' ? null : value)}
              >
                <SelectTrigger id="rider-select">
                  <SelectValue placeholder="Select a Rider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {riders.map((rider) => (
                    <SelectItem key={rider.id} value={rider.id}>
                      {rider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {order.assigned_rider && (
                <p className="text-sm text-muted-foreground mt-1">
                  Currently Assigned: {order.assigned_rider.first_name} {order.assigned_rider.last_name}
                  {order.assigned_rider.phone && ` (${order.assigned_rider.phone})`}
                </p>
              )}
            </div>

            {/* Delivery Status */}
            <div>
              <Label htmlFor="delivery-status-select">Delivery Status</Label>
              <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                <SelectTrigger id="delivery-status-select">
                  <SelectValue placeholder="Select Delivery Status" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tracking Number */}
            <div className="flex flex-col"> {/* Use flex-col for label, input, and button */}
              <Label htmlFor="tracking-number">Tracking Number</Label>
              <div className="flex gap-2"> {/* Flex container for input and button */}
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Auto-generated or enter manually"
                  readOnly={!!trackingNumber && trackingNumber !== '' && trackingNumber === order.tracking_number} // Read-only if it has a value AND matches the fetched value
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleManualGenerateTrackingNumber}
                  // Disable if tracking number is already present and matches fetched, preventing regeneration
                  disabled={!!trackingNumber && trackingNumber === order.tracking_number}
                >
                  Auto
                </Button>
              </div>
              {order.tracking_number && (
                <p className="text-sm text-muted-foreground mt-1">
                  Current: {order.tracking_number}
                </p>
              )}
            </div>

            {/* Estimated Delivery Time */}
            <div>
              <Label htmlFor="estimated-delivery-time">Estimated Delivery Time</Label>
              <Input
                id="estimated-delivery-time"
                type="datetime-local"
                value={estimatedDeliveryTime}
                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
              />
            </div>

            {/* Delivery Notes */}
            <div className="md:col-span-2">
              <Label htmlFor="delivery-notes">Delivery Notes</Label>
              <Textarea
                id="delivery-notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Add internal delivery notes"
                rows={3}
              />
            </div>
          </div>

          <Button onClick={handleDeliveryDetailsSave} disabled={isUpdatingDelivery}>
            {isUpdatingDelivery ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUpdatingDelivery ? 'Saving...' : 'Save Delivery Details'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetail;
