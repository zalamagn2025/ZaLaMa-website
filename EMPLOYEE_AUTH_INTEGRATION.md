# Intégration Employee Auth API

## Vue d'ensemble

Ce projet a été migré pour utiliser l'API employee-auth au lieu de l'authentification Supabase directe. Le nouveau système utilise des Edge Functions Supabase avec JWT pour une meilleure sécurité et performance.

## Architecture

### Composants principaux

1. **Service API** (`src/lib/apiEmployeeAuth.ts`)
   - Gestion des appels vers l'API employee-auth
   - Gestion des tokens JWT et cookies sécurisés
   - Rafraîchissement automatique des tokens

2. **Hook personnalisé** (`src/hooks/useEmployeeProfile.ts`)
   - Gestion de l'état d'authentification
   - Fonctions de connexion/déconnexion
   - Gestion des erreurs

3. **Contexte d'authentification** (`src/contexts/EmployeeAuthContext.tsx`)
   - État global de l'authentification
   - Provider pour l'application

4. **Composants UI**
   - `EmployeeLoginForm.tsx` - Formulaire de connexion
   - `LogoutButton.tsx` - Bouton de déconnexion
   - `ProtectedRoute.tsx` - Protection des routes

## Configuration

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Employee Auth API Configuration
NEXT_PUBLIC_EMPLOYEE_AUTH_URL=https://your-project.supabase.co/functions/v1/employee-auth

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

### URL de l'API employee-auth

L'URL doit pointer vers votre Edge Function Supabase. Format :
```
https://[PROJECT_REF].supabase.co/functions/v1/employee-auth
```

## Routes de l'API employee-auth

### POST /login
- **Fonction** : Authentification employé
- **Body** : `{ email: string, password: string }`
- **Réponse** : `{ success: boolean, access_token: string, refresh_token: string, employee: EmployeeData }`

### GET /getme
- **Fonction** : Récupérer le profil employé
- **Headers** : `Authorization: Bearer <access_token>`
- **Réponse** : `{ employee: EmployeeData }`

### GET /debug
- **Fonction** : Route de diagnostic (admin uniquement)
- **Headers** : `Authorization: Bearer <access_token>`

## Utilisation

### Dans un composant

```tsx
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';

function MyComponent() {
  const { employee, loading, isAuthenticated, login, logout } = useEmployeeAuth();

  if (loading) return <div>Chargement...</div>;
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bonjour {employee?.prenom} {employee?.nom}</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### Protection des routes

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### Bouton de déconnexion

```tsx
import LogoutButton from '@/components/auth/LogoutButton';

function Header() {
  return (
    <header>
      <LogoutButton variant="outline" size="sm" />
    </header>
  );
}
```

## Gestion des erreurs

Le système gère automatiquement :
- Tokens expirés (rafraîchissement automatique)
- Erreurs de réseau
- Redirection vers la page de connexion
- Nettoyage des cookies en cas d'erreur

## Sécurité

### Cookies sécurisés
- `auth-token` : Token d'accès (7 jours)
- `refresh-token` : Token de rafraîchissement (30 jours)
- Attributs : `secure`, `samesite=strict`, `httpOnly`

### Gestion des tokens
- Vérification automatique de l'expiration
- Rafraîchissement transparent
- Nettoyage automatique en cas d'erreur

## Migration depuis l'ancien système

### Changements principaux

1. **Remplacement de `useAuth` par `useEmployeeAuth`**
2. **Utilisation de `EmployeeLoginForm` au lieu de `LoginForm`**
3. **Protection des routes avec `ProtectedRoute`**
4. **Gestion des tokens via cookies au lieu de localStorage**

### Code à remplacer

**Avant :**
```tsx
import { useAuth } from '@/contexts/AuthContext';

const { currentUser, userData, login } = useAuth();
```

**Après :**
```tsx
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';

const { employee, login } = useEmployeeAuth();
```

## Tests

### Test de connexion
1. Aller sur `/login`
2. Saisir email et mot de passe
3. Vérifier la redirection vers `/profile`
4. Vérifier l'affichage des données employé

### Test de déconnexion
1. Être connecté sur `/profile`
2. Cliquer sur le bouton "Déconnexion"
3. Vérifier la redirection vers `/login`
4. Vérifier la suppression des cookies

### Test de protection des routes
1. Essayer d'accéder à `/profile` sans être connecté
2. Vérifier la redirection automatique vers `/login`

## Dépannage

### Erreur "Token d'authentification manquant"
- Vérifier que l'URL de l'API employee-auth est correcte
- Vérifier que les cookies sont bien définis
- Vérifier la configuration CORS de l'Edge Function

### Erreur "Session expirée"
- Le token a expiré et le rafraîchissement a échoué
- L'utilisateur doit se reconnecter

### Erreur de réseau
- Vérifier la connectivité
- Vérifier que l'Edge Function est déployée et accessible

## Support

Pour toute question ou problème :
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs de l'Edge Function dans Supabase
3. Vérifier la configuration des variables d'environnement
