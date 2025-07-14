"use client"

import { useState } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

const wheelSegments = [
  // Start with the MEGA JACKPOT at 12 o'clock
  { text: "100000 EC", color: "rainbow", weight: 1 }, // rainbow - mega jackpot (top)
  
  // Right side descending (clockwise from top)
  { text: "DOUBLE", color: "#8B5CF6", weight: 1.5 }, // violet - special but not too flashy
  { text: "1000 EC", color: "#3B82F6", weight: 3 }, // blue - excellent win
  { text: "600 EC", color: "#0EA5E9", weight: 4 }, // sky blue - good win
  { text: "500 EC", color: "#10B981", weight: 5 }, // emerald - decent win
  { text: "400 EC", color: "#059669", weight: 4 }, // green - small win
  { text: "150 EC", color: "#84CC16", weight: 3 }, // lime - break even
  { text: "-500 EC", color: "#EA580C", weight: 2 }, // orange - loss
  
  // Bottom - BIG LOSS directly opposite the mega jackpot (6 o'clock)
  { text: "LOSE 5000", color: "#7F1D1D", weight: 1 }, // dark red - massive loss
  
  { text: "-500 EC", color: "#EA580C", weight: 2 }, // orange - loss
  { text: "150 EC", color: "#84CC16", weight: 3 }, // lime - break even
  { text: "400 EC", color: "#059669", weight: 4 }, // green - small win
  { text: "500 EC", color: "#10B981", weight: 5 }, // emerald - decent win
  { text: "600 EC", color: "#0EA5E9", weight: 4 }, // sky blue - good win
  { text: "1000 EC", color: "#3B82F6", weight: 3 }, // blue - excellent win
  { text: "DOUBLE", color: "#8B5CF6", weight: 1.5 }, // violet - special but not too flashy
]

