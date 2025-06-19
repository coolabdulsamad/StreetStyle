import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Import your generated Supabase database types
import { Database } from '@/lib/types';

// Derive types directly from your database schema for type safety
type OrderRow = Database['public']['Tables']['orders']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductReviewRow = Database['public']['Tables']['product_reviews']['Row'];
type ProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
}

interface SalesData {
  date: string;
  orders: number;
  revenue: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  views: number; // Placeholder for now, unless you track product views
}

interface ReviewData {
  rating: number;
  count: number;
}

interface InventoryAlert {
  id: string;
  name: string; // Product or variant name
  sku: string;
  stock: number;
  status: 'low' | 'out_of_stock';
}

interface RecentActivityItem {
  type: 'order' | 'review' | 'user';
  id: string;
  description: string;
  timestamp: string;
  user_id: string; // Keep user_id to map profiles later
  rating?: number; // Added for review items
}

const AdminDashboard = () => {
  const { user, isAdmin, isAuthReady, accessToken } = useAuth(); // NEW: Get accessToken from useAuth
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    userGrowth: 0,
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariantRow[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // fetchDashboardData now directly uses the accessToken from its closure,
  // or it can still accept it as an argument if preferred for clarity.
  // I'll keep it accepting as an argument for now, but the dependency array will change.
  const fetchDashboardData = useCallback(async (currentAccessToken: string) => { // Accept accessToken as argument
    setIsLoadingDashboard(true);
    try {
      const EDGE_FUNCTION_URL = 'https://slwemioxqphyjyfelxpb.supabase.co/functions/v1/get-user-stats';

      const edgeFunctionHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentAccessToken}`, // Use the passed accessToken
      };
      console.log('User Access Token used for Edge Function call:', currentAccessToken);


      const [
        ordersResult,
        productsResult,
        reviewsResult,
        productVariantsResult,
        userStatsResponse,
      ] = await Promise.all([
        supabase.from('orders').select('id, total, created_at, user_id'),
        supabase.from('products').select('id, name'),
        supabase.from('product_reviews').select('rating, created_at, user_id, product_id, comment'),
        supabase.from('product_variants').select('id, name, sku, stock'),
        fetch(EDGE_FUNCTION_URL, {
          method: 'GET',
          headers: edgeFunctionHeaders,
        }),
      ]);

      const orders: OrderRow[] = ordersResult.data || [];
      const products: ProductRow[] = productsResult.data || [];
      const reviews: ProductReviewRow[] = reviewsResult.data || [];
      
      console.log('Product Variants Raw Data (from Supabase):', productVariantsResult.data);
      console.log('Product Variants Error (from Supabase):', productVariantsResult.error);
      setProductVariants(productVariantsResult.data || []);
      console.log('Product Variants state after set:', productVariantsResult.data);

      // --- 2. Process User Stats from Edge Function Response ---
      let totalUsers = 0;
      let userGrowthCalculated = 0;
      if (userStatsResponse.ok) {
        const userStatsData = await userStatsResponse.json();
        const { totalUsers: fetchedTotalUsers, recentUsersCount, previousUsersCount } = userStatsData;
        totalUsers = fetchedTotalUsers;
        userGrowthCalculated = previousUsersCount > 0 ? ((recentUsersCount - previousUsersCount) / previousUsersCount) * 100 : 0;
        console.log('Fetched User Stats (from Edge Function):', userStatsData);
      } else {
        const errorText = await userStatsResponse.text();
        console.error('Error fetching user stats from Edge Function:', userStatsResponse.status, errorText);
        toast.error('Failed to load user statistics.');
        totalUsers = 0;
        userGrowthCalculated = 0;
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentOrders = orders.filter(order => new Date(order.created_at) >= thirtyDaysAgo);
      const previousOrders = orders.filter(order => {
        const date = new Date(order.created_at);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      });

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: totalUsers,
        totalProducts: products.length,
        revenueGrowth: previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
        orderGrowth: previousOrders.length > 0 ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 : 0,
        userGrowth: userGrowthCalculated,
      });

      // --- 3. Generate Sales Data for last 7 days ---
      const salesByDay: SalesData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.toDateString() === date.toDateString();
        });
        
        salesByDay.push({
          date: format(date, 'MMM d'),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        });
      }
      setSalesData(salesByDay);

      // --- 4. Fetch Product Performance (Top Sales) ---
      const { data: orderItemsData, error: orderItemsError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          price,
          products!
          fk_order_items_product_id(name)
        `);

      if (orderItemsError) {
        console.error('Error fetching order items for product performance:', orderItemsError);
        toast.error('Failed to load product performance data.');
      } else {
        const productSalesMap = new Map<string, { name: string, sales: number, revenue: number, views: number }>();
        (orderItemsData || []).forEach(item => {
          const productId = item.product_id;
          const productName = (item.products as { name: string } | null)?.name || 'Unknown Product';
          const quantity = item.quantity;
          const price = item.price;

          if (!productSalesMap.has(productId)) {
            productSalesMap.set(productId, { name: productName, sales: 0, revenue: 0, views: 0 });
          }
          const current = productSalesMap.get(productId)!;
          current.sales += quantity;
          current.revenue += quantity * price;
        });

        const topProducts = Array.from(productSalesMap.values())
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);
        setProductPerformance(topProducts);
      }

      // --- 5. Process Review Data ---
      const reviewCounts = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: reviews.filter(review => review.rating === rating).length
      }));
      setReviewData(reviewCounts);

      // --- 6. Inventory Alerts ---
      const lowStockThreshold = 10;
      const alerts: InventoryAlert[] = [];
      console.log('Starting Inventory Alert calculation with threshold:', lowStockThreshold);
      
      (productVariantsResult.data || []).forEach(variant => {
        if (variant.stock !== null && typeof variant.stock === 'number') {
          console.log(`Processing variant ID: ${variant.id}, SKU: ${variant.sku}, Stock: ${variant.stock}`);
          if (variant.stock <= 0) {
            alerts.push({
              id: variant.id,
              name: variant.name || `Variant SKU: ${variant.sku}`,
              sku: variant.sku,
              stock: variant.stock,
              status: 'out_of_stock',
            });
            console.log(`- Added to Out of Stock: ${variant.sku}`);
          } else if (variant.stock > 0 && variant.stock <= lowStockThreshold) {
            alerts.push({
              id: variant.id,
              name: variant.name || `Variant SKU: ${variant.sku}`,
              sku: variant.sku,
              stock: variant.stock,
              status: 'low',
            });
            console.log(`- Added to Low Stock: ${variant.sku}`);
          }
        } else {
            console.warn(`Variant ID: ${variant.id} has invalid/null stock value:`, variant.stock);
        }
      });
      console.log('Final Generated Inventory Alerts Array (before set):', alerts);
      setInventoryAlerts(alerts);
      console.log('Inventory Alerts state after set:', alerts);

      // --- 7. Recent Activity (Manual Joins) ---
      const tempRecentActivities: RecentActivityItem[] = [];

      console.log('Raw Orders Data for Recent Activity:', orders);
      console.log('Raw Reviews Data for Recent Activity:', reviews);

      // Collect all unique user_ids from orders and reviews
      const userIds = new Set<string>();
      orders.forEach(order => order.user_id && userIds.add(order.user_id));
      reviews.forEach(review => review.user_id && userIds.add(review.user_id));
      console.log('Unique User IDs for Profile Fetch:', Array.from(userIds));

      // Fetch profiles for all collected user_ids
      let profilesMap = new Map<string, ProfileRow>();
      if (userIds.size > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', Array.from(userIds));

        if (profilesData && !profilesError) {
          profilesData.forEach(profile => profilesMap.set(profile.id, profile));
          console.log('Fetched Profiles Data:', profilesData);
          console.log('Fetched Profiles Map:', profilesMap);
        } else if (profilesError) {
          console.error('Error fetching profiles for recent activity:', profilesError);
        }
      }

      // Fetch product names for reviews
      const productIds = new Set<string>();
      reviews.forEach(review => review.product_id && productIds.add(review.product_id));
      let productsMap = new Map<string, ProductRow>();
      if (productIds.size > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .in('id', Array.from(productIds));

        if (productsData && !productsError) {
          productsData.forEach(product => productsMap.set(product.id, product));
          console.log('Fetched Products Data (for reviews):', productsData);
          console.log('Fetched Products Map (for reviews):', productsMap);
        } else if (productsError) {
          console.error('Error fetching product names for recent reviews:', productsError);
        }
      }


      // Process recent orders
      orders.slice(0, 5).forEach(order => {
        const profile = profilesMap.get(order.user_id);
        const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown User';
        tempRecentActivities.push({
          type: 'order',
          id: order.id,
          description: `New order #${order.id.substring(0, 8)} by ${userName} for $${order.total.toFixed(2)}`,
          timestamp: order.created_at,
          user_id: order.user_id,
        });
      });

      // Process recent reviews
      reviews.slice(0, 5).forEach(review => {
        const profile = profilesMap.get(review.user_id);
        const product = productsMap.get(review.product_id);
        
        const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown User';
        const productName = product?.name || 'Unknown Product';
        
        tempRecentActivities.push({
          type: 'review',
          id: review.id,
          description: `${userName} reviewed ${productName}: "${review.comment?.substring(0, 50) || 'No comment'}..."`,
          timestamp: review.created_at,
          rating: review.rating,
          user_id: review.user_id,
        });
      });

      // Sort all recent activities by timestamp
      tempRecentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(tempRecentActivities.slice(0, 5));
      console.log('Recent Activity state after set:', tempRecentActivities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Some sections might be unavailable.');
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []); // fetchDashboardData no longer depends on accessToken from outside, it receives it as an argument

  useEffect(() => {
    // CRITICAL: Ensure isAuthReady, isAdmin, and accessToken are all available and valid
    if (isAuthReady && isAdmin && accessToken && accessToken.length > 0) {
      fetchDashboardData(accessToken); // Pass the accessToken directly
    } else if (isAuthReady && !isAdmin) {
      setIsLoadingDashboard(false);
      console.warn("User is not an admin. Cannot load dashboard data.");
    } else if (isAuthReady && isAdmin && (!accessToken || accessToken.length === 0)) {
      console.warn("Admin user is authenticated but access token is not yet available/empty. Waiting for token...");
      setIsLoadingDashboard(true);
    }
  }, [isAuthReady, isAdmin, accessToken, fetchDashboardData]); // Now accessToken is a direct dependency

  if (!isAuthReady || isLoadingDashboard) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard data...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email || 'Admin'}! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${stats.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.orderGrowth >= 0 ? '+' : ''}{stats.orderGrowth.toFixed(1)}%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth.toFixed(1)}%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products in catalog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily sales for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders, reviews, and registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-muted-foreground text-center">No recent activity to display.</p>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-blue-500 mr-2" />}
                        {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-500 mr-2" />}
                        {activity.type === 'user' && <Users className="h-4 w-4 text-green-500 mr-2" />}
                        <div className="ml-2 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.type === 'review' ? (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 inline-block ${i < (activity.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2">{activity.description.split(': ')[0]}</span>
                              </>
                            ) : (
                              activity.description
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.type === 'review' ? activity.description.split(': ')[1] : activity.description}
                            <span className="ml-2 text-xs">
                             {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products by sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.length === 0 ? (
                  <p className="text-center text-muted-foreground">No product performance data available.</p>
                ) : (
                  productPerformance.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.views > 0 ? `${product.views} views` : 'N/A views'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.sales} sales</p>
                        <p className="text-sm text-muted-foreground">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Review Distribution</CardTitle>
                <CardDescription>Customer ratings breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reviewData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ rating, count }) => `${rating}★ (${count})`}
                    >
                      {reviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.filter(item => item.type === 'review').length === 0 ? (
                    <p className="text-muted-foreground text-center">No recent reviews to display.</p>
                  ) : (
                    recentActivity.filter(item => item.type === 'review').map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < (activity.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{activity.description.split(': ')[0]}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description.split(': ')[1]}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inventoryAlerts.filter(a => a.status === 'low').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Items below {10} units
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inventoryAlerts.filter(a => a.status === 'out_of_stock').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Items needing restock
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productVariants.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active product variants
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryAlerts.length === 0 ? (
                  <p className="text-center text-muted-foreground">No inventory alerts at this time.</p>
                ) : (
                  inventoryAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        alert.status === 'out_of_stock' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <AlertCircle className={`h-5 w-5 ${alert.status === 'out_of_stock' ? 'text-red-600' : 'text-yellow-600'}`} />
                        <div>
                          <p className="font-medium">{alert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.status === 'out_of_stock' ? 'Out of stock' : `Only ${alert.stock} units left`}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Reorder</Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
