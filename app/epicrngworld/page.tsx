"use client"

import { useState, useEffect } from "react"
import { Zap, Coins, TrendingUp, Shuffle, ArrowLeft, Crown, Gem, Star, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import AuthModal from "@/components/auth/auth-modal"

export default function EpicRngWorldPage() {
  const { user, profile, loading, signOut } = useAuth()
  const [glitchText, setGlitchText] = useState("EPIC RNG WORLD")
  const [cryptoPrice, setCryptoPrice] = useState(42069.42)
  const [jackpot, setJackpot] = useState(1337420.69)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    let tickCount = 0
    
    const interval = setInterval(() => {
      tickCount++
      setCryptoPrice(prev => prev + (((tickCount * 0.7) % 2) - 1) * 100)
      setJackpot(prev => prev + ((tickCount * 0.3) % 1) * 10)
    }, 2000)

    const glitchInterval = setInterval(() => {
      tickCount++
      if ((tickCount * 0.1) % 1 < 0.1) {
        setGlitchText("3P1C RN6 W0RLD")
        setTimeout(() => setGlitchText("EPIC RNG WORLD"), 150)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(glitchInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border border-yellow-400/20 animate-pulse"
              style={{
                animationDelay: `${(i * 0.01) % 2}s`,
                animationDuration: `${2 + (i * 0.005) % 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rotate-45 animate-bounce opacity-80"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 border-2 border-yellow-400 rotate-45 animate-spin opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-2 bg-yellow-400 animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/2 w-2 h-8 bg-yellow-400 animate-pulse opacity-60"></div>
      </div>

      {/* Matrix-like falling code */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 font-mono text-xs animate-pulse"
            style={{
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              animationDelay: `${(i * 0.06) % 3}s`
            }}
          >
            {`${['$', '¥', '€', '₿', '💎', '⚡', '🔥', '💰', '🚀', '⭐'][i % 10]}${Math.floor(i * 123.456)}`}
          </div>
        ))}
      </div>

      {/* Back to Nexuz button */}
      <div className="absolute top-4 left-4 z-30">
        <a
          href="/"
          className="flex items-center space-x-2 px-4 py-2 bg-black border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-yellow-400 font-bold transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-mono">BACK TO NEXUZ</span>
        </a>
      </div>

      {/* User info / Auth */}
      <div className="absolute top-4 right-4 z-30">
        {user && profile ? (
          <div className="flex items-center gap-2">
            {/* User EpicCoins */}
            <div className="bg-black border border-yellow-400 px-4 py-2 font-mono text-yellow-400">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4" />
                <span className="text-sm">{profile.epic_coins.toLocaleString()} EC</span>
              </div>
            </div>
            
            {/* User menu */}
            <div className="bg-black border border-yellow-400 px-4 py-2 font-mono text-yellow-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{profile.username}</span>
                <button
                  onClick={signOut}
                  className="ml-2 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Crypto ticker for non-users */}
            <div className="bg-black border border-yellow-400 px-4 py-2 font-mono text-yellow-400">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">RNG: ${cryptoPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Login button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-yellow-400 text-black px-4 py-2 font-mono font-bold hover:bg-yellow-500 transition-colors border border-yellow-400"
            >
              LOGIN
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Main logo/title with glitch effect */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-yellow-400 mb-4 font-mono tracking-wider filter drop-shadow-2xl">
            <span className="inline-block animate-pulse">{glitchText}</span>
          </h1>
          <div className="h-1 w-64 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto animate-pulse"></div>
        </div>

        {/* Tagline */}
        <div className="text-yellow-300 text-xl md:text-2xl font-bold tracking-widest mb-8 text-center font-mono">
          <span className="block mb-2 animate-pulse">QUANTUM LUCK PROTOCOL</span>
          <span className="text-yellow-500 text-sm">
            {">"} PROBABILITY {"<"} AMPLIFIED {"<"}
          </span>
        </div>

        {/* Live jackpot counter */}
        <div className="bg-black border-2 border-yellow-400 p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-yellow-400/10 to-yellow-400/5 animate-pulse"></div>
          <div className="relative z-10 text-center">
            <div className="text-yellow-400 text-sm font-mono mb-2 flex items-center justify-center">
              <Crown className="w-4 h-4 mr-2" />
              MEGA JACKPOT
              <Crown className="w-4 h-4 ml-2" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-yellow-400 font-mono">
              ${jackpot.toFixed(2)}
            </div>
            <div className="text-yellow-300 text-xs font-mono mt-1">LIVE • UPDATING</div>
          </div>
        </div>

        {/* Game categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 w-full max-w-4xl">
          <div className="bg-black border border-yellow-400 p-4 hover:bg-yellow-400/10 transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <Shuffle className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:animate-spin" />
              <div className="text-yellow-400 font-mono font-bold">WHEEL</div>
              <div className="text-yellow-300 text-xs font-mono">SPIN TO WIN</div>
            </div>
          </div>
          
          <div className="bg-black border border-yellow-400 p-4 hover:bg-yellow-400/10 transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <Gem className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-yellow-400 font-mono font-bold">SLOTS</div>
              <div className="text-yellow-300 text-xs font-mono">777 JACKPOT</div>
            </div>
          </div>
          
          <div className="bg-black border border-yellow-400 p-4 hover:bg-yellow-400/10 transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:animate-bounce" />
              <div className="text-yellow-400 font-mono font-bold">DICE</div>
              <div className="text-yellow-300 text-xs font-mono">ROLL LUCKY</div>
            </div>
          </div>
          
          <div className="bg-black border border-yellow-400 p-4 hover:bg-yellow-400/10 transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:animate-pulse" />
              <div className="text-yellow-400 font-mono font-bold">CRASH</div>
              <div className="text-yellow-300 text-xs font-mono">ROCKET UP</div>
            </div>
          </div>
        </div>

        {/* Main CTA button */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 border-2 border-yellow-400 border-dashed animate-pulse"></div>
          <div className="absolute -inset-2 bg-yellow-400/20"></div>
          <button 
            onClick={() => user ? null : setShowAuthModal(true)}
            className="relative bg-black border-4 border-yellow-400 text-yellow-400 font-black text-xl px-12 py-6 hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 shadow-2xl font-mono"
          >
            <span className="flex items-center">
              <Zap className="mr-3" size={24} />
              {user ? "START GAMING" : "ENTER THE MATRIX"}
              <Zap className="ml-3" size={24} />
            </span>
          </button>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold font-mono animate-pulse">
            ⚡ {user ? "AUTHENTICATED" : "QUANTUM ENABLED"} ⚡
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold font-mono animate-pulse">
            ⚡ LUCK AMPLIFIED ⚡
          </div>
        </div>

        {/* Bottom tech info */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-yellow-400 text-sm font-mono">
          <Zap size={16} className="mr-2 animate-pulse" />
          <span>POWERED BY BLOCKCHAIN RNG</span>
          <Zap size={16} className="ml-2 animate-pulse" />
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-yellow-400 opacity-60 animate-ping"></div>
        <div 
          className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80"
          style={{
            animation: "scan 3s linear infinite",
            top: "0%"
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Refresh will happen automatically via auth context
          console.log('Authentication successful!')
        }}
      />
    </div>
  )
}