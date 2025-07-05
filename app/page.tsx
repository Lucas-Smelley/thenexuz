"use client"

import { useState } from "react"
import NexuzHero from "@/components/nexuz-hero"
import Particles from "@/components/particles"

export default function Page() {
  const [hoverState, setHoverState] = useState({
    isHovered: false,
    center: { x: 50, y: 50 }
  })

  const handleHoverChange = (isHovered: boolean, center: { x: number; y: number }) => {
    setHoverState({ isHovered, center })
  }

  return (
    <div className="relative">
      <NexuzHero onHoverChange={handleHoverChange} />
      <Particles isZoomed={hoverState.isHovered} zoomCenter={hoverState.center} />
    </div>
  )
}
