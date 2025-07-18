# 📧 Guide des Notifications - Demandes d'Avance sur Salaire

## 🎯 Vue d'ensemble

Ce guide explique l'implémentation des notifications automatiques (email + SMS) pour les demandes d'avance sur salaire dans l'application Zalama.

## 🚀 Fonctionnalités Implémentées

### ✅ Notifications Automatiques
- **Email de confirmation** envoyé à l'employé
- **SMS de confirmation** envoyé à l'employé
- **Envoi parallèle** (non-bloquant)
- **Gestion d'erreurs robuste**
- **Retry automatique** pour les SMS

### ✅ Templates Personnalisés
- **Email** : Template HTML professionnel avec branding Zalama
- **SMS** : Message personnalisé avec emojis et informations détaillées
- **Données dynamiques** : Prénom, montant, date, motif

## 📧 Service de Notification

### Structure du Service (`src/services/advanceNotificationService.ts`)

```typescript
class AdvanceNotificationService {
  // Envoi d'email de confirmation
  async sendEmployeeEmail(data: AdvanceNotificationData): Promise<EmailResult>
  
  // Envoi de SMS de confirmation
  async sendEmployeeSMS(data: AdvanceNotificationData): Promise<SMSResult>
  
  // Envoi combiné (email + SMS)
  async sendAdvanceNotifications(data: AdvanceNotificationData): Promise<NotificationResult>
}
```

### Données Requises

```typescript
interface AdvanceNotificationData {
  employeeName: string        // "Jean Dupont"
  employeeEmail: string       // "jean.dupont@example.com"
  employeePhone: string       // "+224123456789"
  amount: number             // 500000 (en GNF)
  reason: string             // "Achat de carburant"
  requestDate: string        // ISO date string
  requestId: string          // UUID de la demande
  availableSalary: number    // Salaire disponible
  availableAdvance: number   // Avance disponible
  requestType: string        // "transport", "sante", etc.
}
```

## 📧 Template Email

### Template Utilisé
- **Fichier** : `src/app/api/salary-advance/request/emailAdminAdvance.ts`
- **Fonction** : `getUserAdvanceEmailTemplate()`
- **Design** : HTML responsive avec branding Zalama

### Exemple de Contenu
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Confirmation de réception de votre demande</title>
</head>
<body>
  <h2>Confirmation de réception</h2>
  <p>Bonjour <strong>Jean Dupont</strong></p>
  <p>Nous vous confirmons la réception de votre demande effectuée via la plateforme ZaLaMa.</p>
  <p>Notre équipe procède actuellement à la vérification des informations fournies.</p>
  <p>Vous recevrez une notification dès que votre demande aura été traitée.</p>
</body>
</html>
```

## 📱 Template SMS

### Message Formaté
```
Bonjour Jean Dupont 👋,
ZaLaMa a bien reçu votre demande d'avance sur salaire de 500,000 GNF 💰 ce 15/01/2025 📅. Elle est en cours de traitement 🛠️. Vous recevrez une notification dès validation ✅.
Merci pour votre confiance 🙏.
```

### Caractéristiques
- **Longueur** : ~200 caractères
- **Emojis** : Pour améliorer l'expérience utilisateur
- **Informations clés** : Prénom, montant, date
- **Formatage** : Montant avec séparateurs de milliers

## 🔧 Intégration dans l'API

### Point d'Intégration
**Fichier** : `src/app/api/salary-advance/request/route.ts`

### Code d'Intégration
```typescript
// Après création réussie de la demande
const notificationData = {
  employeeName: `${employeeData.prenom} ${employeeData.nom}`,
  employeeEmail: employeeData.email,
  employeePhone: employeeData.telephone,
  amount: parseFloat(montantDemande),
  reason: motif.trim(),
  requestDate: new Date().toISOString(),
  requestId: transactionDataResult.id,
  availableSalary: salaireDisponible ? parseFloat(salaireDisponible) : 0,
  availableAdvance: avanceDisponible ? parseFloat(avanceDisponible) : 0,
  requestType: typeMotif
}

