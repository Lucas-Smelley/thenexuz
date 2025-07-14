"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

const wheelSegments = [
  { text: "100 EC", color: "#EF4444" }, // red
  { text: "500 EC", color: "#3B82F6" }, // blue
  { text: "BANKRUPT", color: "#1F2937" }, // gray
  { text: "1000 EC", color: "#10B981" }, // green
  { text: "50 EC", color: "#F59E0B" }, // yellow
  { text: "2000 EC", color: "#8B5CF6" }, // purple
  { text: "LOSE ALL", color: "#1F2937" }, // gray
  { text: "250 EC", color: "#EC4899" }, // pink
]

export default function WheelPage() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<any>(null)

  // Calculate which segment is currently selected by the indicator
  const getCurrentSegment = (rotationDegrees: number) => {
    const normalizedRotation = ((rotationDegrees % 360) + 360) % 360
    const segmentAngle = 360 / wheelSegments.length
    // Triangle is at 3 o'clock (0 degrees/2π radians on unit circle)
    // Segments start at 12 o'clock and go clockwise, so we need to offset by 90 degrees
    const adjustedRotation = (360 - normalizedRotation + 90) % 360
    const segmentIndex = Math.floor(adjustedRotation / segmentAngle) % wheelSegments.length
    return wheelSegments[segmentIndex]
  }

  const spinWheel = () => {
    if (isSpinning) return

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
    setTimeout(() => {
      setIsSpinning(false)
      const finalSegment = getCurrentSegment(newRotation)
      setSelectedSegment(finalSegment)
      setShowCelebration(true)
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
            {wheelSegments.map((segment, index) => {
              const startAngle = (360 / wheelSegments.length) * index
              const endAngle = (360 / wheelSegments.length) * (index + 1)
              
              // Check if this is the selected segment
              const isSelected = showCelebration && selectedSegment && selectedSegment.text === segment.text
              
              // Create smooth circular segments using multiple points
              const points = ['50% 50%'] // Center point
              const numPoints = 20 // Points for smooth curve
              
              for (let i = 0; i <= numPoints; i++) {
                const currentAngle = startAngle + ((endAngle - startAngle) * i / numPoints)
                const radians = (currentAngle - 90) * Math.PI / 180
                const x = 50 + 50 * Math.cos(radians)
                const y = 50 + 50 * Math.sin(radians)
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
                    backgroundColor: segment.color,
                    boxShadow: isSelected ? `inset 0 0 50px rgba(255, 255, 255, 0.8), 0 0 50px ${segment.color}` : 'none',
                    filter: isSelected ? 'brightness(1.5) saturate(1.5)' : 'none'
                  }}
                >
                  {/* Segment text */}
                  <div
                    className="absolute text-white text-lg font-bold font-mono text-center"
                    style={{
                      left: `${50 + 30 * Math.cos((startAngle + (endAngle - startAngle) / 2 - 90) * Math.PI / 180)}%`,
                      top: `${50 + 30 * Math.sin((startAngle + (endAngle - startAngle) / 2 - 90) * Math.PI / 180)}%`,
                      transform: `translate(-50%, -50%) rotate(${startAngle + (endAngle - startAngle) / 2}deg)`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
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
          disabled={isSpinning}
          className={`mt-8 px-12 py-6 text-2xl font-black font-mono rounded-2xl transition-all duration-300 transform z-50 relative ${
            isSpinning
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 border-4 border-yellow-400 text-white hover:scale-110 hover:shadow-2xl shadow-pink-500/50'
          }`}
        >
          {isSpinning ? '🔥 SPINNING 🔥' : showCelebration ? '🎯 SPIN AGAIN 🎯' : '💫 SPIN THE WHEEL 💫'}
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