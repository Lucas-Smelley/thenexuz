"use client"

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

export default Star