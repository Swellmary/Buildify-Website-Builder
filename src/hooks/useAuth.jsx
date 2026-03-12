import { useState, useEffect, useContext, createContext } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  const buildProfile = (u) => ({
    name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
    email: u.email,
    avatar: u.user_metadata?.avatar_url || null,
  })

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Wrap in try/catch so invalid Supabase creds don't crash the app
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.warn('Supabase getSession error:', error.message)
        }
        setUser(session?.user ?? null)
        if (session?.user) setProfile(buildProfile(session.user))
      } catch (err) {
        console.warn('Supabase init failed:', err.message)
      } finally {
        setLoading(false)
      }
    }

    initSession()

    let subscription
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setProfile(buildProfile(session.user))
        } else {
          setProfile(null)
        }
      })
      subscription = data.subscription
    } catch (err) {
      console.warn('Auth state listener failed:', err.message)
    }

    return () => subscription?.unsubscribe?.()
  }, [])

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  const deleteAccount = async () => {
    await signOut()
  }

  return (
    <AuthContext.Provider value={{
      user, loading, profile,
      signInWithEmail, signUp, signInWithGoogle, signOut,
      updatePassword, deleteAccount,
      isConfigured: isSupabaseConfigured()
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
