// @/pages/admin/AdminUserList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Filter, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { getAllUsers, updateUserRole, AppUser } from '@/lib/services/userService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; // Import AlertDialog components
import { Label } from '@radix-ui/react-label';

// Define possible roles for display and selection
const ROLES = ['customer', 'admin', 'rider'];

const AdminUserList = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // State for secret code modal
  const [showSecretCodeModal, setShowSecretCodeModal] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: string; newRole: string | null } | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const { users: fetchedUsers, error } = await getAllUsers();
    if (error) {
      toast.error(error.message || 'Failed to fetch users.');
      setUsers([]);
    } else {
      setUsers(fetchedUsers);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let currentUsers = users;

    if (searchTerm) {
      currentUsers = currentUsers.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      if (roleFilter === 'no-role') {
        currentUsers = currentUsers.filter(user => user.role === null);
      } else {
        currentUsers = currentUsers.filter(user => user.role === roleFilter);
      }
    }

    setFilteredUsers(currentUsers);
  }, [users, searchTerm, roleFilter]);

  const handleRoleChangeInitiate = (userId: string, newRoleValue: string) => {
    const roleToSend = newRoleValue === 'no-role' ? null : newRoleValue;
    setPendingRoleChange({ userId, newRole: roleToSend });
    setShowSecretCodeModal(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange || !secretCodeInput.trim()) {
      toast.error('Secret code is required.');
      return;
    }

    setIsUpdatingRole(true);
    const success = await updateUserRole(
      pendingRoleChange.userId,
      pendingRoleChange.newRole,
      secretCodeInput.trim()
    );
    setIsUpdatingRole(false);
    setShowSecretCodeModal(false);
    setSecretCodeInput('');
    setPendingRoleChange(null);

    if (success) {
      // Re-fetch all users to ensure the UI is fully consistent with the database,
      // especially after rider table changes.
      fetchUsers();
    }
  };

  const handleCancelSecretCode = () => {
    setShowSecretCodeModal(false);
    setSecretCodeInput('');
    setPendingRoleChange(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View, search, filter, and manage user roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Search by email, ID, first name, or last name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="no-role">No Role</SelectItem>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setRoleFilter('all'); fetchUsers(); }}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset & Refresh
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Sign-In</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-xs">{user.id.substring(0, 8)}...</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.first_name || 'N/A'} {user.last_name || ''}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role || 'no-role'}
                        onValueChange={(newRole) => handleRoleChangeInitiate(user.id, newRole)} // Call initiate function
                        disabled={isUpdatingRole}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-role">No Role</SelectItem>
                          {ROLES.map(role => (
                            <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</TableCell>
                    <TableCell className="text-right">
                      {/* Placeholder for future actions */}
                      <Button variant="outline" size="sm" disabled>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Secret Code Confirmation Dialog */}
      <AlertDialog open={showSecretCodeModal} onOpenChange={setShowSecretCodeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              To change the user's role to "{pendingRoleChange?.newRole || 'No Role'}", please enter the admin secret code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="secret-code-input">Admin Secret Code</Label>
            <Input
              id="secret-code-input"
              type="password"
              value={secretCodeInput}
              onChange={(e) => setSecretCodeInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmRoleChange();
                }
              }}
              disabled={isUpdatingRole}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSecretCode} disabled={isUpdatingRole}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRoleChange} disabled={isUpdatingRole}>
              {isUpdatingRole ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserList;
