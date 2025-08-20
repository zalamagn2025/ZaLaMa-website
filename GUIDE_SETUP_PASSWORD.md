# Guide de Déploiement - Système de Définition de Mot de Passe ZaLaMa

## 📋 Vue d'ensemble

Ce guide décrit le déploiement et l'utilisation du nouveau système de définition de mot de passe pour les employés ZaLaMa. Ce système permet aux employés de définir leur mot de passe lors de la création de leur compte via un lien sécurisé.

## 🏗️ Architecture

### Composants créés

1. **Page publique** : `/setup-password` - Interface utilisateur
2. **API route** : `/api/employees/setup-password` - Backend sécurisé
3. **Base de données** : Nouvelles colonnes dans la table `employees`
4. **Intégration** : Mise à jour de la page de connexion

### Flux utilisateur

```
1. Création employé → 2. Génération token → 3. Envoi email/SMS → 4. Page publique → 5. Définition mot de passe → 6. Activation compte
```

## 🚀 Déploiement

### 1. Base de Données

Exécuter le script SQL pour ajouter les colonnes nécessaires :

```bash
# Dans votre dashboard Supabase SQL Editor
# Copier et exécuter le contenu de scripts/setup_password_columns.sql
```

**Colonnes ajoutées :**
- `activation_token` : Token unique pour l'activation
- `password_hash` : Hash du mot de passe avec salt
- `password_set` : Indicateur si le mot de passe est défini

### 2. Déploiement de l'Application

```bash
# Vérifier que tous les fichiers sont présents
ls src/app/setup-password/page.tsx
ls src/components/auth/SetupPasswordForm.tsx
ls src/app/api/employees/setup-password/route.ts

# Déployer l'application
npm run build
npm run start
```

### 3. Variables d'Environnement

Vérifier que les variables suivantes sont configurées :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_supabase
```

## 🧪 Tests

### Tests automatiques

```bash
# Exécuter les tests de l'API
node test-setup-password.js
```

### Tests manuels

1. **Créer un employé de test** via l'Edge Function `partner-auth`
2. **Récupérer le token** généré dans la réponse
3. **Tester la page** : `https://votre-domaine.com/setup-password?token=TOKEN`
4. **Vérifier l'activation** du compte

## 📱 Utilisation

### Pour les employés

1. **Réception du lien** : L'employé reçoit un email/SMS avec le lien
2. **Accès à la page** : Cliquer sur le lien pour accéder à la page de définition
3. **Définition du mot de passe** : Saisir et confirmer le mot de passe
4. **Activation** : Le compte est automatiquement activé
5. **Connexion** : Redirection vers la page de connexion

### Pour les administrateurs

1. **Création d'employé** : Utiliser l'Edge Function `partner-auth`
2. **Envoi des notifications** : Email/SMS automatique avec le lien
3. **Suivi** : Vérifier dans la base de données que `password_set = true`

## 🔒 Sécurité

### Mesures implémentées

- **Token unique** : Généré avec UUID + timestamp + random
- **Consommation** : Token supprimé après utilisation
- **Validation** : Vérification avant affichage du formulaire
- **Hashage** : Mot de passe hashé avec salt SHA-256
- **HTTPS** : Toutes les communications chiffrées

### Protection contre

- **Attaques par force brute** : Token complexe et unique
- **Token reuse** : Consommation immédiate après utilisation
- **XSS** : Validation côté serveur
- **CSRF** : Token unique par session

## 🐛 Dépannage

### Problèmes courants

#### 1. Token invalide
```
Erreur : "Token invalide ou expiré"
Solution : Vérifier que le token existe dans la base de données
```

#### 2. Page non accessible
```
Erreur : Page 404
Solution : Vérifier le déploiement de /setup-password
```

#### 3. Erreur de base de données
```
Erreur : "Erreur interne du serveur"
Solution : Vérifier les variables d'environnement Supabase
```

#### 4. Mot de passe non défini
```
Erreur : "Ce compte a déjà été activé"
Solution : Vérifier la colonne password_set dans la base de données
```

### Logs à surveiller

- **Création employé** : Edge Function `partner-auth`
- **Validation token** : API `/api/employees/setup-password`
- **Définition mot de passe** : API POST `/api/employees/setup-password`
- **Erreurs** : Console du navigateur et logs serveur

## 📊 Monitoring

### Métriques à surveiller

- **Taux de création** : Nombre d'employés créés
- **Taux d'activation** : Nombre de comptes activés
- **Taux d'échec** : Erreurs lors de l'activation
- **Temps d'activation** : Délai entre création et activation

### Requêtes SQL utiles

```sql
-- Employés avec mot de passe défini
SELECT COUNT(*) FROM employees WHERE password_set = true;

-- Employés en attente d'activation
SELECT COUNT(*) FROM employees WHERE password_set = false AND activation_token IS NOT NULL;

-- Token expirés (plus de 7 jours)
SELECT * FROM employees 
WHERE activation_token IS NOT NULL 
AND created_at < NOW() - INTERVAL '7 days';
```

## 🔄 Intégration avec l'existant

### Edge Function `partner-auth`

La fonction existante doit être mise à jour pour :

1. **Générer le token** : `activation_token`
2. **Envoyer le lien** : `https://zalamagn.com/setup-password?token=...`
3. **Mettre à jour la base** : Ajouter les nouvelles colonnes

### Page de connexion

La page de connexion a été mise à jour pour :

1. **Afficher le message de succès** : Après activation du compte
2. **Rediriger correctement** : Depuis la page de définition

## 📝 Maintenance

### Nettoyage périodique

```sql
-- Supprimer les tokens expirés (plus de 30 jours)
UPDATE employees 
SET activation_token = NULL 
WHERE activation_token IS NOT NULL 
AND created_at < NOW() - INTERVAL '30 days';
```

### Sauvegarde

- **Base de données** : Sauvegarde automatique Supabase
- **Code** : Versioning Git
- **Configuration** : Variables d'environnement documentées

## 🆘 Support

### Contact

Pour toute question technique :
- **Logs** : Vérifier les logs Supabase
- **Base de données** : Dashboard Supabase
- **Application** : Logs de l'application Next.js

### Documentation

- **API** : `/api/employees/setup-password`
- **Page** : `/setup-password`
- **Tests** : `test-setup-password.js`
- **Scripts** : `scripts/setup_password_columns.sql`

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Auteur** : Équipe ZaLaMa
