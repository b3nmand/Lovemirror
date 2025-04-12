import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Clean the URL - remove trailing slashes and ensure https
const cleanUrl = supabaseUrl.replace(/\/+$/, '');
const finalUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;

// Create the Supabase client with retry configuration
export const supabase = createClient(finalUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  // Add retry configuration
  retryAttempts: 3,
  retryInterval: 1000
});

// Helper to check authentication status with better error handling
export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth check error:', error.message);
      throw error;
    }
    
    return session;
  } catch (err) {
    console.error('Failed to check auth status:', err);
    throw err;
  }
};

// Add health check function
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to test Supabase connection:', err);
    return false;
  }
};