import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Vérifier l'authentification (optionnel pour les uploads publics)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    // Générer un ID unique pour les utilisateurs non authentifiés
    const userId = session?.user?.id || `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Récupérer le fichier depuis la requête
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation du type MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Type de fichier non autorisé. Types acceptés: PDF, DOC, DOCX` 
        },
        { status: 400 }
      )
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Fichier trop volumineux. Taille maximale: ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        },
        { status: 400 }
      )
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `motivation-letter-${userId}-${timestamp}.${fileExtension}`

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('motivation-letters')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erreur upload:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      )
    }

    // Générer l'URL publique du fichier
    const { data: { publicUrl } } = supabase.storage
      .from('motivation-letters')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      fileSize: file.size,
      mimeType: file.type
    })

  } catch (error) {
    console.error('Erreur upload motivation letter:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 