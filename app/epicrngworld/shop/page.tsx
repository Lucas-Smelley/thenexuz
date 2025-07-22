"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Crown, Star, Zap, Gem, Shuffle, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Gorb {
  id: string
  name: string
  description: string
  rarity: 'Ahh' | 'Crusty' | 'Bombaclat' | 'Epic' | 'RayOfSunshine'
  style_data: {
    colors: string[]
    effects: string[]
  }
  price_epic_coins?: number
  drop_rate: number
}

export default function ShopPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [allGorbz, setAllGorbz] = useState<Gorb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<string | null>(null)
  const [showSpinModal, setShowSpinModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [spinClass, setSpinClass] = useState<string>('')
  const [isNewGorb, setIsNewGorb] = useState<boolean>(false)
  const [randomSpinDistance, setRandomSpinDistance] = useState<number>(0)
  const supabase = createClient()

  // Spin tier configurations
  const spinTiers = {
    basic: {
      name: 'BASIC SPIN',
      cost: 500,
      color: 'gray',
      rarityOdds: {
        RayOfSunshine: 0.01, // 1%
        Epic: 0.04,          // 4% 
        Bombaclat: 0.15,     // 15%
        Crusty: 0.30,        // 30%
        Ahh: 0.50            // 50%
      }
    },
    premium: {
      name: 'PREMIUM SPIN',
      cost: 1500,
      color: 'blue',
      rarityOdds: {
        RayOfSunshine: 0.02, // 2%
        Epic: 0.08,          // 8%
        Bombaclat: 0.20,     // 20%
        Crusty: 0.35,        // 35%
        Ahh: 0.35            // 35%
      }
    },
    elite: {
      name: 'ELITE SPIN',
      cost: 3000,
      color: 'purple',
      rarityOdds: {
        RayOfSunshine: 0.05, // 5%
        Epic: 0.15,          // 15%
        Bombaclat: 0.25,     // 25%
        Crusty: 0.30,        // 30%
        Ahh: 0.25            // 25%
      }
    },
    legendary: {
      name: 'LEGENDARY SPIN',
      cost: 5000,
      color: 'yellow',
      rarityOdds: {
        RayOfSunshine: 0.10, // 10%
        Epic: 0.20,          // 20%
        Bombaclat: 0.30,     // 30%
        Crusty: 0.25,        // 25%
        Ahh: 0.15            // 15%
      }
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/epicrngworld')
    }
  }, [user, loading, router])

  // Fetch all available Gorbz
  useEffect(() => {
    if (user) {
      fetchAllGorbz()
    }
  }, [user])

  const fetchAllGorbz = async () => {
    try {
      const { data, error } = await supabase
        .from('gorbz')
        .select('*')
        .order('drop_rate', { ascending: false }) // Sort by rarity (lowest drop rate = most rare)

      if (error) throw error
      setAllGorbz(data || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching Gorbz:', error)
      setIsLoading(false)
    }
  }

  const openSpinModal = (tier: keyof typeof spinTiers) => {
    setSelectedTier(tier)
    setShowSpinModal(true)
  }

  const startSpin = () => {
    if (!profile || !selectedTier || profile.epic_coins < spinTiers[selectedTier as keyof typeof spinTiers].cost) return
    setIsSpinning(true)
    
    // Generate random spin distance (3000-6000px for variety)
    const randomDistance = Math.random() * 3000 + 3000
    setRandomSpinDistance(randomDistance)
    
    // Start the animation with inline transform after a delay
    setTimeout(() => {
      setSpinClass('spinning')
    }, 500)
    
    // Handle the spin logic - pass the distance and tier directly
    spinForGorb(randomDistance, selectedTier as keyof typeof spinTiers)
  }

  // Tier-based rarity generation using odds
  const generateRarityForTier = (tier: keyof typeof spinTiers): string => {
    const odds = spinTiers[tier].rarityOdds
    const random = Math.random()
    
    // Use cumulative probability to select rarity
    let cumulative = 0
    for (const [rarity, probability] of Object.entries(odds)) {
      cumulative += probability
      if (random <= cumulative) {
        return rarity
      }
    }
    
    return 'Ahh' // Fallback
  }

  // Visual rarity generation - distribute based on tier odds
  const generateRarityAtSegment = (segmentIndex: number, tier: keyof typeof spinTiers): string => {
    const odds = spinTiers[tier].rarityOdds
    const rarities = ['RayOfSunshine', 'Epic', 'Bombaclat', 'Crusty', 'Ahh']
    
    // Create weighted distribution based on odds
    const segments = []
    for (const [rarity, probability] of Object.entries(odds)) {
      const count = Math.round(probability * 400) // Distribute across 400 segments
      for (let i = 0; i < count; i++) {
        segments.push(rarity)
      }
    }
    
    // Use deterministic selection so visual matches calculation
    const seedValue = (segmentIndex * 7 + 13) % segments.length
    return segments[seedValue] || 'Ahh'
  }

  const spinForGorb = async (spinDistance: number, tier: keyof typeof spinTiers) => {
    if (!profile) return
    
    setSpinResult(null)
    const tierConfig = spinTiers[tier]

    try {
      // Deduct Epic Coins for the spin
      const { error: updateError } = await supabase
        .from('users')
        .update({ epic_coins: profile.epic_coins - tierConfig.cost })
        .eq('id', user?.id)

      if (updateError) throw updateError

      // Simulate spin duration
      await new Promise(resolve => setTimeout(resolve, 6500))

      // Calculate exactly which segment lands at the center pointer
      const segmentWidth = 80
      
      // Get the actual container width (responsive)
      // max-w-3xl = 768px max, but could be smaller on mobile
      const containerWidth = Math.min(window.innerWidth * 0.9, 768) // 90% of screen or 768px max
      const centerPositionPx = containerWidth / 2 // Center of container
      const initialCenterSegment = centerPositionPx / segmentWidth // Which segment is at center initially
      
      const segmentsMoved = spinDistance / segmentWidth
      const finalCenterSegmentRaw = (initialCenterSegment + segmentsMoved) % 400
      const finalCenterSegment = Math.floor(finalCenterSegmentRaw) // Round down to whole number
      
      // Use that exact segment with the tier to determine rarity
      const wonRarity = generateRarityAtSegment(finalCenterSegment, tier)
      
      console.log('🎯 RESPONSIVE CALCULATION:', {
        windowWidth: window.innerWidth,
        containerWidth,
        centerPositionPx,
        initialCenterSegment,
        spinDistance,
        segmentsMoved,
        finalCenterSegmentRaw,
        finalCenterSegment,
        wonRarity
      })

      // Get a random Gorb of the won rarity (regardless of ownership)
      const availableGorbz = allGorbz.filter(gorb => gorb.rarity === wonRarity)
      
      if (availableGorbz.length > 0) {
        const wonGorb = availableGorbz[Math.floor(Math.random() * availableGorbz.length)]
        
        // Check if user already owns this Gorb
        const isOwned = profile.gorbz?.includes(wonGorb.id)
        
        if (!isOwned) {
          // Add the Gorb to user's collection
          const updatedGorbz = [...(profile.gorbz || []), wonGorb.id]
          await supabase
            .from('users')
            .update({ 
              gorbz: updatedGorbz,
              gorbz_collected_total: (profile.gorbz_collected_total || 0) + 1
            })
            .eq('id', user?.id)
          setIsNewGorb(true) // Mark as new Gorb
        } else {
          setIsNewGorb(false) // Mark as duplicate
        }
        
        // Always set the result to show the gorb (whether new or duplicate)
        setSpinResult(wonGorb.id)
        console.log('✅ Set spin result:', { wonGorbId: wonGorb.id, wonGorbName: wonGorb.name, isNewGorb: !isOwned })
      } else {
        // Fallback - just show the rarity
        setSpinResult(wonRarity)
        console.log('✅ Set spin result (fallback):', { wonRarity })
      }

    } catch (error) {
      console.error('Spin error:', error)
    } finally {
      setIsSpinning(false)
      console.log('✅ Spin finished - isSpinning set to false')
    }
  }

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'RayOfSunshine':
        return {
          border: 'border-yellow-300',
          glow: 'shadow-2xl shadow-yellow-300/80',
          bg: 'from-yellow-400/20 via-orange-400/30 to-yellow-400/20',
          icon: Crown,
          label: 'RAY OF SUNSHINE',
          textColor: 'text-yellow-300',
          animation: 'animate-pulse',
          chance: '0.01%'
        };
      case 'Epic':
        return {
          border: 'border-purple-400',
          glow: 'shadow-2xl shadow-purple-400/70',
          bg: 'from-purple-500/20 via-fuchsia-500/30 to-purple-500/20',
          icon: Star,
          label: 'EPIC',
          textColor: 'text-purple-400',
          animation: 'animate-bounce',
          chance: '0.2%'
        };
      case 'Bombaclat':
        return {
          border: 'border-red-400',
          glow: 'shadow-xl shadow-red-400/60',
          bg: 'from-red-500/20 via-pink-500/25 to-red-500/20',
          icon: Zap,
          label: 'BOMBACLAT',
          textColor: 'text-red-400',
          animation: 'animate-ping',
          chance: '1.5%'
        };
      case 'Crusty':
        return {
          border: 'border-cyan-400',
          glow: 'shadow-xl shadow-cyan-400/50',
          bg: 'from-cyan-500/15 via-blue-500/20 to-cyan-500/15',
          icon: Gem,
          label: 'CRUSTY',
          textColor: 'text-cyan-400',
          animation: 'animate-pulse',
          chance: '7%'
        };
      default: // Ahh
        return {
          border: 'border-gray-400',
          glow: 'shadow-lg shadow-gray-400/40',
          bg: 'from-gray-500/10 via-white/15 to-gray-500/10',
          icon: Sparkles,
          label: 'AHH',
          textColor: 'text-gray-400',
          animation: '',
          chance: '91%'
        };
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 flex items-center justify-center">
        <div className="text-4xl font-mono font-black text-yellow-400 animate-pulse">LOADING SHOP...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black via-red-950 to-blue-900 relative overflow-hidden">
      {/* Background Effects (same as home page) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/40 via-cyan-500/30 to-green-500/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-400/20 via-transparent via-red-500/25 to-blue-500/20 animate-ping" style={{animationDuration: '4s'}}></div>
        <div className="absolute inset-0 bg-gradient-conic from-pink-500/30 via-cyan-500/30 via-yellow-500/30 to-green-500/30 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-30 p-4 flex justify-between items-center">
        <a
          href="/epicrngworld/mygorbz"
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-black via-purple-900 to-black border-2 border-pink-400 hover:border-cyan-400 transition-all duration-300 font-bold transform hover:scale-105 shadow-xl shadow-pink-400/50 hover:shadow-cyan-400/50 rounded-lg backdrop-blur-sm text-pink-400 hover:text-cyan-400"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-mono font-black">BACK TO COLLECTION</span>
        </a>

        <div className="bg-gradient-to-r from-black via-purple-900 to-black border-2 border-green-400 px-4 py-2 font-mono rounded-lg shadow-xl shadow-green-400/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-green-400">{profile?.epic_coins.toLocaleString()}EC</span>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="relative z-20 text-center pt-8 pb-8">
        <h1 className="text-6xl font-black font-mono leading-none mb-4" style={{
          color: '#ffff00',
          textShadow: '0 0 30px rgba(255, 255, 0, 1), 0 0 60px rgba(255, 255, 0, 0.8), 0 0 90px rgba(255, 255, 0, 0.6)',
          filter: 'blur(0.5px)'
        }}>
          GORBZ SHOP
        </h1>
        <div className="text-xl font-mono font-bold text-cyan-400 mb-8">
          Discover all {allGorbz.length} available Gorbz
        </div>

        {/* Spin Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto">
          {Object.entries(spinTiers).map(([tierId, tierConfig]) => {
            const canAfford = profile && profile.epic_coins >= tierConfig.cost
            const tierColorClasses = {
              gray: {
                border: 'border-gray-400',
                bg: 'from-gray-600 via-gray-700 to-gray-600',
                text: 'text-gray-300',
                glow: 'shadow-gray-400/50'
              },
              blue: {
                border: 'border-blue-400',
                bg: 'from-blue-600 via-blue-700 to-blue-600',
                text: 'text-blue-300',
                glow: 'shadow-blue-400/50'
              },
              purple: {
                border: 'border-purple-400',
                bg: 'from-purple-600 via-purple-700 to-purple-600',
                text: 'text-purple-300',
                glow: 'shadow-purple-400/50'
              },
              yellow: {
                border: 'border-yellow-400',
                bg: 'from-yellow-600 via-yellow-700 to-yellow-600',
                text: 'text-yellow-300',
                glow: 'shadow-yellow-400/50'
              }
            }
            const colorClass = tierColorClasses[tierConfig.color as keyof typeof tierColorClasses] || tierColorClasses.gray

            return (
              <div key={tierId} className="relative group">
                <div className={`absolute -inset-2 sm:-inset-3 rounded-xl animate-pulse shadow-2xl opacity-60 bg-gradient-to-r ${colorClass.bg} ${colorClass.glow}`}></div>
                
                <button
                  onClick={() => openSpinModal(tierId as keyof typeof spinTiers)}
                  disabled={!canAfford}
                  className={`relative bg-gradient-to-br from-black via-gray-900 to-black border-2 ${colorClass.border} hover:${colorClass.border.replace('border-', 'border-').replace('-400', '-300')} rounded-xl p-3 sm:p-4 lg:p-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl ${colorClass.glow} w-full`}
                >
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/20 to-transparent rounded-tr-xl"></div>
                  
                  <div className="text-center space-y-2 sm:space-y-3">
                    <h3 className={`text-sm sm:text-lg lg:text-xl font-mono font-black ${colorClass.text}`}>
                      {tierConfig.name}
                    </h3>
                    
                    <div className={`text-lg sm:text-xl lg:text-2xl font-mono font-black ${colorClass.text}`}>
                      {tierConfig.cost.toLocaleString()}EC
                    </div>
                    
                    <div className="text-xs sm:text-sm space-y-1">
                      <div className="text-yellow-300 font-mono font-bold">
                        {Math.round(tierConfig.rarityOdds.RayOfSunshine * 100)}% Ray of Sunshine
                      </div>
                      <div className="text-purple-300 font-mono font-bold">
                        {Math.round(tierConfig.rarityOdds.Epic * 100)}% Epic
                      </div>
                      <div className="text-red-300 font-mono font-bold">
                        {Math.round(tierConfig.rarityOdds.Bombaclat * 100)}% Bombaclat
                      </div>
                      <div className="text-cyan-300 font-mono font-bold">
                        {Math.round(tierConfig.rarityOdds.Crusty * 100)}% Crusty
                      </div>
                      <div className="text-gray-300 font-mono font-bold">
                        {Math.round(tierConfig.rarityOdds.Ahh * 100)}% Ahh
                      </div>
                    </div>
                    
                    {!canAfford && (
                      <div className="text-red-400 text-xs sm:text-sm font-mono font-black">
                        INSUFFICIENT EC
                      </div>
                    )}
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Spin Modal Overlay */}
      {showSpinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => {
              if (!isSpinning) {
                setShowSpinModal(false)
                setSpinResult(null)
                setSpinClass('')
                setIsNewGorb(false)
              }
            }}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-purple-900 via-black to-blue-900 border-2 border-yellow-400 rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl shadow-yellow-400/50">
            {/* X Close Button */}
            {!isSpinning && (
              <button
                onClick={() => {
                  setShowSpinModal(false)
                  setSpinResult(null)
                  setSpinClass('')
                  setIsNewGorb(false)
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center font-bold text-xl transition-all duration-200 hover:scale-110"
              >
                ×
              </button>
            )}
            
            <div className="text-center space-y-8">
              {/* Spin Info */}
              <div>
                <h2 className="text-4xl font-mono font-black text-yellow-400 mb-2">
                  {selectedTier && spinTiers[selectedTier as keyof typeof spinTiers].name}
                </h2>
                <div className="text-xl font-mono text-cyan-400">
                  Cost: {selectedTier && spinTiers[selectedTier as keyof typeof spinTiers].cost.toLocaleString()}EC
                </div>
              </div>

              {/* Horizontal Spin Bar */}
              <div className="relative w-full max-w-3xl mx-auto">
                {/* Spin Track */}
                <div className="relative h-24 bg-gradient-to-r from-black via-purple-900 to-black border-2 border-gray-600 rounded-lg overflow-hidden shadow-2xl">
                  {/* Selection Pointer */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400 shadow-2xl shadow-yellow-400/80 z-10">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
                  </div>

                  {/* Spinning Rarity Strip */}
                  <div 
                    className={`flex h-full transition-transform duration-6000 ease-out`}
                    style={{
                      width: '32000px', // 400 segments * 80px each
                      transform: spinClass === 'spinning' ? `translateX(-${randomSpinDistance}px)` : 'translateX(0px)'
                    }}
                  >
                    {/* Create segments with tier-based pattern */}
                    {Array.from({length: 400}, (_, i) => {
                      // Use the tier-based rarity generation
                      const rarity = selectedTier ? generateRarityAtSegment(i, selectedTier as keyof typeof spinTiers) : 'Ahh'
                      const config = getRarityConfig(rarity)

                      const Icon = config.icon

                      return (
                        <div 
                          key={i}
                          className={`flex-shrink-0 h-full flex items-center justify-center border-r border-gray-700 ${config.bg}`}
                          style={{ width: '80px' }}
                          title={`Segment ${i}: ${rarity}`}
                        >
                          <div className="text-center">
                            <Icon className={`w-6 h-6 ${config.textColor} mx-auto`} />
                            {i % 10 === 0 && (
                              <div className="text-xs text-white font-bold">{i}</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Spin Status */}
              {!isSpinning && !spinResult ? (
                <div className="space-y-6">
                  <div className="text-xl font-mono font-bold text-white">
                    Ready to spin for amazing Gorbz?
                  </div>
                  {profile && selectedTier && profile.epic_coins >= spinTiers[selectedTier as keyof typeof spinTiers].cost ? (
                    <button
                      onClick={startSpin}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-mono font-black rounded-lg transition-all duration-300 transform hover:scale-105 text-2xl shadow-2xl shadow-green-500/50"
                    >
                      🎰 SPIN NOW 🎰
                    </button>
                  ) : (
                    <div className="text-red-400 font-mono font-black text-lg">
                      INSUFFICIENT EPIC COINS
                    </div>
                  )}
                </div>
              ) : isSpinning ? (
                <div className="text-2xl font-mono font-black text-yellow-400 animate-pulse">
                  SPINNING...
                </div>
              ) : spinResult ? (
                <div className="space-y-4">
                  {/* Check if spinResult is a Gorb ID or just a rarity string */}
                  {(() => {
                    const gorb = allGorbz.find(g => g.id === spinResult)
                    if (gorb) {
                      // We have a specific Gorb
                      return (
                        <>
                          {isNewGorb ? (
                            <div className="text-3xl font-mono font-black text-green-400 animate-bounce">
                              🎉 YOU WON! 🎉
                            </div>
                          ) : (
                            <div className="text-2xl font-mono font-black text-orange-400 animate-pulse">
                              😔 AWW DUPLICATE 😔
                            </div>
                          )}
                          <div>
                            <div className="text-2xl font-mono font-black text-yellow-400">
                              {gorb.name}
                            </div>
                            <div className={`text-xl font-mono ${getRarityConfig(gorb.rarity).textColor}`}>
                              {getRarityConfig(gorb.rarity).label}
                            </div>
                          </div>
                        </>
                      )
                    } else {
                      // spinResult is just a rarity string (fallback case)
                      const rarity = spinResult as string
                      const config = getRarityConfig(rarity)
                      return (
                        <>
                          <div className="text-3xl font-mono font-black text-green-400 animate-bounce">
                            🎉 YOU WON! 🎉
                          </div>
                          <div>
                            <div className="text-2xl font-mono font-black text-yellow-400">
                              Random {config.label} Gorb
                            </div>
                            <div className={`text-xl font-mono ${config.textColor}`}>
                              {config.label}
                            </div>
                          </div>
                        </>
                      )
                    }
                  })()}
                  <button
                    onClick={() => {
                      setShowSpinModal(false)
                      setSpinResult(null)
                      setSpinClass('')
                      setIsNewGorb(false)
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-mono font-black rounded-lg hover:from-green-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105"
                  >
                    COLLECT GORB
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Gorbz Grid */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto">
          {allGorbz.map((gorb) => {
            const config = getRarityConfig(gorb.rarity)
            const Icon = config.icon
            const isOwned = profile?.gorbz?.includes(gorb.id)

            return (
              <div key={gorb.id} className="relative group">
                {/* Rarity Halo */}
                <div className={`absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gradient-to-r ${config.bg} rounded-xl ${config.glow} ${config.animation} opacity-75`}></div>
                
                {/* Owned Indicator */}
                {isOwned && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-30">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black text-xs sm:text-sm">✓</span>
                    </div>
                  </div>
                )}

                {/* Gorb Card */}
                <div className="relative bg-gradient-to-br from-black via-purple-900 to-black border-2 border-gray-600 rounded-xl p-3 sm:p-4 lg:p-6 shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/20 to-transparent rounded-tr-xl"></div>
                  
                  {/* Gorb Preview */}
                  <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 sm:border-3 lg:border-4 ${config.border} ${config.glow} transition-all duration-500 transform group-hover:rotate-12 overflow-hidden`}
                      style={{
                        background: `linear-gradient(45deg, ${gorb.style_data.colors.join(', ')})`,
                      }}
                    >
                      <div className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                      <div className="absolute inset-2 sm:inset-3 lg:inset-4 rounded-full bg-gradient-to-tl from-white/50 to-transparent animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 ${config.textColor} animate-pulse`} />
                      </div>
                    </div>
                  </div>

                  {/* Gorb Info */}
                  <div className="text-center space-y-1 sm:space-y-2">
                    <h3 className="text-sm sm:text-base lg:text-xl font-mono font-black text-white">{gorb.name}</h3>
                    
                    <div className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full border ${config.border} ${config.bg}`}>
                      <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${config.textColor}`} />
                      <span className={`text-xs sm:text-sm font-mono font-black ${config.textColor}`}>{config.label}</span>
                    </div>
                    
                    <div className="text-xs sm:text-sm font-mono text-gray-300 px-1 sm:px-2">
                      {gorb.description}
                    </div>
                    
                    <div className={`text-xs font-mono font-bold ${config.textColor} opacity-75`}>
                      Drop Rate: {config.chance}
                    </div>

                    {isOwned && (
                      <div className="text-xs sm:text-sm font-mono font-black text-green-400 animate-pulse">
                        ✓ OWNED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .duration-6000 {
          transition-duration: 6s;
          transition-timing-function: cubic-bezier(0.15, 0.3, 0.25, 0.995);
        }
      `}</style>
    </div>
  )
}