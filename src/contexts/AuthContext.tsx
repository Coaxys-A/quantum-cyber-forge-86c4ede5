import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  tenant_id?: string;
  language?: string;
  timezone?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  tenant_id?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: UserRole[];
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      setRoles([]);
      return;
    }

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      setRoles(rolesData || []);
    } catch (error: any) {
      // Don't log sensitive profile data
      toast({
        title: 'Error loading profile',
        description: 'Unable to load profile data. Please refresh the page.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile refresh to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            refreshProfile();
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          refreshProfile();
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/app/onboarding`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        // Sanitized error message - don't expose internal details
        const userMessage = error.message.includes('already registered')
          ? 'This email is already registered. Please sign in instead.'
          : 'Unable to create account. Please check your information and try again.';
        
        toast({
          title: 'Sign up failed',
          description: userMessage,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Success!',
          description: 'Please check your email to verify your account.',
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Sanitized error message - don't expose internal details
        const userMessage = 'Invalid email or password. Please try again.';
        
        toast({
          title: 'Sign in failed',
          description: userMessage,
          variant: 'destructive'
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setRoles([]);
    } catch (error: any) {
      // Don't expose internal error details
      toast({
        title: 'Sign out failed',
        description: 'Unable to sign out. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const hasRole = (role: string): boolean => {
    return roles.some(r => r.role === role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      roles,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};