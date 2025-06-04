// @/pages/admin/AdminOrderList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label'; // Ensure Label is imported

// Import the new order service functions and type
import { getOrders, updateOrderStatus, ExtendedOrder } from '../../lib/services/orderService';

// Define possible order statuses (adjust based on your actual database enum/values)
const ORDER_STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'];

const AdminOrderList = () => {
  const { isAuthReady, isAdmin } = useAuth();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All'); // State for status filter

  // Function to fetch orders, now accepting a status filter
  const fetchOrders = useCallback(async () => {
    if (!isAuthReady || !isAdmin) {
      setIsLoadingOrders(false);
      return;
    }
    setIsLoadingOrders(true);
    try {
      const { orders: fetchedOrders, error } = await getOrders({ status: filterStatus });

      if (error) throw error;
      setOrders(fetchedOrders);
      console.log('Fetched Orders:', fetchedOrders); // Debug log
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders for admin panel.');
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [isAuthReady, isAdmin, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handler for inline status update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  if (isLoadingOrders) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading orders...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Order Management</h1>

      {/* Filter Section */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="status-filter">Filter by Status:</Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger id="status-filter" className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders found matching the criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Order ID</TableHead>
                    <TableHead className="min-w-[150px]">Date</TableHead>
                    <TableHead className="min-w-[200px]">Customer</TableHead>
                    <TableHead className="text-right min-w-[100px]">Total</TableHead>
                    <TableHead className="min-w-[150px]">Status</TableHead>
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>
                        {order.user_profile?.first_name && order.user_profile?.last_name
                          ? `${order.user_profile.first_name} ${order.user_profile.last_name}`
                          : order.user_id} {/* Fallback to user_id if no profile name */}
                      </TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.filter(s => s !== 'All').map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderList;
