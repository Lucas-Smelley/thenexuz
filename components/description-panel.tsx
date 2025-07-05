"use client"

// Helper functions for panel styling
function getPanelBackground(title: string): string {
  switch (title) {
    case "Aqua Nexus":
      return "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(147,51,234,0.15) 100%)"
    case "DEATH BOOTY":
      return "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(236,72,153,0.15) 50%, rgba(220,38,38,0.2) 100%)"
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
    case "DEATH BOOTY":
      return "rgba(236,72,153,0.5)"
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
    case "DEATH BOOTY":
      return "#fda4af"
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
    case "DEATH BOOTY":
      return "#fb7185"
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
    case "DEATH BOOTY":
      return "rgba(236,72,153,0.7)"
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
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-1000 ease-out"
      style={{
        transform: isVisible && title ? "translateY(0)" : "translateY(100%)",
        opacity: isVisible && title ? 1 : 0,
      }}
    >
      <div 
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${getPanelBackground(title)}, transparent 80%)`,
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                backgroundColor: getPanelBorderColor(title),
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 2)}s`,
              }}
            />
          ))}
        </div>

        {/* Glowing border effect */}
        <div 
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${getPanelBorderColor(title)}, transparent)`,
            boxShadow: `0 0 20px ${getPanelGlowColor(title)}`,
          }}
        />

        <div className="relative p-4 sm:p-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Planet type indicator */}
            <div className="flex justify-center mb-3">
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
                style={{
                  background: `rgba(${getPanelBorderColor(title).match(/\d+/g)?.slice(0,3).join(',') || '255,255,255'}, 0.1)`,
                  borderColor: getPanelBorderColor(title),
                  color: getPanelTextColor(title),
                }}
              >
                COSMIC WORLD
              </div>
            </div>

            <h3 
              className="text-lg sm:text-xl md:text-2xl font-bold mb-3 tracking-wide"
              style={{ 
                color: getPanelTextColor(title),
                textShadow: `0 0 15px ${getPanelGlowColor(title)}, 0 0 30px ${getPanelGlowColor(title)}40`,
              }}
            >
              {title}
            </h3>

            {/* Decorative divider */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPanelBorderColor(title) }}
                />
                <div 
                  className="w-8 h-px"
                  style={{ backgroundColor: getPanelBorderColor(title) }}
                />
                <div 
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: getPanelBorderColor(title) }}
                />
                <div 
                  className="w-8 h-px"
                  style={{ backgroundColor: getPanelBorderColor(title) }}
                />
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPanelBorderColor(title) }}
                />
              </div>
            </div>

            <p 
              className="text-sm sm:text-base leading-relaxed opacity-90 max-w-2xl mx-auto"
              style={{ color: getPanelSecondaryColor(title) }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionPanel