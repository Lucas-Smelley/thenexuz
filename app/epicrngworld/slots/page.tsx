"use client"

import { useState } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

const slotSymbols = [
  { symbol: "🍒", name: "Cherry", value: 50, color: "text-red-400" },
  { symbol: "🍋", name: "Lemon", value: 30, color: "text-yellow-400" },
  { symbol: "🍊", name: "Orange", value: 40, color: "text-orange-400" },
  { symbol: "🍇", name: "Grape", value: 60, color: "text-purple-400" },
  { symbol: "🔔", name: "Bell", value: 100, color: "text-yellow-300" },
  { symbol: "💎", name: "Diamond", value: 200, color: "text-cyan-400" },
  { symbol: "7️⃣", name: "Seven", value: 500, color: "text-red-300" },
  { symbol: "💰", name: "Money", value: 1000, color: "text-green-400" }
]

export default function SlotsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [reels, setReels] = useState([0, 0, 0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const supabase = createClient()

  const SPIN_COST = 100

  const getRandomSymbol = () => Math.floor(Math.random() * slotSymbols.length)

  const calculateWin = (reel1: number, reel2: number, reel3: number) => {
    // Three of a kind
    if (reel1 === reel2 && reel2 === reel3) {
      return slotSymbols[reel1].value * 3
    }
    // Two of a kind
    if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      const matchingSymbol = reel1 === reel2 ? reel1 : reel2 === reel3 ? reel2 : reel1
      return slotSymbols[matchingSymbol].value
    }
    // No match
    return 0
  }

  const spinSlots = async () => {
    if (isSpinning) return

    // Check if user is logged in and has enough coins
    if (!user || !profile) {
      alert('Please log in to play slots!')
      return
    }

    if (profile.epic_coins < SPIN_COST) {
      alert(`Not enough Epic Coins! You need ${SPIN_COST} EC to spin.`)
      return
    }

    // Deduct coins before spinning
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ epic_coins: profile.epic_coins - SPIN_COST })
        .eq('id', user.id)
        .select()

      if (error) {
        alert(`Error processing payment: ${error.message}. Please try again.`)
        return
      }
      
      await refreshProfile()
    } catch (error) {
      alert(`Error processing payment: ${error}. Please try again.`)
      return
    }

    setIsSpinning(true)
    setShowCelebration(false)
    setWinAmount(0)

    // Animate spinning for 3 seconds
    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()])
    }, 100)

    setTimeout(async () => {
      clearInterval(spinInterval)
      
      // Final result
      const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      setReels(finalReels)
      setIsSpinning(false)

      // Calculate winnings
      const winnings = calculateWin(finalReels[0], finalReels[1], finalReels[2])
      setWinAmount(winnings)

      if (winnings > 0) {
        setShowCelebration(true)
        
        // Award winnings
        try {
          const { data: currentProfile } = await supabase
            .from('users')
            .select('epic_coins')
            .eq('id', user.id)
            .single()

          if (currentProfile) {
            const { error } = await supabase
              .from('users')
              .update({ epic_coins: currentProfile.epic_coins + winnings })
              .eq('id', user.id)

            if (!error) {
              await refreshProfile()
            }
          }
        } catch (error) {
          console.error('Error processing winnings:', error)
        }
      }
    }, 3000)
  }

  const hideCelebration = () => {
    setShowCelebration(false)
    setWinAmount(0)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black via-purple-950 to-pink-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/30 via-pink-500/20 to-yellow-500/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-green-400/15 via-transparent via-blue-500/20 to-purple-500/15 animate-ping" style={{animationDuration: '6s'}}></div>
          
          {/* Slot-themed grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div
                  key={i}
                  className={`border ${
                    i % 8 === 0 ? 'border-cyan-400/40 bg-cyan-500/5' :
                    i % 8 === 1 ? 'border-purple-400/40 bg-purple-500/5' :
                    i % 8 === 2 ? 'border-pink-400/40 bg-pink-500/5' :
                    i % 8 === 3 ? 'border-yellow-400/40 bg-yellow-500/5' :
                    i % 8 === 4 ? 'border-green-400/40 bg-green-500/5' :
                    i % 8 === 5 ? 'border-red-400/40 bg-red-500/5' :
                    i % 8 === 6 ? 'border-blue-400/40 bg-blue-500/5' :
                    'border-indigo-400/40 bg-indigo-500/5'
                  } animate-pulse`}
                  style={{
                    animationDelay: `${(i * 0.02) % 3}s`,
                    animationDuration: `${3 + (i * 0.01) % 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-conic from-cyan-500/20 via-purple-500/20 via-pink-500/20 to-yellow-500/20 animate-spin" style={{animationDuration: '25s'}}></div>
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4 z-30">
          <a
            href="/epicrngworld"
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-black/80 border-2 border-cyan-400 hover:border-purple-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-cyan-400/50 hover:shadow-purple-400/50 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-xs sm:text-sm font-mono font-black text-cyan-400 whitespace-nowrap">BACK TO RNG WORLD</span>
          </a>
        </div>

        {/* User info / Epic Coins */}
        <div className="absolute top-4 right-4 z-30">
          {user && profile ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              {/* Epic Coins Display */}
              <div className="bg-black/80 border-2 border-green-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-green-400/50 backdrop-blur-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black text-green-400 whitespace-nowrap">{profile.epic_coins.toLocaleString()}EC</span>
                </div>
              </div>
              
              {/* User Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-black/80 border-2 border-purple-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-purple-400/50 backdrop-blur-sm hover:border-pink-400 transition-colors"
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <span className="text-xs sm:text-sm font-black text-purple-400 max-w-20 sm:max-w-none truncate">{profile.username}</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-purple-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-black/90 border-2 border-purple-400 rounded-lg shadow-2xl shadow-purple-400/50 backdrop-blur-sm min-w-[160px] max-w-[200px] z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-purple-400/30">
                        <div className="text-xs text-purple-300 font-mono">Signed in as</div>
                        <div className="text-sm font-black text-purple-400 font-mono truncate">{profile.username}</div>
                        <div className="text-xs text-purple-300 font-mono truncate">{user.email}</div>
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
            <div className="bg-black/80 border-2 border-pink-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-pink-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-black text-pink-400 whitespace-nowrap">🎰 SLOTS! 🎰</span>
              </div>
            </div>
          )}
        </div>

        {/* Background blur overlay when spinning or celebrating */}
        {(isSpinning || showCelebration) && (
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-md z-10 transition-all duration-1000" 
            onClick={showCelebration && !isSpinning ? hideCelebration : undefined}
          />
        )}

        {/* Main content */}
        <div className={`relative min-h-screen flex flex-col justify-center items-center px-4 transition-all duration-1000 ${
          (isSpinning || showCelebration) ? 'z-30' : 'z-20'
        }`}>
          
          {/* Title */}
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-2 sm:mb-4 font-mono tracking-wider text-purple-400 drop-shadow-2xl animate-pulse whitespace-nowrap"
                style={{
                  textShadow: '0 0 20px rgba(168, 85, 247, 1), 0 0 40px rgba(168, 85, 247, 0.6)'
                }}>
              SLUPER EPIC SLOTS
            </h1>
            <div className="h-1 sm:h-2 w-32 sm:w-64 bg-gradient-to-r from-cyan-500 via-purple-400 via-pink-400 to-yellow-500 mx-auto animate-pulse rounded-full shadow-2xl"></div>
          </div>

          {/* Slot Machine */}
          <div className="bg-black/80 border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-yellow-400/50 backdrop-blur-sm mb-6 sm:mb-8">
            {/* Slot Machine Display */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-cyan-400 rounded-2xl p-4 sm:p-6 mb-6">
              <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                {reels.map((reelIndex, i) => (
                  <div key={i} className="relative">
                    {/* Reel Frame */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-400 rounded-xl p-4 sm:p-6 shadow-inner">
                      <div className={`text-4xl sm:text-6xl md:text-8xl text-center transition-all duration-300 ${
                        isSpinning ? 'blur-sm animate-spin' : 'blur-0'
                      } ${slotSymbols[reelIndex].color}`}>
                        {slotSymbols[reelIndex].symbol}
                      </div>
                    </div>
                    
                    {/* Reel glow effect */}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                      isSpinning ? 'bg-purple-400/20 animate-pulse' : 'bg-transparent'
                    }`} />
                  </div>
                ))}
              </div>
              
              {/* Symbol names */}
              {!isSpinning && (
                <div className="flex justify-center items-center space-x-2 sm:space-x-4 mt-4">
                  {reels.map((reelIndex, i) => (
                    <div key={i} className="text-xs sm:text-sm text-gray-400 font-mono text-center">
                      {slotSymbols[reelIndex].name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Spin Button */}
            <button
              onClick={spinSlots}
              disabled={isSpinning || (!user || (profile && profile.epic_coins < SPIN_COST))}
              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black font-mono rounded-xl transition-all duration-300 transform ${
                isSpinning
                  ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                  : (!user || (profile && profile.epic_coins < SPIN_COST))
                  ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 border-2 sm:border-4 border-yellow-400 text-white hover:scale-105 hover:shadow-2xl shadow-purple-500/50'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="whitespace-nowrap">
                  {isSpinning ? '🎰 SPINNING 🎰' : '💰 SPIN 💰'}
                </span>
                {!isSpinning && (
                  <span className="text-xs text-yellow-200 font-bold whitespace-nowrap">
                    {!user ? 'LOGIN REQUIRED' : 
                     profile && profile.epic_coins < SPIN_COST ? 'INSUFFICIENT FUNDS' : 
                     `${SPIN_COST} EC`}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Paytable */}
          <div className="bg-black/60 border-2 border-cyan-400 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <h3 className="text-lg sm:text-xl font-black font-mono text-cyan-400 mb-4 text-center">PAYTABLE</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {slotSymbols.map((symbol, index) => (
                <div key={index} className="flex items-center justify-between bg-black/40 border border-gray-600 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg sm:text-2xl ${symbol.color}`}>{symbol.symbol}</span>
                    <span className="text-xs sm:text-sm text-gray-300 font-mono">{symbol.name}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-yellow-400 font-mono">
                    {symbol.value}EC (3x) / {symbol.value}EC (2x)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Celebration Display */}
        {showCelebration && winAmount > 0 && (
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto px-4" onClick={hideCelebration}>
            {/* Fireworks Effect */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                >
                  <div className={`w-4 h-4 rounded-full ${
                    i % 4 === 0 ? 'bg-purple-400' :
                    i % 4 === 1 ? 'bg-pink-400' :
                    i % 4 === 2 ? 'bg-cyan-400' : 'bg-yellow-400'
                  } shadow-2xl`} />
                </div>
              ))}
            </div>

            {/* Main Celebration Text */}
            <div className="text-center animate-bounce max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-mono text-purple-400 mb-2 sm:mb-4 animate-pulse whitespace-nowrap"
                    style={{
                      textShadow: '0 0 30px rgba(168, 85, 247, 1), 0 0 60px rgba(168, 85, 247, 0.8)'
                    }}>
                  🎰 JACKPOT! 🎰
                </h2>
                <div className="text-4xl sm:text-6xl md:text-8xl font-black font-mono mb-2 sm:mb-4 animate-pulse bg-black/95 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white whitespace-nowrap"
                     style={{
                       color: '#FFFFFF',
                       textShadow: '0 0 40px #10B981, 0 0 80px #10B981, 0 0 10px #000000'
                     }}>
                  +{winAmount.toLocaleString()} EC
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white animate-pulse whitespace-nowrap">
                  💰 BIG WIN! 💰
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating slot symbols */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`absolute font-mono text-lg font-bold animate-pulse ${
                i % 8 === 0 ? 'text-red-400' :
                i % 8 === 1 ? 'text-yellow-400' :
                i % 8 === 2 ? 'text-orange-400' :
                i % 8 === 3 ? 'text-purple-400' :
                i % 8 === 4 ? 'text-cyan-400' :
                i % 8 === 5 ? 'text-green-400' :
                i % 8 === 6 ? 'text-pink-400' : 'text-blue-400'
              }`}
              style={{
                left: `${(i * 11.3) % 100}%`,
                top: `${(i * 17.7) % 100}%`,
                animationDelay: `${(i * 0.2) % 5}s`,
                textShadow: '0 0 10px currentColor'
              }}
            >
              {slotSymbols[i % slotSymbols.length].symbol}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}