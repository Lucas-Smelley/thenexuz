"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Crown, Star, Zap, Gem } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Gorb {
  id: string
  name: string
  description: string
  rarity: 'Ahh' | 'Crusty' | 'Bombaclat' | 'Epic' | 'RayOfSunshine'
  style_data: {
    colors: string[]
    effects: string[]
  }
  price_epic_coins?: number
}

export default function MyGorbzPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [userGorbz, setUserGorbz] = useState<Gorb[]>([])
  const [allGorbz, setAllGorbz] = useState<Gorb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/epicrngworld')
    }
  }, [user, loading, router])

  // Fetch user's Gorbz collection
  useEffect(() => {
    if (user && profile) {
      fetchUserGorbz()
    }
  }, [user, profile])

  const fetchUserGorbz = async () => {
    try {
      // First get all available Gorbz
      const { data: allGorbzData, error: gorbzError } = await supabase
        .from('gorbz')
        .select('*')

      if (gorbzError) throw gorbzError

      setAllGorbz(allGorbzData || [])

      // Filter to show only user's collected Gorbz
      const userCollectedGorbz = allGorbzData?.filter(gorb => 
        profile?.gorbz?.includes(gorb.id)
      ) || []

      setUserGorbz(userCollectedGorbz)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching Gorbz:', error)
      setIsLoading(false)
    }
  }

  const equipGorb = async (gorbId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ main_gorb: gorbId })
        .eq('id', user?.id)

      if (error) throw error
      
      // Refresh profile will happen automatically via real-time subscription
      console.log(`Equipped Gorb: ${gorbId}`)
    } catch (error) {
      console.error('Error equipping Gorb:', error)
    }
  }

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'RayOfSunshine':
        return {
          border: 'border-yellow-300',
          glow: 'shadow-2xl shadow-yellow-300/80',
          bg: 'from-yellow-400/20 via-orange-400/30 to-yellow-400/20',
          icon: Crown,
          label: 'RAY OF SUNSHINE',
          textColor: 'text-yellow-300',
          animation: 'animate-pulse'
        }
      case 'Epic':
        return {
          border: 'border-purple-400',
          glow: 'shadow-2xl shadow-purple-400/70',
          bg: 'from-purple-500/20 via-fuchsia-500/30 to-purple-500/20',
          icon: Star,
          label: 'EPIC',
          textColor: 'text-purple-400',
          animation: 'animate-bounce'
        }
      case 'Bombaclat':
        return {
          border: 'border-red-400',
          glow: 'shadow-xl shadow-red-400/60',
          bg: 'from-red-500/20 via-pink-500/25 to-red-500/20',
          icon: Zap,
          label: 'BOMBACLAT',
          textColor: 'text-red-400',
          animation: 'animate-ping'
        }
      case 'Crusty':
        return {
          border: 'border-cyan-400',
          glow: 'shadow-xl shadow-cyan-400/50',
          bg: 'from-cyan-500/15 via-blue-500/20 to-cyan-500/15',
          icon: Gem,
          label: 'CRUSTY',
          textColor: 'text-cyan-400',
          animation: 'animate-pulse'
        }
      default: // Ahh
        return {
          border: 'border-gray-400',
          glow: 'shadow-lg shadow-gray-400/40',
          bg: 'from-gray-500/10 via-white/15 to-gray-500/10',
          icon: Star,
          label: 'AHH',
          textColor: 'text-gray-400',
          animation: ''
        }
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 flex items-center justify-center">
        <div className="text-4xl font-mono font-black text-yellow-400 animate-pulse">LOADING GORBZ...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 relative overflow-hidden">
      {/* Background Effects (same as home page) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/40 via-cyan-500/30 to-green-500/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-transparent via-red-500/25 to-blue-500/20 animate-ping" style={{animationDuration: '4s'}}></div>
        <div className="absolute inset-0 bg-gradient-conic from-pink-500/30 via-cyan-500/30 via-yellow-500/30 to-green-500/30 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-30 p-4 flex justify-between items-center">
        <a
          href="/epicrngworld"
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-black via-purple-900 to-black border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-105 shadow-xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-lg backdrop-blur-sm text-pink-400 hover:text-cyan-400"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-mono font-black">BACK TO GAMES</span>
        </a>

        <div className="flex items-center gap-4">
          <a
            href="/epicrngworld/shop"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-black via-yellow-900/50 to-black border-2 border-yellow-400 hover:border-orange-400 transition-all duration-300 font-bold transform hover:scale-105 shadow-xl shadow-yellow-400/50 hover:shadow-orange-400/50 rounded-lg backdrop-blur-sm text-yellow-400 hover:text-orange-400"
          >
            <Gem className="w-5 h-5" />
            <span className="text-sm font-mono font-black">SHOP</span>
          </a>

          <div className="bg-gradient-to-r from-black via-purple-900 to-black border-2 border-green-400 px-4 py-2 font-mono rounded-lg shadow-xl shadow-green-400/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-green-400">{profile?.epic_coins.toLocaleString()}EC</span>
            </div>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="relative z-20 text-center pt-8 pb-12">
        <h1 className="text-6xl font-black font-mono leading-none" style={{
          color: '#ffff00',
          textShadow: '0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.8), 0 0 90px rgba(255, 255, 0, 0.6)',
          filter: 'blur(0.5px)'
        }}>
          MY GORBZ COLLECTION
        </h1>
        <div className="mt-4 text-xl font-mono font-bold text-cyan-400">
          {userGorbz.length} / {allGorbz.length} Collected
        </div>
        
        {/* Prominent Shop Button */}
        <div className="mt-8">
          <a
            href="/epicrngworld/shop"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 border-4 border-purple-400 hover:border-pink-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-purple-500/60 hover:shadow-pink-500/60 rounded-xl backdrop-blur-sm text-white hover:text-purple-100 text-2xl font-mono font-black"
            style={{
              textShadow: '0 0 10px rgba(0, 0, 0, 1), 0 0 20px rgba(0, 0, 0, 0.8)',
              boxShadow: '0 0 30px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)'
            }}
          >
            <Gem className="w-8 h-8 animate-pulse" />
            <span>GET MORE GORBZ</span>
            <Gem className="w-8 h-8 animate-pulse" />
          </a>
        </div>
      </div>

      {/* Gorbz Collection */}
      <div className="relative z-20 px-8 pb-12">
        {userGorbz.length === 0 ? (
          <div className="text-center">
            <div className="text-2xl font-mono font-black text-gray-400 mb-4">NO GORBZ COLLECTED YET</div>
            <div className="text-lg font-mono text-gray-500">Start playing games to collect your first Gorbz!</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 max-w-7xl mx-auto">
            {userGorbz.map((gorb) => {
              const config = getRarityConfig(gorb.rarity)
              const Icon = config.icon
              const isEquipped = profile?.main_gorb === gorb.id

              return (
                <div key={gorb.id} className="relative group flex flex-col items-center">
                  {/* Rarity Halo */}
                  <div className={`absolute -inset-4 bg-gradient-to-r ${config.bg} rounded-full ${config.glow} ${config.animation} opacity-75`}></div>
                  
                  {/* Equipped Indicator */}
                  {isEquipped && (
                    <div className="absolute -top-2 -right-2 z-30">
                      <Crown className="w-8 h-8 text-yellow-300 animate-bounce" />
                    </div>
                  )}

                  {/* Gorb Container */}
                  <button
                    onClick={() => equipGorb(gorb.id)}
                    className={`relative w-24 h-24 rounded-full border-4 ${config.border} ${config.glow} transition-all duration-500 transform hover:scale-110 group-hover:rotate-12 cursor-pointer overflow-hidden`}
                    style={{
                      background: `linear-gradient(45deg, ${gorb.style_data.colors.join(', ')})`,
                    }}
                  >
                    {/* Inner Orb Effects */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-white/50 to-transparent animate-pulse"></div>
                    
                    {/* Rarity Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${config.textColor} animate-pulse`} />
                    </div>

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </button>

                  {/* Gorb Info */}
                  <div className="text-center mt-4 space-y-1">
                    <div className={`text-sm font-mono font-black ${config.textColor}`}>{gorb.name}</div>
                    <div className={`text-xs font-mono ${config.textColor} opacity-75`}>{config.label}</div>
                    {isEquipped && (
                      <div className="text-xs font-mono font-black text-yellow-300 animate-pulse">EQUIPPED</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}