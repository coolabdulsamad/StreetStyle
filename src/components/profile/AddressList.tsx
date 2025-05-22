
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PenLine, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

// Mock data - in a real app, this would come from the database
const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Home',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isDefault: true
  },
  {
    id: '2',
    name: 'Work',
    street: '456 Corporate Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    isDefault: false
  }
];

const AddressList: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address>({
    id: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAddress({
      ...currentAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCountryChange = (value: string) => {
    setCurrentAddress({
      ...currentAddress,
      country: value
    });
  };

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setIsEditing(address.id);
  };

  const handleAddNewAddress = () => {
    setCurrentAddress({
      id: Date.now().toString(),
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      isDefault: addresses.length === 0 // Make default if it's the first address
    });
    setIsAddingNewAddress(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    toast.success('Address removed successfully');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    toast.success('Default address updated');
  };

  const handleSaveAddress = () => {
    if (isEditing) {
      setAddresses(addresses.map(address =>
        address.id === isEditing ? currentAddress : address
      ));
      setIsEditing(null);
      toast.success('Address updated successfully');
    } else if (isAddingNewAddress) {
      setAddresses([...addresses, currentAddress]);
      setIsAddingNewAddress(false);
      toast.success('New address added successfully');
    }
  };

  const validateAddress = () => {
    return currentAddress.name && 
           currentAddress.street && 
           currentAddress.city && 
           currentAddress.state && 
           currentAddress.zipCode && 
           currentAddress.country;
  };

  if (!user) {
    return <p>Please log in to manage your addresses.</p>;
  }

  return (
    <div className="space-y-6">
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={`relative ${address.isDefault ? 'border-primary' : ''}`}>
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                  Default
                </span>
              )}
              <CardContent className="pt-6 pb-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{address.name}</h4>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => handleEditAddress(address)}>
                          <PenLine className="h-4 w-4" />
                          <span className="sr-only">Edit address</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Address</DialogTitle>
                          <DialogDescription>
                            Make changes to your address details.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid items-center gap-2">
                            <Label htmlFor="name">Address Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={currentAddress.name}
                              onChange={handleAddressChange}
                              placeholder="Home, Work, etc."
                            />
                          </div>
                          <div className="grid items-center gap-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                              id="street"
                              name="street"
                              value={currentAddress.street}
                              onChange={handleAddressChange}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                name="city"
                                value={currentAddress.city}
                                onChange={handleAddressChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State/Province</Label>
                              <Input
                                id="state"
                                name="state"
                                value={currentAddress.state}
                                onChange={handleAddressChange}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zipCode">Zip/Postal Code</Label>
                              <Input
                                id="zipCode"
                                name="zipCode"
                                value={currentAddress.zipCode}
                                onChange={handleAddressChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Select
                                value={currentAddress.country}
                                onValueChange={handleCountryChange}
                              >
                                <SelectTrigger id="country">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USA">United States</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditing(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveAddress} disabled={!validateAddress()}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteAddress(address.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete address</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You haven't added any addresses yet.
          </p>
        </div>
      )}

      <Dialog
        open={isAddingNewAddress}
        onOpenChange={(open) => !open && setIsAddingNewAddress(false)}
      >
        <DialogTrigger asChild>
          <Button onClick={handleAddNewAddress} className="mt-4">
            Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Enter the details for your new address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="name">Address Name</Label>
              <Input
                id="name"
                name="name"
                value={currentAddress.name}
                onChange={handleAddressChange}
                placeholder="Home, Work, etc."
              />
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                value={currentAddress.street}
                onChange={handleAddressChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={currentAddress.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={currentAddress.state}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">Zip/Postal Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={currentAddress.zipCode}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={currentAddress.country}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNewAddress(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} disabled={!validateAddress()}>
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressList;
