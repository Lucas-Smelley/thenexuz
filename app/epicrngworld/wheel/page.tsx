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
  const supabase = createClient()

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
          animation: simple-glow 3s ease-in-out infinite;
        }
        .neon-glow {
          animation: simple-glow 3.5s ease-in-out infinite;
        }
        .toxic-glow {
          animation: simple-glow 2.8s ease-in-out infinite;
        }
        .fire-glow {
          animation: simple-glow 2.2s ease-in-out infinite;
        }
        .death-glow {
          animation: simple-glow 1.8s ease-in-out infinite;
        }
        .gold-glow {
          animation: simple-glow 3.2s ease-in-out infinite;
        }
        .plasma-glow {
          animation: simple-glow 2.6s ease-in-out infinite;
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
        @keyframes simple-glow {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.1) saturate(1.2); }
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-black via-orange-950 to-yellow-900 relative overflow-hidden">
      {/* Wheel-themed background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 via-yellow-500/35 via-red-500/25 to-pink-500/25 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-400/18 via-transparent via-orange-500/22 to-red-500/18 animate-ping" style={{animationDuration: '5s'}}></div>
        
        {/* Wheel-inspired vertical lines pattern */}
        <div className="absolute inset-0 opacity-35">
          <div className="grid grid-cols-18 grid-rows-18 h-full w-full">
            {Array.from({ length: 324 }).map((_, i) => {
              const col = i % 18
              const isVerticalPattern = (col === 8 || col === 9 || col === 7 || col === 10 || col === 6 || col === 11)
              return (
                <div
                  key={i}
                  className={`border-l border-r ${
                    isVerticalPattern ? 
                      i % 4 === 0 ? 'border-yellow-400/60 bg-yellow-500/15' :
                      i % 4 === 1 ? 'border-orange-400/60 bg-orange-500/15' :
                      i % 4 === 2 ? 'border-red-400/60 bg-red-500/15' :
                      'border-pink-400/60 bg-pink-500/15' :
                      i % 6 === 0 ? 'border-amber-400/40 bg-amber-500/8' :
                      i % 6 === 1 ? 'border-yellow-400/40 bg-yellow-500/8' :
                      i % 6 === 2 ? 'border-orange-400/40 bg-orange-500/8' :
                      i % 6 === 3 ? 'border-red-400/40 bg-red-500/8' :
                      i % 6 === 4 ? 'border-pink-400/40 bg-pink-500/8' :
                      'border-rose-400/40 bg-rose-500/8'
                  } animate-pulse`}
                  style={{
                    animationDelay: `${(i * 0.015) % 3}s`,
                    animationDuration: `${3 + (i * 0.008) % 2}s`
                  }}
                />
              )
            })}
          </div>
        </div>
        
        {/* Rotating wheel-like overlays */}
        <div className="absolute inset-0 bg-gradient-conic from-yellow-500/25 via-orange-500/25 via-red-500/25 to-pink-500/25 animate-spin" style={{animationDuration: '18s'}}></div>
        <div className="absolute inset-0 bg-gradient-conic from-amber-500/15 via-yellow-500/15 via-orange-500/15 to-red-500/15 animate-spin" style={{animationDuration: '35s', animationDirection: 'reverse'}}></div>
        
        {/* Floating wheel segments */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/6 left-1/5 w-10 h-10 bg-yellow-400/20 rotate-45 animate-bounce opacity-70 shadow-2xl shadow-yellow-400/50 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-orange-400/20 rotate-12 animate-pulse opacity-60 shadow-xl shadow-orange-400/50 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/6 w-12 h-12 border-4 border-red-400/30 rotate-45 animate-spin opacity-50 shadow-2xl shadow-red-400/50 rounded-full"></div>
          <div className="absolute top-1/2 right-1/5 w-6 h-6 bg-pink-400/20 animate-bounce opacity-70 shadow-xl shadow-pink-400/50 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-14 h-14 border-3 border-amber-400/25 animate-pulse opacity-60 shadow-2xl shadow-amber-400/50 rounded-full"></div>
          <div className="absolute top-1/3 left-1/8 w-7 h-7 bg-rose-400/20 rotate-45 animate-bounce opacity-65 shadow-xl shadow-rose-400/50 rounded-full"></div>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4 z-30">
        <a
          href="/epicrngworld"
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-black/80 border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-lg backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          <span className="text-xs sm:text-sm font-mono font-black text-pink-400 whitespace-nowrap">BACK TO RNG WORLD</span>
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
                className="bg-black/80 border-2 border-cyan-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-cyan-400/50 backdrop-blur-sm hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <span className="text-xs sm:text-sm font-black text-cyan-400 max-w-20 sm:max-w-none truncate">{profile.username}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-black/90 border-2 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-400/50 backdrop-blur-sm min-w-[160px] max-w-[200px] z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-cyan-400/30">
                      <div className="text-xs text-cyan-300 font-mono">Signed in as</div>
                      <div className="text-sm font-black text-cyan-400 font-mono truncate">{profile.username}</div>
                      <div className="text-xs text-cyan-300 font-mono truncate">{user.email}</div>
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
          <div className="bg-black/80 border-2 border-yellow-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-yellow-400/50 backdrop-blur-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm font-black text-yellow-400 whitespace-nowrap">🎲 SPIN TO WIN EC! 🎲</span>
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
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-2 sm:mb-4 font-mono tracking-wider text-yellow-400 drop-shadow-2xl animate-pulse whitespace-nowrap"
              style={{
                textShadow: '0 0 20px rgba(255, 255, 0, 1), 0 0 40px rgba(255, 255, 0, 0.6)'
              }}>
            WHEELY EPIC WHEEL
          </h1>
          <div className="h-1 sm:h-2 w-32 sm:w-64 bg-gradient-to-r from-pink-500 via-cyan-400 via-yellow-400 to-purple-500 mx-auto animate-pulse rounded-full shadow-2xl"></div>
        </div>

        {/* Wheel with Triangle Indicator */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className={`absolute rounded-full animate-pulse transition-all duration-1000 ${
            isSpinning || showCelebration 
              ? 'w-[520px] h-[520px] -top-[10px] -left-[10px] sm:w-[520px] sm:h-[520px] sm:-top-[10px] sm:-left-[10px] max-sm:w-[340px] max-sm:h-[340px] max-sm:-top-[8px] max-sm:-left-[8px]' 
              : 'w-[404px] h-[404px] -top-[6px] -left-[6px] max-sm:w-[304px] max-sm:h-[304px] max-sm:-top-[4px] max-sm:-left-[4px]'
          }`}
          style={{
            background: 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff0080, #ff0000)',
            filter: 'blur(8px)',
            opacity: 0.6
          }} />
          
          {/* Wheel with Segments */}
          <div 
            className={`rounded-full border-8 border-yellow-400 shadow-2xl shadow-yellow-400/50 relative overflow-hidden transition-all duration-1000 ${
              isSpinning || showCelebration 
                ? 'w-[500px] h-[500px] sm:w-[500px] sm:h-[500px] max-sm:w-80 max-sm:h-80' 
                : 'w-96 h-96 max-sm:w-72 max-sm:h-72'
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
                <div
                  key={index}
                  className={`absolute w-full h-full ${
                    isSelected ? 'animate-pulse' : ''
                  } ${segment.color === 'rainbow' ? 'rainbow-glow' : getAnimationClass(segment.color)}`}
                  style={{
                    clipPath: `polygon(${points.join(', ')})`,
                    background: segment.color === 'rainbow' ?
                      'linear-gradient(45deg, #ff0000 0%, #ff8000 14%, #ffff00 28%, #00ff00 42%, #00ffff 57%, #0080ff 71%, #8000ff 85%, #ff0080 100%)' :
                      `linear-gradient(135deg, ${getSegmentBaseColor(segment.color)} 0%, ${getSegmentAccentColor(segment.color)} 100%)`,
                    boxShadow: isSelected ? 
                      `inset 0 0 30px rgba(255, 255, 255, 0.8), 0 0 20px ${getSegmentBaseColor(segment.color)}` : 
                      `0 0 10px ${getSegmentBaseColor(segment.color)}`,
                    filter: isSelected ? 'brightness(1.3) saturate(1.3)' : 'none',
                    willChange: 'filter, opacity'
                  }}
                >
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
                      textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
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
          className={`mt-4 sm:mt-8 px-6 sm:px-12 py-3 sm:py-6 text-lg sm:text-2xl font-black font-mono rounded-xl sm:rounded-2xl transition-all duration-300 transform z-50 relative ${
            isSpinning
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : (!user || (profile && profile.epic_coins < SPIN_COST))
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 border-2 sm:border-4 border-yellow-400 text-white hover:scale-110 hover:shadow-2xl shadow-pink-500/50'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl whitespace-nowrap">
              {isSpinning ? '🔥 SPINNING 🔥' : showCelebration ? '🎯 SPIN AGAIN 🎯' : '💫 SPIN 💫'}
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

        {/* Celebration Display */}
        {showCelebration && selectedSegment && (
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto px-4" onClick={hideCelebration}>
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
            <div className="text-center animate-bounce max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-mono text-yellow-400 mb-2 sm:mb-4 animate-pulse whitespace-nowrap"
                    style={{
                      textShadow: '0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.8)'
                    }}>
                  🎉 WINNER! 🎉
                </h2>
                <div className="text-4xl sm:text-6xl md:text-8xl font-black font-mono mb-2 sm:mb-4 animate-pulse bg-black/95 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white whitespace-nowrap"
                     style={{
                       color: '#FFFFFF',
                       textShadow: `0 0 40px ${getSegmentBaseColor(selectedSegment.color)}, 0 0 80px ${getSegmentBaseColor(selectedSegment.color)}, 0 0 10px #000000`
                     }}>
                  {selectedSegment.text}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white animate-pulse whitespace-nowrap">
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
    </>
  )
}