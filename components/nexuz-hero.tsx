"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Star from "./star"
import Planet from "./planet"
import DescriptionPanel from "./description-panel"

export default function NexuzHero({ 
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
  const [showPlanetPage, setShowPlanetPage] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate more varied stars (memoized to prevent position changes)
  const stars = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 0.5,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      intensity: Math.random() * 0.8 + 0.2,
    }))
  }, [mounted])




  const [activePlanetPosition, setActivePlanetPosition] = useState({ x: 50, y: 50 })


  const handlePlanetClick = (planetData: { top: string; left: string; title: string; description: string }) => {
    const isCurrentlyActive = activePlanet === planetData.title
    
    if (isCurrentlyActive) {
      // If already zoomed in, navigate to planet page
      if (planetData.title === "DEATH BOOTY") {
        window.location.href = "/deathbooty"
      } else {
        setShowPlanetPage(true)
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

  const handleBackToMain = () => {
    setShowPlanetPage(false)
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

  const handlePlanetPositionUpdate = useCallback((position: { x: number; y: number }) => {
    setActivePlanetPosition(position)
    
    // Schedule zoom update for next frame to avoid render-time setState
    requestAnimationFrame(() => {
      if (onHoverChange) {
        onHoverChange(true, position)
      }
    })
  }, [onHoverChange])

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

  // Planet page component
  const PlanetPage = () => {
    if (!activePlanet) return null
    
    const getPlanetConfig = (title: string) => {
      const configs = {
        "Aqua Nexus": {
          color: "from-cyan-400 via-blue-500 to-purple-600",
          glowColor: "rgba(59, 130, 246, 0.8)",
          description: "A crystalline world where liquid starlight flows through quantum channels.",
        },
        "DEATH BOOTY": {
          color: "from-red-500 via-pink-500 to-red-600",
          glowColor: "rgba(236, 72, 153, 0.8)",
          description: "A hardcore skating brand with a metal and grunge aesthetic.",
        },
        "Verdant Sphere": {
          color: "from-emerald-400 via-green-500 to-teal-600",
          glowColor: "rgba(16, 185, 129, 0.8)",
          description: "An ancient sanctuary where the universe's heartbeat resonates through crystalline forests.",
        },
        "Void Prism": {
          color: "from-violet-400 via-purple-500 to-indigo-600",
          glowColor: "rgba(139, 92, 246, 0.8)",
          description: "A mysterious realm where thoughts become reality and dimensions dissolve.",
        }
      }
      return configs[title as keyof typeof configs] || configs["Aqua Nexus"]
    }

    const config = getPlanetConfig(activePlanet)

    // Default planet page
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Background gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-20`}
        />
        
        {/* Back button */}
        <button
          onClick={handleBackToMain}
          className="fixed top-8 left-8 z-50 flex items-center space-x-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all duration-300 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Nexuz</span>
        </button>

        {/* Planet page content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-8">
            <h1 
              className="text-6xl md:text-8xl font-bold mb-8 tracking-wide"
              style={{
                background: `linear-gradient(45deg, ${config.color})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: `0 0 40px ${config.glowColor}`,
              }}
            >
              {activePlanet}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              {config.description}
            </p>
            <div className="text-gray-400">
              <p className="text-lg">Planet details and content coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPlanetPage) {
    return <PlanetPage />
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
        {/* Orbiting Planets */}
        {mounted && (
          <>
            <Planet
              size={80}
              color="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"
              glowColor="rgba(59, 130, 246, 0.8)"
              title="Aqua Nexus"
              description="A crystalline world where liquid starlight flows through quantum channels."
              onClick={handlePlanetClick}
              orbitRadius={600}
              orbitSpeed={0.3}
              orbitOffset={0}
              isActive={activePlanet === "Aqua Nexus"}
              onPositionUpdate={handlePlanetPositionUpdate}
            />

            <Planet
              size={85}
              color="bg-gradient-to-br from-red-500 via-pink-500 to-red-600"
              glowColor="rgba(236, 72, 153, 0.8)"
              title="DEATH BOOTY"
              description="HARDCORE SKATEBOARDING WHERE ITS RIDE OR DIE"
              onClick={handlePlanetClick}
              orbitRadius={450}
              orbitSpeed={0.45}
              orbitOffset={Math.PI / 2}
              isActive={activePlanet === "DEATH BOOTY"}
              onPositionUpdate={handlePlanetPositionUpdate}
            />

            <Planet
              size={85}
              color="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600"
              glowColor="rgba(16, 185, 129, 0.8)"
              title="Verdant Sphere"
              description="An ancient sanctuary where the universe's heartbeat resonates through crystalline forests."
              onClick={handlePlanetClick}
              orbitRadius={750}
              orbitSpeed={0.2}
              orbitOffset={Math.PI}
              isActive={activePlanet === "Verdant Sphere"}
              onPositionUpdate={handlePlanetPositionUpdate}
            />

            <Planet
              size={70}
              color="bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600"
              glowColor="rgba(139, 92, 246, 0.8)"
              title="Void Prism"
              description="A mysterious realm where thoughts become reality and dimensions dissolve."
              onClick={handlePlanetClick}
              orbitRadius={520}
              orbitSpeed={0.35}
              orbitOffset={3 * Math.PI / 2}
              isActive={activePlanet === "Void Prism"}
              onPositionUpdate={handlePlanetPositionUpdate}
            />
          </>
        )}


        {/* Enhanced Central Nameplate */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
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
                THE NEXUZ
              </h1>
            </div>
            {/* Animated underline */}
            <div className="relative w-64 h-px mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-slide-line" />
            </div>
          </div>
        </div>
      </div>

      {/* Description Panel */}
      <DescriptionPanel
        isVisible={hoveredPlanet.isHovered}
        title={hoveredPlanet.title}
        description={hoveredPlanet.description}
        activePlanetPosition={activePlanetPosition}
      />

    </div>
  )
}
