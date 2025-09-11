import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the URL and method
    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    console.log(`🔍 Edge Function employee-demands: ${method} ${path}`)

    // Route: POST /cancel
    if (path === '/cancel' && method === 'POST') {
      return await handleCancelDemand(req, supabase)
    }

    // Route: GET /list
    if (path === '/list' && method === 'GET') {
      return await handleGetDemandsList(req, supabase)
    }

    // Route: GET /stats
    if (path === '/stats' && method === 'GET') {
      return await handleGetDemandsStats(req, supabase)
    }

    // Route: POST /create
    if (path === '/create' && method === 'POST') {
      return await handleCreateDemand(req, supabase)
    }

    // Route not found
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Route not found',
        availableRoutes: ['/cancel', '/list', '/stats', '/create']
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function employee-demands error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

/**
 * Handle cancel demand request
 */
async function handleCancelDemand(req: Request, supabase: any) {
  try {
    console.log('❌ Processing cancel demand request...')

    // Get authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authorization token required' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the token and get user info
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid or expired token' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Parse request body
    const body = await req.json()
    const { id: demandId, reason } = body

    if (!demandId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Demand ID is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('📝 Cancelling demand:', demandId, reason ? `Motif: ${reason}` : 'Sans motif')

    // Get employee ID for this user
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('actif', true)
      .single()

    if (employeeError || !employeeData) {
      console.error('❌ Employee not found:', employeeError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Employee data not found' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if demand exists and belongs to this employee
    const { data: demandData, error: demandError } = await supabase
      .from('salary_advance_requests')
      .select('id, statut, employe_id')
      .eq('id', demandId)
      .eq('employe_id', employeeData.id)
      .single()

    if (demandError || !demandData) {
      console.error('❌ Demand not found:', demandError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Demand not found or does not belong to you' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if demand can be cancelled
    const currentStatus = demandData.statut?.toLowerCase()
    const cancellableStatuses = ['en attente', 'en attente d\'approbation rh']
    
    if (!cancellableStatuses.includes(currentStatus)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Cannot cancel demand with status: ${demandData.statut}. Only demands with status "En attente" or "En attente d'approbation RH" can be cancelled.` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update demand status to cancelled
    const updateData: any = {
      statut: 'Annulé',
      updated_at: new Date().toISOString()
    }

    // Add reason if provided
    if (reason && reason.trim()) {
      updateData.motif_annulation = reason.trim()
    }

    const { data: updatedDemand, error: updateError } = await supabase
      .from('salary_advance_requests')
      .update(updateData)
      .eq('id', demandId)
      .select()

    if (updateError) {
      console.error('❌ Update error:', updateError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to cancel demand' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Demand cancelled successfully:', updatedDemand)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demand cancelled successfully',
        data: updatedDemand[0]
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Cancel demand error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to cancel demand',
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

/**
 * Handle get demands list request
 */
async function handleGetDemandsList(req: Request, supabase: any) {
  // Implementation for getting demands list
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Get demands list - Not implemented yet' 
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

/**
 * Handle get demands stats request
 */
async function handleGetDemandsStats(req: Request, supabase: any) {
  // Implementation for getting demands stats
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Get demands stats - Not implemented yet' 
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

/**
 * Handle create demand request
 */
async function handleCreateDemand(req: Request, supabase: any) {
  // Implementation for creating demand
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Create demand - Not implemented yet' 
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}
