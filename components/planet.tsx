"use client"

import { useState, useEffect, useRef } from "react"

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
        className={`rounded-full transition-all duration-300 animate-pulse-slow ${color}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: isHovered ? "brightness(1.25)" : "brightness(1)",
          boxShadow: `0 0 ${size * 2}px ${glowColor}, 0 0 ${size * 4}px ${glowColor}40, inset 0 0 ${size / 3}px rgba(255, 255, 255, 0.2)`,
        }}
      />
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
  )
}

export default Planet