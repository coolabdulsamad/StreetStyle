// @/pages/dashboard/orders.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, ExtendedOrder } from '@/lib/services/orderService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const UserOrdersPage = () => {
  const { user, isAuthReady } = useAuth();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!isAuthReady || !user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Pass the user.id to getOrders to fetch only the current user's orders
        const { orders: fetchedOrders, error: fetchError } = await getOrders({ userId: user.id });

        if (fetchError) {
          setError(fetchError.message);
          setOrders([]);
        } else {
          setOrders(fetchedOrders);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders.');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, [isAuthReady, user?.id]);

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Please log in to view your orders.</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading your orders...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>You haven't placed any orders yet.</p>
            <Link to="/" className="text-primary hover:underline mt-2 inline-block">Start Shopping</Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Delivery Status</TableHead> {/* New Column */}
                    <TableHead>Tracking Number</TableHead> {/* New Column */}
                    <TableHead>Assigned Rider</TableHead> {/* New Column */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell><Badge variant="outline">{order.status}</Badge></TableCell>
                      <TableCell>
                          <Badge variant="secondary">{order.delivery_status}</Badge> {/* Display delivery status */}
                      </TableCell>
                      <TableCell>
                          {order.tracking_number || 'N/A'} {/* Display tracking number */}
                      </TableCell>
                      <TableCell>
                          {order.assigned_rider ? `${order.assigned_rider.first_name} ${order.assigned_rider.last_name}` : 'Unassigned'}
                          {order.assigned_rider?.phone && ` (${order.assigned_rider.phone})`}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserOrdersPage;
