# Correction du problème de disparition des avis

## Problème identifié
Les avis disparaissaient automatiquement après avoir été créés dans la section feedback du profil utilisateur.

## Cause du problème
Le problème était dans le hook `useAvisSWR` :

1. **Revalidation inconditionnelle** : La fonction `mutateAvis()` était appelée même en cas d'échec de création
2. **Gestion défaillante des données optimistes** : L'optimistic update n'était pas correctement géré quand `prev` était `null`
3. **Revalidation trop agressive** : SWR revalidait les données même quand la création échouait

## Corrections apportées

### 1. Revalidation conditionnelle
```typescript
// AVANT
mutateAvis() // Toujours appelé

// APRÈS  
if (result.success) {
  mutateAvis() // Seulement si succès
}
```

### 2. Optimistic update amélioré
```typescript
// AVANT
mutateAvis(
  prev => ({
    ...prev,
    data: prev?.data ? [optimisticAvis, ...prev.data] : [optimisticAvis],
    success: true,
  }),
  false
)

// APRÈS
mutateAvis(
  (prev) => {
    if (!prev) {
      return {
        success: true,
        data: [optimisticAvis]
      }
    }
    return {
      ...prev,
      data: [optimisticAvis, ...(prev.data || [])],
      success: true,
    }
  },
  false
)
```

### 3. Gestion d'erreur améliorée
```typescript
// AVANT
mutateAvis(
  prev => ({
    ...prev,
    data: prev?.data?.filter(avis => avis.id !== optimisticAvis.id) || [],
    success: true,
  }),
  false
)

// APRÈS
mutateAvis(
  (prev) => {
    if (!prev) return prev
    return {
      ...prev,
      data: (prev.data || []).filter(avis => avis.id !== optimisticAvis.id),
      success: true,
    }
  },
  false
)
```

## Fichiers modifiés
- `src/hooks/use-avis-swr.ts` : Corrections de la logique SWR

## Test
Pour tester la correction :
1. Aller sur la page profil
2. Cliquer sur l'onglet "Avis" 
3. Créer un nouvel avis
4. Vérifier que l'avis reste visible dans l'historique

## Résultat attendu
- Les avis créés restent visibles dans l'historique
- L'optimistic update fonctionne correctement
- La revalidation ne cause plus de disparition des données
