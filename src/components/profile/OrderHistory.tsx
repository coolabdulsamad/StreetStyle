
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Define the Order type
type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  deliveryDate?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-1234',
    date: '2023-05-15T10:30:00Z',
    status: 'delivered',
    total: 249.98,
    trackingNumber: 'TRK9876543210',
    deliveryDate: '2023-05-20T14:20:00Z',
    items: [
      {
        id: 'item-1',
        name: 'Nike Air Max 270',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        variant: 'Black/White - US 10',
        price: 149.99,
        quantity: 1
      },
      {
        id: 'item-2',
        name: 'Supreme Box Logo T-Shirt',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
        variant: 'Red - Large',
        price: 99.99,
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD-5678',
    date: '2023-06-02T09:15:00Z',
    status: 'shipped',
    total: 189.95,
    trackingNumber: 'TRK1234567890',
    items: [
      {
        id: 'item-3',
        name: 'Adidas Ultraboost',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
        variant: 'Cloud White - US 9',
        price: 189.95,
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD-9012',
    date: '2023-06-10T16:45:00Z',
    status: 'processing',
    total: 349.97,
    items: [
      {
        id: 'item-4',
        name: 'Jordan 1 Retro High',
        image: 'https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
        variant: 'Chicago - US 11',
        price: 179.99,
        quantity: 1
      },
      {
        id: 'item-5',
        name: 'Off-White Industrial Belt',
        image: 'https://images.unsplash.com/photo-1588099768523-f4e6a5300f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        variant: 'Yellow',
        price: 169.98,
        quantity: 1
      }
    ]
  }
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface OrderHistoryProps {
  userId?: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [orders] = React.useState<Order[]>(mockOrders);

  const viewOrderDetails = (orderId: string) => {
    // In a real app, this would navigate to an order detail page
    console.log(`Viewing order details for order ${orderId}`);
  };

  const handleBuyAgain = (items: OrderItem[]) => {
    // In a real app, this would add all items to cart and navigate to cart page
    console.log('Adding all items to cart:', items);
    navigate('/cart');
  };

  const handleTrackOrder = (trackingNumber: string) => {
    // In a real app, this would navigate to a tracking page or open the courier's tracking page
    console.log(`Tracking order with tracking number ${trackingNumber}`);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet.
        </p>
        <Button onClick={() => navigate('/products')}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewOrderDetails(order.id)}
                    >
                      View Details
                    </Button>
                    {order.trackingNumber && (order.status === 'shipped' || order.status === 'delivered') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackOrder(order.trackingNumber!)}
                      >
                        Track Order
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button
                        size="sm"
                        onClick={() => handleBuyAgain(order.items)}
                      >
                        Buy Again
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.variant}
                          </p>
                          <div className="mt-1 flex justify-between">
                            <p className="text-sm">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    {order.deliveryDate && order.status === 'delivered' && (
                      <p className="text-sm text-muted-foreground">
                        Delivered on {formatDate(order.deliveryDate)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total
                    </p>
                    <p className="text-lg font-medium">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          {orders.filter(order => order.status === 'processing').map((order) => (
            <Card key={order.id} className="overflow-hidden">
              {/* Same card content as above */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-6">
          {orders.filter(order => order.status === 'shipped').map((order) => (
            <Card key={order.id} className="overflow-hidden">
              {/* Same card content as above */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-6">
          {orders.filter(order => order.status === 'delivered').map((order) => (
            <Card key={order.id} className="overflow-hidden">
              {/* Same card content as above */}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderHistory;
