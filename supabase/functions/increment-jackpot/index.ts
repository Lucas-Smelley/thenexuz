import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current jackpot
    const { data: currentJackpot, error: fetchError } = await supabase
      .from('prizes')
      .select('value')
      .eq('id', 'epic_mega_jackpot')
      .eq('is_active', true)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Calculate increment (random between 500-2000 EC)
    const increment = Math.floor(Math.random() * 1500) + 500
    const newValue = currentJackpot.value + increment

    // Update jackpot
    const { error: updateError } = await supabase
      .from('prizes')
      .update({ 
        value: newValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'epic_mega_jackpot')
      .eq('is_active', true)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        oldValue: currentJackpot.value,
        newValue: newValue,
        increment: increment
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})