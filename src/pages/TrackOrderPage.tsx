// @/pages/TrackOrderPage.tsx
import React, { useState } from 'react';
import { getOrderByTrackingNumber, ExtendedOrder } from '@/lib/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TrackOrderPage = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async () => {
    if (!trackingInput.trim()) {
      toast.error('Please enter a tracking number.');
      return;
    }

    setIsLoading(true);
    setOrder(null);
    setError(null);

    try {
      const { order: fetchedOrder, error: fetchError } = await getOrderByTrackingNumber(trackingInput.trim());

      if (fetchError) {
        setError(fetchError.message || 'Failed to find order with this tracking number.');
        toast.error(fetchError.message || 'Order not found.');
      } else {
        setOrder(fetchedOrder);
        toast.success('Order found!');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast.error('An unexpected error occurred while tracking.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold mt-4">Track Your Order</h1>
        <p className="text-muted-foreground mt-2">Enter your tracking number below to get the latest updates on your delivery.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Label htmlFor="tracking-number-input" className="sr-only">Tracking Number</Label>
            <Input
              id="tracking-number-input"
              type="text"
              placeholder="Enter your tracking number"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTrackOrder();
                }
              }}
              className="h-12 text-lg"
            />
          </div>
          <Button onClick={handleTrackOrder} disabled={isLoading} className="h-12 px-6 text-lg">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {isLoading ? 'Tracking...' : 'Track Order'}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="border-red-500 bg-red-50 text-red-700 p-4">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </Card>
      )}

      {order && (
        <Card className="p-6 space-y-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Information for Order #{order.id.substring(0, 8)}...</CardDescription>
          </CardHeader>
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{format(new Date(order.created_at), 'MMM d,PPPP h:mm a')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Status</p>
              <Badge variant="outline">{order.status}</Badge>
            </div>
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
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Delivery Notes</p>
                <p className="font-medium text-wrap">{order.delivery_notes}</p>
              </div>
            )}
          </CardContent>

          {/* Order Items Section */}
          <div className="pt-4 border-t">
            <h3 className="text-xl font-semibold mb-4">Items in this Order</h3>
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
                      <TableHead className="text-right">Price</TableHead>
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
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrackOrderPage;