// Envoi non-bloquant des notifications
advanceNotificationService.sendAdvanceNotifications(notificationData)
  .then(result => {
    console.log('📧 Notifications avance envoyées:', {
      employee: notificationData.employeeName,
      requestId: notificationData.requestId,
      emailSuccess: result.email.success,
      smsSuccess: result.sms.success,
      summary: result.summary
    })
  })
  .catch(error => {
    console.error('❌ Erreur envoi notifications avance:', error)
  })
```

## 🧪 Tests et Validation

### Script de Test
**Fichier** : `test-advance-notifications.js`

### Exécution des Tests
```bash
# Test complet des notifications
node test-advance-notifications.js
```

### Tests Inclus
1. **Formatage des messages** - Validation des formats de date, montant, téléphone
2. **Envoi d'email** - Test d'envoi d'email de confirmation
3. **Envoi de SMS** - Test d'envoi de SMS de confirmation
4. **Envoi combiné** - Test d'envoi parallèle email + SMS
5. **Gestion d'erreurs** - Test avec données invalides

### Exemple de Sortie
```
🧪 TESTS DE NOTIFICATIONS - DEMANDES D'AVANCE SUR SALAIRE
======================================================================

📋 Vérification des variables d'environnement:
RESEND_API_KEY: ✅ Configuré
NIMBA_SMS_SERVICE_ID: ✅ Configuré
NIMBA_SMS_SECRET_TOKEN: ✅ Configuré

🔧 Test: Formatage des messages
📅 Date formatée: 15/01/2025
💰 Montant formaté: 500,000 GNF
📞 Test formatage téléphones:
  +224123456789 → +224123456789
  0123456789 → +224123456789
  123456789 → +224123456789
  +224 123 456 789 → +224123456789
✅ Formatage des messages: Succès

🔧 Test: Envoi d'email
📧 Test d'envoi d'email de confirmation...
✅ Email envoyé avec succès
📋 Détails: { messageId: "msg_123", recipient: "jean.dupont@example.com", template: "employee-confirmation" }
✅ Envoi d'email: Succès

🔧 Test: Envoi de SMS
📱 Test d'envoi de SMS de confirmation...
✅ SMS envoyé avec succès
📋 Détails: { messageId: "sms_456", recipient: "+224123456789", timestamp: "2025-01-15T10:30:00.000Z" }
✅ Envoi de SMS: Succès

🔧 Test: Envoi combiné
🔄 Test d'envoi combiné (email + SMS)...
📊 Résultats combinés:
✅ Succès global: true
📧 Email: ✅
📱 SMS: ✅
📈 Résumé: { totalSent: 2, totalFailed: 0, errors: [] }
✅ Envoi combiné: Succès

📊 RÉSUMÉ DES TESTS
======================================================================
✅ Tests réussis: 5/5
📈 Taux de succès: 100%
🎉 Tous les tests sont passés avec succès!
```

## 📊 Monitoring et Analytics

### Logs Automatiques
Le service génère des logs détaillés pour chaque envoi :

```
📧 Envoi e-mail confirmation employé pour: Jean Dupont
✅ E-mail confirmation employé envoyé: { messageId: "msg_123", employee: "Jean Dupont", amount: 500000, duration: "245ms" }

📱 Envoi SMS confirmation employé pour: Jean Dupont
✅ SMS confirmation employé envoyé: { messageId: "sms_456", employee: "Jean Dupont", phone: "+224123456789", duration: "180ms" }

📧 Résultats envoi notifications avance: {
  employee: "Jean Dupont",
  requestId: "uuid-123",
  emailSuccess: true,
  smsSuccess: true,
  overallSuccess: true,
  summary: { totalSent: 2, totalFailed: 0, errors: [] }
}
```

### Types d'Erreurs Gérées

| Type d'Erreur | Description | Action Recommandée |
|---------------|-------------|-------------------|
| **Auth** | Problèmes d'authentification Resend/NimbaSMS | Vérifier les clés API |
| **Quota** | Limite d'envoi dépassée | Vérifier les quotas |
| **Network** | Problèmes de connexion | Vérifier la connectivité |
| **Validation** | Données invalides | Vérifier les formats |
| **Unknown** | Erreurs non classifiées | Consulter les logs |

## 🔧 Configuration

### Variables d'Environnement Requises

```env
# Configuration Resend
RESEND_API_KEY=your_resend_api_key

