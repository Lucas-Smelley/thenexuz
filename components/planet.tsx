"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Skull } from "lucide-react"

const Planet = ({
  size,
  color,
  glowColor,
  title,
  description,
  onClick,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  isActive,
  onPositionUpdate,
}: {
  size: number
  color: string
  glowColor: string
  title: string
  description: string
  onClick: (planetData: { top: string; left: string; title: string; description: string }) => void
  orbitRadius: number
  orbitSpeed: number
  orbitOffset: number
  isActive: boolean
  onPositionUpdate: (position: { x: number; y: number }) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [frozenPosition, setFrozenPosition] = useState<{ x: number; y: number; z: number } | null>(null)
  const startTimeRef = useRef(Date.now() * 0.001)

  useEffect(() => {
    if (isActive) {
      // Store current position and freeze
      if (frozenPosition === null) {
        setFrozenPosition(position)
        console.log(`[${title}] CLICKED - FROZEN at position: x=${position.x.toFixed(2)}, y=${position.y.toFixed(2)}`)
      }
      return
    }

    // Not active - animate normally
    if (frozenPosition) {
      // Calculate what orbital angle this position corresponds to
      const angle = Math.atan2(frozenPosition.y / (orbitRadius * 0.4), frozenPosition.x / orbitRadius)
      // Set the start time so that the current time produces this angle
      startTimeRef.current = Date.now() * 0.001 - (angle - orbitOffset) / orbitSpeed
      console.log(`[${title}] UNCLICKED - RESUMING from stored position: x=${frozenPosition.x.toFixed(2)}, y=${frozenPosition.y.toFixed(2)}, calculated angle=${angle.toFixed(4)}`)
      setFrozenPosition(null)
    }

    const animate = () => {
      const time = (Date.now() * 0.001 - startTimeRef.current) * orbitSpeed + orbitOffset
      const x = Math.cos(time) * orbitRadius
      const y = Math.sin(time) * orbitRadius * 0.4
      const z = Math.sin(time)
      setPosition({ x, y, z })
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [isActive, orbitRadius, orbitSpeed, orbitOffset, frozenPosition])

  // Update parent position without callback dependency
  useEffect(() => {
    if (!isActive) return

    const centerX = 50
    const centerY = 50
    const currentX = centerX + (position.x / (typeof window !== 'undefined' ? window.innerWidth : 1920)) * 100
    const currentY = centerY + (position.y / (typeof window !== 'undefined' ? window.innerHeight : 1080)) * 100
    
    const timeoutId = setTimeout(() => {
      if (onPositionUpdate) {
        onPositionUpdate({ x: currentX, y: currentY })
      }
    }, 50)
    
    return () => clearTimeout(timeoutId)
  }, [position.x, position.y, isActive])

  const centerX = 50 // Center of screen as percentage
  const centerY = 50
  const currentX = centerX + (position.x / (typeof window !== 'undefined' ? window.innerWidth : 1920)) * 100
  const currentY = centerY + (position.y / (typeof window !== 'undefined' ? window.innerHeight : 1080)) * 100
  const depth = position.z
  const isInFront = depth > 0
  
  // Calculate distance from center for perspective scaling
  const distanceFromCenter = Math.sqrt(position.x * position.x + position.y * position.y)
  const maxDistance = orbitRadius
  const perspectiveScale = 1 - (distanceFromCenter / maxDistance) * 0.4 // Scale down by up to 40%
  
  const scale = (0.6 + (depth * 0.4)) * perspectiveScale // Combine depth and distance scaling
  const opacity = 0.5 + (Math.abs(depth) * 0.5) // Enhanced opacity range

  return (
    <>
      {/* Planet */}
      <div
        className="absolute transition-all duration-300 ease-out cursor-pointer"
        style={{ 
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.1 : scale})`,
          zIndex: isInFront ? 30 : 5, // In front of or behind title
          opacity: opacity,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onClick({ 
            top: `${currentY}%`, 
            left: `${currentX}%`, 
            title, 
            description 
          })
        }}
      >
        <div
          className={`rounded-full transition-all duration-300 animate-pulse-slow ${color} relative overflow-hidden`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            filter: isHovered ? "brightness(1.25) drop-shadow(0 0 20px currentColor)" : "brightness(1)",
            boxShadow: `
              0 0 ${size * 1.5}px ${glowColor.replace('0.8', '0.4')},
              0 0 ${size * 2.5}px ${glowColor.replace('0.8', '0.3')},
              0 0 ${size * 4}px ${glowColor.replace('0.8', '0.2')},
              0 0 ${size * 5}px ${glowColor.replace('0.8', '0.1')},
              inset 0 0 ${size / 3}px rgba(255, 255, 255, 0.2)
            `,
          }}
        >
          {/* Spiky metal border for Death Booty planet */}
          {title === "DEATH BOOTY" && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `
                  conic-gradient(
                    from 0deg,
                    #8B0000 0deg, #FF0000 15deg, #8B0000 30deg,
                    #FF0000 45deg, #8B0000 60deg, #FF0000 75deg,
                    #8B0000 90deg, #FF0000 105deg, #8B0000 120deg,
                    #FF0000 135deg, #8B0000 150deg, #FF0000 165deg,
                    #8B0000 180deg, #FF0000 195deg, #8B0000 210deg,
                    #FF0000 225deg, #8B0000 240deg, #FF0000 255deg,
                    #8B0000 270deg, #FF0000 285deg, #8B0000 300deg,
                    #FF0000 315deg, #8B0000 330deg, #FF0000 345deg,
                    #8B0000 360deg
                  )
                `,
                mask: `radial-gradient(circle, transparent ${size * 0.45}px, black ${size * 0.47}px, black ${size * 0.5}px, transparent ${size * 0.52}px)`,
                WebkitMask: `radial-gradient(circle, transparent ${size * 0.45}px, black ${size * 0.47}px, black ${size * 0.5}px, transparent ${size * 0.52}px)`,
                animation: 'spin 20s linear infinite',
              }}
            />
          )}
          
          {/* Additional spiky outer ring for Death Booty */}
          {title === "DEATH BOOTY" && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `
                  repeating-conic-gradient(
                    from 0deg,
                    transparent 0deg,
                    #FF0000 3deg,
                    #8B0000 6deg,
                    #FF4444 9deg,
                    transparent 12deg
                  )
                `,
                mask: `radial-gradient(circle, transparent ${size * 0.48}px, black ${size * 0.49}px, black ${size * 0.51}px, transparent ${size * 0.52}px)`,
                WebkitMask: `radial-gradient(circle, transparent ${size * 0.48}px, black ${size * 0.49}px, black ${size * 0.51}px, transparent ${size * 0.52}px)`,
                animation: 'spin 15s linear infinite reverse',
                filter: 'drop-shadow(0 0 10px #FF0000)',
              }}
            />
          )}
          {/* Death Booty specific content */}
          {title === "DEATH BOOTY" && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Dark background with skull pattern */}
              <div className="absolute inset-0 bg-black/60 rounded-full">
                <div className="absolute inset-0 opacity-15">
                  <Skull 
                    size={size * 0.4} 
                    className="absolute top-1/4 left-1/4 text-red-300 rotate-12 animate-pulse" 
                  />
                  <Skull 
                    size={size * 0.35} 
                    className="absolute bottom-1/4 right-1/4 text-red-300 -rotate-12 animate-pulse" 
                    style={{ animationDelay: '1s' }}
                  />
                </div>
              </div>
              
              {/* Death Booty container */}
              <div 
                className="absolute inset-0 flex items-center justify-center rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                {/* Dark background layer */}
                <div
                  className="absolute inset-0 rounded-full spike-border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(139,0,0,0.7) 50%, rgba(0,0,0,0.7) 100%)',
                    border: '3px solid #ff0000',
                    boxShadow: '0 0 20px rgba(255,0,0,0.7), inset 0 0 15px rgba(255,0,0,0.4)',
                  }}
                />
                
                {/* Death Booty image - in front of background */}
                <Image
                  src="/media/death-booty/images/death-booty-icon.png"
                  alt="Death Booty"
                  width={size * 0.7}
                  height={size * 0.7}
                  className="object-contain relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.9)) brightness(1.3) contrast(1.3)',
                  }}
                />
                
                {/* DEATH BOOTY text overlay - on top of everything */}
                <div className="absolute z-20 text-center">
                  <div 
                    className="text-white font-bold tracking-wider"
                    style={{
                      fontSize: `${size * 0.12}px`,
                      fontFamily: 'Nosifer, "Metal Mania", UnifrakturCook, fantasy',
                      color: '#ffffff',
                      textShadow: '0 0 6px #000, 0 0 12px #ff0000, 0 0 18px #ff0000, 3px 3px 6px rgba(0,0,0,0.9)',
                      transform: 'rotate(-2deg)',
                      lineHeight: '0.8',
                      fontWeight: '900',
                    }}
                  >
                    DEATH<br/>BOOTY
                  </div>
                </div>
              </div>
              
              {/* Blood splatter effect */}
              <div 
                className="absolute inset-0 opacity-40 rounded-full animate-splatter"
                style={{
                  background: `
                    radial-gradient(circle at 15% 85%, rgba(220, 38, 38, 0.6) 0%, transparent 30%),
                    radial-gradient(circle at 85% 15%, rgba(185, 28, 28, 0.5) 0%, transparent 25%),
                    radial-gradient(circle at 60% 40%, rgba(239, 68, 68, 0.4) 0%, transparent 20%),
                    radial-gradient(circle at 30% 70%, rgba(127, 29, 29, 0.7) 0%, transparent 15%)
                  `,
                }}
              />
            </div>
          )}
        </div>
        {/* Orbital ring */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full animate-spin-slow transition-all duration-300"
          style={{
            width: `${size * 2.5}px`,
            height: `${size * 2.5}px`,
            transform: "translate(-50%, -50%)",
            animationDuration: "20s",
            border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
          }}
        />
      </div>
    </>
  )
}

export default Planet