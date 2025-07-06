"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Skull, AlertTriangle, User } from "lucide-react"

// Sample member data - replace with actual data
const members = [
  {
    id: 1,
    name: "BONER SNAPPER",
    alias: "BUZZCUT",
    age: 18,
    stance: "NORMAL",
    hometown: "THE TRENCHES",
    crimes: ["RAIL DESTRUCTION", "OVERWEIGHT", "GRAVITY DEFIANCE"],
    mugshot: "/media/death-booty/images/mugshots/braden-mugshot.jpg",
    bio: "Known for his bone-crushing rail grinds and death-defying drops. Wanted in 12 states for destruction of public property.",
    arrestDate: "06.66.2023",
    prisonId: "DB-001"
  },
  {
    id: 2,
    name: "BONE BREAKER",
    alias: "Lil Jit Abel",
    age: 18,
    stance: "GOOFY",
    hometown: "HELL'S KITCHEN, NY",
    crimes: ["BOWL CARNAGE", "VERT RAMP TERROR", "SPEED DEMON"],
    mugshot: "/media/death-booty/images/mugshots/abel-mugshot.jpg",
    bio: "Master of bowl riding and vert destruction. Known for breaking more than just bones - he breaks the laws of physics.",
    arrestDate: "13.13.2023",
    prisonId: "DB-002"
  },
  {
    id: 3,
    name: "ACHILLIUS NUCLETORIUS",
    alias: "FALON",
    age: 18,
    stance: "NORMAL",
    hometown: "CEMETERY HILLS, TX",
    crimes: ["EVILNESS SPREADING", "MIDNIGHT 'SESSIONS'", "PRANKING"],
    mugshot: "/media/death-booty/images/mugshots/lucas-mugshot.jpg",
    bio: "Likes cute cats and evil skateboarding. If you see him at night, run. He’s known for his deadly pranks and midnight sessions.",
    arrestDate: "31.10.2023",
    prisonId: "DB-003"
  },
  {
    id: 4,
    name: "BRASS SPINDLE",
    alias: "BOMBACLAT NATHANIEL",
    age: 30,
    stance: "GOOFY",
    hometown: "CHICAGO SUBWAY",
    crimes: ["AGGRAVATED PRANKING", "CHINESE MIDDLE FINGERING THE GOVERNMENT", "VIOLATING PAROL", "GAY"],
    mugshot: "/media/death-booty/images/mugshots/nathaniel-mugshot.jpg",
    bio: "He comes from a long line of good-for-nothing bottom of the barrel no ceiling having never apologizing absolute street trash. Streets killed him 🤷. He has found inspiration in pranking and is attempting to rewrite his story to one of using pranks for good. Various pranking activities include: not stopping the skateboard, bumping into people. etc. Currently on Day 9 and is attempting to break ground in animal related skateboard techniques.",
    arrestDate: "07.07.2023",
    prisonId: "DB-004"
  }
]

