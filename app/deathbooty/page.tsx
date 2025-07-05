"use client"

import Image from "next/image"
import { Skull, AlertTriangle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Crime scene tape */}
      <div className="absolute top-0 left-0 w-full h-16 bg-red-800 transform -rotate-3 -translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div
            className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            <span>⚠️ HARDCORE SKATING ⚠️</span>
            <span>⚠️ HARDCORE SKATING ⚠️</span>
            <span>⚠️ HARDCORE SKATING ⚠️</span>
          </div>
        </div>
      </div>

      {/* Blood splatter effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large blood splatter top left */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600 rounded-full opacity-80 blur-sm animate-splatter"></div>
        <div className="absolute top-24 left-16 w-16 h-16 bg-red-700 rounded-full opacity-60 animate-splatter"></div>

        {/* Blood splatter top right */}
        <div className="absolute top-32 right-20 w-24 h-24 bg-red-600 rounded-full opacity-70 blur-sm animate-splatter"></div>
        <div className="absolute top-28 right-32 w-8 h-8 bg-red-800 rounded-full animate-splatter"></div>

        {/* Blood splatter bottom */}
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-600 rounded-full opacity-60 blur-sm animate-splatter"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-red-700 rounded-full opacity-50 animate-splatter"></div>

        {/* Small blood drops scattered */}
        <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-red-600 rounded-full opacity-80 animate-splatter"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-red-700 rounded-full opacity-70 animate-splatter"></div>
        <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-red-600 rounded-full opacity-60 animate-splatter"></div>
      </div>

      {/* Grunge texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-800/30 pointer-events-none"></div>

      {/* Back to Nexuz button */}
      <div className="absolute top-4 left-4 z-30">
        <a
          href="/"
          className="flex items-center space-x-2 px-4 py-2 bg-black border-2 border-red-800 hover:bg-red-950 transition-all duration-300 text-red-300 hover:text-white font-bold transform -rotate-3 skew-x-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm metal-text">BACK TO NEXUZ</span>
        </a>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Skull decorations */}
        <div className="absolute top-1/4 left-10 text-red-600 opacity-60">
          <Skull size={48} />
        </div>
        <div className="absolute top-1/3 right-16 text-red-700 opacity-50">
          <Skull size={36} />
        </div>
        <div className="absolute bottom-1/4 right-10 text-red-600 opacity-40">
          <Skull size={42} />
        </div>

        {/* Main logo */}
        <div className="text-center mb-8">
          <Image
            src="/media/death-booty/images/DB-Logo.png"
            alt="DEATH BOOTY"
            width={800}
            height={200}
            className="max-w-full h-auto filter drop-shadow-2xl"
            priority
          />
        </div>

        {/* Tagline */}
        <div className="text-red-500 text-xl md:text-2xl font-black tracking-widest mb-8 text-center metal-text">
          <span className="block mb-2">HARDCORE SKATING</span>
          <span className="text-red-400">
            {">"} SKATE OR DIE {"<"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 text-white font-black text-lg mb-12 metal-text">
          <a
            href="/deathbooty/merch"
            className="hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1"
          >
            MERCH
          </a>
          <a
            href="/deathbooty/media"
            className="hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1"
          >
            MEDIA
          </a>
          <a
            href="/deathbooty/members"
            className="hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1"
          >
            MEMBERS
          </a>
          <a
            href="/deathbooty/contact"
            className="hover:text-red-500 transition-colors duration-300 border-b-2 border-transparent hover:border-red-500 pb-1"
          >
            CONTACT
          </a>
        </nav>

        {/* DEATH WHEEL Button */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 border-2 border-red-500 border-dashed animate-pulse rounded-lg"></div>
          <div className="absolute -inset-2 bg-red-600/20 rounded-lg"></div>
          <button className="relative bg-black border-4 border-red-600 text-red-500 font-black text-xl px-8 py-4 rounded-lg hover:bg-red-900 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl metal-text">
            <span className="flex items-center">
              <Skull className="mr-2" size={24} />
              DEATH WHEEL
              <Skull className="ml-2" size={24} />
            </span>
          </button>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold caution-text">
            ⚠️ CAUTION ⚠️
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold caution-text">
            ⚠️ DANGER ⚠️
          </div>
        </div>

        {/* Warning sign */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-yellow-400 text-sm font-black caution-text">
          <AlertTriangle size={20} className="mr-2" />
          <span>ENTER AT YOUR OWN RISK</span>
          <AlertTriangle size={20} className="ml-2" />
        </div>
      </div>

      {/* Bottom crime scene tape */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-red-800 transform rotate-2 translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div
            className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            <span>⚠️ SKATE OR DIE ⚠️</span>
            <span>⚠️ SKATE OR DIE ⚠️</span>
            <span>⚠️ SKATE OR DIE ⚠️</span>
          </div>
        </div>
      </div>

    </div>
  )
}
