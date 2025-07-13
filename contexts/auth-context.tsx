"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  username: string
  email: string | null
  epic_coins: number
  gorbz: string[]
  main_gorb: string | null
  gorbz_collected_total: number
  custom_room_theme: string
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.message === 'Supabase not configured') {
          return null
        }
        throw error
      }
      
      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  useEffect(() => {
    let mounted = true
    let authSubscription: any = null
    let profileSubscription: any = null

    // Initialize auth with proper timing
    const initializeAuth = async () => {
      try {
        // Small delay to ensure Supabase is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id)
          
          if (mounted) {
            setProfile(profileData)
          }

          // Set up real-time subscription for user profile changes
          if (mounted) {
            profileSubscription = supabase
              .channel(`user-profile-${session.user.id}`)
              .on(
                'postgres_changes',
                {
                  event: 'UPDATE',
                  schema: 'public',
                  table: 'users',
                  filter: `id=eq.${session.user.id}`
                },
                (payload) => {
                  if (mounted && payload.new) {
                    setProfile(payload.new as UserProfile)
                  }
                }
              )
              .subscribe()
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        
        if (mounted) {
          setLoading(false)
        }
        
        // Set up auth listener after initial load completes
        if (mounted) {
          const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (!mounted) return
              
              if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user)
                const profileData = await fetchProfile(session.user.id)
                setProfile(profileData)

                // Set up profile subscription for new user
                if (profileSubscription) {
                  profileSubscription.unsubscribe()
                }
                
                profileSubscription = supabase
                  .channel(`user-profile-${session.user.id}`)
                  .on(
                    'postgres_changes',
                    {
                      event: 'UPDATE',
                      schema: 'public',
                      table: 'users',
                      filter: `id=eq.${session.user.id}`
                    },
                    (payload) => {
                      if (mounted && payload.new) {
                        setProfile(payload.new as UserProfile)
                      }
                    }
                  )
                  .subscribe()
              } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setProfile(null)
                
                // Clean up profile subscription
                if (profileSubscription) {
                  profileSubscription.unsubscribe()
                  profileSubscription = null
                }
              }
            }
          )
          
          authSubscription = data.subscription
        }
        
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
      if (profileSubscription) {
        profileSubscription.unsubscribe()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}