export default function MembersPage() {
  const [currentMember, setCurrentMember] = useState(0)

  const nextMember = () => {
    setCurrentMember((prev) => (prev + 1) % members.length)
  }

  const prevMember = () => {
    setCurrentMember((prev) => (prev - 1 + members.length) % members.length)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Crime scene tape */}
      <div className="absolute top-0 left-0 w-full h-16 bg-red-800 transform -rotate-1 -translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider">
            <span>⚠️ MOST WANTED ⚠️</span>
            <span>⚠️ MOST WANTED ⚠️</span>
            <span>⚠️ MOST WANTED ⚠️</span>
          </div>
        </div>
      </div>

      {/* Prison bar shadows */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-8 bg-gradient-to-b from-gray-900/40 via-gray-800/20 to-gray-900/40"
            style={{ left: `${10 + i * 12}%` }}
          />
        ))}
      </div>

      {/* Blood splatter background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-red-600 rounded-full opacity-30 blur-sm animate-splatter"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-red-600 rounded-full opacity-25 blur-sm animate-splatter"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-600 rounded-full opacity-20 blur-sm animate-splatter"></div>
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

      {/* Main content */}
      <div className="relative z-20 pt-24 pb-16 px-4">
        {/* Page title - desktop only */}
        <div className="text-center mb-6 md:mb-12 hidden md:block">
          <h1 className="text-4xl md:text-8xl font-black text-red-500 mb-2 md:mb-4 metal-text transform -rotate-1">
            DEATH SQUAD
          </h1>
          <div className="text-red-400 text-sm md:text-xl font-bold tracking-widest caution-text">
            WANTED • DANGEROUS • ARMED WITH BOARDS
          </div>
        </div>

        {/* Mugshot carousel - stacked cards */}
        <div className="max-w-5xl mx-auto">
          <div className="relative h-[700px] md:h-[600px] md:overflow-visible overflow-y-auto overflow-x-hidden">
            {/* Page title - mobile only, scrollable */}
            <div className="text-center mb-6 block md:hidden">
              <h1 className="text-4xl font-black text-red-500 mb-2 metal-text transform -rotate-1">
                DEATH SQUAD
              </h1>
              <div className="text-red-400 text-sm font-bold tracking-widest caution-text">
                WANTED • DANGEROUS • ARMED WITH BOARDS
              </div>
            </div>
            {members.map((memberData, index) => {
              const isActive = index === currentMember
              const isNext = index === (currentMember + 1) % members.length
              const isPrev = index === (currentMember - 1 + members.length) % members.length
              
              // Calculate position for stacked effect
              let translateX = 0
              let translateY = 0
              let zIndex = 1
              let scale = 0.9
              let opacity = 0.3
              
              if (isActive) {
                translateX = 0
                translateY = 0
                zIndex = 30
                scale = 1
                opacity = 1
              } else if (isNext) {
                translateX = 40  // Optimized for both mobile and desktop
                translateY = 8
                zIndex = 20
                scale = 0.96  // Balanced scaling
                opacity = 0.7
              } else if (isPrev) {
                translateX = -40  // Optimized for both mobile and desktop
                translateY = 8
                zIndex = 10
                scale = 0.96  // Balanced scaling
                opacity = 0.5
              } else {
                translateX = (index - currentMember) * 80  // Balanced spread
                translateY = 15
                zIndex = 1
                scale = 0.92
                opacity = 0.1  // Lower opacity for hidden cards
              }
              
              return (
                <div
                  key={memberData.id}
                  className={`absolute inset-0 transition-all duration-300 ease-out cursor-pointer ${isActive ? 'md:overflow-visible overflow-y-auto overflow-x-hidden' : ''}`}
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    willChange: 'transform, opacity',
                  }}
                  onClick={() => {
                    if (isNext) {
                      nextMember()
                    } else if (isPrev) {
                      prevMember()
                    }
                  }}
                >
                  {/* Prison ID card container */}
                  <div className={`
                    relative p-6 rounded-lg shadow-2xl bg-black h-full
                    ${index === 0 ? 'transform rotate-2 border-4 border-red-600' : ''}
                    ${index === 1 ? 'transform -rotate-1 border-4 border-red-700' : ''}
                    ${index === 2 ? 'transform rotate-3 border-4 border-red-500' : ''}
                    ${index === 3 ? 'transform -rotate-2 border-4 border-red-800' : ''}
                  `}>
                    {/* Blood splatter corners */}
                    <div className="absolute top-0 left-0 w-6 h-6 bg-red-600 rounded-full opacity-80 transform -translate-x-2 -translate-y-2 animate-splatter"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-red-700 rounded-full opacity-70 transform translate-x-2 -translate-y-2 animate-splatter"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 bg-red-700 rounded-full opacity-70 transform -translate-x-2 translate-y-2 animate-splatter"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-600 rounded-full opacity-80 transform translate-x-2 translate-y-2 animate-splatter"></div>
                    
                    {/* Animated blood drip border */}
                    <div className="absolute inset-0 rounded-lg border-2 border-red-600 animate-pulse opacity-60"></div>
                    
                    {/* Prison header */}
                    <div className="text-center mb-4 border-b-2 border-red-600 pb-3">
                      <div className="text-red-500 font-black text-xl metal-text mb-1">
                        DEATH VALLEY STATE PENITENTIARY
                      </div>
                      <div className="text-yellow-400 font-bold caution-text text-sm">
                        PRISONER IDENTIFICATION CARD
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start h-[calc(100%-120px)] overflow-visible">
                      {/* Mugshot section - intentionally extends outside */}
                      <div className="relative -mx-4 md:mx-0">
                        <div className={`
                          bg-black p-2 md:p-3 border-2 rounded spike-border
                          ${index === 0 ? 'transform -rotate-3 border-red-700' : ''}
                          ${index === 1 ? 'transform rotate-2 border-red-800' : ''}
                          ${index === 2 ? 'transform -rotate-4 border-red-600' : ''}
                          ${index === 3 ? 'transform rotate-1 border-red-700' : ''}
                        `}>
                          {/* Height measurement background */}
                          <div className={`
                            absolute left-0 top-0 bottom-0 w-6 border-r-2 border-gray-600
                            ${index === 0 ? 'bg-gray-900' : ''}
                            ${index === 1 ? 'bg-red-950' : ''}
                            ${index === 2 ? 'bg-gray-800' : ''}
                            ${index === 3 ? 'bg-black' : ''}
                          `}>
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-full border-t border-gray-600 text-xs text-gray-400 pl-1"
                                style={{ top: `${i * 16}%` }}
                              >
                                {6 - i}'
                              </div>
                            ))}
                          </div>

                          {/* Mugshot photo area */}
                          <div className={`
                            ml-6 aspect-[3/4] relative border-2 overflow-hidden
                            ${index === 0 ? 'bg-gradient-to-b from-gray-700 to-gray-900 border-gray-600' : ''}
                            ${index === 1 ? 'bg-gradient-to-b from-red-900 to-black border-red-700' : ''}
                            ${index === 2 ? 'bg-gradient-to-b from-gray-600 to-black border-gray-500' : ''}
                            ${index === 3 ? 'bg-gradient-to-b from-black to-red-950 border-red-800' : ''}
                          `}>
                            {memberData.mugshot ? (
                              <Image
                                src={memberData.mugshot}
                                alt={`${memberData.name} mugshot`}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // Fallback to User icon if image fails to load
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <User size={isActive ? 80 : 60} className="text-red-500" />
                              </div>
                            )}
                            {/* Fallback User icon (hidden by default, shown if image fails) */}
                            <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                              <User size={isActive ? 80 : 60} className="text-red-500" />
                            </div>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 py-1 text-xs font-bold z-10">
                              {memberData.prisonId}
                            </div>
                          </div>

                          {/* Prison number placard */}
                          <div className={`
                            mt-2 font-black text-center py-1 border-2 border-black text-xs
                            ${index === 0 ? 'bg-yellow-400 text-black transform rotate-1' : ''}
                            ${index === 1 ? 'bg-red-500 text-white transform -rotate-2' : ''}
                            ${index === 2 ? 'bg-gray-300 text-black transform rotate-3' : ''}
                            ${index === 3 ? 'bg-yellow-300 text-black transform -rotate-1' : ''}
                          `}>
                            {memberData.prisonId}
                          </div>
                        </div>
                      </div>

                      {/* Criminal record - properly contained */}
                      <div className="space-y-2 md:space-y-3 px-2 md:px-0">
                        {/* Name and alias */}
                        <div className={`
                          relative p-2 md:p-3 border-2 spike-border bg-black/95
                          ${index === 0 ? 'border-red-700' : ''}
                          ${index === 1 ? 'border-red-600' : ''}
                          ${index === 2 ? 'border-red-800' : ''}
                          ${index === 3 ? 'border-red-500' : ''}
                        `}>
                          <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 rounded-full opacity-80 transform -translate-x-1 -translate-y-1"></div>
                          
                          <div className={`text-red-500 font-black metal-text mb-1 ${isActive ? 'text-sm md:text-lg' : 'text-xs md:text-sm'}`}>
                            {memberData.name}
                          </div>
                          <div className={`text-red-400 font-bold caution-text ${isActive ? 'text-xs md:text-sm' : 'text-xs'}`}>
                            AKA: {memberData.alias}
                          </div>
                        </div>

                        {isActive && (
                          <>
                            {/* Criminal details */}
                            <div className={`
                              relative p-2 md:p-3 border-2 spike-border bg-black/95
                              ${index === 0 ? 'border-red-700' : ''}
                              ${index === 1 ? 'border-red-800' : ''}
                              ${index === 2 ? 'border-red-600' : ''}
                              ${index === 3 ? 'border-red-700' : ''}
                            `}>
                              <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full opacity-80 transform translate-x-1 -translate-y-1"></div>
                              
                              <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs">
                                <div>
                                  <span className="text-red-400 font-bold">AGE:</span>
                                  <span className="text-white ml-1">{memberData.age}</span>
                                </div>
                                <div>
                                  <span className="text-red-400 font-bold">STANCE:</span>
                                  <span className="text-white ml-1">{memberData.stance}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-red-400 font-bold">ORIGIN:</span>
                                  <span className="text-white ml-1">{memberData.hometown}</span>
                                </div>
                              </div>
                            </div>

                            {/* Crimes */}
                            <div className={`
                              relative p-2 md:p-3 border-2 spike-border bg-black/95
                              ${index === 0 ? 'border-red-700' : ''}
                              ${index === 1 ? 'border-red-500' : ''}
                              ${index === 2 ? 'border-red-700' : ''}
                              ${index === 3 ? 'border-red-600' : ''}
                            `}>
                              <div className="absolute top-0 left-0 w-2 md:w-3 h-2 md:h-3 bg-red-600 rounded-full opacity-80 transform -translate-x-1 -translate-y-1"></div>
                              
                              <div className="text-red-400 font-bold mb-1 md:mb-2 caution-text text-xs">CHARGES:</div>
                              <div className="space-y-1">
                                {memberData.crimes.map((crime, crimeIndex) => (
                                  <div key={crimeIndex} className="text-white text-xs flex items-center">
                                    <Skull size={8} className="text-red-500 mr-1" />
                                    <span className="truncate">{crime}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Bio section */}
                            <div className={`
                              relative p-2 md:p-3 border-2 spike-border bg-black/95
                              ${index === 0 ? 'border-red-700' : ''}
                              ${index === 1 ? 'border-red-600' : ''}
                              ${index === 2 ? 'border-red-800' : ''}
                              ${index === 3 ? 'border-red-500' : ''}
                            `}>
                              <div className="absolute top-0 left-0 w-2 md:w-3 h-2 md:h-3 bg-red-600 rounded-full opacity-80 transform -translate-x-1 -translate-y-1"></div>
                              <div className="absolute bottom-0 right-0 w-1 md:w-2 h-1 md:h-2 bg-red-600 rounded-full opacity-80 transform translate-x-1 translate-y-1"></div>
                              
                              <div className="text-red-400 font-bold mb-1 md:mb-2 caution-text text-xs md:text-sm">CRIMINAL PROFILE:</div>
                              <p className="text-white text-xs leading-relaxed">{memberData.bio}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Navigation arrows - responsive positioning */}
            <div className="absolute top-1/2 left-2 md:-left-16 transform -translate-y-1/2 z-40">
              <button
                onClick={prevMember}
                className="bg-red-600 hover:bg-red-700 text-white p-2 md:p-3 rounded-full border-2 border-red-400 transition-all duration-300 hover:scale-110 shadow-xl"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 md:-right-16 transform -translate-y-1/2 z-40">
              <button
                onClick={nextMember}
                className="bg-red-600 hover:bg-red-700 text-white p-2 md:p-3 rounded-full border-2 border-red-400 transition-all duration-300 hover:scale-110 shadow-xl"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            })}
          </div>

          {/* Member counter */}
          <div className="text-center mt-4 md:mt-8">
            <div className="inline-flex space-x-2">
              {members.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMember(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full border-2 transition-all duration-300 ${
                    index === currentMember
                      ? 'bg-red-600 border-red-400'
                      : 'bg-black border-red-600 hover:bg-red-900'
                  }`}
                />
              ))}
            </div>
            <div className="text-red-400 text-xs md:text-sm mt-1 md:mt-2 font-bold">
              SUSPECT {currentMember + 1} OF {members.length}
            </div>
          </div>
        </div>
      </div>

      {/* Warning footer */}
      <div className="absolute bottom-4 md:bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-yellow-400 text-xs md:text-sm font-black caution-text">
        <AlertTriangle size={16} className="mr-1 md:mr-2 md:w-5 md:h-5" />
        <span>APPROACH WITH EXTREME CAUTION</span>
        <AlertTriangle size={16} className="ml-1 md:ml-2 md:w-5 md:h-5" />
      </div>

      {/* Bottom crime scene tape */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-red-800 transform rotate-1 translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider">
            <span>⚠️ DANGEROUS CRIMINALS ⚠️</span>
            <span>⚠️ DANGEROUS CRIMINALS ⚠️</span>
            <span>⚠️ DANGEROUS CRIMINALS ⚠️</span>
          </div>
        </div>
      </div>
    </div>
  )
}