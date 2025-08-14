# Intégration des Supabase Edge Functions - Documentation

## Vue d'ensemble

Cette documentation décrit l'intégration des Supabase Edge Functions dans l'application Next.js ZaLaMa-GN pour la gestion de l'authentification et des profils employés.

## Architecture

### Schéma d'intégration

```
Frontend (Next.js) → API Routes (Next.js) → Supabase Edge Functions → Supabase Database
```

### Composants principaux

1. **Supabase Edge Functions** : Fonctions serverless déployées sur Supabase
2. **API Routes Next.js** : Routes proxy entre le frontend et les Edge Functions
3. **Service Layer** : Couche d'abstraction pour les appels API
4. **React Context** : Gestion de l'état d'authentification
5. **Hooks personnalisés** : Logique métier réutilisable

## Endpoints Edge Functions

### 1. `/functions/v1/employee-auth/login`

**Méthode** : `POST`

**Fonction** : Authentification des employés

**Request Body** :
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** :
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "employee": {
      "id": "string",
      "email": "string",
      "nom": "string",
      "prenom": "string",
      "photo_url": "string"
    }
  }
}
```

### 2. `/functions/v1/employee-auth/getme`

**Méthode** : `GET`

**Fonction** : Récupération du profil employé

**Headers** :
```
Authorization: Bearer <access_token>
```

### 3. `/functions/v1/employee-auth/update-profile`

**Méthode** : `PUT`

**Fonction** : Mise à jour du profil employé

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### 4. `/functions/v1/employee-auth/upload-photo`

**Méthode** : `POST`

**Fonction** : Upload de photo de profil

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### 5. `/functions/v1/employee-auth/debug`

**Méthode** : `GET`

**Fonction** : Debug et diagnostic

**Query Parameters** :
```
email=string&user_id=string
```

## Implémentation côté Next.js

### 1. API Routes (Proxy)

#### `/api/auth/login/route.ts`

```typescript
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/login`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await response.json();
    return createCorsResponse(result, response.status);
  } catch (error) {
    return createCorsResponse({ success: false, error: 'Erreur interne' }, 500);
  }
}
```

#### `/api/auth/getme/route.ts`

```typescript
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse({ success: false, error: 'Token requis' }, 401);
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/getme`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const result = await response.json();
    return createCorsResponse(result, response.status);
  } catch (error) {
    return createCorsResponse({ success: false, error: 'Erreur interne' }, 500);
  }
}
```

### 2. Service Layer

#### `/lib/apiEmployeeAuth.ts`

```typescript
export class EmployeeAuthService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/employee-auth`;
  }
  
  async login(email: string, password: string): Promise<EmployeeAuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return response.json();
  }
  
  async getProfile(accessToken: string): Promise<EmployeeAuthResponse> {
    const response = await fetch('/api/auth/getme', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    
    return response.json();
  }
  
  async updateProfile(accessToken: string, data: UpdateProfileData): Promise<EmployeeAuthResponse> {
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    
    return response.json();
  }
  
  async uploadPhoto(accessToken: string, photoFile: File): Promise<EmployeeAuthResponse> {
    const formData = new FormData();
    formData.append('photoFile', photoFile);
    
    const response = await fetch('/api/auth/upload-photo', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData,
    });
    
    return response.json();
  }
}

export const employeeAuthService = new EmployeeAuthService();
```

### 3. React Context

#### `/contexts/EmployeeAuthContext.tsx`

```typescript
export function EmployeeAuthProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadProfile = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await employeeAuthService.getProfile(accessToken);
      if (response.success) {
        setEmployee(response.data.employee);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await employeeAuthService.login(email, password);
      if (response.success) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        await loadProfile();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setEmployee(null);
    setIsAuthenticated(false);
  };

  // ... reste du contexte
}
```

## Gestion des tokens

### Stockage local

Les tokens sont stockés dans le `localStorage` du navigateur :

```typescript
// Stockage
localStorage.setItem('access_token', token);
localStorage.setItem('refresh_token', refreshToken);

// Récupération
const accessToken = localStorage.getItem('access_token');

// Suppression
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

### Headers d'autorisation

Tous les appels aux Edge Functions incluent le token dans le header :

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

## Gestion des erreurs

### Types d'erreurs

1. **Erreurs réseau** : Problèmes de connectivité
2. **Erreurs d'authentification** : Token invalide ou expiré
3. **Erreurs de validation** : Données invalides
4. **Erreurs serveur** : Problèmes côté Edge Function

### Gestion centralisée

```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Token expiré, redirection vers login
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  } else if (error.status === 400) {
    // Erreur de validation
    console.error('Données invalides:', error.message);
  } else {
    // Erreur serveur
    console.error('Erreur serveur:', error);
  }
};
```

## Sécurité

### CORS

Les API routes incluent la gestion CORS :

```typescript
export function createCorsResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### Validation des tokens

Chaque requête authentifiée valide le token :

```typescript
const authHeader = request.headers.get('authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return createCorsResponse({ success: false, error: 'Token requis' }, 401);
}
```

## Migration depuis l'ancien système

### Changements principaux

1. **Remplacement des appels directs Supabase** par des appels aux Edge Functions
2. **Gestion des tokens** via localStorage au lieu des cookies
3. **API routes proxy** pour isoler le frontend des Edge Functions
4. **Service layer centralisé** pour la logique métier

### Avantages

1. **Sécurité renforcée** : Logique métier côté serveur
2. **Performance** : Edge Functions serverless
3. **Maintenabilité** : Séparation claire des responsabilités
4. **Évolutivité** : Architecture modulaire

## Déploiement

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Déploiement des Edge Functions

```bash
# Déploiement des Edge Functions
supabase functions deploy employee-auth

# Déploiement de l'application Next.js
npm run build
npm run start
```

## Conclusion

L'intégration des Supabase Edge Functions offre une architecture robuste et sécurisée pour l'authentification et la gestion des profils employés. Cette approche centralise la logique métier côté serveur tout en maintenant une interface claire pour le frontend.
