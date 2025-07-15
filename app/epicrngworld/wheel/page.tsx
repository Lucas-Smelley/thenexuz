"use client"

import { useState } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

const wheelSegments = [
  // Start with the MEGA JACKPOT at 12 o'clock
  { text: "100000 EC", color: "rainbow", weight: 1 }, // rainbow - mega jackpot (top)
  
  // Right side descending (clockwise from top)
  { text: "DOUBLE", color: "electric-purple", weight: 1.5 }, // electric purple gradient - special
  { text: "1000 EC", color: "cyber-blue", weight: 3 }, // cyber blue gradient - excellent win
  { text: "600 EC", color: "neon-cyan", weight: 4 }, // neon cyan - good win
  { text: "500 EC", color: "plasma-green", weight: 5 }, // plasma green - decent win
  { text: "400 EC", color: "toxic-lime", weight: 4 }, // toxic lime - small win
  { text: "150 EC", color: "golden-yellow", weight: 3 }, // golden yellow - break even
  { text: "-500 EC", color: "burning-orange", weight: 2 }, // burning orange - loss
  
  // Bottom - BIG LOSS directly opposite the mega jackpot (6 o'clock)
  { text: "LOSE 5000", color: "death-red", weight: 1 }, // death red gradient - massive loss
  
  { text: "-500 EC", color: "lava-orange", weight: 2 }, // lava orange - loss
  { text: "150 EC", color: "radioactive-yellow", weight: 3 }, // radioactive yellow - break even
  { text: "400 EC", color: "matrix-green", weight: 4 }, // matrix green - small win
  { text: "500 EC", color: "emerald-glow", weight: 5 }, // emerald glow - decent win
  { text: "600 EC", color: "ice-blue", weight: 4 }, // ice blue - good win
  { text: "1000 EC", color: "lightning-blue", weight: 3 }, // lightning blue - excellent win
  { text: "DOUBLE", color: "mystic-purple", weight: 1.5 }, // mystic purple - special
]

