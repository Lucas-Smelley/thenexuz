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
      setError(error.message)
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
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-yellow-400 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-yellow-400 font-mono text-2xl text-center flex items-center justify-center gap-2">
            <Zap className="w-6 h-6" />
            EPIC RNG ACCESS
            <Zap className="w-6 h-6" />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-yellow-400/10 border border-yellow-400">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-mono"
            >
              LOGIN
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-mono"
            >
              SIGN UP
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form action={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-yellow-400 font-mono">EMAIL</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-black border-yellow-400 text-yellow-400 font-mono placeholder:text-yellow-400/50"
                  placeholder="Enter the matrix..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-yellow-400 font-mono">PASSWORD</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-black border-yellow-400 text-yellow-400 font-mono placeholder:text-yellow-400/50"
                  placeholder="Access code..."
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-mono font-bold text-lg"
              >
                {isLoading ? "ACCESSING..." : "ENTER MATRIX"}
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4">
            <div className="text-center p-4 border border-yellow-400/30 bg-yellow-400/5 rounded">
              <div className="flex items-center justify-center gap-2 text-yellow-400 font-mono text-sm mb-2">
                <Crown className="w-4 h-4" />
                NEW USER BONUS
                <Crown className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-center gap-1 text-yellow-400 font-mono">
                <Coins className="w-4 h-4" />
                <span>1000 EpicCoins</span>
              </div>
            </div>

            <form action={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-yellow-400 font-mono">USERNAME</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="bg-black border-yellow-400 text-yellow-400 font-mono placeholder:text-yellow-400/50"
                  placeholder="Your handle..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-yellow-400 font-mono">EMAIL</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-black border-yellow-400 text-yellow-400 font-mono placeholder:text-yellow-400/50"
                  placeholder="quantum@rng.world"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-yellow-400 font-mono">PASSWORD</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="bg-black border-yellow-400 text-yellow-400 font-mono placeholder:text-yellow-400/50"
                  placeholder="Secure access code..."
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-mono font-bold text-lg"
              >
                {isLoading ? "CREATING..." : "JOIN THE RNG"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-3 border border-red-500 bg-red-500/10 rounded">
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="p-3 border border-green-500 bg-green-500/10 rounded">
            <p className="text-green-400 font-mono text-sm">{success}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-yellow-400/60 font-mono text-xs">
          POWERED BY QUANTUM AUTHENTICATION
        </div>
      </DialogContent>
    </Dialog>
  )
}