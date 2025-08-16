# 🌐 Configuration CORS - Documentation

## 🎯 **Vue d'ensemble**

Cette documentation décrit la configuration CORS (Cross-Origin Resource Sharing) mise à jour pour l'application ZaLaMa-GN. La nouvelle configuration permet l'accès depuis tous les domaines localhost (tous les ports) et les domaines de production.

## 🔧 **Configuration Mise à Jour**

### **Domaines Autorisés**

La configuration CORS autorise maintenant les domaines suivants :

#### **Localhost (Tous les ports)**
- `http://localhost:*` (tous les ports)
- `https://localhost:*` (tous les ports)
- `http://127.0.0.1:*` (tous les ports)
- `https://127.0.0.1:*` (tous les ports)
- `http://0.0.0.0:*` (tous les ports)
- `https://0.0.0.0:*` (tous les ports)

#### **Domaines de Production**
- `https://zalamagn.com`
- `https://www.zalamagn.com`
- `http://zalamagn.com`
- `http://www.zalamagn.com`

#### **Domaines de Développement/Staging**
- `https://dev.zalamagn.com`
- `https://staging.zalamagn.com`

## 📁 **Fichiers Modifiés**

### **1. src/lib/cors.ts**
Configuration CORS dynamique avec gestion des origines autorisées.

```typescript
// Domaines autorisés pour CORS
const allowedOrigins = [
  // Localhost (tous les ports)
  /^https?:\/\/localhost:\d+$/,
  /^https?:\/\/127\.0\.0\.1:\d+$/,
  /^https?:\/\/0\.0\.0\.0:\d+$/,
  
  // Domaines de production
  'https://zalamagn.com',
  'https://www.zalamagn.com',
  // ...
];
```

### **2. next.config.js**
Configuration CORS globale pour toutes les API routes.

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        // ...
      ],
    },
  ];
}
```

### **3. Routes API Mises à Jour**
Toutes les routes API utilisent maintenant la nouvelle configuration CORS :

- `src/app/api/auth/login/route.ts`
- `src/app/api/avis/list/route.ts`
- `src/app/api/avis/create/route.ts`
- `src/app/api/avis/get/route.ts`
- `src/app/api/avis/update/route.ts`
- `src/app/api/avis/delete/route.ts`
- `src/app/api/avis/stats/route.ts`

## 🚀 **Utilisation**

### **Headers CORS Configurés**

```typescript
{
  'Access-Control-Allow-Origin': origin,        // Origine dynamique
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',            // 24 heures
}
```

### **Fonctions CORS Disponibles**

```typescript
import { 
  createCorsResponse, 
  handleOptions, 
  getCorsHeaders,
  withCors 
} from '@/lib/cors';

// Créer une réponse avec CORS
const response = createCorsResponse(data, status, request);

// Gérer les requêtes OPTIONS
const optionsResponse = handleOptions(request);

// Obtenir les headers CORS
const headers = getCorsHeaders(request);

// Wrapper pour les handlers
const handlerWithCors = withCors(async (request) => {
  // Votre logique ici
});
```

## 🧪 **Tests CORS**

### **Script de Test Automatisé**

```bash
# Lancer les tests CORS
npm run test:cors

# Ou directement
node test-cors.js
```

### **Domaines Testés**

Le script de test vérifie automatiquement :

1. **Localhost (différents ports)**
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://localhost:3002`
   - `http://localhost:8080`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:3001`

2. **Domaines de Production**
   - `https://zalamagn.com`
   - `https://www.zalamagn.com`
   - `http://zalamagn.com`
   - `http://www.zalamagn.com`

### **Types de Tests**

1. **Test CORS Basique** : Vérification des headers CORS
2. **Test Preflight** : Vérification des requêtes OPTIONS
3. **Test API Réelle** : Test des endpoints avec authentification

## 🔒 **Sécurité**

### **Gestion des Origines**

- **Développement** : Plus permissif, accepte toutes les origines avec avertissement
- **Production** : Strict, n'accepte que les domaines autorisés
- **Fallback** : Retourne `https://zalamagn.com` pour les origines non autorisées

