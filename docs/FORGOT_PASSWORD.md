# Fonctionnalité Mot de Passe Oublié

## Vue d'ensemble

Cette fonctionnalité permet aux employés de réinitialiser leur mot de passe en cas d'oubli. Elle utilise Firebase Authentication pour gérer l'envoi d'emails de récupération et la réinitialisation sécurisée des mots de passe.

## Flux de fonctionnement

### 1. Demande de réinitialisation
- L'utilisateur clique sur "Mot de passe oublié ?" depuis la page de connexion
- Il saisit son email professionnel
- Un email de réinitialisation est envoyé via Firebase Auth

### 2. Réception de l'email
- L'utilisateur reçoit un email avec un lien de réinitialisation
- Le lien contient un code `oobCode` unique et sécurisé
- Le lien a une durée de validité limitée (généralement 1 heure)

### 3. Réinitialisation du mot de passe
- L'utilisateur clique sur le lien dans l'email
- Il est redirigé vers la page de réinitialisation avec le code
- Il saisit et confirme son nouveau mot de passe
- Le mot de passe est mis à jour de manière sécurisée

## Structure des fichiers

### APIs

#### `/api/auth/forgot-password`
- **Méthode**: POST
- **Description**: Envoie un email de réinitialisation
- **Paramètres**: 
  ```json
  {
    "email": "utilisateur@exemple.com"
  }
  ```
- **Réponse**: 
  ```json
  {
    "message": "Email de réinitialisation envoyé avec succès",
    "success": true
  }
  ```

#### `/api/auth/verify-reset-code`
- **Méthode**: POST
- **Description**: Vérifie la validité d'un code de réinitialisation
- **Paramètres**: 
  ```json
  {
    "oobCode": "code_de_verification"
  }
  ```
- **Réponse**: 
  ```json
  {
    "message": "Code de réinitialisation valide",
    "email": "utilisateur@exemple.com",
    "valid": true
  }
  ```

#### `/api/auth/reset-password`
- **Méthode**: POST
- **Description**: Réinitialise le mot de passe
- **Paramètres**: 
  ```json
  {
    "oobCode": "code_de_verification",
    "newPassword": "nouveau_mot_de_passe"
  }
  ```
- **Réponse**: 
  ```json
  {
    "message": "Mot de passe réinitialisé avec succès",
    "success": true
  }
  ```

### Pages

#### `/auth/forgot-password`
- Page de demande de réinitialisation
- Formulaire avec champ email
- Gestion des états de chargement et de succès
- Messages d'erreur appropriés

#### `/auth/reset-password`
- Page de réinitialisation du mot de passe
- Validation automatique du code depuis l'URL
- Formulaire avec validation du mot de passe
- Confirmation du mot de passe
- Redirection automatique après succès

## Validation du mot de passe

Le nouveau mot de passe doit respecter les critères suivants :
- Au moins 8 caractères
- Au moins une majuscule
- Au moins une minuscule  
- Au moins un chiffre

## Sécurité

### Gestion des erreurs
- Pour des raisons de sécurité, l'API ne révèle pas si un email existe ou non
- Les codes de réinitialisation expirent automatiquement
- Les codes ne peuvent être utilisés qu'une seule fois

### Codes d'erreur Firebase
- `auth/expired-action-code`: Lien expiré
- `auth/invalid-action-code`: Lien invalide ou déjà utilisé
- `auth/user-not-found`: Utilisateur non trouvé
- `auth/user-disabled`: Compte désactivé
- `auth/weak-password`: Mot de passe trop faible

## Configuration requise

### Variables d'environnement
- `NEXT_PUBLIC_BASE_URL`: URL de base de l'application (pour les liens de redirection)
- Configuration Firebase (déjà existante)

### Firebase Configuration
- Firebase Authentication doit être configuré
- Les templates d'email peuvent être personnalisés dans la console Firebase

## Usage

1. **Depuis la page de connexion** :
   ```tsx
   <Link href="/auth/forgot-password">
     Mot de passe oublié ?
   </Link>
   ```

2. **Test de l'API** :
   ```bash
   curl -X POST http://localhost:3000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

## Personnalisation

### Templates d'email
Les templates d'email peuvent être personnalisés dans la console Firebase :
1. Aller dans Authentication > Templates
2. Modifier le template "Réinitialisation du mot de passe"
3. Personnaliser le contenu et le design

### Styling
Les pages utilisent le même système de design que le reste de l'application :
- Tailwind CSS
- Framer Motion pour les animations
- Composants UI cohérents avec la charte graphique

## Débogage

### Logs côté serveur
Les APIs loggent les étapes importantes :
```
🔐 Demande de réinitialisation de mot de passe...
🔍 Envoi d'email de réinitialisation pour: user@example.com
✅ Email de réinitialisation envoyé avec succès
```

### Erreurs communes
1. **Email non envoyé** : Vérifier la configuration Firebase
2. **Lien invalide** : Le code peut avoir expiré ou déjà été utilisé
3. **Mot de passe rejeté** : Vérifier les critères de validation

## Tests

Pour tester la fonctionnalité :
1. Utiliser un email valide dans Firebase Auth
2. Vérifier la réception de l'email (et les spams)
3. Cliquer sur le lien dans l'email
4. Tester avec différents types de mots de passe
5. Vérifier la redirection après succès 