# Test du Système Employee Auth

## Configuration requise

1. **Variables d'environnement** - Assurez-vous que ces variables sont définies dans `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Base de données** - Vérifiez que la table `employees` existe avec les bonnes colonnes

## Tests à effectuer

### 1. Test de connexion

1. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

2. **Aller sur la page de connexion** :
   ```
   http://localhost:3000/login
   ```

3. **Tester avec un utilisateur existant** :
   - Utilisez un email/mot de passe d'un employé existant dans votre base de données
   - Vérifiez que la connexion fonctionne
   - Vérifiez la redirection vers `/profile`

### 2. Vérification des logs

Dans la console du navigateur, vous devriez voir :
```
🔧 EmployeeAuthService initialisé avec URL: http://localhost:3000/api/auth
🔐 Tentative de connexion via employee-auth API...
🔧 URL de l'API: http://localhost:3000/api/auth/login
🔧 Credentials: { email: "user@example.com", password: "***" }
🔐 Tentative de connexion via API temporaire...
🔍 Authentification Supabase pour: user@example.com
✅ Authentification Supabase réussie pour UID: xxx
📋 Recherche des informations employé par user_id: xxx
👤 Informations employé trouvées: John Doe
✅ Connexion réussie, tokens stockés
```

### 3. Test de récupération du profil

1. **Après connexion, vérifiez que le profil se charge** :
   - Allez sur `/profile`
   - Vérifiez que les informations employé s'affichent correctement

2. **Vérifiez les cookies** :
   - Ouvrez les DevTools > Application > Cookies
   - Vérifiez que `auth-token` et `refresh-token` sont présents

### 4. Test de déconnexion

1. **Cliquez sur le bouton "Déconnexion"**
2. **Vérifiez** :
   - Redirection vers `/login`
   - Suppression des cookies
   - Nettoyage de l'état

### 5. Test de protection des routes

1. **Essayez d'accéder à `/profile` sans être connecté**
2. **Vérifiez la redirection automatique vers `/login`**

## Dépannage

### Erreur "Failed to fetch"

**Cause** : L'URL de l'API n'est pas accessible

**Solution** :
1. Vérifiez que le serveur Next.js est démarré
2. Vérifiez l'URL dans `src/lib/apiEmployeeAuth.ts`
3. Testez l'URL directement : `http://localhost:3000/api/auth/login`

### Erreur "JWT_SECRET n'est pas défini"

**Solution** :
1. Ajoutez `JWT_SECRET=your_secret_key` dans `.env.local`
2. Redémarrez le serveur

### Erreur "Token d'authentification manquant"

**Cause** : Les cookies ne sont pas définis correctement

**Solution** :
1. Vérifiez que les cookies sont bien définis après connexion
2. Vérifiez les paramètres des cookies (secure, samesite, etc.)

### Erreur "Profil employé non trouvé"

**Cause** : L'utilisateur n'existe pas dans la table `employees`

**Solution** :
1. Vérifiez que l'utilisateur existe dans `auth.users`
2. Vérifiez qu'il y a une entrée correspondante dans `employees` avec le bon `user_id`

## Migration vers l'Edge Function

Une fois que l'Edge Function `employee-auth` est prête :

1. **Modifiez l'URL** dans `src/lib/apiEmployeeAuth.ts` :
   ```typescript
   const EMPLOYEE_AUTH_BASE_URL = process.env.NEXT_PUBLIC_EMPLOYEE_AUTH_URL || 'https://your-project.supabase.co/functions/v1/employee-auth';
   ```

2. **Ajoutez la variable d'environnement** :
   ```env
   NEXT_PUBLIC_EMPLOYEE_AUTH_URL=https://your-project.supabase.co/functions/v1/employee-auth
   ```

3. **Supprimez les routes API temporaires** :
   - `src/app/api/auth/login/route.ts`
   - `src/app/api/auth/getme/route.ts`
   - `src/app/api/auth/debug/route.ts`

## Structure attendue de l'Edge Function

L'Edge Function `employee-auth` doit avoir ces routes :

- `POST /login` - Authentification
- `GET /getme` - Récupération du profil
- `GET /debug` - Diagnostic (optionnel)

Format de réponse attendu :
```json
{
  "success": true,
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "employee": {
    "id": "employee_id",
    "user_id": "user_id",
    "nom": "Nom",
    "prenom": "Prénom",
    "email": "email@example.com",
    // ... autres champs
  }
}
```
