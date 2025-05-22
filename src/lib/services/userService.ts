
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/contexts/AuthContext";
import { toast } from "sonner";

export async function updateUserProfile(
  data: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', data.id);
    
    if (error) throw error;
    
    toast.success('Profile updated successfully');
    
    // Fetch updated profile
    const { data: updatedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return updatedProfile as UserProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
    return null;
  }
}

export async function updateUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    toast.success('Password updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating password:', error);
    toast.error(`Failed to update password: ${error.message}`);
    return false;
  }
}

export async function uploadUserAvatar(file: File): Promise<string | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast.error('You must be logged in to upload an avatar');
      return null;
    }
    
    const userId = session.session.user.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);
    
    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    toast.success('Avatar uploaded successfully');
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    toast.error('Failed to upload avatar');
    return null;
  }
}
