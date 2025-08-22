# 🚀 Intégration du Système de Configuration de Salaire

## 📋 Vue d'ensemble

Ce document décrit l'intégration complète du système de configuration automatique du salaire pour les RH et responsables lors de leur première connexion.

## 🏗️ Architecture Intégrée

### **Composants Frontend**
- **Modale stylisée** : `src/components/modals/SalarySetupModal.tsx`
- **Hook personnalisé** : `src/hooks/useSalarySetup.ts`
- **Intégration profil** : `src/app/profile/page.tsx`

### **API Routes**
- **Vérification** : `src/app/api/salary-setup/check/route.ts`
- **Configuration** : `src/app/api/salary-setup/configure/route.ts`

### **Base de Données**
- **Table principale** : `employees` (colonnes existantes)
- **Table historique** : `salary_setup_history` (à créer)

## 🔧 Installation et Configuration

### **1. Prérequis**
- Next.js 15+ installé
- Supabase configuré
- Variables d'environnement définies

### **2. Variables d'environnement requises**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **3. Structure de la base de données**

#### **Table `employees` (existante)**
```sql
-- Colonnes utilisées par le système
salaire_net INTEGER DEFAULT 0,
type_contrat VARCHAR(50),
date_embauche DATE,
poste VARCHAR(100),
user_id UUID REFERENCES auth.users(id),
partner_id UUID REFERENCES partners(id)
```

#### **Table `salary_setup_history` (à créer)**
```sql
CREATE TABLE IF NOT EXISTS salary_setup_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  employee_id UUID REFERENCES employees(id),
  old_salary INTEGER DEFAULT 0,
  new_salary INTEGER NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT DEFAULT 'Configuration initiale du salaire',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_salary_history_user_id ON salary_setup_history(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_history_employee_id ON salary_setup_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_history_created_at ON salary_setup_history(created_at);
```

## 🎯 Fonctionnalités

### **1. Détection automatique**
- Vérification du rôle utilisateur (RH ou responsable)
- Contrôle du salaire actuel (0 ou null = configuration requise)
- Affichage automatique de la modale

### **2. Interface utilisateur**
- Design cohérent avec la page de connexion
- Validation en temps réel
- Messages d'erreur clairs
- Animations fluides avec Framer Motion

### **3. Validation des données**
- Salaire : 1 à 10 000 000 FG
- Type de contrat : CDI, CDD, Consultant, Stage, Autre
- Date d'embauche : pas dans le futur
- Poste : minimum 2 caractères

### **4. Sécurité**
- Authentification requise
- Validation côté serveur
- Historique des modifications
- Tokens d'accès sécurisés

## 🔄 Flux d'utilisation

### **Scénario 1 : Première connexion RH/Responsable**
```
1. Utilisateur se connecte
2. Système vérifie le rôle et le salaire
3. Si salaire = 0 → Modale s'affiche automatiquement
4. Utilisateur remplit le formulaire
5. Validation et sauvegarde
6. Modale se ferme → Accès au profil
```

### **Scénario 2 : Utilisateur déjà configuré**
```
1. Utilisateur se connecte
2. Système vérifie le rôle et le salaire
3. Si salaire > 0 → Pas de modale
4. Accès direct au profil
```

## 🧪 Tests

### **Tests automatisés**
```bash
# Exécuter les tests
node test-salary-setup.js
```

### **Tests manuels**
1. **Créer un utilisateur RH avec salaire = 0**
2. **Se connecter et accéder à `/profile`**
3. **Vérifier l'affichage de la modale**
4. **Remplir le formulaire avec des données valides**
5. **Vérifier la sauvegarde et la fermeture de la modale**

### **Tests de validation**
- Salaire négatif → Erreur
- Date future → Erreur
- Poste vide → Erreur
- Type de contrat invalide → Erreur

## 📊 Monitoring et Logs

### **Logs à surveiller**
```javascript
// Dans les API routes
console.error('Erreur lors de la vérification du salaire:', error);
console.error('Erreur lors de la configuration du salaire:', error);
console.error('Erreur lors de l\'enregistrement de l\'historique:', error);
```

### **Métriques importantes**
- Taux d'affichage de la modale
- Taux de succès de configuration
- Temps moyen de configuration
- Erreurs de validation

## 🚨 Gestion des erreurs

