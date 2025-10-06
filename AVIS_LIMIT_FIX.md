# Correction de la limite d'avis quotidienne

## Problème identifié
La limite d'avis quotidienne ne fonctionnait pas correctement :
- L'Edge Function `employee-avis` n'avait pas de gestion de limite
- Le hook `useAvisLimit` retournait des valeurs statiques
- L'API `/api/avis/limit` n'acceptait que les tokens JWT, pas les tokens Supabase

## Solution implémentée

### 1. Utilisation de l'API Next.js pour la limite
- **Avant** : Edge Function `employee-avis/stats` (pas de gestion de limite)
- **Après** : API Next.js `/api/avis/limit` (gestion complète de la limite)

### 2. Support des tokens Supabase
- **Avant** : Seuls les tokens JWT étaient acceptés
- **Après** : Support des tokens Supabase (commençant par `eyJ`)

### 3. Récupération de l'ID employé
- **Avant** : Utilisation directe de `userData.uid`
- **Après** : Vérification du token Supabase et récupération de l'user_id

## Fichiers modifiés
- `src/hooks/use-avis-swr.ts` : Utilisation de `/api/avis/limit`
- `src/app/api/avis/limit/route.ts` : Support des tokens Supabase

## Fonctionnalités corrigées
1. **Comptage des avis** : Le nombre d'avis créés aujourd'hui est correctement compté
2. **Limite quotidienne** : La limite de 3 avis par jour est respectée
3. **Mise à jour en temps réel** : La limite se met à jour après chaque création d'avis
4. **Authentification** : Support des tokens d'authentification employé

## Test
Pour tester la correction :
1. Aller sur la page profil
2. Cliquer sur l'onglet "Avis"
3. Créer un avis et vérifier que le compteur se met à jour
4. Créer 3 avis et vérifier que la limite est atteinte

## Résultat attendu
- ✅ Le compteur d'avis se met à jour correctement
- ✅ La limite de 3 avis par jour est respectée
- ✅ Plus d'affichage statique "0/3 avis utilisés"
- ✅ Blocage après 3 avis créés
