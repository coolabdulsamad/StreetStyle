// @/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFoundPage from "./pages/NotFoundPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminProductNew from "./pages/admin/AdminProductNew";
import AdminProductList from "./pages/admin/AdminProductList";
import AccountPage from "./pages/AccountPage";
import FAQPage from "./pages/FAQPage";
import ReturnsPage from "./pages/ReturnsPage";
import ContactPage from "./pages/ContactPage";
import SizeGuidePage from "./pages/SizeGuidePage";
import AdminOrderList from "./pages/admin/AdminOrderList";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import UserOrdersPage from "./pages/orders"; // Corrected import path
import UserOrderDetailPage from "./pages/OrderDetailPage"; // Corrected import path
import TrackOrderPage from "./pages/TrackOrderPage";
import AdminUserList from "./pages/admin/AdminUsersList"; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:categorySlug" element={<ProductListPage />} />
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/checkout/success" element={
        <ProtectedRoute>
          <CheckoutSuccessPage />
        </ProtectedRoute>
      } />
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <WishlistPage />
        </ProtectedRoute>
      } />
      <Route path="/account" element={
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
      } />
      {/* User Orders Routes */}
      <Route path="/dashboard/orders" element={
        <ProtectedRoute>
          <UserOrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/orders/:orderId" element={
        <ProtectedRoute>
          <UserOrderDetailPage />
        </ProtectedRoute>
      } />
      {/* Public Track Order Route */}
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Navigate to="/account" replace />
        </ProtectedRoute>
      } />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/returns" element={<ReturnsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/size-guide" element={<SizeGuidePage />} />
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProductList />
        </ProtectedRoute>
      } />
      <Route path="/admin/products/:productId" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProductEdit />
        </ProtectedRoute>
      } />
      <Route path="/admin/products/new" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminProductNew />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminOrderList />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders/:orderId" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminOrderDetail />
        </ProtectedRoute>
      } />
      <Route path="users" element={<AdminUserList />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
