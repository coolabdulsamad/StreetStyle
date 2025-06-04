// @/lib/services/profileService.ts
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Fetches a user's profile by their user ID.
 * @param userId The ID of the user whose profile to fetch.
 * @returns The profile data or null if not found/error.
 */
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Supabase error fetching profile:', error);
      throw new Error(error.message);
    }

    return { profile: data, error: null };
  } catch (err: any) {
    console.error('Error in getProfile service:', err);
    return { profile: null, error: err };
  }
};

/**
 * Updates a user's profile.
 * @param userId The ID of the user whose profile to update.
 * @param updates The profile fields to update.
 * @returns True if successful, false otherwise.
 */
export const updateProfile = async (userId: string, updates: ProfileUpdate): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Supabase error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      return false;
    }

    toast.success('Profile updated successfully!');
    return true;
  } catch (err: any) {
    console.error('Error in updateProfile service:', err);
    toast.error(`An unexpected error occurred during profile update: ${err.message}`);
    return false;
  }
};
