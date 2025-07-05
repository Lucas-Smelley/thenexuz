import { AlertTriangle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Crime scene tape */}
      <div className="absolute top-0 left-0 w-full h-16 bg-red-800 transform -rotate-1 -translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider">
            <span>⚠️ CONTACT INFO ⚠️</span>
            <span>⚠️ CONTACT INFO ⚠️</span>
            <span>⚠️ CONTACT INFO ⚠️</span>
          </div>
        </div>
      </div>

      {/* Blood splatter background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-red-600 rounded-full opacity-30 blur-sm animate-splatter"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-red-600 rounded-full opacity-25 blur-sm animate-splatter"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-600 rounded-full opacity-20 blur-sm animate-splatter"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-red-700 rounded-full opacity-25 animate-splatter"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4 z-30">
        <a
          href="/deathbooty"
          className="flex items-center space-x-2 px-4 py-2 bg-black border-2 border-red-800 hover:bg-red-950 transition-all duration-300 text-red-300 hover:text-white font-bold transform -rotate-2 skew-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm metal-text">BACK TO DEATH BOOTY</span>
        </a>
      </div>

      {/* Main content - simple contact info */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-6">
            <div className="text-red-400 text-lg mb-4 caution-text tracking-wider">
              REACH THE DEATH SQUAD
            </div>
          </div>
          <div className="text-3xl mb-6 metal-text" style={{
            fontFamily: 'Nosifer, "Metal Mania", UnifrakturCook, fantasy',
            textShadow: '0 0 8px #ff0000, 0 0 16px #ff0000, 2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '2px'
          }}>
            (555) 666-DEATH
          </div>
          <div className="text-3xl metal-text" style={{
            fontFamily: 'Nosifer, "Metal Mania", UnifrakturCook, fantasy',
            textShadow: '0 0 8px #ff0000, 0 0 16px #ff0000, 2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '2px'
          }}>
            @deathbooty
          </div>
        </div>
      </div>

      {/* Warning footer */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-yellow-400 text-sm font-black caution-text">
        <AlertTriangle size={20} className="mr-2" />
        <span>CALL AT YOUR OWN RISK</span>
        <AlertTriangle size={20} className="ml-2" />
      </div>

      {/* Bottom crime scene tape */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-red-800 transform rotate-1 translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider">
            <span>⚠️ DEATH BOOTY ⚠️</span>
            <span>⚠️ DEATH BOOTY ⚠️</span>
            <span>⚠️ DEATH BOOTY ⚠️</span>
          </div>
        </div>
      </div>
    </div>
  )
}