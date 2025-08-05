# Fonctionnalité de Protection par Mot de Passe

## Vue d'ensemble

Cette fonctionnalité permet de protéger l'affichage des informations sensibles (salaire net, salaire restant) en exigeant une vérification par mot de passe avant de les afficher.

## Composants impliqués

### 1. `PasswordVerificationModal` (`src/components/ui/password-verification-modal.tsx`)

Modal de vérification par mot de passe avec les fonctionnalités suivantes :
- Interface utilisateur moderne et responsive
- Vérification du mot de passe via Supabase Auth
- Gestion des erreurs et feedback utilisateur
- Animation et transitions fluides

### 2. `usePasswordVerification` (`src/hooks/usePasswordVerification.ts`)

Hook personnalisé pour gérer l'état de vérification :
- Gestion de l'état du modal
- Vérification du mot de passe
- Gestion des erreurs
- Réinitialisation automatique

### 3. `ProtectedContentIndicator` (`src/components/ui/protected-content-indicator.tsx`)

Composant d'indicateur visuel pour le contenu protégé :
- Affichage d'un indicateur de protection
- Bouton de basculement pour afficher/masquer
- Animations et transitions

## Utilisation

### Dans le composant ProfileStats

```tsx
import { usePasswordVerification } from "@/hooks/usePasswordVerification";
import { PasswordVerificationModal } from "@/components/ui/password-verification-modal";

export function ProfileStats({ user }: { user: UserWithEmployeData }) {
  const {
    isModalOpen,
    isVerified,
    verifyPassword,
    openVerificationModal,
    closeVerificationModal,
    resetVerification
  } = usePasswordVerification({
    onSuccess: () => {
      // Actions à effectuer après vérification réussie
    },
    onError: (error) => {
      // Gestion des erreurs
    }
  });

  return (
    <div>
      {/* Contenu protégé */}
      <StatCard 
        hideable={true}
        isVerified={isVerified}
        onRequestVerification={openVerificationModal}
        // ... autres props
      />
      
      {/* Modal de vérification */}
      <PasswordVerificationModal
        isOpen={isModalOpen}
        onClose={closeVerificationModal}
        onSuccess={() => {
          // Actions après succès
        }}
        onVerifyPassword={verifyPassword}
        title="Vérification du mot de passe"
        message="Entrez votre mot de passe pour afficher vos informations financières"
      />
    </div>
  );
}
```

## Fonctionnalités

### 1. Protection automatique
- Les informations sensibles sont masquées par défaut
- Affichage d'un indicateur visuel de protection
- Message d'instruction pour l'utilisateur

### 2. Vérification sécurisée
- Vérification du mot de passe via Supabase Auth
- Gestion des erreurs de mot de passe incorrect
- Feedback utilisateur en temps réel

### 3. Expérience utilisateur
- Interface intuitive avec animations
- Transitions fluides entre les états
- Messages d'erreur clairs et informatifs

### 4. Sécurité
- Réinitialisation automatique lors du changement d'utilisateur
- Protection contre les tentatives d'accès non autorisées
- Session sécurisée

## Configuration

### Personnalisation du modal

```tsx
<PasswordVerificationModal
  isOpen={isModalOpen}
  onClose={closeVerificationModal}
  onSuccess={handleSuccess}
  onVerifyPassword={verifyPassword}
  title="Titre personnalisé"
  message="Message personnalisé"
/>
```

### Personnalisation de l'indicateur

```tsx
<ProtectedContentIndicator
  isProtected={true}
  isVisible={isVisible}
  onToggleVisibility={handleToggle}
  showToggle={true}
  size="md" // 'sm' | 'md' | 'lg'
/>
```

## Sécurité

### Vérification du mot de passe
- Utilisation de Supabase Auth pour la vérification
- Pas de stockage local du mot de passe
- Session sécurisée

### Réinitialisation automatique
- La vérification est réinitialisée lors du changement d'utilisateur
- Protection contre l'accès non autorisé
- Nettoyage automatique des états

## Maintenance

### Ajout de nouvelles informations protégées

1. Ajouter la prop `hideable={true}` au composant
2. Passer les props `isVerified` et `onRequestVerification`
3. Utiliser le hook `usePasswordVerification`

### Personnalisation des messages

Modifier les props `title` et `message` du modal selon le contexte d'utilisation.

## Tests

### Tests recommandés
- Vérification avec mot de passe correct
- Vérification avec mot de passe incorrect
- Fermeture du modal
- Changement d'utilisateur
- Réinitialisation de la vérification

### Scénarios de test
1. Utilisateur clique sur l'icône œil → Modal s'ouvre
2. Utilisateur entre un mauvais mot de passe → Erreur affichée
3. Utilisateur entre le bon mot de passe → Informations affichées
4. Utilisateur ferme le modal → État réinitialisé
5. Changement d'utilisateur → Vérification réinitialisée 