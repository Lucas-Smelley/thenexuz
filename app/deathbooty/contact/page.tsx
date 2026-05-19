import type { Metadata } from 'next'
import { AlertTriangle } from "lucide-react"
import BackButton from "@/components/deathbooty/back-button"
import SceneTape from "@/components/deathbooty/scene-tape"
import BloodBackground from "@/components/deathbooty/blood-background"

export const metadata: Metadata = {
  title: 'Death Booty Contact - Get in Touch',
  description: 'Contact the Death Booty crew',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SceneTape text="CONTACT INFO" position="top" rotation="-rotate-1" />
      <BloodBackground />
      <BackButton />

      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-6">
            <div className="text-red-400 text-lg mb-4 caution-text tracking-wider">
              DEATH BOOTY
            </div>
          </div>
          <div className="text-3xl mb-6 metal-text" style={{
            fontFamily: 'Nosifer, "Metal Mania", UnifrakturCook, fantasy',
            textShadow: '0 0 8px #ff0000, 0 0 16px #ff0000, 2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '2px'
          }}>
            (314) 536-3751
          </div>
          <div className="text-3xl metal-text" style={{
            fontFamily: 'Nosifer, "Metal Mania", UnifrakturCook, fantasy',
            textShadow: '0 0 8px #ff0000, 0 0 16px #ff0000, 2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '2px'
          }}>
            @death.booty
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-yellow-400 text-sm font-black caution-text">
        <AlertTriangle size={20} className="mr-2" />
        <span>CALL AT YOUR OWN RISK</span>
        <AlertTriangle size={20} className="ml-2" />
      </div>

      <SceneTape text="DEATH BOOTY" position="bottom" rotation="rotate-1" />
    </div>
  )
}
