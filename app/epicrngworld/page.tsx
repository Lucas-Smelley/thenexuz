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
  const [jackpot, setJackpot] = useState<number | null>(null)
  const [isJackpotLoading, setIsJackpotLoading] = useState(true)
  const [showJackpotExplosion, setShowJackpotExplosion] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showGamesMenu, setShowGamesMenu] = useState(false)
  const [hiddenAds, setHiddenAds] = useState<string[]>([])
  const supabase = createClient()

  const hideAd = (adId: string) => {
    setHiddenAds(prev => [...prev, adId])
  }

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
        setShowJackpotExplosion(true)
        setTimeout(() => setShowJackpotExplosion(false), 1000)
      } else {
        setJackpot(100000)
        setIsJackpotLoading(false)
        setShowJackpotExplosion(true)
        setTimeout(() => setShowJackpotExplosion(false), 1000)
      }
    } catch (error) {
      console.error('Error fetching jackpot:', error)
      setJackpot(100000)
      setIsJackpotLoading(false)
      setShowJackpotExplosion(true)
      setTimeout(() => setShowJackpotExplosion(false), 1000)
    }
  }

  useEffect(() => {
    fetchJackpot()

    let tickCount = 0
    
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showUserMenu && !target.closest('[data-user-menu]')) {
        setShowUserMenu(false)
      }
      if (showGamesMenu && !target.closest('[data-games-menu]')) {
        setShowGamesMenu(false)
      }
    }

    if (showUserMenu || showGamesMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showGamesMenu])

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/40 via-cyan-500/30 to-green-500/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-transparent via-red-500/25 to-blue-500/20 animate-ping" style={{animationDuration: '4s'}}></div>
        
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
        
        <div className="absolute inset-0 bg-gradient-conic from-pink-500/30 via-cyan-500/30 via-yellow-500/30 to-green-500/30 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute inset-0 bg-gradient-conic from-purple-500/20 via-red-500/20 via-blue-500/20 to-orange-500/20 animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
      </div>

      {/* Floating Shapes */}
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

      {/* Matrix Effect */}
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

      {/* Header */}
      <header className="relative z-30 p-2 sm:p-4 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-black via-purple-900 to-black border border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-105 shadow-lg sm:shadow-xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-md sm:rounded-lg backdrop-blur-sm text-pink-400 hover:text-cyan-400"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="text-xs sm:text-sm font-mono font-black whitespace-nowrap hidden xs:inline sm:inline">NEXUZ</span>
          <span className="text-xs font-mono font-black xs:hidden sm:hidden">HOME</span>
        </a>

        {user && profile ? (
          <div className="flex items-center gap-1 sm:gap-2 flex-col sm:flex-row">
            <div className="bg-gradient-to-r from-black via-purple-900 to-black border border-2 border-green-400 px-2 sm:px-3 py-1 sm:py-2 font-mono rounded-md sm:rounded-lg shadow-lg sm:shadow-xl shadow-green-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-green-400">{profile.epic_coins.toLocaleString()}EC</span>
              </div>
            </div>
            
            <div className="relative" data-user-menu>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-gradient-to-r from-black via-purple-900 to-black border border-2 border-cyan-400 px-2 sm:px-3 py-1 sm:py-2 font-mono rounded-md sm:rounded-lg shadow-lg sm:shadow-xl shadow-cyan-400/50 backdrop-blur-sm hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-400" />
                  <span className="text-xs sm:text-sm font-black text-cyan-400 max-w-16 sm:max-w-20 md:max-w-none truncate">{profile.username}</span>
                  <ChevronDown className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-cyan-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 sm:mt-2 bg-gradient-to-r from-black via-purple-900 to-black border border-2 border-cyan-400 rounded-md sm:rounded-lg shadow-lg sm:shadow-xl shadow-cyan-400/50 backdrop-blur-sm min-w-[140px] sm:min-w-[160px] max-w-[180px] sm:max-w-[200px] z-50">
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
          <div className="flex items-center gap-1 sm:gap-2 flex-col sm:flex-row">
            <div className="bg-gradient-to-r from-black via-purple-900 via-gray-900 to-black border border-2 border-yellow-400 px-2 sm:px-3 py-1 sm:py-2 font-mono rounded-md sm:rounded-lg shadow-lg sm:shadow-xl shadow-yellow-400/50 backdrop-blur-sm hover:border-orange-400 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400/15 animate-pulse"></div>
              <div className="relative flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-yellow-400 whitespace-nowrap">RNG: {Math.floor(cryptoPrice).toLocaleString()}EC</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 sm:px-4 py-1 sm:py-2 font-mono font-black text-xs sm:text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border border-2 border-white rounded-md sm:rounded-lg shadow-lg sm:shadow-xl shadow-pink-500/50 transform hover:scale-105"
            >
              LOGIN
            </button>
          </div>
        )}
      </header>

      {/* Title Section */}
      <div className="relative z-10 text-center pt-[clamp(2rem,6vh,4rem)]">
        <h1 className="text-[clamp(2rem,min(8vw,8vh),5rem)] font-black font-mono text-yellow-400 animate-pulse leading-none" style={{
          textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.4)',
          background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradient 3s ease infinite, glow-pulse 2s ease-in-out infinite alternate'
        }}>
          EPIC RNG WORLD
        </h1>
      </div>

      {/* Mega Jackpot Section */}
      <div className="relative z-10 text-center mt-[clamp(1rem,4vh,2rem)]">
        <div className="bg-gradient-to-br from-black via-purple-900 to-black border-4 border-pink-400 p-[clamp(0.8rem,min(2vw,2vh),1.2rem)] rounded-xl shadow-2xl shadow-pink-400/70 max-w-[min(90vw,400px)] mx-auto">
          <div className="text-center">
            <div className="text-[clamp(0.8rem,min(2vw,2vh),1.2rem)] font-black font-mono mb-[clamp(0.3rem,1vh,0.6rem)] text-pink-400 flex items-center justify-center">
              <Crown className="w-[clamp(0.8rem,min(1.5vw,1.5vh),1.2rem)] h-[clamp(0.8rem,min(1.5vw,1.5vh),1.2rem)] mr-2 animate-spin" />
              MEGA JACKPOT!
              <Crown className="w-[clamp(0.8rem,min(1.5vw,1.5vh),1.2rem)] h-[clamp(0.8rem,min(1.5vw,1.5vh),1.2rem)] ml-2 animate-spin" />
            </div>
            <div className="text-[clamp(1.5rem,min(4vw,4vh),2.5rem)] font-black font-mono text-yellow-400 animate-pulse mb-[clamp(0.2rem,0.5vh,0.4rem)]">
              {isJackpotLoading ? '...' : `${jackpot?.toLocaleString()}EC`}
            </div>
            <div className="text-[clamp(0.6rem,min(1.5vw,1.5vh),0.9rem)] font-black font-mono text-cyan-400">🔥 LIVE • UPDATING 🔥</div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="relative z-10 mt-[clamp(2rem,4vh,4rem)] flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[clamp(1rem,2vh,2rem)] max-w-2xl sm:max-w-4xl md:max-w-6xl">
          
          {/* SLOTS */}
          <a href="/epicrngworld/slots" className="group bg-gradient-to-br from-black via-purple-900 to-black border-2 border-pink-400 px-[clamp(1rem,min(3vw,3vh),2.5rem)] py-[clamp(1rem,min(3vw,3vh),2.5rem)] rounded-lg shadow-xl shadow-pink-400/50 hover:border-cyan-400 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105 -rotate-2 hover:rotate-0 text-center">
            <Gem className="w-[clamp(1.5rem,min(6vw,6vh),4rem)] h-[clamp(1.5rem,min(6vw,6vh),4rem)] text-pink-400 group-hover:text-cyan-400 mx-auto mb-[clamp(0.5rem,min(2vw,2vh),1.2rem)] transition-colors" />
            <h3 className="text-pink-400 group-hover:text-cyan-400 font-mono font-black text-[clamp(0.6rem,min(2vw,2vh),1.2rem)] transition-colors">SLOTS</h3>
          </a>

          {/* DICE */}
          <a href="/epicrngworld/dice" className="group bg-gradient-to-br from-black via-purple-900 to-black border-2 border-cyan-400 px-[clamp(1rem,min(3vw,3vh),2.5rem)] py-[clamp(1rem,min(3vw,3vh),2.5rem)] rounded-lg shadow-xl shadow-cyan-400/50 hover:border-green-400 hover:shadow-green-400/50 transition-all duration-300 transform hover:scale-105 rotate-1 hover:rotate-0 text-center">
            <Coins className="w-[clamp(1.5rem,min(6vw,6vh),4rem)] h-[clamp(1.5rem,min(6vw,6vh),4rem)] text-cyan-400 group-hover:text-green-400 mx-auto mb-[clamp(0.5rem,min(2vw,2vh),1.2rem)] transition-colors" />
            <h3 className="text-cyan-400 group-hover:text-green-400 font-mono font-black text-[clamp(0.6rem,min(2vw,2vh),1.2rem)] transition-colors">DICE</h3>
          </a>

          {/* WHEEL */}
          <a href="/epicrngworld/wheel" className="group bg-gradient-to-br from-black via-purple-900 to-black border-2 border-yellow-400 px-[clamp(1rem,min(3vw,3vh),2.5rem)] py-[clamp(1rem,min(3vw,3vh),2.5rem)] rounded-lg shadow-xl shadow-yellow-400/50 hover:border-pink-400 hover:shadow-pink-400/50 transition-all duration-300 transform hover:scale-105 -rotate-1 hover:rotate-0 text-center">
            <Shuffle className="w-[clamp(1.5rem,min(6vw,6vh),4rem)] h-[clamp(1.5rem,min(6vw,6vh),4rem)] text-yellow-400 group-hover:text-pink-400 mx-auto mb-[clamp(0.5rem,min(2vw,2vh),1.2rem)] transition-colors" />
            <h3 className="text-yellow-400 group-hover:text-pink-400 font-mono font-black text-[clamp(0.6rem,min(2vw,2vh),1.2rem)] transition-colors">WHEEL</h3>
          </a>

          {/* PLINKO */}
          <a href="/epicrngworld/plinko" className="group bg-gradient-to-br from-black via-purple-900 to-black border-2 border-purple-400 px-[clamp(1rem,min(3vw,3vh),2.5rem)] py-[clamp(1rem,min(3vw,3vh),2.5rem)] rounded-lg shadow-xl shadow-purple-400/50 hover:border-fuchsia-400 hover:shadow-fuchsia-400/50 transition-all duration-300 transform hover:scale-105 rotate-2 hover:rotate-0 text-center">
            <div className="w-[clamp(1.5rem,min(6vw,6vh),4rem)] h-[clamp(1.5rem,min(6vw,6vh),4rem)] border-4 border-purple-400 group-hover:border-fuchsia-400 rounded-full mx-auto mb-[clamp(0.5rem,min(2vw,2vh),1.2rem)] transition-colors"></div>
            <h3 className="text-purple-400 group-hover:text-fuchsia-400 font-mono font-black text-[clamp(0.6rem,min(2vw,2vh),1.2rem)] transition-colors">PLINKO</h3>
          </a>

          {/* CRASH */}
          <a href="/epicrngworld/crash" className="group bg-gradient-to-br from-black via-purple-900 to-black border-2 border-green-400 px-[clamp(1rem,min(3vw,3vh),2.5rem)] py-[clamp(1rem,min(3vw,3vh),2.5rem)] rounded-lg shadow-xl shadow-green-400/50 hover:border-purple-400 hover:shadow-purple-400/50 transition-all duration-300 transform hover:scale-105 -rotate-1.5 hover:rotate-0 text-center">
            <Star className="w-[clamp(1.5rem,min(6vw,6vh),4rem)] h-[clamp(1.5rem,min(6vw,6vh),4rem)] text-green-400 group-hover:text-purple-400 mx-auto mb-[clamp(0.5rem,min(2vw,2vh),1.2rem)] transition-colors" />
            <h3 className="text-green-400 group-hover:text-purple-400 font-mono font-black text-[clamp(0.6rem,min(2vw,2vh),1.2rem)] transition-colors">CRASH</h3>
          </a>

        </div>
      </div>

      {/* My Gorbz Button */}
      <div className="relative z-10 mt-[clamp(2rem,4vh,3rem)] flex justify-center pb-8">
        <a
          href={user ? "/deathbooty" : "#"}
          onClick={!user ? (e) => { e.preventDefault(); setShowAuthModal(true); } : undefined}
          className="group bg-gradient-to-br from-black via-gray-900 to-black border-2 border-orange-400 px-[clamp(3rem,min(8vw,6vh),5rem)] py-[clamp(1.5rem,min(3vw,3vh),2.5rem)] rounded-lg shadow-xl shadow-orange-400/50 hover:border-yellow-400 hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 text-center"
        >
          <h3 className="text-orange-400 group-hover:text-yellow-400 font-mono font-black text-[clamp(1rem,min(3vw,2vh),1.5rem)] transition-colors">
            {user ? "MY GORBZ" : "SIGN UP"}
          </h3>
        </a>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          console.log('Authentication successful!')
        }}
      />

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
        @keyframes glow-pulse {
          0% { 
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.4);
          }
          100% { 
            text-shadow: 0 0 30px rgba(251, 191, 36, 1), 0 0 60px rgba(251, 191, 36, 0.8), 0 0 90px rgba(251, 191, 36, 0.6);
          }
        }
      `}</style>
    </div>
  )
}