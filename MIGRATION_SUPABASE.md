# Migration de Firebase vers Supabase

## Vue d'ensemble

Ce projet a été migré de Firebase vers Supabase tout en conservant la même logique métier et les mêmes fonctionnalités.

## Changements effectués

### 1. Configuration de base

- **Remplacement** : `src/lib/firebase.ts` → `src/lib/supabase.ts`
- **Nouveau client** : Configuration Supabase avec types TypeScript
- **Variables d'environnement** : Mise à jour des clés d'API

### 2. Authentification

- **Firebase Auth** → **Supabase Auth**
- **Context mis à jour** : `src/contexts/AuthContext.tsx`
- **Même logique** : Connexion, inscription, déconnexion, récupération de mot de passe
- **Gestion des sessions** : Via cookies Supabase

### 3. Base de données

- **Firestore** → **PostgreSQL (Supabase)**
- **Schéma adapté** : Tables correspondant au schéma fourni
- **Relations** : Clés étrangères et contraintes PostgreSQL
- **RLS** : Row Level Security activé

### 4. API Routes

- **Middleware** : `src/middleware/auth.ts` mis à jour
- **API Routes** : Toutes les routes utilisent maintenant Supabase
  - `/api/auth/me`
  - `/api/salary-advance/request`
  - `/api/partenaires/[id]`
  - `/api/partnership` - Formulaire de partenariat migré

### 5. Formulaire de partenariat

- **Processus** : Le formulaire crée un partenaire avec `actif: false` dans la table `partners`
- **API route** : `/api/partnership` migrée vers Supabase
- **Types** : Utilise les types existants de la table `partners`
- **Formulaire multi-étapes** : 3 étapes avec validation progressive
- **Nouveaux champs** : 
  - Informations entreprise (nom, raison sociale, RCCM, NIF, domaine d'activité)
  - Informations représentant (nom, fonction, email, téléphone)
  - Informations RH (nom, email, téléphone)
  - Informations employés (nombre, masse salariale, CDI/CDD, date de paiement)
- **Fonctionnalités conservées** :
  - Validation des données
  - Envoi d'emails (admin + utilisateur)
  - Interface utilisateur inchangée
  - Logique métier identique
  - Processus d'activation par l'admin

### 6. Types TypeScript

- **Mise à jour** : `src/types/employe.ts` et `src/types/partenaire.ts`
- **Correspondance** : Types alignés sur le schéma Supabase
- **Compatibilité** : Interface `UserWithEmployeData` maintenue

## Schéma de base de données

Le schéma Supabase comprend :

### Tables principales
- `users` : Utilisateurs authentifiés
- `partners` : Entreprises partenaires (actives et inactives)
- `employees` : Employés des partenaires
- `financial_transactions` : Transactions financières (avances sur salaire)
- `services` : Services proposés
- `alerts` : Alertes système
- `notifications` : Notifications utilisateurs

### Fonctionnalités
- **RLS** : Sécurité au niveau des lignes
- **Triggers** : Mise à jour automatique des statistiques
- **Vues** : Vues pour les rapports
- **Index** : Optimisation des performances

## Configuration requise

### Variables d'environnement

```env
# Supabase
NEXT_PRIVATE_SUPABASE_URL=your_supabase_project_url
NEXT_PRIVATE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (emails)
RESEND_API_KEY=your_resend_api_key

# Base URL
NEXT_PRIVATE_BASE_URL=http://localhost:3000
```

### Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer Supabase** :
   - Créer un projet Supabase
   - Exécuter le script SQL fourni
   - Copier les clés d'API

3. **Variables d'environnement** :
   - Copier `env.example` vers `.env.local`
   - Remplir les valeurs

## Fonctionnalités conservées

### ✅ Authentification
- Connexion/inscription
- Récupération de mot de passe
- Gestion des sessions
- Protection des routes

### ✅ Avances sur salaire
- Demande d'avance
- Validation des limites (25% du salaire)
- Historique des transactions
- Notifications par email

### ✅ Gestion des partenaires
- Informations des entreprises
- Employés associés
- Statistiques et rapports
- Gestion des contacts RH

### ✅ Formulaire de partenariat
- Demande de partenariat (création d'un partenaire inactif)
- Validation des données
- Envoi d'emails automatiques
- Stockage en base de données
- Interface utilisateur moderne
- Processus d'activation par l'admin
- Gestion des étapes (inactif → actif)

### ✅ Interface utilisateur
- Dashboard utilisateur
- Profils employés
- Graphiques et visualisations
- Design system complet

## Avantages de la migration

### Performance
- **PostgreSQL** : Base de données relationnelle robuste
- **Index optimisés** : Requêtes plus rapides
- **RLS** : Sécurité native

### Développement
- **SQL natif** : Requêtes plus flexibles
- **Types TypeScript** : Meilleure sécurité de type
- **API REST** : Interface standardisée

### Maintenance
- **Open source** : Pas de dépendance à Google
- **Documentation** : Excellente documentation
- **Communauté** : Support actif

## Script SQL

Le script SQL complet est fourni dans le fichier de schéma et inclut :
- Création des tables
- Types ENUM
- Index de performance
- Contraintes de validation
- Triggers automatiques
- Vues pour les rapports
- RLS (Row Level Security)
- Données de test

## Déploiement

1. **Supabase** : Déployer le schéma
2. **Vercel/Netlify** : Déployer l'application
3. **Variables** : Configurer les variables d'environnement
4. **Domaines** : Configurer les domaines autorisés

## Support

Pour toute question sur la migration :
- Documentation Supabase : https://supabase.com/docs
- Issues GitHub : Créer une issue dans le projet
- Discord Supabase : Communauté active 