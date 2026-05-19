"use client"

import { useState } from "react"
import { Skull } from "lucide-react"
import BackButton from "@/components/deathbooty/back-button"
import SceneTape from "@/components/deathbooty/scene-tape"
import BloodBackground from "@/components/deathbooty/blood-background"

// ─── Wheel config ────────────────────────────────────────────────────
// To add/remove items: edit this array.
// weight is relative — higher = more likely to land on.
// Example: weight 30 out of total 100 = 30% chance.
type WheelSegment = { label: string; color: string; weight: number }

const SEGMENTS: WheelSegment[] = [
  { label: "BAIL",        color: "#3b0000", weight: 28 },
  { label: "GLORY",       color: "#7f1d1d", weight: 22 },
  { label: "BAIL HARD",   color: "#450a0a", weight: 18 },
  { label: "FACE PLANT",  color: "#991b1b", weight: 13 },
  { label: "HONOR",       color: "#5a0a0a", weight: 10 },
  { label: "RIDE OR DIE", color: "#7f0000", weight: 5  },
  { label: "LEGEND",      color: "#2d0000", weight: 3  },
  { label: "DEATH RIDE",  color: "#1a0000", weight: 1  },
]
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
                const textR    = R * 0.62
                const tx = CX + textR * Math.cos(midRad)
                const ty = CY + textR * Math.sin(midRad)
                return (
                  <g key={i}>
                    <path
                      d={segmentPath(seg.startAngle, seg.arc)}
                      fill={seg.color}
                      stroke="#dc2626"
                      strokeWidth="1.5"
                    />
                    {seg.arc >= 15 && (
                      <text
                        x={tx} y={ty}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#fca5a5"
                        fontSize={seg.arc < 30 ? "8" : "10"}
                        fontWeight="bold"
                        fontFamily="Impact, Arial Black, sans-serif"
                        letterSpacing="1"
                        transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                      >
                        {seg.label}
                      </text>
                    )}
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
