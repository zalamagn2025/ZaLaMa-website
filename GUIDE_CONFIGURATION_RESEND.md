# 📧 Guide de configuration Resend pour ZaLaMa

## 🎯 Vue d'ensemble

Ce guide détaille la configuration complète de Resend pour l'envoi d'emails transactionnels dans ZaLaMa, en remplacement du système SMTP de Supabase.

## 🔧 Configuration Resend

### 1. Création du compte Resend

1. **Inscription** : Allez sur [resend.com](https://resend.com)
2. **Créer un compte** avec votre email professionnel
3. **Vérifier votre domaine** : `zalamagn.com`

### 2. Configuration du domaine

```bash
# Étapes pour vérifier votre domaine sur Resend
1. Connectez-vous à votre dashboard Resend
2. Allez dans "Domains"
3. Ajoutez votre domaine : zalamagn.com
4. Configurez les enregistrements DNS :
   - TXT record pour la vérification
   - MX record pour la réception
   - SPF record pour l'authentification
```

### 3. Génération de la clé API

1. **Dashboard Resend** → **API Keys**
2. **Créer une nouvelle clé** avec les permissions :
   - `emails:send`
   - `domains:read`
3. **Copier la clé API** (format : `re_xxxxxxxxxx`)

## 🔐 Configuration des variables d'environnement

### Variables requises :

```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Variables optionnelles :

```env
# Email Configuration (déjà configuré dans le service)
EMAIL_FROM=noreply@zalamagn.com
EMAIL_FROM_NAME=ZaLaMa
```

## 🗄️ Configuration de la base de données

### 1. Création de la table des tokens

```bash
# Exécuter le script SQL
psql -d votre_base -f scripts/create-password-reset-tokens-table.sql
```

### 2. Vérification de la structure

```sql
-- Vérifier que la table existe
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'password_reset_tokens';

-- Vérifier la structure
\d password_reset_tokens;
```

## 🚀 Installation et configuration

### 1. Installation des dépendances

```bash
# Installer Resend
npm install resend

# Vérifier l'installation
npm list resend
```

### 2. Test de la configuration

```bash
# Tester l'intégration Resend
node test-resend-integration.js
```

### 3. Test de l'API

```bash
# Démarrer le serveur de développement
npm run dev

# Tester l'API dans un autre terminal
curl -X POST http://localhost:3000/api/auth/send-reset-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 📧 Service email personnalisé

### Configuration automatique :

Le service `resendEmailService` est configuré automatiquement avec :
- **From Email** : `noreply@zalamagn.com`
- **From Name** : `ZaLaMa`
- **Domaine** : `zalamagn.com`

### Utilisation :

```typescript
import { resendEmailService } from '@/services/resendEmailService';

// Envoyer un email de réinitialisation
const result = await resendEmailService.sendForgotPasswordEmail(
  'user@example.com',
  'https://app.zalamagn.com/reset?token=abc123',
  'John Doe'
);

if (result.success) {
  console.log('Email envoyé:', result.messageId);
} else {
  console.error('Erreur:', result.error);
}
```

## 🔐 Sécurité des tokens

### Génération sécurisée :

```typescript
// Token format : UUID-timestamp
const tokenId = crypto.randomUUID();
const timestamp = Date.now().toString();
const resetToken = `${tokenId}-${timestamp}`;

// Hash pour stockage
const resetTokenHash = crypto.createHash('sha256')
  .update(resetToken)
  .digest('hex');
```

### Caractéristiques de sécurité :

- **UUID** : 128 bits d'aléatoire
- **Timestamp** : Unicité temporelle
- **Hash SHA256** : Stockage sécurisé
- **Expiration** : 1 heure par défaut
- **Usage unique** : Tokens marqués comme utilisés

## 🧹 Nettoyage automatique

### Script de nettoyage :

```sql
-- Nettoyer les tokens expirés et utilisés
SELECT * FROM cleanup_expired_tokens();

-- Voir les statistiques
SELECT * FROM get_token_statistics();

-- Nettoyer un utilisateur spécifique
SELECT * FROM cleanup_user_tokens('user@example.com');
```

### Configuration cron (optionnel) :

```bash
# Ajouter au crontab pour nettoyage automatique
0 */6 * * * psql -d votre_base -c "SELECT cleanup_expired_tokens();"
```

## 📊 Monitoring et logs

### Logs automatiques :

```typescript
// Exemples de logs générés
🔐 Demande de réinitialisation pour: user@example.com
🔒 Token de réinitialisation généré: { userId: "...", expiresAt: "..." }
📧 Envoi email mot de passe oublié via Resend: user@example.com
✅ Email envoyé avec succès via Resend: { messageId: "...", to: "..." }
```

### Dashboard Resend :

- **Analytics** : Taux de livraison, ouverture, clics
- **Logs** : Historique des envois
- **Domain** : Statut de vérification

## 🚨 Dépannage

### Problèmes courants :

1. **Erreur d'authentification Resend** :
   ```bash
   # Vérifier la clé API
   echo $RESEND_API_KEY
   
   # Tester la connexion
   node test-resend-integration.js
   ```

2. **Domaine non vérifié** :
   ```bash
   # Vérifier les enregistrements DNS
   nslookup zalamagn.com
   dig TXT zalamagn.com
   ```

3. **Token invalide** :
   ```sql
   -- Vérifier les tokens en base
   SELECT * FROM password_reset_tokens 
   WHERE user_id = 'user-uuid';
   ```

4. **Email non reçu** :
   ```bash
   # Vérifier les logs Resend
   # Dashboard Resend → Logs
   # Vérifier le dossier spam
   ```

### Commandes de débogage :

```bash
# Test complet de l'intégration
node test-resend-integration.js

# Test de l'API
curl -X POST http://localhost:3000/api/auth/send-reset-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Vérifier la base de données
psql -d votre_base -c "SELECT * FROM get_token_statistics();"
```

## 📈 Optimisations

### Performance :

1. **Cache des templates** : Templates pré-compilés
2. **Envoi asynchrone** : Non-bloquant
3. **Retry automatique** : En cas d'échec
4. **Rate limiting** : Protection contre l'abus

### Sécurité :

1. **Validation stricte** : Email et tokens
2. **Expiration courte** : 1 heure maximum
3. **Logs de sécurité** : Traçabilité complète
4. **Nettoyage automatique** : Tokens expirés

## ✅ Checklist de validation

- [ ] Compte Resend créé
- [ ] Domaine `zalamagn.com` vérifié
- [ ] Clé API générée et configurée
- [ ] Variables d'environnement définies
- [ ] Table `password_reset_tokens` créée
- [ ] Service email testé
- [ ] API fonctionnelle
- [ ] Nettoyage automatique configuré
- [ ] Monitoring activé

## 🎉 Résultat final

Une intégration Resend complète et sécurisée pour ZaLaMa avec :
- ✅ Envoi d'emails transactionnels via Resend
- ✅ Tokens de réinitialisation sécurisés
- ✅ Nettoyage automatique des tokens expirés
- ✅ Monitoring et logs complets
- ✅ Configuration optimisée pour la production

**L'intégration Resend est prête pour la production !** 🚀 