# 🔍 Intégration des API Avis - Documentation

## 🎯 **Vue d'ensemble**

Cette documentation décrit l'intégration des API avis dans l'application Next.js ZaLaMa-GN. Le système utilise des Edge Functions Supabase avec authentification JWT pour une gestion sécurisée des avis des employés.

### **🌟 Architecture**
```
Frontend (React) → API Routes (Next.js) → Edge Functions (Supabase) → Database (Supabase)
```

### **🔧 Composants Intégrés**
1. **API Routes Next.js** : Proxy vers les Edge Functions
2. **Service TypeScript** : Gestion des appels API
3. **Hook React** : État et logique métier
4. **Composants UI** : Interface utilisateur
5. **Edge Functions** : Logique serveur sécurisée

## 📁 **Structure des Fichiers**

### **API Routes**
```
src/app/api/avis/
├── list/route.ts          # Liste des avis avec filtres
├── create/route.ts        # Création d'un avis
├── get/route.ts           # Récupération d'un avis
├── update/route.ts        # Mise à jour d'un avis
├── delete/route.ts        # Suppression d'un avis
└── stats/route.ts         # Statistiques des avis
```

### **Services et Hooks**
```
src/
├── services/
│   └── avisService.ts     # Service de gestion des avis
├── hooks/
│   └── useAvis.ts         # Hook React pour les avis
└── types/
    └── avis.ts            # Types TypeScript
```

### **Exemples et Tests**
```
├── src/components/examples/
│   └── AvisExample.tsx    # Composant d'exemple
├── test-avis-integration.js
└── scripts/
    └── deploy-employee-avis.js
```

## 🚀 **Installation et Configuration**

### **1. Prérequis**
- Edge Function `employee-avis` déployée sur Supabase
- Variables d'environnement configurées
- Authentification JWT fonctionnelle

### **2. Variables d'Environnement**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **3. Déploiement de l'Edge Function**
```bash
# Déploiement automatique
npm run edge:deploy-employee-avis

# Déploiement manuel
npx supabase functions deploy employee-avis
```

## 📋 **Utilisation**

### **1. Service TypeScript**
```typescript
import { avisService } from '@/services/avisService';

// Configurer le token d'authentification
avisService.setAccessToken(accessToken);

// Lister les avis
const result = await avisService.getAvis({
  page: 1,
  limit: 20,
  note_min: 4
});

// Créer un avis
const { avis, limitInfo } = await avisService.createAvis({
  note: 5,
  commentaire: 'Excellent service !',
  type_retour: 'positif'
});

// Récupérer les statistiques
const stats = await avisService.getStats();
```

### **2. Hook React**
```typescript
import { useAvis } from '@/hooks/useAvis';

function MonComposant() {
  const {
    avis,
    loading,
    error,
    stats,
    fetchAvis,
    createAvis,
    updateAvis,
    deleteAvis,
    setAccessToken
  } = useAvis(accessToken);

  useEffect(() => {
    fetchAvis();
  }, []);

  const handleCreate = async () => {
    try {
      await createAvis({
        note: 5,
        commentaire: 'Super !',
        type_retour: 'positif'
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {avis.map(avis => (
        <div key={avis.id}>
          <h3>{avis.note}/5</h3>
          <p>{avis.commentaire}</p>
        </div>
      ))}
    </div>
  );
}
```

### **3. Composant d'Exemple**
```typescript
import AvisExample from '@/components/examples/AvisExample';

function PageAvis() {
  const accessToken = 'votre-token-jwt';
  
  return <AvisExample accessToken={accessToken} />;
}
```

## 🔌 **Endpoints API**

### **GET /api/avis/list**
Liste des avis avec filtres et pagination.

**Paramètres de requête :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'avis par page (défaut: 20)
- `partner_id` : Filtrer par partenaire
- `note_min` : Note minimum (1-5)
- `note_max` : Note maximum (1-5)
- `type_retour` : 'positif' ou 'negatif'
- `approuve` : true/false
- `date_debut` : Date de début (YYYY-MM-DD)
- `date_fin` : Date de fin (YYYY-MM-DD)
- `sort_by` : Champ de tri
- `sort_order` : 'asc' ou 'desc'

