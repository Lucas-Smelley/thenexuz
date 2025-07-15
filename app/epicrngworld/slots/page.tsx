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

        {/* Main content - CASINO FLOOR LAYOUT */}
        <div className={`relative min-h-screen transition-all duration-1000 ${
          (isSpinning || showCelebration) ? 'z-30' : 'z-20'
        }`}>
          
          {/* Top Bar with Title and Neon Signs */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/90 to-transparent z-10">
            <div className="flex justify-between items-center p-4 h-full">
              {/* Left Neon Sign */}
              <div className="hidden lg:block bg-black border-4 border-pink-400 rounded-lg p-3 animate-pulse">
                <div className="text-pink-400 font-black text-xl font-mono">🎰 JACKPOT 🎰</div>
                <div className="text-pink-300 text-sm font-mono">WIN BIG!</div>
              </div>
              
              {/* Center Title */}
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-mono tracking-wider text-purple-400 drop-shadow-2xl animate-pulse"
                  style={{
                    textShadow: '0 0 20px rgba(168, 85, 247, 1), 0 0 40px rgba(168, 85, 247, 0.6)'
                  }}>
                CASINO SLOTS
              </h1>
              
              {/* Right Neon Sign */}
              <div className="hidden lg:block bg-black border-4 border-cyan-400 rounded-lg p-3 animate-pulse">
                <div className="text-cyan-400 font-black text-xl font-mono">💎 777 💎</div>
                <div className="text-cyan-300 text-sm font-mono">LUCKY!</div>
              </div>
            </div>
          </div>

          {/* Casino Floor Layout */}
          <div className="pt-32 pb-8 px-4 min-h-screen flex items-center justify-center">
            <div className="max-w-6xl w-full">
              
              {/* Main Slot Machine - Vegas Style */}
              <div className="relative mx-auto max-w-3xl">
                {/* Slot Machine Cabinet */}
                <div className="bg-gradient-to-b from-red-600 via-red-800 to-black border-8 border-yellow-400 rounded-t-3xl rounded-b-lg shadow-2xl shadow-red-500/50 relative overflow-hidden">
                  
                  {/* Top Casino Header */}
                  <div className="bg-gradient-to-r from-yellow-400 to-gold-500 h-16 flex items-center justify-center border-b-4 border-red-800">
                    <div className="text-black font-black text-2xl font-mono tracking-wider">⭐ EPIC SLOTS ⭐</div>
                  </div>
                  
                  {/* Screen Area */}
                  <div className="bg-black/90 m-6 rounded-xl border-4 border-cyan-400 p-6 relative">
                    {/* Decorative Lights */}
                    <div className="absolute -top-2 left-0 right-0 flex justify-around">
                      {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full animate-pulse ${
                          i % 2 === 0 ? 'bg-yellow-400' : 'bg-pink-400'
                        }`} style={{animationDelay: `${i * 0.2}s`}} />
                      ))}
                    </div>
                    
                    {/* Reels Display */}
                    <div className="flex justify-center items-center space-x-4 py-8">
                      {reels.map((reelIndex, i) => (
                        <div key={i} className="relative">
                          {/* Vegas-style Reel */}
                          <div className="bg-white border-4 border-gray-800 rounded-lg w-24 h-32 sm:w-32 sm:h-40 flex items-center justify-center relative overflow-hidden">
                            {/* Reel Strip Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent transition-all duration-300 ${
                              isSpinning ? 'animate-pulse opacity-50' : 'opacity-0'
                            }`} />
                            
                            <div className={`text-4xl sm:text-6xl text-center transition-all duration-300 z-10 ${
                              isSpinning ? 'blur-sm scale-110' : 'blur-0 scale-100'
                            } ${slotSymbols[reelIndex].color}`}>
                              {slotSymbols[reelIndex].symbol}
                            </div>
                          </div>
                          
                          {/* Reel Label */}
                          <div className="text-center mt-2">
                            <div className="text-yellow-400 font-mono text-xs font-bold">REEL {i + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Result Display */}
                    {!isSpinning && (
                      <div className="text-center text-purple-400 font-mono text-lg font-bold">
                        {reels.map((reelIndex, i) => slotSymbols[reelIndex].name).join(' • ')}
                      </div>
                    )}
                  </div>
                  
                  {/* Control Panel */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-b-lg border-t-4 border-yellow-400">
                    <div className="flex justify-center">
                      <button
                        onClick={spinSlots}
                        disabled={isSpinning || (!user || (profile && profile.epic_coins < SPIN_COST))}
                        className={`px-12 py-6 text-3xl font-black font-mono rounded-full border-4 transition-all duration-300 transform shadow-2xl ${
                          isSpinning
                            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                            : (!user || (profile && profile.epic_coins < SPIN_COST))
                            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 border-yellow-400 text-yellow-100 hover:scale-110 hover:shadow-yellow-400/50 animate-pulse'
                        }`}
                      >
                        {isSpinning ? '🎰 SPINNING' : '🎯 SPIN'}
                      </button>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="text-yellow-400 font-mono font-bold">
                        {!user ? 'LOGIN TO PLAY' : 
                         profile && profile.epic_coins < SPIN_COST ? 'INSUFFICIENT FUNDS' : 
                         `COST: ${SPIN_COST} EC`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Side Panels - Casino Style */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                
                {/* Left Panel - Paytable */}
                <div className="bg-gradient-to-br from-green-800 to-green-900 border-4 border-green-400 rounded-2xl p-6 shadow-2xl shadow-green-400/30">
                  <div className="text-center mb-6">
                    <div className="bg-black border-2 border-green-400 rounded-lg p-3 inline-block">
                      <h3 className="text-green-400 font-black text-2xl font-mono">💰 PAYTABLE 💰</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {slotSymbols.map((symbol, index) => (
                      <div key={index} className="bg-black/60 border-2 border-green-500/50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`text-3xl ${symbol.color}`}>{symbol.symbol}</span>
                          <span className="text-green-300 font-mono font-bold">{symbol.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-black font-mono">3x: {symbol.value * 3}EC</div>
                          <div className="text-yellow-300 font-mono text-sm">2x: {symbol.value}EC</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right Panel - Casino Info */}
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 border-4 border-blue-400 rounded-2xl p-6 shadow-2xl shadow-blue-400/30">
                  <div className="text-center mb-6">
                    <div className="bg-black border-2 border-blue-400 rounded-lg p-3 inline-block">
                      <h3 className="text-blue-400 font-black text-2xl font-mono">🎰 HOW TO PLAY</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-blue-200">
                    <div className="bg-black/60 border border-blue-500/50 rounded-lg p-4">
                      <div className="text-yellow-400 font-bold font-mono mb-2">🎯 MATCHING SYMBOLS</div>
                      <div className="text-sm font-mono">Get 2 or 3 matching symbols to win!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-blue-500/50 rounded-lg p-4">
                      <div className="text-yellow-400 font-bold font-mono mb-2">💎 TRIPLE MATCH</div>
                      <div className="text-sm font-mono">3 matching symbols = 3x payout!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-blue-500/50 rounded-lg p-4">
                      <div className="text-yellow-400 font-bold font-mono mb-2">🚀 RARE SYMBOLS</div>
                      <div className="text-sm font-mono">Higher value symbols are rarer but pay more!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-blue-500/50 rounded-lg p-4">
                      <div className="text-yellow-400 font-bold font-mono mb-2">💰 SPIN COST</div>
                      <div className="text-sm font-mono">Each spin costs {SPIN_COST} Epic Coins</div>
                    </div>
                  </div>
                </div>
              </div>
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