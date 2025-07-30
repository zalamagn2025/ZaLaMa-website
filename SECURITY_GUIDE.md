# 🔒 Guide de Sécurité - Formulaire de Contact

## 🎯 Objectif
Protéger le système d'envoi d'email contre les boucles de mail, le spam et les abus.

## 🛡️ Mesures de Sécurité Implémentées

### 1. **Rate Limiting (Limitation de débit)**
- **Maximum 3 messages par heure** par combinaison IP + email
- **Délai de 60 minutes** entre les messages
- **Nettoyage automatique** des données de rate limiting toutes les heures
- **Messages d'erreur informatifs** avec temps d'attente restant

### 2. **Validation des Emails**
- **Bloquage des domaines temporaires** :
  - `tempmail.org`
  - `10minutemail.com`
  - `guerrillamail.com`
  - Et autres services d'email temporaire
- **Validation du format email** avec regex
- **Vérification de la structure** du domaine

### 3. **Limitation du Contenu**
- **Message** : 10-2000 caractères
- **Sujet** : 3-100 caractères
- **Protection contre les messages trop courts** (spam)
- **Protection contre les messages trop longs** (abus)

### 4. **Détection Anti-Spam**
- **Mots-clés bloqués** :
  - `viagra`, `casino`, `loan`, `credit`
  - `make money fast`, `click here`
  - Et autres termes de spam courants
- **Analyse du contenu** en temps réel
- **Rejet automatique** des messages suspects

### 5. **Suivi et Traçabilité**
- **Stockage de l'IP** de l'expéditeur
- **Horodatage précis** des messages
- **ID unique** pour chaque contact
- **Logs détaillés** pour le monitoring

### 6. **Protection Anti-Boucle**
- **Sujet formaté** : `[CONTACT] Sujet - Nom Prénom`
- **Avertissement dans l'email** : "Ne répondez pas directement à cet email"
- **Reply-To configuré** pour répondre au bon expéditeur
- **Séparation claire** entre notification et réponse

### 7. **Validation Renforcée**
- **Vérification de tous les champs** obligatoires
- **Validation côté serveur** (pas seulement côté client)
- **Messages d'erreur spécifiques** pour chaque type de problème

## 📊 Configuration de Sécurité

```typescript
const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_HOUR: 3,        // Messages max par heure
  MAX_MESSAGE_LENGTH: 2000,        // Caractères max pour le message
  MIN_MESSAGE_LENGTH: 10,          // Caractères min pour le message
  BLOCKED_DOMAINS: [...],          // Domaines temporaires bloqués
  ALLOWED_DOMAINS: [...],          // Domaines autorisés (optionnel)
  MAX_SUBJECT_LENGTH: 100,         // Caractères max pour le sujet
  MIN_SUBJECT_LENGTH: 3,           // Caractères min pour le sujet
  COOLDOWN_MINUTES: 60,            // Délai entre les messages
};
```

## 🔍 Monitoring et Alertes

### Logs de Sécurité
- **Tentatives de spam** détectées
- **Rate limiting** déclenché
- **Emails temporaires** bloqués
- **IPs suspectes** identifiées

### Métriques à Surveiller
- Nombre de messages par heure
- Taux de rejet par type d'erreur
- IPs les plus actives
- Domaines d'email les plus utilisés

## 🚨 Gestion des Incidents

### En cas d'Attaque
1. **Augmenter le rate limiting** temporairement
2. **Ajouter des domaines** à la liste noire
3. **Analyser les logs** pour identifier les patterns
4. **Bloquer les IPs** malveillantes si nécessaire

### En cas de Faux Positifs
1. **Vérifier les logs** de validation
2. **Ajuster les mots-clés** de spam si nécessaire
3. **Réduire le rate limiting** si trop restrictif
4. **Ajouter des domaines** à la liste blanche

## 🔧 Améliorations Futures

### Recommandations pour la Production
1. **Redis pour le rate limiting** (au lieu de la mémoire)
2. **CAPTCHA** pour les formulaires
3. **Honeypot** pour détecter les bots
4. **Analyse comportementale** avancée
5. **Intégration avec des services anti-spam** (SpamAssassin, etc.)

### Monitoring Avancé
1. **Dashboard de sécurité** en temps réel
2. **Alertes automatiques** par email/SMS
3. **Rapports quotidiens** d'activité
4. **Analyse des tendances** de spam

## ✅ Résultat

Avec ces mesures, le système est protégé contre :
- ✅ **Boucles de mail** automatiques
- ✅ **Spam** et messages malveillants
- ✅ **Abus** et envois massifs
- ✅ **Emails temporaires** et fake
- ✅ **Attaques par déni de service** (DoS)

Le formulaire reste **utilisable** pour les vrais utilisateurs tout en étant **sécurisé** contre les abus. 