# Configuration NimbaSMS
NIMBA_SMS_SERVICE_ID=your_service_id
NIMBA_SMS_SECRET_TOKEN=your_secret_token
```

### Dépendances

```bash
# Installation des dépendances
npm install resend nimbasms

# Vérification des types
npm install --save-dev @types/nimbasms
```

## 🚀 Déploiement

### Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Credentials Resend validés
- [ ] Credentials NimbaSMS validés
- [ ] Tests de notification réussis
- [ ] Monitoring configuré
- [ ] Logs vérifiés

### Vérification Post-Déploiement

1. **Soumettre une vraie demande d'avance**
2. **Vérifier les logs** dans la console
3. **Confirmer la réception** des notifications
4. **Surveiller les analytics** Resend et NimbaSMS

## 🔄 Workflow Complet

### 1. Soumission de Demande
```
Employé soumet demande → Validation des données → Insertion Supabase
```

### 2. Envoi des Notifications
```
✅ Email de confirmation à l'employé
✅ SMS de confirmation à l'employé
✅ Logs détaillés générés
```

### 3. Suivi et Monitoring
```
📊 Analytics mises à jour
📝 Logs structurés
🚨 Alertes en cas d'erreur
```

## 🛠️ Maintenance

### Vérifications Périodiques

1. **Quotidien** : Vérifier les logs d'erreur
2. **Hebdomadaire** : Consulter les analytics Resend
3. **Mensuel** : Vérifier les quotas NimbaSMS

### Métriques à Surveiller

- 📈 **Taux de succès** d'envoi (> 95%)
- ⏱️ **Temps de réponse** moyen (< 2000ms)
- 🚨 **Fréquence des erreurs** (< 5%)
- 📊 **Utilisation des quotas** (< 80%)

## 🔧 Personnalisation

### Modifier le Template Email

Éditez `src/app/api/salary-advance/request/emailAdminAdvance.ts` :

```typescript
export const getUserAdvanceEmailTemplate = (data: {
  employeeName: string;
  amount: number;
  reason: string;
  requestId: string;
}) => `
  // Votre HTML personnalisé ici
`;
```

### Modifier le Message SMS

Éditez `src/services/advanceNotificationService.ts` :

```typescript
private buildAdvanceSMSMessage(data: AdvanceNotificationData): string {
  return `Votre message personnalisé ici avec ${data.employeeName}`;
}
```

### Ajouter de Nouvelles Notifications

1. Créer un nouveau template dans `emailTemplates.ts`
2. Ajouter une méthode dans `AdvanceNotificationService`
3. Intégrer dans la route appropriée

## 📞 Support

### En Cas de Problème

1. **Vérifier les logs** - Tous les détails sont affichés
2. **Tester manuellement** - Utiliser le script de test
3. **Vérifier la configuration** - Variables d'environnement
4. **Consulter la documentation** - Resend et NimbaSMS

### Commandes de Debug

```bash
# Test complet des notifications
node test-advance-notifications.js

# Vérifier les logs
tail -f logs/application.log

# Test d'envoi manuel
curl -X POST http://localhost:3000/api/salary-advance/request
```

## 🎉 Résultat Final

Après implémentation, chaque soumission de demande d'avance sur salaire déclenchera automatiquement :

1. **📧 Email de confirmation** avec template professionnel
2. **📱 SMS de confirmation** avec message personnalisé
3. **📊 Logs détaillés** pour monitoring
4. **🔄 Gestion d'erreurs** robuste
5. **⚡ Envoi non-bloquant** pour performance optimale

**Le système est prêt pour la production !** 🚀 