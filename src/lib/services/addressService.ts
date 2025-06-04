// @/lib/services/addressService.ts
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type UserAddressRow = Database['public']['Tables']['user_addresses']['Row'];
type UserAddressInsert = Database['public']['Tables']['user_addresses']['Insert'];
type UserAddressUpdate = Database['public']['Tables']['user_addresses']['Update'];

/**
 * Fetches all addresses for a given user.
 * @param userId The ID of the user.
 * @returns An array of user addresses or an empty array on error.
 */
export const getAddresses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false }) // Default address first
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching addresses:', error);
      throw new Error(error.message);
    }

    return { addresses: data || [], error: null };
  } catch (err: any) {
    console.error('Error in getAddresses service:', err);
    return { addresses: [], error: err };
  }
};

/**
 * Adds a new address for a user.
 * Handles setting new address as default and unsetting old default if necessary.
 * @param userId The ID of the user.
 * @param addressData The address data to insert.
 * @returns The newly added address or null on error.
 */
export const addAddress = async (userId: string, addressData: Omit<UserAddressInsert, 'user_id' | 'created_at' | 'updated_at'>) => {
  try {
    // If the new address is set as default, unset all other defaults for this user
    if (addressData.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ ...addressData, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding address:', error);
      toast.error(`Failed to add address: ${error.message}`);
      return { address: null, error: error };
    }

    toast.success('Address added successfully!');
    return { address: data, error: null };
  } catch (err: any) {
    console.error('Error in addAddress service:', err);
    toast.error(`An unexpected error occurred during address add: ${err.message}`);
    return { address: null, error: err };
  }
};

/**
 * Updates an existing address.
 * Handles setting new address as default and unsetting old default if necessary.
 * @param addressId The ID of the address to update.
 * @param userId The ID of the user (for default management).
 * @param updates The address fields to update.
 * @returns True if successful, false otherwise.
 */
export const updateAddress = async (addressId: string, userId: string, updates: UserAddressUpdate): Promise<boolean> => {
  try {
    // If the updated address is set as default, unset all other defaults for this user
    if (updates.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_default', true);
    }

    const { error } = await supabase
      .from('user_addresses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', addressId);

    if (error) {
      console.error('Supabase error updating address:', error);
      toast.error(`Failed to update address: ${error.message}`);
      return false;
    }

    toast.success('Address updated successfully!');
    return true;
  } catch (err: any) {
    console.error('Error in updateAddress service:', err);
    toast.error(`An unexpected error occurred during address update: ${err.message}`);
    return false;
  }
};

/**
 * Deletes an address.
 * @param addressId The ID of the address to delete.
 * @returns True if successful, false otherwise.
 */
export const deleteAddress = async (addressId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      console.error('Supabase error deleting address:', error);
      toast.error(`Failed to delete address: ${error.message}`);
      return false;
    }

    toast.success('Address deleted successfully!');
    return true;
  } catch (err: any) {
    console.error('Error in deleteAddress service:', err);
    toast.error(`An unexpected error occurred during address deletion: ${err.message}`);
    return false;
  }
};

/**
 * Sets a specific address as the default for the user, unsetting others.
 * @param addressId The ID of the address to set as default.
 * @param userId The ID of the user.
 * @returns True if successful, false otherwise.
 */
export const setDefaultAddress = async (addressId: string, userId: string): Promise<boolean> => {
  try {
    // First, unset all other default addresses for this user
    await supabase
      .from('user_addresses')
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_default', true);

    // Then, set the specified address as default
    const { error } = await supabase
      .from('user_addresses')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', addressId);

    if (error) {
      console.error('Supabase error setting default address:', error);
      toast.error(`Failed to set default address: ${error.message}`);
      return false;
    }

    toast.success('Default address set successfully!');
    return true;
  } catch (err: any) {
    console.error('Error in setDefaultAddress service:', err);
    toast.error(`An unexpected error occurred while setting default address: ${err.message}`);
    return false;
  }
};
