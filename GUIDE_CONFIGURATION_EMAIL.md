# Guide de Configuration E-mail avec Resend

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la configuration et l'utilisation du système d'e-mails avec Resend pour les demandes de partenariat.

## 🚀 Configuration initiale

### 1. Variables d'environnement

Ajoutez la variable suivante dans votre fichier `.env` :

```env
# Configuration Resend
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Obtenir une clé API Resend

1. Créez un compte sur [Resend.com](https://resend.com)
2. Accédez à votre dashboard
3. Allez dans "API Keys"
4. Créez une nouvelle clé API
5. Copiez la clé et ajoutez-la à votre fichier `.env`

### 3. Configuration du domaine

Pour envoyer des e-mails depuis votre domaine :

1. Dans le dashboard Resend, allez dans "Domains"
2. Ajoutez votre domaine (ex: `zalamagn.com`)
3. Suivez les instructions DNS pour vérifier votre domaine
4. Une fois vérifié, vous pourrez envoyer des e-mails depuis `noreply@zalamagn.com`

## 🧪 Tests de configuration

### Test automatique

Exécutez le script de test pour vérifier votre configuration :

```bash
node test-email-configuration.js
```

### Test manuel

Vous pouvez également tester manuellement en soumettant une demande de partenariat via votre formulaire.

## 📧 Fonctionnalités implémentées

### Service E-mail (`src/services/emailService.ts`)

- ✅ **Envoi d'e-mails admin** : Notification complète avec toutes les informations de la demande
- ✅ **E-mail de confirmation utilisateur** : Accusé de réception personnalisé
- ✅ **Gestion d'erreurs robuste** : Classification et logging des erreurs
- ✅ **Analytics intégrées** : Suivi des performances et statistiques
- ✅ **Envoi parallèle** : SMS et e-mails envoyés simultanément

### Templates E-mail

#### Template Admin (`getAdminEmailTemplate`)
- 📊 Informations complètes de l'entreprise
- 👥 Détails RH et représentant légal
- 🎨 Design professionnel avec branding Zalama
- 📱 Responsive design

#### Template Utilisateur (`getUserEmailTemplate`)
- ✅ Confirmation de réception
- 📝 Informations de suivi
- 🔗 Liens de contact
- 🎨 Design cohérent

## 🔧 Intégration dans l'API

### Route de partenariat (`src/app/api/partnership/route.ts`)

L'envoi d'e-mails est intégré dans le même handler que les SMS :

```typescript
// Envoi parallèle SMS + E-mails
const smsPromise = enhancedSmsService.sendPartnershipNotification({...});
const emailPromise = emailService.sendPartnershipEmails(data);

// Gestion en arrière-plan
emailPromise.then(emailResult => {
  // Logging et gestion d'erreurs
});
```

## 📊 Monitoring et Analytics

### Statistiques disponibles

Le service e-mail fournit des analytics automatiques :

```typescript
const analytics = emailService.getAnalytics();
// {
//   sentCount: number,
//   successCount: number,
//   errorCount: number,
//   averageResponseTime: number,
//   lastSent?: Date
// }
```

### Types d'erreurs classifiées

- 🔐 **Auth** : Problèmes d'authentification Resend
- 📊 **Quota** : Limite d'e-mails dépassée
- 🌐 **Network** : Problèmes de connexion
- ✅ **Validation** : Données d'e-mail invalides
- ❓ **Unknown** : Erreurs non classifiées

## 🚨 Gestion d'erreurs

### Logs automatiques

Le système génère des logs détaillés pour chaque envoi :

```
📧 Envoi e-mail admin pour: Entreprise ABC
✅ E-mail admin envoyé avec succès: { messageId: "abc123", duration: "245ms" }
❌ Erreur e-mail utilisateur: { recipient: "user@example.com", error: "Invalid email" }
```

### Actions recommandées par type d'erreur

| Type d'erreur | Action recommandée |
|---------------|-------------------|
| **Auth** | Vérifier la clé API Resend |
| **Quota** | Vérifier le quota dans le dashboard Resend |
| **Network** | Vérifier la connectivité internet |
| **Validation** | Vérifier les adresses e-mail dans le formulaire |
| **Unknown** | Consulter les logs détaillés |

## 🔄 Workflow complet

### 1. Soumission de demande
```
Utilisateur soumet le formulaire → Validation des données → Insertion Supabase
```

### 2. Envoi des notifications
```
✅ SMS envoyé au RH et représentant
✅ E-mail admin avec détails complets
✅ E-mail confirmation à l'utilisateur
```

### 3. Monitoring
```
📊 Analytics mises à jour
📝 Logs détaillés générés
🚨 Alertes en cas d'erreur
```

## 🛠️ Maintenance

### Vérification périodique

1. **Quotidien** : Vérifier les logs d'erreur
2. **Hebdomadaire** : Consulter les analytics Resend
3. **Mensuel** : Vérifier le quota d'e-mails

### Métriques à surveiller

- 📈 Taux de succès d'envoi
- ⏱️ Temps de réponse moyen
- 🚨 Fréquence des erreurs
- 📊 Utilisation du quota

## 🔧 Personnalisation

### Modifier les templates

Les templates sont dans `src/app/api/partnership/emailTemplates.ts` :

```typescript
export const getAdminEmailTemplate = (data: PartnershipEmailData) => `
  // Votre HTML personnalisé ici
`;
```

### Ajouter de nouveaux types d'e-mails

1. Créer un nouveau template dans `emailTemplates.ts`
2. Ajouter une méthode dans `EmailService`
3. Intégrer dans la route appropriée

### Configuration des destinataires

Modifiez les adresses dans `emailService.ts` :

```typescript
to: ['admin@zalamagn.com'], // E-mail admin principal
cc: [data.hrEmail, data.repEmail], // Copie aux contacts
```

## 🚀 Déploiement

### Variables d'environnement de production

Assurez-vous que `RESEND_API_KEY` est configurée dans votre environnement de production.

### Vérification post-déploiement

1. Testez l'envoi d'e-mails avec une vraie demande
2. Vérifiez les logs pour confirmer le bon fonctionnement
3. Surveillez les analytics Resend

## 📞 Support

En cas de problème :

1. ✅ Vérifiez les logs de l'application
2. 🔍 Consultez le dashboard Resend
3. 🧪 Exécutez le script de test
4. 📧 Contactez le support si nécessaire

---

**Note** : Ce système est conçu pour être robuste et maintenable. Tous les envois sont non-bloquants et incluent une gestion d'erreurs complète. 