export default function WheelPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const supabase = createClient()

  const SPIN_COST = 200

  // Calculate total weight and create cumulative segments
  const totalWeight = wheelSegments.reduce((sum, segment) => sum + segment.weight, 0)
  const cumulativeSegments = wheelSegments.reduce((acc, segment, index) => {
    const startAngle = index === 0 ? 0 : acc[index - 1].endAngle
    const segmentAngle = (segment.weight / totalWeight) * 360
    const endAngle = startAngle + segmentAngle
    acc.push({
      ...segment,
      startAngle,
      endAngle,
      segmentAngle
    })
    return acc
  }, [] as Array<typeof wheelSegments[0] & { startAngle: number; endAngle: number; segmentAngle: number }>)

  // Calculate which segment is currently selected by the indicator
  const getCurrentSegment = (rotationDegrees: number) => {
    const normalizedRotation = ((rotationDegrees % 360) + 360) % 360
    // Triangle is at 3 o'clock (0 degrees), adjust for clockwise rotation
    const adjustedRotation = (360 - normalizedRotation + 90) % 360
    
    // Find which segment contains this angle
    const selectedSegment = cumulativeSegments.find(segment => 
      adjustedRotation >= segment.startAngle && adjustedRotation < segment.endAngle
    )
    return selectedSegment || cumulativeSegments[0]
  }

  const spinWheel = async () => {
    if (isSpinning) return

    // Check if user is logged in and has enough coins
    if (!user || !profile) {
      alert('Please log in to spin the wheel!')
      return
    }

    if (profile.epic_coins < SPIN_COST) {
      alert(`Not enough Epic Coins! You need ${SPIN_COST} EC to spin.`)
      return
    }

    // Deduct coins before spinning
    try {
      console.log('Attempting to deduct coins:', SPIN_COST, 'from user:', user.id)
      console.log('Current profile coins:', profile.epic_coins)
      
      const { data, error } = await supabase
        .from('users')
        .update({ epic_coins: profile.epic_coins - SPIN_COST })
        .eq('id', user.id)
        .select()

      if (error) {
        console.error('Supabase error details:', error)
        alert(`Error processing payment: ${error.message}. Please try again.`)
        return
      }

      console.log('Successfully deducted coins, updated profile:', data)
      
      // Refresh profile to update UI
      await refreshProfile()
    } catch (error) {
      console.error('Catch block error:', error)
      alert(`Error processing payment: ${error}. Please try again.`)
      return
    }

    setIsSpinning(true)
    // Only hide celebration, don't reset other states if we're already celebrating
    if (showCelebration) {
      setShowCelebration(false)
      setSelectedSegment(null)
    } else {
      setShowCelebration(false)
      setSelectedSegment(null)
    }

    // Random rotation between 2520 and 3600 degrees (7-10 full spins)
    const randomRotation = Math.floor(Math.random() * 1080) + 2520
    const newRotation = rotation + randomRotation

    setRotation(newRotation)

    // Stop spinning after 10 seconds
    setTimeout(async () => {
      setIsSpinning(false)
      const finalSegment = getCurrentSegment(newRotation)
      setSelectedSegment(finalSegment)
      setShowCelebration(true)

      // Award winnings/penalties based on result
      try {
        // Get current coins to avoid race conditions
        const { data: currentProfile } = await supabase
          .from('users')
          .select('epic_coins')
          .eq('id', user.id)
          .single()

        if (currentProfile) {
          let newCoinAmount = currentProfile.epic_coins

          if (finalSegment.text === 'BANKRUPT') {
            // Already deducted 200 EC, no additional change needed
            newCoinAmount = currentProfile.epic_coins
          } else if (finalSegment.text === 'LOSE ALL') {
            // Lose all coins
            newCoinAmount = 0
          } else if (finalSegment.text === 'LOSE 500') {
            // Lose additional 500 EC (already lost 200 from spin cost)
            newCoinAmount = Math.max(0, currentProfile.epic_coins - 500)
          } else if (finalSegment.text === 'LOSE 5000') {
            // Lose additional 5000 EC (already lost 200 from spin cost)
            newCoinAmount = Math.max(0, currentProfile.epic_coins - 5000)
          } else if (finalSegment.text === 'DOUBLE') {
            // Double current coins (after spin cost was deducted)
            newCoinAmount = currentProfile.epic_coins * 2
          } else if (finalSegment.text.includes(' EC')) {
            // Regular EC prize
            const winAmount = parseInt(finalSegment.text.replace(' EC', ''))
            newCoinAmount = currentProfile.epic_coins + winAmount
          }

          // Update coins if there's a change
          if (newCoinAmount !== currentProfile.epic_coins) {
            const { error } = await supabase
              .from('users')
              .update({ epic_coins: newCoinAmount })
              .eq('id', user.id)

            if (!error) {
              await refreshProfile()
            }
          }
        }
      } catch (error) {
        console.error('Error processing winnings:', error)
      }
    }, 10000)
  }

  const hideCelebration = () => {
    setShowCelebration(false)
    setSelectedSegment(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 relative overflow-hidden">
      {/* Same background as epic RNG world */}
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
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4 z-30">
        <a
          href="/epicrngworld"
          className="flex items-center space-x-2 px-4 py-2 bg-black/80 border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-lg backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-pink-400" />
          <span className="text-sm font-mono font-black text-pink-400">BACK TO RNG WORLD</span>
        </a>
      </div>

      {/* User info / Epic Coins */}
      <div className="absolute top-4 right-4 z-30">
        {user && profile ? (
          <div className="flex items-center gap-3">
            {/* Epic Coins Display */}
            <div className="bg-black/80 border-2 border-green-400 px-4 py-2 font-mono rounded-lg shadow-2xl shadow-green-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-sm font-black text-green-400">{profile.epic_coins.toLocaleString()}EC</span>
              </div>
            </div>
            
            {/* User Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-black/80 border-2 border-cyan-400 px-4 py-2 font-mono rounded-lg shadow-2xl shadow-cyan-400/50 backdrop-blur-sm hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-black text-cyan-400">{profile.username}</span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-black/90 border-2 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-400/50 backdrop-blur-sm min-w-[160px] z-50">
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
          <div className="bg-black/80 border-2 border-yellow-400 px-4 py-2 font-mono rounded-lg shadow-2xl shadow-yellow-400/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-yellow-400">🎲 SPIN TO WIN EC! 🎲</span>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 font-mono tracking-wider text-yellow-400 drop-shadow-2xl animate-pulse"
              style={{
                textShadow: '0 0 20px rgba(255, 255, 0, 1), 0 0 40px rgba(255, 255, 0, 0.6)'
              }}>
            SPIN THE WHEEL
          </h1>
          <div className="h-2 w-64 bg-gradient-to-r from-pink-500 via-cyan-400 via-yellow-400 to-purple-500 mx-auto animate-pulse rounded-full shadow-2xl"></div>
        </div>

        {/* Wheel with Triangle Indicator */}
        <div className="relative">
          {/* Wheel with Segments */}
          <div 
            className={`rounded-full border-8 border-yellow-400 shadow-2xl shadow-yellow-400/50 relative overflow-hidden transition-all duration-1000 ${
              isSpinning || showCelebration ? 'w-[500px] h-[500px]' : 'w-96 h-96'
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 10s cubic-bezier(0.1, 0.57, 0.1, 1), width 1s ease-out, height 1s ease-out' : 'width 1s ease-out, height 1s ease-out'
            }}
          >
            {cumulativeSegments.map((segment, index) => {
              const { startAngle, endAngle } = segment
              
              // Check if this is the selected segment (use index to avoid duplicate highlighting)
              const isSelected = showCelebration && selectedSegment && selectedSegment === segment
              
              // Create smooth circular segments using multiple points
              const points = ['50% 50%'] // Center point
              const numPoints = Math.max(10, Math.round(segment.segmentAngle / 10)) // More points for larger segments
              
              for (let i = 0; i <= numPoints; i++) {
                const currentAngle = startAngle + ((endAngle - startAngle) * i / numPoints)
                const radians = (currentAngle - 90) * Math.PI / 180
                const x = Math.round((50 + 50 * Math.cos(radians)) * 100) / 100
                const y = Math.round((50 + 50 * Math.sin(radians)) * 100) / 100
                points.push(`${x}% ${y}%`)
              }
              
              return (
                <div
                  key={index}
                  className={`absolute w-full h-full transition-all duration-500 ${
                    isSelected ? 'animate-pulse' : ''
                  }`}
                  style={{
                    clipPath: `polygon(${points.join(', ')})`,
                    background: segment.color === 'rainbow' 
                      ? 'linear-gradient(45deg, #ff0000 0%, #ff8000 14%, #ffff00 28%, #00ff00 42%, #00ffff 57%, #0080ff 71%, #8000ff 85%, #ff0080 100%)' 
                      : segment.color,
                    boxShadow: isSelected ? `inset 0 0 50px rgba(255, 255, 255, 0.8), 0 0 50px ${segment.color === 'rainbow' ? '#FFD700' : segment.color}` : 
                               segment.color === 'rainbow' ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none',
                    filter: isSelected ? 'brightness(1.5) saturate(1.5)' : 'none'
                  }}
                >
                  {/* Segment text */}
                  <div
                    className={`absolute text-white font-bold font-mono text-center ${
                      segment.segmentAngle < 20 ? 'text-xs' : 
                      segment.segmentAngle < 30 ? 'text-sm' : 'text-base'
                    }`}
                    style={{
                      left: `${50 + 32 * Math.cos((startAngle + (endAngle - startAngle) / 2 - 90) * Math.PI / 180)}%`,
                      top: `${50 + 32 * Math.sin((startAngle + (endAngle - startAngle) / 2 - 90) * Math.PI / 180)}%`,
                      transform: `translate(-50%, -50%) rotate(${startAngle + (endAngle - startAngle) / 2}deg)`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      fontSize: segment.segmentAngle < 15 ? '0.65rem' : 
                                segment.segmentAngle < 25 ? '0.8rem' : '1rem',
                      maxWidth: `${Math.max(40, segment.segmentAngle * 2)}px`,
                      lineHeight: segment.segmentAngle < 20 ? '1.1' : '1.2'
                    }}
                  >
                    {segment.text}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Triangle Indicator at 3 o'clock */}
          <div className="absolute top-1/2 right-0 transform translate-x-6 -translate-y-1/2">
            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[45px] border-t-transparent border-b-transparent border-r-white"></div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || (!user || (profile && profile.epic_coins < SPIN_COST))}
          className={`mt-8 px-12 py-6 text-2xl font-black font-mono rounded-2xl transition-all duration-300 transform z-50 relative ${
            isSpinning
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : (!user || (profile && profile.epic_coins < SPIN_COST))
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 border-4 border-yellow-400 text-white hover:scale-110 hover:shadow-2xl shadow-pink-500/50'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl">
              {isSpinning ? '🔥 SPINNING 🔥' : showCelebration ? '🎯 SPIN AGAIN 🎯' : '💫 SPIN 💫'}
            </span>
            {!isSpinning && (
              <span className="text-xs text-yellow-200 font-bold">
                {!user ? 'LOGIN REQUIRED' : 
                 profile && profile.epic_coins < SPIN_COST ? 'INSUFFICIENT FUNDS' : 
                 `${SPIN_COST} EC`}
              </span>
            )}
          </div>
        </button>

        {/* Celebration Display */}
        {showCelebration && selectedSegment && (
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto" onClick={hideCelebration}>
            {/* Fireworks Effect */}
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
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
                    i % 4 === 0 ? 'bg-pink-400' :
                    i % 4 === 1 ? 'bg-yellow-400' :
                    i % 4 === 2 ? 'bg-cyan-400' : 'bg-purple-400'
                  } shadow-2xl`} />
                </div>
              ))}
            </div>

            {/* Main Celebration Text */}
            <div className="text-center animate-bounce" onClick={(e) => e.stopPropagation()}>
              <div className="mb-8">
                <h2 className="text-6xl font-black font-mono text-yellow-400 mb-4 animate-pulse"
                    style={{
                      textShadow: '0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.8)'
                    }}>
                  🎉 WINNER! 🎉
                </h2>
                <div className="text-8xl font-black font-mono mb-4 animate-pulse bg-black px-6 py-4 rounded-2xl border-4 border-white"
                     style={{
                       color: selectedSegment.color,
                       textShadow: `0 0 40px ${selectedSegment.color}, 0 0 80px ${selectedSegment.color}`
                     }}>
                  {selectedSegment.text}
                </div>
                <div className="text-2xl font-bold text-white animate-pulse">
                  🌟 CONGRATULATIONS! 🌟
                </div>
              </div>
            </div>

            {/* Particle Explosion */}
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute animate-bounce"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 7.2}deg) translateY(-${50 + Math.random() * 200}px)`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.8 + Math.random() * 0.4}s`
                  }}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    i % 6 === 0 ? 'bg-pink-400' :
                    i % 6 === 1 ? 'bg-yellow-400' :
                    i % 6 === 2 ? 'bg-cyan-400' :
                    i % 6 === 3 ? 'bg-green-400' :
                    i % 6 === 4 ? 'bg-purple-400' : 'bg-red-400'
                  } animate-ping`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}