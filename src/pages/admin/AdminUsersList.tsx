
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type UserWithProfile = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    phone: string | null;
  } | null;
  roles: string[];
};

const AdminUsersList: React.FC = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin } = useAuth();
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch users from Supabase Auth
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      // Fetch profiles for all users
      const userIds = data.users.map(user => user.id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Fetch roles for all users
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .in('user_id', userIds);
      
      if (rolesError) throw rolesError;
      
      // Map profiles and roles to users
      const usersWithProfiles = data.users.map(user => {
        const profile = profilesData?.find(p => p.id === user.id);
        const userRoles = rolesData?.filter(r => r.user_id === user.id) || [];
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          profile: profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url,
            phone: profile.phone
          } : null,
          roles: userRoles.map(r => r.role)
        };
      });
      
      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. You may not have admin privileges.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter users based on search query
    fetchUsers();
  };
  
  const filteredUsers = searchQuery.trim() === '' 
    ? users 
    : users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.profile?.first_name && user.profile.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.profile?.last_name && user.profile.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="relative w-64">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-md shadow">
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-md shadow">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {user.profile?.avatar_url ? (
                          <img
                            src={user.profile.avatar_url}
                            alt={`${user.profile.first_name || ''} ${user.profile.last_name || ''}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">
                            {user.profile?.first_name?.[0] || user.email[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-2">
                        {user.profile?.first_name || user.profile?.last_name ? (
                          <div className="font-medium">
                            {user.profile.first_name} {user.profile.last_name}
                          </div>
                        ) : (
                          <div className="font-medium text-gray-500">No name</div>
                        )}
                        {user.profile?.phone && (
                          <div className="text-xs text-gray-500">{user.profile.phone}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at ? 
                      new Date(user.last_sign_in_at).toLocaleDateString() : 
                      'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.includes('admin') && (
                        <Badge variant="default">Admin</Badge>
                      )}
                      {user.roles.includes('customer') && (
                        <Badge variant="outline">Customer</Badge>
                      )}
                      {user.roles.length === 0 && (
                        <Badge variant="secondary">No Role</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
