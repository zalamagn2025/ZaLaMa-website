# 📱 Guide d'Intégration SMS Partenariat - ZaLaMa

## 🎯 Objectif

Envoyer automatiquement des SMS de notification lors de la soumission d'une demande de partenariat à :
- **RH** : Numéro dynamique fourni dans le formulaire (`hr_phone`)
- **Représentant** : Numéro dynamique fourni dans le formulaire (`rep_phone`)

## 📋 Configuration Requise

### Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration NimbaSMS
NIMBA_SMS_SERVICE_ID=votre_service_id
NIMBA_SMS_SECRET_TOKEN=votre_secret_token

# URL de l'application
NEXT_PRIVATE_APP_URL=http://localhost:3000
```

### Installation

```bash
npm install nimbasms
```

## 🔧 Implémentation

### 1. Service SMS Mis à Jour

Le service `EnhancedSMSService` a été adapté pour :

- **Numéros dynamiques** : RH et représentant depuis le formulaire
- **Format de message** : Conforme à vos spécifications
- **Gestion d'erreurs** : Retry automatique et logs détaillés

### 2. API Route Mise à Jour

L'API `/api/partnership` envoie maintenant automatiquement les SMS :

```typescript
// Envoi SMS de notification (non-bloquant)
const smsPromise = enhancedSmsService.sendPartnershipNotification({
  partner_name: data.company_name,
  representative_phone: data.rep_phone,
  rh_phone: data.hr_phone, // Numéro RH dynamique
  request_id: data.id,
  submission_date: new Date()
});
```

### 3. Format du Message SMS

```
🎉 Nouvelle demande de partenariat ZaLaMa

🏢 Partenaire: {nom_entreprise}
📅 Soumis le: {date_formatée}

Nouvelle demande reçue. Consultez-la sur votre espace RH.

Cordialement,
L'équipe ZaLaMa
```

**Exemple concret :**
```
🎉 Nouvelle demande de partenariat ZaLaMa

🏢 Partenaire: Entreprise Test SARL
📅 Soumis le: 07 juillet 2025

Nouvelle demande reçue. Consultez-la sur votre espace RH.

Cordialement,
L'équipe ZaLaMa
```

## 🧪 Tests

### Test Complet

```bash
# Test d'intégration SMS
node test-partnership-sms.js
```

Ce script va :
- ✅ Vérifier les variables d'environnement
- ✅ Tester l'envoi SMS au RH
- ✅ Tester l'envoi SMS au représentant
- ✅ Valider les formats de numéros
- ✅ Tester le formatage de date

### Test Manuel

1. **Soumettez un formulaire de partenariat**
2. **Vérifiez les logs** dans la console :
   ```
   📱 SMS Partnership Results: {
     partner: "Nom Entreprise",
     requestId: "uuid",
     summary: { totalSent: 2, totalFailed: 0, errors: [] }
   }
   ```
3. **Vérifiez les analytics** : `GET /api/sms/analytics`

## 📊 Monitoring

### Dashboard SMS

Le composant `SMSMonitoring` affiche :
- **Statut de santé** en temps réel
- **Métriques de performance** (taux de succès, temps de réponse)
- **Types d'erreurs** avec compteurs
- **Rafraîchissement automatique** toutes les 30 secondes

### API Analytics

```bash
# Récupérer les analytics
GET /api/sms/analytics

# Réinitialiser les analytics
POST /api/sms/analytics
{
  "action": "reset"
}
```

## 🔍 Gestion d'Erreurs

### Types d'Erreurs Gérées

1. **AUTH_ERROR** : Problèmes d'authentification NimbaSMS
2. **PHONE_FORMAT_ERROR** : Format de téléphone invalide
3. **SERVICE_ERROR** : Service SMS indisponible
4. **QUOTA_ERROR** : Quota dépassé
5. **NETWORK_ERROR** : Problèmes de connexion

### Retry Automatique

- **3 tentatives** avec backoff exponentiel
- **Délai initial** : 2 secondes
- **Délai maximum** : 6 secondes

### Logs Détaillés

```typescript
console.log('📱 SMS Partnership Results:', {
  partner: data.partner_name,
  requestId: data.request_id,
  summary: { totalSent: 2, totalFailed: 0, errors: [] },
  details: {
    rh: { success: true, messageId: "msg_123" },
    representative: { success: true, messageId: "msg_124" }
  }
});
```

## 🚀 Déploiement

### Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Credentials NimbaSMS validés
- [ ] Test d'envoi SMS réussi
- [ ] Monitoring configuré
- [ ] Logs vérifiés

### Variables de Production

```env
# Production
NIMBA_SMS_SERVICE_ID=prod_service_id
NIMBA_SMS_SECRET_TOKEN=prod_secret_token
NEXT_PRIVATE_APP_URL=https://zalama.com
```

## 📱 Validation des Numéros

### Formats Supportés

**Guinée (Représentant et RH) :**
- `+224XXXXXXXXX` ✅
- `0XXXXXXXXX` ✅

**Côte d'Ivoire (Représentant et RH) :**
- `+225XXXXXXXX` ✅
- `0XXXXXXXX` ✅

**Autres pays :**
- Format international standard ✅

### Validation Automatique

```typescript
// Validation téléphone Guinée
const guineaPattern = /^(\+224|0)[0-9]{9}$/;

// Validation téléphone Côte d'Ivoire
const coteDIvoirePattern = /^(\+225|0)[0-9]{8}$/;
```

## 📅 Formatage de Date

### Format Français

```typescript
const formattedDate = date.toLocaleDateString('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});
```

**Exemples :**
- `07 juillet 2025`
- `15 décembre 2024`
- `01 janvier 2025`

## 🔧 Debugging

### Problèmes Courants

1. **SMS non reçus**
   - Vérifiez le quota NimbaSMS
   - Validez les credentials
   - Testez avec le script de test

2. **Erreurs d'authentification**
   - Renouvelez les tokens NimbaSMS
   - Vérifiez les variables d'environnement

3. **Numéros invalides**
   - Validez le format : `+224XXXXXXXXX` ou `0XXXXXXXXX`
   - Testez avec le script de validation

### Commandes de Debug

```bash
# Test complet
node test-partnership-sms.js

# Vérifier les analytics
curl http://localhost:3000/api/sms/analytics

# Vérifier les logs
tail -f logs/application.log
```

## 📈 Métriques de Performance

### Objectifs

- **Taux de succès** : > 95%
- **Temps de réponse** : < 2000ms
- **Erreurs critiques** : 0
- **Disponibilité** : > 99.9%

### Monitoring Continu

- **Health checks** automatiques
- **Alertes proactives** pour les dégradations
- **Métriques historiques** pour tendances
- **Rapports de performance** hebdomadaires

## 🎉 Résultat Final

Après implémentation, chaque soumission de demande de partenariat déclenchera automatiquement :

1. **Sauvegarde** dans Supabase ✅
2. **SMS RH** vers le numéro fourni dans le formulaire ✅
3. **SMS Représentant** vers le numéro fourni dans le formulaire ✅
4. **Logs détaillés** pour monitoring ✅
5. **Analytics** en temps réel ✅

L'intégration est maintenant prête pour la production ! 🚀 