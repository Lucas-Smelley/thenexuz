"use client"

import { useState, useEffect, useMemo, useCallback } from "react"

const CosmicHero = () => {
  const [starCount, setStarCount] = useState(50)
  const [starColors, setStarColors] = useState(["#FFFFFF", "#F7E7CE", "#B2FFFF"])

  // Shooting stars state
  const [shootingStars, setShootingStars] = useState<
    Array<{
      id: number
      size: number
      speed: number
      startX: number
      startY: number
    }>
  >([])

  // Generate random direction on mount (same for all stars)
  const [shootingDirection] = useState(() => {
    const angle = Math.random() * Math.PI * 2 // Random angle in radians
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    }
  })

  // Shooting stars management
  useEffect(() => {
    let starId = 0

    const spawnStar = () => {
      // Random spawn position (can be outside viewport to enter from edges)
      const spawnX = Math.random() * (window.innerWidth + 400) - 200
      const spawnY = Math.random() * (window.innerHeight + 400) - 200

      const newStar = {
        id: starId++,
        size: Math.random() * 3 + 1, // Size between 1-4px
        speed: Math.random() * 200 + 100, // Speed between 100-300 pixels per second
        startX: spawnX,
        startY: spawnY,
      }

      setShootingStars((prev) => [...prev, newStar])
    }

    // Spawn initial stars immediately
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnStar(), i * 200)
    }

    // Continue spawning stars
    const spawnInterval = setInterval(
      () => {
        spawnStar()
      },
      Math.random() * 2000 + 1000,
    ) // Spawn every 1-3 seconds

    return () => clearInterval(spawnInterval)
  }, [])

  // Remove completed shooting stars
  const handleStarComplete = useCallback((starId: number) => {
    setShootingStars((prev) => prev.filter((star) => star.id !== starId))
  }, [])

  const stars = useMemo(() => {
    const newStars = []
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      })
    }
    return newStars
  }, [starCount, starColors])

  // Star component
  const Star = ({ id, x, y, size, color }: { id: number; x: number; y: number; size: number; color: string }) => {
    return (
      <div
        key={id}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
        }}
      />
    )
  }

  // Shooting Star component
  const ShootingStar = ({
    id,
    size,
    speed,
    startX,
    startY,
    direction,
    onComplete,
  }: {
    id: number
    size: number
    speed: number
    startX: number
    startY: number
    direction: { x: number; y: number }
    onComplete: (id: number) => void
  }) => {
    const [position, setPosition] = useState({ x: startX, y: startY })
    const [opacity, setOpacity] = useState(0)
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
      // Fade in
      const fadeInTimer = setTimeout(() => setOpacity(1), 50)

      // Movement animation
      const distance = Math.random() * 800 + 400 // Random distance between 400-1200px
      const duration = distance / speed // Duration based on speed

      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = elapsed / duration

        if (progress >= 1) {
          setIsActive(false)
          onComplete(id)
          return
        }

        // Calculate new position
        const newX = startX + direction.x * distance * progress
        const newY = startY + direction.y * distance * progress
        setPosition({ x: newX, y: newY })

        // Fade out in the last 30% of the journey
        if (progress > 0.7) {
          const fadeProgress = (progress - 0.7) / 0.3
          setOpacity(1 - fadeProgress)
        }

        requestAnimationFrame(animate)
      }

      const animationTimer = setTimeout(() => {
        requestAnimationFrame(animate)
      }, 100)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(animationTimer)
      }
    }, [id, startX, startY, direction, speed, onComplete])

    if (!isActive) return null

    return (
      <div
        className="absolute pointer-events-none z-30"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <div
          className="bg-purple-400 rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: `
              0 0 ${size * 2}px rgba(168, 85, 247, 0.8),
              0 0 ${size * 4}px rgba(168, 85, 247, 0.4),
              0 0 ${size * 6}px rgba(168, 85, 247, 0.2)
            `,
          }}
        />
        {/* Trailing effect */}
        <div
          className="absolute bg-gradient-to-r from-purple-400 to-transparent rounded-full"
          style={{
            width: `${size * 3}px`,
            height: `${size * 0.5}px`,
            left: `${-direction.x * size * 2}px`,
            top: `${size * 0.25}px`,
            opacity: opacity * 0.6,
            transform: `rotate(${Math.atan2(direction.y, direction.x)}rad)`,
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Stars */}
      {stars.map((star) => (
        <Star key={star.id} id={star.id} x={star.x} y={star.y} size={star.size} color={star.color} />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <ShootingStar
          key={star.id}
          id={star.id}
          size={star.size}
          speed={star.speed}
          startX={star.startX}
          startY={star.startY}
          direction={shootingDirection}
          onComplete={handleStarComplete}
        />
      ))}
    </div>
  )
}

export default CosmicHero
