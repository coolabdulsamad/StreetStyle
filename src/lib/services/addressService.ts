
import { supabase } from "@/integrations/supabase/client";
import { Address } from "@/lib/types";
import { toast } from "sonner";

export async function getUserAddresses(): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses' as any)
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching addresses:', error);
    toast.error('Failed to load your addresses');
    return [];
  }
  
  return data as unknown as Address[];
}

export async function getAddressById(addressId: string): Promise<Address | null> {
  const { data, error } = await supabase
    .from('addresses' as any)
    .select('*')
    .eq('id', addressId)
    .single();
  
  if (error) {
    console.error('Error fetching address:', error);
    toast.error('Failed to load address details');
    return null;
  }
  
  return data as unknown as Address;
}

export async function createAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address | null> {
  // Reset default flag for other addresses if this one is default
  if (address.is_default) {
    if (address.address_type === 'shipping' || address.address_type === 'both') {
      await resetDefaultAddresses('shipping');
    }
    if (address.address_type === 'billing' || address.address_type === 'both') {
      await resetDefaultAddresses('billing');
    }
  }
  
  const { data, error } = await supabase
    .from('addresses' as any)
    .insert([address as any])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating address:', error);
    toast.error('Failed to save your address');
    return null;
  }
  
  toast.success('Address saved successfully');
  return data as unknown as Address;
}

export async function updateAddress(addressId: string, address: Partial<Address>): Promise<Address | null> {
  // Reset default flag for other addresses if this one is default
  if (address.is_default) {
    if (address.address_type === 'shipping' || address.address_type === 'both') {
      await resetDefaultAddresses('shipping');
    }
    if (address.address_type === 'billing' || address.address_type === 'both') {
      await resetDefaultAddresses('billing');
    }
  }
  
  const { data, error } = await supabase
    .from('addresses' as any)
    .update(address as any)
    .eq('id', addressId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating address:', error);
    toast.error('Failed to update your address');
    return null;
  }
  
  toast.success('Address updated successfully');
  return data as unknown as Address;
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  const { error } = await supabase
    .from('addresses' as any)
    .delete()
    .eq('id', addressId);
  
  if (error) {
    console.error('Error deleting address:', error);
    toast.error('Failed to delete address');
    return false;
  }
  
  toast.success('Address deleted successfully');
  return true;
}

async function resetDefaultAddresses(addressType: 'shipping' | 'billing'): Promise<void> {
  // Reset default flag for addresses that match the type
  await supabase
    .from('addresses' as any)
    .update({ is_default: false })
    .or(`address_type.eq.${addressType},address_type.eq.both`);
}

export async function getDefaultAddress(type: 'shipping' | 'billing'): Promise<Address | null> {
  const { data, error } = await supabase
    .from('addresses' as any)
    .select('*')
    .or(`address_type.eq.${type},address_type.eq.both`)
    .eq('is_default', true)
    .single();
  
  if (error) {
    if (error.code !== 'PGRST116') { // No rows returned
      console.error('Error fetching default address:', error);
    }
    return null;
  }
  
  return data as unknown as Address;
}
