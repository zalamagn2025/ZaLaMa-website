# Configuration de la Table Partnership Requests

## 🎯 Objectif
Créer une nouvelle table `partnership_requests` dans Supabase pour gérer les demandes de partenariat via le formulaire `/partnership/formulaire`.

## 📋 Étapes de Configuration

### 1. Création de la Table dans Supabase

#### Option A : Via l'éditeur SQL de Supabase (Recommandé)
1. Connectez-vous à votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Copiez le contenu du fichier `database/partnership_requests.sql`
4. Exécutez le script

#### Option B : Via le script Node.js
```bash
# Installer les dépendances si nécessaire
npm install @supabase/supabase-js dotenv

# Exécuter le script
node scripts/setup-partnership-table.js
```

### 2. Vérification de la Configuration

Après l'exécution, vous devriez voir :
- ✅ Table `partnership_requests` créée
- ✅ 3 demandes de test insérées
- ✅ Contraintes de validation actives
- ✅ RLS (Row Level Security) activé

### 3. Structure de la Table

#### Champs de l'Entreprise (Étape 1)
- `company_name` - Nom de l'entreprise
- `legal_status` - Statut juridique (SARL, SAS, etc.)
- `rccm` - Numéro RCCM
- `nif` - Numéro NIF
- `activity_domain` - Domaine d'activité
- `headquarters_address` - Adresse du siège
- `phone` - Téléphone principal
- `email` - Email principal
- `employees_count` - Nombre d'employés
- `payroll` - Masse salariale
- `cdi_count` - Nombre de CDI
- `cdd_count` - Nombre de CDD
- `payment_date` - Date de paiement

#### Champs du Représentant (Étape 2)
- `rep_full_name` - Nom complet du représentant
- `rep_position` - Fonction du représentant
- `rep_email` - Email du représentant
- `rep_phone` - Téléphone du représentant

#### Champs du Responsable RH (Étape 3)
- `hr_full_name` - Nom complet du responsable RH
- `hr_email` - Email du responsable RH
- `hr_phone` - Téléphone du responsable RH
- `agreement` - Accord d'engagement

#### Métadonnées
- `status` - Statut de la demande (pending, approved, rejected, in_review)
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

### 4. Contraintes de Validation

- ✅ **Emails valides** : Format email vérifié pour tous les emails
- ✅ **Téléphones** : Maximum 20 caractères
- ✅ **Emails uniques** : Tous les emails doivent être différents
- ✅ **Données numériques** : Validation des nombres d'employés
- ✅ **Accord obligatoire** : L'engagement doit être accepté

### 5. Sécurité (RLS)

- 🔒 **Insertion publique** : Le formulaire peut créer des demandes
- 🔒 **Lecture admin** : Seuls les admins peuvent voir les demandes
- 🔒 **Mise à jour admin** : Seuls les admins peuvent modifier les statuts

### 6. Données de Test

3 demandes de test sont automatiquement créées :
1. **Tech Solutions Guinée** - Statut: pending
2. **Agro Business Plus** - Statut: in_review  
3. **Mining Corporation Guinée** - Statut: approved

## 🚀 Test du Formulaire

1. Allez sur `/partnership/formulaire`
2. Remplissez le formulaire en 3 étapes
3. Soumettez la demande
4. Vérifiez dans Supabase que la demande apparaît

## 🔧 API Endpoints

- `POST /api/partnership` - Créer une nouvelle demande
- `GET /api/partnership` - Récupérer les demandes (admin uniquement)

## 📧 Notifications (Optionnel)

L'API est prête pour l'intégration d'emails de notification. Vous pouvez ajouter :
- Email de confirmation à l'entreprise
- Email de notification aux admins
- Email de mise à jour de statut

## 🛠️ Dépannage

### Erreur "Table already exists"
- Normal, la table existe déjà
- Les données de test peuvent être dupliquées

### Erreur de permissions
- Vérifiez que votre `SUPABASE_SERVICE_ROLE_KEY` est correct
- Assurez-vous que RLS est configuré correctement

### Erreur de validation
- Vérifiez que tous les champs requis sont remplis
- Assurez-vous que les emails sont uniques
- Vérifiez le format des emails

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console Supabase
2. Testez l'API avec Postman ou Thunder Client
3. Vérifiez les variables d'environnement dans `.env.local` 