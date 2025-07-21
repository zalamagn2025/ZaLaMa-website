# Guide : Gestion de la Première Connexion et Changement de Mot de Passe

## 📋 Vue d'ensemble

Cette fonctionnalité permet de détecter automatiquement la première connexion d'un utilisateur et de l'obliger à changer son mot de passe avant d'accéder à l'application. Le système utilise le champ `require_password_change` de la table `admin_users` pour gérer cet état.

## 🏗️ Architecture

### Tables de base de données

#### Table `admin_users`
```sql
CREATE TABLE public.admin_users (
  id uuid not null,
  email character varying(255) not null,
  display_name character varying(200) not null,
  role public.admin_role not null default 'user'::admin_role,
  partenaire_id uuid null,
  active boolean null default true,
  last_login timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  require_password_change boolean null default true,
  constraint admin_users_pkey primary key (id),
  constraint admin_users_email_key unique (email)
);
```

**Champ clé :** `require_password_change` (boolean, défaut: `true`)
- `true` : L'utilisateur doit changer son mot de passe
- `false` : L'utilisateur a déjà changé son mot de passe

### APIs

#### 1. `/api/auth/check-first-login` (GET)
Vérifie si l'utilisateur doit changer son mot de passe.

**Réponse :**
```json
{
  "requirePasswordChange": true,
  "message": "Première connexion détectée"
}
```

#### 2. `/api/auth/change-password` (POST)
Change le mot de passe de l'utilisateur et met à jour le statut.

**Corps de la requête :**
```json
{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe"
}
```

#### 3. `/api/auth/mark-password-changed` (POST)
Marque explicitement que le mot de passe a été changé.

## 🎨 Interface utilisateur

### Modal de première connexion

Le modal `FirstLoginPasswordModal` s'affiche automatiquement lors de la première connexion avec :

- **Style identique** à l'interface de connexion
- **Champs requis :**
  - Mot de passe actuel
  - Nouveau mot de passe
  - Confirmation du nouveau mot de passe
- **Validations :**
  - Minimum 8 caractères
  - Mots de passe différents
  - Confirmation identique
- **Animations** et **effets visuels** cohérents

## 🔧 Installation et configuration

### 1. Créer la table admin_users

Exécutez le script SQL :
```bash
# Dans votre base de données Supabase
psql -h your-supabase-host -U postgres -d postgres -f scripts/create-admin-users-table.sql
```

### 2. Ajouter un utilisateur de test

```sql
INSERT INTO public.admin_users (
  id,
  email,
  display_name,
  role,
  active,
  require_password_change
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Utilisateur Test',
  'user',
  true,
  true
);
```

### 3. Tester la fonctionnalité

```bash
# Tester le flux complet
node test-first-login.js
```

## 🔄 Flux utilisateur

### 1. Première connexion
1. L'utilisateur se connecte avec ses identifiants initiaux
2. Le système vérifie `require_password_change` dans `admin_users`
3. Si `true`, le modal de changement de mot de passe s'affiche
4. L'utilisateur ne peut pas accéder à l'application sans changer son mot de passe

### 2. Changement de mot de passe
1. L'utilisateur saisit son mot de passe actuel
2. Il saisit un nouveau mot de passe (minimum 8 caractères)
3. Il confirme le nouveau mot de passe
4. Le système valide et change le mot de passe
5. Le champ `require_password_change` est mis à `false`
6. L'utilisateur accède à l'application

### 3. Connexions suivantes
1. L'utilisateur se connecte avec son nouveau mot de passe
2. Le système vérifie `require_password_change`
3. Si `false`, accès normal à l'application
4. Aucun modal ne s'affiche

## 🛠️ Intégration dans l'application

### Page de profil

La page `/profile` intègre automatiquement la vérification :

```typescript
// Vérification de la première connexion
useEffect(() => {
  const checkFirstLogin = async () => {
    if (!isAuthenticated || hasCheckedFirstLogin) return;
    
    const response = await fetch('/api/auth/check-first-login');
    const data = await response.json();
    
    if (data.requirePasswordChange) {
      setShowFirstLoginModal(true);
    }
  };

  checkFirstLogin();
}, [isAuthenticated, hasCheckedFirstLogin]);
```

### Modal de changement de mot de passe

```typescript
<FirstLoginPasswordModal
  isOpen={showFirstLoginModal}
  onClose={() => setShowFirstLoginModal(false)}
  onSuccess={handleFirstLoginSuccess}
/>
```

## 🔒 Sécurité

### Politiques RLS (Row Level Security)

```sql
-- Permettre aux utilisateurs de voir leurs propres données
CREATE POLICY "Users can view their own admin data" ON public.admin_users
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Permettre aux utilisateurs de mettre à jour leur propre statut
CREATE POLICY "Users can update their own password status" ON public.admin_users
  FOR UPDATE USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');
```

### Validation des mots de passe

- **Longueur minimale :** 8 caractères
- **Vérification de l'ancien mot de passe** avant changement
- **Différence obligatoire** entre ancien et nouveau mot de passe
- **Confirmation** du nouveau mot de passe

## 🧪 Tests

### Test manuel

1. **Créer un utilisateur** avec `require_password_change = true`
2. **Se connecter** avec les identifiants initiaux
3. **Vérifier** que le modal s'affiche
4. **Changer le mot de passe** via le modal
5. **Vérifier** que `require_password_change = false`
6. **Se reconnecter** avec le nouveau mot de passe
7. **Vérifier** qu'aucun modal ne s'affiche

### Test automatisé

```bash
# Exécuter le script de test
node test-first-login.js
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Modal ne s'affiche pas
- **Vérifier** que l'utilisateur existe dans `admin_users`
- **Vérifier** que `require_password_change = true`
- **Vérifier** les logs de l'API `/api/auth/check-first-login`

#### 2. Erreur lors du changement de mot de passe
- **Vérifier** que l'ancien mot de passe est correct
- **Vérifier** que le nouveau mot de passe respecte les critères
- **Vérifier** les logs de l'API `/api/auth/change-password`

#### 3. Table admin_users non accessible
- **Exécuter** le script `create-admin-users-table.sql`
- **Vérifier** les politiques RLS
- **Vérifier** les permissions Supabase

### Logs utiles

```javascript
// Dans la console du navigateur
console.log('🔍 Vérification de la première connexion...');
console.log('✅ Statut première connexion:', data.requirePasswordChange);
console.log('🔑 Première connexion détectée, affichage du modal');
```

## 📝 Notes importantes

1. **Le champ `require_password_change`** est défini à `true` par défaut pour tous les nouveaux utilisateurs
2. **Le modal est obligatoire** - l'utilisateur ne peut pas le fermer sans changer son mot de passe
3. **Le style du modal** est identique à l'interface de connexion pour la cohérence
4. **La vérification** se fait automatiquement sur la page de profil
5. **Les APIs** sont sécurisées avec authentification Supabase

## 🔄 Mise à jour

Pour modifier le comportement :

1. **Changer les validations** dans `FirstLoginPasswordModal.tsx`
2. **Modifier les APIs** dans `/api/auth/`
3. **Ajuster les politiques RLS** si nécessaire
4. **Tester** avec le script de test
5. **Documenter** les changements

---

**Auteur :** Équipe ZaLaMa  
**Date :** 2024  
**Version :** 1.0 