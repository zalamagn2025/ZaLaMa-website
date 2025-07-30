# Configuration de la Table Contacts

## 🎯 Objectif
Créer la table `contacts` dans Supabase pour rendre fonctionnel l'envoi d'email depuis le formulaire de contact.

## 📋 Étapes de Configuration

### 1. Création de la Table dans Supabase

#### Option A : Via l'éditeur SQL de Supabase (Recommandé - 2 minutes)
1. Connectez-vous à votre dashboard Supabase
2. Allez dans **SQL Editor** (dans le menu de gauche)
3. Copiez tout le contenu du fichier `scripts/create-contacts-table.sql`
4. Collez dans l'éditeur SQL
5. Cliquez sur "Run"

#### Option B : Via le script Node.js
```bash
# Installer les dépendances si nécessaire
npm install @supabase/supabase-js dotenv

# Exécuter le script
node scripts/setup-contacts-table.js
```

### 2. Vérification de la Configuration

Après l'exécution, vous devriez voir :
- ✅ Table `contacts` créée
- ✅ 3 messages de test insérées
- ✅ Contraintes de validation actives
- ✅ RLS (Row Level Security) activé

### 3. Structure de la Table

#### Champs du Message
- `id` - Identifiant unique (UUID)
- `nom` - Nom du contact
- `prenom` - Prénom du contact
- `email` - Email du contact
- `sujet` - Sujet du message
- `message` - Contenu du message
- `date_creation` - Date de création
- `statut` - Statut du message (nouveau, lu, repondu, archive)

### 4. Configuration Email

L'API `/api/contact` est déjà configurée pour :
- ✅ Envoyer les emails à `support@zalamagn.com`
- ✅ Stocker les messages dans la table `contacts`
- ✅ Valider les données avant envoi
- ✅ Gérer les erreurs et les réponses

### 5. Variables d'environnement requises

Assurez-vous que ces variables sont définies dans votre `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (pour l'envoi d'emails)
RESEND_API_KEY=your_resend_api_key
```

## 🚀 Test du Formulaire

Une fois la table créée :

1. **Allez sur la page Contact** : `/contact`
2. **Remplissez le formulaire** avec vos informations
3. **Cliquez sur "Envoyer le message"**
4. **Vérifiez** :
   - ✅ Message de succès affiché
   - ✅ Email reçu à `support@zalamagn.com`
   - ✅ Message stocké dans la table `contacts`

## 📧 Format de l'Email

L'email reçu contiendra :
- **Informations du contact** : Nom, prénom, email, sujet
- **Message** : Contenu du message formaté
- **ID Contact** : Pour le suivi dans Supabase
- **Reply-To** : Email du contact pour répondre directement

## 🔧 Dépannage

### Erreur "Table contacts does not exist"
- Exécutez le script SQL dans Supabase
- Vérifiez que la table a été créée

### Erreur "Resend API key not found"
- Vérifiez que `RESEND_API_KEY` est définie dans `.env.local`
- Vérifiez que la clé est valide

### Email non reçu
- Vérifiez les spams
- Vérifiez la configuration Resend
- Consultez les logs de l'API

## ✅ Résultat Final

Après configuration :
- ✅ Formulaire de contact fonctionnel
- ✅ Emails envoyés à `support@zalamagn.com`
- ✅ Messages stockés dans Supabase
- ✅ Interface utilisateur réactive
- ✅ Gestion des erreurs complète 