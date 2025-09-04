import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different HTTP methods
    if (req.method === 'POST') {
      return await handleUpload(req, supabase)
    } else if (req.method === 'DELETE') {
      return await handleDelete(req, supabase)
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Méthode non autorisée. Utilisez POST pour upload ou DELETE pour supprimer.' 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Erreur dans upload-logo:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erreur interne du serveur',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleUpload(req: Request, supabase: any) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Aucun fichier fourni' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou SVG.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Fichier trop volumineux. Taille maximale: 5MB' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `partner-logo-${timestamp}-${randomId}.${fileExtension}`

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('partner-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Erreur upload Supabase:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de l\'upload vers le stockage',
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Générer l'URL publique
    const { data: urlData } = supabase.storage
      .from('partner-logos')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logo uploadé avec succès',
        data: {
          fileName: fileName,
          filePath: data.path,
          publicUrl: urlData.publicUrl,
          fileSize: file.size,
          fileType: file.type
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erreur dans handleUpload:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erreur lors du traitement du fichier',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleDelete(req: Request, supabase: any) {
  try {
    const url = new URL(req.url)
    const fileName = url.searchParams.get('fileName')
    
    if (!fileName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Nom de fichier requis pour la suppression' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Supprimer le fichier du stockage
    const { error } = await supabase.storage
      .from('partner-logos')
      .remove([fileName])

    if (error) {
      console.error('Erreur suppression Supabase:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la suppression du fichier',
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logo supprimé avec succès',
        data: {
          fileName: fileName
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erreur dans handleDelete:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erreur lors de la suppression',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

