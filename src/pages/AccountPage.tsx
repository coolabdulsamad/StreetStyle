import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import { Loader2 } from 'lucide-react';

const AccountPage = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
          <p>Please sign in to view your account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Update your profile information and manage your account settings.
            </p>
          </div>

          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 