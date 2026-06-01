import { createClient } from '@supabase/supabase-js';

export type UserFavoriteRow = {
  id: string;
  user_id: string;
  site_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      user_favorites: {
        Row: UserFavoriteRow;
        Insert: {
          id?: string;
          user_id: string;
          site_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          site_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
