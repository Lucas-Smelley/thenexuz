"use client"

import { useState, useEffect } from "react"

const CodeParticles = ({ 
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
      content: string
      color: string
      opacity: number
    }>
  >([])
  const [mounted, setMounted] = useState(false)

  // Code snippets and symbols for particles
  const codeElements = [
    { content: '{', color: 'text-cyan-400' },
    { content: '}', color: 'text-cyan-400' },
    { content: '<', color: 'text-green-400' },
    { content: '>', color: 'text-green-400' },
    { content: '/>', color: 'text-purple-400' },
    { content: '()', color: 'text-yellow-400' },
    { content: '[]', color: 'text-pink-400' },
    { content: '&&', color: 'text-blue-400' },
    { content: '||', color: 'text-orange-400' },
    { content: '==', color: 'text-red-400' },
    { content: '=>', color: 'text-indigo-400' },
    { content: '?:', color: 'text-teal-400' },
    { content: '++', color: 'text-lime-400' },
    { content: '--', color: 'text-rose-400' },
    { content: '!=', color: 'text-emerald-400' },
    { content: '===', color: 'text-violet-400' },
    { content: 'fn', color: 'text-cyan-300' },
    { content: 'let', color: 'text-green-300' },
    { content: 'const', color: 'text-purple-300' },
    { content: 'var', color: 'text-yellow-300' },
    { content: 'if', color: 'text-pink-300' },
    { content: 'for', color: 'text-blue-300' },
    { content: '10110', color: 'text-green-400' },
    { content: '01001', color: 'text-green-400' },
    { content: '11010', color: 'text-green-400' },
    { content: '00111', color: 'text-green-400' },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i < 40; i++) {
        const element = codeElements[Math.floor(Math.random() * codeElements.length)]
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1.5 + 0.5,
          content: element.content,
          color: element.color,
          opacity: Math.random() * 0.6 + 0.2,
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
        // Filter out particles that are off-screen
        const activeParticles = prevParticles.filter(
          (particle) => particle.x < window.innerWidth + 100 && particle.y < window.innerHeight + 100
        )

        // Move existing particles
        const movedParticles = activeParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.speed,
          y: particle.y + particle.speed * 0.4,
        }))

        // Add new particles
        const particlesNeeded = 40 - movedParticles.length
        const newParticles = []
        
        for (let i = 0; i < particlesNeeded; i++) {
          const element = codeElements[Math.floor(Math.random() * codeElements.length)]
          const spawnFromTop = Math.random() < 0.4
          newParticles.push({
            id: particleId++,
            x: spawnFromTop ? Math.random() * window.innerWidth : Math.random() * -200 - 50,
            y: spawnFromTop ? Math.random() * -200 - 50 : Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 1.5 + 0.5,
            content: element.content,
            color: element.color,
            opacity: Math.random() * 0.6 + 0.2,
          })
        }

        return [...movedParticles, ...newParticles]
      })
    }

    const interval = setInterval(animateParticles, 40) // 25fps for smooth performance
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
        transition: "transform 800ms ease-out",
        willChange: isZoomed ? "transform" : "auto",
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute font-mono text-xs font-bold ${particle.color} animate-pulse`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size * 8}px`,
            opacity: isZoomed ? particle.opacity * 0.3 : particle.opacity,
            transition: "opacity 800ms ease-out",
            textShadow: '0 0 8px currentColor',
            willChange: "transform",
          }}
        >
          {particle.content}
        </div>
      ))}
    </div>
  )
}

export default CodeParticles