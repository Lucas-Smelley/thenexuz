"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

export default function CrashPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [multiplier, setMultiplier] = useState(1.00)
  const [isRising, setIsRising] = useState(false)
  const [isCrashed, setIsCrashed] = useState(false)
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'playing' | 'crashed'>('waiting')
  const [betAmount, setBetAmount] = useState(100)
  const [customBetAmount, setCustomBetAmount] = useState('')
  const [useCustomBet, setUseCustomBet] = useState(false)
  const [hasBet, setHasBet] = useState(false)
  const [hasCashedOut, setHasCashedOut] = useState(false)
  const [cashOutMultiplier, setCashOutMultiplier] = useState(0)
  const [winAmount, setWinAmount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [gameHistory, setGameHistory] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const gameTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const getCurrentBetAmount = () => {
    if (useCustomBet) {
      const customAmount = parseInt(customBetAmount)
      return isNaN(customAmount) || customAmount <= 0 ? 0 : customAmount
    }
    return betAmount
  }

  const generateCrashPoint = () => {
    // Generate crash point with realistic distribution
    const random = Math.random()
    if (random < 0.33) return 1.00 + Math.random() * 0.5 // 1.00-1.50 (33%)
    if (random < 0.6) return 1.5 + Math.random() * 1.5   // 1.50-3.00 (27%)
    if (random < 0.8) return 3.0 + Math.random() * 2.0   // 3.00-5.00 (20%)
    if (random < 0.95) return 5.0 + Math.random() * 5.0  // 5.00-10.00 (15%)
    return 10.0 + Math.random() * 90.0                   // 10.00-100.00 (5%)
  }

  const startGame = () => {
    if (gameState !== 'ready') return

    setMultiplier(1.00)
    setIsRising(true)
    setIsCrashed(false)
    setGameState('playing')
    setHasCashedOut(false)
    setCashOutMultiplier(0)
    setWinAmount(0)
    setShowCelebration(false)

    const crashPoint = generateCrashPoint()
    // 3 seconds per 1.00x increase (1x->2x takes 3sec, 2x->3x takes 3sec, etc.)
    // So from 1.00x to crashPoint takes: (crashPoint - 1.00) * 3 seconds
    const gameDuration = (crashPoint - 1.00) * 3 * 1000 // Convert to milliseconds

    let currentMultiplier = 1.00
    const updateInterval = 50 // Update every 50ms for smooth animation
    const increment = 1.00 / (3000 / updateInterval) // 1.00x per 3 seconds

    intervalRef.current = setInterval(() => {
      currentMultiplier += increment
      if (currentMultiplier >= crashPoint) {
        currentMultiplier = crashPoint
        crashGame(crashPoint)
      } else {
        setMultiplier(currentMultiplier)
      }
    }, updateInterval)
  }

  const placeBetAndStart = async () => {
    if (!user || !profile || hasBet || gameState !== 'waiting') return

    const currentBet = getCurrentBetAmount()
    if (currentBet <= 0) {
      alert('Please enter a valid bet amount!')
      return
    }

    if (profile.epic_coins < currentBet) {
      alert(`Not enough Epic Coins! You need ${currentBet} EC to bet.`)
      return
    }

    // Deduct coins
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
      setHasBet(true)
      setGameState('ready')
    } catch (error) {
      alert(`Error processing bet: ${error}. Please try again.`)
      return
    }
  }

  const crashGame = (finalMultiplier: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setMultiplier(finalMultiplier)
    setIsRising(false)
    setIsCrashed(true)
    setGameState('crashed')
    
    // Add to history
    setGameHistory(prev => [finalMultiplier, ...prev.slice(0, 9)])

    // If player didn't cash out, they lose (money was already deducted when betting)
  }

  const resetGame = () => {
    setMultiplier(1.00)
    setIsRising(false)
    setIsCrashed(false)
    setGameState('waiting')
    setHasBet(false)
    setHasCashedOut(false)
    setCashOutMultiplier(0)
    setWinAmount(0)
    setShowCelebration(false)
  }


  const cashOut = async () => {
    if (!hasBet || hasCashedOut || !isRising) return

    const currentBet = getCurrentBetAmount()
    const winnings = Math.floor(currentBet * multiplier)
    
    setHasCashedOut(true)
    setCashOutMultiplier(multiplier)
    setWinAmount(winnings)
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

  const hideCelebration = () => {
    setShowCelebration(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current)
    }
  }, [])

  const getMultiplierColor = () => {
    if (isCrashed) return 'text-red-400'
    if (multiplier < 2) return 'text-green-400'
    if (multiplier < 5) return 'text-yellow-400'
    if (multiplier < 10) return 'text-orange-400'
    return 'text-red-300'
  }

  const getGraphHeight = () => {
    if (multiplier <= 1) return 10
    return Math.min(90, 10 + (multiplier - 1) * 8)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black via-gray-950 to-slate-900 relative overflow-hidden">
        {/* Crash-themed background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/25 via-yellow-500/20 to-gray-500/15 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-red-400/15 via-transparent via-orange-500/18 to-gray-500/12 animate-ping" style={{animationDuration: '6s'}}></div>
          
          {/* Crash-inspired diagonal lines pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
              {Array.from({ length: 400 }).map((_, i) => {
                const row = Math.floor(i / 20)
                const col = i % 20
                const isDiagonalPattern = ((row + col) % 4 === 0 || (row - col) % 4 === 0)
                return (
                  <div
                    key={i}
                    className={`${isDiagonalPattern ? 'border-t border-r' : 'border-l border-b'} ${
                      isDiagonalPattern ? 
                        i % 3 === 0 ? 'border-red-400/50 bg-red-500/10' :
                        i % 3 === 1 ? 'border-orange-400/50 bg-orange-500/10' :
                        'border-yellow-400/50 bg-yellow-500/10' :
                        i % 4 === 0 ? 'border-gray-400/30 bg-gray-500/5' :
                        i % 4 === 1 ? 'border-slate-400/30 bg-slate-500/5' :
                        i % 4 === 2 ? 'border-zinc-400/30 bg-zinc-500/5' :
                        'border-stone-400/30 bg-stone-500/5'
                    } animate-pulse`}
                    style={{
                      animationDelay: `${(i * 0.02) % 4}s`,
                      animationDuration: `${4 + (i * 0.01) % 2}s`
                    }}
                  />
                )
              })}
            </div>
          </div>
          
          {/* Rotating crash-like overlays */}
          <div className="absolute inset-0 bg-gradient-conic from-red-500/20 via-orange-500/15 via-yellow-500/10 to-gray-500/15 animate-spin" style={{animationDuration: '22s'}}></div>
          <div className="absolute inset-0 bg-gradient-conic from-gray-500/10 via-red-500/15 via-orange-500/10 to-yellow-500/10 animate-spin" style={{animationDuration: '40s', animationDirection: 'reverse'}}></div>
          
          {/* Floating crash elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/6 left-1/5 w-8 h-8 bg-red-400/25 transform rotate-45 animate-bounce opacity-60 shadow-2xl shadow-red-400/50"></div>
            <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-orange-400/25 transform -rotate-12 animate-pulse opacity-70 shadow-xl shadow-orange-400/50"></div>
            <div className="absolute bottom-1/3 left-1/6 w-10 h-10 border-3 border-yellow-400/30 transform rotate-45 animate-spin opacity-50 shadow-2xl shadow-yellow-400/50"></div>
            <div className="absolute top-1/2 right-1/5 w-4 h-4 bg-gray-400/25 animate-bounce opacity-65 shadow-xl shadow-gray-400/50"></div>
            <div className="absolute bottom-1/4 right-1/3 w-12 h-12 border-2 border-red-400/20 animate-pulse opacity-55 shadow-2xl shadow-red-400/50 transform rotate-12"></div>
          </div>
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4 z-30">
          <a
            href="/epicrngworld"
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-black/80 border-2 border-red-400 hover:border-orange-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-red-400/50 hover:shadow-orange-400/50 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-xs sm:text-sm font-mono font-black text-red-400 whitespace-nowrap">BACK TO RNG WORLD</span>
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
                  className="bg-black/80 border-2 border-orange-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-orange-400/50 backdrop-blur-sm hover:border-red-400 transition-colors"
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    <span className="text-xs sm:text-sm font-black text-orange-400 max-w-20 sm:max-w-none truncate">{profile.username}</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-orange-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-black/90 border-2 border-orange-400 rounded-lg shadow-2xl shadow-orange-400/50 backdrop-blur-sm min-w-[160px] max-w-[200px] z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-orange-400/30">
                        <div className="text-xs text-orange-300 font-mono">Signed in as</div>
                        <div className="text-sm font-black text-orange-400 font-mono truncate">{profile.username}</div>
                        <div className="text-xs text-orange-300 font-mono truncate">{user.email}</div>
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
            <div className="bg-black/80 border-2 border-red-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-red-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-black text-red-400 whitespace-nowrap">📈 CRASH! 📈</span>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="relative min-h-screen flex flex-col justify-center items-center px-4 z-20">
          
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-2 sm:mb-4 font-mono tracking-wider text-red-400 drop-shadow-2xl animate-pulse whitespace-nowrap"
                style={{
                  textShadow: '0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.6)'
                }}>
              EPIC CRASH
            </h1>
            <div className="h-1 sm:h-2 w-32 sm:w-64 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 to-gray-500 mx-auto animate-pulse rounded-full shadow-2xl"></div>
          </div>

          {/* Game Display */}
          <div className="bg-black/80 border-4 border-red-400 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-400/50 backdrop-blur-sm mb-6 sm:mb-8 max-w-4xl w-full">
            
            {/* Graph Area */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-orange-400 rounded-2xl p-4 sm:p-6 mb-6 h-64 sm:h-80 relative overflow-hidden">
              {/* Graph Line */}
              <div className="relative h-full">
                <div 
                  className={`absolute bottom-0 left-0 w-full transition-all duration-100 ${
                    isCrashed ? 'bg-red-500/30' : 'bg-green-500/30'
                  }`}
                  style={{
                    height: `${getGraphHeight()}%`,
                    clipPath: isRising ? 'polygon(0 100%, 100% 0, 100% 100%)' : 'polygon(0 100%, 70% 0, 100% 100%)'
                  }}
                />
                
                {/* Multiplier Display */}
                <div className="absolute top-4 left-4">
                  <div className={`text-4xl sm:text-6xl md:text-8xl font-black font-mono ${getMultiplierColor()} transition-colors duration-300`}
                       style={{
                         textShadow: `0 0 20px currentColor, 0 0 40px currentColor`
                       }}>
                    {multiplier.toFixed(2)}x
                  </div>
                  {gameState === 'crashed' && (
                    <div className="text-xl sm:text-2xl font-black text-red-400 animate-pulse">
                      💥 CRASHED! 💥
                    </div>
                  )}
                  {gameState === 'waiting' && (
                    <div className="text-lg sm:text-xl font-black text-blue-400">
                      🎯 PLACE BET TO START 🎯
                    </div>
                  )}
                  {gameState === 'ready' && (
                    <div className="text-lg sm:text-xl font-black text-yellow-400 animate-pulse">
                      🚀 READY TO LAUNCH! 🚀
                    </div>
                  )}
                </div>

                {/* Rising indicator */}
                {isRising && (
                  <div className="absolute top-4 right-4">
                    <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 animate-bounce" />
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Betting Controls */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-red-400 mb-4 font-mono">BET AMOUNT (EC)</h3>
                <div className="space-y-2">
                  {/* Toggle between preset and custom */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUseCustomBet(false)}
                      disabled={isRising}
                      className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                        !useCustomBet 
                          ? 'bg-red-500 border-red-400 text-white' 
                          : 'bg-black/60 border-red-400 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      PRESET
                    </button>
                    <button
                      onClick={() => setUseCustomBet(true)}
                      disabled={isRising}
                      className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                        useCustomBet 
                          ? 'bg-orange-500 border-orange-400 text-white' 
                          : 'bg-black/60 border-orange-400 text-orange-400 hover:bg-orange-500/20'
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
                      disabled={isRising}
                      className="w-full bg-gradient-to-br from-gray-900 to-black border-2 border-red-400 rounded-lg px-3 py-2 text-red-300 font-mono text-center font-bold hover:border-orange-400 focus:border-yellow-400 focus:outline-none transition-colors"
                    >
                      <option value={25} className="bg-gray-900 text-red-300">💰 25 EC</option>
                      <option value={50} className="bg-gray-900 text-red-300">🎯 50 EC</option>
                      <option value={100} className="bg-gray-900 text-red-300">🔥 100 EC</option>
                      <option value={250} className="bg-gray-900 text-red-300">💎 250 EC</option>
                      <option value={500} className="bg-gray-900 text-red-300">💸 500 EC</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      placeholder="Enter amount..."
                      value={customBetAmount}
                      onChange={(e) => setCustomBetAmount(e.target.value)}
                      disabled={isRising}
                      min="1"
                      max={profile?.epic_coins || 999999}
                      className="w-full bg-gradient-to-br from-gray-900 to-black border-2 border-orange-400 rounded-lg px-3 py-2 text-orange-300 font-mono text-center font-bold hover:border-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors placeholder-orange-500"
                    />
                  )}
                </div>

                {/* Bet/Start Buttons */}
                {gameState === 'waiting' && (
                  <button
                    onClick={placeBetAndStart}
                    disabled={!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0}
                    className={`w-full mt-4 py-3 text-lg font-black font-mono rounded-xl transition-all duration-300 ${
                      (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)
                        ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 border-2 border-yellow-400 text-white hover:scale-105 hover:shadow-2xl shadow-red-500/50'
                    }`}
                  >
                    {!user ? 'LOGIN REQUIRED' :
                     getCurrentBetAmount() <= 0 ? 'ENTER VALID BET' :
                     profile && profile.epic_coins < getCurrentBetAmount() ? 'INSUFFICIENT FUNDS' :
                     `🎯 BET ${getCurrentBetAmount()} EC & START`}
                  </button>
                )}
                
                {gameState === 'ready' && (
                  <button
                    onClick={startGame}
                    className="w-full mt-4 py-3 text-lg font-black font-mono rounded-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-yellow-400 text-white hover:scale-105 hover:shadow-2xl shadow-green-500/50 animate-pulse"
                  >
                    🚀 START GAME! 🚀
                  </button>
                )}
                
                {(gameState === 'playing' || gameState === 'crashed') && (
                  <button
                    onClick={resetGame}
                    disabled={gameState === 'playing'}
                    className={`w-full mt-4 py-3 text-lg font-black font-mono rounded-xl transition-all duration-300 ${
                      gameState === 'playing'
                        ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-cyan-400 text-white hover:scale-105 hover:shadow-2xl shadow-blue-500/50'
                    }`}
                  >
                    {gameState === 'playing' ? 
                     `💰 BET ACTIVE (${getCurrentBetAmount()} EC)` : 
                     '🔄 NEW GAME'}
                  </button>
                )}
              </div>

              {/* Cash Out */}
              <div className="lg:col-span-1 flex flex-col justify-center">
                <button
                  onClick={cashOut}
                  disabled={gameState !== 'playing' || hasCashedOut}
                  className={`w-full py-6 text-2xl font-black font-mono rounded-xl transition-all duration-300 transform ${
                    gameState !== 'playing' || hasCashedOut
                      ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 border-4 border-yellow-400 text-white hover:scale-110 hover:shadow-2xl shadow-green-500/50 animate-pulse'
                  }`}
                >
                  {hasCashedOut ? `💰 CASHED OUT AT ${cashOutMultiplier.toFixed(2)}x` :
                   gameState === 'waiting' ? '💸 PLACE BET FIRST' :
                   gameState === 'ready' ? '⏳ START GAME FIRST' :
                   gameState === 'crashed' ? '💥 GAME OVER' :
                   `💰 CASH OUT ${(getCurrentBetAmount() * multiplier).toFixed(0)} EC`}
                </button>
              </div>

              {/* Game History */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-orange-400 mb-4 font-mono">RECENT CRASHES</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {gameHistory.map((crash, index) => (
                    <div key={index} className={`p-2 rounded border font-mono text-center ${
                      crash < 2 ? 'bg-red-500/20 border-red-400 text-red-300' :
                      crash < 5 ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' :
                      crash < 10 ? 'bg-green-500/20 border-green-400 text-green-300' :
                      'bg-purple-500/20 border-purple-400 text-purple-300'
                    }`}>
                      {crash.toFixed(2)}x
                    </div>
                  ))}
                  {gameHistory.length === 0 && (
                    <div className="text-gray-500 text-center font-mono text-sm">
                      No games yet...
                    </div>
                  )}
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
                    i % 4 === 1 ? 'bg-yellow-400' :
                    i % 4 === 2 ? 'bg-orange-400' : 'bg-red-400'
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
                  💰 CASHED OUT! 💰
                </h2>
                <div className="text-4xl sm:text-6xl md:text-8xl font-black font-mono mb-2 sm:mb-4 animate-pulse bg-black/95 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white whitespace-nowrap"
                     style={{
                       color: '#FFFFFF',
                       textShadow: '0 0 40px #10B981, 0 0 80px #10B981, 0 0 10px #000000'
                     }}>
                  +{winAmount.toLocaleString()} EC
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white animate-pulse whitespace-nowrap">
                  📈 PERFECT TIMING! 📈
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating crash symbols */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute font-mono text-2xl font-bold animate-pulse ${
                i % 5 === 0 ? 'text-red-400' :
                i % 5 === 1 ? 'text-orange-400' :
                i % 5 === 2 ? 'text-yellow-400' :
                i % 5 === 3 ? 'text-green-400' : 'text-gray-400'
              }`}
              style={{
                left: `${(i * 14.7) % 100}%`,
                top: `${(i * 23.1) % 100}%`,
                animationDelay: `${(i * 0.4) % 8}s`,
                textShadow: '0 0 10px currentColor'
              }}
            >
              {['📈', '💥', '🚀', '💰', '📉', '🎯', '💸', '🔥'][i % 8]}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}