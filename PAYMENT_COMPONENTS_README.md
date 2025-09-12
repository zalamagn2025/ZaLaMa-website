# Composants de Gestion des Paiements

## Vue d'ensemble

Ce système de composants permet aux employés de gérer leurs paiements reçus via l'interface ZaLaMa. Il inclut une liste simple des paiements de l'utilisateur, un modal de réception, et des actions de téléchargement/partage.

## Composants Principaux

### 1. UserPaymentsList
**Fichier:** `src/components/profile/user-payments-list.tsx`

Liste simple des paiements de l'utilisateur actuel.

**Props:**
- `userId: string` - ID de l'utilisateur
- `onClose: () => void` - Fonction de fermeture

**Fonctionnalités:**
- Affichage des paiements de l'utilisateur uniquement
- Actions contextuelles (recevoir, télécharger, partager)
- Interface simple et claire
- Modal de réception intégré

### 2. PaymentReceiveModal
**Fichier:** `src/components/profile/payment-receive-modal.tsx`

Modal pour confirmer la réception d'un paiement.

**Props:**
- `isOpen: boolean` - État d'ouverture du modal
- `onClose: () => void` - Fonction de fermeture
- `onConfirm: (receivedAmount: number, notes?: string) => void` - Confirmation
- `payment: PaymentData` - Paiement à confirmer
- `isLoading?: boolean` - État de chargement

**Fonctionnalités:**
- Validation du montant reçu
- Champ de notes optionnel
- Validation des données
- Interface responsive

### 3. PaymentActions
**Fichier:** `src/components/profile/payment-actions.tsx`

Composant d'actions pour les paiements.

**Props:**
- `payment: PaymentData` - Paiement concerné
- `onDownload?: (paymentId: string) => void`
- `onShare?: (paymentId: string) => void`

**Fonctionnalités:**
- Téléchargement de reçu PDF
- Partage via API native ou copie
- Génération de QR code
- Copie de lien

## Types

### PaymentData
```typescript
interface PaymentData {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  currency: string
  status: 'pending' | 'received' | 'cancelled' | 'expired'
  createdAt: string
  receivedAt?: string
  notes?: string
  reference?: string
}
```

## Intégration

Le système est intégré dans le composant `FinancialServices` via :
- Carte "Paiement de salaire (retard)" avec bouton "Gérer"
- Modal `UserPaymentsList` qui s'ouvre au clic

## Fonctionnalités

### ✅ Composants Simplifiés
- [x] UserPaymentsList - Liste simple des paiements utilisateur
- [x] PaymentReceiveModal - Modal de réception
- [x] PaymentActions - Actions de téléchargement/partage
- [x] Intégration dans FinancialServices

### ✅ Fonctionnalités Principales
- [x] Affichage des paiements de l'utilisateur uniquement
- [x] Actions contextuelles selon le statut
- [x] Modal de réception avec validation
- [x] Téléchargement de reçus
- [x] Partage de paiements
- [x] Interface responsive et intuitive

## Utilisation

### Installation des dépendances
```bash
npm install framer-motion @tabler/icons-react
```

### Utilisation dans FinancialServices
Le composant est déjà intégré dans `FinancialServices`. Pour l'utiliser :

1. **Activer le service** : Cliquer sur "Activer" dans la carte "Paiement de salaire (retard)"
2. **Gérer les paiements** : Cliquer sur "Gérer" pour ouvrir la liste
3. **Recevoir un paiement** : Cliquer sur "Recevoir" pour un paiement en attente
4. **Télécharger/Partager** : Utiliser les boutons d'action pour les paiements reçus

## Personnalisation

### Thèmes
Les composants utilisent les classes Tailwind CSS et peuvent être personnalisés via :
- Variables CSS personnalisées
- Classes Tailwind modifiées
- Props de style

### Données
Pour connecter à une vraie API :
1. Modifier le hook `usePayments`
2. Remplacer les appels simulés par de vrais appels API
3. Adapter les types selon votre backend

## Prochaines Étapes

1. **API Backend** - Implémenter les endpoints réels
2. **Authentification** - Intégrer avec le système d'auth existant
3. **Notifications** - Ajouter les notifications push/email
4. **Analytics** - Tracking des actions utilisateur

## Support

Pour toute question ou problème :
1. Vérifier les logs de la console
2. Consulter la documentation des composants
3. Tester avec les données de démonstration
