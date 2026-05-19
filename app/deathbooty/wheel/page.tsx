"use client"

import { useState } from "react"
import { Skull } from "lucide-react"
import BackButton from "@/components/deathbooty/back-button"
import SceneTape from "@/components/deathbooty/scene-tape"
import BloodBackground from "@/components/deathbooty/blood-background"

// ─── Wheel config ────────────────────────────────────────────────────
// To add/remove items: edit RAW_SEGMENTS below.
// weight is relative — higher = more likely to land on.
type WheelSegment = { label: string; color: string; weight: number }

const COLORS = [
  "#3b0000","#6b0000","#1a0000","#7f1d1d","#5a0a0a",
  "#2d0000","#991b1b","#450a0a","#7f0000","#3b1010",
]

const SEGMENTS: WheelSegment[] = [
  { label: "Go in the river",                        weight: 1 },
  { label: "Wear I like men shirt",                  weight: 1 },
  { label: "Get pantsed",                            weight: 3 },
  { label: "Gun to the bollocks",                    weight: 1 },
  { label: "Draw on your hands and nipples as eyes", weight: 3 },
  { label: "Post Death Booty video",                 weight: 1 },
  { label: "Make Death Booty design",                weight: 1 },
  { label: "Make the stickers",                      weight: 1 },
  { label: "Make Death Booty poster",                weight: 2 },
  { label: "Eat a spicy",                            weight: 3 },
  { label: "Chug a Sprite",                          weight: 3 },
  { label: "Eat something sour",                     weight: 3 },
  { label: "Attack a goose",                         weight: 2 },
  { label: "Shot of koolaid",                        weight: 2 },
  { label: "Energy drink before skate",              weight: 1 },
  { label: "Trip then apologize then run",           weight: 2 },
  { label: "Clean the streets",                      weight: 2 },
  { label: "1 purple nurple",                        weight: 2 },
  { label: "2 purple nurple",                        weight: 1 },
  { label: "3 Purple nurples",                       weight: 1 },
  { label: "Compliment a stranger",                  weight: 1 },
  { label: "Eff Abel (get creative)",                weight: 1 },
  { label: "EVIL SPIN (+2)",                         weight: 1 },
  { label: "Ask for directions then leave",          weight: 2 },
].map((seg, i) => ({ ...seg, color: COLORS[i % COLORS.length] }))
// ─────────────────────────────────────────────────────────────────────

const SPIN_DURATION = 4000
const CX = 200
const CY = 200
const R  = 175

type SegmentGeometry = WheelSegment & { startAngle: number; arc: number }

function buildGeometry(segments: WheelSegment[]): SegmentGeometry[] {
  const total = segments.reduce((s, seg) => s + seg.weight, 0)
  let cumAngle = 0
  return segments.map(seg => {
    const arc = (seg.weight / total) * 360
    const startAngle = cumAngle
    cumAngle += arc
    return { ...seg, startAngle, arc }
  })
}

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 128 ? "#1a0000" : "#ffffff"
}

