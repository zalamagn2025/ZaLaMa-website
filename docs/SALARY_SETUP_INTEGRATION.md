# 🚀 Intégration du Système de Configuration de Salaire

## 📋 Vue d'ensemble

Ce document décrit l'intégration complète du système de configuration de salaire pour les utilisateurs RH et Responsable dans l'application ZaLaMa. Le système permet aux utilisateurs éligibles de configurer leur salaire net lors de leur première connexion ou quand leur salaire est à zéro.

## 🏗️ Architecture

### **Composants implémentés**

1. **Hook `useSalarySetup`** : Gère la logique de vérification et configuration
2. **Modale `SalarySetupModal`** : Interface utilisateur pour la configuration
3. **Intégration dans le profil** : Affichage automatique de la modale
4. **Edge Function Supabase** : Backend pour la logique métier

### **Flux utilisateur**

```
1. Connexion RH/Responsable → 2. Vérification salaire (0) → 3. Affichage modale → 4. Configuration → 5. Mise à jour DB → 6. Rechargement page
```

## 📁 Fichiers créés/modifiés

### **Nouveaux fichiers**

- `src/hooks/useSalarySetup.ts` - Hook pour la gestion du salaire
- `src/components/modals/SalarySetupModal.tsx` - Modale de configuration
- `scripts/assign-user-role.js` - Script d'assignation de rôle

### **Fichiers modifiés**

- `src/app/profile/page.tsx` - Intégration de la modale
- `src/app/api/salary-setup/check/route.ts` - API route de vérification
- `src/app/api/salary-setup/configure/route.ts` - API route de configuration

## 🎨 Design et UX

### **Style de la modale**

- **Palette de couleurs** : Bleu ZaLaMa (`#010D3E`, `#1A3A8F`, `#3b82f6`)
- **Design cohérent** : Même style que les cards de statistiques du profil
- **Taille compacte** : `max-w-sm` pour une interface mignonne
- **Animations** : Framer Motion pour les transitions fluides

### **Éléments visuels**

- **Icône principale** : DollarSign dans un cercle bleu
- **Badge de rôle** : Affichage du rôle (RH/Responsable) en bleu
- **Nom de l'entreprise** : Affichage de l'entreprise
- **Champs stylisés** : Inputs avec icônes et focus bleu

## 🔧 Fonctionnalités

### **Vérification automatique**

```typescript
// Le hook vérifie automatiquement si l'utilisateur a besoin de configurer son salaire
useEffect(() => {
  if (employee && isAuthenticated) {
    // Vérification via Edge Function Supabase
    checkSalarySetup();
  }
}, [employee, isAuthenticated]);
```

### **Conditions d'affichage**

- ✅ Utilisateur connecté
- ✅ Rôle = 'rh' ou 'responsable'
- ✅ Salaire net = 0 ou null
- ✅ Utilisateur existe dans `admin_users`

### **Validation des données**

- **Salaire net** : Entre 1 et 10 000 000 FG
- **Date d'embauche** : Ne peut pas être dans le futur
- **Poste** : Minimum 2 caractères
- **Type de contrat** : Doit être dans la liste autorisée

### **Types de contrat supportés**

- CDI
- CDD
- Consultant
- Stage
- Autre

## 🔐 Sécurité

### **Authentification**

- **Token requis** : Récupération depuis `localStorage`
- **Header Authorization** : `Bearer <token>`
- **Validation côté serveur** : Edge Function Supabase

### **Autorisation**

- **Rôles autorisés** : `rh`, `responsable`
- **Vérification DB** : Table `admin_users`
- **Accès refusé** : Rôles `admin`, `user`

## 📊 Base de données

### **Tables utilisées**

```sql
-- Table employees (existante)
employees (
  id, user_id, email, nom, prenom, salaire_net, 
  type_contrat, date_embauche, poste, partner_id
)

-- Table admin_users (existante)
admin_users (
  id, email, display_name, role, partenaire_id, 
  active, created_at, updated_at
)

-- Table salary_setup_history (nouvelle)
salary_setup_history (
  id, user_id, employee_id, old_salary, new_salary,
  changed_by, reason, created_at
)
```

### **Relations**

- `employees.user_id` ↔ `admin_users.id`
- `admin_users.partenaire_id` ↔ `partners.id`
- `salary_setup_history.user_id` ↔ `employees.user_id`