**Headers requis :**
```
Authorization: Bearer <access_token>
```

### **POST /api/avis/create**
Créer un nouvel avis.

**Body :**
```json
{
  "note": 5,
  "commentaire": "Excellent service !",
  "type_retour": "positif"
}
```

**Headers requis :**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### **GET /api/avis/get?id=<avis_id>**
Récupérer un avis spécifique.

**Headers requis :**
```
Authorization: Bearer <access_token>
```

### **PUT /api/avis/update?id=<avis_id>**
Mettre à jour un avis.

**Body :**
```json
{
  "note": 4,
  "commentaire": "Service amélioré !",
  "type_retour": "positif"
}
```

**Headers requis :**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### **DELETE /api/avis/delete?id=<avis_id>**
Supprimer un avis.

**Headers requis :**
```
Authorization: Bearer <access_token>
```

### **GET /api/avis/stats**
Récupérer les statistiques des avis.

**Headers requis :**
```
Authorization: Bearer <access_token>
```

## 🧪 **Tests**

### **Test d'Intégration**
```bash
# Lancer les tests
npm run test:avis-integration

# Ou directement
node test-avis-integration.js
```

### **Test Manuel avec cURL**
```bash
# 1. Connexion pour obtenir un token
curl -X POST "https://your-project.supabase.co/functions/v1/employee-auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Lister les avis
curl -H "Authorization: Bearer <access_token>" \
  "http://localhost:3000/api/avis/list"

# 3. Créer un avis
curl -X POST "http://localhost:3000/api/avis/create" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"note":5,"commentaire":"Test","type_retour":"positif"}'
```

## 🔒 **Sécurité**

### **Authentification**
- **Token JWT** : Obligatoire pour toutes les opérations
- **Validation** : Chaque requête vérifie la validité du token
- **Isolation** : Chaque employé ne peut accéder qu'à ses propres avis

### **Validation des Données**
- **Note** : Doit être comprise entre 1 et 5
- **Commentaire** : Requis et validé
- **Type de retour** : 'positif' ou 'negatif' uniquement
- **Limite quotidienne** : Maximum 3 avis par jour par employé

### **Contrôles d'Accès**
- **Propriété** : Un employé ne peut modifier/supprimer que ses propres avis
- **Lecture** : Accès uniquement aux avis de l'employé authentifié
- **Création** : Vérification de l'existence du partenaire

## 📊 **Types TypeScript**

### **Interface Avis**
```typescript
interface Avis {
  id: string;
  employee_id: string;
  partner_id: string | null;
  note: number;                    // 1-5
  commentaire: string;
  type_retour: 'positif' | 'negatif';
  date_avis: string;              // ISO date
  approuve: boolean;              // Par défaut: false
  created_at: string;
  updated_at: string;
  
  // Relations (ajoutées par l'Edge Function)
  partner_name?: string;
  partner_logo?: string;
}
```

### **Interface CreateAvisRequest**
```typescript
interface CreateAvisRequest {
  note: number;                    // 1-5
  commentaire: string;
  type_retour: 'positif' | 'negatif';
}
```

### **Interface AvisStats**
```typescript
interface AvisStats {
  total_avis: number;
  moyenne_note: number;
  avis_positifs: number;
  avis_negatifs: number;
  avis_approuves: number;
  avis_en_attente: number;
  par_partenaire: Record<string, number>;
  par_note: Record<string, number>;
  evolution_mensuelle: Record<string, number>;
}
```

## 🚨 **Gestion des Erreurs**

### **Codes d'Erreur**
- **400** : Données invalides (note hors limites, champs manquants)
- **401** : Token manquant ou invalide
- **404** : Avis non trouvé ou accès non autorisé
- **429** : Limite quotidienne atteinte
- **500** : Erreur interne du serveur

### **Messages d'Erreur**
```json
{
  "success": false,
  "error": "Description détaillée de l'erreur",
  "details": "Informations supplémentaires"
}
```