### **Headers de Sécurité**

```typescript
// Headers de sécurité inclus
'Access-Control-Allow-Credentials': 'true',
'Access-Control-Max-Age': '86400',  // Cache preflight 24h
```

## 🔧 **Configuration Avancée**

### **Ajouter un Nouveau Domaine**

Pour ajouter un nouveau domaine autorisé, modifiez `src/lib/cors.ts` :

```typescript
const allowedOrigins = [
  // ... domaines existants
  
  // Nouveau domaine
  'https://nouveau-domaine.com',
  'https://www.nouveau-domaine.com',
];
```

### **Configuration par Environnement**

```typescript
// En développement
if (process.env.NODE_ENV === 'development') {
  console.warn(`⚠️ Origine non autorisée en développement: ${origin}`);
  return origin;
}

// En production
return 'https://zalamagn.com';
```

## 🚨 **Dépannage**

### **Problèmes Courants**

#### **"CORS policy: No 'Access-Control-Allow-Origin' header"**
- Vérifiez que le domaine est dans `allowedOrigins`
- Redémarrez le serveur Next.js
- Vérifiez la configuration dans `next.config.js`

#### **"Preflight request failed"**
- Vérifiez que la route OPTIONS est correctement configurée
- Vérifiez les headers `Access-Control-Request-Method` et `Access-Control-Request-Headers`

#### **"Credentials not supported"**
- Vérifiez que `Access-Control-Allow-Credentials` est défini à `true`
- Assurez-vous que `Access-Control-Allow-Origin` n'est pas `*` avec des credentials

### **Logs de Debug**

```typescript
// Activer les logs de debug
console.log('🌐 Origine demandée:', origin);
console.log('✅ Origine autorisée:', isOriginAllowed(origin));
console.log('📋 Headers CORS:', getCorsHeaders(request));
```

## 📊 **Monitoring**

### **Métriques CORS**

Le script de test fournit des statistiques détaillées :

```
📈 Statistiques:
  CORS: 10/10 (100%)
  Preflight: 10/10 (100%)
  API: 10/10 (100%)
```

### **Logs de Performance**

```typescript
// Temps de réponse CORS
console.time('cors-response');
const response = createCorsResponse(data, status, request);
console.timeEnd('cors-response');
```

## 🎯 **Cas d'Usage**

### **1. Application Mobile**
- Accès depuis `localhost:3001` (React Native)
- Accès depuis `localhost:8080` (Expo)
- Accès depuis `127.0.0.1:*` (émulateurs)

### **2. Application Web**
- Accès depuis `localhost:3000` (Next.js)
- Accès depuis `localhost:3002` (autre port)
- Accès depuis `zalamagn.com` (production)

### **3. API Externe**
- Accès depuis `dev.zalamagn.com` (staging)
- Accès depuis `staging.zalamagn.com` (pré-production)

## 🔄 **Migration**

### **Ancienne Configuration**
```typescript
// ❌ Ancien - Configuration statique
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
```

### **Nouvelle Configuration**
```typescript
// ✅ Nouveau - Configuration dynamique
export function getCorsHeaders(request: NextRequest) {
  const origin = getCorsOrigin(request);
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Credentials': 'true',
  };
}
```

## 📚 **Ressources**

- **Documentation CORS MDN** : [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- **Next.js Headers** : [Headers Configuration](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- **Tests CORS** : `npm run test:cors`
- **Configuration** : `src/lib/cors.ts`

## 🎉 **Conclusion**

La nouvelle configuration CORS offre :

✅ **Flexibilité** : Support de tous les ports localhost
✅ **Sécurité** : Gestion stricte des domaines en production
✅ **Performance** : Cache preflight optimisé
✅ **Maintenance** : Configuration centralisée et réutilisable
✅ **Tests** : Validation automatique complète
✅ **Documentation** : Guide complet d'utilisation

La configuration est maintenant prête pour tous les environnements de développement et de production ! 🚀
