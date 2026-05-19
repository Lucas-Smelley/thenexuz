import { ArrowLeft } from "lucide-react"

export default function BackButton({
  href = "/deathbooty",
  label = "BACK TO DEATH BOOTY",
  fixed = false,
}: {
  href?: string
  label?: string
  fixed?: boolean
}) {
  const containerClass = fixed
    ? "fixed top-16 left-4 z-50"
    : "absolute top-4 left-4 z-30"
  const rotationClass = fixed ? "-rotate-6 skew-x-6" : "-rotate-2 skew-x-2"

  return (
    <div className={containerClass}>
      <a
        href={href}
        className={`flex items-center space-x-2 px-4 py-2 bg-black border-2 border-red-800 hover:bg-red-950 transition-all duration-300 text-red-300 hover:text-white font-bold transform ${rotationClass}`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm metal-text">{label}</span>
      </a>
    </div>
  )
}