### **Erreurs courantes**
1. **Token invalide** : Vérifier l'authentification
2. **Rôle non autorisé** : Vérifier les permissions
3. **Données invalides** : Vérifier la validation
4. **Erreur de base de données** : Vérifier la connexion

### **Solutions**
```javascript
// Exemple de gestion d'erreur
try {
  const result = await configureSalary(data);
  if (result) {
    // Succès
  } else {
    // Afficher l'erreur à l'utilisateur
  }
} catch (error) {
  console.error('Erreur:', error);
  // Gérer l'erreur
}
```

## 🔄 Maintenance

### **Mise à jour du système**
1. **Modifier les validations** : `src/app/api/salary-setup/configure/route.ts`
2. **Changer l'interface** : `src/components/modals/SalarySetupModal.tsx`
3. **Ajouter des champs** : Modifier les types et validations

### **Migration de données**
```sql
-- Exemple : Ajouter un nouveau type de contrat
ALTER TYPE contract_type ADD VALUE 'Freelance';

-- Mettre à jour les types autorisés dans l'API
const CONTRACT_TYPES = ['CDI', 'CDD', 'Consultant', 'Stage', 'Autre', 'Freelance'];
```

## 📝 Documentation API

### **GET /api/salary-setup/check**
Vérifie si l'utilisateur a besoin de configurer son salaire.

**Headers requis :**
```
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "success": true,
  "needsSetup": true,
  "user": {
    "id": "user-uuid",
    "role": "rh",
    "email": "rh@example.com",
    "display_name": "John Doe",
    "currentSalary": 0,
    "partner": {
      "id": "partner-uuid",
      "company_name": "Entreprise Example"
    }
  }
}
```

### **POST /api/salary-setup/configure**
Configure le salaire de l'utilisateur.

**Headers requis :**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body :**
```json
{
  "salaire_net": 750000,
  "type_contrat": "CDI",
  "date_embauche": "2024-01-15",
  "poste": "Responsable RH"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Salaire configuré avec succès",
  "employee": {
    "id": "employee-uuid",
    "salaire_net": 750000,
    "poste": "Responsable RH",
    "type_contrat": "CDI",
    "updated_at": "2024-12-01T10:00:00Z"
  }
}
```

## 🎨 Personnalisation

### **Modifier le design**
```typescript
// Dans SalarySetupModal.tsx
// Changer les couleurs
className="bg-[#FF671E]" // Couleur principale
className="text-[#FF671E]" // Couleur des icônes

// Modifier les animations
transition={{ type: "spring", stiffness: 400, damping: 25 }}
```

### **Ajouter des champs**
```typescript
// 1. Ajouter dans l'interface
interface SalaryFormData {
  salaire_net: number;
  type_contrat: string;
  date_embauche: string;
  poste: string;
  nouveau_champ: string; // Nouveau champ
}

// 2. Ajouter dans le formulaire
<input
  type="text"
  placeholder="Nouveau champ"
  value={formData.nouveau_champ}
  onChange={(e) => handleInputChange('nouveau_champ', e.target.value)}
/>

// 3. Ajouter la validation
if (!formData.nouveau_champ) {
  setErrorMessage('Le nouveau champ est requis');
  return false;
}

// 4. Mettre à jour l'API
```

## 🆘 Support et Dépannage

### **Problèmes courants**

#### **La modale ne s'affiche pas**
1. Vérifier que l'utilisateur a le rôle `rh` ou `responsable`
2. Vérifier que le salaire est à 0 dans la base de données
3. Vérifier les logs de l'API `/api/salary-setup/check`

#### **Erreur de validation**
1. Vérifier les données envoyées
2. Consulter les messages d'erreur
3. Vérifier les règles de validation

#### **Erreur de base de données**
1. Vérifier la connexion Supabase
2. Vérifier les permissions de la table
3. Vérifier que la table `salary_setup_history` existe

### **Contact**
Pour toute question technique, consulter les logs ou contacter l'équipe de développement.

## ✅ Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Table `salary_setup_history` créée
- [ ] API routes déployées
- [ ] Composants frontend intégrés
- [ ] Tests automatisés passent
- [ ] Tests manuels effectués
- [ ] Documentation mise à jour
- [ ] Monitoring configuré

---

**Version :** 1.0.0  
**Date :** Décembre 2024  
**Auteur :** Équipe ZaLaMa
