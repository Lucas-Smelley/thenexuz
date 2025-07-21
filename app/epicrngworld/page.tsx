"use client";

import { useState, useEffect } from "react"
import { Zap, Coins, TrendingUp, Shuffle, ArrowLeft, Crown, Gem, Star, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import AuthModal from "@/components/auth/auth-modal"
import { createClient } from "@/lib/supabase"

export default function EpicRngWorldPage() {
  const { user, profile, loading, signOut } = useAuth()
  const [glitchText, setGlitchText] = useState("EPIC RNG WORLD")
  const [cryptoPrice, setCryptoPrice] = useState(42069.42)
  const [jackpot, setJackpot] = useState<number | null>(null) // Loading state
  const [isJackpotLoading, setIsJackpotLoading] = useState(true)
  const [showJackpotExplosion, setShowJackpotExplosion] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [hiddenAds, setHiddenAds] = useState<string[]>([])
  const supabase = createClient()

  const hideAd = (adId: string) => {
    setHiddenAds(prev => [...prev, adId])
  }

  // Fetch jackpot value from Supabase
  const fetchJackpot = async () => {
    try {
      const { data, error } = await supabase
        .from('prizes')
        .select('value')
        .eq('id', 'epic_mega_jackpot')
        .eq('is_active', true)
        .single()

      if (data && !error) {
        setJackpot(data.value)
        setIsJackpotLoading(false)
        // Trigger explosion effect when loaded
        setShowJackpotExplosion(true)
        setTimeout(() => setShowJackpotExplosion(false), 1000)
      } else {
        // Set a fallback value if fetch fails
        setJackpot(100000)
        setIsJackpotLoading(false)
        setShowJackpotExplosion(true)
        setTimeout(() => setShowJackpotExplosion(false), 1000)
      }
    } catch (error) {
      console.error('Error fetching jackpot:', error)
      // Set a fallback value if fetch fails
      setJackpot(100000)
      setIsJackpotLoading(false)
      setShowJackpotExplosion(true)
      setTimeout(() => setShowJackpotExplosion(false), 1000)
    }
  }

  useEffect(() => {
    // Fetch initial jackpot value
    fetchJackpot()

    let tickCount = 0
    
    // Only animate crypto price, not jackpot
    const interval = setInterval(() => {
      tickCount++
      setCryptoPrice(prev => prev + (((tickCount * 0.7) % 2) - 1) * 100)
    }, 2000)

    const glitchInterval = setInterval(() => {
      tickCount++
      if ((tickCount * 0.1) % 1 < 0.1) {
        setGlitchText("3P1C RN6 W0RLD")
        setTimeout(() => setGlitchText("EPIC RNG WORLD"), 150)
      }
    }, 1000)

    // Set up real-time subscription for jackpot updates
    const jackpotSubscription = supabase
      .channel('prizes-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'prizes',
          filter: 'id=eq.epic_mega_jackpot'
        },
        (payload) => {
          if (payload.new && payload.new.value !== jackpot) {
            setJackpot(payload.new.value)
            setShowJackpotExplosion(true)
            setTimeout(() => setShowJackpotExplosion(false), 1000)
          }
        }
      )
      .subscribe()

    // Fallback: refresh jackpot every 30 seconds in case real-time fails
    const jackpotInterval = setInterval(() => {
      fetchJackpot()
    }, 30000)

    return () => {
      clearInterval(interval)
      clearInterval(glitchInterval)
      clearInterval(jackpotInterval)
      supabase.removeChannel(jackpotSubscription)
    }
  }, [])

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showUserMenu && !target.closest('[data-user-menu]')) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])


  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 relative overflow-hidden">
      {/* Vibrant animated background layers */}
      <div className="absolute inset-0">
        {/* Animated aurora effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/40 via-cyan-500/30 to-green-500/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-transparent via-red-500/25 to-blue-500/20 animate-ping" style={{animationDuration: '4s'}}></div>
        
        {/* Dynamic grid with rainbow colors */}
        <div className="absolute inset-0 opacity-40">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div
                key={i}
                className={`border-2 ${
                  i % 6 === 0 ? 'border-pink-400/50 bg-pink-500/10' :
                  i % 6 === 1 ? 'border-cyan-400/50 bg-cyan-500/10' :
                  i % 6 === 2 ? 'border-yellow-400/50 bg-yellow-500/10' :
                  i % 6 === 3 ? 'border-green-400/50 bg-green-500/10' :
                  i % 6 === 4 ? 'border-purple-400/50 bg-purple-500/10' :
                  'border-red-400/50 bg-red-500/10'
                } animate-pulse`}
                style={{
                  animationDelay: `${(i * 0.01) % 2}s`,
                  animationDuration: `${2 + (i * 0.005) % 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Rotating color overlays */}
        <div className="absolute inset-0 bg-gradient-conic from-pink-500/30 via-cyan-500/30 via-yellow-500/30 to-green-500/30 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute inset-0 bg-gradient-conic from-purple-500/20 via-red-500/20 via-blue-500/20 to-orange-500/20 animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
      </div>

      {/* Floating geometric shapes with rainbow colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-pink-400 rotate-45 animate-bounce opacity-80 shadow-2xl shadow-pink-400/50"></div>
        <div className="absolute top-1/6 right-1/3 w-12 h-12 border-4 border-cyan-400 rotate-45 animate-spin opacity-70 shadow-2xl shadow-cyan-400/50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-80 shadow-2xl shadow-yellow-400/50"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-4 bg-green-400 animate-pulse opacity-70 shadow-2xl shadow-green-400/50"></div>
        <div className="absolute bottom-1/4 right-1/2 w-4 h-16 bg-purple-400 animate-pulse opacity-80 shadow-2xl shadow-purple-400/50"></div>
        <div className="absolute top-1/3 left-1/6 w-10 h-10 border-4 border-red-400 animate-spin opacity-60 shadow-2xl shadow-red-400/50"></div>
        <div className="absolute bottom-1/5 right-1/6 w-8 h-8 bg-orange-400 rotate-45 animate-bounce opacity-70 shadow-2xl shadow-orange-400/50"></div>
        <div className="absolute top-2/3 left-1/8 w-6 h-2 bg-lime-400 animate-pulse opacity-60 shadow-xl shadow-lime-400/50"></div>
        <div className="absolute bottom-1/6 left-2/3 w-2 h-12 bg-teal-400 animate-pulse opacity-70 shadow-xl shadow-teal-400/50"></div>
        <div className="absolute top-1/5 right-1/8 w-14 h-14 border-4 border-indigo-400 rotate-45 animate-spin opacity-60 shadow-2xl shadow-indigo-400/50"></div>
      </div>

      {/* Colorful matrix-like falling code */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className={`absolute font-mono text-sm font-bold animate-pulse ${
              i % 6 === 0 ? 'text-pink-400' :
              i % 6 === 1 ? 'text-cyan-400' :
              i % 6 === 2 ? 'text-yellow-400' :
              i % 6 === 3 ? 'text-green-400' :
              i % 6 === 4 ? 'text-purple-400' : 'text-red-400'
            }`}
            style={{
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              animationDelay: `${(i * 0.05) % 3}s`,
              textShadow: '0 0 10px currentColor, 0 0 20px currentColor'
            }}
          >
            {`${['$', '¥', '€', '₿', '💎', '⚡', '🔥', '💰', '🚀', '⭐'][i % 10]}${Math.floor(i * 123.456)}`}
          </div>
        ))}
      </div>

      {/* Back to Nexuz button */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-30">
        <a
          href="/"
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 bg-gradient-to-r from-black via-purple-900 to-black border-2 sm:border-3 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-md sm:rounded-lg backdrop-blur-sm"
          style={{
            background: 'linear-gradient(45deg, #ec4899, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 20px #ec4899'
          }}
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-pink-400" />
          <span className="text-xs sm:text-sm lg:text-base font-mono font-black">BACK TO NEXUZ</span>
        </a>
      </div>

      {/* User info / Auth */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-30">
        {user && profile ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Epic Coins Display */}
            <div className="bg-gradient-to-r from-black via-purple-900 to-black border-2 sm:border-3 border-green-400 px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 font-mono rounded-md sm:rounded-lg shadow-2xl shadow-green-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-400 animate-pulse" />
                <span className="text-xs sm:text-sm lg:text-base font-black text-green-400">{profile.epic_coins.toLocaleString()}EC</span>
              </div>
            </div>
            
            {/* User Menu Button */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-gradient-to-r from-black via-purple-900 to-black border-2 sm:border-3 border-cyan-400 px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 font-mono rounded-md sm:rounded-lg shadow-2xl shadow-cyan-400/50 backdrop-blur-sm hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-cyan-400" />
                  <span className="text-xs sm:text-sm lg:text-base font-black text-cyan-400">{profile.username}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-gradient-to-r from-black via-purple-900 to-black border-2 border-cyan-400 rounded-md shadow-2xl shadow-cyan-400/50 backdrop-blur-sm min-w-[160px] z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-cyan-400/30">
                      <div className="text-xs text-cyan-300 font-mono">Signed in as</div>
                      <div className="text-sm font-black text-cyan-400 font-mono">{profile.username}</div>
                      <div className="text-xs text-cyan-300 font-mono">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-3 py-2 mt-2 flex items-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors font-mono text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Crypto ticker for non-users */}
            <div className="bg-gradient-to-r from-black via-purple-900 via-gray-900 to-black border-2 sm:border-3 border-yellow-400 px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 font-mono rounded-md sm:rounded-lg shadow-2xl shadow-yellow-400/50 backdrop-blur-sm hover:border-orange-400 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400/15 animate-pulse"></div>
              <div className="relative flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400 animate-pulse drop-shadow-xl" />
                <span className="text-xs sm:text-sm lg:text-base font-black text-yellow-400 drop-shadow-xl">RNG: {Math.floor(cryptoPrice).toLocaleString()}EC</span>
              </div>
            </div>
            
            {/* Login button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 sm:px-6 lg:px-8 py-1 sm:py-2 lg:py-3 font-mono font-black text-xs sm:text-sm lg:text-base hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border-2 sm:border-3 border-white rounded-md sm:rounded-lg shadow-2xl shadow-pink-500/50 transform hover:scale-110"
            >
              LOGIN
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-20 h-screen flex flex-col">
        
        {/* TITLE SECTION */}
        <div className="pt-12 lg:pt-16 xl:pt-20 pb-8 lg:pb-12 xl:pb-16 text-center">
          <div className="relative mb-3">
            <div className="absolute inset-0 animate-ping opacity-30">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-pink-400 mb-2 font-mono tracking-wider">
                <span className="inline-block">{glitchText}</span>
              </h1>
            </div>
            <h1 className="relative text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black mb-2 font-mono tracking-wider transform hover:scale-105 transition-transform duration-300 text-yellow-400 drop-shadow-2xl"
                style={{
                  filter: 'blur(0.5px)',
                  textShadow: '0 0 8px rgba(255, 255, 0, 0.8), 0 0 16px rgba(255, 255, 0, 0.4)'
                }}>
              <span className="inline-block animate-pulse">{glitchText}</span>
            </h1>
          </div>
          
          <div className="h-2 w-full max-w-md mx-auto bg-gradient-to-r from-pink-500 via-cyan-400 via-yellow-400 via-green-400 to-purple-500 animate-pulse rounded-full shadow-2xl shadow-pink-400/50 mb-3"></div>
          
          <div className="text-lg sm:text-xl lg:text-2xl font-black tracking-widest mb-2 font-mono"
               style={{
                 background: 'linear-gradient(90deg, #10b981, #06b6d4, #ec4899, #f59e0b)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 textShadow: '0 0 20px #10b981, 0 0 40px #06b6d4'
               }}>
            <span className="animate-pulse">QUANTUM LUCK PROTOCOL</span>
          </div>
          
          <div className="text-base sm:text-lg lg:text-xl font-black font-mono"
               style={{
                 background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 textShadow: '0 0 15px #f59e0b'
               }}>
            {">>>"} MAKE YOUR DREAMS COME TRUE {"<<<"}
          </div>
        </div>

        {/* Main Layout (All Screen Sizes) */}
        <div className="flex-1 flex flex-col px-4">
          {/* MEGA JACKPOT */}
          <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto mt-8 lg:mt-12 xl:mt-16 mb-12 lg:mb-16 xl:mb-20">
            <div className="relative">
              <div className="absolute -inset-3 lg:-inset-4 xl:-inset-5 bg-gradient-to-r from-pink-500/40 via-yellow-400/50 via-cyan-500/40 to-green-500/40 rounded-3xl animate-pulse"></div>
              <div className="absolute -inset-1 lg:-inset-2 xl:-inset-3 border-3 lg:border-4 xl:border-5 border-yellow-400 border-dashed rounded-3xl animate-ping"></div>
              <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-4 lg:border-6 xl:border-8 border-pink-400 p-6 lg:p-8 xl:p-10 rounded-3xl overflow-hidden shadow-2xl shadow-pink-400/70">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/30 to-cyan-400/20 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-green-500/20 animate-ping"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black font-mono mb-3 lg:mb-4 xl:mb-5 flex items-center justify-center"
                       style={{
                         background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
                         backgroundSize: '200% 200%',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent',
                         animation: 'rainbow 3s ease-in-out infinite',
                         textShadow: '0 0 30px #f59e0b, 0 0 60px #ec4899'
                       }}>
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 mr-2 lg:mr-3 xl:mr-4 text-yellow-400 animate-spin" style={{animationDuration: '8s'}} />
                    <span>MEGA JACKPOT</span>
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 ml-2 lg:ml-3 xl:ml-4 text-yellow-400 animate-spin" style={{animationDuration: '8s'}} />
                  </div>
                  <div className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black font-mono animate-pulse text-yellow-400 drop-shadow-2xl relative transition-all duration-500 ${
                    isJackpotLoading ? 'blur-sm' : 'blur-0'
                  } ${showJackpotExplosion ? 'scale-150' : 'scale-100'}`}>
                    {isJackpotLoading ? '...' : `${jackpot?.toLocaleString()}EC`}
                    
                    {/* Explosion effect */}
                    {showJackpotExplosion && (
                      <div className="absolute inset-0 pointer-events-none">
                        {Array.from({length: 8}).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-2 h-2 lg:w-3 lg:h-3 xl:w-4 xl:h-4 rounded-full animate-ping"
                            style={{
                              background: ['#FF69B4', '#00FFFF', '#FFD700', '#FF1493', '#00FF00', '#FF4500', '#9370DB', '#FF6347'][i],
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-25px)`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: '0.8s'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm lg:text-lg xl:text-xl font-black font-mono mt-2 lg:mt-3 xl:mt-4 animate-bounce"
                       style={{
                         background: 'linear-gradient(45deg, #06b6d4, #10b981, #f59e0b)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent',
                         textShadow: '0 0 20px #06b6d4'
                       }}>
                    🔥🔴 LIVE • UPDATING • EXPLODING 🔴🔥
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="flex-1 flex flex-col space-y-4 lg:space-y-8 xl:space-y-10 px-2 lg:px-4 mt-8 lg:mt-12 xl:mt-16">
            {/* Mobile: 3 rows (2-2-1), Desktop: 2 rows */}
            
            {/* First Row */}
            <div className="flex space-x-2 sm:space-x-4 lg:space-x-6 xl:space-x-8 justify-center">
              <a href="/epicrngworld/slots" className="block group transform hover:scale-105 transition-all duration-300 -rotate-6">
                <div className="relative">
                  <div className="absolute -inset-2 lg:-inset-3 xl:-inset-4 bg-gradient-to-r from-pink-400/40 to-cyan-400/40 rounded-2xl lg:rounded-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 lg:border-4 xl:border-5 border-pink-400 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-2xl lg:rounded-3xl hover:border-cyan-400 transition-colors shadow-2xl shadow-pink-400/60 group-hover:shadow-cyan-400/60 overflow-hidden w-32 sm:w-40 md:w-44 lg:w-48 xl:w-56 h-20 sm:h-24 lg:h-32 xl:h-36 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-pink-400/15 rounded-2xl lg:rounded-3xl group-hover:bg-cyan-400/15 transition-colors"></div>
                    <div className="relative text-center">
                      <Gem className="w-8 sm:w-10 lg:w-12 xl:w-14 h-8 sm:h-10 lg:h-12 xl:h-14 text-pink-400 mx-auto mb-1 lg:mb-2 xl:mb-3 group-hover:animate-pulse group-hover:text-cyan-400 transition-colors drop-shadow-xl" />
                      <div className="text-pink-400 font-mono font-black text-xs sm:text-sm lg:text-lg xl:text-xl group-hover:text-cyan-400 transition-colors">SLOTS</div>
                      <div className="text-pink-300 text-xs lg:text-sm xl:text-base font-mono font-bold group-hover:text-cyan-300 transition-colors">💎 777</div>
                    </div>
                  </div>
                </div>
              </a>

              <a href="/epicrngworld/dice" className="block group transform hover:scale-105 transition-all duration-300 rotate-6">
                <div className="relative">
                  <div className="absolute -inset-2 lg:-inset-3 xl:-inset-4 bg-gradient-to-r from-cyan-400/40 to-green-400/40 rounded-2xl lg:rounded-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 lg:border-4 xl:border-5 border-cyan-400 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-2xl lg:rounded-3xl hover:border-green-400 transition-colors shadow-2xl shadow-cyan-400/60 group-hover:shadow-green-400/60 overflow-hidden w-32 sm:w-40 md:w-44 lg:w-48 xl:w-56 h-20 sm:h-24 lg:h-32 xl:h-36 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-cyan-400/15 rounded-2xl lg:rounded-3xl group-hover:bg-green-400/15 transition-colors"></div>
                    <div className="relative text-center">
                      <Coins className="w-8 sm:w-10 lg:w-12 xl:w-14 h-8 sm:h-10 lg:h-12 xl:h-14 text-cyan-400 mx-auto mb-1 lg:mb-2 xl:mb-3 group-hover:animate-bounce group-hover:text-green-400 transition-colors drop-shadow-xl" />
                      <div className="text-cyan-400 font-mono font-black text-xs sm:text-sm lg:text-lg xl:text-xl group-hover:text-green-400 transition-colors">DICE</div>
                      <div className="text-cyan-300 text-xs lg:text-sm xl:text-base font-mono font-bold group-hover:text-green-300 transition-colors">🎲 ROLL</div>
                    </div>
                  </div>
                </div>
              </a>
              
              {/* Desktop: Add Crash to first row */}
              <a href="/epicrngworld/crash" className="hidden lg:block group transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="absolute -inset-3 xl:-inset-4 bg-gradient-to-r from-green-400/40 to-purple-400/40 rounded-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-4 xl:border-5 border-green-400 p-6 xl:p-8 rounded-3xl hover:border-purple-400 transition-colors shadow-2xl shadow-green-400/60 group-hover:shadow-purple-400/60 overflow-hidden w-48 xl:w-56 h-32 xl:h-36 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-green-400/15 rounded-3xl group-hover:bg-purple-400/15 transition-colors"></div>
                    <div className="relative text-center">
                      <Star className="w-12 xl:w-14 h-12 xl:h-14 text-green-400 mx-auto mb-2 xl:mb-3 group-hover:animate-pulse group-hover:text-purple-400 transition-colors drop-shadow-xl" />
                      <div className="text-green-400 font-mono font-black text-lg xl:text-xl group-hover:text-purple-400 transition-colors">CRASH</div>
                      <div className="text-green-300 text-sm xl:text-base font-mono font-bold group-hover:text-purple-300 transition-colors">🚀 UP 🚀</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Second Row */}
            <div className="flex space-x-2 sm:space-x-4 lg:space-x-6 xl:space-x-8 justify-center">
              <a href="/epicrngworld/wheel" className="block group transform hover:scale-105 transition-all duration-300 -rotate-6">
                <div className="relative">
                  <div className="absolute -inset-2 lg:-inset-3 xl:-inset-4 bg-gradient-to-r from-yellow-400/40 to-pink-400/40 rounded-2xl lg:rounded-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 lg:border-4 xl:border-5 border-yellow-400 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-2xl lg:rounded-3xl hover:border-pink-400 transition-colors shadow-2xl shadow-yellow-400/60 group-hover:shadow-pink-400/60 overflow-hidden w-32 sm:w-40 md:w-44 lg:w-48 xl:w-56 h-20 sm:h-24 lg:h-32 xl:h-36 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-yellow-400/15 rounded-2xl lg:rounded-3xl group-hover:bg-pink-400/15 transition-colors"></div>
                    <div className="relative text-center">
                      <Shuffle className="w-8 sm:w-10 lg:w-12 xl:w-14 h-8 sm:h-10 lg:h-12 xl:h-14 text-yellow-400 mx-auto mb-1 lg:mb-2 xl:mb-3 group-hover:animate-spin group-hover:text-pink-400 transition-colors drop-shadow-xl" />
                      <div className="text-yellow-400 font-mono font-black text-xs sm:text-sm lg:text-lg xl:text-xl group-hover:text-pink-400 transition-colors">WHEEL</div>
                      <div className="text-yellow-300 text-xs lg:text-sm xl:text-base font-mono font-bold group-hover:text-pink-300 transition-colors">💥 SPIN</div>
                    </div>
                  </div>
                </div>
              </a>

              <a href="/epicrngworld/plinko" className="block group transform hover:scale-105 transition-all duration-300 rotate-6">
                <div className="relative">
                  <div className="absolute -inset-2 lg:-inset-3 xl:-inset-4 bg-gradient-to-r from-purple-400/40 to-fuchsia-400/40 rounded-2xl lg:rounded-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 lg:border-4 xl:border-5 border-purple-400 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-2xl lg:rounded-3xl hover:border-fuchsia-400 transition-colors shadow-2xl shadow-purple-400/60 group-hover:shadow-fuchsia-400/60 overflow-hidden w-32 sm:w-40 md:w-44 lg:w-48 xl:w-56 h-20 sm:h-24 lg:h-32 xl:h-36 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-purple-400/15 rounded-2xl lg:rounded-3xl group-hover:bg-fuchsia-400/15 transition-colors"></div>
                    <div className="relative text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-1 lg:mb-2 xl:mb-3 text-purple-400 group-hover:text-fuchsia-400 transition-colors drop-shadow-xl animate-bounce" style={{animationDuration: '3s'}}>🎯</div>
                      <div className="text-purple-400 font-mono font-black text-xs sm:text-sm lg:text-lg xl:text-xl group-hover:text-fuchsia-400 transition-colors">PLINKO</div>
                      <div className="text-purple-300 text-xs lg:text-sm xl:text-base font-mono font-bold group-hover:text-fuchsia-300 transition-colors">DROP</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Third Row - Mobile Only (Centered Crash) */}
            <div className="flex justify-center lg:hidden">
              <a href="/epicrngworld/crash" className="block group transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400/40 to-purple-400/40 rounded-2xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 border-green-400 p-3 sm:p-4 rounded-2xl hover:border-purple-400 transition-colors shadow-2xl shadow-green-400/60 group-hover:shadow-purple-400/60 overflow-hidden w-40 sm:w-48 md:w-52 h-20 sm:h-24 flex flex-col justify-center">
                    <div className="absolute inset-0 bg-green-400/15 rounded-2xl group-hover:bg-purple-400/15 transition-colors"></div>
                    <div className="relative text-center">
                      <Star className="w-8 sm:w-10 h-8 sm:h-10 text-green-400 mx-auto mb-1 group-hover:animate-pulse group-hover:text-purple-400 transition-colors drop-shadow-xl" />
                      <div className="text-green-400 font-mono font-black text-xs sm:text-sm group-hover:text-purple-400 transition-colors">CRASH</div>
                      <div className="text-green-300 text-xs font-mono font-bold group-hover:text-purple-300 transition-colors">🚀 UP 🚀</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* MY GORBZ BUTTON */}
          <div className="py-4 lg:py-6 xl:py-8 flex-shrink-0 pb-safe">
            <div className="flex items-center justify-center px-4">
              <div className="relative max-w-fit">
                <div className="absolute -inset-3 lg:-inset-4 xl:-inset-5 border-3 lg:border-4 xl:border-5 border-yellow-400 border-dashed animate-pulse rounded-2xl lg:rounded-3xl opacity-60"></div>
                <div className="absolute -inset-1 lg:-inset-2 xl:-inset-3 bg-gradient-to-r from-pink-500/30 via-yellow-400/40 via-cyan-500/30 to-green-500/30 rounded-2xl lg:rounded-3xl animate-ping"></div>
                
                <button 
                  onClick={() => user ? null : setShowAuthModal(true)}
                  className="relative bg-gradient-to-r from-black via-purple-900 via-gray-900 to-black border-4 lg:border-6 xl:border-7 text-lg lg:text-xl xl:text-2xl px-6 lg:px-10 xl:px-12 py-3 lg:py-4 xl:py-5 font-black font-mono transition-all duration-300 transform hover:scale-110 shadow-2xl rounded-xl lg:rounded-2xl xl:rounded-3xl overflow-hidden"
                  style={{
                    borderImage: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981, #8b5cf6) 1',
                    background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-pink-400/15 to-cyan-400/10 animate-pulse"></div>
                  
                  <span className="relative flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981, #8b5cf6)',
                          backgroundSize: '300% 300%',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          animation: 'rainbow 2s ease-in-out infinite',
                          textShadow: '0 0 30px #f59e0b, 0 0 60px #ec4899'
                        }}>
                    <Zap className="mr-2 lg:mr-3 xl:mr-4 text-yellow-400 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 animate-pulse" />
                    <span className="font-black text-center whitespace-nowrap">{user ? "🎮 MY GORBZ 🎮" : "💥 JOIN NOW 💥"}</span>
                    <Zap className="ml-2 lg:ml-3 xl:ml-4 text-yellow-400 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 animate-pulse" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* OBNOXIOUS SATIRICAL ADVERTISEMENTS */}
      
      {/* Crazy Deal Banner - Top Left */}
      <div className="hidden md:block absolute top-20 left-4 z-30">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 border-4 border-yellow-400 rounded-xl p-4 animate-bounce shadow-2xl shadow-red-500/70 transform rotate-12 max-w-64">
          <div className="text-white text-center font-mono font-black">
            <div className="text-2xl text-yellow-300 mb-2">🔥 HOT DEAL 🔥</div>
            <div className="text-xl mb-1">DEPOSIT 1EC</div>
            <div className="text-3xl font-black text-yellow-400">WIN 1,000,000EC*</div>
            <div className="text-xs text-red-200 mt-1">*in monopoly money</div>
            <div className="text-lg mt-2 animate-pulse">LIMITED TIME!**</div>
            <div className="text-xs text-red-200">**forever</div>
          </div>
        </div>
      </div>

      {/* Big Win Testimonial - Top Right */}
      <div className="hidden lg:block absolute top-32 right-4 z-30">
        <div className="bg-gradient-to-l from-green-500 to-lime-400 border-4 border-white rounded-2xl p-5 animate-pulse shadow-2xl shadow-green-500/70 transform -rotate-6 max-w-72">
          <div className="text-black text-center font-mono font-black">
            <div className="text-2xl mb-2">💰 MEGA WINNER 💰</div>
            <div className="text-lg mb-2">"I WON BIG!"</div>
            <div className="text-2xl font-black">999,999,999EC</div>
            <div className="text-sm mb-2">- TotallyRealUser420</div>
            <div className="text-xs text-green-800">*results not typical</div>
            <div className="text-xs text-green-800">**user may be fictional</div>
          </div>
        </div>
      </div>

      {/* Warning Banner - Left Side */}
      {!hiddenAds.includes('warning-banner') && (
        <div className="hidden xl:block absolute top-1/3 left-8 z-20">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 border-4 border-yellow-400 rounded-2xl p-4 animate-pulse shadow-2xl shadow-orange-500/50 transform rotate-3 max-w-64 relative">
            <button 
              onClick={() => hideAd('warning-banner')}
              className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              ×
            </button>
            <div className="text-white text-center font-mono font-black">
              <div className="text-yellow-300 font-black mb-2 text-xl">⚠️ WARNING ⚠️</div>
              <div className="mb-2 text-sm">GAMBLING MAY CAUSE:</div>
              <div className="text-xs mb-1">• Empty wallet syndrome</div>
              <div className="text-xs mb-1">• Broken dreams</div>
              <div className="text-xs mb-1">• Questioning life choices</div>
              <div className="text-xs mb-2">• Addiction to losing</div>
              <div className="text-yellow-300 text-xs">But hey, you might win!*</div>
              <div className="text-xs">*you won't</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Badge - Right Side */}
      {!hiddenAds.includes('achievement-badge') && (
        <div className="hidden xl:block absolute top-1/4 right-12 z-20">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 border-4 border-yellow-400 rounded-full p-6 animate-spin shadow-2xl shadow-purple-500/70 relative" style={{animationDuration: '10s'}}>
            <button 
              onClick={() => hideAd('achievement-badge')}
              className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              ×
            </button>
            <div className="text-white text-center font-mono font-black leading-tight">
              <div className="text-lg">🏆 WINNER 🏆</div>
              <div className="text-sm">PARTICIPATION</div>
              <div className="text-sm">TROPHY</div>
              <div className="text-yellow-300 text-xs mt-1">you tried!</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced scanning line effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Multiple colorful scanning lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-pink-400 opacity-60 animate-ping"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 opacity-60 animate-ping"></div>
        <div 
          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 via-yellow-400 to-transparent opacity-80 shadow-2xl shadow-pink-400/50"
          style={{
            animation: "scan 2s linear infinite",
            top: "0%"
          }}
        ></div>
        <div 
          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 via-green-400 to-transparent opacity-70 shadow-2xl shadow-cyan-400/50"
          style={{
            animation: "scan 3s linear infinite reverse",
            top: "100%"
          }}
        ></div>
        
        {/* Horizontal scanlines for authentic feel */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full h-px bg-white/10"
            style={{
              top: `${(i + 1) * 5}%`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Refresh will happen automatically via auth context
          console.log('Authentication successful!')
        }}
      />

      {/* Add CSS keyframes for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}