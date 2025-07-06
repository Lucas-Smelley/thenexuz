"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Skull, ArrowLeft, AlertTriangle, X } from "lucide-react"

export default function MerchPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const merchItems = [
    {
      id: 1,
      name: "DEATH BOOTY STICKERS",
      price: "$100",
      image: "/media/death-booty/images/merch/stickers.jpg",
      status: "IN STOCK",
      rotation: "rotate-2",
      description: "Totally High-quality stickers featuring the iconic Death Booty logo. Perfect for arking your territory.",
      details: "Maybe 1 or 2 stickers"
    },
    {
      id: 2,
      name: "DEADLY ARTWORK",
      price: "$80000",
      image: "/media/death-booty/images/merch/deathbooty-artwork.jpg",
      status: "IN STOCK",
      rotation: "-rotate-1",
      description: "Original Death Booty artwork by underground street artist ACHILLIUS NUCLETORIUS. Hand made with blood, sweat, and tears. Literally.",
      details: "Unkown size, very precious"
    },
    {
      id: 3,
      name: "HOT DUDES",
      price: "$3 + 1 hotdog",
      image: "/media/death-booty/images/merch/hot-guys.jpg",
      status: "IN STOCK",
      rotation: "rotate-3",
      description: "Exclusive access to 2 hot skater dudes. They'll teach you tricks, 'fix' your 'board', and look darn tootin good doin it.",
      details: "1-hour session"
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Crime scene tape header */}
      <div className="absolute top-0 left-0 w-full h-12 bg-red-900 transform -rotate-3 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="text-yellow-200 font-bold text-sm tracking-wider caution-text transform skew-x-12">
            ⚠️ MERCH ZONE - ENTER AT OWN RISK ⚠️
          </div>
        </div>
      </div>

      {/* Back button - messy placement */}
      <Link
        href="/deathbooty"
        className="fixed top-16 left-4 z-50 flex items-center space-x-2 px-3 py-2 bg-black border-2 border-red-800 hover:bg-red-950 transition-all duration-300 text-red-300 hover:text-white font-bold transform -rotate-6 skew-x-6"
      >
        <ArrowLeft size={16} />
        <span className="text-sm metal-text">BACK</span>
      </Link>

      {/* Random warning signs scattered */}
      <div className="absolute top-20 right-10 text-yellow-400 text-xs caution-text transform rotate-12 skew-y-6">
        ⚠️ PRICES MAY VARY ⚠️
      </div>
      <div className="absolute top-32 left-20 text-yellow-400 text-xs caution-text transform -rotate-12 -skew-x-12">
        NO REFUNDS
      </div>
      <div className="absolute bottom-20 right-1/4 text-yellow-400 text-xs caution-text transform rotate-6 skew-y-3">
        CASH ONLY
      </div>

      {/* Blood splatter effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-32 w-16 h-16 bg-red-900 rounded-full opacity-40 blur-sm animate-splatter"></div>
        <div className="absolute top-40 right-16 w-12 h-12 bg-red-950 rounded-full opacity-30 animate-splatter"></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-red-900 rounded-full opacity-25 blur-sm animate-splatter"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 pt-20 px-4">
        {/* Aggressive title */}
        <div className="text-center mb-12 transform -rotate-3 skew-x-3 relative">
          <div className="bg-black border-4 border-red-800 p-6 inline-block spike-border transform rotate-2 -skew-y-1">
            <h1 className="text-4xl md:text-6xl font-black text-red-800 mb-2 metal-text filter drop-shadow-lg transform skew-x-6">
              MERCH
            </h1>
            <div className="text-red-600 text-lg metal-text transform -rotate-3 skew-y-2">
              {">"} BUY OUR CRAP {"<"}
            </div>
          </div>
          
          {/* Unique geometric shapes around title */}
          <div className="absolute -top-8 -left-12 text-red-800 opacity-60 transform rotate-45 text-2xl">
            ◆
          </div>
          <div className="absolute -top-6 -right-16 text-red-900 opacity-50 transform -rotate-12 text-xl">
            ▼
          </div>
          <div className="absolute -bottom-4 left-8 text-red-800 opacity-40 transform rotate-180 text-lg">
            ◀
          </div>
          <div className="absolute -bottom-6 -right-8 text-red-900 opacity-55 transform rotate-90 text-xl">
            ▶
          </div>
        </div>

        {/* Stacked paper pile display */}
        <div className="relative max-w-4xl mx-auto px-8">
          <div className="flex flex-col items-center space-y-8">
            {merchItems.map((item, index) => {
              const isExpanded = expandedCard === item.id
              return (
                <div 
                  key={item.id}
                  className={`group relative bg-black border-l-8 border-red-800 p-6 w-full transition-all duration-500 cursor-pointer ${
                    isExpanded 
                      ? 'max-w-2xl z-30 scale-105 rotate-0' 
                      : 'max-w-md hover:scale-105 hover:rotate-1'
                  } ${
                    index % 2 === 0 ? 'self-start ml-8 -rotate-2' : 'self-end mr-8 rotate-3'
                  }`}
                  style={{
                    marginTop: index === 0 ? '0' : '-40px',
                    clipPath: 'polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)',
                  }}
                  onClick={() => setExpandedCard(isExpanded ? null : item.id)}
                >
                  {/* Torn paper effect */}
                  <div className="absolute -top-2 left-4 w-12 h-4 bg-red-800 opacity-60 transform rotate-12"></div>
                  <div className="absolute -bottom-2 right-8 w-8 h-4 bg-red-800 opacity-40 transform -rotate-6"></div>
                  
                  {/* Paper hole punches */}
                  <div className="absolute left-2 top-8 w-3 h-3 rounded-full bg-black border border-red-800"></div>
                  <div className="absolute left-2 top-20 w-3 h-3 rounded-full bg-black border border-red-800"></div>
                  <div className="absolute left-2 bottom-20 w-3 h-3 rounded-full bg-black border border-red-800"></div>
                  
                  {/* File tab */}
                  <div className="absolute -right-4 top-4 bg-red-800 text-white px-2 py-1 text-xs font-bold transform rotate-90 origin-bottom-left">
                    FILE #{item.id}
                  </div>

                  <div className={`flex gap-6 ${isExpanded ? 'flex-col md:flex-row' : ''}`}>
                    {/* Polaroid photo style */}
                    <div 
                      className={`bg-white p-2 transform -rotate-3 flex-shrink-0 transition-all duration-300 hover:scale-110 ${isExpanded ? 'mx-auto md:mx-0' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedImage(item.image)
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={isExpanded ? 200 : 120}
                        height={isExpanded ? 200 : 120}
                        className={`${isExpanded ? 'w-48 h-48' : 'w-24 h-24'} object-cover grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer`}
                      />
                      <div className="text-black text-xs text-center mt-1 font-handwriting">
                        EVIDENCE
                      </div>
                    </div>

                    {/* Report details */}
                    <div className="flex-1">
                      <h3 className={`text-red-300 font-bold mb-2 uppercase tracking-wider ${isExpanded ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                        {item.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex">
                          <span className="w-16 text-yellow-400">PRICE:</span>
                          <span className="font-bold">{item.price}</span>
                        </div>
                        <div className="flex">
                          <span className="w-16 text-yellow-400">STATUS:</span>
                          <span className={`font-bold ${
                            item.status === "IN STOCK" ? "text-green-400" :
                            item.status === "SOLD OUT" ? "text-red-400" :
                            "text-yellow-400"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <>
                            <div className="mt-4 p-3 border-2 border-red-800 bg-red-950/20">
                              <span className="text-yellow-400 font-bold text-sm">DESCRIPTION:</span>
                              <p className="text-gray-300 text-sm mt-1 leading-relaxed">{item.description}</p>
                            </div>
                            <div className="mt-2 p-3 border-2 border-red-700 bg-black/40">
                              <span className="text-yellow-400 font-bold text-sm">DETAILS:</span>
                              <p className="text-gray-300 text-sm mt-1">{item.details}</p>
                            </div>
                          </>
                        )}
                        
                        <div className={`flex ${isExpanded ? 'mt-4' : ''}`}>
                          <span className="w-16 text-yellow-400">ACTION:</span>
                          <button 
                            disabled={item.status === "SOLD OUT"}
                            onClick={(e) => e.stopPropagation()}
                            className={`font-bold text-xs px-2 py-1 border transform -skew-x-12 ${
                              item.status === "SOLD OUT" 
                                ? "border-gray-600 text-gray-500 cursor-not-allowed"
                                : "border-red-600 text-red-400 hover:bg-red-900 hover:text-white transition-colors"
                            }`}
                          >
                            {item.status === "SOLD OUT" ? "UNAVAILABLE" : "ACQUIRE"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stamps and marks */}
                  <div className="absolute top-2 right-8 text-red-600 opacity-60 transform rotate-12">
                    <div className="border-2 border-red-600 px-2 py-1 text-xs font-bold">
                      CLASSIFIED
                    </div>
                  </div>
                  
                  {/* Expand/Collapse indicator */}
                  <div className="absolute top-2 left-2 text-red-400 text-xs font-bold">
                    {isExpanded ? '▼ COLLAPSE' : '▶ EXPAND'}
                  </div>
                  
                  {item.status === "SOLD OUT" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-red-600 text-4xl font-black transform rotate-12 opacity-30">
                        SEIZED
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Case file footer */}
          <div className="mt-12 text-center">
            <div className="bg-red-900 text-white p-4 max-w-sm mx-auto transform -rotate-1 border-4 border-red-800">
              <div className="text-lg font-black mb-2">CASE FILE: DB-2024</div>
              <div className="text-sm opacity-80">INVESTIGATION ONGOING</div>
              <div className="text-xs mt-2 text-yellow-300">⚠️ CONFIDENTIAL ⚠️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-300"
            >
              <X size={24} />
            </button>
            
            {/* Image with Death Booty styling */}
            <div className="bg-white p-4 transform rotate-1 shadow-2xl border-4 border-red-800">
              <Image
                src={selectedImage}
                alt="Merch item"
                width={800}
                height={600}
                className="w-full h-auto object-contain max-h-[70vh]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-black text-center mt-2 font-bold">
                EVIDENCE - CASE FILE: DB-2024
              </div>
            </div>
            
            {/* Blood splatter effects around modal */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-600 rounded-full opacity-60 animate-splatter"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-red-700 rounded-full opacity-70 animate-splatter"></div>
          </div>
        </div>
      )}

      {/* Danger warning - edgier placement */}
      <div className="mt-16 mb-8 text-center">
        <div className="bg-black border-4 border-red-800 p-4 max-w-sm mx-auto transform -rotate-6 skew-x-3 spike-border">
          <div className="flex items-center justify-center text-red-700 text-lg font-black metal-text transform skew-y-2">
            <Skull size={20} className="mr-2" />
            <span>SKATE OR DIE</span>
            <Skull size={20} className="ml-2" />
          </div>
          <div className="text-yellow-400 text-xs mt-2 caution-text transform -skew-x-6">
            ⚠️ NO MERCY ⚠️
          </div>
        </div>
      </div>

      {/* Bottom tape */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-red-900 transform rotate-2 skew-x-1 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="text-yellow-200 font-bold text-sm tracking-wider caution-text transform -skew-x-3">
            ⚠️ ALL SALES FINAL - NO RETURNS ⚠️
          </div>
        </div>
      </div>

      {/* Random scattered elements */}
      <div className="absolute top-1/3 left-8 text-red-800 opacity-25 transform rotate-45 skew-y-6">
        <Skull size={32} />
      </div>
      <div className="absolute bottom-1/3 right-12 text-red-900 opacity-30 transform -rotate-12 -skew-x-6">
        <Skull size={28} />
      </div>
    </div>
  )
}