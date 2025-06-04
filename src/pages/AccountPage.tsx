// @/pages/AccountPage.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs components
import { Input } from '@/components/ui/input'; // For password change
import { Label } from '@/components/ui/label'; // For password change
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; // For confirmation dialogs

// Import new components
import ProfileForm from '@/components/account/ProfileForm'; // Adjust path
import AddressList from '@/components/account/AddressList'; // Adjust path

const AccountPage = () => {
  const { user, isAuthReady, signOut, updatePassword, deleteUserAccount } = useAuth(); // Assuming deleteUserAccount is available
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) { // Supabase default minimum password length
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Assuming updatePassword is a function in your AuthContext that calls Supabase auth.updateUser
      const success = await updatePassword(newPassword);
      if (success) {
        toast.success('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update password. Please try again.');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'An unexpected error occurred while changing password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      // Assuming deleteUserAccount is a function in your AuthContext
      // This function would typically call supabase.auth.admin.deleteUser (if admin)
      // or handle user-initiated deletion which might involve a re-authentication step.
      // For simplicity, we'll assume it handles the Supabase call.
      const success = await deleteUserAccount();
      if (success) {
        toast.success('Account deleted successfully!');
        // User will be redirected to login page by AuthContext
      } else {
        toast.error('Failed to delete account. Please try again.');
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'An unexpected error occurred while deleting account.');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountConfirm(false);
    }
  };


  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading user data...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Please log in to view your account.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3"> {/* Adjusted to 3 columns */}
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="addresses" className="mt-4">
          <AddressList />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          {/* Change Password Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all associated data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => setShowDeleteAccountConfirm(true)} disabled={isDeletingAccount}>
                {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Orders Button (kept for easy access) */}
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View your order history and track deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/dashboard/orders">
            <Button className="w-full md:w-auto">View All Orders</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Sign Out Button (kept for easy access) */}
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>End your current session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteAccountConfirm} onOpenChange={setShowDeleteAccountConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account, orders, addresses, and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeletingAccount} className="bg-destructive hover:bg-destructive/90">
              {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountPage;
