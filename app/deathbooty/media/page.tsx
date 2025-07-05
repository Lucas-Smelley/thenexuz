"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Camera, Skull, AlertTriangle, X } from "lucide-react"

// Sample media data - replace with actual data source
const mediaItems = [
  {
    id: 1,
    type: "video",
    title: "DEATH SLIDE MASSACRE",
    thumbnail: "/media/death-booty/videos/thumb1.jpg",
    url: "/media/death-booty/videos/video1.mp4",
    skater: "SKULL CRUSHER",
    trick: "Death Slide 360"
  },
  {
    id: 2,
    type: "photo",
    title: "BLOOD RAIL GRIND",
    thumbnail: "/media/death-booty/images/photo1.jpg",
    url: "/media/death-booty/images/photo1.jpg",
    skater: "BONE BREAKER",
    trick: "Rail Grind"
  },
  {
    id: 3,
    type: "video",
    title: "COFFIN KICKFLIP",
    thumbnail: "/media/death-booty/videos/thumb2.jpg",
    url: "/media/death-booty/videos/video2.mp4",
    skater: "GRAVE DIGGER",
    trick: "Coffin Kickflip"
  },
  {
    id: 4,
    type: "photo",
    title: "DEATH DROP",
    thumbnail: "/media/death-booty/images/photo2.jpg",
    url: "/media/death-booty/images/photo2.jpg",
    skater: "SKULL CRUSHER",
    trick: "Death Drop"
  },
  {
    id: 5,
    type: "video",
    title: "NIGHTMARE NOLLIE",
    thumbnail: "/media/death-booty/videos/thumb3.jpg",
    url: "/media/death-booty/videos/video3.mp4",
    skater: "REAPER",
    trick: "Nightmare Nollie"
  },
  {
    id: 6,
    type: "photo",
    title: "BLOOD BOWL SESSION",
    thumbnail: "/media/death-booty/images/photo3.jpg",
    url: "/media/death-booty/images/photo3.jpg",
    skater: "BONE BREAKER",
    trick: "Bowl Carve"
  }
]

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState<typeof mediaItems[0] | null>(null)
  const [filter, setFilter] = useState<"all" | "video" | "photo">("all")

  const filteredMedia = mediaItems.filter(item => 
    filter === "all" || item.type === filter
  )

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Crime scene tape */}
      <div className="absolute top-0 left-0 w-full h-16 bg-red-800 transform -rotate-2 -translate-y-4 z-10">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-8 text-yellow-200 font-bold text-lg tracking-wider">
            <span>⚠️ DEATH BOOTY MEDIA ⚠️</span>
            <span>⚠️ DEATH BOOTY MEDIA ⚠️</span>
            <span>⚠️ DEATH BOOTY MEDIA ⚠️</span>
          </div>
        </div>
      </div>

      {/* Blood splatter background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600 rounded-full opacity-40 blur-sm animate-splatter"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-red-600 rounded-full opacity-30 blur-sm animate-splatter"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-red-600 rounded-full opacity-35 blur-sm animate-splatter"></div>
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

      {/* Main content */}
      <div className="relative z-20 pt-24 pb-16 px-4">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black text-red-500 mb-4 metal-text transform -rotate-1">
            MEDIA
          </h1>
          <div className="text-red-400 text-xl font-bold tracking-widest caution-text">
            CLIPS • PHOTOS • CARNAGE
          </div>
        </div>

        {/* Filter tabs - no background */}
        <div className="flex justify-center mb-12">
          <div className="p-2 border-2 border-red-600 shadow-2xl rounded-full">
            <div className="flex space-x-2">
              {[
                { key: "all", label: "ALL MEDIA", icon: Skull },
                { key: "video", label: "VIDEOS", icon: Play },
                { key: "photo", label: "PHOTOS", icon: Camera }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105
                    ${filter === key 
                      ? 'bg-red-600 text-white shadow-lg border-2 border-red-400' 
                      : 'bg-black text-red-400 hover:bg-red-900 hover:text-white border-2 border-red-800'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="metal-text">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skateboard deck media grid */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Skateboard deck outline - transparent background */}
            <div className="absolute inset-0 rounded-t-full rounded-b-full transform rotate-1 border-4 border-red-600 opacity-60"></div>
            
            {/* Grip tape pattern with media items */}
            <div className="relative p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMedia.map((item, index) => (
                <div
                  key={item.id}
                  className={`
                    relative group cursor-pointer transform transition-all duration-300 hover:scale-105
                    ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
                  `}
                  onClick={() => setSelectedMedia(item)}
                >
                  {/* Media card with merch page styling */}
                  <div className="relative overflow-hidden rounded-lg shadow-xl grunge-texture spike-border">
                    {/* Animated blood drip border */}
                    <div className="absolute inset-0 rounded-lg border-4 border-red-600 animate-pulse"></div>
                    
                    {/* Blood splatter corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 bg-red-600 rounded-full opacity-80 transform -translate-x-1 -translate-y-1"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-700 rounded-full opacity-70 transform translate-x-1 -translate-y-1"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-red-700 rounded-full opacity-70 transform -translate-x-1 translate-y-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-600 rounded-full opacity-80 transform translate-x-1 translate-y-1"></div>
                    
                    {/* Main content area */}
                    <div className="relative bg-black/90 border-2 border-red-800">
                      {/* Placeholder for actual thumbnails */}
                      <div className="aspect-video bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
                        {item.type === "video" ? (
                          <Play size={48} className="text-red-500" />
                        ) : (
                          <Camera size={48} className="text-red-500" />
                        )}
                      </div>
                      
                      {/* Media type badge */}
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/90 text-red-400 px-2 py-1 rounded text-xs font-bold metal-text border border-red-600">
                          {item.type.toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Caution tape effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-600 to-yellow-400 opacity-80"></div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-sm font-bold mb-1 metal-text">{item.skater}</div>
                          <div className="text-xs text-red-400 caution-text">{item.trick}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Media title with warning styling */}
                  <div className="mt-2 text-center">
                    <div className="text-red-400 font-bold text-sm metal-text bg-black/50 px-2 py-1 rounded border border-red-800">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skateboard truck bolts */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-600 rounded-full border border-red-600"></div>
              ))}
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-600 rounded-full border border-red-600"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media viewer modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-300"
            >
              <X size={24} />
            </button>

            {/* Media content */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border-2 border-red-600">
              {selectedMedia.type === "video" ? (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play size={64} className="text-red-500 mb-4 mx-auto" />
                    <div className="text-xl font-bold mb-2">{selectedMedia.title}</div>
                    <div className="text-red-400">Video player would go here</div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera size={64} className="text-red-500 mb-4 mx-auto" />
                    <div className="text-xl font-bold mb-2">{selectedMedia.title}</div>
                    <div className="text-red-400">Photo viewer would go here</div>
                  </div>
                </div>
              )}

              {/* Media info */}
              <div className="p-6 bg-black">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-500 mb-2 metal-text">
                    {selectedMedia.title}
                  </h2>
                  <div className="text-white mb-2">
                    <span className="text-red-400 font-bold">Skater:</span> {selectedMedia.skater}
                  </div>
                  <div className="text-white">
                    <span className="text-red-400 font-bold">Trick:</span> {selectedMedia.trick}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning footer */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-yellow-400 text-sm font-black caution-text">
        <AlertTriangle size={20} className="mr-2" />
        <span>EXTREME CONTENT • VIEWER DISCRETION ADVISED</span>
        <AlertTriangle size={20} className="ml-2" />
      </div>
    </div>
  )
}