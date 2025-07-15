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
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-teal-500/30 via-cyan-500/20 to-blue-500/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-lime-400/15 via-transparent via-emerald-500/20 to-teal-500/15 animate-ping" style={{animationDuration: '5s'}}></div>
          
          {/* Dice-themed grid pattern */}
          <div className="absolute inset-0 opacity-25">
            <div className="grid grid-cols-16 grid-rows-16 h-full w-full">
              {Array.from({ length: 256 }).map((_, i) => (
                <div
                  key={i}
                  className={`border ${
                    i % 6 === 0 ? 'border-green-400/30 bg-green-500/5' :
                    i % 6 === 1 ? 'border-teal-400/30 bg-teal-500/5' :
                    i % 6 === 2 ? 'border-cyan-400/30 bg-cyan-500/5' :
                    i % 6 === 3 ? 'border-blue-400/30 bg-blue-500/5' :
                    i % 6 === 4 ? 'border-emerald-400/30 bg-emerald-500/5' :
                    'border-lime-400/30 bg-lime-500/5'
                  } animate-pulse`}
                  style={{
                    animationDelay: `${(i * 0.02) % 4}s`,
                    animationDuration: `${4 + (i * 0.01) % 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-conic from-green-500/15 via-teal-500/15 via-cyan-500/15 to-blue-500/15 animate-spin" style={{animationDuration: '30s'}}></div>
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

        {/* Main content */}
        <div className={`relative min-h-screen flex flex-col justify-center items-center px-4 transition-all duration-1000 ${
          (isRolling || showCelebration) ? 'z-30' : 'z-20'
        }`}>
          
          {/* Title */}
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-2 sm:mb-4 font-mono tracking-wider text-green-400 drop-shadow-2xl animate-pulse whitespace-nowrap"
                style={{
                  textShadow: '0 0 20px rgba(34, 197, 94, 1), 0 0 40px rgba(34, 197, 94, 0.6)'
                }}>
              EPIC DICE
            </h1>
            <div className="h-1 sm:h-2 w-32 sm:w-64 bg-gradient-to-r from-green-500 via-teal-400 via-cyan-400 to-blue-500 mx-auto animate-pulse rounded-full shadow-2xl"></div>
          </div>

          {/* Dice Game */}
          <div className="bg-black/80 border-4 border-teal-400 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-teal-400/50 backdrop-blur-sm mb-6 sm:mb-8 max-w-2xl w-full">
            
            {/* Dice Display */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-400 rounded-2xl p-4 sm:p-6 mb-6">
              <div className="flex justify-center items-center space-x-4 sm:space-x-8 mb-4">
                {/* Dice 1 */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-teal-400 rounded-2xl p-4 sm:p-6 shadow-inner">
                    <div className={`text-6xl sm:text-8xl md:text-9xl text-center transition-all duration-300 ${
                      isRolling ? 'blur-sm animate-spin' : 'blur-0'
                    } ${getDiceColor(dice1)}`}>
                      {getDiceEmoji(dice1)}
                    </div>
                  </div>
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    isRolling ? 'bg-green-400/20 animate-pulse' : 'bg-transparent'
                  }`} />
                </div>

                {/* Plus Symbol */}
                <div className="text-4xl sm:text-6xl text-cyan-400 font-black">+</div>

                {/* Dice 2 */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-teal-400 rounded-2xl p-4 sm:p-6 shadow-inner">
                    <div className={`text-6xl sm:text-8xl md:text-9xl text-center transition-all duration-300 ${
                      isRolling ? 'blur-sm animate-spin' : 'blur-0'
                    } ${getDiceColor(dice2)}`}>
                      {getDiceEmoji(dice2)}
                    </div>
                  </div>
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    isRolling ? 'bg-green-400/20 animate-pulse' : 'bg-transparent'
                  }`} />
                </div>

                {/* Equals Symbol */}
                <div className="text-4xl sm:text-6xl text-cyan-400 font-black">=</div>

                {/* Total */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-400 rounded-2xl p-4 sm:p-6 shadow-inner">
                  <div className={`text-6xl sm:text-8xl md:text-9xl text-center font-black transition-all duration-300 ${
                    isRolling ? 'blur-sm' : 'blur-0'
                  } text-cyan-400`}>
                    {dice1 + dice2}
                  </div>
                </div>
              </div>
            </div>

            {/* Betting Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Bet Amount */}
              <div>
                <label className="block text-sm font-bold text-teal-400 mb-2 font-mono">BET AMOUNT (EC)</label>
                <div className="space-y-2">
                  {/* Toggle between preset and custom */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUseCustomBet(false)}
                      disabled={isRolling}
                      className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                        !useCustomBet 
                          ? 'bg-green-500 border-green-400 text-white' 
                          : 'bg-black/60 border-green-400 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      PRESET
                    </button>
                    <button
                      onClick={() => setUseCustomBet(true)}
                      disabled={isRolling}
                      className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                        useCustomBet 
                          ? 'bg-teal-500 border-teal-400 text-white' 
                          : 'bg-black/60 border-teal-400 text-teal-400 hover:bg-teal-500/20'
                      }`}
                    >
                      CUSTOM
                    </button>
                  </div>

                  {/* Preset dropdown or custom input */}
                  {!useCustomBet ? (
                    <select 
                      value={betAmount} 
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      disabled={isRolling}
                      className="w-full bg-gradient-to-br from-gray-900 to-black border-2 border-green-400 rounded-lg px-3 py-2 text-green-300 font-mono text-center font-bold hover:border-teal-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(17,24,39,0.9) 100%)'
                      }}
                    >
                      <option value={25} className="bg-gray-900 text-green-300">💰 25 EC</option>
                      <option value={50} className="bg-gray-900 text-green-300">💎 50 EC</option>
                      <option value={100} className="bg-gray-900 text-green-300">🎯 100 EC</option>
                      <option value={200} className="bg-gray-900 text-green-300">🔥 200 EC</option>
                      <option value={500} className="bg-gray-900 text-green-300">💸 500 EC</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      placeholder="Enter amount..."
                      value={customBetAmount}
                      onChange={(e) => setCustomBetAmount(e.target.value)}
                      disabled={isRolling}
                      min="1"
                      max={profile?.epic_coins || 999999}
                      className="w-full bg-gradient-to-br from-gray-900 to-black border-2 border-teal-400 rounded-lg px-3 py-2 text-teal-300 font-mono text-center font-bold hover:border-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors placeholder-teal-500"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(17,24,39,0.9) 100%)'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Target Number */}
              <div>
                <label className="block text-sm font-bold text-teal-400 mb-2 font-mono">TARGET NUMBER</label>
                <select 
                  value={targetNumber} 
                  onChange={(e) => setTargetNumber(Number(e.target.value))}
                  disabled={isRolling}
                  className="w-full bg-gradient-to-br from-gray-900 to-black border-2 border-green-400 rounded-lg px-3 py-2 text-green-300 font-mono text-center font-bold hover:border-teal-400 focus:border-cyan-400 focus:outline-none transition-colors mt-6"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(17,24,39,0.9) 100%)'
                  }}
                >
                  {Array.from({length: 11}, (_, i) => i + 2).map(num => (
                    <option key={num} value={num} className="bg-gray-900 text-green-300">
                      {num === 2 ? '🎲 2 (rare)' :
                       num === 3 ? '🎯 3 (hard)' :
                       num === 4 ? '🔷 4 (tough)' :
                       num === 5 ? '💫 5 (good)' :
                       num === 6 ? '⭐ 6 (fair)' :
                       num === 7 ? '🎰 7 (common)' :
                       num === 8 ? '⭐ 8 (fair)' :
                       num === 9 ? '💫 9 (good)' :
                       num === 10 ? '🔷 10 (tough)' :
                       num === 11 ? '🎯 11 (hard)' :
                       '🎲 12 (rare)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prediction Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
              <button
                onClick={() => setPrediction('under')}
                disabled={isRolling}
                className={`py-2 sm:py-3 px-2 sm:px-4 font-black font-mono rounded-xl border-2 transition-all ${
                  prediction === 'under' 
                    ? 'bg-blue-500 border-blue-400 text-white' 
                    : 'bg-black/60 border-blue-400 text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                <div className="text-sm sm:text-base whitespace-nowrap">UNDER {targetNumber}</div>
                <div className="text-xs text-blue-200">
                  {targetNumber >= 8 ? '1.5x' : targetNumber >= 6 ? '2x' : '3x'}
                </div>
              </button>
              
              <button
                onClick={() => setPrediction('exact')}
                disabled={isRolling}
                className={`py-2 sm:py-3 px-2 sm:px-4 font-black font-mono rounded-xl border-2 transition-all ${
                  prediction === 'exact' 
                    ? 'bg-yellow-500 border-yellow-400 text-white' 
                    : 'bg-black/60 border-yellow-400 text-yellow-400 hover:bg-yellow-500/20'
                }`}
              >
                <div className="text-sm sm:text-base whitespace-nowrap">EXACT {targetNumber}</div>
                <div className="text-xs text-yellow-200">
                  {targetNumber === 7 ? '5x' : targetNumber === 6 || targetNumber === 8 ? '6x' : targetNumber === 5 || targetNumber === 9 ? '8x' : '10x'}
                </div>
              </button>
              
              <button
                onClick={() => setPrediction('over')}
                disabled={isRolling}
                className={`py-2 sm:py-3 px-2 sm:px-4 font-black font-mono rounded-xl border-2 transition-all ${
                  prediction === 'over' 
                    ? 'bg-green-500 border-green-400 text-white' 
                    : 'bg-black/60 border-green-400 text-green-400 hover:bg-green-500/20'
                }`}
              >
                <div className="text-sm sm:text-base whitespace-nowrap">OVER {targetNumber}</div>
                <div className="text-xs text-green-200">
                  {targetNumber <= 6 ? '1.5x' : targetNumber <= 8 ? '2x' : '3x'}
                </div>
              </button>
            </div>

            {/* Roll Button */}
            <button
              onClick={rollDice}
              disabled={isRolling || (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)}
              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black font-mono rounded-xl transition-all duration-300 transform ${
                isRolling
                  ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                  : (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)
                  ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 border-2 sm:border-4 border-cyan-400 text-white hover:scale-105 hover:shadow-2xl shadow-green-500/50'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="whitespace-nowrap">
                  {isRolling ? '🎲 ROLLING 🎲' : '🎯 ROLL DICE 🎯'}
                </span>
                {!isRolling && (
                  <span className="text-xs text-cyan-200 font-bold whitespace-nowrap">
                    {!user ? 'LOGIN REQUIRED' : 
                     getCurrentBetAmount() <= 0 ? 'ENTER VALID BET' :
                     profile && profile.epic_coins < getCurrentBetAmount() ? 'INSUFFICIENT FUNDS' : 
                     `Bet ${getCurrentBetAmount()} EC • ${prediction.toUpperCase()} ${targetNumber}`}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-black/60 border-2 border-green-400 rounded-2xl p-4 sm:p-6 backdrop-blur-sm max-w-2xl w-full">
            <h3 className="text-lg sm:text-xl font-black font-mono text-green-400 mb-4 text-center">ODDS & PAYOUTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-black/40 border border-blue-400 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-blue-400 font-black">UNDER</div>
                <div className="text-gray-300">Higher number = Lower payout</div>
                <div className="text-blue-300 font-bold">1.5x - 3x</div>
              </div>
              <div className="bg-black/40 border border-yellow-400 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-yellow-400 font-black">EXACT</div>
                <div className="text-gray-300">Hardest to hit</div>
                <div className="text-yellow-300 font-bold">5x - 10x</div>
              </div>
              <div className="bg-black/40 border border-green-400 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-green-400 font-black">OVER</div>
                <div className="text-gray-300">Lower number = Lower payout</div>
                <div className="text-green-300 font-bold">1.5x - 3x</div>
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

        {/* Floating dice symbols */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`absolute font-mono text-2xl font-bold animate-pulse ${
                i % 6 === 0 ? 'text-green-400' :
                i % 6 === 1 ? 'text-teal-400' :
                i % 6 === 2 ? 'text-cyan-400' :
                i % 6 === 3 ? 'text-blue-400' :
                i % 6 === 4 ? 'text-emerald-400' : 'text-lime-400'
              }`}
              style={{
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 19.3) % 100}%`,
                animationDelay: `${(i * 0.3) % 6}s`,
                textShadow: '0 0 10px currentColor'
              }}
            >
              {getDiceEmoji((i % 6) + 1)}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}