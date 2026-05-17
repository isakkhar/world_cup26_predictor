/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isMock = !supabaseUrl || !supabaseAnonKey;

if (isMock) {
  console.warn('Supabase URL or Anon Key is missing. Live features will fallback to simulation.');
}

// Create a dummy supabase client that won't throw, allowing the app to run completely in fallback/simulation mode if Vercel doesn't have credentials
const createMockSupabase = () => {
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // immediately call callback with SIGNED_OUT
      setTimeout(() => callback('SIGNED_OUT', null), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: async () => ({ error: null }),
    signUp: async () => ({ data: { user: null }, error: new Error('Database disconnected. Auth is disabled.') }),
    signInWithPassword: async () => ({ data: { user: null }, error: new Error('Database disconnected. Auth is disabled.') }),
    resetPasswordForEmail: async () => ({ error: new Error('Database disconnected. Auth is disabled.') }),
    updateUser: async () => ({ error: new Error('Database disconnected. Auth is disabled.') }),
  };

  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: new Error('Database disconnected.') }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    upsert: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    then: (onfulfilled?: any) => Promise.resolve({ data: null, error: new Error('Database disconnected.') }).then(onfulfilled),
  };

  return {
    auth: mockAuth,
    from: () => mockQueryBuilder,
  };
};

export const supabase = isMock 
  ? (createMockSupabase() as any) 
  : createClient(supabaseUrl, supabaseAnonKey);