## 🔧 **Dépannage**

### **Problèmes Courants**

#### **"Token d'authentification requis"**
- Vérifiez que le token JWT est valide et non expiré
- Utilisez `employee-auth/login` pour obtenir un nouveau token

#### **"Limite d'avis quotidienne atteinte"**
- Chaque employé peut créer maximum 3 avis par jour
- Attendez le lendemain ou supprimez un avis existant

#### **"Avis non trouvé ou accès non autorisé"**
- Vérifiez que l'ID de l'avis est correct
- Assurez-vous que l'avis appartient à l'employé authentifié

#### **"Erreur lors de l'exécution de la requête SQL"**
- Vérifiez que l'Edge Function est déployée
- Consultez les logs de la fonction dans le Dashboard Supabase

### **Logs et Debugging**
```bash
# Voir les logs de l'Edge Function
npx supabase functions logs employee-avis

# Logs en temps réel
npx supabase functions logs employee-avis --follow
```

## 📈 **Performance et Optimisation**

### **Pagination**
- **Limite par défaut** : 20 avis par page
- **Maximum recommandé** : 100 avis par page
- **Tri optimisé** : Par défaut sur `created_at` (indexé)

### **Filtres Efficaces**
- **Index recommandés** : `employee_id`, `partner_id`, `date_avis`
- **Filtres composés** : Support des combinaisons multiples
- **Recherche** : Optimisée pour les requêtes fréquentes

### **Cache et Mise en Cache**
- **Statistiques** : Calculées à la demande
- **Données** : Pas de cache côté serveur (toujours à jour)
- **Client** : Recommandé pour améliorer l'expérience utilisateur

## 🎯 **Cas d'Usage Recommandés**

### **1. Application Mobile Employé**
- Consultation des avis laissés
- Création de nouveaux avis
- Modification des avis existants
- Statistiques personnelles

### **2. Dashboard Web Employé**
- Gestion complète des avis
- Filtres avancés et recherche
- Visualisation des statistiques
- Export des données

### **3. Intégration Partenaire**
- API pour récupérer les avis d'un partenaire
- Statistiques de satisfaction
- Amélioration continue des services

## 🔄 **Migration depuis l'Ancien Système**

### **Ancien Code (API Routes directes)**
```typescript
// ❌ Ancien - Appel direct à l'API
const response = await fetch('/api/avis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(avisData)
});
```

### **Nouveau Code (Service + Hook)**
```typescript
// ✅ Nouveau - Service avec authentification
const { avis, createAvis } = useAvis(accessToken);

const handleCreate = async () => {
  try {
    await createAvis(avisData);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### **Avantages de la Migration**
- **Sécurité** : Authentification JWT obligatoire
- **Performance** : Edge Functions ultra-rapides
- **Maintenance** : Code centralisé et réutilisable
- **Type Safety** : Types TypeScript complets
- **Gestion d'état** : Hook React optimisé

## 📚 **Ressources Supplémentaires**

- **Documentation Edge Functions** : [INTEGRATION_EDGE_FUNCTION.md](./INTEGRATION_EDGE_FUNCTION.md)
- **Guide d'authentification** : [EMPLOYEE_AUTH_INTEGRATION.md](./EMPLOYEE_AUTH_INTEGRATION.md)
- **Tests d'authentification** : [TEST_EMPLOYEE_AUTH.md](./TEST_EMPLOYEE_AUTH.md)
- **Documentation Supabase** : [Edge Functions](https://supabase.com/docs/guides/functions)

## 🎉 **Conclusion**

L'intégration des API avis offre une solution complète et sécurisée pour la gestion des avis des employés. L'architecture modulaire permet une maintenance facile et une évolution future du système.

**Points clés :**
- ✅ Authentification JWT sécurisée
- ✅ CRUD complet des avis
- ✅ Statistiques avancées
- ✅ Limite quotidienne
- ✅ Types TypeScript complets
- ✅ Hook React optimisé
- ✅ Tests d'intégration
- ✅ Documentation complète
