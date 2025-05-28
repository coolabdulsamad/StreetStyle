import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import AddressList from '@/components/profile/AddressList';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordChangeForm from '@/components/profile/PasswordChangeForm';
import OrderHistory from '@/components/profile/OrderHistory';
import { User, Lock, MapPin, ShoppingBag } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "personal-info");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="container py-8">
          <p>Loading...</p>
        </div>
      </PageLayout>
    );
  }

  const displayName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email : 
    user.email;

  const menuItems = [
    { id: 'personal-info', label: 'Personal Information', icon: <User className="h-4 w-4 mr-2" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4 mr-2" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="h-4 w-4 mr-2" /> },
    { id: 'orders', label: 'Order History', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
  ];

  return (
    <PageLayout>
      <div className="container max-w-5xl py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Welcome back, {displayName}!</p>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {menuItems.map(item => (
                    <Button 
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                  
                  <Separator className="my-2" />
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="col-span-12 lg:col-span-9">
            {activeTab === "personal-info" && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            )}
            
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordChangeForm />
                </CardContent>
              </Card>
            )}
            
            {activeTab === "addresses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Addresses</CardTitle>
                  <CardDescription>
                    Manage your shipping addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddressList />
                </CardContent>
              </Card>
            )}
            
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderHistory />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
