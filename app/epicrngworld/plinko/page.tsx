"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Coins, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"

const multipliers = [0.5, 0.5, 1, 1.5, 2, 5, 2, 1.5, 1, 0.5, 0.5]

export default function PlinkoPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [betAmount, setBetAmount] = useState(50)
  const [customBetAmount, setCustomBetAmount] = useState('')
  const [useCustomBet, setUseCustomBet] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDropping, setIsDropping] = useState(false)
  const [balls, setBalls] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, betAmount: number}>>([])
  const [ballHistory, setBallHistory] = useState<Array<{id: number, multiplier: number, amount: number, timestamp: number}>>([])
  const [totalWins, setTotalWins] = useState(0)
  const [totalLosses, setTotalLosses] = useState(0)
  const [ballCounter, setBallCounter] = useState(0)
  const [recentDrops, setRecentDrops] = useState<Array<{id: number, result: 'win' | 'loss', amount: number, multiplier: number}>>([])
  const animationRef = useRef<number>()
  const supabase = createClient()

  const BOARD_WIDTH = 600
  const BOARD_HEIGHT = 500
  const PEG_RADIUS = 8
  const BALL_RADIUS = 12
  const ROWS = 12
  const SLOT_WIDTH = BOARD_WIDTH / multipliers.length

  // Generate peg positions covering full width with alternating pattern
  const generatePegs = () => {
    const pegs = []
    const margin = 45  // Balanced margin from edges
    const usableWidth = BOARD_WIDTH - (margin * 2)
    const pegsPerRow = 9  // Balanced peg count for good coverage
    const pegSpacing = usableWidth / (pegsPerRow - 1)
    
    for (let row = 0; row < ROWS; row++) {
      const isEvenRow = row % 2 === 0
      
      if (isEvenRow) {
        // Even rows: pegs from edge to edge
        for (let i = 0; i < pegsPerRow; i++) {
          pegs.push({
            x: margin + (i * pegSpacing),
            y: 180 + row * 35
          })
        }
      } else {
        // Odd rows: pegs offset by half spacing, covering full width
        const offsetSpacing = pegSpacing / 2
        for (let i = 0; i < pegsPerRow - 1; i++) {
          pegs.push({
            x: margin + offsetSpacing + (i * pegSpacing),
            y: 180 + row * 35
          })
        }
      }
    }
    return pegs
  }

  const pegs = generatePegs()

  const getCurrentBetAmount = () => {
    if (useCustomBet) {
      const customAmount = parseInt(customBetAmount)
      return isNaN(customAmount) || customAmount <= 0 ? 0 : customAmount
    }
    return betAmount
  }

  const checkCollision = (ballX: number, ballY: number, pegX: number, pegY: number) => {
    const dx = ballX - pegX
    const dy = ballY - pegY
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < (BALL_RADIUS + PEG_RADIUS)
  }

  const dropBall = async () => {
    // Check if user is logged in and has enough coins
    if (!user || !profile) {
      alert('Please log in to play Plinko!')
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

    // Deduct coins before dropping
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

    // Create new ball with unique ID
    const ballId = Date.now() + Math.random() * 1000 // Timestamp + random for uniqueness
    setBallCounter(prev => prev + 1)
    
    // Start ball at top center with slight random offset
    const startX = BOARD_WIDTH / 2 + (Math.random() - 0.5) * 40
    const newBall = {
      id: ballId,
      x: startX,
      y: 20,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
      betAmount: currentBet
    }
    
    setBalls(prev => [...prev, newBall])

    // Start physics simulation for this ball
    animateBall(newBall)
  }

  const animateBall = (ball: {id: number, x: number, y: number, vx: number, vy: number, betAmount: number}) => {
    const animate = () => {
      // Physics
      ball.vy += 0.3 // gravity
      ball.x += ball.vx
      ball.y += ball.vy

      // Check collisions with pegs
      for (const peg of pegs) {
        if (checkCollision(ball.x, ball.y, peg.x, peg.y)) {
          const dx = ball.x - peg.x
          const dy = ball.y - peg.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Improved bounce off peg
          const nx = dx / distance
          const ny = dy / distance
          
          // Calculate bounce velocity with better physics
          const bounceForce = 2 + Math.random() * 1.5
          ball.vx = nx * bounceForce + (Math.random() - 0.5) * 0.8
          ball.vy = Math.max(0.5, Math.abs(ny * 1.2) + Math.random() * 0.8)  // Ensure downward motion
          
          // Move ball away from peg with extra buffer
          const separation = BALL_RADIUS + PEG_RADIUS + 3
          ball.x = peg.x + nx * separation
          ball.y = peg.y + ny * separation
          
          // Prevent balls from getting too close to edges when bouncing
          ball.x = Math.max(BALL_RADIUS + 5, Math.min(BOARD_WIDTH - BALL_RADIUS - 5, ball.x))
        }
      }

      // Improved boundary collision with momentum preservation
      if (ball.x - BALL_RADIUS < 0) {
        ball.x = BALL_RADIUS + 2  // Add small buffer
        ball.vx = Math.abs(ball.vx) * 0.7 + 1  // Ensure minimum bounce velocity
        ball.vy = Math.abs(ball.vy) + 0.5  // Add downward momentum
      }
      if (ball.x + BALL_RADIUS > BOARD_WIDTH) {
        ball.x = BOARD_WIDTH - BALL_RADIUS - 2  // Add small buffer
        ball.vx = -Math.abs(ball.vx) * 0.7 - 1  // Ensure minimum bounce velocity
        ball.vy = Math.abs(ball.vy) + 0.5  // Add downward momentum
      }

      // Add velocity damping to prevent endless bouncing
      ball.vx *= 0.98
      
      // Ensure minimum downward velocity to prevent getting stuck
      if (Math.abs(ball.vy) < 1) {
        ball.vy = Math.sign(ball.vy) * 1 || 1
      }

      // Update ball position
      setBalls(prev => prev.map(b => b.id === ball.id ? ball : b))

      // Check if ball reached bottom
      if (ball.y > BOARD_HEIGHT + 50) {
        // Determine which slot the ball landed in
        const slotIndex = Math.floor(ball.x / SLOT_WIDTH)
        const finalSlot = Math.max(0, Math.min(multipliers.length - 1, slotIndex))
        const multiplier = multipliers[finalSlot]
        const winnings = Math.floor(ball.betAmount * multiplier)
        
        // Update history and stats
        const isWin = winnings >= ball.betAmount
        setBallHistory(prev => [...prev.slice(-9), { 
          id: ball.id, 
          multiplier, 
          amount: winnings, 
          timestamp: Date.now() 
        }])
        
        setRecentDrops(prev => [...prev.slice(-4), {
          id: ball.id,
          result: isWin ? 'win' : 'loss',
          amount: winnings,
          multiplier
        }])
        
        if (isWin) {
          setTotalWins(prev => prev + 1)
        } else {
          setTotalLosses(prev => prev + 1)
        }
        
        if (winnings > 0) {
          // Award winnings
          supabase
            .from('users')
            .select('epic_coins')
            .eq('id', user.id)
            .single()
            .then(({ data: currentProfile }) => {
              if (currentProfile) {
                supabase
                  .from('users')
                  .update({ epic_coins: currentProfile.epic_coins + winnings })
                  .eq('id', user.id)
                  .then(() => refreshProfile())
              }
            })
        }

        // Remove ball from active balls
        setBalls(prev => prev.filter(b => b.id !== ball.id))
        return
      }

      // Continue animation
      requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const clearHistory = () => {
    setBallHistory([])
    setRecentDrops([])
    setTotalWins(0)
    setTotalLosses(0)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-fuchsia-950 to-violet-900 relative overflow-hidden">
        {/* Vibrant Purple Plinko Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/35 via-fuchsia-500/45 via-violet-500/35 to-purple-500/35 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-400/25 via-transparent via-fuchsia-500/30 to-violet-500/25 animate-ping" style={{animationDuration: '4s'}}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-fuchsia-500/25 via-purple-500/20 to-violet-500/20 animate-bounce" style={{animationDuration: '6s'}}></div>
          
          {/* Dynamic spinning rings */}
          <div className="absolute inset-0 bg-gradient-conic from-purple-500/20 via-fuchsia-500/20 via-violet-500/20 via-pink-500/15 to-purple-500/20 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute inset-0 bg-gradient-conic from-fuchsia-400/15 via-purple-400/15 via-violet-400/15 to-fuchsia-400/15 animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
          <div className="absolute inset-0 bg-gradient-conic from-pink-500/10 via-purple-500/10 via-fuchsia-500/10 to-pink-500/10 animate-spin" style={{animationDuration: '40s'}}></div>
          
          {/* Spectacular purple grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-16 grid-rows-14 h-full w-full">
              {Array.from({ length: 224 }).map((_, i) => (
                <div
                  key={i}
                  className={`border-2 ${
                    i % 8 === 0 ? 'border-purple-400/40 bg-purple-500/10 shadow-md shadow-purple-400/25' :
                    i % 8 === 1 ? 'border-fuchsia-400/40 bg-fuchsia-500/10 shadow-md shadow-fuchsia-400/25' :
                    i % 8 === 2 ? 'border-violet-400/40 bg-violet-500/10 shadow-md shadow-violet-400/25' :
                    i % 8 === 3 ? 'border-pink-400/40 bg-pink-500/10 shadow-md shadow-pink-400/25' :
                    i % 8 === 4 ? 'border-purple-300/35 bg-purple-400/8 shadow-md shadow-purple-300/20' :
                    i % 8 === 5 ? 'border-fuchsia-300/35 bg-fuchsia-400/8 shadow-md shadow-fuchsia-300/20' :
                    i % 8 === 6 ? 'border-gold-400/30 bg-gold-500/8 shadow-md shadow-gold-400/20' :
                    'border-yellow-400/30 bg-yellow-500/8 shadow-md shadow-yellow-400/20'
                  } animate-pulse transition-all duration-300 transform hover:scale-110`}
                  style={{
                    animationDelay: `${(i * 0.015) % 6}s`,
                    animationDuration: `${2.5 + (i * 0.008) % 2.5}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Spectacular floating orbs */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full blur-xl animate-pulse ${
                i % 5 === 0 ? 'bg-purple-400/20 w-40 h-40' :
                i % 5 === 1 ? 'bg-fuchsia-400/20 w-32 h-32' :
                i % 5 === 2 ? 'bg-violet-400/20 w-36 h-36' :
                i % 5 === 3 ? 'bg-pink-400/20 w-28 h-28' :
                'bg-purple-300/20 w-24 h-24'
              }`}
              style={{
                left: `${(i * 19.7) % 90}%`,
                top: `${(i * 27.3) % 90}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            />
          ))}
          
          {/* Pulsing light rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute h-1 animate-pulse"
              style={{
                background: `linear-gradient(90deg, transparent, ${
                  i % 4 === 0 ? '#a855f7' :
                  i % 4 === 1 ? '#d946ef' :
                  i % 4 === 2 ? '#8b5cf6' : '#ec4899'
                }, transparent)`,
                width: `${40 + (i * 10) % 60}%`,
                left: `${(i * 12.5) % 60}%`,
                top: `${(i * 12.5) % 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 2)}s`,
                transform: `rotate(${(i * 22.5) % 180}deg)`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4 z-30">
          <a
            href="/epicrngworld"
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-black/80 border-2 border-purple-400 hover:border-fuchsia-400 transition-all duration-300 font-bold transform hover:scale-110 shadow-2xl shadow-purple-400/50 hover:shadow-fuchsia-400/50 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-xs sm:text-sm font-mono font-black text-purple-400 whitespace-nowrap">BACK TO RNG WORLD</span>
          </a>
        </div>

        {/* User info / Epic Coins */}
        <div className="absolute top-4 right-4 z-30">
          {user && profile ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              {/* Epic Coins Display */}
              <div className="bg-black/80 border-2 border-purple-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-purple-400/50 backdrop-blur-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black text-purple-400 whitespace-nowrap">{profile.epic_coins.toLocaleString()}EC</span>
                </div>
              </div>
              
              {/* User Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-black/80 border-2 border-fuchsia-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-fuchsia-400/50 backdrop-blur-sm hover:border-pink-400 transition-colors"
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
                    <span className="text-xs sm:text-sm font-black text-fuchsia-400 max-w-20 sm:max-w-none truncate">{profile.username}</span>
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-fuchsia-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-black/90 border-2 border-fuchsia-400 rounded-lg shadow-2xl shadow-fuchsia-400/50 backdrop-blur-sm min-w-[160px] max-w-[200px] z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-fuchsia-400/30">
                        <div className="text-xs text-fuchsia-300 font-mono">Signed in as</div>
                        <div className="text-sm font-black text-fuchsia-400 font-mono truncate">{profile.username}</div>
                        <div className="text-xs text-fuchsia-300 font-mono truncate">{user.email}</div>
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
            <div className="bg-black/80 border-2 border-purple-400 px-2 sm:px-4 py-1 sm:py-2 font-mono rounded-lg shadow-2xl shadow-purple-400/50 backdrop-blur-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-black text-purple-400 whitespace-nowrap">PLINKO</span>
              </div>
            </div>
          )}
        </div>


        {/* Main content */}
        <div className={`relative min-h-screen transition-all duration-1000 ${
          balls.length > 0 ? 'z-30' : 'z-20'
        }`}>
          
          {/* Game Header */}
          <div className="text-center py-8 bg-gradient-to-b from-black/80 to-transparent relative">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-mono tracking-wider relative z-10"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6, #ec4899, #f59e0b)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient 3s ease infinite',
                  textShadow: '0 0 30px rgba(34, 197, 94, 0.8)'
                }}>
              Plinko
            </h1>
          </div>
          
          {/* Main Game Area */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Plinko Board - Center */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden" style={{
                  boxShadow: '0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)'
                }}>
                  <div className="text-center mb-4">
                    <h3 className="font-black text-xl font-mono animate-pulse" style={{
                      background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
                    }}>PLINKO BOARD</h3>
                  </div>
                  
                  {/* Plinko Board SVG */}
                  <div className="relative bg-green-900/50 rounded-xl border-2 border-gold-400 p-4">
                    <svg width="100%" height="600" viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT + 100}`} className="border-2 border-green-400 rounded-lg bg-green-800/30">
                      {/* Draw pegs */}
                      {pegs.map((peg, index) => (
                        <circle
                          key={index}
                          cx={peg.x}
                          cy={peg.y}
                          r={PEG_RADIUS}
                          fill="#fbbf24"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          className="animate-pulse"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))',
                            animationDelay: `${index * 0.1}s`
                          }}
                        />
                      ))}
                      
                      {/* Draw multiplier slots */}
                      {multipliers.map((multiplier, index) => (
                        <g key={index}>
                          <rect
                            x={index * SLOT_WIDTH}
                            y={BOARD_HEIGHT + 60}
                            width={SLOT_WIDTH}
                            height={40}
                            fill={multiplier >= 3 ? "#10b981" : multiplier >= 2 ? "#06b6d4" : multiplier >= 1 ? "#fbbf24" : "#ef4444"}
                            stroke="#000"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                          <text
                            x={index * SLOT_WIDTH + SLOT_WIDTH / 2}
                            y={BOARD_HEIGHT + 85}
                            textAnchor="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                            className="font-mono"
                          >
                            {multiplier}x
                          </text>
                        </g>
                      ))}
                      
                      {/* Draw all active balls */}
                      {balls.map((ball) => (
                        <circle
                          key={ball.id}
                          cx={ball.x}
                          cy={ball.y}
                          r={BALL_RADIUS}
                          fill={`hsl(${(ball.id * 60) % 360}, 70%, 60%)`}
                          stroke={`hsl(${(ball.id * 60) % 360}, 80%, 50%)`}
                          strokeWidth="4"
                          className="animate-pulse"
                          style={{
                            filter: `drop-shadow(0 0 15px hsl(${(ball.id * 60) % 360}, 70%, 60%)) drop-shadow(0 0 30px hsl(${(ball.id * 60) % 360}, 70%, 60%))`,
                            animationDuration: `${0.6 + (ball.id % 3) * 0.2}s`
                          }}
                        />
                      ))}
                      
                      {/* Drop zone indicator */}
                      <rect
                        x={BOARD_WIDTH / 2 - 30}
                        y={0}
                        width={60}
                        height={20}
                        fill="#34d399"
                        stroke="#10b981"
                        strokeWidth="2"
                        rx="10"
                        className="animate-bounce"
                      />
                      <text
                        x={BOARD_WIDTH / 2}
                        y={14}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        className="font-mono"
                      >
                        DROP
                      </text>
                    </svg>
                  </div>
                  
                  {/* Drop Button - Bottom of Plinko Board */}
                  <div className="mt-6">
                    <button
                      onClick={dropBall}
                      disabled={isDropping || (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)}
                      className={`w-full py-4 text-xl font-black font-mono rounded-xl transition-all duration-300 transform ${
                        isDropping
                          ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                          : (!user || (profile && profile.epic_coins < getCurrentBetAmount()) || getCurrentBetAmount() <= 0)
                          ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-br from-pink-500 to-pink-700 border-4 border-yellow-400 text-yellow-100 hover:scale-105 hover:shadow-2xl shadow-pink-500/50 animate-pulse'
                      }`}
                    >
                      {isDropping ? 'DROPPING...' : 'DROP BALL'}
                    </button>
                    
                    <div className="mt-4 text-gold-300 font-mono text-sm text-center">
                      {!user ? 'LOGIN TO PLAY' : 
                       getCurrentBetAmount() <= 0 ? 'PLACE YOUR BET' :
                       profile && profile.epic_coins < getCurrentBetAmount() ? 'INSUFFICIENT FUNDS' : 
                       `${getCurrentBetAmount()} EC • READY TO DROP`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Side - Betting Controls */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 border-4 border-yellow-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden" style={{
                  boxShadow: '0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(34, 197, 94, 0.3)'
                }}>
                  <div className="text-center mb-4">
                    <h3 className="font-black text-xl font-mono border-b-2 border-yellow-400 pb-2 animate-pulse" style={{
                      background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.8)'
                    }}>PLACE YOUR BET</h3>
                  </div>

                  {/* Bet Type Selection */}
                  <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setUseCustomBet(false)}
                        disabled={isDropping}
                        className={`flex-1 py-1 px-2 text-xs font-bold font-mono rounded border-2 transition-all ${
                          !useCustomBet 
                            ? 'bg-green-500 border-green-400 text-white' 
                            : 'bg-black/60 border-green-400 text-green-400 hover:bg-green-500/20'
                        }`}
                      >
                        CHIPS
                      </button>
                      <button
                        onClick={() => setUseCustomBet(true)}
                        disabled={isDropping}
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
                      <div className="grid grid-cols-2 gap-2">
                        {[25, 50, 100, 200, 500, 1000].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            disabled={isDropping}
                            className={`p-3 rounded-full border-4 font-black text-xs transition-all transform ${
                              betAmount === amount
                                ? 'bg-gradient-to-br from-pink-400 to-fuchsia-500 border-pink-300 text-white scale-110 animate-pulse'
                                : 'bg-gradient-to-br from-purple-700 to-fuchsia-800 border-purple-400 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-400/50'
                            }`}
                            style={{
                              boxShadow: betAmount === amount ? '0 0 25px rgba(236, 72, 153, 0.8)' : '0 0 15px rgba(168, 85, 247, 0.5)'
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
                        disabled={isDropping}
                        min="1"
                        max={profile?.epic_coins || 999999}
                        className="w-full bg-black/60 border-2 border-fuchsia-400 rounded-lg px-3 py-2 text-fuchsia-300 font-mono text-center font-bold focus:outline-none focus:border-pink-400 focus:shadow-lg focus:shadow-fuchsia-400/50 transition-all"
                      />
                    )}
                  </div>

                </div>
              </div>

              {/* Right Side - Live Win Tracker */}
              <div className="lg:col-span-1 order-3 lg:order-3">
                <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-violet-900 border-4 border-cyan-400 rounded-2xl p-6 shadow-2xl relative overflow-hidden" style={{
                  boxShadow: '0 0 50px rgba(6, 182, 212, 0.6), 0 0 100px rgba(139, 92, 246, 0.3), inset 0 0 30px rgba(139, 92, 246, 0.1)'
                }}>
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-4 border-cyan-400 animate-pulse" style={{
                    boxShadow: '0 0 25px rgba(6, 182, 212, 0.8), inset 0 0 25px rgba(139, 92, 246, 0.2)'
                  }}></div>
                  
                  <h3 className="font-black text-lg font-mono text-center mb-4 animate-pulse relative z-10" style={{
                    background: 'linear-gradient(45deg, #06b6d4, #0891b2, #8b5cf6, #a855f7)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient 2s ease infinite',
                    textShadow: '0 0 25px rgba(6, 182, 212, 0.8)'
                  }}>WIN TRACKER</h3>
                  

                  {/* Recent Drops */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-cyan-300 font-bold text-sm">Recent Drops:</h4>
                      {ballHistory.length > 0 && (
                        <button
                          onClick={clearHistory}
                          className="text-xs bg-red-500/20 border border-red-400/50 px-2 py-1 rounded text-red-300 hover:bg-red-500/40 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    {recentDrops.length > 0 ? (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {recentDrops.slice().reverse().map((drop) => (
                          <div key={drop.id} className={`flex justify-between items-center text-xs p-2 rounded border transition-all ${
                            drop.result === 'win' 
                              ? 'bg-purple-500/20 border-purple-400/30 hover:border-purple-400/50' 
                              : 'bg-red-500/20 border-red-400/30 hover:border-red-400/50'
                          }`}>
                            <div className="flex items-center space-x-2">
                              <span className={drop.result === 'win' ? 'text-purple-300' : 'text-red-300'}>
                                {drop.result === 'win' ? '✓' : '✗'}
                              </span>
                              <span className="text-cyan-200 font-bold">{drop.multiplier}x</span>
                            </div>
                            <span className={`font-bold ${
                              drop.result === 'win' ? 'text-purple-300' : 'text-red-300'
                            }`}>
                              {drop.result === 'win' ? '+' : ''}{drop.amount} EC
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-4">
                        No drops yet - start playing!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
      </div>
    </>
  )
}