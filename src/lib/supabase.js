import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isValidUrl = (url) => {
  try { return url && url !== 'your_supabase_url' && new URL(url) && true }
  catch { return false }
}

export const isSupabaseConfigured = () => {
  return isValidUrl(supabaseUrl) &&
    supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key'
}

// Only create a real client if credentials are valid, otherwise create a dummy
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => { throw new Error('Supabase not configured') },
        signUp: async () => { throw new Error('Supabase not configured') },
        signInWithOAuth: async () => { throw new Error('Supabase not configured') },
        signOut: async () => {},
        updateUser: async () => { throw new Error('Supabase not configured') },
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }), data: [], error: null }), or: () => ({ order: () => ({ data: [], error: null }) }), single: () => ({ data: null, error: null }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
      }),
    }

