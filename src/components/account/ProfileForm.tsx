// @/components/account/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/lib/services/profileService'; // Adjust path if necessary

const ProfileForm = () => {
  const { user, isAuthReady, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthReady || !user?.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const { profile, error } = await getProfile(user.id);
      if (error) {
        toast.error(error.message || 'Failed to load profile.');
      } else if (profile) {
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
        setPhone(profile.phone || '');
        setAvatarUrl(profile.avatar_url || '');
      }
      setIsLoading(false);
    };

    fetchProfileData();
  }, [isAuthReady, user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || isSaving) return;

    setIsSaving(true);
    const success = await updateProfile(user.id, {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      avatar_url: avatarUrl,
    });

    if (success) {
      // If profile was updated, refresh the user context to get latest profile data
      await refreshUser();
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading profile...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +1234567890"
            />
          </div>
          <div>
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/your-avatar.jpg"
            />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover mt-2"
                onError={(e) => { e.currentTarget.src = `https://placehold.co/80x80/cccccc/333333?text=Avatar`; }}
              />
            )}
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
