"use client"

import { useState } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

const slotSymbols = [
  { symbol: "🍒", name: "Cherry", value: 150, color: "text-red-400", weight: 20 },
  { symbol: "🍋", name: "Lemon", value: 120, color: "text-yellow-400", weight: 18 },
  { symbol: "🍊", name: "Orange", value: 180, color: "text-orange-400", weight: 16 },
  { symbol: "🍇", name: "Grape", value: 250, color: "text-purple-400", weight: 14 },
  { symbol: "🔔", name: "Bell", value: 400, color: "text-yellow-300", weight: 12 },
  { symbol: "💎", name: "Diamond", value: 800, color: "text-cyan-400", weight: 10 },
  { symbol: "7️⃣", name: "Seven", value: 1500, color: "text-red-300", weight: 8 },
  { symbol: "💰", name: "Money", value: 3000, color: "text-green-400", weight: 6 },
  { symbol: "🎰", name: "Jackpot", value: 5000, color: "text-rainbow-400", weight: 4 },
  { symbol: "👑", name: "Crown", value: 10000, color: "text-gold-400", weight: 2 }
]

export default function SlotsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [reels, setReels] = useState([0, 0, 0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [freeSpins, setFreeSpins] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [bonusFeature, setBonusFeature] = useState<'none' | 'free_spins' | 'multiplier'>('none')
  const [jackpot, setJackpot] = useState(50000)
  const [hiddenAds, setHiddenAds] = useState<string[]>([])
  const supabase = createClient()

  const hideAd = (adId: string) => {
    setHiddenAds(prev => [...prev, adId])
  }

  const SPIN_COST = 100

  const getWeightedRandomSymbol = () => {
    const totalWeight = slotSymbols.reduce((sum, symbol) => sum + symbol.weight, 0)
    let random = Math.random() * totalWeight
    
    for (let i = 0; i < slotSymbols.length; i++) {
      random -= slotSymbols[i].weight
      if (random <= 0) {
        return i
      }
    }
    return 0
  }

  const calculateWin = (reel1: number, reel2: number, reel3: number) => {
    let baseWin = 0
    let bonusType: 'none' | 'free_spins' | 'multiplier' = 'none'
    
    // Check for jackpot (three crowns)
    if (reel1 === 9 && reel2 === 9 && reel3 === 9) {
      baseWin = jackpot
      bonusType = 'multiplier'
      setMultiplier(5)
    }
    // Three of a kind
    else if (reel1 === reel2 && reel2 === reel3) {
      baseWin = slotSymbols[reel1].value * 5 // Increased from 3x to 5x
      
      // Bonus feature triggers
      if (reel1 === 8) { // Three jackpot symbols
        bonusType = 'free_spins'
        setFreeSpins(5)
      } else if (reel1 >= 6) { // High value symbols
        bonusType = 'multiplier'
        setMultiplier(3)
      }
    }
    // Two of a kind
    else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      const matchingSymbol = reel1 === reel2 ? reel1 : reel2 === reel3 ? reel2 : reel1
      baseWin = slotSymbols[matchingSymbol].value * 2 // Increased from 1x to 2x
      
      // Small chance for bonus on two of a kind
      if (matchingSymbol >= 7 && Math.random() < 0.3) {
        bonusType = 'multiplier'
        setMultiplier(2)
      }
    }
    // Any two high-value symbols (partial wins)
    else {
      const symbols = [reel1, reel2, reel3]
      const highValueCount = symbols.filter(s => s >= 6).length
      
      if (highValueCount >= 2) {
        const highestSymbol = Math.max(...symbols.filter(s => s >= 6))
        baseWin = Math.floor(slotSymbols[highestSymbol].value * 0.3) // 30% of symbol value
      }
    }
    
    setBonusFeature(bonusType)
    return Math.floor(baseWin * multiplier)
  }

  const spinSlots = async () => {
    if (isSpinning) return

    // Check if user is logged in and has enough coins
    if (!user || !profile) {
      alert('Please log in to play slots!')
      return
    }

    const currentSpinCost = freeSpins > 0 ? 0 : SPIN_COST
    
    if (freeSpins === 0 && profile.epic_coins < currentSpinCost) {
      alert(`Not enough Epic Coins! You need ${currentSpinCost} EC to spin.`)
      return
    }

    // Deduct coins before spinning (only if not free spin)
    if (freeSpins === 0) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ epic_coins: profile.epic_coins - currentSpinCost })
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
    } else {
      setFreeSpins(prev => prev - 1)
    }

    setIsSpinning(true)
    setShowCelebration(false)
    setWinAmount(0)
    setBonusFeature('none')
    setMultiplier(1)

    // Animate spinning for 3 seconds
    const spinInterval = setInterval(() => {
      setReels([getWeightedRandomSymbol(), getWeightedRandomSymbol(), getWeightedRandomSymbol()])
    }, 100)

    setTimeout(async () => {
      clearInterval(spinInterval)
      
      // Final result with weighted random
      const finalReels = [getWeightedRandomSymbol(), getWeightedRandomSymbol(), getWeightedRandomSymbol()]
      setReels(finalReels)
      setIsSpinning(false)

      // Calculate winnings
      const winnings = calculateWin(finalReels[0], finalReels[1], finalReels[2])
      setWinAmount(winnings)

      // Small jackpot increase
      setJackpot(prev => prev + Math.floor(currentSpinCost * 0.1))

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
      {/* Enhanced CSS for spectacular effects */}
      <style jsx>{`
        @keyframes neon-glow {
          0%, 100% { 
            text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor, 0 0 20px currentColor;
            filter: brightness(1);
          }
          50% { 
            text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor;
            filter: brightness(1.5);
          }
        }
        
        @keyframes reel-spin {
          0% { transform: translateY(0px); }
          25% { transform: translateY(-20px); }
          50% { transform: translateY(-40px); }
          75% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes slot-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), inset 0 0 40px rgba(255, 215, 0, 0.2);
          }
        }
        
        @keyframes jackpot-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1) saturate(1);
          }
          50% { 
            transform: scale(1.05);
            filter: brightness(1.3) saturate(1.5);
          }
        }
        
        @keyframes casino-lights {
          0% { opacity: 0.6; }
          25% { opacity: 1; }
          50% { opacity: 0.8; }
          75% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes symbol-glow {
          0%, 100% { 
            text-shadow: 0 0 10px currentColor;
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
            transform: scale(1.1);
          }
        }
        
        .neon-text {
          animation: neon-glow 2s ease-in-out infinite;
        }
        
        .reel-spinning {
          animation: reel-spin 0.1s linear infinite;
        }
        
        .slot-machine-glow {
          animation: slot-glow 3s ease-in-out infinite;
        }
        
        .jackpot-animation {
          animation: jackpot-pulse 2s ease-in-out infinite;
        }
        
        .casino-light {
          animation: casino-lights 1.5s ease-in-out infinite;
        }
        
        .symbol-highlight {
          animation: symbol-glow 1s ease-in-out infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black via-purple-950 to-pink-900 relative overflow-hidden">
        {/* Enhanced Casino Background with Spectacular Effects */}
        <div className="absolute inset-0">
          {/* Cohesive Green Casino Light Beams */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/40 via-teal-500/30 to-green-500/30 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-green-400/20 via-transparent via-emerald-500/25 to-teal-500/20 animate-ping" style={{animationDuration: '4s'}}></div>
          
          {/* Cohesive rotating casino spotlights */}
          <div className="absolute inset-0 bg-gradient-conic from-gold-400/25 via-transparent via-green-500/25 via-transparent to-emerald-500/25 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute inset-0 bg-gradient-conic from-emerald-500/20 via-transparent via-teal-500/20 via-transparent to-green-500/20 animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
          
          {/* Enhanced slot-themed pattern with neon effects */}
          <div className="absolute inset-0 opacity-40">
            <div className="grid grid-cols-16 grid-rows-16 h-full w-full">
              {Array.from({ length: 256 }).map((_, i) => (
                <div
                  key={i}
                  className={`border-2 casino-light ${
                    i % 10 === 0 ? 'border-gold-400/60 bg-gold-500/10 shadow-lg shadow-gold-400/20' :
                    i % 10 === 1 ? 'border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-400/20' :
                    i % 10 === 2 ? 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-400/20' :
                    i % 10 === 3 ? 'border-pink-400/60 bg-pink-500/10 shadow-lg shadow-pink-400/20' :
                    i % 10 === 4 ? 'border-yellow-400/60 bg-yellow-500/10 shadow-lg shadow-yellow-400/20' :
                    i % 10 === 5 ? 'border-green-400/60 bg-green-500/10 shadow-lg shadow-green-400/20' :
                    i % 10 === 6 ? 'border-red-400/60 bg-red-500/10 shadow-lg shadow-red-400/20' :
                    i % 10 === 7 ? 'border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-400/20' :
                    i % 10 === 8 ? 'border-indigo-400/60 bg-indigo-500/10 shadow-lg shadow-indigo-400/20' :
                    'border-orange-400/60 bg-orange-500/10 shadow-lg shadow-orange-400/20'
                  }`}
                  style={{
                    animationDelay: `${(i * 0.01) % 2}s`,
                    animationDuration: `${1.5 + (i * 0.005) % 1}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Floating casino elements with enhanced effects */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating coins with glow */}
            <div className="absolute top-1/6 left-1/5 w-12 h-12 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-full shadow-2xl shadow-gold-400/50 animate-bounce casino-light transform rotate-12"></div>
            <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full shadow-xl shadow-emerald-400/50 animate-pulse casino-light transform -rotate-12"></div>
            <div className="absolute bottom-1/3 left-1/6 w-16 h-16 border-4 border-teal-400 rounded-full shadow-2xl shadow-teal-400/50 animate-spin casino-light"></div>
            <div className="absolute top-1/2 right-1/5 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-xl shadow-green-400/50 animate-bounce casino-light"></div>
            <div className="absolute bottom-1/4 right-1/3 w-14 h-14 border-3 border-emerald-400 rounded-full shadow-2xl shadow-emerald-400/50 animate-pulse casino-light transform rotate-45"></div>
            
            {/* Cohesive green floating slot symbols */}
            <div className="absolute top-1/3 left-1/8 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-2xl shadow-green-400/50 animate-bounce casino-light flex items-center justify-center text-white font-bold">🍒</div>
            <div className="absolute bottom-1/5 right-1/8 w-12 h-12 bg-gradient-to-br from-yellow-400 to-gold-600 rounded-lg shadow-2xl shadow-yellow-400/50 animate-pulse casino-light flex items-center justify-center text-white font-bold">💎</div>
            <div className="absolute top-2/3 left-1/12 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-xl shadow-emerald-400/50 animate-bounce casino-light flex items-center justify-center text-white font-bold">7️⃣</div>
          </div>
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
          
          {/* Top Bar with Title and Neon Signs - Repositioned to avoid conflicts */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/90 to-transparent z-10">
            <div className="flex justify-between items-center p-4 h-full">
              {/* Left Neon Sign - Repositioned to avoid back button */}
              <div className="hidden lg:block bg-gradient-to-br from-black via-pink-900/50 to-black border-4 border-pink-400 rounded-lg p-3 jackpot-animation slot-machine-glow shadow-2xl shadow-pink-400/50 relative ml-32">
                <div className="text-pink-400 font-black text-xl font-mono neon-text">🎰 MEGA JACKPOT 🎰</div>
                <div className="text-pink-300 text-lg font-mono font-black neon-text">{jackpot.toLocaleString()} EC</div>
                {/* Particle effects around jackpot */}
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
              </div>
              
              {/* Center Title with Enhanced Neon Effects */}
              <div className="relative">
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-mono tracking-wider text-purple-400 drop-shadow-2xl neon-text"
                    style={{
                      textShadow: '0 0 20px rgba(168, 85, 247, 1), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)'
                    }}>
                  EPIC SLOTS
                </h1>
                {/* Sparkling effects around title */}
                <div className="absolute -top-4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-70"></div>
                <div className="absolute -top-2 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-70" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute -bottom-4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-70" style={{animationDelay: '0.6s'}}></div>
                <div className="absolute -bottom-2 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-70" style={{animationDelay: '0.9s'}}></div>
              </div>
              
              {/* Right Neon Sign - Repositioned to avoid auth buttons */}
              <div className="hidden lg:block bg-gradient-to-br from-black via-cyan-900/50 to-black border-4 border-cyan-400 rounded-lg p-3 slot-machine-glow shadow-2xl shadow-cyan-400/50 relative mr-48">
                <div className="text-cyan-400 font-black text-xl font-mono neon-text">
                  {freeSpins > 0 ? `🆓 ${freeSpins} FREE` : 
                   multiplier > 1 ? `⚡ ${multiplier}x MULT` : 
                   '💎 BONUSES 💎'}
                </div>
                <div className="text-cyan-300 text-sm font-mono neon-text">
                  {freeSpins > 0 ? 'SPINS LEFT!' : 
                   multiplier > 1 ? 'ACTIVE!' : 
                   'AVAILABLE!'}
                </div>
                {/* Enhanced particle effects */}
                <div className="absolute -top-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                
                {/* Extra glow for active bonuses */}
                {(freeSpins > 0 || multiplier > 1) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-green-400/20 rounded-lg animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Casino Floor Layout */}
          <div className="pt-32 pb-8 px-4 min-h-screen flex items-center justify-center">
            <div className="max-w-6xl w-full">
              
              {/* Main Slot Machine - Enhanced Vegas Style */}
              <div className="relative mx-auto max-w-3xl">
                {/* Slot Machine Cabinet with 3D Effects */}
                <div className="bg-gradient-to-b from-red-600 via-red-800 to-black border-8 border-yellow-400 rounded-t-3xl rounded-b-lg shadow-2xl shadow-red-500/50 relative overflow-hidden slot-machine-glow transform hover:scale-105 transition-transform duration-300">
                  
                  {/* Top Casino Header with Enhanced Effects */}
                  <div className="bg-gradient-to-r from-yellow-400 via-gold-500 to-yellow-400 h-16 flex items-center justify-center border-b-4 border-red-800 relative overflow-hidden">
                    <div className="text-black font-black text-2xl font-mono tracking-wider neon-text relative z-10">⭐ EPIC SLOTS ⭐</div>
                    {/* Animated light strip */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    {/* Corner lights */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  
                  {/* Screen Area with Enhanced Effects */}
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black m-6 rounded-xl border-4 border-cyan-400 p-6 relative overflow-hidden slot-machine-glow">
                    {/* Enhanced Decorative Lights */}
                    <div className="absolute -top-2 left-0 right-0 flex justify-around">
                      {Array.from({length: 7}).map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full shadow-lg casino-light ${
                          i % 3 === 0 ? 'bg-yellow-400 shadow-yellow-400/50' : 
                          i % 3 === 1 ? 'bg-pink-400 shadow-pink-400/50' : 
                          'bg-cyan-400 shadow-cyan-400/50'
                        }`} style={{animationDelay: `${i * 0.15}s`}} />
                      ))}
                    </div>
                    
                    {/* Screen scanlines effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-2 border-cyan-400 rotate-45 animate-spin" style={{animationDuration: '3s'}}></div>
                    <div className="absolute top-2 right-2 w-3 h-3 border-2 border-pink-400 rotate-45 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-2 border-yellow-400 rotate-45 animate-spin" style={{animationDuration: '3s'}}></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-2 border-green-400 rotate-45 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
                    
                    {/* Reels Display with 3D Effects */}
                    <div className="flex justify-center items-center space-x-4 py-8 relative">
                      {reels.map((reelIndex, i) => (
                        <div key={i} className="relative group">
                          {/* Enhanced Vegas-style Reel with 3D Effects */}
                          <div className={`bg-gradient-to-br from-white via-gray-100 to-white border-4 border-gray-800 rounded-lg w-24 h-32 sm:w-32 sm:h-40 flex items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-300 ${
                            isSpinning ? 'shadow-cyan-400/50 border-cyan-400 reel-spinning' : 'shadow-gray-800/50 group-hover:shadow-yellow-400/50'
                          }`} style={{
                            transform: isSpinning ? 'perspective(1000px) rotateX(5deg)' : 'perspective(1000px) rotateX(0deg)',
                            boxShadow: isSpinning ? 
                              '0 0 30px rgba(6, 182, 212, 0.8), inset 0 0 20px rgba(6, 182, 212, 0.2)' : 
                              '0 10px 25px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)'
                          }}>
                            {/* Enhanced Reel Strip Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent transition-all duration-300 ${
                              isSpinning ? 'animate-pulse opacity-70' : 'opacity-0'
                            }`} />
                            
                            {/* Spinning light streaks */}
                            {isSpinning && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-ping"></div>
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
                              </>
                            )}
                            
                            {/* Symbol with enhanced effects */}
                            <div className={`text-4xl sm:text-6xl text-center transition-all duration-300 z-10 relative ${
                              isSpinning ? 'blur-sm scale-110 reel-spinning' : 'blur-0 scale-100 symbol-highlight'
                            } ${slotSymbols[reelIndex].color}`} style={{
                              textShadow: isSpinning ? 
                                '0 0 20px currentColor, 0 0 40px currentColor' : 
                                '0 0 10px currentColor, 0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                              {slotSymbols[reelIndex].symbol}
                            </div>
                            
                            {/* Reel frame highlights */}
                            <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-yellow-400/50 transition-colors duration-300"></div>
                            
                            {/* Corner lights for special symbols */}
                            {reelIndex >= 8 && (
                              <>
                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-gold-400 rounded-full animate-ping"></div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gold-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                              </>
                            )}
                          </div>
                          
                          {/* Enhanced Reel Label */}
                          <div className="text-center mt-2">
                            <div className="text-yellow-400 font-mono text-xs font-bold neon-text">REEL {i + 1}</div>
                            {/* Reel status indicator */}
                            <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                              isSpinning ? 'bg-cyan-400 animate-ping' : 'bg-green-400'
                            }`}></div>
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
                  
                  {/* Enhanced Control Panel */}
                  <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-6 rounded-b-lg border-t-4 border-yellow-400 relative overflow-hidden">
                    {/* Control panel lighting */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-400/10 to-red-500/10 animate-pulse"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-pulse"></div>
                    
                    <div className="flex justify-center relative z-10">
                      <button
                        onClick={spinSlots}
                        disabled={isSpinning || (!user || (profile && profile.epic_coins < SPIN_COST))}
                        className={`px-12 py-6 text-3xl font-black font-mono rounded-full border-4 transition-all duration-300 transform shadow-2xl relative overflow-hidden ${
                          isSpinning
                            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                            : (!user || (profile && profile.epic_coins < SPIN_COST))
                            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 border-yellow-400 text-yellow-100 hover:scale-110 hover:shadow-yellow-400/50 slot-machine-glow'
                        }`}
                      >
                        {/* Button glow effect */}
                        {!isSpinning && (user && (!profile || profile.epic_coins >= SPIN_COST)) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse rounded-full"></div>
                        )}
                        
                        {/* Button text with enhanced effects */}
                        <span className="relative z-10 neon-text">
                          {isSpinning ? '🎰 SPINNING' : '🎯 SPIN'}
                        </span>
                        
                        {/* Button corner lights */}
                        {!isSpinning && (user && (!profile || profile.epic_coins >= SPIN_COST)) && (
                          <>
                            <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                            <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                            <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="text-center mt-4">
                      <div className="text-yellow-400 font-mono font-bold">
                        {!user ? 'LOGIN TO PLAY' : 
                         freeSpins > 0 ? `🆓 FREE SPIN! (${freeSpins} left)` :
                         profile && profile.epic_coins < SPIN_COST ? 'INSUFFICIENT FUNDS' : 
                         `COST: ${SPIN_COST} EC`}
                      </div>
                      {multiplier > 1 && (
                        <div className="text-green-400 font-mono text-sm font-bold mt-1 animate-pulse">
                          ⚡ {multiplier}x MULTIPLIER ACTIVE! ⚡
                        </div>
                      )}
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
                      <div key={index} className={`bg-black/60 border-2 ${
                        index >= 8 ? 'border-gold-400/70' : 'border-green-500/50'
                      } rounded-lg p-3 flex items-center justify-between`}>
                        <div className="flex items-center space-x-3">
                          <span className={`text-3xl ${symbol.color}`}>{symbol.symbol}</span>
                          <span className="text-green-300 font-mono font-bold">{symbol.name}</span>
                          {index >= 8 && <span className="text-gold-400 text-xs font-mono">JACKPOT!</span>}
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-black font-mono">
                            3x: {index === 9 ? 'JACKPOT!' : `${symbol.value * 5}EC`}
                          </div>
                          <div className="text-yellow-300 font-mono text-sm">2x: {symbol.value * 2}EC</div>
                          {index >= 6 && (
                            <div className="text-green-400 font-mono text-xs">+BONUS!</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right Panel - Casino Info */}
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 border-4 border-blue-400 rounded-2xl p-6 shadow-2xl shadow-blue-400/30">
                  <div className="text-center mb-6">
                    <div className="bg-black border-2 border-blue-400 rounded-lg p-3 inline-block">
                      <h3 className="text-blue-400 font-black text-2xl font-mono">🎰 EPIC FEATURES</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-blue-200">
                    <div className="bg-black/60 border border-blue-500/50 rounded-lg p-4">
                      <div className="text-yellow-400 font-bold font-mono mb-2">🎯 SUPER PAYOUTS</div>
                      <div className="text-sm font-mono">3 matching = 5x payout! 2 matching = 2x payout!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-green-500/50 rounded-lg p-4">
                      <div className="text-green-400 font-bold font-mono mb-2">🆓 FREE SPINS</div>
                      <div className="text-sm font-mono">Get 3 🎰 symbols for 5 free spins!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-purple-500/50 rounded-lg p-4">
                      <div className="text-purple-400 font-bold font-mono mb-2">⚡ MULTIPLIERS</div>
                      <div className="text-sm font-mono">High-value matches trigger 2x-5x multipliers!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-gold-500/50 rounded-lg p-4">
                      <div className="text-gold-400 font-bold font-mono mb-2">👑 MEGA JACKPOT</div>
                      <div className="text-sm font-mono">3 Crown symbols = {jackpot.toLocaleString()} EC!</div>
                    </div>
                    
                    <div className="bg-black/60 border border-cyan-500/50 rounded-lg p-4">
                      <div className="text-cyan-400 font-bold font-mono mb-2">🎁 PARTIAL WINS</div>
                      <div className="text-sm font-mono">Even 2 high-value symbols pay out!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Celebration Display */}
        {showCelebration && winAmount > 0 && (
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto px-4" onClick={hideCelebration}>
            {/* Enhanced Fireworks Effect */}
            <div className="absolute inset-0">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${0.5 + Math.random() * 1.5}s`
                  }}
                >
                  <div className={`w-4 h-4 rounded-full shadow-2xl ${
                    i % 6 === 0 ? 'bg-purple-400 shadow-purple-400/50' :
                    i % 6 === 1 ? 'bg-pink-400 shadow-pink-400/50' :
                    i % 6 === 2 ? 'bg-cyan-400 shadow-cyan-400/50' :
                    i % 6 === 3 ? 'bg-yellow-400 shadow-yellow-400/50' :
                    i % 6 === 4 ? 'bg-green-400 shadow-green-400/50' :
                    'bg-gold-400 shadow-gold-400/50'
                  }`} />
                </div>
              ))}
            </div>
            
            {/* Spectacular particle burst */}
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute animate-bounce"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 7.2}deg) translateY(-${80 + Math.random() * 200}px)`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${1 + Math.random() * 0.5}s`
                  }}
                >
                  <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                    i % 8 === 0 ? 'bg-purple-400 shadow-purple-400/50' :
                    i % 8 === 1 ? 'bg-pink-400 shadow-pink-400/50' :
                    i % 8 === 2 ? 'bg-cyan-400 shadow-cyan-400/50' :
                    i % 8 === 3 ? 'bg-yellow-400 shadow-yellow-400/50' :
                    i % 8 === 4 ? 'bg-green-400 shadow-green-400/50' :
                    i % 8 === 5 ? 'bg-gold-400 shadow-gold-400/50' :
                    i % 8 === 6 ? 'bg-red-400 shadow-red-400/50' :
                    'bg-orange-400 shadow-orange-400/50'
                  }`} />
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
                  {winAmount >= jackpot ? '👑 MEGA JACKPOT! 👑' : 
                   winAmount >= 5000 ? '🎰 EPIC WIN! 🎰' : 
                   winAmount >= 1000 ? '💎 BIG WIN! 💎' : 
                   '🎯 WINNER! 🎯'}
                </h2>
                <div className="text-4xl sm:text-6xl md:text-8xl font-black font-mono mb-2 sm:mb-4 animate-pulse bg-black/95 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white whitespace-nowrap"
                     style={{
                       color: '#FFFFFF',
                       textShadow: '0 0 40px #10B981, 0 0 80px #10B981, 0 0 10px #000000'
                     }}>
                  +{winAmount.toLocaleString()} EC
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white animate-pulse whitespace-nowrap">
                  {bonusFeature === 'free_spins' ? '🆓 FREE SPINS ACTIVATED! 🆓' :
                   bonusFeature === 'multiplier' ? `⚡ ${multiplier}x MULTIPLIER! ⚡` :
                   '💰 AMAZING PAYOUT! 💰'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Floating slot symbols with spectacular effects */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`absolute font-mono text-lg font-bold casino-light transform ${
                i % 10 === 0 ? 'text-red-400' :
                i % 10 === 1 ? 'text-yellow-400' :
                i % 10 === 2 ? 'text-orange-400' :
                i % 10 === 3 ? 'text-purple-400' :
                i % 10 === 4 ? 'text-cyan-400' :
                i % 10 === 5 ? 'text-green-400' :
                i % 10 === 6 ? 'text-pink-400' :
                i % 10 === 7 ? 'text-blue-400' :
                i % 10 === 8 ? 'text-gold-400' :
                'text-indigo-400'
              }`}
              style={{
                left: `${(i * 9.7) % 100}%`,
                top: `${(i * 13.3) % 100}%`,
                animationDelay: `${(i * 0.15) % 4}s`,
                textShadow: '0 0 15px currentColor, 0 0 25px currentColor',
                transform: `rotate(${(i * 23) % 360}deg) scale(${0.8 + (i % 3) * 0.2})`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            >
              {slotSymbols[i % slotSymbols.length].symbol}
            </div>
          ))}
        </div>
        
        {/* Dynamic light beams crossing the screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`beam-${i}`}
              className="absolute w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse"
              style={{
                left: `${(i * 16.66) % 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
                transform: `rotate(${(i * 15) % 30}deg)`,
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </div>

        {/* SATIRICAL CLUTTERED ADS EVERYWHERE */}
        
        {/* Top Section Ads - Positioned to avoid UI conflicts */}
        
        {/* Hot Deal Banner - Top Left (below back button) */}
        {!hiddenAds.includes('hot-deal-banner') && (
          <div className="absolute top-20 left-2 z-30 hidden md:block">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 border-4 border-yellow-400 rounded-xl p-3 animate-bounce shadow-2xl shadow-red-500/70 transform rotate-6 max-w-56 relative">
              <button 
                onClick={() => hideAd('hot-deal-banner')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black">
                <div className="text-2xl text-yellow-300 mb-2">🔥 HOT DEAL 🔥</div>
                <div className="text-lg mb-1">SPIN 1 TIME</div>
                <div className="text-2xl font-black text-yellow-400">WIN 1 MILLION*</div>
                <div className="text-xs text-red-200 mt-1">*in your dreams</div>
                <div className="text-sm mt-2 animate-pulse">CALL NOW!**</div>
                <div className="text-xs text-red-200">**we won't answer</div>
              </div>
            </div>
          </div>
        )}

        {/* Winner Testimonial - Top Right (below auth buttons) */}
        {!hiddenAds.includes('fake-winner') && (
          <div className="absolute top-20 right-2 z-30 hidden lg:block">
            <div className="bg-gradient-to-l from-green-500 to-lime-400 border-4 border-white rounded-2xl p-4 animate-pulse shadow-2xl shadow-green-500/70 transform -rotate-3 max-w-64 relative">
              <button 
                onClick={() => hideAd('fake-winner')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-black text-center font-mono font-black">
                <div className="text-2xl mb-2">💰 MEGA WINNER 💰</div>
                <div className="text-lg mb-2">"I WON BIG!"</div>
                <div className="text-xl font-black">50,000,000 EC</div>
                <div className="text-sm mb-2">- NotFakeUser69</div>
                <div className="text-xs text-green-800">*user may not exist</div>
                <div className="text-xs text-green-800">**results not typical</div>
                <div className="text-xs text-green-800">***definitely fake</div>
              </div>
            </div>
          </div>
        )}

        {/* Left Side Ads */}
        
        {/* Slot Strategy Guide */}
        {!hiddenAds.includes('slot-strategy') && (
          <div className="absolute top-1/3 left-2 z-20 hidden xl:block">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 border-4 border-cyan-400 rounded-2xl p-3 animate-pulse shadow-2xl shadow-purple-500/50 transform rotate-2 max-w-60 relative">
              <button 
                onClick={() => hideAd('slot-strategy')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black">
                <div className="text-cyan-300 font-black mb-2 text-lg">📚 SLOT SECRETS 📚</div>
                <div className="mb-2 text-sm">GUARANTEED WINS:</div>
                <div className="text-xs mb-1">• Spin at 3:33 AM</div>
                <div className="text-xs mb-1">• Wear lucky socks</div>
                <div className="text-xs mb-1">• Sacrifice your paycheck</div>
                <div className="text-xs mb-1">• Believe in yourself</div>
                <div className="text-xs mb-2">• Ignore math</div>
                <div className="text-cyan-300 text-xs">Works 0% of the time!</div>
                <div className="text-xs">*every time</div>
              </div>
            </div>
          </div>
        )}

        {/* Addiction Warning */}
        {!hiddenAds.includes('addiction-warning') && (
          <div className="absolute top-2/3 left-4 z-20 hidden md:block">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 border-4 border-yellow-400 rounded-2xl p-3 animate-pulse shadow-2xl shadow-orange-500/50 transform rotate-1 max-w-52 relative">
              <button 
                onClick={() => hideAd('addiction-warning')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black">
                <div className="text-yellow-300 font-black mb-2 text-lg">⚠️ WARNING ⚠️</div>
                <div className="mb-2 text-sm">SLOTS MAY CAUSE:</div>
                <div className="text-xs mb-1">• Bankruptcy</div>
                <div className="text-xs mb-1">• Broken dreams</div>
                <div className="text-xs mb-1">• Existential crisis</div>
                <div className="text-xs mb-1">• Addiction to losing</div>
                <div className="text-xs mb-2">• Sudden wealth*</div>
                <div className="text-yellow-300 text-xs">*not guaranteed</div>
                <div className="text-xs">**highly unlikely</div>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Ads */}
        
        {/* VIP Membership */}
        {!hiddenAds.includes('vip-membership') && (
          <div className="absolute top-1/4 right-8 z-20 hidden xl:block">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-gold-400 rounded-2xl p-4 animate-spin shadow-2xl shadow-purple-500/70 relative max-w-64" style={{animationDuration: '8s'}}>
              <button 
                onClick={() => hideAd('vip-membership')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black leading-tight">
                <div className="text-xl mb-2">💎 VIP CLUB 💎</div>
                <div className="text-sm mb-1">EXCLUSIVE BENEFITS:</div>
                <div className="text-xs mb-1">• Lose money faster</div>
                <div className="text-xs mb-1">• Premium bankruptcy</div>
                <div className="text-xs mb-1">• Golden handcuffs</div>
                <div className="text-xs mb-1">• Free debt counseling*</div>
                <div className="text-gold-400 text-xs mt-2">Only $999/month!</div>
                <div className="text-xs">*not actually free</div>
              </div>
            </div>
          </div>
        )}

        {/* Slot Insurance */}
        {!hiddenAds.includes('slot-insurance') && (
          <div className="absolute top-1/2 right-4 z-20 hidden lg:block">
            <div className="bg-gradient-to-l from-blue-500 to-cyan-500 border-4 border-yellow-400 rounded-xl p-3 animate-bounce shadow-2xl shadow-blue-500/70 transform -rotate-6 max-w-56 relative">
              <button 
                onClick={() => hideAd('slot-insurance')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black">
                <div className="text-lg mb-2">🛡️ SLOT INSURANCE</div>
                <div className="text-sm mb-1">PROTECT YOUR LOSSES!</div>
                <div className="text-xs mb-1">For only 200 EC per spin</div>
                <div className="text-xs mb-1">We'll insure your losses</div>
                <div className="text-xs mb-1">Against more losses!</div>
                <div className="text-yellow-300 text-xs mt-1">*Terms apply</div>
                <div className="text-xs">**All terms favor us</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section Ads */}
        
        {/* Daily Bonus */}
        {!hiddenAds.includes('daily-bonus') && (
          <div className="absolute bottom-1/4 left-8 z-20 hidden lg:block">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 border-4 border-red-500 rounded-xl p-3 animate-pulse shadow-2xl shadow-yellow-500/70 transform rotate-3 max-w-56 relative">
              <button 
                onClick={() => hideAd('daily-bonus')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-black text-center font-mono font-black">
                <div className="text-lg mb-2">🎁 DAILY BONUS 🎁</div>
                <div className="text-sm mb-1">LOG IN TODAY FOR:</div>
                <div className="text-xs mb-1">• 10 FREE SPINS*</div>
                <div className="text-xs mb-1">• 500 BONUS EC*</div>
                <div className="text-xs mb-1">• MYSTERY PRIZE*</div>
                <div className="text-red-600 text-xs mt-1">*Offer expired</div>
                <div className="text-red-600 text-xs">**Yesterday</div>
              </div>
            </div>
          </div>
        )}

        {/* Slot Addiction Helpline */}
        {!hiddenAds.includes('helpline') && (
          <div className="absolute bottom-1/3 right-12 z-20 hidden lg:block">
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-red-400 rounded-lg p-3 animate-pulse shadow-2xl shadow-gray-700/50 transform -rotate-2 max-w-48 relative">
              <button 
                onClick={() => hideAd('helpline')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black">
                <div className="text-red-400 text-lg mb-2">📞 NEED HELP? 📞</div>
                <div className="text-sm mb-1">GAMBLING ADDICTION</div>
                <div className="text-sm mb-1">HOTLINE:</div>
                <div className="text-yellow-400 text-sm mb-1">1-800-HELP-ME</div>
                <div className="text-xs text-gray-300">*Line currently busy</div>
                <div className="text-xs text-gray-300">**Try again never</div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Corner Ads */}
        
        {/* Achievement Badges */}
        {!hiddenAds.includes('achievement-noob') && (
          <div className="absolute top-3/4 left-6 z-20 hidden md:block">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 border-3 border-yellow-400 rounded-full p-3 animate-bounce shadow-xl shadow-green-500/50 transform rotate-12 relative">
              <button 
                onClick={() => hideAd('achievement-noob')}
                className="absolute -top-2 -right-2 w-3 h-3 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center leading-tight">
                <div>🏅 ACHIEVEMENT 🏅</div>
                <div>SLOT NOOB</div>
                <div>UNLOCKED!</div>
              </div>
            </div>
          </div>
        )}

        {/* Debt Collector */}
        {!hiddenAds.includes('debt-collector') && (
          <div className="absolute bottom-2/3 right-6 z-20 hidden xl:block">
            <div className="bg-gradient-to-l from-red-500 to-pink-500 border-3 border-black rounded-lg p-3 animate-pulse shadow-xl shadow-red-500/50 transform rotate-6 max-w-44 relative">
              <button 
                onClick={() => hideAd('debt-collector')}
                className="absolute -top-2 -right-2 w-3 h-3 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center">
                <div className="text-yellow-300 mb-1">💀 DEBT COLLECTOR 💀</div>
                <div>WE KNOW WHERE</div>
                <div>YOU LIVE</div>
                <div className="text-yellow-300 text-xs mt-1">Pay your debts!</div>
                <div className="text-xs">*Or else</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Ads */}
        
        {/* Mobile Testimonial */}
        {!hiddenAds.includes('mobile-testimonial') && (
          <div className="block md:hidden absolute top-32 left-2 right-2 z-20">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-yellow-400 rounded-lg p-3 animate-pulse shadow-lg shadow-purple-500/50 relative">
              <button 
                onClick={() => hideAd('mobile-testimonial')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-mono text-center">
                <div className="text-yellow-300 font-black mb-1">★★★★★ "LIFE CHANGING!"</div>
                <div>"I lost my house but gained so much experience!"</div>
                <div className="text-yellow-300 text-xs mt-1">- HomelessButHappy2024</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Warning */}
        {!hiddenAds.includes('mobile-warning') && (
          <div className="block md:hidden absolute bottom-32 left-2 right-2 z-20">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 border-2 border-yellow-400 rounded-lg p-2 animate-bounce shadow-lg shadow-red-500/50 relative">
              <button 
                onClick={() => hideAd('mobile-warning')}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center">
                <div className="text-yellow-300 mb-1">⚠️ MOBILE ALERT ⚠️</div>
                <div>SPINNING ON MOBILE</div>
                <div>DOUBLES YOUR LOSSES!</div>
                <div className="text-xs mt-1">*Science not included</div>
              </div>
            </div>
          </div>
        )}

        {/* Extra Cluttered Ads */}
        
        {/* Slot University */}
        {!hiddenAds.includes('slot-university') && (
          <div className="absolute top-1/5 left-1/4 z-20 hidden xl:block">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 border-3 border-pink-400 rounded-full p-2 animate-spin shadow-xl shadow-indigo-500/50 relative" style={{animationDuration: '6s'}}>
              <button 
                onClick={() => hideAd('slot-university')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center leading-tight">
                <div>🎓 SLOT U 🎓</div>
                <div>LEARN TO</div>
                <div>LOSE BETTER</div>
              </div>
            </div>
          </div>
        )}

        {/* Bankruptcy Speedrun */}
        {!hiddenAds.includes('bankruptcy-speedrun') && (
          <div className="absolute bottom-1/6 right-1/4 z-20 hidden xl:block">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 border-3 border-yellow-400 rounded-lg p-2 animate-pulse shadow-xl shadow-red-500/50 transform -rotate-12 relative">
              <button 
                onClick={() => hideAd('bankruptcy-speedrun')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center">
                <div>🏃 SPEEDRUN 🏃</div>
                <div>BANKRUPTCY</div>
                <div>WR: 2 MIN</div>
              </div>
            </div>
          </div>
        )}

        {/* Slot Therapy */}
        {!hiddenAds.includes('slot-therapy') && (
          <div className="absolute top-1/2 left-1/3 z-20 hidden xl:block">
            <div className="bg-gradient-to-br from-teal-500 to-blue-500 border-2 border-white rounded-lg p-2 animate-bounce shadow-lg shadow-teal-500/50 transform rotate-45 relative">
              <button 
                onClick={() => hideAd('slot-therapy')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-xs font-black rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center transform -rotate-45">
                <div>🛋️ THERAPY</div>
                <div>FOR SLOT</div>
                <div>ADDICTS</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}