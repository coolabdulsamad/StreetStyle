
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadUserAvatar } from "@/lib/services/userService";
import { UserProfile } from "@/contexts/AuthContext";
import { User } from 'lucide-react';

interface AvatarUploadProps {
  profile: UserProfile;
  onAvatarUpdate: (avatarUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ profile, onAvatarUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    setIsUploading(true);
    try {
      const avatarUrl = await uploadUserAvatar(file);
      if (avatarUrl) {
        onAvatarUpdate(avatarUrl);
        toast.success('Avatar uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Generate initials from name
  const getInitials = () => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profile.avatar_url || ''} alt={`${profile.first_name} ${profile.last_name}`} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
          {profile.avatar_url ? null : getInitials() || <User />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center space-y-2">
        <Input
          type="file"
          accept="image/*"
          id="avatar-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor="avatar-upload">
          <Button 
            variant="outline" 
            className="cursor-pointer"
            disabled={isUploading}
            asChild
          >
            <span>{isUploading ? 'Uploading...' : 'Change Avatar'}</span>
          </Button>
        </label>
        {profile.avatar_url && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onAvatarUpdate('')}
            disabled={isUploading}
          >
            Remove Avatar
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
