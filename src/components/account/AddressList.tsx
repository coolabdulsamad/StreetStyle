// @/components/account/AddressList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/lib/services/addressService';
import { Database } from '@/integrations/supabase/types';
import AddressForm from './AddressForm';
import { Badge } from '@/components/ui/badge'; // <--- ADD THIS IMPORT!
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type UserAddressRow = Database['public']['Tables']['user_addresses']['Row'];

const AddressList = () => {
  const { user, isAuthReady } = useAuth();
  const [addresses, setAddresses] = useState<UserAddressRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // For add/edit form saving
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddressRow | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!isAuthReady || !user?.id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { addresses: fetchedAddresses, error } = await getAddresses(user.id);
    if (error) {
      toast.error(error.message || 'Failed to load addresses.');
      setAddresses([]);
    } else {
      setAddresses(fetchedAddresses);
    }
    setIsLoading(false);
  }, [isAuthReady, user?.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = () => {
    setEditingAddress(null); // Clear any editing state
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: UserAddressRow) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleCancelForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (data: Omit<UserAddressRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return false;
    setIsSaving(true);
    let success = false;
    if (editingAddress) {
      success = await updateAddress(editingAddress.id, user.id, data);
    } else {
      const { address, error } = await addAddress(user.id, data);
      success = !!address && !error;
    }
    setIsSaving(false);
    if (success) {
      fetchAddresses(); // Re-fetch to update list
    }
    return success;
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setIsSaving(true); // Reusing isSaving for delete operation
    const success = await deleteAddress(addressToDelete);
    setIsSaving(false);
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
    if (success) {
      fetchAddresses(); // Re-fetch to update list
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id) return;
    setIsSaving(true); // Reusing isSaving for default operation
    const success = await setDefaultAddress(addressId, user.id);
    setIsSaving(false);
    if (success) {
      fetchAddresses(); // Re-fetch to update list
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading addresses...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Your Addresses</CardTitle>
          <CardDescription>Manage your shipping and billing addresses.</CardDescription>
        </div>
        <Button onClick={handleAddAddress} disabled={isSaving}>
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </CardHeader>
      <CardContent>
        {showAddressForm ? (
          <AddressForm
            initialData={editingAddress}
            onSave={handleSaveAddress}
            onCancel={handleCancelForm}
            isSaving={isSaving}
          />
        ) : addresses.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No addresses saved. Click "Add New Address" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 space-y-2 relative">
                {address.is_default && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">Default</Badge>
                )}
                <p className="font-semibold">{address.address_type === 'shipping' ? 'Shipping Address' : 'Billing Address'}</p>
                <p>{address.street_address}</p>
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)} disabled={isSaving}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteClick(address.id)} disabled={isSaving}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {!address.is_default && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} disabled={isSaving}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Set Default
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isSaving} className="bg-destructive hover:bg-destructive/90">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AddressList;