## 🚀 Déploiement

### **Prérequis**

1. **Supabase CLI** installé
2. **Variables d'environnement** configurées
3. **Edge Function** déployée
4. **Tables** créées

### **Variables d'environnement**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Scripts de déploiement**

```bash
# Assigner un rôle à un utilisateur
node scripts/assign-user-role.js

# Vérifier la configuration
npm run dev
```

## 🧪 Tests

### **Scénarios de test**

1. **Utilisateur RH avec salaire à 0**
   - ✅ Modale s'affiche
   - ✅ Configuration réussie
   - ✅ Page se recharge
   - ✅ Salaire mis à jour

2. **Utilisateur Responsable avec salaire à 0**
   - ✅ Modale s'affiche
   - ✅ Configuration réussie
   - ✅ Page se recharge
   - ✅ Salaire mis à jour

3. **Utilisateur avec salaire > 0**
   - ✅ Modale ne s'affiche pas

4. **Utilisateur sans rôle**
   - ✅ Modale ne s'affiche pas

### **Tests manuels**

```bash
# 1. Se connecter en tant que RH/Responsable
# 2. Aller sur /profile
# 3. Vérifier l'affichage de la modale
# 4. Configurer le salaire
# 5. Vérifier la mise à jour
```

## 🔄 Flux complet

### **1. Connexion utilisateur**

```typescript
// L'utilisateur se connecte
const { employee, isAuthenticated } = useEmployeeAuth();
```

### **2. Vérification automatique**

```typescript
// Le hook vérifie automatiquement
useEffect(() => {
  if (employee && isAuthenticated) {
    checkSalarySetup(); // Appel Edge Function
  }
}, [employee, isAuthenticated]);
```

### **3. Affichage de la modale**

```typescript
// Si conditions remplies
<SalarySetupModal
  isOpen={needsSetup === true && showModal}
  onClose={handleCloseModal}
  onSuccess={handleSuccess}
  userInfo={userInfo}
/>
```

### **4. Configuration du salaire**

```typescript
// Soumission du formulaire
const response = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/configure', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

### **5. Mise à jour et rechargement**

```typescript
// Succès
setStatus('success');
setTimeout(() => {
  onSuccess();
  onClose();
  window.location.reload(); // Rechargement automatique
}, 1500);
```

## 🐛 Dépannage

### **Problèmes courants**

1. **Modale ne s'affiche pas**
   - Vérifier le rôle dans `admin_users`
   - Vérifier que `salaire_net = 0`
   - Vérifier les logs console

2. **Erreur 401**
   - Vérifier le token dans `localStorage`
   - Vérifier la validité du token
   - Vérifier l'Edge Function

3. **Erreur de validation**
   - Vérifier les données saisies
   - Vérifier les règles de validation

### **Logs de débogage**

```typescript
// Dans useSalarySetup.ts
/*console.log('🔄 Hook useSalarySetup - Vérification automatique...')*/
/*console.log('   - employee.user_id:', employee.user_id)*/
/*console.log('   - employee.salaire_net:', employee.salaire_net)*/
/*console.log('   - employee.poste:', employee.poste)*/
```

## 📝 Notes importantes

### **Sécurité**

- ✅ Tokens d'accès requis pour toutes les opérations
- ✅ Validation côté serveur et client
- ✅ Rôles vérifiés dans la base de données
- ✅ Historique des modifications

### **Performance**

- ✅ Vérification automatique au montage
- ✅ Cache des données utilisateur
- ✅ Rechargement optimisé

### **UX**

- ✅ Interface intuitive et responsive
- ✅ Messages d'erreur clairs
- ✅ Animations fluides
- ✅ Fermeture automatique après succès

## 🎉 Résultat final

Le système de configuration de salaire est maintenant **entièrement fonctionnel** avec :

- ✅ **Interface utilisateur** : Modale stylée et intuitive
- ✅ **Logique métier** : Vérification et validation complètes
- ✅ **Sécurité** : Authentification et autorisation robustes
- ✅ **Base de données** : Intégration complète avec Supabase
- ✅ **UX optimisée** : Flux utilisateur fluide et professionnel

Les utilisateurs RH et Responsable peuvent maintenant configurer leur salaire de manière sécurisée et intuitive ! 🚀
