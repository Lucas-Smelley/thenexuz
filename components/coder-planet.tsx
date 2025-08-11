"use client"

import { useState, useEffect, useRef } from "react"
import { Code, Terminal, Cpu, Database, Binary, Zap, Coffee, Monitor } from "lucide-react"

const CoderPlanet = ({
  onHoverChange,
}: {
  onHoverChange?: (isHovered: boolean, center: { x: number; y: number }) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState(0)
  const [codeAnimation, setCodeAnimation] = useState(0)
  const startTimeRef = useRef(Date.now() * 0.001)

  const orbitRadius = typeof window !== 'undefined' && window.innerWidth < 768 ? 250 : 400
  const orbitSpeed = 0.4
  const size = 120

  useEffect(() => {
    const animate = () => {
      const time = (Date.now() * 0.001 - startTimeRef.current) * orbitSpeed
      const x = Math.cos(time) * orbitRadius
      const y = Math.sin(time) * orbitRadius * 0.6
      const z = Math.sin(time)
      setPosition({ x, y, z })
      setRotation((Date.now() * 0.001) * 20) // Slow rotation for the planet
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [orbitRadius, orbitSpeed])

  useEffect(() => {
    // Animate code symbols
    const codeInterval = setInterval(() => {
      setCodeAnimation(prev => (prev + 1) % 8)
    }, 500)

    return () => clearInterval(codeInterval)
  }, [])

  const centerX = 50
  const centerY = 50
  const currentX = centerX + (position.x / (typeof window !== 'undefined' ? window.innerWidth : 1920)) * 100
  const currentY = centerY + (position.y / (typeof window !== 'undefined' ? window.innerHeight : 1080)) * 100
  const depth = position.z
  const isInFront = depth > 0
  
  const distanceFromCenter = Math.sqrt(position.x * position.x + position.y * position.y)
  const maxDistance = orbitRadius
  const perspectiveScale = 1 - (distanceFromCenter / maxDistance) * 0.3
  
  const scale = (0.7 + (depth * 0.3)) * perspectiveScale
  const opacity = 0.6 + (Math.abs(depth) * 0.4)

  const handleClick = () => {
    if (onHoverChange) {
      onHoverChange(true, { x: currentX, y: currentY })
    }
  }

  const codeSymbols = [
    { icon: Code, color: 'text-cyan-400' },
    { icon: Terminal, color: 'text-green-400' },
    { icon: Cpu, color: 'text-purple-400' },
    { icon: Database, color: 'text-yellow-400' },
    { icon: Binary, color: 'text-pink-400' },
    { icon: Zap, color: 'text-blue-400' },
    { icon: Coffee, color: 'text-orange-400' },
    { icon: Monitor, color: 'text-red-400' }
  ]

  return (
    <div
      className="absolute transition-all duration-300 ease-out cursor-pointer"
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.2 : scale})`,
        zIndex: isInFront ? 30 : 5,
        opacity: opacity,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Main Planet Body */}
      <div
        className="rounded-full transition-all duration-300 relative overflow-hidden"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `
            radial-gradient(circle at 30% 30%, rgba(0, 255, 65, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0, 204, 255, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(40, 40, 40, 0.8) 50%, rgba(10, 10, 10, 0.9) 100%)
          `,
          border: '2px solid rgba(0, 255, 65, 0.6)',
          boxShadow: `
            0 0 30px rgba(0, 255, 65, 0.4),
            0 0 60px rgba(0, 204, 255, 0.3),
            0 0 90px rgba(138, 43, 226, 0.2),
            inset 0 0 20px rgba(0, 255, 65, 0.1)
          `,
          filter: isHovered ? "brightness(1.3)" : "brightness(1)",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Matrix-like grid pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 8px,
                rgba(0, 255, 65, 0.1) 8px,
                rgba(0, 255, 65, 0.1) 9px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 8px,
                rgba(0, 255, 65, 0.1) 8px,
                rgba(0, 255, 65, 0.1) 9px
              )
            `,
          }}
        />

        {/* Rotating code symbols around the planet */}
        <div className="absolute inset-0">
          {codeSymbols.map((symbol, index) => {
            const angle = (index * 45) + (rotation * 0.5)
            const radius = size * 0.35
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            const IconComponent = symbol.icon
            
            return (
              <div
                key={index}
                className={`absolute ${symbol.color} transition-all duration-300`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(-${rotation}deg)`,
                  opacity: index === codeAnimation ? 1 : 0.6,
                  filter: index === codeAnimation ? `drop-shadow(0 0 8px currentColor)` : 'none',
                }}
              >
                <IconComponent 
                  size={index === codeAnimation ? 16 : 12} 
                  className={index === codeAnimation ? 'animate-pulse' : ''}
                />
              </div>
            )
          })}
        </div>

        {/* Central core with pulsing effect */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full animate-pulse"
          style={{
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            transform: 'translate(-50%, -50%)',
            background: `
              radial-gradient(circle, 
                rgba(0, 255, 65, 0.8) 0%, 
                rgba(0, 204, 255, 0.4) 50%, 
                transparent 100%
              )
            `,
            boxShadow: `
              0 0 20px rgba(0, 255, 65, 0.8),
              inset 0 0 10px rgba(0, 255, 65, 0.3)
            `,
          }}
        >
          {/* Binary code streams */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {[0, 1, 2].map((stream) => (
              <div
                key={stream}
                className="absolute text-xs font-mono text-green-300 opacity-60 animate-pulse"
                style={{
                  top: `${20 + stream * 20}%`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  animationDelay: `${stream * 0.3}s`,
                }}
              >
                {['101', '010', '110'][stream]}
              </div>
            ))}
          </div>
        </div>

        {/* Circuit-like border pattern */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                rgba(0, 255, 65, 0.6) 0deg,
                transparent 45deg,
                rgba(0, 204, 255, 0.4) 90deg,
                transparent 135deg,
                rgba(138, 43, 226, 0.5) 180deg,
                transparent 225deg,
                rgba(255, 20, 147, 0.4) 270deg,
                transparent 315deg,
                rgba(0, 255, 65, 0.6) 360deg
              )
            `,
            mask: `radial-gradient(circle, transparent ${size * 0.45}px, black ${size * 0.47}px, black ${size * 0.5}px, transparent ${size * 0.52}px)`,
            WebkitMask: `radial-gradient(circle, transparent ${size * 0.45}px, black ${size * 0.47}px, black ${size * 0.5}px, transparent ${size * 0.52}px)`,
            animation: 'spin 15s linear infinite',
          }}
        />
      </div>

      {/* Orbital rings with tech pattern */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full transition-all duration-300"
        style={{
          width: `${size * 2.2}px`,
          height: `${size * 2.2}px`,
          transform: "translate(-50%, -50%)",
          border: `1px solid ${isHovered ? "rgba(0, 255, 65, 0.4)" : "rgba(0, 255, 65, 0.2)"}`,
          background: `
            conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(0, 255, 65, 0.1) 2deg,
              transparent 4deg
            )
          `,
          animation: 'spin 25s linear infinite reverse',
        }}
      />

      {/* Floating code particles around the planet */}
      <div className="absolute inset-0 pointer-events-none">
        {['{}', '<>', '/>', '()', '[]', '&&', '||', '=='].map((code, index) => {
          const angle = (index * 45) + (rotation * 0.8)
          const distance = size * 1.4
          const x = Math.cos((angle * Math.PI) / 180) * distance
          const y = Math.sin((angle * Math.PI) / 180) * distance
          
          return (
            <div
              key={code}
              className="absolute text-xs font-mono text-cyan-400 opacity-60 animate-pulse"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                textShadow: '0 0 8px currentColor',
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {code}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CoderPlanet