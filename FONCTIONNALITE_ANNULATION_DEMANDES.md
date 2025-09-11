# Fonctionnalité d'Annulation des Demandes d'Avance

## Vue d'ensemble

Cette fonctionnalité permet aux employés d'annuler leurs demandes d'avance sur salaire qui sont en statut "En attente" ou "En attente d'approbation RH". L'annulation est irréversible et peut inclure un motif optionnel.

## Fonctionnalités implémentées

### 1. Bouton d'annulation conditionnel
- **Affichage conditionnel** : Le bouton "Annuler" n'apparaît que pour les demandes avec les statuts :
  - "En attente"
  - "En attente d'approbation RH"
- **Design cohérent** : Bouton rouge avec icône de poubelle pour indiquer l'action destructive
- **Positionnement** : À côté du bouton "Voir détail" dans la liste des demandes

### 2. Modal de confirmation d'annulation
- **Interface intuitive** : Modal avec icône d'alerte et message de confirmation
- **Champ de motif optionnel** : Zone de texte pour expliquer la raison de l'annulation
- **Boutons d'action** :
  - "Garder la demande" (annule l'opération)
  - "Annuler la demande" (confirme l'annulation)
- **État de chargement** : Indicateur visuel pendant le traitement

### 3. Intégration avec l'Edge Function
- **Endpoint** : `POST /functions/v1/employee-demands/cancel`
- **Authentification** : Token Bearer requis
- **Paramètres** :
  - `id` (requis) : ID de la demande à annuler
  - `reason` (optionnel) : Motif d'annulation
- **Réponse** : Confirmation de l'annulation avec mise à jour du statut

## Architecture technique

### Services modifiés

#### 1. `employeeDemandsService.ts`
```typescript
async cancelDemand(demandId: string, reason?: string): Promise<any>
```
- Gère l'appel à l'API d'annulation
- Inclut l'authentification automatique
- Gestion des erreurs

#### 2. `useEmployeeDemands.ts`
```typescript
const cancelDemand = useCallback(async (demandId: string, reason?: string) => {
  // Logique d'annulation avec rafraîchissement des données
}, [mutateDemands, mutateStats]);
```
- Hook personnalisé pour l'annulation
- Rafraîchissement automatique des données après annulation
- Gestion des états de chargement et des erreurs
- Notifications toast

#### 3. `transaction-history.tsx`
- Composant principal modifié pour inclure :
  - Fonction `canCancelRequest()` pour vérifier l'éligibilité
  - Bouton d'annulation conditionnel
  - Modal de confirmation
  - Gestion des états locaux

### Types et interfaces

```typescript
// Fonction de vérification d'éligibilité
const canCancelRequest = (status: string | undefined) => {
  if (!status) return false;
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "en attente" || 
         normalizedStatus === "en attente d'approbation rh";
};
```

## Flux utilisateur

1. **Affichage de la liste** : L'utilisateur voit ses demandes d'avance
2. **Identification des demandes annulables** : Les demandes en attente affichent le bouton "Annuler"
3. **Clic sur annuler** : Ouverture de la modal de confirmation
4. **Saisie du motif** (optionnel) : L'utilisateur peut expliquer sa décision
5. **Confirmation** : Clic sur "Annuler la demande"
6. **Traitement** : Appel à l'Edge Function avec indicateur de chargement
7. **Mise à jour** : Rafraîchissement automatique de la liste
8. **Notification** : Message de succès ou d'erreur

## Sécurité et validation

### Côté client
- Vérification du statut avant affichage du bouton
- Confirmation obligatoire via modal
- Validation des données avant envoi

### Côté serveur (Edge Function)
- Authentification requise
- Validation de l'ID de demande
- Vérification des permissions (seul le créateur peut annuler)
- Vérification du statut (seules les demandes en attente peuvent être annulées)

## Tests

### Fichier de test : `test-cancel-demand.js`
- Test d'annulation avec motif
- Test d'annulation sans motif
- Test avec ID invalide
- Test sans authentification
- Validation des réponses attendues

### Cas de test couverts
- ✅ Annulation normale avec motif
- ✅ Annulation normale sans motif
- ✅ Validation des données d'entrée
- ✅ Authentification et autorisation
- ✅ Gestion des erreurs
- ✅ Cas limites et edge cases

## Messages d'erreur et de succès

### Messages de succès
- "Demande annulée avec succès !"

### Messages d'erreur
- "Erreur lors de l'annulation de la demande"
- "Token d'accès non trouvé - veuillez vous connecter"
- Messages spécifiques de l'Edge Function

## Responsive design

- **Mobile** : Modal adaptée aux petits écrans
- **Desktop** : Interface optimisée pour les grands écrans
- **Tablet** : Expérience intermédiaire fluide

## Accessibilité

- **Contraste** : Couleurs respectant les standards d'accessibilité
- **Navigation clavier** : Support complet du clavier
- **Screen readers** : Labels et descriptions appropriés
- **Focus management** : Gestion du focus dans les modals

## Performance

- **Lazy loading** : Modal chargée uniquement quand nécessaire
- **Optimistic updates** : Rafraîchissement immédiat après annulation
- **Debouncing** : Évite les appels multiples accidentels
- **Caching** : Utilisation de SWR pour la gestion du cache

## Maintenance et évolutions futures

### Améliorations possibles
1. **Historique des annulations** : Traçabilité des motifs d'annulation
2. **Notifications** : Alertes aux RH lors d'annulations
3. **Limite de temps** : Délai maximum pour annuler une demande
4. **Rapports** : Statistiques sur les annulations

### Points d'attention
- Surveiller les logs d'erreur de l'Edge Function
- Monitorer les performances des appels API
- Vérifier la cohérence des données après annulation
- Maintenir la synchronisation entre client et serveur

## Déploiement

### Prérequis
- Edge Function `employee-demands` déployée avec la route `/cancel`
- Base de données avec colonnes appropriées pour le statut d'annulation
- Authentification fonctionnelle

### Étapes de déploiement
1. Déployer les modifications du service et du hook
2. Déployer le composant `transaction-history.tsx` modifié
3. Tester l'intégration avec l'Edge Function
4. Vérifier les permissions et la sécurité
5. Monitorer les logs et les performances

## Support et dépannage

### Problèmes courants
1. **Bouton d'annulation non visible** : Vérifier le statut de la demande
2. **Erreur d'authentification** : Vérifier la validité du token
3. **Erreur 400/404** : Vérifier l'ID de la demande
4. **Modal ne s'ouvre pas** : Vérifier les erreurs JavaScript

### Logs utiles
- Console du navigateur pour les erreurs client
- Logs de l'Edge Function pour les erreurs serveur
- Logs de la base de données pour les problèmes de données

