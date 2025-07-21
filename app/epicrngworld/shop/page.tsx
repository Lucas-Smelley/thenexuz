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
  const supabase = createClient()

  // Spin tier configurations
  const spinTiers = {
    basic: {
      name: 'BASIC SPIN',
      cost: 100,
      color: 'gray',
      weights: { RayOfSunshine: 0.0001, Epic: 0.002, Bombaclat: 0.017, Crusty: 0.087, Ahh: 0.894 }
    },
    premium: {
      name: 'PREMIUM SPIN',
      cost: 500,
      color: 'blue', 
      weights: { RayOfSunshine: 0.001, Epic: 0.01, Bombaclat: 0.05, Crusty: 0.2, Ahh: 0.739 }
    },
    elite: {
      name: 'ELITE SPIN',
      cost: 1000,
      color: 'purple',
      weights: { RayOfSunshine: 0.005, Epic: 0.03, Bombaclat: 0.1, Crusty: 0.35, Ahh: 0.515 }
    },
    legendary: {
      name: 'LEGENDARY SPIN',
      cost: 5000,
      color: 'yellow',
      weights: { RayOfSunshine: 0.02, Epic: 0.1, Bombaclat: 0.2, Crusty: 0.5, Ahh: 0.18 }
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

  const startSpin = (tier: keyof typeof spinTiers) => {
    if (!profile || profile.epic_coins < spinTiers[tier].cost) return
    setSelectedTier(tier)
    setShowSpinModal(true)
    setIsSpinning(true)
    
    // Start the CSS animation after a delay
    setTimeout(() => {
      setSpinClass('spin-wheel')
    }, 500)
    
    // Handle the spin logic
    spinForGorb(tier)
  }

  const spinForGorb = async (tier: keyof typeof spinTiers) => {
    if (!profile) return
    
    const tierConfig = spinTiers[tier]
    setSpinResult(null)

    try {
      // Deduct Epic Coins for the spin
      const { error: updateError } = await supabase
        .from('users')
        .update({ epic_coins: profile.epic_coins - tierConfig.cost })
        .eq('id', user?.id)

      if (updateError) throw updateError

      // Simulate spin duration
      await new Promise(resolve => setTimeout(resolve, 6500))

      // Determine rarity based on tier weights (same logic as visual)
      const rarities = ['RayOfSunshine', 'Epic', 'Bombaclat', 'Crusty', 'Ahh']
      const weights = [
        tierConfig.weights.RayOfSunshine,
        tierConfig.weights.Epic,
        tierConfig.weights.Bombaclat,
        tierConfig.weights.Crusty,
        tierConfig.weights.Ahh
      ]
      
      // Create weighted array for proper distribution
      const weightedRarities: string[] = []
      weights.forEach((weight, idx) => {
        const count = Math.round(weight * 1000) // Use 1000 for better precision
        for (let j = 0; j < count; j++) {
          weightedRarities.push(rarities[idx])
        }
      })
      
      // Random selection from weighted array
      const randomIndex = Math.floor(Math.random() * weightedRarities.length)
      const wonRarity = weightedRarities[randomIndex] || 'Ahh'

      // Get a random Gorb of the won rarity that the user doesn't own yet
      const availableGorbz = allGorbz.filter(gorb => 
        gorb.rarity === wonRarity && !profile.gorbz?.includes(gorb.id)
      )
      
      if (availableGorbz.length > 0) {
        const wonGorb = availableGorbz[Math.floor(Math.random() * availableGorbz.length)]
        
        // Add the Gorb to user's collection
        const updatedGorbz = [...(profile.gorbz || []), wonGorb.id]
        await supabase
          .from('users')
          .update({ 
            gorbz: updatedGorbz,
            gorbz_collected_total: (profile.gorbz_collected_total || 0) + 1
          })
          .eq('id', user?.id)
        
        setSpinResult(wonGorb.id)
      } else {
        // Give duplicate - just show the rarity
        setSpinResult(wonRarity)
      }

    } catch (error) {
      console.error('Spin error:', error)
    } finally {
      setIsSpinning(false)
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

        {/* Spin Tiers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Object.entries(spinTiers).map(([tierKey, tier]) => {
            const canAfford = profile && profile.epic_coins >= tier.cost
            
            return (
              <div key={tierKey} className="relative group">
                {/* Tier Glow */}
                <div className={`absolute -inset-3 rounded-xl animate-pulse shadow-2xl opacity-60 ${
                  tier.color === 'gray' ? 'bg-gray-500/60 shadow-gray-500/50' :
                  tier.color === 'blue' ? 'bg-blue-500/60 shadow-blue-500/50' :
                  tier.color === 'purple' ? 'bg-purple-500/60 shadow-purple-500/50' :
                  'bg-yellow-500/60 shadow-yellow-500/50'
                }`}></div>
                
                <button
                  onClick={() => startSpin(tierKey as keyof typeof spinTiers)}
                  disabled={!canAfford}
                  className={`relative w-full bg-gradient-to-br from-black via-gray-900 to-black border-2 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                    tier.color === 'gray' ? 'border-gray-400 hover:border-gray-300 shadow-xl shadow-gray-400/50' :
                    tier.color === 'blue' ? 'border-blue-400 hover:border-blue-300 shadow-xl shadow-blue-400/50' :
                    tier.color === 'purple' ? 'border-purple-400 hover:border-purple-300 shadow-xl shadow-purple-400/50' :
                    'border-yellow-400 hover:border-yellow-300 shadow-xl shadow-yellow-400/50'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/20 to-transparent rounded-tr-xl"></div>
                  
                  <div className="text-center space-y-4">
                    <h3 className={`text-xl font-mono font-black ${
                      tier.color === 'gray' ? 'text-gray-400' :
                      tier.color === 'blue' ? 'text-blue-400' :
                      tier.color === 'purple' ? 'text-purple-400' :
                      'text-yellow-400'
                    }`}>
                      {tier.name}
                    </h3>
                    
                    <div className={`text-3xl font-mono font-black ${
                      tier.color === 'gray' ? 'text-gray-300' :
                      tier.color === 'blue' ? 'text-blue-300' :
                      tier.color === 'purple' ? 'text-purple-300' :
                      'text-yellow-300'
                    }`}>
                      {tier.cost}EC
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className={`font-mono font-bold ${
                        tier.color === 'gray' ? 'text-gray-400' :
                        tier.color === 'blue' ? 'text-blue-400' :
                        tier.color === 'purple' ? 'text-purple-400' :
                        'text-yellow-400'
                      }`}>
                        BETTER ODDS:
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="text-yellow-300">☀️ {(tier.weights.RayOfSunshine * 100).toFixed(2)}%</div>
                        <div className="text-purple-300">⭐ {(tier.weights.Epic * 100).toFixed(1)}%</div>
                        <div className="text-red-300">⚡ {(tier.weights.Bombaclat * 100).toFixed(1)}%</div>
                        <div className="text-cyan-300">💎 {(tier.weights.Crusty * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    {!canAfford && (
                      <div className="text-red-400 text-sm font-mono font-black">
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
      {showSpinModal && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-purple-900 via-black to-blue-900 border-2 border-yellow-400 rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl shadow-yellow-400/50">
            <div className="text-center space-y-8">
              {/* Tier Info */}
              <div>
                <h2 className="text-4xl font-mono font-black text-yellow-400 mb-2">
                  {spinTiers[selectedTier as keyof typeof spinTiers].name}
                </h2>
                <div className="text-xl font-mono text-cyan-400">
                  Cost: {spinTiers[selectedTier as keyof typeof spinTiers].cost}EC
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
                    className={`flex h-full ${spinClass}`}
                    style={{
                      width: '1600px'
                    }}
                  >
                    {/* Create segments based on selected tier weights */}
                    {Array.from({length: 100}, (_, i) => {
                      const tierWeights = spinTiers[selectedTier as keyof typeof spinTiers].weights
                      
                      // Create a pseudo-random but consistent distribution
                      const rarities = ['RayOfSunshine', 'Epic', 'Bombaclat', 'Crusty', 'Ahh']
                      const weights = [
                        tierWeights.RayOfSunshine,
                        tierWeights.Epic,
                        tierWeights.Bombaclat,
                        tierWeights.Crusty,
                        tierWeights.Ahh
                      ]
                      
                      // Create weighted array for proper distribution
                      const weightedRarities: string[] = []
                      weights.forEach((weight, idx) => {
                        const count = Math.round(weight * 100)
                        for (let j = 0; j < count; j++) {
                          weightedRarities.push(rarities[idx])
                        }
                      })
                      
                      // Use position-based pseudo-random selection for consistent but mixed distribution
                      const seedValue = (i * 7 + 13) % weightedRarities.length
                      const rarity = weightedRarities[seedValue] || 'Ahh'
                      const config = getRarityConfig(rarity)

                      const Icon = config.icon

                      return (
                        <div 
                          key={i}
                          className={`flex-shrink-0 w-20 h-full flex items-center justify-center border-r border-gray-700 ${config.bg}`}
                        >
                          <div className="text-center">
                            <Icon className={`w-6 h-6 ${config.textColor} mx-auto mb-1`} />
                            <div className={`text-xs font-mono font-black ${config.textColor} leading-tight`}>
                              {config.label.split(' ').map((word: string, idx: number) => (
                                <div key={idx}>{word}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Spin Status */}
              {isSpinning ? (
                <div className="text-2xl font-mono font-black text-yellow-400 animate-pulse">
                  SPINNING...
                </div>
              ) : spinResult ? (
                <div className="space-y-4">
                  <div className="text-3xl font-mono font-black text-green-400 animate-bounce">
                    🎉 YOU WON! 🎉
                  </div>
                  {allGorbz.find(g => g.id === spinResult) && (
                    <div>
                      <div className="text-2xl font-mono font-black text-yellow-400">
                        {allGorbz.find(g => g.id === spinResult)?.name}
                      </div>
                      <div className={`text-xl font-mono ${getRarityConfig(allGorbz.find(g => g.id === spinResult)?.rarity || '').textColor}`}>
                        {getRarityConfig(allGorbz.find(g => g.id === spinResult)?.rarity || '').label}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowSpinModal(false)
                      setSpinResult(null)
                      setSelectedTier(null)
                      setSpinClass('')
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
      <div className="relative z-20 px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {allGorbz.map((gorb) => {
            const config = getRarityConfig(gorb.rarity)
            const Icon = config.icon
            const isOwned = profile?.gorbz?.includes(gorb.id)

            return (
              <div key={gorb.id} className="relative group">
                {/* Rarity Halo */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${config.bg} rounded-xl ${config.glow} ${config.animation} opacity-75`}></div>
                
                {/* Owned Indicator */}
                {isOwned && (
                  <div className="absolute -top-2 -right-2 z-30">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white font-black text-sm">✓</span>
                    </div>
                  </div>
                )}

                {/* Gorb Card */}
                <div className="relative bg-gradient-to-br from-black via-purple-900 to-black border-2 border-gray-600 rounded-xl p-6 shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/20 to-transparent rounded-tr-xl"></div>
                  
                  {/* Gorb Preview */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-20 h-20 rounded-full border-4 ${config.border} ${config.glow} transition-all duration-500 transform group-hover:rotate-12 overflow-hidden`}
                      style={{
                        background: `linear-gradient(45deg, ${gorb.style_data.colors.join(', ')})`,
                      }}
                    >
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                      <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-white/50 to-transparent animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${config.textColor} animate-pulse`} />
                      </div>
                    </div>
                  </div>

                  {/* Gorb Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-mono font-black text-white">{gorb.name}</h3>
                    
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border ${config.border} ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.textColor}`} />
                      <span className={`text-sm font-mono font-black ${config.textColor}`}>{config.label}</span>
                    </div>
                    
                    <div className="text-sm font-mono text-gray-300 px-2">
                      {gorb.description}
                    </div>
                    
                    <div className={`text-xs font-mono font-bold ${config.textColor} opacity-75`}>
                      Drop Rate: {config.chance}
                    </div>

                    {isOwned && (
                      <div className="text-sm font-mono font-black text-green-400 animate-pulse">
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
        @keyframes spin-wheel {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(-4000px);
          }
        }
        
        .spin-wheel {
          animation: spin-wheel 6s cubic-bezier(0.15, 0.3, 0.25, 0.995) forwards;
        }
      `}</style>
    </div>
  )
}