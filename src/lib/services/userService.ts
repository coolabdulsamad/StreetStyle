// @/lib/services/userService.ts
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AppUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  role: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export const getAllUsers = async (): Promise<{ users: AppUser[]; error: Error | null }> => {
  try {
    const { data, error } = await supabase.from('app_users').select(`
      id,
      email,
      created_at,
      last_sign_in_at,
      role,
      first_name,
      last_name,
      phone,
      avatar_url
    `);

    if (error) {
      console.error('Supabase error fetching users from app_users view:', error);
      toast.error(`Failed to load users: ${error.message}`);
      return { users: [], error: new Error(error.message) };
    }

    const users: AppUser[] = (data || []).map(userRow => ({
      id: userRow.id,
      email: userRow.email,
      created_at: userRow.created_at,
      last_sign_in_at: userRow.last_sign_in_at,
      role: userRow.role,
      first_name: userRow.first_name,
      last_name: userRow.last_name,
      phone: userRow.phone,
      avatar_url: userRow.avatar_url,
    }));

    return { users, error: null };
  } catch (err: any) {
    console.error('Error in getAllUsers service:', err);
    toast.error(`An unexpected error occurred while fetching users: ${err.message}`);
    return { users: [], error: err };
  }
};

/**
 * Updates a specific user's role using a Supabase RPC function.
 * This function should only be callable by an admin.
 * @param userId The ID of the user whose role to update.
 * @param newRole The new role (e.g., 'customer', 'admin', 'rider', or null).
 * @param secretCode The secret code required for authorization.
 * @returns True if successful, false otherwise.
 */
export const updateUserRole = async (userId: string, newRole: string | null, secretCode: string): Promise<boolean> => { // Added secretCode
  try {
    const { error } = await supabase.rpc('update_user_role', {
      target_user_id: userId,
      new_role: newRole,
      secret_code: secretCode, // Pass the secret code
    });

    if (error) {
      console.error('Supabase error updating user role:', error);
      toast.error(`Failed to update user role: ${error.message}`);
      return false;
    }

    toast.success(`User role updated to "${newRole || 'No Role'}" successfully!`);
    return true;
  } catch (err: any) {
    console.error('Error in updateUserRole service:', err);
    toast.error(err.message || 'An unexpected error occurred during role update.');
    return false;
  }
};
