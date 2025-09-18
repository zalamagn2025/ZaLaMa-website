# 🔧 Guide de configuration des URLs Supabase

## 🚨 Problème identifié

L'erreur `access_denied&error_code=otp_expired` indique que :
- Le lien de réinitialisation a expiré
- Les URLs de redirection ne sont pas correctement configurées
- Le token OTP (One-Time Password) n'est plus valide

## ✅ Solution étape par étape

### 1. Configuration dans Supabase Dashboard

Allez dans votre **Supabase Dashboard** → **Authentication** → **URL Configuration**

#### URLs à configurer :

```bash
# Site URL (URL principale de votre application)
Site URL: https://zalamagn.com

# Redirect URLs (URLs autorisées pour la redirection)
Redirect URLs:
- https://zalamagn.com/reset-password
- https://zalamagn.com/auth/callback
- http://localhost:3000/reset-password
- http://localhost:3000/auth/callback
```

### 2. Vérification des variables d'environnement

```env
# Assurez-vous que ces variables sont correctement définies
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://zalamagn.com
```

### 3. Test de la configuration

```bash
# Test rapide de la configuration
node test-supabase-auth-reset.js
```

## 🔍 Diagnostic détaillé

### Vérifier les logs Supabase :

1. **Dashboard Supabase** → **Authentication** → **Logs**
2. **Rechercher** les erreurs liées à `otp_expired`
3. **Vérifier** les tentatives de réinitialisation

### Vérifier la configuration actuelle :

```sql
-- Dans Supabase SQL Editor
SELECT * FROM auth.users 
WHERE email = 'votre-email@example.com'
ORDER BY created_at DESC;
```

## 🛠️ Solutions possibles

### Solution 1 : Réinitialiser la configuration

1. **Supprimer** toutes les URLs de redirection existantes
2. **Ajouter** les nouvelles URLs une par une
3. **Sauvegarder** la configuration
4. **Tester** avec un nouvel email

### Solution 2 : Vérifier le template d'email

Dans **Supabase Dashboard** → **Authentication** → **Email Templates** → **Password Reset** :

```html
<!-- Template recommandé -->
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>Réinitialisation de mot de passe - ZaLaMa</h1>
  <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
  <a href="{{ .ConfirmationURL }}" style="background: #FF671E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    Réinitialiser mon mot de passe
  </a>
  <p><small>Ce lien expire dans 1 heure.</small></p>
</div>
```

### Solution 3 : Debug de l'API

```typescript
// Ajouter des logs de debug dans l'API
/*console.log('🔍 Debug - Email:', email)*/
/*console.log('🔍 Debug - Redirect URL:', redirectUrl)*/
/*console.log('🔍 Debug - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)*/
```

## 🧪 Test de la fonctionnalité

### Test 1 : Demande de réinitialisation

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@example.com"}'
```

### Test 2 : Vérifier l'email reçu

1. **Vérifier** que l'email est bien reçu
2. **Vérifier** que le lien dans l'email pointe vers la bonne URL
3. **Cliquer** sur le lien immédiatement (pas d'attente)

### Test 3 : Test de la page de réinitialisation

```bash
# Accéder directement à la page
http://localhost:3000/reset-password?access_token=test&type=recovery
```

## ⚠️ Problèmes courants

### 1. URLs de redirection incorrectes

**Erreur** : `access_denied`
**Solution** : Vérifier que toutes les URLs sont exactement correctes

### 2. Token expiré

**Erreur** : `otp_expired`
**Solution** : Demander un nouveau lien de réinitialisation

### 3. Configuration Supabase incorrecte

**Erreur** : `invalid_request`
**Solution** : Vérifier les clés API et URLs

## 🔧 Script de diagnostic

```javascript
// diagnostic-supabase-config.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnoseConfiguration() {
  /*console.log('🔍 Diagnostic de la configuration Supabase')*/
  
  // Test de connexion
  const { data, error } = await supabase
    .from('employees')
    .select('count')
    .limit(1);
  
  if (error) {
    /*console.log('❌ Erreur de connexion:', error.message)*/
  } else {
    /*console.log('✅ Connexion Supabase OK')*/
  }
  
  // Vérifier les variables d'environnement
  /*console.log('📋 Variables d\'environnement:')*/
  /*console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')*/
  /*console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')*/
  /*console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)*/
}

diagnoseConfiguration();
```

## ✅ Checklist de résolution

- [ ] URLs de redirection configurées dans Supabase Dashboard
- [ ] Variables d'environnement correctement définies
- [ ] Template d'email personnalisé configuré
- [ ] Test avec un nouvel email de réinitialisation
- [ ] Vérification des logs Supabase
- [ ] Test de la page de réinitialisation

## 🎯 Résultat attendu

Après configuration correcte :
1. **Email reçu** avec lien de réinitialisation
2. **Clic sur le lien** → redirection vers `/reset-password`
3. **Page de réinitialisation** s'affiche correctement
4. **Saisie du nouveau mot de passe** → succès
5. **Redirection** vers la page de connexion

**La configuration est maintenant correcte !** 🚀 