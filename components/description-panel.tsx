"use client"

// Helper functions for panel styling
function getPanelBackground(title: string): string {
  switch (title) {
    case "Aqua Nexus":
      return "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(147,51,234,0.15) 100%)"
    case "Ember Core":
      return "linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(239,68,68,0.1) 50%, rgba(236,72,153,0.15) 100%)"
    case "Verdant Sphere":
      return "linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.1) 50%, rgba(20,184,166,0.15) 100%)"
    case "Void Prism":
      return "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(99,102,241,0.15) 100%)"
    default:
      return "rgba(0,0,0,0.5)"
  }
}

function getPanelBorderColor(title: string): string {
  switch (title) {
    case "Aqua Nexus":
      return "rgba(6,182,212,0.4)"
    case "Ember Core":
      return "rgba(251,146,60,0.4)"
    case "Verdant Sphere":
      return "rgba(52,211,153,0.4)"
    case "Void Prism":
      return "rgba(168,85,247,0.4)"
    default:
      return "rgba(255,255,255,0.2)"
  }
}

function getPanelTextColor(title: string): string {
  switch (title) {
    case "Aqua Nexus":
      return "#bfdbfe"
    case "Ember Core":
      return "#fed7aa"
    case "Verdant Sphere":
      return "#a7f3d0"
    case "Void Prism":
      return "#ddd6fe"
    default:
      return "#ffffff"
  }
}

function getPanelSecondaryColor(title: string): string {
  switch (title) {
    case "Aqua Nexus":
      return "#93c5fd"
    case "Ember Core":
      return "#fdba74"
    case "Verdant Sphere":
      return "#86efac"
    case "Void Prism":
      return "#c4b5fd"
    default:
      return "#e5e7eb"
  }
}

function getPanelGlowColor(title: string): string {
  switch (title) {
    case "Aqua Nexus":
      return "rgba(6,182,212,0.6)"
    case "Ember Core":
      return "rgba(251,146,60,0.6)"
    case "Verdant Sphere":
      return "rgba(52,211,153,0.6)"
    case "Void Prism":
      return "rgba(168,85,247,0.6)"
    default:
      return "rgba(255,255,255,0.3)"
  }
}

const DescriptionPanel = ({
  isVisible,
  title,
  description,
  activePlanetPosition,
}: {
  isVisible: boolean
  title: string
  description: string
  activePlanetPosition: { x: number; y: number }
}) => {
  if (!isVisible || !title) return null

  return (
    <div
      className="fixed top-1/2 w-80 z-50 backdrop-blur-md border rounded-lg p-6"
      style={{
        left: activePlanetPosition.x > 50 ? "5%" : "auto",
        right: activePlanetPosition.x > 50 ? "auto" : "5%",
        transform: "translateY(-50%)",
        animation: "fadeIn 500ms ease-out 800ms forwards",
        opacity: 0,
        background: getPanelBackground(title),
        borderColor: getPanelBorderColor(title),
      }}
    >
      <h2 
        className="text-2xl font-bold mb-4 tracking-wide"
        style={{ 
          color: getPanelTextColor(title),
          textShadow: `0 0 15px ${getPanelGlowColor(title)}`,
        }}
      >
        {title}
      </h2>
      <p 
        className="text-base leading-relaxed opacity-90"
        style={{ color: getPanelSecondaryColor(title) }}
      >
        {description}
      </p>
    </div>
  )
}

export default DescriptionPanel