import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Provide dummy values to prevent createClient from throwing an error during import
// if the environment variables are not set (e.g. in local demo mode).
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseAnonKey || 'dummy-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};
