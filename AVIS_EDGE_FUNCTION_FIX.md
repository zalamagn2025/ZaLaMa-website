# Correction du système d'avis - Migration vers Edge Function

## Problème identifié
Les avis ne fonctionnaient pas car :
1. **Mauvaise API utilisée** : Le frontend appelait `/api/avis` (API Next.js) au lieu de l'Edge Function
2. **Token d'authentification incorrect** : Tentative de lecture depuis les cookies au lieu de localStorage
3. **Erreur 401** : "Token d'authentification manquant" car le mauvais token était utilisé

## Solution implémentée

### 1. Migration vers l'Edge Function
- **Avant** : `/api/avis` (API Next.js avec erreur 401)
- **Après** : `https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-avis/list` (Edge Function)

### 2. Correction de l'authentification
- **Avant** : Lecture depuis `document.cookie` avec clé `auth-token`
- **Après** : Lecture depuis `localStorage` avec clé `employee_access_token`

### 3. Endpoints mis à jour
```typescript
// Récupération des avis
GET https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-avis/list

// Création d'avis
POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-avis/create

// Statistiques
GET https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-avis/stats
```

## Fichiers modifiés
- `src/hooks/use-avis-swr.ts` : Migration complète vers Edge Function

## Fonctionnalités corrigées
1. **Affichage des avis** : Les avis s'affichent maintenant correctement
2. **Création d'avis** : Les avis sont maintenant stockés en base de données
3. **Persistance** : Les avis restent visibles après actualisation de la page
4. **Authentification** : Utilisation du bon token d'authentification

## Test
Pour tester la correction :
1. Aller sur la page profil
2. Cliquer sur l'onglet "Avis"
3. Créer un nouvel avis
4. Vérifier que l'avis s'affiche dans l'historique
5. Actualiser la page et vérifier que l'avis persiste

## Résultat attendu
- ✅ Les avis s'affichent correctement
- ✅ Les avis sont stockés en base de données
- ✅ Les avis persistent après actualisation
- ✅ Plus d'erreur "Token d'authentification manquant"
