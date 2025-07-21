"use client"

import { useState } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

const diceOutcomes = [
  { number: 1, emoji: "⚀", multiplier: 6, color: "text-red-400" },
  { number: 2, emoji: "⚁", multiplier: 3, color: "text-orange-400" },
  { number: 3, emoji: "⚂", multiplier: 2, color: "text-yellow-400" },
  { number: 4, emoji: "⚃", multiplier: 1.5, color: "text-green-400" },
  { number: 5, emoji: "⚄", multiplier: 1.2, color: "text-blue-400" },
  { number: 6, emoji: "⚅", multiplier: 0, color: "text-purple-400" }
]

export default function DicePage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [dice1, setDice1] = useState(1)
  const [dice2, setDice2] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const [betAmount, setBetAmount] = useState(50)
  const [customBetAmount, setCustomBetAmount] = useState('')
  const [useCustomBet, setUseCustomBet] = useState(false)
  const [prediction, setPrediction] = useState<'over' | 'under' | 'exact'>('over')
  const [targetNumber, setTargetNumber] = useState(7)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const supabase = createClient()

  const getRandomDice = () => Math.floor(Math.random() * 6) + 1

  const calculateWin = (d1: number, d2: number, bet: number, pred: 'over' | 'under' | 'exact', target: number) => {
    const total = d1 + d2
    let won = false
    let multiplier = 0

    if (pred === 'over' && total > target) {
      won = true
      multiplier = target <= 6 ? 1.5 : target <= 8 ? 2 : 3
    } else if (pred === 'under' && total < target) {
      won = true
      multiplier = target >= 8 ? 1.5 : target >= 6 ? 2 : 3
    } else if (pred === 'exact' && total === target) {
      won = true
      multiplier = target === 7 ? 5 : target === 6 || target === 8 ? 6 : target === 5 || target === 9 ? 8 : 10
    }

    return won ? Math.floor(bet * multiplier) : 0
  }

  const getCurrentBetAmount = () => {
    if (useCustomBet) {
      const customAmount = parseInt(customBetAmount)
      return isNaN(customAmount) || customAmount <= 0 ? 0 : customAmount
    }
    return betAmount
  }

  const rollDice = async () => {
    if (isRolling) return

    // Check if user is logged in and has enough coins
    if (!user || !profile) {
      alert('Please log in to play dice!')
      return
    }

    const currentBet = getCurrentBetAmount()
    if (currentBet <= 0) {
      alert('Please enter a valid bet amount!')
      return
    }

    if (profile.epic_coins < currentBet) {
      alert(`Not enough Epic Coins! You need ${currentBet} EC to bet.`)
      return
    }

    // Deduct coins before rolling
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ epic_coins: profile.epic_coins - currentBet })
        .eq('id', user.id)
        .select()

      if (error) {
        alert(`Error processing bet: ${error.message}. Please try again.`)
        return
      }
      
      await refreshProfile()
    } catch (error) {
      alert(`Error processing bet: ${error}. Please try again.`)
      return
    }

    setIsRolling(true)
    setShowCelebration(false)
    setWinAmount(0)

    // Animate rolling for 2.5 seconds
    const rollInterval = setInterval(() => {
      setDice1(getRandomDice())
      setDice2(getRandomDice())
    }, 100)

    setTimeout(async () => {
      clearInterval(rollInterval)
      
      // Final result
      const finalDice1 = getRandomDice()
      const finalDice2 = getRandomDice()
      setDice1(finalDice1)
      setDice2(finalDice2)
      setIsRolling(false)

      // Calculate winnings
      const winnings = calculateWin(finalDice1, finalDice2, currentBet, prediction, targetNumber)
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
    }, 2500)
  }

  const hideCelebration = () => {
    setShowCelebration(false)
    setWinAmount(0)
  }

  const getDiceEmoji = (number: number) => {
    return diceOutcomes.find(d => d.number === number)?.emoji || "⚀"
  }

  const getDiceColor = (number: number) => {
    return diceOutcomes.find(d => d.number === number)?.color || "text-white"
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-black via-teal-950 to-cyan-900 relative overflow-hidden">
        {/* Cohesive Green Casino Background */}
        <div className="absolute inset-0">
          {/* Primary green casino gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-800/40 via-emerald-700/50 via-teal-600/40 to-green-800/40 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-green-400/20 via-transparent via-emerald-500/25 to-teal-500/20 animate-ping" style={{animationDuration: '5s'}}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/15 via-green-500/20 via-teal-500/15 to-emerald-600/15 animate-bounce" style={{animationDuration: '8s'}}></div>
          
          {/* Subtle accent spinning rings */}
          <div className="absolute inset-0 bg-gradient-conic from-green-500/15 via-emerald-500/15 via-teal-500/15 via-cyan-500/10 via-green-500/15 to-green-500/15 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute inset-0 bg-gradient-conic from-emerald-400/10 via-green-400/10 via-teal-400/10 to-emerald-400/10 animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
          
          {/* Cohesive green grid pattern */}
          <div className="absolute inset-0 opacity-25">
            <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
              {Array.from({ length: 192 }).map((_, i) => (
                <div
                  key={i}
                  className={`border ${
                    i % 6 === 0 ? 'border-green-400/30 bg-green-500/8 shadow-sm shadow-green-400/20' :
                    i % 6 === 1 ? 'border-emerald-400/30 bg-emerald-500/8 shadow-sm shadow-emerald-400/20' :
                    i % 6 === 2 ? 'border-teal-400/30 bg-teal-500/8 shadow-sm shadow-teal-400/20' :
                    i % 6 === 3 ? 'border-cyan-400/25 bg-cyan-500/6 shadow-sm shadow-cyan-400/15' :
                    i % 6 === 4 ? 'border-lime-400/25 bg-lime-500/6 shadow-sm shadow-lime-400/15' :
                    'border-yellow-400/20 bg-yellow-500/5 shadow-sm shadow-yellow-400/10'
                  } animate-pulse transition-all duration-300`}
                  style={{
                    animationDelay: `${(i * 0.02) % 6}s`,
                    animationDuration: `${4 + (i * 0.01) % 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Multiple rotating gradients */}
          <div className="absolute inset-0 bg-gradient-conic from-green-500/20 via-teal-500/20 via-cyan-500/20 to-blue-500/20 animate-spin" style={{animationDuration: '30s'}}></div>
          <div className="absolute inset-0 bg-gradient-conic from-purple-500/15 via-pink-500/15 via-red-500/15 to-orange-500/15 animate-spin" style={{animationDuration: '45s', animationDirection: 'reverse'}}></div>
          
          {/* Cohesive green orbs */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full blur-xl animate-pulse ${
                i % 3 === 0 ? 'bg-green-400/15 w-32 h-32' :
                i % 3 === 1 ? 'bg-emerald-400/15 w-24 h-24' :
                'bg-teal-400/15 w-28 h-28'
              }`}
              style={{
                left: `${(i * 25.7) % 85}%`,
                top: `${(i * 33.3) % 85}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${5 + (i % 2)}s`
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4 z-30">
          <a
            href="/epicrngworld"
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-black/80 border-2 border-green-400 hover:border-teal-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-green-400/50 hover:shadow-teal-400/50 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-xs sm:text-sm font-mono font-black text-green-400 whitespace-nowrap">BACK TO RNG WORLD</span>
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
                  className="bg-black/80 border-2 border-teal-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-teal-400/50 backdrop-blur-sm hover:border-cyan-400 transition-colors"
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                    <span className="text-xs sm:text-sm font-black text-teal-400 max-w-20 sm:max-w-none truncate">{profile.username}</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-teal-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-black/90 border-2 border-teal-400 rounded-lg shadow-2xl shadow-teal-400/50 backdrop-blur-sm min-w-[160px] max-w-[200px] z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-teal-400/30">
                        <div className="text-xs text-teal-300 font-mono">Signed in as</div>
                        <div className="text-sm font-black text-teal-400 font-mono truncate">{profile.username}</div>
                        <div className="text-xs text-teal-300 font-mono truncate">{user.email}</div>
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
            <div className="bg-black/80 border-2 border-emerald-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-emerald-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-black text-emerald-400 whitespace-nowrap">🎲 DICE! 🎲</span>
              </div>
            </div>
          )}
        </div>

        {/* Background blur overlay when rolling or celebrating */}
        {(isRolling || showCelebration) && (
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-md z-10 transition-all duration-1000" 
            onClick={showCelebration && !isRolling ? hideCelebration : undefined}
          />
        )}

        {/* Main content - CASINO TABLE LAYOUT */}
        <div className={`relative min-h-screen transition-all duration-1000 ${
          (isRolling || showCelebration) ? 'z-30' : 'z-20'
        }`}>
          
          {/* Ultra Casino Table Header with More Clutter */}
          <div className="text-center py-8 bg-gradient-to-b from-black/80 to-transparent relative">
            {/* Background neon lines */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute h-1 animate-pulse ${
                    i % 3 === 0 ? 'bg-green-400/30' :
                    i % 3 === 1 ? 'bg-cyan-400/30' : 'bg-purple-400/30'
                  }`}
                  style={{
                    width: `${60 + (i * 7) % 40}%`,
                    left: `${(i * 8.33) % 50}%`,
                    top: `${(i * 8.33) % 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    transform: `rotate(${(i * 15) % 180}deg)`
                  }}
                />
              ))}
            </div>
            
            {/* Cohesive promotional banners */}
            <div className="absolute top-2 left-4 bg-green-600/90 border-2 border-yellow-400 px-3 py-1 rounded-lg animate-bounce transform -rotate-12">
            </div>
            <div className="absolute top-2 right-4 bg-emerald-600/90 border-2 border-gold-400 px-3 py-1 rounded-lg animate-bounce transform rotate-12" style={{animationDelay: '0.5s'}}>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-mono tracking-wider relative z-10"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6, #ec4899, #f59e0b)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient 3s ease infinite',
                  textShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4), 0 0 90px rgba(34, 197, 94, 0.2)'
                }}>
              🎲 ULTIMATE CRAPS EXPERIENCE 🎲
            </h1>
            
            {/* Cohesive scrolling ticker */}
            <div className="mt-4 bg-green-900/70 border-2 border-yellow-400 rounded-lg p-2 relative overflow-hidden">
              <div className="text-yellow-300 font-mono text-sm font-bold animate-pulse">🎯 LIVE ODDS • BIG WINS • INSTANT PAYOUTS • 24/7 ACTION 🎯</div>
            </div>
          </div>
          
          {/* Add CSS keyframes for gradient animation */}
          <style jsx>{`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
          
          {/* Casino Table Surface */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            
            {/* Dice Rolling Area - Center Stage */}
            <div className="relative mb-8">
              {/* Enhanced Casino Table Felt with Neon Trim */}
              <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-8 border-yellow-500 rounded-3xl p-8 shadow-2xl shadow-green-500/50 relative overflow-hidden" style={{
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3), inset 0 0 40px rgba(34, 197, 94, 0.1)'
              }}>
                
                {/* Enhanced Table Pattern with Neon Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
                    {Array.from({length: 192}).map((_, i) => (
                      <div 
                        key={i} 
                        className={`border-2 ${
                          i % 8 === 0 ? 'border-yellow-400/60 bg-yellow-400/5 shadow-sm shadow-yellow-400/30' :
                          i % 8 === 1 ? 'border-orange-400/60 bg-orange-400/5 shadow-sm shadow-orange-400/30' :
                          i % 8 === 2 ? 'border-red-400/60 bg-red-400/5 shadow-sm shadow-red-400/30' :
                          i % 8 === 3 ? 'border-pink-400/60 bg-pink-400/5 shadow-sm shadow-pink-400/30' :
                          i % 8 === 4 ? 'border-purple-400/60 bg-purple-400/5 shadow-sm shadow-purple-400/30' :
                          i % 8 === 5 ? 'border-blue-400/60 bg-blue-400/5 shadow-sm shadow-blue-400/30' :
                          i % 8 === 6 ? 'border-cyan-400/60 bg-cyan-400/5 shadow-sm shadow-cyan-400/30' :
                          'border-teal-400/60 bg-teal-400/5 shadow-sm shadow-teal-400/30'
                        } animate-pulse`}
                        style={{
                          animationDelay: `${(i * 0.01) % 3}s`,
                          animationDuration: `${2 + (i * 0.005) % 2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Casino decorative elements */}
                <div className="absolute top-4 left-4 text-yellow-400 font-black text-2xl animate-pulse" style={{textShadow: '0 0 10px currentColor'}}>♠</div>
                <div className="absolute top-4 right-4 text-red-400 font-black text-2xl animate-pulse" style={{textShadow: '0 0 10px currentColor', animationDelay: '0.5s'}}>♦</div>
                <div className="absolute bottom-4 left-4 text-black font-black text-2xl animate-pulse" style={{textShadow: '0 0 10px #ffffff', animationDelay: '1s'}}>♣</div>
                <div className="absolute bottom-4 right-4 text-red-400 font-black text-2xl animate-pulse" style={{textShadow: '0 0 10px currentColor', animationDelay: '1.5s'}}>♥</div>
                
                {/* Enhanced Dice Area with Neon Effects */}
                <div className="relative z-10 text-center">
                  <div className="bg-black/60 border-4 border-gold-400 rounded-2xl p-8 mb-6 max-w-2xl mx-auto relative overflow-hidden" style={{
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 30px rgba(251, 191, 36, 0.1)'
                  }}>
                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-2xl border-4 border-gold-400 animate-pulse" style={{
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), inset 0 0 20px rgba(251, 191, 36, 0.2)'
                    }}></div>
                    
                    {/* Dice Display */}
                    <div className="flex justify-center items-center space-x-8 mb-6">
                      {/* Enhanced Dice 1 with Neon Glow */}
                      <div className="relative">
                        <div className={`bg-gradient-to-br from-white via-gray-100 to-white border-4 border-gray-800 rounded-xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl transform transition-all duration-300 ${
                          isRolling ? 'animate-bounce scale-110 shadow-green-400/50' : 'scale-100 hover:scale-105 hover:shadow-cyan-400/50'
                        }`} style={{
                          boxShadow: isRolling ? '0 0 40px rgba(34, 197, 94, 0.8), 0 20px 40px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 182, 212, 0.3)'
                        }}>
                          <div className={`text-4xl sm:text-6xl ${getDiceColor(dice1)} transition-all duration-300 ${
                            isRolling ? 'blur-sm' : 'blur-0'
                          }`}>
                            {getDiceEmoji(dice1)}
                          </div>
                        </div>
                        <div className="text-green-300 font-mono text-sm font-bold mt-2 animate-pulse" style={{textShadow: '0 0 10px rgba(34, 197, 94, 0.8)'}}>DIE 1</div>
                      </div>

                      {/* Enhanced Plus Symbol */}
                      <div className="text-6xl font-black animate-pulse relative" style={{
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
                      }}>+</div>

                      {/* Enhanced Dice 2 with Neon Glow */}
                      <div className="relative">
                        <div className={`bg-gradient-to-br from-white via-gray-100 to-white border-4 border-gray-800 rounded-xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl transform transition-all duration-300 ${
                          isRolling ? 'animate-bounce scale-110 shadow-green-400/50' : 'scale-100 hover:scale-105 hover:shadow-cyan-400/50'
                        }`} style={{
                          boxShadow: isRolling ? '0 0 40px rgba(34, 197, 94, 0.8), 0 20px 40px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 182, 212, 0.3)'
                        }}>
                          <div className={`text-4xl sm:text-6xl ${getDiceColor(dice2)} transition-all duration-300 ${
                            isRolling ? 'blur-sm' : 'blur-0'
                          }`}>
                            {getDiceEmoji(dice2)}
                          </div>
                        </div>
                        <div className="text-green-300 font-mono text-sm font-bold mt-2 animate-pulse" style={{textShadow: '0 0 10px rgba(34, 197, 94, 0.8)'}}>DIE 2</div>
                      </div>

                      {/* Enhanced Equals Symbol */}
                      <div className="text-6xl font-black animate-pulse" style={{
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
                      }}>=</div>

                      {/* Enhanced Total with Mega Neon */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-gold-400 via-yellow-500 to-yellow-600 border-4 border-yellow-300 rounded-xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl animate-pulse" style={{
                          boxShadow: '0 0 40px rgba(251, 191, 36, 1), 0 0 80px rgba(251, 191, 36, 0.6), 0 20px 40px rgba(0, 0, 0, 0.3)'
                        }}>
                          <div className={`text-4xl sm:text-6xl font-black text-black transition-all duration-300 ${
                            isRolling ? 'blur-sm' : 'blur-0'
                          }`}>
                            {dice1 + dice2}
                          </div>
                        </div>
                        <div className="text-yellow-400 font-mono text-sm font-bold mt-2 animate-pulse" style={{textShadow: '0 0 15px rgba(251, 191, 36, 1)'}}>TOTAL</div>
                      </div>
                    </div>
                    
                    {/* Game Status */}
                    <div className="text-center">
                      {isRolling ? (
                        <div className="text-yellow-400 font-black text-2xl font-mono animate-pulse">
                          🎲 ROLLING DICE... 🎲
                        </div>
                      ) : (
                        <div className="text-green-300 font-mono text-lg">
                          Ready for next roll
                        </div>
                      )}
                    </div>

                    {/* Roll Button - Mobile responsive */}
                    <div className="mt-6 lg:hidden">
                      <button
                        onClick={rollDice}
                        disabled={isRolling || (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)}
                        className={`w-full py-6 text-xl font-black font-mono rounded-xl transition-all duration-300 transform ${
                          isRolling
                            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                            : (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)
                            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-br from-red-500 to-red-700 border-4 border-yellow-400 text-yellow-100 hover:scale-105 hover:shadow-2xl shadow-red-500/50 animate-pulse'
                        }`}
                      >
                        {isRolling ? '🎲 ROLLING' : '🎯 ROLL DICE'}
                      </button>
                      
                      <div className="mt-3 text-gold-300 font-mono text-sm">
                        {!user ? 'LOGIN TO PLAY' : 
                         getCurrentBetAmount() <= 0 ? 'PLACE YOUR BET' :
                         profile && profile.epic_coins < getCurrentBetAmount() ? 'INSUFFICIENT FUNDS' : 
                         `${getCurrentBetAmount()} EC • ${prediction.toUpperCase()} ${targetNumber}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Betting Board - Casino Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Side - Betting Controls */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Cohesive Betting Amount Section */}
                <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden" style={{
                  boxShadow: '0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(34, 197, 94, 0.3), inset 0 0 30px rgba(34, 197, 94, 0.1)'
                }}>
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-4 border-yellow-400 animate-pulse" style={{
                    boxShadow: '0 0 25px rgba(251, 191, 36, 0.6), inset 0 0 25px rgba(34, 197, 94, 0.2)'
                  }}></div>
                  <div className="text-center mb-4 relative z-10">
                    <h3 className="font-black text-xl font-mono border-b-2 border-yellow-400 pb-2 animate-pulse" style={{
                      background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #92400e)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
                    }}>💰 PLACE YOUR BET 💰</h3>
                  </div>

                  {/* Chip Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => setUseCustomBet(false)}
                          disabled={isRolling}
                          className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                            !useCustomBet 
                              ? 'bg-red-500 border-red-400 text-white' 
                              : 'bg-black/60 border-red-400 text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          CHIPS
                        </button>
                        <button
                          onClick={() => setUseCustomBet(true)}
                          disabled={isRolling}
                          className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                            useCustomBet 
                              ? 'bg-yellow-500 border-yellow-400 text-white' 
                              : 'bg-black/60 border-yellow-400 text-yellow-400 hover:bg-yellow-500/20'
                          }`}
                        >
                          CUSTOM
                        </button>
                      </div>

                      {!useCustomBet ? (
                        <div className="grid grid-cols-3 gap-2">
                          {[25, 50, 100, 200, 500, 1000].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => setBetAmount(amount)}
                              disabled={isRolling}
                              className={`p-3 rounded-full border-4 font-black text-xs transition-all transform ${
                                betAmount === amount
                                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-300 text-black scale-110 animate-pulse'
                                  : 'bg-gradient-to-br from-green-700 to-emerald-800 border-green-400 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-400/50'
                              }`}
                              style={{
                                boxShadow: betAmount === amount ? '0 0 20px rgba(251, 191, 36, 0.8)' : '0 0 10px rgba(34, 197, 94, 0.5)'
                              }}
                            >
                              {amount}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="number"
                          placeholder="Enter bet..."
                          value={customBetAmount}
                          onChange={(e) => setCustomBetAmount(e.target.value)}
                          disabled={isRolling}
                          min="1"
                          max={profile?.epic_coins || 999999}
                          className="w-full bg-black/60 border-2 border-yellow-400 rounded-lg px-3 py-2 text-yellow-300 font-mono text-center font-bold focus:outline-none"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-red-300 font-bold text-sm font-mono mb-2">TARGET NUMBER</label>
                      <div className="grid grid-cols-4 gap-1">
                        {Array.from({length: 11}, (_, i) => i + 2).map(num => (
                          <button
                            key={num}
                            onClick={() => setTargetNumber(num)}
                            disabled={isRolling}
                            className={`p-2 rounded border-2 font-black text-xs transition-all ${
                              targetNumber === num
                                ? 'bg-green-400 border-green-300 text-black'
                                : 'bg-black/60 border-green-400 text-green-400 hover:bg-green-500/20'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Betting Board - Three Sections with Neon */}
                <div className="grid grid-cols-3 gap-4 relative">
                  {/* Cohesive promotional badges */}
                  <div className="absolute -top-4 left-4 bg-yellow-500/90 border-2 border-green-400 px-2 py-1 rounded-full animate-bounce transform -rotate-12 z-10">
                    <div className="text-green-100 font-black text-xs font-mono">🔥 HOT! 🔥</div>
                  </div>
                  <div className="absolute -top-4 right-4 bg-emerald-500/90 border-2 border-gold-400 px-2 py-1 rounded-full animate-bounce transform rotate-12 z-10" style={{animationDelay: '0.3s'}}>
                    <div className="text-gold-100 font-black text-xs font-mono">💎 VIP 💎</div>
                  </div>
                  
                  {/* Enhanced UNDER Section */}
                  <button
                    onClick={() => setPrediction('under')}
                    disabled={isRolling}
                    className={`p-6 rounded-2xl border-4 font-black transition-all transform hover:scale-105 relative overflow-hidden ${
                      prediction === 'under' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-300 text-white shadow-2xl animate-pulse' 
                        : 'bg-gradient-to-br from-blue-900/60 to-blue-800/60 border-blue-400 text-blue-300 hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-400/50'
                    }`}
                    style={{
                      boxShadow: prediction === 'under' ? '0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4)' : '0 0 20px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {prediction === 'under' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl mb-2">📉</div>
                      <div className="text-lg font-mono">UNDER</div>
                      <div className="text-3xl font-black">{targetNumber}</div>
                      <div className="text-sm mt-2">
                        {targetNumber >= 8 ? '1.5x' : targetNumber >= 6 ? '2x' : '3x'} PAYOUT
                      </div>
                    </div>
                  </button>
                  
                  {/* Enhanced EXACT Section */}
                  <button
                    onClick={() => setPrediction('exact')}
                    disabled={isRolling}
                    className={`p-6 rounded-2xl border-4 font-black transition-all transform hover:scale-105 relative overflow-hidden ${
                      prediction === 'exact' 
                        ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-300 text-black shadow-2xl animate-pulse' 
                        : 'bg-gradient-to-br from-yellow-900/60 to-yellow-800/60 border-yellow-400 text-yellow-300 hover:bg-yellow-500/30 hover:shadow-lg hover:shadow-yellow-400/50'
                    }`}
                    style={{
                      boxShadow: prediction === 'exact' ? '0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.4)' : '0 0 20px rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    {prediction === 'exact' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-lg font-mono">EXACT</div>
                      <div className="text-3xl font-black">{targetNumber}</div>
                      <div className="text-sm mt-2">
                        {targetNumber === 7 ? '5x' : targetNumber === 6 || targetNumber === 8 ? '6x' : targetNumber === 5 || targetNumber === 9 ? '8x' : '10x'} PAYOUT
                      </div>
                    </div>
                  </button>
                  
                  {/* Enhanced OVER Section */}
                  <button
                    onClick={() => setPrediction('over')}
                    disabled={isRolling}
                    className={`p-6 rounded-2xl border-4 font-black transition-all transform hover:scale-105 relative overflow-hidden ${
                      prediction === 'over' 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-300 text-white shadow-2xl animate-pulse' 
                        : 'bg-gradient-to-br from-green-900/60 to-green-800/60 border-green-400 text-green-300 hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-400/50'
                    }`}
                    style={{
                      boxShadow: prediction === 'over' ? '0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)' : '0 0 20px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    {prediction === 'over' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="text-lg font-mono">OVER</div>
                      <div className="text-3xl font-black">{targetNumber}</div>
                      <div className="text-sm mt-2">
                        {targetNumber <= 6 ? '1.5x' : targetNumber <= 8 ? '2x' : '3x'} PAYOUT
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Side - Action Center */}
              <div className="lg:col-span-1">
                
                {/* Enhanced Roll Button with Mega Neon */}
                <div className="hidden lg:block bg-gradient-to-br from-black via-gray-900 to-black border-4 border-gold-400 rounded-2xl p-6 shadow-2xl text-center relative overflow-hidden" style={{
                  boxShadow: '0 0 50px rgba(251, 191, 36, 0.6), 0 0 100px rgba(251, 191, 36, 0.3), inset 0 0 40px rgba(251, 191, 36, 0.1)'
                }}>
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl border-4 border-gold-400 animate-pulse" style={{
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.8), inset 0 0 30px rgba(251, 191, 36, 0.2)'
                  }}></div>
                  <div className="mb-4 relative z-10">
                    <h3 className="font-black text-xl font-mono animate-pulse" style={{
                      background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'gradient 2s ease infinite',
                      textShadow: '0 0 30px rgba(251, 191, 36, 0.8)'
                    }}>🎲 ROLL EM! 🎲</h3>
                  </div>
                  
                  <button
                    onClick={rollDice}
                    disabled={isRolling || (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)}
                    className={`w-full py-8 text-2xl font-black font-mono rounded-xl transition-all duration-300 transform ${
                      isRolling
                        ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                        : (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)
                        ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-red-500 to-red-700 border-4 border-yellow-400 text-yellow-100 hover:scale-110 hover:shadow-2xl shadow-red-500/50 animate-pulse'
                    }`}
                  >
                    {isRolling ? '🎲 ROLLING' : '🎯 ROLL DICE'}
                  </button>
                  
                  <div className="mt-4 text-gold-300 font-mono text-sm">
                    {!user ? 'LOGIN TO PLAY' : 
                     getCurrentBetAmount() <= 0 ? 'PLACE YOUR BET' :
                     profile && profile.epic_coins < getCurrentBetAmount() ? 'INSUFFICIENT FUNDS' : 
                     `${getCurrentBetAmount()} EC • ${prediction.toUpperCase()} ${targetNumber}`}
                  </div>
                </div>

                {/* Enhanced Odds Display */}
                <div className="mt-6 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 border-4 border-purple-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden" style={{
                  boxShadow: '0 0 40px rgba(147, 51, 234, 0.6), 0 0 80px rgba(147, 51, 234, 0.3), inset 0 0 30px rgba(147, 51, 234, 0.1)'
                }}>
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-4 border-purple-400 animate-pulse" style={{
                    boxShadow: '0 0 25px rgba(147, 51, 234, 0.8), inset 0 0 25px rgba(147, 51, 234, 0.2)'
                  }}></div>
                  <h3 className="font-black text-lg font-mono text-center mb-4 animate-pulse relative z-10" style={{
                    background: 'linear-gradient(45deg, #d8b4fe, #c084fc, #a855f7, #9333ea)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 20px rgba(147, 51, 234, 0.8)'
                  }}>📊 HOUSE ODDS 📊</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center bg-black/40 rounded-lg p-2">
                      <span className="text-blue-300 font-bold">UNDER</span>
                      <span className="text-blue-200">1.5x - 3x</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 rounded-lg p-2">
                      <span className="text-yellow-300 font-bold">EXACT</span>
                      <span className="text-yellow-200">5x - 10x</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 rounded-lg p-2">
                      <span className="text-green-300 font-bold">OVER</span>
                      <span className="text-green-200">1.5x - 3x</span>
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
                    i % 4 === 0 ? 'bg-green-400' :
                    i % 4 === 1 ? 'bg-teal-400' :
                    i % 4 === 2 ? 'bg-cyan-400' : 'bg-blue-400'
                  } shadow-2xl`} />
                </div>
              ))}
            </div>

            {/* Main Celebration Text */}
            <div className="text-center animate-bounce max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-mono text-green-400 mb-2 sm:mb-4 animate-pulse whitespace-nowrap"
                    style={{
                      textShadow: '0 0 30px rgba(34, 197, 94, 1), 0 0 60px rgba(34, 197, 94, 0.8)'
                    }}>
                  🎲 WINNER! 🎲
                </h2>
                <div className="text-4xl sm:text-6xl md:text-8xl font-black font-mono mb-2 sm:mb-4 animate-pulse bg-black/95 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white whitespace-nowrap"
                     style={{
                       color: '#FFFFFF',
                       textShadow: '0 0 40px #10B981, 0 0 80px #10B981, 0 0 10px #000000'
                     }}>
                  +{winAmount.toLocaleString()} EC
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white animate-pulse whitespace-nowrap">
                  🎯 PERFECT PREDICTION! 🎯
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Floating Effects & Advertisements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Cohesive floating dice symbols */}
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`absolute font-mono text-2xl font-bold animate-pulse ${
                i % 6 === 0 ? 'text-green-400' :
                i % 6 === 1 ? 'text-emerald-400' :
                i % 6 === 2 ? 'text-teal-400' :
                i % 6 === 3 ? 'text-cyan-400' :
                i % 6 === 4 ? 'text-lime-400' : 'text-yellow-400'
              } opacity-20`}
              style={{
                left: `${(i * 11.7) % 95}%`,
                top: `${(i * 17.3) % 95}%`,
                animationDelay: `${(i * 0.2) % 8}s`,
                textShadow: '0 0 15px currentColor',
                transform: `rotate(${(i * 45) % 360}deg) scale(${0.8 + (i % 3) * 0.3})`
              }}
            >
              {getDiceEmoji((i % 6) + 1)}
            </div>
          ))}
          
          {/* Cohesive floating dollar signs and coins */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`money-${i}`}
              className={`absolute font-mono text-xl font-bold animate-bounce ${
                i % 3 === 0 ? 'text-green-400' :
                i % 3 === 1 ? 'text-yellow-400' : 'text-emerald-400'
              } opacity-15`}
              style={{
                left: `${(i * 23.7) % 90}%`,
                top: `${(i * 29.3) % 90}%`,
                animationDelay: `${(i * 0.4) % 6}s`,
                animationDuration: `${3 + (i % 3)}s`,
                textShadow: '0 0 10px currentColor'
              }}
            >
              {i % 3 === 0 ? '$' : i % 3 === 1 ? '🪙' : '💰'}
            </div>
          ))}
          
          {/* Cohesive floating card suits */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`suit-${i}`}
              className={`absolute text-2xl font-bold animate-ping ${
                i % 4 === 0 ? 'text-yellow-400' :
                i % 4 === 1 ? 'text-green-400' :
                i % 4 === 2 ? 'text-emerald-400' : 'text-teal-400'
              } opacity-10`}
              style={{
                left: `${(i * 31.7) % 85}%`,
                top: `${(i * 37.3) % 85}%`,
                animationDelay: `${(i * 0.6) % 8}s`,
                animationDuration: `${4 + (i % 2)}s`,
                textShadow: '0 0 8px currentColor'
              }}
            >
              {i % 4 === 0 ? '♠' : i % 4 === 1 ? '♣' : i % 4 === 2 ? '♥' : '♦'}
            </div>
          ))}
        </div>
        
      </div>
    </>
  )
}