function segmentPath(startAngle: number, arc: number): string {
  const s = (startAngle - 90) * (Math.PI / 180)
  const e = (startAngle + arc - 90) * (Math.PI / 180)
  const x1 = CX + R * Math.cos(s)
  const y1 = CY + R * Math.sin(s)
  const x2 = CX + R * Math.cos(e)
  const y2 = CY + R * Math.sin(e)
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${arc > 180 ? 1 : 0} 1 ${x2} ${y2} Z`
}

function weightedPick(segments: WheelSegment[]): number {
  const total = segments.reduce((s, seg) => s + seg.weight, 0)
  const roll = Math.random() * total
  let cum = 0
  for (let i = 0; i < segments.length; i++) {
    cum += segments[i].weight
    if (roll < cum) return i
  }
  return segments.length - 1
}

const GEOMETRY = buildGeometry(SEGMENTS)

export default function WheelPage() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSpin = () => {
    if (isSpinning) return

    const targetIdx = weightedPick(SEGMENTS)
    const { startAngle, arc } = GEOMETRY[targetIdx]

    // Rotate so the middle of the target segment lands under the pointer
    const targetMidAngle = startAngle + arc / 2
    const desiredNorm = (360 - targetMidAngle % 360) % 360
    const currentNorm = ((rotation % 360) + 360) % 360
    const extraToTarget = (desiredNorm - currentNorm + 360) % 360
    const newRotation = rotation + extraToTarget + 360 * 6

    setRotation(newRotation)
    setIsSpinning(true)
    setResult(null)

    setTimeout(() => {
      setIsSpinning(false)
      setResult(SEGMENTS[targetIdx].label)
    }, SPIN_DURATION)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SceneTape text="DEATH WHEEL" position="top" rotation="-rotate-2" />
      <BloodBackground />
      <BackButton />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pt-16 pb-16 px-4">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Skull size={28} className="text-red-600" />
            <h1 className="text-5xl md:text-7xl font-black text-red-600 metal-text transform -rotate-1">
              DEATH WHEEL
            </h1>
            <Skull size={28} className="text-red-600" />
          </div>
          <p className="text-red-500 text-sm caution-text tracking-widest">
            ⚠️ SPIN AT YOUR OWN RISK ⚠️
          </p>
        </div>

        {/* Wheel */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full animate-pulse"
            style={{ width: 360, height: 360, boxShadow: '0 0 40px rgba(220,38,38,0.4), 0 0 80px rgba(220,38,38,0.2)' }}
          />

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
            <div style={{
              width: 0, height: 0,
              borderLeft: '13px solid transparent',
              borderRight: '13px solid transparent',
              borderTop: '30px solid #dc2626',
              filter: 'drop-shadow(0 0 8px #dc2626)',
            }} />
          </div>

          {/* Spinning wheel */}
          <div style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.05, 0.9, 0.1, 1.0)`
              : 'none',
          }}>
            <svg width="340" height="340" viewBox="0 0 400 400">
              {GEOMETRY.map((seg, i) => {
                const midAngle = seg.startAngle + seg.arc / 2
                const midRad   = (midAngle - 90) * (Math.PI / 180)
                const textR = R * 0.55
                const tx = CX + textR * Math.cos(midRad)
                const ty = CY + textR * Math.sin(midRad)
                const display = seg.label.length > 24
                  ? seg.label.slice(0, 23) + "…"
                  : seg.label
                return (
                  <g key={i}>
                    <path
                      d={segmentPath(seg.startAngle, seg.arc)}
                      fill={seg.color}
                      stroke="#dc2626"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tx} y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={contrastColor(seg.color)}
                      fontSize="10"
                      fontFamily="Impact, Arial Black, sans-serif"
                      letterSpacing="0.5"
                      transform={`rotate(${midAngle > 90 && midAngle <= 270 ? midAngle + 90 : midAngle - 90}, ${tx}, ${ty})`}
                    >
                      {display}
                    </text>
                  </g>
                )
              })}

              {/* Spokes at segment boundaries */}
              {GEOMETRY.map((seg, i) => {
                const angle = (seg.startAngle - 90) * (Math.PI / 180)
                return (
                  <line key={i}
                    x1={CX} y1={CY}
                    x2={CX + R * Math.cos(angle)}
                    y2={CY + R * Math.sin(angle)}
                    stroke="#dc2626" strokeWidth="1.5" opacity="0.6"
                  />
                )
              })}

              <circle cx={CX} cy={CY} r={R}  fill="none"     stroke="#dc2626" strokeWidth="4" />
              <circle cx={CX} cy={CY} r={22} fill="#0a0000"  stroke="#dc2626" strokeWidth="3" />
              <circle cx={CX} cy={CY} r={10} fill="#dc2626" />
            </svg>
          </div>
        </div>

        {/* Spin button */}
        <div className="mt-10 relative">
          <div className="absolute -inset-2 border-2 border-red-600 border-dashed rounded-lg animate-pulse opacity-60" />
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="relative bg-black border-4 border-red-600 text-red-500 font-black text-2xl px-12 py-4 rounded-lg hover:bg-red-950 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-900/50 metal-text disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-black"
          >
            <span className="flex items-center gap-3">
              <Skull size={22} />
              {isSpinning ? "SPINNING..." : "SPIN"}
              <Skull size={22} />
            </span>
          </button>
        </div>

        {/* Result */}
        {result && !isSpinning && (
          <div className="mt-8 text-center animate-pulse">
            <div className="bg-black border-4 border-red-600 px-8 py-4 inline-block spike-border">
              <div className="text-red-400 text-xs caution-text tracking-widest mb-1">YOU GOT</div>
              <div className="text-white text-2xl font-black metal-text">{result}</div>
            </div>
          </div>
        )}

      </div>

      <SceneTape text="SKATE OR DIE" position="bottom" rotation="rotate-2" />
    </div>
  )
}
