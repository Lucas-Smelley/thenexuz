"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Zap, Coins, Crown } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username
          }
        }
      })

      if (error) throw error

      setSuccess('Account created! Welcome to the RNG Matrix!')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
      
    } catch (error: any) {
      if (error.message === 'Supabase not configured') {
        setError('Authentication service temporarily unavailable. Please try again later.')
      } else {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setSuccess('Welcome back to the RNG Matrix!')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1000)
      
    } catch (error: any) {
      if (error.message === 'Supabase not configured') {
        setError('Authentication service temporarily unavailable. Please try again later.')
      } else {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-gradient-to-br from-black via-purple-900 via-gray-900 to-black border-4 border-pink-400 max-w-md max-h-[85vh] relative shadow-2xl shadow-pink-400/50 sm:max-w-lg overflow-hidden"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50
        }}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-cyan-400/20 via-yellow-400/20 to-green-400/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-orange-500/10 animate-ping" style={{animationDuration: '3s'}}></div>
        
        {/* Floating shapes */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-8 right-6 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-80"></div>
        <div className="absolute bottom-6 left-8 w-2 h-6 bg-yellow-400 animate-pulse opacity-70"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border border-green-400 rotate-45 animate-spin opacity-60" style={{animationDuration: '4s'}}></div>

        {/* Scrollable content wrapper */}
        <div className="relative z-10 max-h-full overflow-y-auto p-1">
        <DialogHeader className="relative z-10">
          <DialogTitle className="font-mono text-2xl text-center flex items-center justify-center gap-2 mb-4"
                       style={{
                         background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
                         backgroundSize: '400% 400%',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent',
                         animation: 'rainbow 3s ease-in-out infinite',
                         textShadow: '0 0 20px #f59e0b'
                       }}>
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
            🎰 EPIC RNG ACCESS 🎰
            <Zap className="w-6 h-6 text-pink-400 animate-pulse" />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border-2 border-pink-400 shadow-xl shadow-pink-400/30">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-black font-mono font-black text-white hover:text-pink-300 transition-all duration-300"
              style={{
                background: 'linear-gradient(45deg, transparent, transparent)',
                color: '#ec4899'
              }}
            >
              🎮 LOGIN 🎮
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-green-400 data-[state=active]:text-black font-mono font-black text-white hover:text-cyan-300 transition-all duration-300"
              style={{
                background: 'linear-gradient(45deg, transparent, transparent)',
                color: '#06b6d4'
              }}
            >
              ⚡ SIGN UP ⚡
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 relative z-10">
            <form action={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono font-black"
                       style={{
                         background: 'linear-gradient(45deg, #ec4899, #06b6d4)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent'
                       }}>
                  🎯 EMAIL ADDRESS 🎯
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-gradient-to-r from-black via-purple-900 to-black border-2 border-pink-400 text-pink-400 font-mono placeholder:text-pink-400/50 focus:border-cyan-400 focus:text-cyan-400 transition-all duration-300 shadow-lg shadow-pink-400/20"
                  placeholder="🌟 Enter your quantum email..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono font-black"
                       style={{
                         background: 'linear-gradient(45deg, #06b6d4, #10b981)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent'
                       }}>
                  🔐 SECRET PASSWORD 🔐
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-gradient-to-r from-black via-purple-900 to-black border-2 border-cyan-400 text-cyan-400 font-mono placeholder:text-cyan-400/50 focus:border-green-400 focus:text-green-400 transition-all duration-300 shadow-lg shadow-cyan-400/20"
                  placeholder="🚀 Enter your access code..."
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-mono font-black text-lg transition-all duration-300 shadow-2xl border-2 border-yellow-400 overflow-hidden relative hover:shadow-3xl"
                style={{
                  background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
                  backgroundSize: '400% 400%',
                  animation: 'rainbow 2s ease-in-out infinite',
                  color: 'black',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <span className="relative z-10 whitespace-nowrap">
                  {isLoading ? "🎰 ACCESSING MATRIX... 🎰" : "💥 ENTER THE RNG WORLD 💥"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4 relative z-10">
            <div className="text-center p-4 border-2 border-green-400 bg-gradient-to-r from-green-400/10 via-yellow-400/10 to-orange-400/10 rounded-lg shadow-xl shadow-green-400/30 animate-pulse">
              <div className="flex items-center justify-center gap-2 font-mono text-sm mb-2 font-black"
                   style={{
                     background: 'linear-gradient(45deg, #10b981, #f59e0b)',
                     backgroundClip: 'text',
                     WebkitBackgroundClip: 'text',
                     color: 'transparent'
                   }}>
                <Crown className="w-5 h-5 text-yellow-400 animate-spin" style={{animationDuration: '3s'}} />
                💰 EPIC NEW USER BONUS 💰
                <Crown className="w-5 h-5 text-orange-400 animate-spin" style={{animationDuration: '3s'}} />
              </div>
              <div className="flex items-center justify-center gap-2 font-mono font-black text-lg"
                   style={{
                     background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4)',
                     backgroundClip: 'text',
                     WebkitBackgroundClip: 'text',
                     color: 'transparent'
                   }}>
                <Coins className="w-6 h-6 text-green-400 animate-bounce" />
                🎆 1000 EpicCoins 🎆
                <Coins className="w-6 h-6 text-yellow-400 animate-bounce" />
              </div>
            </div>

            <form action={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-mono font-black"
                       style={{
                         background: 'linear-gradient(45deg, #f59e0b, #ec4899)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent'
                       }}>
                  🎮 EPIC USERNAME 🎮
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="bg-gradient-to-r from-black via-orange-900 to-black border-2 border-yellow-400 text-yellow-400 font-mono placeholder:text-yellow-400/50 focus:border-orange-400 focus:text-orange-400 transition-all duration-300 shadow-lg shadow-yellow-400/20"
                  placeholder="🌟 Your legendary handle..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono font-black"
                       style={{
                         background: 'linear-gradient(45deg, #ec4899, #06b6d4)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent'
                       }}>
                  📧 QUANTUM EMAIL 📧
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-gradient-to-r from-black via-pink-900 to-black border-2 border-pink-400 text-pink-400 font-mono placeholder:text-pink-400/50 focus:border-cyan-400 focus:text-cyan-400 transition-all duration-300 shadow-lg shadow-pink-400/20"
                  placeholder="💫 quantum.rng@epicworld.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono font-black"
                       style={{
                         background: 'linear-gradient(45deg, #06b6d4, #10b981)',
                         backgroundClip: 'text',
                         WebkitBackgroundClip: 'text',
                         color: 'transparent'
                       }}>
                  🛡️ ULTRA SECURE PASSWORD 🛡️
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="bg-gradient-to-r from-black via-cyan-900 to-black border-2 border-cyan-400 text-cyan-400 font-mono placeholder:text-cyan-400/50 focus:border-green-400 focus:text-green-400 transition-all duration-300 shadow-lg shadow-cyan-400/20"
                  placeholder="🔐 Ultra secure quantum code..."
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-mono font-black text-lg transition-all duration-300 shadow-2xl border-2 border-green-400 overflow-hidden relative hover:shadow-3xl"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #f59e0b, #ec4899, #06b6d4)',
                  backgroundSize: '400% 400%',
                  animation: 'rainbow 2s ease-in-out infinite',
                  color: 'black',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <span className="relative z-10 whitespace-nowrap">
                  {isLoading ? "🎆 CREATING EPIC ACCOUNT... 🎆" : "🚀 JOIN THE RNG REVOLUTION 🚀"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Error/Success Messages */}
        {error && (
          <div className="relative z-10 p-4 border-2 border-red-400 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 rounded-lg shadow-xl shadow-red-400/30 animate-pulse">
            <p className="font-mono text-sm font-black text-center"
               style={{
                 background: 'linear-gradient(45deg, #ef4444, #ec4899)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent'
               }}>
              ⚠️ ERROR: {error} ⚠️
            </p>
          </div>
        )}
        
        {success && (
          <div className="relative z-10 p-4 border-2 border-green-400 bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-green-500/20 rounded-lg shadow-xl shadow-green-400/30 animate-bounce">
            <p className="font-mono text-sm font-black text-center"
               style={{
                 background: 'linear-gradient(45deg, #10b981, #06b6d4)',
                 backgroundClip: 'text',
                 WebkitBackgroundClip: 'text',
                 color: 'transparent'
               }}>
              🎉 SUCCESS: {success} 🎉
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="relative z-10 text-center font-mono text-xs font-black"
             style={{
               background: 'linear-gradient(45deg, #f59e0b, #ec4899, #06b6d4, #10b981)',
               backgroundSize: '400% 400%',
               backgroundClip: 'text',
               WebkitBackgroundClip: 'text',
               color: 'transparent',
               animation: 'rainbow 4s ease-in-out infinite'
             }}>
          ⚡🔮 POWERED BY QUANTUM AUTHENTICATION 🔮⚡
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}