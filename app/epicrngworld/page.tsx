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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 relative overflow-hidden">
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
      <div className="absolute top-4 left-4 z-30">
        <a
          href="/"
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-black via-purple-900 to-black border-3 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-lg backdrop-blur-sm"
          style={{
            background: 'linear-gradient(45deg, #ec4899, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 20px #ec4899'
          }}
        >
          <ArrowLeft className="w-5 h-5 text-pink-400" />
          <span className="text-base font-mono font-black">BACK TO NEXUZ</span>
        </a>
      </div>

      {/* User info / Auth */}
      <div className="absolute top-4 right-4 z-30">
        {user && profile ? (
          <div className="flex items-center gap-3">
            {/* User EpicCoins */}
            <div className="bg-gradient-to-r from-black via-purple-900 to-black border-3 border-green-400 px-6 py-3 font-mono rounded-lg shadow-2xl shadow-green-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-base font-black text-green-400">{profile.epic_coins.toLocaleString()} EC</span>
              </div>
            </div>
            
            {/* User menu */}
            <div className="bg-gradient-to-r from-black via-purple-900 to-black border-3 border-cyan-400 px-6 py-3 font-mono rounded-lg shadow-2xl shadow-cyan-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-cyan-400" />
                <span className="text-base font-black text-cyan-400">{profile.username}</span>
                <button
                  onClick={signOut}
                  className="ml-3 hover:text-red-400 transition-colors transform hover:scale-110"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Crypto ticker for non-users */}
            <div className="bg-gradient-to-r from-black via-purple-900 to-black border-3 border-yellow-400 px-6 py-3 font-mono rounded-lg shadow-2xl shadow-yellow-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-base font-black text-yellow-400">RNG: ${cryptoPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Login button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 font-mono font-black text-base hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border-3 border-white rounded-lg shadow-2xl shadow-pink-500/50 transform hover:scale-110"
            >
              LOGIN
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Main logo/title with rainbow glitch effect */}
        <div className="text-center mb-12 px-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-30">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-pink-400 mb-4 font-mono tracking-wider">
                <span className="inline-block">{glitchText}</span>
              </h1>
            </div>
            <h1 className="relative text-4xl sm:text-6xl md:text-8xl font-black mb-4 font-mono tracking-wider transform hover:scale-105 transition-transform duration-300 text-yellow-400 drop-shadow-2xl"
                style={{
                  filter: 'blur(0.5px)',
                  textShadow: '0 0 8px rgba(255, 255, 0, 0.8), 0 0 16px rgba(255, 255, 0, 0.4)'
                }}>
              <span className="inline-block animate-pulse">{glitchText}</span>
            </h1>
          </div>
          <div className="h-2 w-48 sm:w-64 md:w-80 bg-gradient-to-r from-pink-500 via-cyan-400 via-yellow-400 via-green-400 to-purple-500 mx-auto animate-pulse rounded-full shadow-2xl shadow-pink-400/50"></div>
          <div className="h-1 w-32 sm:w-48 md:w-64 bg-gradient-to-r from-purple-500 via-red-400 to-orange-400 mx-auto animate-pulse rounded-full mt-2 shadow-xl shadow-purple-400/50"></div>
        </div>

        {/* Colorful tagline */}
        <div className="text-center mb-12 px-4">
          <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-widest mb-4 font-mono transform hover:scale-105 transition-transform"
               style={{
                 background: 'linear-gradient(90deg, #10b981, #06b6d4, #ec4899, #f59e0b)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 textShadow: '0 0 20px #10b981, 0 0 40px #06b6d4'
               }}>
            <span className="block mb-2 animate-pulse">QUANTUM LUCK PROTOCOL</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black font-mono"
               style={{
                 background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 textShadow: '0 0 15px #f59e0b'
               }}>
            {">>>"} PROBABILITY AMPLIFIED {"<<<"}
          </div>
        </div>

        {/* INSANE game categories - Mobile-Optimized Arc layout */}
        <div className="relative w-full max-w-6xl mx-auto mb-8 px-4" style={{height: 'clamp(350px, 55vw, 450px)'}}>
          {/* WHEEL - Left */}
          <div className="absolute cursor-pointer group" 
               style={{
                 top: 'clamp(250px, 42vw, 280px)', 
                 left: 'clamp(1%, 5vw, 8%)', 
                 width: 'clamp(100px, 18vw, 160px)', 
                 transform: 'rotate(clamp(-45deg, -35deg, -30deg))', 
                 zIndex: 15
               }}>
            <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/40 to-pink-400/40 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 border-yellow-400 p-3 sm:p-5 rounded-full hover:border-pink-400 transition-colors shadow-2xl shadow-yellow-400/60 group-hover:shadow-pink-400/60 overflow-hidden transform hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-yellow-400/15 rounded-full group-hover:bg-pink-400/15 transition-colors"></div>
              <div className="relative text-center">
                <Shuffle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto mb-1 sm:mb-2 group-hover:animate-spin group-hover:text-pink-400 transition-colors drop-shadow-xl" />
                <div className="text-yellow-400 font-mono font-black text-sm sm:text-base group-hover:text-pink-400 transition-colors mb-1">WHEEL</div>
                <div className="text-yellow-300 text-xs font-mono font-bold group-hover:text-pink-300 transition-colors hidden sm:block">💥 SPIN 💥</div>
              </div>
            </div>
          </div>
          
          {/* SLOTS - Top Left */}
          <div className="absolute cursor-pointer group" 
               style={{
                 top: 'clamp(5px, 1vw, 20px)', 
                 left: 'clamp(2%, 12vw, 20%)', 
                 width: 'clamp(110px, 20vw, 170px)', 
                 transform: 'rotate(clamp(-25deg, -20deg, -15deg))', 
                 zIndex: 15
               }}>
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-pink-400/40 to-cyan-400/40 rounded-3xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 border-pink-400 p-4 sm:p-6 rounded-3xl hover:border-cyan-400 transition-colors shadow-2xl shadow-pink-400/60 group-hover:shadow-cyan-400/60 overflow-hidden transform hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-pink-400/15 rounded-3xl group-hover:bg-cyan-400/15 transition-colors"></div>
              <div className="relative text-center">
                <Gem className="w-9 h-9 sm:w-11 sm:h-11 text-pink-400 mx-auto mb-1 sm:mb-2 group-hover:animate-pulse group-hover:text-cyan-400 transition-colors drop-shadow-xl" />
                <div className="text-pink-400 font-mono font-black text-sm sm:text-base group-hover:text-cyan-400 transition-colors mb-1">SLOTS</div>
                <div className="text-pink-300 text-xs font-mono font-bold group-hover:text-cyan-300 transition-colors hidden sm:block">💎 777 💎</div>
              </div>
            </div>
          </div>
          
          {/* DICE - Top Right */}
          <div className="absolute cursor-pointer group" 
               style={{
                 top: 'clamp(5px, 1vw, 20px)', 
                 right: 'clamp(2%, 12vw, 20%)', 
                 width: 'clamp(110px, 20vw, 170px)', 
                 transform: 'rotate(clamp(15deg, 20deg, 25deg))', 
                 zIndex: 15
               }}>
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-cyan-400/40 to-green-400/40 rounded-3xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 border-cyan-400 p-4 sm:p-6 rounded-3xl hover:border-green-400 transition-colors shadow-2xl shadow-cyan-400/60 group-hover:shadow-green-400/60 overflow-hidden transform hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-cyan-400/15 rounded-3xl group-hover:bg-green-400/15 transition-colors"></div>
              <div className="relative text-center">
                <Coins className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-400 mx-auto mb-1 sm:mb-2 group-hover:animate-bounce group-hover:text-green-400 transition-colors drop-shadow-xl" />
                <div className="text-cyan-400 font-mono font-black text-sm sm:text-base group-hover:text-green-400 transition-colors mb-1">DICE</div>
                <div className="text-cyan-300 text-xs font-mono font-bold group-hover:text-green-300 transition-colors hidden sm:block">🎲 ROLL 🎲</div>
              </div>
            </div>
          </div>
          
          {/* CRASH - Right */}
          <div className="absolute cursor-pointer group" 
               style={{
                 top: 'clamp(250px, 42vw, 280px)', 
                 right: 'clamp(1%, 5vw, 8%)', 
                 width: 'clamp(100px, 18vw, 160px)', 
                 transform: 'rotate(clamp(30deg, 35deg, 45deg))', 
                 zIndex: 15
               }}>
            <div className="absolute -inset-3 bg-gradient-to-r from-green-400/40 to-purple-400/40 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 border-green-400 p-3 sm:p-5 rounded-full hover:border-purple-400 transition-colors shadow-2xl shadow-green-400/60 group-hover:shadow-purple-400/60 overflow-hidden transform hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-green-400/15 rounded-full group-hover:bg-purple-400/15 transition-colors"></div>
              <div className="relative text-center">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 mx-auto mb-1 sm:mb-2 group-hover:animate-pulse group-hover:text-purple-400 transition-colors drop-shadow-xl" />
                <div className="text-green-400 font-mono font-black text-sm sm:text-base group-hover:text-purple-400 transition-colors mb-1">CRASH</div>
                <div className="text-green-300 text-xs font-mono font-bold group-hover:text-purple-300 transition-colors hidden sm:block">🚀 UP 🚀</div>
              </div>
            </div>
          </div>
          
          {/* SPECTACULAR live jackpot counter - INSIDE the mobile-optimized arc */}
          <div className="absolute left-1/2 transform -translate-x-1/2 px-2 sm:px-4 max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto z-10" 
               style={{top: 'clamp(110px, 20vw, 128px)'}}>
            <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-r from-pink-500/40 via-yellow-400/50 via-cyan-500/40 to-green-500/40 rounded-3xl animate-pulse"></div>
            <div className="absolute -inset-1 sm:-inset-3 border-2 sm:border-4 border-yellow-400 border-dashed rounded-3xl animate-ping"></div>
            <div className="relative bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-3 sm:border-6 border-pink-400 p-3 sm:p-6 lg:p-10 rounded-3xl overflow-hidden shadow-2xl shadow-pink-400/70">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/30 to-cyan-400/20 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-green-500/20 animate-ping"></div>
              
              <div className="relative z-10 text-center">
                <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black font-mono mb-2 sm:mb-4 flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
                       backgroundSize: '200% 200%',
                       backgroundClip: 'text',
                       WebkitBackgroundClip: 'text',
                       color: 'transparent',
                       animation: 'rainbow 3s ease-in-out infinite',
                       textShadow: '0 0 30px #f59e0b, 0 0 60px #ec4899'
                     }}>
                  <Crown className="w-3 h-3 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-1 sm:mr-3 text-yellow-400 animate-spin" style={{animationDuration: '8s'}} />
                  <span className="hidden sm:inline">MEGA JACKPOT</span>
                  <span className="sm:hidden text-sm">JACKPOT</span>
                  <Crown className="w-3 h-3 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ml-1 sm:ml-3 text-yellow-400 animate-spin" style={{animationDuration: '8s'}} />
                </div>
                <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-mono animate-pulse text-yellow-400 drop-shadow-2xl">
                  ${jackpot.toFixed(2)}
                </div>
                <div className="text-xs sm:text-lg lg:text-xl font-black font-mono mt-1 sm:mt-3 animate-bounce"
                     style={{
                       background: 'linear-gradient(45deg, #06b6d4, #10b981, #f59e0b)',
                       backgroundClip: 'text',
                       WebkitBackgroundClip: 'text',
                       color: 'transparent',
                       textShadow: '0 0 20px #06b6d4'
                     }}>
                  <span className="hidden sm:inline">🔥🔴 LIVE • UPDATING • EXPLODING 🔴🔥</span>
                  <span className="sm:hidden">🔥 LIVE 🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* EXPLOSIVE CTA button */}
        <div className="relative mb-16 px-4">
          <div className="absolute -inset-8 border-4 border-yellow-400 border-dashed animate-pulse rounded-3xl opacity-60"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-yellow-400/40 via-cyan-500/30 to-green-500/30 rounded-3xl animate-ping"></div>
          
          <button 
            onClick={() => user ? null : setShowAuthModal(true)}
            className="relative bg-gradient-to-r from-black via-purple-900 via-gray-900 to-black border-6 text-2xl sm:text-3xl md:text-4xl px-12 sm:px-16 md:px-20 py-6 sm:py-8 md:py-10 font-black font-mono transition-all duration-300 transform hover:scale-110 shadow-2xl rounded-2xl overflow-hidden"
            style={{
              borderImage: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981, #8b5cf6) 1',
              background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
              boxShadow: '0 0 40px rgba(245, 158, 11, 0.5), 0 0 80px rgba(236, 72, 153, 0.3)'
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
              <Zap className="mr-4 sm:mr-6 text-yellow-400 w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
              <span className="whitespace-nowrap font-black">{user ? "💥🎆 START GAMING 🎆💥" : "💥🎆 ENTER THE MATRIX 🎆💥"}</span>
              <Zap className="ml-4 sm:ml-6 text-yellow-400 w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
            </span>
          </button>
          
          <div className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-black font-mono animate-bounce"
               style={{
                 background: 'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 textShadow: '0 0 20px #f59e0b'
               }}>
            ⚡🎆 {user ? "🔓 AUTHENTICATED LEGEND" : "🌟 QUANTUM ENABLED WARRIOR"} 🎆⚡
          </div>
          
          <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-black font-mono animate-bounce" style={{animationDelay: '0.5s',
                 background: 'linear-gradient(45deg, #06b6d4, #10b981, #f59e0b)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent',
                 textShadow: '0 0 20px #06b6d4'
               }}>
            ⚡🚀 LUCK AMPLIFIED TO THE MAX 🚀⚡
          </div>
        </div>

        {/* Bottom tech info */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-lg sm:text-xl font-black font-mono px-4"
             style={{
               background: 'linear-gradient(45deg, #f59e0b, #06b6d4, #10b981)',
               backgroundClip: 'text',
               WebkitBackgroundClip: 'text',
               color: 'transparent',
               textShadow: '0 0 20px #f59e0b'
             }}>
          <Zap className="mr-2 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          <span className="whitespace-nowrap">🔥 POWERED BY BLOCKCHAIN RNG 🔥</span>
          <Zap className="ml-2 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
        </div>
      </div>

      {/* Enhanced scanning line effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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