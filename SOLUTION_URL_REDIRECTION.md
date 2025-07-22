# 🔧 Solution : Problème de redirection vers /#

## 🚨 **Problème identifié**

Quand vous cliquez sur le lien dans l'email, vous êtes redirigé vers :
```
http://localhost:3000/#access_token=...&type=recovery
```

Au lieu de :
```
http://localhost:3000/update-password#access_token=...&type=recovery
```

## ✅ **Solution étape par étape**

### 1. **Vérifier la configuration Supabase**

Allez dans **Supabase Dashboard** → **Authentication** → **URL Configuration**

#### URLs à configurer :

```bash
# Site URL
Site URL: https://zalamagn.com

# Redirect URLs (IMPORTANT : Ajoutez ces URLs)
- https://zalamagn.com/update-password
- https://zalamagn.com/reset-password
- http://localhost:3000/update-password
- http://localhost:3000/reset-password
```

### 2. **Vérifier l'API forgot-password**

Dans `src/app/api/auth/forgot-password/route.ts`, vérifiez que l'URL de redirection est correcte :

```typescript
const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/update-password`;
```

### 3. **Test immédiat**

1. **Allez sur** `http://localhost:3000/update-password`
2. **Vérifiez** que la page s'affiche correctement
3. **Demandez** un nouvel email de réinitialisation
4. **Cliquez** sur le lien dans l'email

### 4. **Solution alternative temporaire**

Si le problème persiste, vous pouvez temporairement utiliser la page `reset-password.tsx` qui fonctionne déjà :

1. **Modifiez** l'API pour rediriger vers `/reset-password` :
```typescript
const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;
```

2. **Testez** avec un nouvel email

## 🔍 **Diagnostic rapide**

### Vérifier les variables d'environnement :

```bash
# Dans votre fichier .env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://zalamagn.com
```

### Vérifier que la page existe :

```bash
# Testez l'accès à la page
curl http://localhost:3000/update-password
```

## 🛠️ **Solution de contournement**

Si le problème persiste, vous pouvez :

1. **Utiliser temporairement** `reset-password.tsx` qui fonctionne
2. **Configurer** les URLs de redirection vers `/reset-password`
3. **Tester** le flux complet
4. **Migrer** vers `update-password.tsx` une fois résolu

## 🎯 **Résultat attendu**

Après configuration correcte :
1. **Email reçu** avec lien de réinitialisation
2. **Clic sur le lien** → redirection vers `/update-password#token=...`
3. **Page update-password** s'affiche avec le formulaire
4. **Saisie du nouveau mot de passe** → succès
5. **Redirection** vers `/login`

## ⚡ **Test rapide**

```bash
# Test de la page update-password
curl -I http://localhost:3000/update-password

# Test de l'API forgot-password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@example.com"}'
```

**Le problème devrait être résolu après avoir configuré les URLs de redirection dans Supabase Dashboard !** 🚀 