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

        {/* Main content - CASINO TABLE LAYOUT */}
        <div className={`relative min-h-screen transition-all duration-1000 ${
          (isRolling || showCelebration) ? 'z-30' : 'z-20'
        }`}>
          
          {/* Casino Table Header */}
          <div className="text-center py-8 bg-gradient-to-b from-black/80 to-transparent">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-mono tracking-wider text-green-400 drop-shadow-2xl"
                style={{
                  textShadow: '0 0 20px rgba(34, 197, 94, 1), 0 0 40px rgba(34, 197, 94, 0.6)'
                }}>
              🎲 CRAPS TABLE 🎲
            </h1>
          </div>
          
          {/* Casino Table Surface */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            
            {/* Dice Rolling Area - Center Stage */}
            <div className="relative mb-8">
              {/* Table Felt */}
              <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-8 border-yellow-500 rounded-3xl p-8 shadow-2xl shadow-green-500/50 relative overflow-hidden">
                
                {/* Table Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                    {Array.from({length: 96}).map((_, i) => (
                      <div key={i} className="border border-yellow-400" />
                    ))}
                  </div>
                </div>
                
                {/* Dice Area */}
                <div className="relative z-10 text-center">
                  <div className="bg-black/40 border-4 border-gold-400 rounded-2xl p-8 mb-6 max-w-2xl mx-auto">
                    
                    {/* Dice Display */}
                    <div className="flex justify-center items-center space-x-8 mb-6">
                      {/* Dice 1 */}
                      <div className="relative">
                        <div className={`bg-white border-4 border-gray-800 rounded-xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl transform ${
                          isRolling ? 'animate-bounce scale-110' : 'scale-100'
                        }`}>
                          <div className={`text-4xl sm:text-6xl ${getDiceColor(dice1)} transition-all duration-300 ${
                            isRolling ? 'blur-sm' : 'blur-0'
                          }`}>
                            {getDiceEmoji(dice1)}
                          </div>
                        </div>
                        <div className="text-green-300 font-mono text-sm font-bold mt-2">DIE 1</div>
                      </div>

                      {/* Plus Symbol */}
                      <div className="text-6xl text-yellow-400 font-black animate-pulse">+</div>

                      {/* Dice 2 */}
                      <div className="relative">
                        <div className={`bg-white border-4 border-gray-800 rounded-xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl transform ${
                          isRolling ? 'animate-bounce scale-110' : 'scale-100'
                        }`}>
                          <div className={`text-4xl sm:text-6xl ${getDiceColor(dice2)} transition-all duration-300 ${
                            isRolling ? 'blur-sm' : 'blur-0'
                          }`}>
                            {getDiceEmoji(dice2)}
                          </div>
                        </div>
                        <div className="text-green-300 font-mono text-sm font-bold mt-2">DIE 2</div>
                      </div>

                      {/* Equals Symbol */}
                      <div className="text-6xl text-yellow-400 font-black animate-pulse">=</div>

                      {/* Total */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-gold-400 to-yellow-600 border-4 border-yellow-300 rounded-xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-2xl">
                          <div className={`text-4xl sm:text-6xl font-black text-black transition-all duration-300 ${
                            isRolling ? 'blur-sm' : 'blur-0'
                          }`}>
                            {dice1 + dice2}
                          </div>
                        </div>
                        <div className="text-yellow-400 font-mono text-sm font-bold mt-2">TOTAL</div>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Betting Board - Casino Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Side - Betting Controls */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Betting Amount Section */}
                <div className="bg-gradient-to-br from-red-900 to-red-800 border-4 border-red-400 rounded-2xl p-6 shadow-2xl shadow-red-400/30">
                  <div className="text-center mb-4">
                    <h3 className="text-red-300 font-black text-xl font-mono border-b-2 border-red-400 pb-2">💰 PLACE YOUR BET 💰</h3>
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
                              className={`p-3 rounded-full border-4 font-black text-xs transition-all ${
                                betAmount === amount
                                  ? 'bg-yellow-400 border-yellow-300 text-black scale-110'
                                  : 'bg-red-600 border-red-400 text-white hover:scale-105'
                              }`}
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

                {/* Betting Board - Three Sections */}
                <div className="grid grid-cols-3 gap-4">
                  
                  {/* UNDER Section */}
                  <button
                    onClick={() => setPrediction('under')}
                    disabled={isRolling}
                    className={`p-6 rounded-2xl border-4 font-black transition-all transform hover:scale-105 ${
                      prediction === 'under' 
                        ? 'bg-blue-500 border-blue-300 text-white shadow-blue-400/50 shadow-2xl' 
                        : 'bg-blue-900/50 border-blue-400 text-blue-300 hover:bg-blue-500/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📉</div>
                      <div className="text-lg font-mono">UNDER</div>
                      <div className="text-3xl font-black">{targetNumber}</div>
                      <div className="text-sm mt-2">
                        {targetNumber >= 8 ? '1.5x' : targetNumber >= 6 ? '2x' : '3x'} PAYOUT
                      </div>
                    </div>
                  </button>
                  
                  {/* EXACT Section */}
                  <button
                    onClick={() => setPrediction('exact')}
                    disabled={isRolling}
                    className={`p-6 rounded-2xl border-4 font-black transition-all transform hover:scale-105 ${
                      prediction === 'exact' 
                        ? 'bg-yellow-500 border-yellow-300 text-black shadow-yellow-400/50 shadow-2xl' 
                        : 'bg-yellow-900/50 border-yellow-400 text-yellow-300 hover:bg-yellow-500/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-lg font-mono">EXACT</div>
                      <div className="text-3xl font-black">{targetNumber}</div>
                      <div className="text-sm mt-2">
                        {targetNumber === 7 ? '5x' : targetNumber === 6 || targetNumber === 8 ? '6x' : targetNumber === 5 || targetNumber === 9 ? '8x' : '10x'} PAYOUT
                      </div>
                    </div>
                  </button>
                  
                  {/* OVER Section */}
                  <button
                    onClick={() => setPrediction('over')}
                    disabled={isRolling}
                    className={`p-6 rounded-2xl border-4 font-black transition-all transform hover:scale-105 ${
                      prediction === 'over' 
                        ? 'bg-green-500 border-green-300 text-white shadow-green-400/50 shadow-2xl' 
                        : 'bg-green-900/50 border-green-400 text-green-300 hover:bg-green-500/20'
                    }`}
                  >
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
                
                {/* Roll Button */}
                <div className="bg-gradient-to-br from-black to-gray-900 border-4 border-gold-400 rounded-2xl p-6 shadow-2xl shadow-gold-400/30 text-center">
                  <div className="mb-4">
                    <h3 className="text-gold-400 font-black text-xl font-mono">🎲 ROLL EM! 🎲</h3>
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

                {/* Odds Display */}
                <div className="mt-6 bg-gradient-to-br from-purple-900 to-purple-800 border-4 border-purple-400 rounded-2xl p-6 shadow-2xl shadow-purple-400/30">
                  <h3 className="text-purple-300 font-black text-lg font-mono text-center mb-4">📊 HOUSE ODDS 📊</h3>
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