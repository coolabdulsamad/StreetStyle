
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import AvatarUpload from './AvatarUpload';
import { updateUserProfile } from '@/lib/services/userService';

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      phone: profile?.phone || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, form]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!user || !profile) return;
    
    setIsUpdating(true);
    try {
      const updatedProfile = await updateUserProfile({
        id: profile.id,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone || null,
      });
      
      if (updatedProfile) {
        // The context's updateProfile function is already called by the userService
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    if (!user || !profile) return;
    
    try {
      await updateUserProfile({
        id: profile.id,
        avatar_url: avatarUrl,
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error("Failed to update avatar");
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      <AvatarUpload profile={profile} onAvatarUpdate={handleAvatarUpdate} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Email: {user?.email}</p>
            <p className="text-xs text-muted-foreground">
              Your email address is used for login and cannot be changed here.
            </p>
          </div>
          
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
