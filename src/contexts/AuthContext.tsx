import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client'; // Adjust the import path as necessary
import { toast } from 'sonner';
// Ensure this path is correct for your generated types 
import { Database } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom'; // From the second file

// Use the exact types from your generated Supabase types for robustness
type ProfilesTable = Database['public']['Tables']['profiles'];
export type UserProfile = ProfilesTable['Row']; // Full profile row type
type UserProfileInsert = ProfilesTable['Insert']; // Type for inserting profiles

type UserRolesTable = Database['public']['Tables']['user_roles']; // This type is not used in the first file but kept for completeness
type UserRoleRow = UserRolesTable['Row']; // This type is not used in the first file but kept for completeness

interface AuthContextType {
    user: User | null;
    session: Session | null; // From first file
    profile: UserProfile | null; // From first file
    isLoading: boolean; // From first file
    isAuthReady: boolean; // Present in both, from first file for detailed status
    isAdmin: boolean; // Present in both
    accessToken: string | null; // From first file
    // Keeping your existing public interface for consistency (from first file primarily)
    signUp: (email: string, password: string, userData?: { full_name?: string; avatar_url?: string; phone?: string; }) => Promise<void>; // From first file, extended for userData
    signIn: (email: string, password: string) => Promise<void>; // From first file (returns void)
    signOut: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>; // Alias from first file
    logout: () => Promise<void>; // Alias from first file
    register: (email: string, password: string, name?: string) => Promise<void>; // Alias from first file
    updateProfile: (profileData: Partial<UserProfile>) => Promise<void>; // Modified to accept partial profile for updates from first file
    signInWithGoogle: () => Promise<void>; // From first file
    refreshUser: () => Promise<void>; // From second file
    updatePassword: (newPassword: string) => Promise<boolean>; // From second file
    deleteUserAccount: () => Promise<boolean>; // From second file
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null); // From first file
    const [profile, setProfile] = useState<UserProfile | null>(null); // From first file
    const [isLoading, setIsLoading] = useState(true); // Overall loading state, true initially from first file
    const [isAuthReady, setIsAuthReady] = useState(false); // NEW: False initially, becomes true after initial session check from first file
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null); // NEW: State for access token from first file
    const navigate = useNavigate(); // From second file

    // --- Helper function to fetch profile and roles (from first file, modified to integrate admin check logic from second) ---
    const fetchUserData = useCallback(async (userId: string) => {
        let fetchedProfile: UserProfile | null = null;
        let fetchedIsAdmin = false;

        try {
            console.log(`[AuthContext] fetchUserData: Starting for user ${userId}`);

            // Fetch profile and check admin status concurrently
            const [{ data: userProfileData, error: profileError }, { data: adminCheckResult, error: adminCheckError }] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.rpc('is_admin') // Using the RPC function as in the first file
            ]);

            if (profileError) {
                if (profileError.code === 'PGRST116') {
                    console.log(`[AuthContext] Profile not found for ${userId}, attempting to create...`);
                    const currentUser = await supabase.auth.getUser();

                    if (currentUser.data.user) {
                        const newProfileData: UserProfileInsert = {
                            id: userId,
                            first_name: currentUser.data.user.user_metadata?.full_name?.split(' ')[0] || null,
                            last_name: currentUser.data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
                            avatar_url: currentUser.data.user.user_metadata?.avatar_url || null,
                        };

                        const { data: newProfile, error: createError } = await supabase
                            .from('profiles')
                            .insert([newProfileData])
                            .select()
                            .single();

                        if (createError) {
                            console.error('[AuthContext] Error creating profile:', createError);
                            toast.error('Failed to create user profile');
                        } else if (newProfile) {
                            console.log('[AuthContext] Created new profile:', newProfile);
                            fetchedProfile = newProfile;
                        }
                    } else {
                        console.warn('[AuthContext] No current user data available to create profile.');
                    }
                } else {
                    console.error('[AuthContext] Error fetching profile:', profileError);
                    toast.error('Failed to load user profile');
                }
            } else if (userProfileData) {
                fetchedProfile = userProfileData;
                console.log('[AuthContext] Found existing profile:', fetchedProfile);
            }

            if (adminCheckError) {
                console.error('[AuthContext] Error checking admin status via RPC:', adminCheckError);
            } else if (adminCheckResult === true) {
                fetchedIsAdmin = true;
                console.log('[AuthContext] User is admin (via RPC).');
            } else {
                console.log('[AuthContext] User is not admin (via RPC).');
            }

        } catch (error) {
            console.error('[AuthContext] Unexpected error in fetchUserData:', error);
            toast.error('An unexpected error occurred while loading user data');
        } finally {
            console.log('[AuthContext] fetchUserData: Completed.');
            return { fetchedProfile, fetchedIsAdmin }; // Return results to be set in handleAuthSession
        }
    }, []);

    // --- Auth State Change Listener (Combined logic from both files) ---
    useEffect(() => {
        let mounted = true;

        const handleAuthSession = async (currentSession: Session | null) => {
            if (!mounted) return;

            console.log(`[AuthContext] handleAuthSession: Session changed. User: ${currentSession?.user?.email || 'None'}`);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setAccessToken(currentSession?.access_token || null); // NEW: Set access token here

            // CRITICAL DEBUG: Log the access token from the session
            console.log('[AuthContext] Session Access Token:', currentSession?.access_token);

            if (currentSession?.user) {
                setIsLoading(true);
                const { fetchedProfile, fetchedIsAdmin } = await fetchUserData(currentSession.user.id);
                if (mounted) {
                    setProfile(fetchedProfile);
                    setIsAdmin(fetchedIsAdmin); // Set isAdmin based on RPC check
                    setIsLoading(false);
                }
            } else {
                // If no session or user, clear all states
                setProfile(null);
                setIsAdmin(false);
                setIsLoading(false);
            }

            if (mounted) {
                setIsAuthReady(true);
                console.log('[AuthContext] AuthContext isAuthReady set to TRUE.');
            }
        };

        // Initial session check (from first file)
        console.log('[AuthContext] Initializing: Checking existing session...');
        supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
            if (!mounted) return;
            console.log('[AuthContext] Initial session check completed.');
            await handleAuthSession(initialSession);
        }).catch(error => {
            console.error('[AuthContext] Error during initial getSession:', error);
            toast.error('Failed to retrieve initial user session.');
            if (mounted) {
                setIsLoading(false);
                setIsAuthReady(true);
            }
        });

        // Auth state change listener (from both files, combined)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
                console.log(`[AuthContext] Auth state change event: ${event}`);
                // The `checkUser` from the second file is now integrated into `handleAuthSession`
                handleAuthSession(currentSession);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
            console.log('[AuthContext] AuthContext unmounted, subscription unsubscribed.');
        };
    }, [fetchUserData]);

    // --- Authentication Actions (Sign Up, Sign In, Sign Out, etc.) ---

    // Sign Up (from first file, adapted to handle boolean return for consistency with second file, and userData)
    const signUp = async (email: string, password: string, userData?: { full_name?: string; avatar_url?: string; phone?: string; }): Promise<boolean> => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData,
                },
            });

            if (error) {
                toast.error(error.message);
                return false;
            }

            if (data.user) {
                toast.success('Account created successfully! Please check your email to verify your account.');
            }
            return true;
        } catch (error: any) {
            console.error('Error signing up:', error);
            toast.error(error.message || 'An error occurred during sign up');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Sign In (from first file, adapted to handle boolean return for consistency with second file)
    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
                return false;
            }

            toast.success('Signed in successfully!');
            return true;
        } catch (error: any) {
            console.error('Error signing in:', error);
            toast.error(error.message || 'An error occurred during sign in');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Sign In with Google (from first file)
    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const redirectUrl = window.location.origin;

            console.log('[AuthContext] Starting Google Sign In...');
            console.log('[AuthContext] Redirect URL:', redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: false,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });

            if (error) {
                console.error('[AuthContext] Supabase OAuth error:', error);
                throw error;
            }

            console.log('[AuthContext] OAuth initiated successfully');
        } catch (error: any) {
            console.error('[AuthContext] Error signing in with Google:', error);
            toast.error(error.message || 'Google Sign-In Failed');
            setIsLoading(false);
            throw error;
        }
    };

    // Sign Out (from both files, combined to include redirect)
    const signOut = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error(error.message);
                throw error;
            }

            setUser(null);
            setSession(null);
            setProfile(null);
            setIsAdmin(false);
            setAccessToken(null); // Clear access token on sign out

            toast.success('Signed out successfully!');
            navigate('/login'); // Redirect to login after logout (from second file)
        } catch (error: any) {
            console.error('Error signing out:', error);
            toast.error(error.message || 'An error occurred during sign out');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Update Profile (from first file)
    const updateProfile = async (profileData: Partial<UserProfile>) => {
        try {
            if (!user) {
                throw new Error('User not logged in to update profile.');
            }
            const { data, error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setProfile(data);
                toast.success('Profile updated successfully!');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile.');
            throw error;
        }
    };

    // Refresh User (from second file, using fetchUserData directly)
    const refreshUser = useCallback(async () => {
        if (user?.id) {
            setIsLoading(true);
            const { fetchedProfile, fetchedIsAdmin } = await fetchUserData(user.id);
            setProfile(fetchedProfile);
            setIsAdmin(fetchedIsAdmin);
            setIsLoading(false);
        } else {
            console.warn('[AuthContext] Cannot refresh user: no user logged in.');
        }
    }, [user, fetchUserData]);

    // Update Password (from second file)
    const updatePassword = async (newPassword: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                console.error('Supabase error updating password:', error);
                toast.error(error.message);
                return false;
            }
            toast.success('Password updated successfully!'); // Added success toast
            return true;
        } catch (err: any) {
            console.error('Error updating password:', err);
            toast.error(err.message || 'An unexpected error occurred during password update.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete User Account (from second file, with important note)
    const deleteUserAccount = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            // Supabase's client-side `deleteUser` is not directly exposed for security reasons.
            // A common pattern is to have a server-side function (e.g., Supabase Edge Function or RLS)
            // that handles the deletion of the user and associated data.
            // For a client-side initiated deletion, you might need re-authentication.
            //
            // For this context, we will simulate a client-side deletion.
            // In a real production app, you'd likely call a secure backend endpoint
            // that uses `supabase.auth.admin.deleteUser(userId)` and handles cascade deletes.

            // Direct deletion attempt (might require specific RLS or admin privileges)
            // Assuming you have a Supabase RPC function named 'delete_user_and_data'
            const { error } = await supabase.rpc('delete_user_and_data'); 

            if (error) {
                console.error('Supabase error deleting account:', error);
                toast.error(error.message || 'Failed to delete account. Please ensure you are logged in and authorized.');
                return false;
            }

            // If successful, signOut the user
            await signOut(); // This will also navigate to login
            toast.success('Account deleted successfully!'); // Added success toast
            return true;
        } catch (err: any) {
            console.error('Error deleting account:', err);
            toast.error(err.message || 'An unexpected error occurred during account deletion.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Aliases (from first file)
    const logout = signOut;
    const login = signIn;
    const register = async (email: string, password: string, name?: string) => {
        return signUp(email, password, { full_name: name });
    };

    const value = {
        user,
        session,
        profile,
        isLoading,
        isAuthReady,
        isAdmin,
        accessToken,
        signUp: register, // Renamed for consistency with the provided interface from first file. The logic for userData is in the signUp function.
        signIn: login, // Renamed for consistency with the provided interface from first file.
        signOut,
        logout,
        login,
        register,
        updateProfile,
        signInWithGoogle,
        refreshUser,
        updatePassword,
        deleteUserAccount,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};