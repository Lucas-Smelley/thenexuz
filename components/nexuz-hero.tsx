"use client"

import { useState, useEffect, useMemo } from "react"
import Star from "./star"
import Planet from "./planet"

export default function NexuzHero({
  onHoverChange
}: {
  onHoverChange?: (isHovered: boolean, center: { x: number; y: number }) => void
} = {}) {
  const [hoveredPlanet, setHoveredPlanet] = useState<{
    isHovered: boolean
    top: string
    left: string
  }>({
    isHovered: false,
    top: "50%",
    left: "50%",
  })

  const [activePlanet, setActivePlanet] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const stars = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 75 }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 0.5,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      intensity: Math.random() * 0.8 + 0.2,
    }))
  }, [mounted])

  const handlePlanetClick = (planetData: { top: string; left: string; title: string }) => {
    const isCurrentlyActive = activePlanet === planetData.title

    if (isCurrentlyActive) {
      if (planetData.title === "DEATH BOOTY") {
        window.location.href = "/deathbooty"
      }
    } else {
      setActivePlanet(planetData.title)
      setHoveredPlanet({
        isHovered: true,
        top: planetData.top,
        left: planetData.left,
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
    if (activePlanet) {
      setActivePlanet(null)
      setHoveredPlanet({
        isHovered: false,
        top: "50%",
        left: "50%",
      })

      if (onHoverChange) {
        onHoverChange(false, { x: 50, y: 50 })
      }
    }
  }

  const getTransform = () => {
    if (!hoveredPlanet.isHovered) return "translate(0, 0) scale(1)"

    const topPercent = Number.parseFloat(hoveredPlanet.top)
    const leftPercent = Number.parseFloat(hoveredPlanet.left)
    const translateX = (50 - leftPercent) * 2
    const translateY = (50 - topPercent) * 2

    return `translate(${translateX}vw, ${translateY}vh) scale(${isMobile ? 2.2 : 3})`
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
          transition: "transform 800ms ease-out",
          willChange: hoveredPlanet.isHovered ? "transform" : "auto",
        }}
      >
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

      {/* Main cosmic container */}
      <div
        className="absolute inset-0"
        style={{
          transform: getTransform(),
          transformOrigin: "center center",
          transition: "transform 800ms ease-out",
          willChange: hoveredPlanet.isHovered ? "transform" : "auto",
        }}
      >
        {mounted && (
          <Planet
            size={isMobile ? 65 : 85}
            color="bg-gradient-to-br from-red-500 via-pink-500 to-red-600"
            glowColor="rgba(236, 72, 153, 0.8)"
            title="DEATH BOOTY"
            onClick={handlePlanetClick}
            orbitRadius={isMobile ? 200 : 450}
            orbitSpeed={0.45}
            orbitOffset={Math.PI / 2}
            isActive={activePlanet === "DEATH BOOTY"}
          />
        )}

        {/* Central Nameplate */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="relative">
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
            <div className="relative w-64 h-px mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-slide-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
