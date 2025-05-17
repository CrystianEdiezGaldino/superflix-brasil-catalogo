
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { ticketId, response, adminId } = await req.json()

    if (!ticketId || !response || !adminId) {
      throw new Error('Missing required fields: ticketId, response, or adminId')
    }

    // Get ticket and user information
    const { data: ticket, error: ticketError } = await supabaseClient
      .from('tickets')
      .select('*, profiles!inner(*)')
      .eq('id', ticketId)
      .single()

    if (ticketError) throw ticketError
    if (!ticket) throw new Error('Ticket not found')

    // Get admin information
    const { data: admin, error: adminError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', adminId)
      .single()

    if (adminError) throw adminError
    if (!admin) throw new Error('Admin not found')

    // Send email using Supabase's built-in email service
    const { error: emailError } = await supabaseClient.functions.invoke('send-email', {
      body: {
        to: ticket.profiles.email,
        subject: `Resposta ao seu ticket: ${ticket.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E50914;">Resposta ao seu ticket</h2>
            <p>Olá,</p>
            <p>O administrador respondeu ao seu ticket:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Título:</strong> ${ticket.title}</p>
              <p style="margin: 10px 0;"><strong>Resposta:</strong></p>
              <p style="margin: 0;">${response}</p>
            </div>
            <p>Atenciosamente,<br>Equipe Superflix</p>
          </div>
        `,
      },
    })

    if (emailError) throw emailError

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in send-ticket-response:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
