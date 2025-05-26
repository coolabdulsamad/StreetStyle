
import React from 'react';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProductList from './AdminProductList';
import AdminOrderList from './AdminOrderList';
import AdminUsersList from './AdminUsersList';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();

  // If not logged in or not an admin, redirect to login
  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="products">
            <AdminProductList />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrderList />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersList />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminDashboardPage;
