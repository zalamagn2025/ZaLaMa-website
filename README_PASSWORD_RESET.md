# 🔐 Système de Réinitialisation de Mot de Passe - ZaLaMa

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation et Configuration](#installation-et-configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Base de Données](#base-de-données)
- [Sécurité](#sécurité)
- [Dépannage](#dépannage)
- [Maintenance](#maintenance)

## 🎯 Vue d'ensemble

Le système de réinitialisation de mot de passe de ZaLaMa permet aux employés de réinitialiser leur mot de passe de manière sécurisée via un lien envoyé par email.

### Fonctionnalités

- ✅ **Demande de réinitialisation** via email
- ✅ **Génération de tokens sécurisés** avec expiration
- ✅ **Vérification automatique** des tokens
- ✅ **Interface utilisateur moderne** et responsive
- ✅ **Intégration Supabase Auth** pour la gestion des mots de passe
- ✅ **Système de logs** pour le suivi et la sécurité

## 🏗️ Architecture

### Flux de Données

```
1. Demande → 2. Génération Token → 3. Envoi Email → 4. Clic Lien → 5. Vérification → 6. Réinitialisation → 7. Confirmation
```

### Composants

- **Frontend** : Next.js avec React et Tailwind CSS
- **Backend** : API Routes Next.js
- **Base de données** : Supabase PostgreSQL
- **Email** : Service Resend
- **Authentification** : Supabase Auth

## ⚙️ Installation et Configuration

### Prérequis

- Node.js 18+
- Compte Supabase
- Compte Resend
- Base de données PostgreSQL

### Variables d'Environnement

Créez un fichier `.env.local` :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key

# Base URL de l'application
NEXT_PUBLIC_APP_URL=https://zalamagn.com

# JWT Secret
JWT_SECRET=your_jwt_secret
```

### Installation des Dépendances

```bash
npm install
```

### Configuration de la Base de Données

Exécutez le script SQL dans Supabase :

```sql
-- Créer la table password_reset_tokens
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id 
ON public.password_reset_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash 
ON public.password_reset_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires 
ON public.password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used 
ON public.password_reset_tokens(used);
```

### Démarrage

```bash
npm run dev
```

## 🚀 Utilisation

### Pour l'Utilisateur

1. **Accéder à la page de connexion**
   ```
   https://zalamagn.com/login
   ```

2. **Cliquer sur "Mot de passe oublié ?"**

3. **Saisir l'adresse email**
   - L'email doit exister dans la table `employees`

4. **Cliquer sur "Envoyer le lien de réinitialisation"**

5. **Vérifier l'email**
   - Consulter la boîte de réception
   - Vérifier les dossiers spam/promotions

6. **Cliquer sur le lien de réinitialisation**
   - Le lien expire après 1 heure

7. **Saisir le nouveau mot de passe**
   - Minimum 8 caractères
   - Confirmer le mot de passe

8. **Cliquer sur "Réinitialiser le mot de passe"**

9. **Redirection automatique vers la page de connexion**

### Pour l'Administrateur

#### Vérification des Logs

Les logs sont disponibles dans la console du serveur :

```bash
# Logs de demande de réinitialisation
🔐 Demande de réinitialisation pour: user@example.com

# Logs de génération de token
🔒 Token de réinitialisation généré: {
  userId: 'uuid',
  email: 'user@example.com',
  expiresAt: '2025-07-31T12:00:00.000Z',
  tokenHash: 'abc123...',
  messageId: 'msg_123'
}

# Logs de réinitialisation réussie
✅ Mot de passe réinitialisé avec succès pour: user@example.com
```

#### Nettoyage des Tokens Expirés

Exécuter périodiquement :

```sql
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() 
AND used = false;
```

## 🔌 API Endpoints

### 1. Envoi d'Email de Réinitialisation

**Endpoint :** `POST /api/auth/send-reset-email`

**Corps de la requête :**
```json
{
  "email": "user@example.com"
}
```

**Réponse :**
```json
{
  "message": "Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.",
  "success": true
}
```

### 2. Vérification de Token

**Endpoint :** `POST /api/auth/verify-reset-code`

**Corps de la requête :**
```json
{
  "token": "uuid-timestamp",
  "email": "user@example.com"
}
```

**Réponse :**
```json
{
  "message": "Token de réinitialisation valide",
  "valid": true,
  "email": "user@example.com"
}
```

### 3. Réinitialisation du Mot de Passe

**Endpoint :** `POST /api/auth/reset-password`

**Corps de la requête :**
```json
{
  "token": "uuid-timestamp",
  "email": "user@example.com",
  "newPassword": "nouveauMotDePasse123"
}
```

**Réponse :**
```json
{
  "message": "Mot de passe réinitialisé avec succès",
  "success": true
}
```

## 🗄️ Base de Données

### Table `password_reset_tokens`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique du token |
| `user_id` | UUID | Référence vers l'employé |
| `token_hash` | VARCHAR(255) | Hash SHA256 du token |
| `expires_at` | TIMESTAMP | Date d'expiration |
| `used` | BOOLEAN | Indique si le token a été utilisé |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

### Relations

- `user_id` → `employees.id` (CASCADE DELETE)

### Index

- `idx_password_reset_tokens_user_id` : Optimise les recherches par utilisateur
- `idx_password_reset_tokens_hash` : Optimise les recherches par hash
- `idx_password_reset_tokens_expires` : Optimise le nettoyage des tokens expirés
- `idx_password_reset_tokens_used` : Optimise le filtrage des tokens utilisés

## 🔒 Sécurité

### Mesures de Sécurité

1. **Tokens Uniques**
   - Génération avec UUID + timestamp
   - Impossibilité de collision

2. **Hachage SHA256**
   - Stockage sécurisé des tokens
   - Protection contre les fuites de données

3. **Expiration Automatique**
   - Tokens valides 1 heure maximum
   - Nettoyage automatique des tokens expirés

4. **Usage Unique**
   - Chaque token ne peut être utilisé qu'une fois
   - Protection contre la réutilisation

5. **Validation Complète**
   - Vérification de l'existence de l'utilisateur
   - Validation de l'email
   - Contrôle de l'expiration

6. **Messages d'Erreur Génériques**
   - Ne révèle pas l'existence d'un compte
   - Protection contre l'énumération d'emails

### Bonnes Pratiques

- ✅ Utilisation de HTTPS en production
- ✅ Validation des entrées utilisateur
- ✅ Gestion des erreurs sécurisée
- ✅ Logs de sécurité
- ✅ Nettoyage régulier des tokens expirés

## 🔧 Dépannage

### Problèmes Courants

#### 1. Email non reçu

**Causes possibles :**
- Email dans les spams
- Configuration Resend incorrecte
- Email inexistant dans la base

**Solutions :**
```bash
# Vérifier les logs du serveur
# Vérifier la configuration Resend
# Ajouter l'email aux contacts
```

#### 2. Lien invalide

**Causes possibles :**
- Token expiré
- Token déjà utilisé
- URL malformée

**Solutions :**
```bash
# Demander un nouveau lien
# Vérifier la configuration NEXT_PUBLIC_APP_URL
# Vérifier les logs d'erreur
```

#### 3. Erreur de base de données

**Causes possibles :**
- Table `password_reset_tokens` inexistante
- Contraintes de clé étrangère
- Permissions insuffisantes

**Solutions :**
```sql
-- Vérifier l'existence de la table
SELECT * FROM information_schema.tables 
WHERE table_name = 'password_reset_tokens';

-- Vérifier les contraintes
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'password_reset_tokens';
```

### Logs de Débogage

#### Activation des Logs Détaillés

Dans les fichiers API, les logs sont automatiquement activés :

```typescript
console.log('🔐 Demande de réinitialisation pour:', email);
console.log('🔒 Token de réinitialisation généré:', tokenData);
console.log('✅ Email envoyé avec succès pour:', email);
```

#### Vérification des Logs

```bash
# Dans le terminal du serveur
npm run dev

# Observer les logs en temps réel
# Rechercher les erreurs avec ❌
# Vérifier les succès avec ✅
```

## 🛠️ Maintenance

### Tâches Régulières

#### 1. Nettoyage des Tokens Expirés

Exécuter quotidiennement :

```sql
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() 
AND used = false;
```

#### 2. Vérification des Logs

Analyser les logs pour :
- Détecter les tentatives d'abus
- Identifier les problèmes récurrents
- Surveiller les performances

#### 3. Mise à Jour des Dépendances

```bash
npm update
npm audit fix
```

### Monitoring

#### Métriques à Surveiller

- Nombre de demandes de réinitialisation
- Taux de succès des envois d'email
- Temps de réponse des API
- Nombre de tokens expirés

#### Alertes

Configurer des alertes pour :
- Taux d'erreur élevé
- Temps de réponse anormal
- Nombre de tokens expirés important

## 📞 Support

### Contact

Pour toute question ou problème :
- **Email** : support@zalamagn.com
- **Documentation** : Ce fichier README
- **Logs** : Console du serveur

### Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Resend](https://resend.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

---

**Version :** 1.0.0  
**Dernière mise à jour :** 31 Juillet 2025  
**Auteur :** Équipe ZaLaMa 