"use client"

import { useState, useEffect, useRef } from "react"
import { Code, Terminal, Coffee, Zap, Binary, Cpu, Database, Github, Monitor, Keyboard, Bug, Sparkles } from "lucide-react"

export default function BirthdayPage() {
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [currentCodeLine, setCurrentCodeLine] = useState(0)
  const [effects, setEffects] = useState({
    thankYou: false,
    partyTime: false,
    rageMode: false,
    davidJokes: false
  })
  const [awaitingTermination, setAwaitingTermination] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const availableFunctions = {
    'thankYou()': 'Shows heartfelt thank you messages',
    'partyTime()': 'Starts party mode with confetti',
    'rageMode()': 'Enables intense visual effects',
    'davidJokes()': 'Shows dad jokes in a fun way',
    'terminate()': 'Terminates any currently running effect',
    'help()': 'Shows available functions'
  }

  const codeSnippets = [
    "// Available Functions:",
    "thankYou();",
    "partyTime();", 
    "rageMode();",
    "davidJokes();",
    "terminate();",
    "help();",
    "// Try typing them below!"
  ]


  const executeFunction = (input: string) => {
    const command = input.trim()
    
    // Handle termination responses
    if (awaitingTermination) {
      if (command.toLowerCase() === 'y' || command.toLowerCase() === 'yes') {
        setEffects(prev => ({ ...prev, [awaitingTermination]: false }))
        setAwaitingTermination(null)
        return "Process terminated."
      } else if (command.toLowerCase() === 'n' || command.toLowerCase() === 'no') {
        setAwaitingTermination(null)
        return "Continuing process..."
      } else {
        return "Please enter Y or N."
      }
    }
    
    // Check if any effect is currently running
    const isAnyEffectRunning = Object.values(effects).some(effect => effect)
    
    switch (command) {
      case 'thankYou()':
        if (isAnyEffectRunning) {
          return "Error: Another effect is already running. Use terminate() to stop it first."
        }
        setEffects(prev => ({ ...prev, thankYou: true }))
        setAwaitingTermination('thankYou')
        return "Thank you mode activated! Showing heartfelt messages...\nTerminate? (Y/N):"
        
        
      case 'partyTime()':
        if (isAnyEffectRunning) {
          return "Error: Another effect is already running. Use terminate() to stop it first."
        }
        setEffects(prev => ({ ...prev, partyTime: true }))
        setAwaitingTermination('partyTime')
        return "PARTY TIME! Let's get this celebration started!\nTerminate? (Y/N):"
        
      case 'rageMode()':
        if (isAnyEffectRunning) {
          return "Error: Another effect is already running. Use terminate() to stop it first."
        }
        setEffects(prev => ({ ...prev, rageMode: true }))
        setAwaitingTermination('rageMode')
        return "RAGE MODE ACTIVATED! Maximum intensity engaged!\nTerminate? (Y/N):"
        
      case 'davidJokes()':
        if (isAnyEffectRunning) {
          return "Error: Another effect is already running. Use terminate() to stop it first."
        }
        setEffects(prev => ({ ...prev, davidJokes: true }))
        setAwaitingTermination('davidJokes')
        return "Loading dad jokes... Prepare for maximum groans!\nTerminate? (Y/N):"
        
      case 'terminate()':
        if (!isAnyEffectRunning && !awaitingTermination) {
          return "No effects are currently running."
        }
        setEffects({
          thankYou: false,
          partyTime: false,
          rageMode: false,
          davidJokes: false
        })
        setAwaitingTermination(null)
        return "All effects terminated."
        
      case 'help()':
        return Object.entries(availableFunctions).map(([func, desc]) => `${func} - ${desc}`).join('\n')
        
      default:
        return `Error: Function '${command}' does not exist. Type help() for available functions.`
    }
  }

  const updateSuggestion = (input: string) => {
    if (awaitingTermination || !input.trim()) {
      setSuggestion("")
      return
    }
    
    const functions = Object.keys(availableFunctions)
    const match = functions.find(func => 
      func.toLowerCase().startsWith(input.toLowerCase())
    )
    
    if (match && match.toLowerCase() !== input.toLowerCase()) {
      setSuggestion(match.substring(input.length))
    } else {
      setSuggestion("")
    }
  }

  const handleInputChange = (value: string) => {
    setCurrentInput(value)
    updateSuggestion(value)
  }

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const output = executeFunction(currentInput)
      setTerminalHistory(prev => [
        ...prev,
        `C:\\Users\\David\\Birthday>${currentInput}`,
        output,
        ""
      ])
      setCurrentInput("")
      setSuggestion("")
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestion) {
        const newValue = currentInput + suggestion
        setCurrentInput(newValue)
        setSuggestion("")
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [terminalHistory])

  useEffect(() => {
    // Initialize terminal with welcome message
    setTerminalHistory([
      "",
      "C:\\Users\\David\\Birthday>echo Welcome to David's Birthday Terminal!",
      "Welcome to David's Birthday Terminal!",
      "",
      "C:\\Users\\David\\Birthday>rem Type help() to see available functions"
    ])
  }, [])

  useEffect(() => {
    // Animate code snippets
    const interval = setInterval(() => {
      setCurrentCodeLine(prev => (prev + 1) % codeSnippets.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative min-h-screen overflow-hidden transition-all duration-500 ${
      effects.thankYou ? 'bg-gradient-to-br from-yellow-300 via-pink-400 via-purple-500 to-cyan-400' :
      effects.rageMode ? 'bg-gradient-to-br from-red-800 via-red-900 to-black' :
      'bg-gradient-to-br from-gray-900 via-black via-purple-900 to-blue-900'
    }`}>
      {/* Animated code background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className={`border border-cyan-400/30 ${
                i % 7 === 0 ? 'bg-cyan-400/10' :
                i % 7 === 1 ? 'bg-green-400/10' :
                i % 7 === 2 ? 'bg-purple-400/10' :
                i % 7 === 3 ? 'bg-yellow-400/10' :
                i % 7 === 4 ? 'bg-pink-400/10' :
                i % 7 === 5 ? 'bg-blue-400/10' :
                'bg-orange-400/10'
              } animate-pulse`}
              style={{
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: `${2 + (i * 0.01) % 2}s`
              }}
            >
              {i % 12 === 0 && (
                <div className="text-xs text-cyan-400 font-mono opacity-60 p-1">
                  {['{}', '<>', '/>', '()', '[]', '&&', '||', '=='][i % 8]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>



      {/* Header with home link */}
      <header className="relative z-30 p-4 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-black via-gray-800 to-black border border-cyan-400 hover:border-purple-400 transition-all duration-300 font-mono font-bold transform hover:scale-105 shadow-xl shadow-cyan-400/50 hover:shadow-purple-400/50 rounded-lg backdrop-blur-sm text-cyan-400 hover:text-purple-400"
        >
          <Keyboard className="w-5 h-5" />
          <span className="hidden sm:inline">NEXUZ HOME</span>
          <span className="sm:hidden">HOME</span>
        </a>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Birthday Title */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold font-mono mb-6 animate-glow"
                style={{
                  background: "linear-gradient(45deg, #00ff41, #0cf, #ff0080, #00ff41)",
                  backgroundSize: "400% 400%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradient-shift 3s ease-in-out infinite, glow-pulse 2s ease-in-out infinite alternate",
                  textShadow: "0 0 30px rgba(0, 255, 65, 0.8), 0 0 60px rgba(0, 255, 65, 0.4)"
                }}>
              HAPPY BIRTHDAY
            </h1>
            <div className="text-2xl md:text-4xl font-mono text-cyan-400 mb-4">
              &lt;david.celebrate() /&gt;
            </div>
            <div className="flex items-center justify-center space-x-4 text-lg text-purple-400">
              <span className="font-mono">Best. Mentor. Ever.</span>
            </div>
          </div>
        </div>

        {/* Command Prompt Terminal */}
        <div className="bg-black border border-gray-600 rounded shadow-2xl max-w-2xl w-full mb-12 font-mono">
          <div className="bg-blue-600 px-3 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <Terminal className="w-2 h-2 text-black" />
              </div>
              <span className="text-white text-sm font-bold">Command Prompt - David's Birthday</span>
            </div>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-gray-400 hover:bg-gray-300 cursor-pointer flex items-center justify-center">
                <span className="text-black text-xs">_</span>
              </div>
              <div className="w-4 h-4 bg-gray-400 hover:bg-gray-300 cursor-pointer flex items-center justify-center">
                <span className="text-black text-xs">□</span>
              </div>
              <div className="w-4 h-4 bg-red-500 hover:bg-red-400 cursor-pointer flex items-center justify-center">
                <span className="text-white text-xs">×</span>
              </div>
            </div>
          </div>
          <div 
            ref={terminalRef} 
            className="p-4 bg-black text-white text-sm min-h-[300px] max-h-[400px] overflow-y-auto cursor-text" 
            onClick={focusInput}
          >
            {/* Command Prompt Header */}
            <div className="mb-2 text-gray-300">
              Microsoft Windows [Version 10.0.19045.4894]<br/>
              (c) Microsoft Corporation. All rights reserved.
            </div>
            
            {/* Terminal History */}
            <div className="mb-2">
              {terminalHistory.map((line, index) => (
                <div key={index} className={`mb-1 ${
                  line.startsWith('C:\\Users\\David\\Birthday>') ? 'text-white' : 
                  line.startsWith('Error:') ? 'text-red-400' :
                  line.includes('Terminate? (Y/N):') ? 'text-yellow-300' :
                  line === 'Process terminated.' ? 'text-red-300' :
                  line === 'Continuing process...' ? 'text-green-300' :
                  'text-gray-300'
                }`}>
                  {line.split('\n').map((subLine, subIndex) => (
                    <div key={subIndex}>{subLine}</div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Current Input Line */}
            <div className="flex items-center">
              <span className="text-white mr-1">
                {awaitingTermination ? '' : 'C:\\Users\\David\\Birthday>'}
              </span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="bg-transparent outline-none text-white w-full relative z-10"
                  placeholder=""
                  autoFocus
                />
                {suggestion && (
                  <div className="absolute top-0 left-0 text-gray-500 pointer-events-none">
                    {currentInput}<span className="bg-gray-700">{suggestion}</span>
                  </div>
                )}
              </div>
              <span className="animate-pulse text-white bg-white w-2 h-4">█</span>
            </div>
          </div>
        </div>

        {/* Code Snippet Display */}
        <div className="bg-gray-900 border border-purple-400 rounded-lg shadow-xl shadow-purple-400/30 max-w-lg w-full">
          <div className="bg-purple-900/50 px-4 py-2 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-mono">celebration.ts</span>
            </div>
          </div>
          <div className="p-4 font-mono text-sm">
            {codeSnippets.map((line, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentCodeLine 
                    ? 'text-yellow-300 transform scale-105 bg-yellow-400/10 px-2 py-1 rounded' 
                    : 'text-gray-400'
                }`}
                style={{
                  textShadow: index === currentCodeLine ? '0 0 10px rgba(255, 255, 0, 0.6)' : 'none'
                }}
              >
                <span className="text-gray-500 mr-2">{String(index + 1).padStart(2, '0')}</span>
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Effect Overlays */}
      {effects.thankYou && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Confetti shooting from center */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`w-3 h-3 ${['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'][i % 6]} rounded-full animate-ping`}
                style={{
                  animation: `confettiBlast ${2 + (i * 0.01) % 1}s ease-out forwards`,
                  animationDelay: `${(i * 0.02) % 0.5}s`,
                  '--blast-angle': `${(i * 4.5) % 360}deg`,
                  '--blast-distance': `${300 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Random falling confetti from top */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`falling-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
              }}
            >
              <div
                className={`${i % 5 === 0 ? 'w-2 h-2' : i % 5 === 1 ? 'w-3 h-8' : i % 5 === 2 ? 'w-8 h-3' : i % 5 === 3 ? 'w-6 h-6' : 'w-4 h-10'} ${['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-red-400', 'bg-blue-400', 'bg-lime-400', 'bg-fuchsia-400'][i % 10]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'confettiFall',
                  animationDuration: `${2.5 + Math.random() * 3}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            </div>
          ))}
          
          {/* Your personal thank you messages */}
          {[
            'Thank you so much for everything you\'ve done for me!',
            'Happy Birthday!',
            'I\'m very lucky having a mentor/boss/friend like you!',
            'Have a great day/night!',
            'These messages were NOT written by AI, I actually wrote these :)',
            'THANK YOUU!!'
          ].map((msg, i) => (
            <div
              key={msg}
              className="absolute text-2xl font-bold text-white bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm"
              style={{
                left: `${5 + (i * 15) % 80}%`,
                top: `${15 + (i * 12) % 70}%`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                maxWidth: '300px',
                textAlign: 'center',
                animationName: 'gentleFloat',
                animationDuration: `${3 + (i * 0.2)}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.4}s`
              }}
            >
              {msg}
            </div>
          ))}
        </div>
      )}


      {effects.partyTime && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Center spawn point - MASSIVE */}
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={`center-${i}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 4 === 0 ? 'w-8 h-8' : i % 4 === 1 ? 'w-6 h-12' : i % 4 === 2 ? 'w-12 h-6' : 'w-10 h-10'} ${['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-red-400', 'bg-blue-400', 'bg-lime-400', 'bg-fuchsia-400'][i % 10]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${0.8 + (i * 0.005) % 0.6}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${(i * 0.01) % 0.4}s`,
                  '--blast-angle': `${(i * 2.4) % 360}deg`,
                  '--blast-distance': `${400 + (i * 2) % 300}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Top-left spawn point */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={`top-left-${i}`}
              className="absolute"
              style={{
                left: '15%',
                top: '15%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 4 === 0 ? 'w-6 h-6' : i % 4 === 1 ? 'w-4 h-10' : i % 4 === 2 ? 'w-10 h-4' : 'w-8 h-8'} ${['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'][i % 6]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${1.0 + (i * 0.008) % 0.8}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.1 + (i * 0.015) % 0.3}s`,
                  '--blast-angle': `${60 + (i * 6) % 120}deg`,
                  '--blast-distance': `${350 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Top-right spawn point */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={`top-right-${i}`}
              className="absolute"
              style={{
                left: '85%',
                top: '15%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 4 === 0 ? 'w-6 h-6' : i % 4 === 1 ? 'w-4 h-10' : i % 4 === 2 ? 'w-10 h-4' : 'w-8 h-8'} ${['bg-orange-400', 'bg-red-400', 'bg-pink-400', 'bg-purple-400', 'bg-cyan-400', 'bg-blue-400'][i % 6]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${0.9 + (i * 0.008) % 0.9}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.2 + (i * 0.015) % 0.35}s`,
                  '--blast-angle': `${120 + (i * 6) % 120}deg`,
                  '--blast-distance': `${350 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Bottom-left spawn point */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={`bottom-left-${i}`}
              className="absolute"
              style={{
                left: '15%',
                top: '85%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 4 === 0 ? 'w-6 h-6' : i % 4 === 1 ? 'w-4 h-10' : i % 4 === 2 ? 'w-10 h-4' : 'w-8 h-8'} ${['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-pink-400', 'bg-lime-400'][i % 6]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${1.1 + (i * 0.008) % 0.7}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.3 + (i * 0.015) % 0.25}s`,
                  '--blast-angle': `${300 + (i * 6) % 120}deg`,
                  '--blast-distance': `${350 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Bottom-right spawn point */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={`bottom-right-${i}`}
              className="absolute"
              style={{
                left: '85%',
                top: '85%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 4 === 0 ? 'w-6 h-6' : i % 4 === 1 ? 'w-4 h-10' : i % 4 === 2 ? 'w-10 h-4' : 'w-8 h-8'} ${['bg-purple-400', 'bg-cyan-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-fuchsia-400'][i % 6]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${1.2 + (i * 0.008) % 0.6}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.4 + (i * 0.015) % 0.2}s`,
                  '--blast-angle': `${240 + (i * 6) % 120}deg`,
                  '--blast-distance': `${350 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}

          {/* Extra side spawns for MORE MADNESS */}
          {/* Left edge */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute"
              style={{
                left: '5%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-7 h-7' : i % 3 === 1 ? 'w-5 h-9' : 'w-9 h-5'} ${['bg-pink-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'][i % 5]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${0.7 + (i * 0.01) % 0.8}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${(i * 0.02) % 0.5}s`,
                  '--blast-angle': `${-30 + (i * 8) % 60}deg`,
                  '--blast-distance': `${300 + (i * 4) % 250}px`
                } as any}
              />
            </div>
          ))}

          {/* Right edge */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute"
              style={{
                left: '95%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-7 h-7' : i % 3 === 1 ? 'w-5 h-9' : 'w-9 h-5'} ${['bg-orange-400', 'bg-red-400', 'bg-pink-400', 'bg-purple-400', 'bg-cyan-400'][i % 5]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${0.6 + (i * 0.01) % 0.9}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${(i * 0.02) % 0.45}s`,
                  '--blast-angle': `${150 + (i * 8) % 60}deg`,
                  '--blast-distance': `${300 + (i * 4) % 250}px`
                } as any}
              />
            </div>
          ))}

          {/* Top edge */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`top-${i}`}
              className="absolute"
              style={{
                left: '50%',
                top: '5%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-7 h-7' : i % 3 === 1 ? 'w-5 h-9' : 'w-9 h-5'} ${['bg-yellow-400', 'bg-green-400', 'bg-cyan-400', 'bg-blue-400', 'bg-purple-400'][i % 5]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${0.8 + (i * 0.01) % 0.7}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${(i * 0.02) % 0.4}s`,
                  '--blast-angle': `${60 + (i * 8) % 60}deg`,
                  '--blast-distance': `${300 + (i * 4) % 250}px`
                } as any}
              />
            </div>
          ))}

          {/* Bottom edge */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`bottom-${i}`}
              className="absolute"
              style={{
                left: '50%',
                top: '95%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-7 h-7' : i % 3 === 1 ? 'w-5 h-9' : 'w-9 h-5'} ${['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-pink-400'][i % 5]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'continuousBlast',
                  animationDuration: `${0.9 + (i * 0.01) % 0.6}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${(i * 0.02) % 0.35}s`,
                  '--blast-angle': `${240 + (i * 8) % 60}deg`,
                  '--blast-distance': `${300 + (i * 4) % 250}px`
                } as any}
              />
            </div>
          ))}
        </div>
      )}

      {effects.rageMode && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Center spawn point - RAGE EXPLOSION */}
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              key={`center-${i}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 4 === 0 ? 'w-6 h-6' : i % 4 === 1 ? 'w-4 h-10' : i % 4 === 2 ? 'w-10 h-4' : 'w-8 h-8'} ${['bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-orange-600', 'bg-red-800', 'bg-orange-500', 'bg-red-400', 'bg-orange-700'][i % 8]} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-lg'}`}
                style={{
                  animationName: 'rageBlast',
                  animationDuration: `${0.6 + (i * 0.005) % 0.4}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${(i * 0.008) % 0.3}s`,
                  '--blast-angle': `${(i * 3) % 360}deg`,
                  '--blast-distance': `${350 + (i * 2) % 250}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Top-left corner rage */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`top-left-${i}`}
              className="absolute"
              style={{
                left: '10%',
                top: '10%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-5 h-5' : i % 3 === 1 ? 'w-3 h-8' : 'w-8 h-3'} ${['bg-red-500', 'bg-red-700', 'bg-orange-600', 'bg-red-600'][i % 4]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'rageBlast',
                  animationDuration: `${0.8 + (i * 0.01) % 0.6}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.1 + (i * 0.02) % 0.25}s`,
                  '--blast-angle': `${45 + (i * 8) % 90}deg`,
                  '--blast-distance': `${300 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Top-right corner rage */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`top-right-${i}`}
              className="absolute"
              style={{
                left: '90%',
                top: '10%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-5 h-5' : i % 3 === 1 ? 'w-3 h-8' : 'w-8 h-3'} ${['bg-red-600', 'bg-orange-600', 'bg-red-800', 'bg-red-500'][i % 4]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'rageBlast',
                  animationDuration: `${0.7 + (i * 0.01) % 0.7}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.15 + (i * 0.02) % 0.2}s`,
                  '--blast-angle': `${135 + (i * 8) % 90}deg`,
                  '--blast-distance': `${300 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Bottom-left corner rage */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`bottom-left-${i}`}
              className="absolute"
              style={{
                left: '10%',
                top: '90%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-5 h-5' : i % 3 === 1 ? 'w-3 h-8' : 'w-8 h-3'} ${['bg-red-700', 'bg-orange-700', 'bg-red-500', 'bg-red-600'][i % 4]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'rageBlast',
                  animationDuration: `${0.9 + (i * 0.01) % 0.5}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.2 + (i * 0.02) % 0.15}s`,
                  '--blast-angle': `${315 + (i * 8) % 90}deg`,
                  '--blast-distance': `${300 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}
          
          {/* Bottom-right corner rage */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`bottom-right-${i}`}
              className="absolute"
              style={{
                left: '90%',
                top: '90%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${i % 3 === 0 ? 'w-5 h-5' : i % 3 === 1 ? 'w-3 h-8' : 'w-8 h-3'} ${['bg-red-800', 'bg-red-500', 'bg-orange-600', 'bg-red-600'][i % 4]} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`}
                style={{
                  animationName: 'rageBlast',
                  animationDuration: `${1.0 + (i * 0.01) % 0.4}s`,
                  animationTimingFunction: 'ease-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${0.25 + (i * 0.02) % 0.1}s`,
                  '--blast-angle': `${225 + (i * 8) % 90}deg`,
                  '--blast-distance': `${300 + (i * 3) % 200}px`
                } as any}
              />
            </div>
          ))}

          {/* Angry insults floating */}
          {['YOU ABSOLUTE DONKEY!', 'COMPLETE GARBAGE!', 'TOTAL FAILURE!', 'PATHETIC ATTEMPT!', 'ARE YOU KIDDING ME?!', 'WHAT A DISASTER!', 'UTTERLY USELESS!', 'EMBARRASSING!'].map((insult, i) => (
            <div
              key={insult}
              className="absolute text-xl font-bold text-red-200 bg-red-900/60 px-3 py-2 rounded-lg backdrop-blur-sm"
              style={{
                left: `${8 + (i * 14) % 75}%`,
                top: `${20 + (i * 13) % 60}%`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                transform: `rotate(${-5 + (i * 2) % 10}deg)`,
                animationName: 'angryFloat',
                animationDuration: `${2 + (i * 0.2)}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.3}s`,
                maxWidth: '200px',
                textAlign: 'center',
                fontSize: '16px'
              }}
            >
              {insult}
            </div>
          ))}
          
          {/* Intense red screen flash */}
          <div className="absolute inset-0 bg-red-600/30 animate-pulse" style={{ animationDuration: '0.15s' }}></div>
        </div>
      )}

      {effects.davidJokes && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Dad jokes floating around */}
          {[
            "Why don't scientists trust atoms? Because they make up everything!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "Why don't skeletons fight each other? They don't have the guts.",
            "What do you call a bear with no teeth? A gummy bear!",
            "I'm reading a book about anti-gravity. It's impossible to put down!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "What do you call a fake noodle? An impasta!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What did the ocean say to the beach? Nothing, it just waved.",
            "Why did the coffee file a police report? It got mugged!",
            "What do you call a sleeping bull? A bulldozer!",
            "Why did the math book look so sad? Because it had too many problems!",
            "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
            "Why can't a bicycle stand up by itself? It's two tired!",
            "What do you call cheese that isn't yours? Nacho cheese!",
            "Why did the cookie go to the doctor? Because it felt crumbly!",
            "What's orange and sounds like a parrot? A carrot!",
            "Why don't programmers like nature? It has too many bugs!"
          ].map((joke, i) => (
            <div
              key={joke}
              className="absolute bg-yellow-300 text-black p-4 rounded-lg shadow-lg w-48 text-center font-bold border-2 border-orange-400"
              style={{
                left: `${[8, 28, 52, 75, 12, 35, 62, 82, 5, 25, 48, 68, 15, 38, 58, 78, 22, 45][i] || 65}%`,
                top: `${[15, 8, 12, 18, 32, 28, 35, 25, 48, 52, 45, 42, 65, 68, 62, 58, 75, 72][i] || 80}%`,
                animationName: 'jokeFloat',
                animationDuration: `${3.5 + (i * 0.15) % 3}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${(i * 0.3) % 4}s`,
                fontSize: '12px',
                zIndex: 41 + i
              }}
            >
              {joke}
            </div>
          ))}
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow-pulse {
          0% { 
            filter: drop-shadow(0 0 20px rgba(0, 255, 65, 0.8));
          }
          100% { 
            filter: drop-shadow(0 0 40px rgba(0, 255, 65, 1)) drop-shadow(0 0 80px rgba(0, 255, 65, 0.6));
          }
        }
        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0.7;
          }
        }
        @keyframes cascade {
          to {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        @keyframes flicker {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
        @keyframes confettiBlast {
          0% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(var(--blast-distance));
            opacity: 0;
          }
        }
        @keyframes continuousBlast {
          0% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(0) scale(0.5);
            opacity: 0;
          }
          5% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(0) scale(1);
            opacity: 1;
          }
          85% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(var(--blast-distance)) scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(calc(var(--blast-distance) * 1.2)) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes crazyShoot {
          0% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(200px) translateY(-100px) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translateX(-150px) translateY(150px) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes sway {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }
        @keyframes jokeFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-15px) scale(1.02); opacity: 1; }
        }
        @keyframes rageBlast {
          0% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(0) scale(1.2);
            opacity: 1;
          }
          80% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(var(--blast-distance)) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--blast-angle)) translateX(calc(var(--blast-distance) * 1.3)) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes angryFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg) scale(1); opacity: 0.8; }
          25% { transform: translateY(-10px) rotate(2deg) scale(1.05); opacity: 1; }
          75% { transform: translateY(-5px) rotate(-1deg) scale(0.98); opacity: 0.9; }
        }
        .animate-glow {
          animation: glow-pulse 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}