export default function WheelPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [hiddenAds, setHiddenAds] = useState<string[]>([])
  const supabase = createClient()

  const hideAd = (adId: string) => {
    setHiddenAds(prev => [...prev, adId])
  }

  const SPIN_COST = 200

  // Function to get base colors for layered approach
  const getSegmentBaseColor = (color: string) => {
    switch (color) {
      case 'rainbow': return '#FFD700'
      case 'electric-purple': return '#8B5CF6'
      case 'cyber-blue': return '#3B82F6'
      case 'neon-cyan': return '#06B6D4'
      case 'plasma-green': return '#10B981'
      case 'toxic-lime': return '#84CC16'
      case 'golden-yellow': return '#F59E0B'
      case 'burning-orange': return '#EA580C'
      case 'death-red': return '#DC2626'
      case 'lava-orange': return '#F97316'
      case 'radioactive-yellow': return '#EAB308'
      case 'matrix-green': return '#22C55E'
      case 'emerald-glow': return '#059669'
      case 'ice-blue': return '#0EA5E9'
      case 'lightning-blue': return '#2563EB'
      case 'mystic-purple': return '#7C3AED'
      default: return color
    }
  }

  // Function to get accent colors for layered effects
  const getSegmentAccentColor = (color: string) => {
    switch (color) {
      case 'rainbow': return '#FF69B4'
      case 'electric-purple': return '#C084FC'
      case 'cyber-blue': return '#60A5FA'
      case 'neon-cyan': return '#22D3EE'
      case 'plasma-green': return '#34D399'
      case 'toxic-lime': return '#A3E635'
      case 'golden-yellow': return '#FBBF24'
      case 'burning-orange': return '#F97316'
      case 'death-red': return '#EF4444'
      case 'lava-orange': return '#FB923C'
      case 'radioactive-yellow': return '#FACC15'
      case 'matrix-green': return '#4ADE80'
      case 'emerald-glow': return '#10B981'
      case 'ice-blue': return '#38BDF8'
      case 'lightning-blue': return '#3B82F6'
      case 'mystic-purple': return '#A855F7'
      default: return '#FFFFFF'
    }
  }

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
    <>
      {/* CSS animations for gradient effects */}
      <style jsx>{`
        .rainbow-glow {
          background: linear-gradient(45deg, #ff0000 0%, #ff8000 14%, #ffff00 28%, #00ff00 42%, #00ffff 57%, #0080ff 71%, #8000ff 85%, #ff0080 100%);
          background-size: 300% 300%;
          animation: rainbow-shift 4s ease-in-out infinite;
        }
        .electric-glow {
          animation: electric-pulse 2s ease-in-out infinite, color-fade 4s ease-in-out infinite;
          box-shadow: 0 0 20px currentColor, inset 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .neon-glow {
          animation: neon-flicker 3s ease-in-out infinite, color-fade 3.5s ease-in-out infinite;
          box-shadow: 0 0 25px currentColor, inset 0 0 15px rgba(6, 182, 212, 0.4);
        }
        .toxic-glow {
          animation: toxic-pulse 2.5s ease-in-out infinite, color-fade 3s ease-in-out infinite;
          box-shadow: 0 0 15px currentColor, inset 0 0 20px rgba(132, 204, 22, 0.3);
        }
        .fire-glow {
          animation: fire-flicker 1.5s ease-in-out infinite, color-fade 2.8s ease-in-out infinite;
          box-shadow: 0 0 30px currentColor, inset 0 0 25px rgba(234, 88, 12, 0.4);
        }
        .death-glow {
          animation: death-pulse 1s ease-in-out infinite, color-fade 2s ease-in-out infinite;
          box-shadow: 0 0 35px currentColor, inset 0 0 30px rgba(220, 38, 38, 0.5);
        }
        .gold-glow {
          animation: golden-shimmer 2.8s ease-in-out infinite, color-fade 4.2s ease-in-out infinite;
          box-shadow: 0 0 25px currentColor, inset 0 0 20px rgba(245, 158, 11, 0.4);
        }
        .plasma-glow {
          animation: plasma-wave 2.2s ease-in-out infinite, color-fade 3.7s ease-in-out infinite;
          box-shadow: 0 0 20px currentColor, inset 0 0 15px rgba(16, 185, 129, 0.3);
        }
        
        @keyframes rainbow-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes electric-pulse {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          50% { filter: brightness(1.2) hue-rotate(30deg); }
        }
        @keyframes neon-flicker {
          0%, 100% { filter: brightness(1); }
          25% { filter: brightness(0.8); }
          50% { filter: brightness(1.2); }
          75% { filter: brightness(0.9); }
        }
        @keyframes toxic-pulse {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.1) saturate(1.3); }
        }
        @keyframes fire-flicker {
          0%, 100% { filter: brightness(1); }
          20% { filter: brightness(0.9); }
          40% { filter: brightness(1.1); }
          60% { filter: brightness(0.8); }
          80% { filter: brightness(1.2); }
        }
        @keyframes death-pulse {
          0%, 100% { filter: brightness(0.8) saturate(1.2); }
          50% { filter: brightness(1.3) saturate(1.8); }
        }
        @keyframes golden-shimmer {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.3) saturate(1.4); }
        }
        @keyframes plasma-wave {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          50% { filter: brightness(1.2) hue-rotate(15deg); }
        }
        @keyframes color-fade {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
      
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
          {/* Outer glow ring */}
          <div className={`absolute rounded-full animate-pulse transition-all duration-1000 ${
            isSpinning || showCelebration ? 'w-[520px] h-[520px] -top-[10px] -left-[10px]' : 'w-[404px] h-[404px] -top-[6px] -left-[6px]'
          }`}
          style={{
            background: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff0080, #ff0000)',
            filter: 'blur(8px)',
            opacity: 0.6
          }} />
          
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
              
              const getAnimationClass = (color: string) => {
                switch (color) {
                  case 'rainbow': return 'rainbow-glow'
                  case 'electric-purple': case 'mystic-purple': return 'electric-glow'
                  case 'neon-cyan': case 'ice-blue': case 'lightning-blue': return 'neon-glow'
                  case 'toxic-lime': case 'radioactive-yellow': return 'toxic-glow'
                  case 'burning-orange': case 'lava-orange': return 'fire-glow'
                  case 'death-red': return 'death-glow'
                  case 'golden-yellow': return 'gold-glow'
                  case 'plasma-green': case 'emerald-glow': case 'matrix-green': return 'plasma-glow'
                  case 'cyber-blue': return 'neon-glow'
                  default: return ''
                }
              }
              
              return (
                <div key={index} className="absolute w-full h-full">
                  {/* Base color layer */}
                  <div
                    className={`absolute w-full h-full transition-all duration-500 ${
                      isSelected ? 'animate-pulse' : ''
                    } ${getAnimationClass(segment.color)}`}
                    style={{
                      clipPath: `polygon(${points.join(', ')})`,
                      backgroundColor: getSegmentBaseColor(segment.color),
                      filter: isSelected ? 'brightness(1.5) saturate(1.5)' : 'none'
                    }}
                  />
                  
                  {/* Gradient layer */}
                  <div
                    className={`absolute w-full h-full ${segment.color === 'rainbow' ? 'rainbow-glow' : ''}`}
                    style={{
                      clipPath: `polygon(${points.join(', ')})`,
                      background: segment.color === 'rainbow' ?
                        'linear-gradient(45deg, #ff0000 0%, #ff8000 14%, #ffff00 28%, #00ff00 42%, #00ffff 57%, #0080ff 71%, #8000ff 85%, #ff0080 100%)' :
                        `linear-gradient(135deg, ${getSegmentBaseColor(segment.color)} 0%, ${getSegmentAccentColor(segment.color)} 100%)`,
                      opacity: 0.8,
                      mixBlendMode: 'multiply',
                      animation: segment.color !== 'rainbow' ? 'color-fade 3.5s ease-in-out infinite' : undefined
                    }}
                  />
                  
                  {/* Animated pattern overlay */}
                  <div
                    className={`absolute w-full h-full ${getAnimationClass(segment.color)}`}
                    style={{
                      clipPath: `polygon(${points.join(', ')})`,
                      background: segment.color === 'rainbow' ? 
                        'repeating-conic-gradient(from 0deg at 50% 50%, #ff0000 0deg, #ff8000 45deg, #ffff00 90deg, #00ff00 135deg, #00ffff 180deg, #0080ff 225deg, #8000ff 270deg, #ff0080 315deg, #ff0000 360deg)' :
                        `repeating-linear-gradient(45deg, transparent 0px, transparent 15px, ${getSegmentAccentColor(segment.color)} 15px, ${getSegmentAccentColor(segment.color)} 18px)`,
                      opacity: 0.2,
                      mixBlendMode: 'overlay'
                    }}
                  />
                  
                  {/* Radial highlight */}
                  <div
                    className="absolute w-full h-full"
                    style={{
                      clipPath: `polygon(${points.join(', ')})`,
                      background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 50%)`,
                      opacity: 0.7
                    }}
                  />
                  
                  {/* Edge glow */}
                  <div
                    className="absolute w-full h-full"
                    style={{
                      clipPath: `polygon(${points.join(', ')})`,
                      boxShadow: `inset 0 0 20px ${getSegmentAccentColor(segment.color)}, 0 0 10px ${getSegmentBaseColor(segment.color)}`,
                      opacity: isSelected ? 1 : 0.6
                    }}
                  />
                  
                  {/* Segment text */}
                  <div
                    className={`absolute text-white font-bold font-mono text-center z-10 ${
                      segment.segmentAngle < 20 ? 'text-xs' : 
                      segment.segmentAngle < 30 ? 'text-sm' : 'text-base'
                    }`}
                    style={{
                      left: `${50 + 32 * Math.cos((startAngle + (endAngle - startAngle) / 2 - 90) * Math.PI / 180)}%`,
                      top: `${50 + 32 * Math.sin((startAngle + (endAngle - startAngle) / 2 - 90) * Math.PI / 180)}%`,
                      transform: `translate(-50%, -50%) rotate(${startAngle + (endAngle - startAngle) / 2}deg)`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.9)',
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
          
          {/* Enhanced Triangle Indicator at 3 o'clock */}
          <div className="absolute top-1/2 right-0 transform translate-x-6 -translate-y-1/2">
            {/* Glowing base */}
            <div className="absolute w-0 h-0 border-t-[12px] border-b-[12px] border-r-[55px] border-t-transparent border-b-transparent animate-pulse"
                 style={{
                   borderRightColor: '#FFD700',
                   filter: 'drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FF69B4)',
                   transform: 'translate(-2px, 0)'
                 }}></div>
            {/* Main indicator */}
            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[45px] border-t-transparent border-b-transparent relative z-10"
                 style={{
                   borderRightColor: 'white',
                   filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
                 }}></div>
            {/* Sparkles */}
            <div className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-2 -left-3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
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
                <div className="text-8xl font-black font-mono mb-4 animate-pulse bg-black/95 px-6 py-4 rounded-2xl border-4 border-white"
                     style={{
                       color: '#FFFFFF',
                       textShadow: `0 0 40px ${getSegmentBaseColor(selectedSegment.color)}, 0 0 80px ${getSegmentBaseColor(selectedSegment.color)}, 0 0 10px #000000`
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

        {/* OBNOXIOUS SATIRICAL ADVERTISEMENTS */}
        
        {/* Wheel Special Deal - Top Left */}
        <div className="hidden md:block absolute top-20 left-4 z-30">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 border-4 border-yellow-400 rounded-xl p-4 animate-bounce shadow-2xl shadow-red-500/70 transform rotate-12 max-w-64">
            <div className="text-white text-center font-mono font-black">
              <div className="text-2xl text-yellow-300 mb-2">🎡 WHEEL DEAL 🎡</div>
              <div className="text-xl mb-1">SPIN 10 TIMES</div>
              <div className="text-3xl font-black text-yellow-400">GET 11TH SPIN*</div>
              <div className="text-xs text-red-200 mt-1">*if you have coins left</div>
              <div className="text-lg mt-2 animate-pulse">PREMIUM LOSING!</div>
              <div className="text-xs text-red-200">**guaranteed bankrupt</div>
            </div>
          </div>
        </div>

        {/* Winner Testimonial - Top Right */}
        <div className="hidden lg:block absolute top-32 right-4 z-30">
          <div className="bg-gradient-to-l from-green-500 to-lime-400 border-4 border-white rounded-2xl p-5 animate-pulse shadow-2xl shadow-green-500/70 transform -rotate-6 max-w-72">
            <div className="text-black text-center font-mono font-black">
              <div className="text-2xl mb-2">🎰 WHEEL WINNER 🎰</div>
              <div className="text-lg mb-2">"I WON 150 EC!"</div>
              <div className="text-2xl font-black">(Cost: 2000 EC)</div>
              <div className="text-sm mb-2">- SpinAddict2024</div>
              <div className="text-xs text-green-800">*technically still winning</div>
              <div className="text-xs text-green-800">**math is optional</div>
            </div>
          </div>
        </div>

        {/* Spin Strategy Guide - Left Side */}
        {!hiddenAds.includes('spin-strategy') && (
          <div className="hidden xl:block absolute top-1/3 left-8 z-20">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 border-4 border-cyan-400 rounded-2xl p-4 animate-pulse shadow-2xl shadow-purple-500/50 transform rotate-3 max-w-64 relative">
              <button 
                onClick={() => hideAd('spin-strategy')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black">
                <div className="text-cyan-300 font-black mb-2 text-xl">📚 PRO TIPS 📚</div>
                <div className="mb-2 text-sm">WINNING STRATEGIES:</div>
                <div className="text-xs mb-1">• Spin harder for better luck</div>
                <div className="text-xs mb-1">• Close eyes = can't lose</div>
                <div className="text-xs mb-1">• Sacrifice your lunch money</div>
                <div className="text-xs mb-2">• Pray to RNG gods</div>
                <div className="text-cyan-300 text-xs">Works 0% of the time!</div>
                <div className="text-xs">*every time</div>
              </div>
            </div>
          </div>
        )}

        {/* Wheel Insurance - Right Side */}
        {!hiddenAds.includes('wheel-insurance') && (
          <div className="hidden xl:block absolute top-1/4 right-12 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 border-4 border-yellow-400 rounded-2xl p-4 animate-spin shadow-2xl shadow-orange-500/70 relative" style={{animationDuration: '10s'}}>
              <button 
                onClick={() => hideAd('wheel-insurance')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black leading-tight">
                <div className="text-lg">🛡️ INSURANCE 🛡️</div>
                <div className="text-sm">PROTECT YOUR</div>
                <div className="text-sm">LOSSES!</div>
                <div className="text-yellow-300 text-xs mt-1">Only 500 EC!</div>
                <div className="text-xs">*to lose 500 EC safely</div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Wheel Promos */}
        {!hiddenAds.includes('spin-special') && (
          <div className="absolute bottom-1/3 left-16 z-20 hidden lg:block">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 border-4 border-red-500 rounded-xl p-3 animate-bounce shadow-2xl shadow-yellow-500/70 transform -rotate-12 relative">
              <button 
                onClick={() => hideAd('spin-special')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-black text-center font-mono font-black">
                <div className="text-lg">🎡 SPECIAL 🎡</div>
                <div className="text-sm">DOUBLE LOSS!</div>
                <div className="text-sm">PREMIUM SPINS</div>
                <div className="text-xs text-red-600 mt-1">Lose twice as fast!</div>
              </div>
            </div>
          </div>
        )}

        {!hiddenAds.includes('wheel-membership') && (
          <div className="absolute bottom-1/4 right-20 z-20 hidden lg:block">
            <div className="bg-gradient-to-l from-pink-500 to-purple-500 border-4 border-cyan-400 rounded-full p-4 animate-pulse shadow-2xl shadow-pink-500/70 transform rotate-12 relative">
              <button 
                onClick={() => hideAd('wheel-membership')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-center font-mono font-black leading-tight">
                <div className="text-lg">💎 VIP 💎</div>
                <div className="text-sm">WHEEL</div>
                <div className="text-sm">MEMBERSHIP</div>
                <div className="text-cyan-300 text-xs mt-1">exclusive losses</div>
              </div>
            </div>
          </div>
        )}

        {/* Corner Achievement Badges */}
        {!hiddenAds.includes('spin-master') && (
          <div className="absolute top-2/3 left-4 hidden md:block z-20">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 border-3 border-yellow-400 rounded-full p-3 animate-bounce shadow-xl shadow-blue-500/50 transform rotate-6 relative">
              <button 
                onClick={() => hideAd('spin-master')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center leading-tight">
                <div>🎯 LEVEL 1 🎯</div>
                <div>SPIN</div>
                <div>MASTER</div>
              </div>
            </div>
          </div>
        )}

        {!hiddenAds.includes('wheel-expert') && (
          <div className="absolute top-3/4 right-8 hidden lg:block z-20">
            <div className="bg-gradient-to-l from-green-500 to-teal-500 border-3 border-orange-400 rounded-lg p-3 animate-pulse shadow-xl shadow-green-500/50 transform -rotate-6 relative">
              <button 
                onClick={() => hideAd('wheel-expert')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center">
                <div>🎡 WHEEL 🎡</div>
                <div>EXPERT</div>
                <div className="text-red-300 text-[8px]">(still losing)</div>
              </div>
            </div>
          </div>
        )}

        {!hiddenAds.includes('spin-addiction') && (
          <div className="absolute bottom-1/2 left-2 hidden xl:block z-20">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 border-3 border-white rounded-full p-3 animate-spin shadow-xl shadow-red-500/50 relative" style={{animationDuration: '8s'}}>
              <button 
                onClick={() => hideAd('spin-addiction')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center leading-tight">
                <div>🚨 WARNING 🚨</div>
                <div>SPIN</div>
                <div>ADDICTION</div>
              </div>
            </div>
          </div>
        )}

        {!hiddenAds.includes('bankruptcy-speedrun') && (
          <div className="absolute bottom-1/3 right-4 hidden md:block z-20">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 border-3 border-yellow-400 rounded-lg p-3 animate-bounce shadow-xl shadow-purple-500/50 transform rotate-3 relative">
              <button 
                onClick={() => hideAd('bankruptcy-speedrun')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center">
                <div>🏃 SPEEDRUN 🏃</div>
                <div>BANKRUPTCY</div>
                <div>CHALLENGE</div>
                <div className="text-yellow-300 text-[8px]">WR: 3 spins</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Wheel Ads */}
        {!hiddenAds.includes('mobile-wheel-tip') && (
          <div className="block md:hidden absolute bottom-32 left-4 right-4 z-20">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-yellow-400 rounded-lg p-3 animate-pulse shadow-lg shadow-purple-500/50 relative">
              <button 
                onClick={() => hideAd('mobile-wheel-tip')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-xs font-mono text-center">
                <div className="text-yellow-300 font-black mb-1">💡 PRO TIP 💡</div>
                <div>"Spin with your phone upside down for better luck!"</div>
                <div className="text-yellow-300 text-[10px] mt-1">- TotallyLegitGambler</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Wheel Deal */}
        {!hiddenAds.includes('mobile-wheel-deal') && (
          <div className="block md:hidden absolute top-1/4 right-4 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 border-2 border-yellow-400 rounded-lg p-2 animate-pulse shadow-lg shadow-orange-500/50 relative">
              <button 
                onClick={() => hideAd('mobile-wheel-deal')}
                className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black text-[6px] font-black rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                ×
              </button>
              <div className="text-white text-xs font-black font-mono text-center">
                <div>📱 MOBILE 📱</div>
                <div>WHEEL</div>
                <div>EDITION</div>
              </div>
            </div>
          </div>
        )}

        {/* Floating wheel segment icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/6 left-1/6 w-12 h-12 bg-yellow-400/20 rounded-full animate-bounce opacity-60 shadow-2xl shadow-yellow-400/50 flex items-center justify-center">
            <span className="text-2xl">🎡</span>
          </div>
          <div className="absolute bottom-1/4 right-1/6 w-8 h-8 bg-pink-400/20 rounded-full animate-pulse opacity-70 shadow-xl shadow-pink-400/50 flex items-center justify-center">
            <span className="text-lg">🎰</span>
          </div>
          <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-cyan-400/20 rounded-full animate-bounce opacity-50 shadow-xl shadow-cyan-400/50 flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div className="absolute bottom-1/3 left-1/8 w-6 h-6 bg-green-400/20 rounded-full animate-pulse opacity-60 shadow-lg shadow-green-400/50 flex items-center justify-center">
            <span className="text-sm">🍀</span>
          </div>
        </div>

        {/* Matrix-like falling wheel symbols */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`absolute font-mono text-sm font-bold animate-pulse ${
                i % 5 === 0 ? 'text-yellow-400' :
                i % 5 === 1 ? 'text-pink-400' :
                i % 5 === 2 ? 'text-cyan-400' :
                i % 5 === 3 ? 'text-green-400' : 'text-purple-400'
              }`}
              style={{
                left: `${(i * 9.7) % 100}%`,
                top: `${(i * 13.3) % 100}%`,
                animationDelay: `${(i * 0.1) % 4}s`,
                textShadow: '0 0 10px currentColor'
              }}
            >
              {['🎡', '💰', '🎰', '🍀', '💎', '⚡', '🔥', '💸'][i % 8]}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}