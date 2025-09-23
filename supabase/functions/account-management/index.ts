import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AccountData {
  deviceId: string
  email: string
  nom?: string
  prenom?: string
  profileImage?: string
  poste?: string
  entreprise?: string
}

interface PinVerification {
  deviceId: string
  userId: string
  pin: string
}

serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Utiliser la clé de service pour toutes les actions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()
    
    const userAuthHeader = req.headers.get('X-User-Authorization')
    // console.log('🔍 Edge Function Debug:', {
    //   action,
    //   hasUserAuthHeader: !!userAuthHeader,
    //   userAuthHeader: userAuthHeader ? userAuthHeader.substring(0, 20) + '...' : 'none'
    // })

    // Actions qui ne nécessitent pas d'authentification utilisateur
    const publicActions = ['get_accounts', 'verify_pin', 'update_last_login', 'remove_account']
    
    // Actions qui nécessitent une authentification utilisateur
    const protectedActions = ['save_account']

    if (publicActions.includes(action)) {
      // Actions publiques - pas d'authentification utilisateur requise
      switch (action) {
        case 'get_accounts':
          return await getAccounts(supabase, data.deviceId)
        
        case 'verify_pin':
          return await verifyPin(supabase, data as PinVerification)
        
        case 'update_last_login':
          return await updateLastLogin(supabase, data.deviceId, data.userId)
        
        case 'remove_account':
          return await removeAccount(supabase, data.deviceId, data.userId)
      }
    } else if (protectedActions.includes(action)) {
      // Actions protégées - authentification utilisateur requise
      const userAuthHeader = req.headers.get('X-User-Authorization')
      if (!userAuthHeader) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Token d\'authentification requis',
            details: ['Cette action nécessite une authentification']
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      switch (action) {
        case 'save_account':
          return await saveAccount(supabase, data as AccountData, req, userAuthHeader)
      }
    } else {
      // Action non reconnue
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Action non reconnue',
          details: [`L'action "${action}" n'est pas supportée`]
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Erreur Edge Function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erreur interne du serveur',
        details: ['Une erreur inattendue s\'est produite']
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Sauvegarder un compte
async function saveAccount(supabase: any, data: AccountData, req: Request, userAuthHeader?: string) {
  try {
    // console.log('🔍 saveAccount reçu:', {
    //   deviceId: data.deviceId,
    //   email: data.email,
    //   nom: data.nom,
    //   prenom: data.prenom,
    //   profileImage: data.profileImage,
    //   poste: data.poste,
    //   entreprise: data.entreprise
    // })
    
    // Vérifier que l'utilisateur est authentifié
    const authHeader = userAuthHeader || req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Token d\'authentification requis',
          details: ['Cette action nécessite une authentification']
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier si le compte existe déjà
    const { data: existingAccount } = await supabase
      .from('device_accounts')
      .select('*')
      .eq('device_id', data.deviceId)
      .eq('user_id', user.id)
      .single()

    if (existingAccount) {
      // Mettre à jour le compte existant
      const { data: updatedAccount, error } = await supabase
        .from('device_accounts')
        .update({
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          profile_image: data.profileImage,
          poste: data.poste,
          entreprise: data.entreprise,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAccount.id)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          success: true, 
          account: updatedAccount,
          message: 'Compte mis à jour avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Créer un nouveau compte
      const { data: newAccount, error } = await supabase
        .from('device_accounts')
        .insert({
          device_id: data.deviceId,
          user_id: user.id,
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          profile_image: data.profileImage,
          poste: data.poste,
          entreprise: data.entreprise,
          last_login: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          success: true, 
          account: newAccount,
          message: 'Compte sauvegardé avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Erreur saveAccount:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la sauvegarde du compte' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Récupérer les comptes d'un appareil
async function getAccounts(supabase: any, deviceId: string) {
  try {
    const { data: accounts, error } = await supabase
      .from('device_accounts')
      .select('*')
      .eq('device_id', deviceId)
      .eq('is_active', true)
      .order('last_login', { ascending: false })

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        accounts: accounts || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erreur getAccounts:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la récupération des comptes' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Vérifier un PIN (via l'API existante)
async function verifyPin(supabase: any, data: PinVerification) {
  try {
    // Récupérer le compte
    const { data: account, error } = await supabase
      .from('device_accounts')
      .select('*')
      .eq('device_id', data.deviceId)
      .eq('user_id', data.userId)
      .single()

    if (error || !account) {
      return new Response(
        JSON.stringify({ error: 'Compte non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier le PIN via l'API auth/verify-password
    const verifyResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        email: account.email,
        password: data.pin
      })
    })

    const verifyResult = await verifyResponse.json()
    const isValid = verifyResponse.ok && verifyResult.user

    if (isValid) {
      // Mettre à jour la dernière connexion
      await supabase
        .from('device_accounts')
        .update({ last_login: new Date().toISOString() })
        .eq('id', account.id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        valid: isValid,
        message: isValid ? 'PIN correct' : 'PIN incorrect'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erreur verifyPin:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la vérification du PIN' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Supprimer un compte
async function removeAccount(supabase: any, deviceId: string, userId: string) {
  try {
    // console.log('🔍 removeAccount appelé avec:', { deviceId, userId })
    
    // Vérifier d'abord si le compte existe
    const { data: existingAccount, error: selectError } = await supabase
      .from('device_accounts')
      .select('id, email')
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification du compte:', selectError)
      throw selectError
    }

    if (!existingAccount) {
      // console.log('⚠️ Compte non trouvé pour suppression:', { deviceId, userId })
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Compte non trouvé ou déjà supprimé'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // console.log('✅ Compte trouvé, suppression en cours:', existingAccount.email)

    // Supprimer le compte
    const { error: deleteError, count } = await supabase
      .from('device_accounts')
      .delete()
      .eq('device_id', deviceId)
      .eq('user_id', userId)
      .select('id')

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression:', deleteError)
      throw deleteError
    }

    // console.log('✅ Compte supprimé avec succès, lignes affectées:', count)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Compte supprimé avec succès',
        deletedCount: count
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Erreur removeAccount:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erreur lors de la suppression du compte',
        details: error.message || 'Erreur inconnue'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Mettre à jour la dernière connexion
async function updateLastLogin(supabase: any, deviceId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('device_accounts')
      .update({ last_login: new Date().toISOString() })
      .eq('device_id', deviceId)
      .eq('user_id', userId)

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Dernière connexion mise à jour'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erreur updateLastLogin:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la mise à jour' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}