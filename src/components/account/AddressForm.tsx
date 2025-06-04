// @/components/account/AddressForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types'; // Import Database types for UserAddressRow

type UserAddressRow = Database['public']['Tables']['user_addresses']['Row'];

interface AddressFormProps {
  initialData?: UserAddressRow | null;
  onSave: (data: Omit<UserAddressRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onCancel: () => void;
  isSaving: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ initialData, onSave, onCancel, isSaving }) => {
  const [streetAddress, setStreetAddress] = useState(initialData?.street_address || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [postalCode, setPostalCode] = useState(initialData?.postal_code || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [addressType, setAddressType] = useState(initialData?.address_type || 'shipping');
  const [isDefault, setIsDefault] = useState(initialData?.is_default || false);

  useEffect(() => {
    if (initialData) {
      setStreetAddress(initialData.street_address || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setPostalCode(initialData.postal_code || '');
      setCountry(initialData.country || '');
      setAddressType(initialData.address_type || 'shipping');
      setIsDefault(initialData.is_default || false);
    } else {
      // Reset form for new address
      setStreetAddress('');
      setCity('');
      setState('');
      setPostalCode('');
      setCountry('');
      setAddressType('shipping');
      setIsDefault(false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress || !city || !state || !postalCode || !country || !addressType) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    const dataToSave = {
      street_address: streetAddress,
      city,
      state,
      postal_code: postalCode,
      country,
      address_type: addressType as 'shipping' | 'billing', // Cast to correct enum type
      is_default: isDefault,
    };

    const success = await onSave(dataToSave);
    if (success) {
      onCancel(); // Close form on successful save
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">{initialData ? 'Edit Address' : 'Add New Address'}</h3>
      <div>
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="state">State / Province</Label>
          <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label htmlFor="addressType">Address Type</Label>
        <Select value={addressType} onValueChange={(value: 'shipping' | 'billing') => setAddressType(value)} required>
          <SelectTrigger id="addressType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shipping">Shipping</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked) => setIsDefault(!!checked)}
        />
        <Label htmlFor="isDefault">Set as Default Address</Label>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSaving ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
