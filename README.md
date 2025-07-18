# ZaLaMa - Plateforme Fintech d'Avances sur Salaire

## 🚀 Vue d'ensemble

ZaLaMa est une plateforme fintech moderne qui propose des **avances sur salaire** pour les employés. C'est une solution B2B qui connecte les entreprises partenaires et leurs employés, permettant à ces derniers d'accéder à leurs salaires de manière anticipée.

## 🏗️ Architecture technique

### Stack technologique
- **Frontend** : Next.js 15 (App Router), React 19, TypeScript
- **Backend** : API Routes Next.js + Supabase
- **Base de données** : PostgreSQL (Supabase)
- **Authentification** : Supabase Auth
- **Styling** : Tailwind CSS 4 avec design system personnalisé
- **Animations** : Framer Motion
- **UI Components** : Radix UI + composants personnalisés
- **Emails** : Resend

### Structure du projet
```
src/
├── app/                 # App Router Next.js
│   ├── api/            # API Routes
│   ├── auth/           # Pages d'authentification
│   ├── profile/        # Profil utilisateur
│   └── ...
├── components/         # Composants React
│   ├── ui/            # Composants UI de base
│   ├── sections/      # Sections de pages
│   ├── dashboard/     # Composants dashboard
│   └── ...
├── contexts/          # Contextes React (Auth)
├── lib/              # Utilitaires et config Supabase
├── types/            # Types TypeScript
└── hooks/            # Hooks personnalisés
```

## 🎨 Design et UX

### Charte graphique
- **Couleur principale** : Orange ZaLaMa (#FF671E)
- **Couleurs secondaires** : Bleus (#3b82f6, #2563eb)
- **Thème** : Support du mode sombre/clair
- **Typographie** : DM Sans (Google Fonts)

### Interface utilisateur
- Design moderne avec animations fluides
- Composants réutilisables (Radix UI + shadcn/ui)
- Responsive design complet
- Effets visuels sophistiqués

## 🔐 Fonctionnalités principales

### Authentification
- Connexion/inscription sécurisée
- Récupération de mot de passe
- Gestion des rôles (Employé, Manager, Admin)
- Protection des routes avec middleware

### Avances sur salaire
- **Demande d'avance** : Formulaire avec validation
- **Limites** : 25% du salaire net mensuel maximum
- **Validation** : Vérification des limites et historique
- **Statuts** : En attente, Validé, Rejeté
- **Notifications** : Emails automatiques

### Dashboard et analytics
- Statistiques générales
- Graphiques de performance
- Activité par partenaires/services
- Alertes et risques
- Données utilisateurs

### Gestion des partenaires
- Informations des entreprises
- Employés associés
- Statistiques et rapports
- Gestion des contacts RH

## 🗄️ Base de données (Supabase)

### Tables principales
- `users` : Utilisateurs authentifiés
- `partners` : Entreprises partenaires
- `employees` : Employés des partenaires
- `financial_transactions` : Transactions financières
- `services` : Services proposés
- `alerts` : Alertes système
- `notifications` : Notifications utilisateurs

### Fonctionnalités
- **RLS** : Row Level Security pour la sécurité
- **Triggers** : Mise à jour automatique des statistiques
- **Vues** : Vues pour les rapports
- **Index** : Optimisation des performances

## 🚀 Installation et configuration

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd zalama
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Supabase**
   - Créer un projet Supabase
   - Exécuter le script SQL : `supabase-schema.sql`
   - Copier les clés d'API

4. **Variables d'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Remplir les variables :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PRIVATE_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PRIVATE_BASE_URL=http://localhost:3000
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir l'application**
   ```
   http://localhost:3000
   ```

## 📊 API Routes

### Authentification
- `GET /api/auth/me` - Récupérer les données utilisateur
- `POST /api/auth/forgot-password` - Demande de réinitialisation
- `POST /api/auth/reset-password` - Réinitialisation du mot de passe

### Avances sur salaire
- `POST /api/salary-advance/request` - Créer une demande d'avance
- `GET /api/salary-advance/request` - Récupérer les demandes

### Partenaires
- `GET /api/partenaires/[id]` - Récupérer un partenaire

### Demandes de partenariat
- `POST /api/partnership` - Créer une demande de partenariat (partenaire inactif)
- `GET /api/partnership` - Récupérer tous les partenaires inactifs (admin)
- `GET /api/partnership/[id]` - Récupérer un partenaire spécifique (admin)
- `PUT /api/partnership/[id]` - Activer/rejeter un partenaire (admin)

## 🎯 Fonctionnalités métier

### Flux utilisateur
1. **Inscription** : L'employé s'inscrit avec son email professionnel
2. **Validation** : L'entreprise valide l'employé
3. **Demande d'avance** : L'employé peut demander une avance
4. **Validation** : L'entreprise approuve ou rejette
5. **Paiement** : L'avance est versée

### Règles métier
- **Limite mensuelle** : 25% du salaire net
- **Validation** : Vérification des limites existantes
- **Historique** : Suivi de toutes les transactions
- **Notifications** : Emails automatiques à chaque étape

## 🔧 Développement

### Scripts disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
```

### Structure des composants
- **UI Components** : Composants de base réutilisables
- **Sections** : Sections de pages spécifiques
- **Layout** : Composants de mise en page
- **Dashboard** : Composants pour le tableau de bord

## 📈 Déploiement

### Supabase
1. Créer un projet Supabase
2. Exécuter le script SQL
3. Configurer les variables d'environnement

### Vercel/Netlify
1. Connecter le repository
2. Configurer les variables d'environnement
3. Déployer

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 📞 Support

Pour toute question ou support :
- Documentation : Voir `MIGRATION_SUPABASE.md`
- Issues : Créer une issue sur GitHub
- Email : contact@zalama.com

---

**ZaLaMa** - La fintech des avances sur salaire 🚀
