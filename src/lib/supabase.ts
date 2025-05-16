import { createClient } from '@supabase/supabase-js';
<<<<<<< HEAD
=======
import localforage from 'localforage';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

<<<<<<< HEAD
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
=======
// Enhanced environment variable validation with detailed error messages
if (!supabaseUrl || typeof supabaseUrl !== 'string') {
  throw new Error('VITE_SUPABASE_URL is required but not found in environment variables');
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string') {
  throw new Error('VITE_SUPABASE_ANON_KEY is required but not found in environment variables');
}

// Simplified URL cleaning to prevent over-processing that might cause issues
const cleanUrl = (url: string): string => {
  try {
    const cleaned = url.trim();
    // Only prepend https:// if no protocol is present
    if (!/^https?:\/\//i.test(cleaned)) {
      return `https://${cleaned}`;
    }
    return cleaned;
  } catch (e) {
    console.error('Error cleaning Supabase URL:', e);
    throw new Error(`Invalid Supabase URL: ${url}`);
  }
};

// Create the Supabase client with optimized configuration
export const supabase = createClient(cleanUrl(supabaseUrl), supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: localStorage
  },
  global: {
    headers: { 
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    timeout: 20000, // Reduced timeout to fail faster
    heartbeatIntervalMs: 10000
  }
});

// Improved auth check with better error handling
export const checkAuth = async (maxRetries = 3): Promise<any> => {
  let attempt = 0;
  let lastError;
  
  while (attempt < maxRetries) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(`Auth check failed (attempt ${attempt + 1}/${maxRetries}):`, error.message);
        lastError = error;
        
        if (attempt < maxRetries - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Reduced max delay to 5s
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          continue;
        }
      }
      
      return session;
    } catch (err) {
      console.error(`Auth check error (attempt ${attempt + 1}/${maxRetries}):`, err);
      lastError = err;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }
    }
  }
  
  throw lastError;
};

// Improved connection check with better diagnostics
export const checkSupabaseConnection = async (maxRetries = 3): Promise<boolean> => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`Attempting Supabase connection (${attempt + 1}/${maxRetries})...`);
      
      const startTime = Date.now();
      const { error } = await supabase.from('unified_assessment_categories').select('id').limit(1);
      const latency = Date.now() - startTime;
      
      if (error) {
        console.error(`Connection test failed (attempt ${attempt + 1}/${maxRetries}):`, {
          error: error.message,
          latency: `${latency}ms`,
          statusCode: error.code,
          hint: error.hint || 'No hint available'
        });
        
        if (attempt < maxRetries - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          continue;
        }
        return false;
      }
      
      console.log(`Supabase connection successful! Latency: ${latency}ms`);
      return true;
    } catch (err) {
      console.error(`Connection test error (attempt ${attempt + 1}/${maxRetries}):`, err);
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }
      return false;
    }
  }
  
  return false;
};

// Optimized timeout utility
export const withTimeout = async <T>(
  promise: Promise<T>, 
  timeoutMs: number = 5000, // Reduced default timeout
  errorMessage: string = 'Request timed out',
  cacheKey?: string
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(errorMessage), timeoutMs);
  
  try {
    let cachedData: T | null = null;
    if (cacheKey) {
      try {
        cachedData = await localforage.getItem<T>(cacheKey);
      } catch (cacheError) {
        console.warn('Cache retrieval error:', cacheError);
      }
    }
    
    const result = await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          if (cachedData) {
            reject(new Error(`CACHED_DATA_AVAILABLE:${JSON.stringify(cachedData)}`));
          } else {
            reject(new Error(errorMessage));
          }
        });
      })
    ]) as T;
    
    if (cacheKey) {
      try {
        await localforage.setItem(cacheKey, result);
      } catch (cacheError) {
        console.warn('Cache storage error:', cacheError);
      }
    }
    
    return result;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CACHED_DATA_AVAILABLE:')) {
      return JSON.parse(error.message.substring('CACHED_DATA_AVAILABLE:'.length)) as T;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Improved fetch wrapper with better error handling
export const fetchWithTimeout = async <T>(
  fetcher: () => Promise<{ data: T, error: any }>,
  timeoutMs: number = 5000,
  cacheKey?: string
): Promise<{ data: T | null, error: any, fromCache?: boolean }> => {
  try {
    const result = await withTimeout(
      fetcher(),
      timeoutMs,
      'Supabase request timed out',
      cacheKey
    );
    
    return { ...result, fromCache: false };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('CACHED_DATA_AVAILABLE:')) {
      const cachedData = JSON.parse(error.message.substring('CACHED_DATA_AVAILABLE:'.length));
      return { data: cachedData, error: null, fromCache: true };
    }
    
    console.error('fetchWithTimeout error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
};

// Initialize connection check with improved logging
(async () => {
  console.log('Initializing Supabase connection...');
  let retries = 0;
  const maxRetries = 3;
  const retryDelay = 3000; // Reduced to 3 seconds

  while (retries < maxRetries) {
    try {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        console.log('✅ Supabase connection established successfully');
        break;
      }
      
      console.warn(`❌ Connection attempt ${retries + 1}/${maxRetries} failed, retrying in ${retryDelay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retries++;
    } catch (error) {
      console.error('❌ Supabase connection error:', error);
      if (retries < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retries++;
      } else {
        console.error('❌ Failed to establish Supabase connection after all retries');
        break;
      }
    }
  }
})();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
