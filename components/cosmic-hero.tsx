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
  onHover,
}: {
  size: number
  color: string
  top: string
  left: string
  glowColor: string
  title: string
  description: string
  onHover: (isHovered: boolean, planetData: { top: string; left: string; title: string; description: string }) => void
}) => {
  return (
    <div
      className="absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 z-20"
      style={{ top, left }}
      onMouseEnter={() => onHover(true, { top, left, title, description })}
      onMouseLeave={() => onHover(false, { top, left, title, description })}
    >
      <div
        className={`rounded-full transition-all duration-700 animate-pulse-slow ${color}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: `0 0 ${size * 2}px ${glowColor}, 0 0 ${size * 4}px ${glowColor}40, inset 0 0 ${size / 3}px rgba(255, 255, 255, 0.2)`,
        }}
      />
      {/* Orbital ring */}
      <div
        className="absolute top-1/2 left-1/2 border border-white/10 rounded-full animate-spin-slow"
        style={{
          width: `${size * 2.5}px`,
          height: `${size * 2.5}px`,
          transform: "translate(-50%, -50%)",
          animationDuration: "20s",
        }}
      />
    </div>
  )
}

export default function CosmicHero() {
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


  const handlePlanetHover = (
    isHovered: boolean,
    planetData: { top: string; left: string; title: string; description: string },
  ) => {
    setHoveredPlanet({
      isHovered,
      ...planetData,
    })
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
    <div className="relative w-full h-screen bg-black overflow-hidden">

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
          onHover={handlePlanetHover}
        />

        <Planet
          size={28}
          color="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600"
          glowColor="rgba(239, 68, 68, 0.8)"
          top="30%"
          left="80%"
          title="Ember Core"
          description="The forge of creation where stellar flames dance with primordial energy."
          onHover={handlePlanetHover}
        />

        <Planet
          size={32}
          color="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600"
          glowColor="rgba(16, 185, 129, 0.8)"
          top="65%"
          left="20%"
          title="Verdant Sphere"
          description="An ancient sanctuary where the universe's heartbeat resonates through crystalline forests."
          onHover={handlePlanetHover}
        />

        <Planet
          size={25}
          color="bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600"
          glowColor="rgba(139, 92, 246, 0.8)"
          top="70%"
          left="75%"
          title="Void Prism"
          description="A mysterious realm where thoughts become reality and dimensions dissolve."
          onHover={handlePlanetHover}
        />

        {/* Text that scales with everything else */}
        {hoveredPlanet.title && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              top: hoveredPlanet.top,
              left: hoveredPlanet.left,
              transform:
                Number.parseFloat(hoveredPlanet.left) > 50
                  ? `translateX(-240px) translateY(-20px)` // Closer for right-side planets
                  : `translateX(100px) translateY(-20px)`, // Further for left-side planets
              opacity: hoveredPlanet.isHovered ? 1 : 0,
              transition: "opacity 1000ms cubic-bezier(0.2, 0, 0.8, 1)",
            }}
          >
            {hoveredPlanet.title === "Aqua Nexus" && (
              <div
                className="relative backdrop-blur-md border border-cyan-400/40 rounded-lg px-3 py-2.5 shadow-2xl w-48"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(147,51,234,0.15) 100%)",
                  boxShadow: "0 15px 35px rgba(6,182,212,0.2), 0 0 15px rgba(59,130,246,0.1)",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-sm"></div>
                <div className="relative">
                  <div
                    className="text-cyan-100 text-sm font-semibold tracking-wide mb-1"
                    style={{ textShadow: "0 0 8px rgba(6,182,212,0.6)" }}
                  >
                    {hoveredPlanet.title}
                  </div>
                  <div className="text-cyan-200/90 text-xs leading-snug font-light">{hoveredPlanet.description}</div>
                </div>
                <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
              </div>
            )}

            {hoveredPlanet.title === "Ember Core" && (
              <div
                className="relative backdrop-blur-md border border-orange-400/40 rounded-lg px-3 py-2.5 shadow-2xl w-48"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(239,68,68,0.1) 50%, rgba(236,72,153,0.15) 100%)",
                  boxShadow: "0 15px 35px rgba(251,146,60,0.2), 0 0 15px rgba(239,68,68,0.1)",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5 blur-sm"></div>
                <div className="relative">
                  <div
                    className="text-orange-100 text-sm font-semibold tracking-wide mb-1"
                    style={{ textShadow: "0 0 8px rgba(251,146,60,0.6)" }}
                  >
                    {hoveredPlanet.title}
                  </div>
                  <div className="text-orange-200/90 text-xs leading-snug font-light">{hoveredPlanet.description}</div>
                </div>
                <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent"></div>
              </div>
            )}

            {hoveredPlanet.title === "Verdant Sphere" && (
              <div
                className="relative backdrop-blur-md border border-emerald-400/40 rounded-lg px-3 py-2.5 shadow-2xl w-48"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.1) 50%, rgba(20,184,166,0.15) 100%)",
                  boxShadow: "0 15px 35px rgba(52,211,153,0.2), 0 0 15px rgba(16,185,129,0.1)",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 blur-sm"></div>
                <div className="relative">
                  <div
                    className="text-emerald-100 text-sm font-semibold tracking-wide mb-1"
                    style={{ textShadow: "0 0 8px rgba(52,211,153,0.6)" }}
                  >
                    {hoveredPlanet.title}
                  </div>
                  <div className="text-emerald-200/90 text-xs leading-snug font-light">{hoveredPlanet.description}</div>
                </div>
                <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
              </div>
            )}

            {hoveredPlanet.title === "Void Prism" && (
              <div
                className="relative backdrop-blur-md border border-violet-400/40 rounded-lg px-3 py-2.5 shadow-2xl w-48"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(99,102,241,0.15) 100%)",
                  boxShadow: "0 15px 35px rgba(168,85,247,0.2), 0 0 15px rgba(139,92,246,0.1)",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-indigo-500/5 blur-sm"></div>
                <div className="relative">
                  <div
                    className="text-violet-100 text-sm font-semibold tracking-wide mb-1"
                    style={{ textShadow: "0 0 8px rgba(168,85,247,0.6)" }}
                  >
                    {hoveredPlanet.title}
                  </div>
                  <div className="text-violet-200/90 text-xs leading-snug font-light">{hoveredPlanet.description}</div>
                </div>
                <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"></div>
              </div>
            )}
          </div>
        )}

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
