"use client"

import { useState, useEffect } from "react"

const Particles = ({ 
  isZoomed = false, 
  zoomCenter = { x: 50, y: 50 } 
}: { 
  isZoomed?: boolean
  zoomCenter?: { x: number; y: number }
}) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      speed: number
    }>
  >([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
        })
      }
      setParticles(newParticles)
    }

    createParticles()
    window.addEventListener("resize", createParticles)

    return () => window.removeEventListener("resize", createParticles)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    let particleId = 100

    const animateParticles = () => {
      setParticles((prevParticles) => {
        // Filter out particles that are off-screen (more generous bounds)
        const activeParticles = prevParticles.filter(
          (particle) => particle.x < window.innerWidth + 100 && particle.y < window.innerHeight + 100
        )

        // Move existing particles
        const movedParticles = activeParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.speed,
          y: particle.y + particle.speed * 0.3, // Reduced vertical movement
        }))

        // Add new particles from different edges to maintain variety
        const particlesNeeded = 100 - movedParticles.length
        const newParticles = []
        
        for (let i = 0; i < particlesNeeded; i++) {
          // Spawn from left edge and sometimes from top
          const spawnFromTop = Math.random() < 0.3
          newParticles.push({
            id: particleId++,
            x: spawnFromTop ? Math.random() * window.innerWidth : Math.random() * -200 - 50,
            y: spawnFromTop ? Math.random() * -200 - 50 : Math.random() * window.innerHeight,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 1,
          })
        }

        return [...movedParticles, ...newParticles]
      })
    }

    const interval = setInterval(animateParticles, 16)
    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        transform: isZoomed 
          ? `translate(${(50 - zoomCenter.x) * 2}vw, ${(50 - zoomCenter.y) * 2}vh) scale(3)`
          : "translate(0, 0) scale(1)",
        transformOrigin: "center center",
        transition: "transform 1000ms cubic-bezier(0.2, 0, 0.8, 1)",
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-purple-300"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: isZoomed ? 0.2 : 0.4,
            transition: "opacity 1000ms cubic-bezier(0.2, 0, 0.8, 1)",
          }}
        />
      ))}
    </div>
  )
}

export default Particles