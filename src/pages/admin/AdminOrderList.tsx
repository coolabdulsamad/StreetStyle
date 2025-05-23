
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus } from '@/lib/types';

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('orders' as any)
        .select(`
          *,
          shipping_address(*),
          billing_address(*)
        `)
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`id.ilike.%${searchQuery}%,order_number.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrders(data as unknown as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setTrackingNumber(order.tracking_number || '');
    setIsDialogOpen(true);
  };
  
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const { error } = await supabase
        .from('orders' as any)
        .update({
          order_status: newStatus,
          tracking_number: trackingNumber || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);
      
      if (error) throw error;
      
      toast.success('Order updated successfully');
      setIsDialogOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };
  
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <div className="relative w-64">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-md shadow">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-md shadow">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipping Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number || order.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    {order.shipping_address ? 
                      `${order.shipping_address.first_name} ${order.shipping_address.last_name}` : 
                      'No customer info'}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.order_status)}>
                      {order.order_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.shipping_method || 'Standard'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      View / Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.order_number || selectedOrder?.id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <p className="text-sm">Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  <p className="text-sm">Total: ${selectedOrder.total.toFixed(2)}</p>
                  <p className="text-sm">Payment: {selectedOrder.payment_method || 'Unknown'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  {selectedOrder.shipping_address ? (
                    <div className="text-sm">
                      <p>{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</p>
                      <p>{selectedOrder.shipping_address.phone || 'No phone'}</p>
                    </div>
                  ) : (
                    <p className="text-sm">No customer information available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  {selectedOrder.shipping_address ? (
                    <div className="text-sm">
                      <p>{selectedOrder.shipping_address.address_line1}</p>
                      {selectedOrder.shipping_address.address_line2 && <p>{selectedOrder.shipping_address.address_line2}</p>}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}</p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm">No shipping address available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Billing Address</h3>
                  {selectedOrder.billing_address ? (
                    <div className="text-sm">
                      <p>{selectedOrder.billing_address.address_line1}</p>
                      {selectedOrder.billing_address.address_line2 && <p>{selectedOrder.billing_address.address_line2}</p>}
                      <p>{selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postal_code}</p>
                      <p>{selectedOrder.billing_address.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm">Same as shipping address</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Update Order</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Order Status</Label>
                    <Select
                      value={newStatus}
                      onValueChange={(value) => setNewStatus(value as OrderStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrderList;
