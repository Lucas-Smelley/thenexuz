"use client"

import { useState, useEffect, useMemo } from "react"

// Enhanced Star component with more variety
const Star = ({
  size,
  top,
  left,
  delay,
  intensity,
}: {
  size: number
  top: string
  left: string
  delay: string
  intensity: number
}) => (
  <div
    className={`absolute bg-white rounded-full animate-twinkle`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      top,
      left,
      opacity: 0.2, // Start with the minimum opacity to prevent flash
      animationDelay: delay,
      boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, ${intensity}), 0 0 ${size * 6}px rgba(135, 206, 250, ${intensity * 0.3})`,
    }}
  />
)

// Planet component with zoom effect
const Planet = ({
  size,
  color,
  top,
  left,
  glowColor,
  title,
  description,
  onClick,
}: {
  size: number
  color: string
  top: string
  left: string
  glowColor: string
  title: string
  description: string
  onClick: (planetData: { top: string; left: string; title: string; description: string }) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute transition-all duration-300 ease-out z-20 cursor-pointer"
      style={{ 
        top, 
        left,
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        onClick({ top, left, title, description })
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

export default function CosmicHero({ 
  onHoverChange 
}: { 
  onHoverChange?: (isHovered: boolean, center: { x: number; y: number }) => void 
} = {}) {
  const [hoveredPlanet, setHoveredPlanet] = useState<{
    isHovered: boolean
    top: string
    left: string
    title: string
    description: string
  }>({
    isHovered: false,
    top: "50%",
    left: "50%",
    title: "",
    description: "",
  })
  
  const [activePlanet, setActivePlanet] = useState<string | null>(null)

  // Generate more varied stars (memoized to prevent position changes)
  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        id: i,
        size: Math.random() * 2.5 + 0.5,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`, // Shorter delay so twinkling starts faster
        intensity: Math.random() * 0.8 + 0.2,
      })),
    [],
  )




  const handlePlanetClick = (planetData: { top: string; left: string; title: string; description: string }) => {
    const isCurrentlyActive = activePlanet === planetData.title
    
    if (isCurrentlyActive) {
      // Zoom out if clicking the same planet
      setActivePlanet(null)
      setHoveredPlanet({
        isHovered: false,
        top: "50%",
        left: "50%",
        title: "",
        description: "",
      })
      
      if (onHoverChange) {
        onHoverChange(false, { x: 50, y: 50 })
      }
    } else {
      // Zoom in to new planet
      setActivePlanet(planetData.title)
      setHoveredPlanet({
        isHovered: true,
        ...planetData,
      })
      
      if (onHoverChange) {
        onHoverChange(true, {
          x: Number.parseFloat(planetData.left),
          y: Number.parseFloat(planetData.top),
        })
      }
    }
  }

  const handleBackgroundClick = () => {
    // Zoom out when clicking background
    if (activePlanet) {
      setActivePlanet(null)
      setHoveredPlanet({
        isHovered: false,
        top: "50%",
        left: "50%",
        title: "",
        description: "",
      })
      
      if (onHoverChange) {
        onHoverChange(false, { x: 50, y: 50 })
      }
    }
  }


  // Calculate transform for smooth camera movement
  const getTransform = () => {
    if (!hoveredPlanet.isHovered) return "translate(0, 0) scale(1)"

    // Convert percentage to actual position for transform calculation
    const topPercent = Number.parseFloat(hoveredPlanet.top)
    const leftPercent = Number.parseFloat(hoveredPlanet.left)

    // Calculate the offset needed to center the planet
    const translateX = (50 - leftPercent) * 2 // Multiply for more dramatic movement
    const translateY = (50 - topPercent) * 2

    return `translate(${translateX}vw, ${translateY}vh) scale(3)`
  }

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      onClick={handleBackgroundClick}
    >

      {/* Background stars with parallax effect */}
      <div
        className="absolute inset-0"
        style={{
          transform: hoveredPlanet.isHovered
            ? `translate(${(50 - Number.parseFloat(hoveredPlanet.left)) * 0.3}vw, ${(50 - Number.parseFloat(hoveredPlanet.top)) * 0.3}vh) scale(1.5)`
            : "translate(0, 0) scale(1)",
          transformOrigin: "center center",
          transition: "transform 1000ms cubic-bezier(0.2, 0, 0.8, 1)",
        }}
      >
        {/* Enhanced Starfield Background */}
        <div className="absolute inset-0">
          {stars.map((star) => (
            <Star
              key={star.id}
              size={star.size}
              top={star.top}
              left={star.left}
              delay={star.delay}
              intensity={star.intensity}
            />
          ))}
        </div>

      </div>

      {/* Static nebula gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-900/10 to-transparent" />

      {/* Main cosmic container that transforms with smooth easing */}
      <div
        className="absolute inset-0"
        style={{
          transform: getTransform(),
          transformOrigin: "center center",
          transition: "transform 1000ms cubic-bezier(0.2, 0, 0.8, 1)",
        }}
      >
        {/* Planets */}
        <Planet
          size={35}
          color="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"
          glowColor="rgba(59, 130, 246, 0.8)"
          top="20%"
          left="15%"
          title="Aqua Nexus"
          description="A crystalline world where liquid starlight flows through quantum channels."
          onClick={handlePlanetClick}
        />

        <Planet
          size={28}
          color="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600"
          glowColor="rgba(239, 68, 68, 0.8)"
          top="30%"
          left="80%"
          title="Ember Core"
          description="The forge of creation where stellar flames dance with primordial energy."
          onClick={handlePlanetClick}
        />

        <Planet
          size={32}
          color="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600"
          glowColor="rgba(16, 185, 129, 0.8)"
          top="65%"
          left="20%"
          title="Verdant Sphere"
          description="An ancient sanctuary where the universe's heartbeat resonates through crystalline forests."
          onClick={handlePlanetClick}
        />

        <Planet
          size={25}
          color="bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600"
          glowColor="rgba(139, 92, 246, 0.8)"
          top="70%"
          left="75%"
          title="Void Prism"
          description="A mysterious realm where thoughts become reality and dimensions dissolve."
          onClick={handlePlanetClick}
        />


        {/* Enhanced Central Nameplate */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="relative">
              {/* Glow effect behind text */}
              <div
                className="absolute inset-0 blur-3xl opacity-50"
                style={{
                  background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)",
                }}
              />
              <h1
                className="relative text-7xl md:text-9xl font-thin text-white mb-6 tracking-[0.2em] animate-glow"
                style={{
                  fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                  fontWeight: "100",
                  textShadow: `
                    0 0 20px rgba(255, 255, 255, 1),
                    0 0 40px rgba(59, 130, 246, 0.8),
                    0 0 60px rgba(139, 92, 246, 0.6),
                    0 0 80px rgba(6, 182, 212, 0.4)
                  `,
                  background: "linear-gradient(45deg, #ffffff, #3b82f6, #8b5cf6, #06b6d4, #ffffff)",
                  backgroundSize: "400% 400%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradient-shift 8s ease-in-out infinite",
                }}
              >
                THE NEXUS
              </h1>
            </div>
            {/* Animated underline */}
            <div className="relative w-64 h-px mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-slide-line" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
