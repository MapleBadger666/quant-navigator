import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  sendMagicLink: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
};

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!mounted) {
          return;
        }

        if (sessionError) {
          setError(sessionError.message);
        }

        setSession(data.session);
      })
      .catch((unknownError) => {
        if (mounted) {
          setError(unknownError instanceof Error ? unknownError.message : 'Unable to load session.');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const sendMagicLink = async (email: string) => {
    if (!supabase) {
      setError('Supabase is not configured.');
      return false;
    }

    setError(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (signInError) {
      setError(signInError.message);
      return false;
    }

    return true;
  };

  const signOut = async () => {
    if (!supabase) {
      setSession(null);
      return;
    }

    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    setSession(null);
  };

  return {
    session,
    user: session?.user ?? null,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    sendMagicLink,
    signOut,
    clearAuthError: () => setError(null),
  };
}
