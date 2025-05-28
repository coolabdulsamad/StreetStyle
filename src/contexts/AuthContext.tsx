import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
  signInWithGoogle: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  const checkAdminStatus = async (userId: string, email?: string) => {
    try {
      // Check if this is the default admin
      if (email === 'chisimindumichael@gmail.com') {
        setIsAdmin(true);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Get both user data and profile in parallel
      const [{ data: userData }, { data: existingProfile, error }] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
      ]);

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          console.log('Profile not found, creating new profile...');
          
          if (userData?.user) {
            const newProfileData = {
              id: userId,
              first_name: userData.user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: userData.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              avatar_url: userData.user.user_metadata?.avatar_url || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([newProfileData])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              toast.error('Failed to create user profile');
              return;
            }

            if (newProfile) {
              console.log('Created new profile:', newProfile);
              setProfile(newProfile as UserProfile);
              return;
            }
          }
        } else {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load user profile');
          return;
        }
      }

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile);
        setProfile(existingProfile as UserProfile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('An unexpected error occurred while loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initial session and auth state changes
  useEffect(() => {
    setIsLoading(true); // Set loading state at the start
    
    // Check for OAuth callback error
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      toast.error(errorDescription || 'Authentication failed');
    }

    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            if (event === 'SIGNED_IN') {
              setIsLoading(true); // Set loading while fetching user data
              // Run all initialization tasks in parallel
              await Promise.all([
                checkAdminStatus(session.user.id, session.user.email),
                fetchProfile(session.user.id)
              ]);
            }
          } catch (error) {
            console.error('Error during auth state change:', error);
            toast.error('There was an error loading your profile');
          } finally {
            if (mounted) setIsLoading(false);
          }
        } else {
          setIsAdmin(false);
          setProfile(null);
          if (mounted) setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('Checking existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          await Promise.all([
            checkAdminStatus(session.user.id, session.user.email),
            fetchProfile(session.user.id)
          ]);
        } catch (error) {
          console.error('Error loading initial session:', error);
          toast.error('Failed to load your profile');
        }
      }
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'An error occurred during sign up');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'An error occurred during sign in');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true); // Set loading state before starting Google sign-in
      const redirectUrl = window.location.origin;
      
      console.log('Starting Google Sign In...');
      console.log('Redirect URL:', redirectUrl);
      
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
        console.error('Supabase OAuth error:', error);
        throw error;
      }
      
      console.log('OAuth initiated successfully');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'Google Sign-In Failed');
      setIsLoading(false); // Reset loading state on error
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true); // Set loading state before sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all states
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'An error occurred during sign out');
      throw error;
    } finally {
      setIsLoading(false); // Reset loading state after sign out
    }
  };

  // Alias methods for backward compatibility
  const logout = signOut;
  const login = signIn;
  const register = async (email: string, password: string, name?: string) => {
    return signUp(email, password, { full_name: name });
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    logout,
    login,
    register,
    updateProfile,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
