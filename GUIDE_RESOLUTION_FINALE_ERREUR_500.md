# 🔧 Guide de Résolution Finale - Erreur 500 Demande d'Avance

## 🚨 **Problème Identifié**
- **Erreur :** `POST /api/salary-advance/request 500`
- **Cause réelle :** `utilisateur_id` fait référence à `employees(id)` mais nous utilisons `auth.users(id)`
- **Message d'erreur :** `Key (utilisateur_id)=(a5d53399-7509-4ddc-9d23-052b1b4a04f7) is not present in table "employees"`

## ✅ **Solutions Appliquées**

### 1. **Script de Correction Final**
- ✅ `scripts/fix-financial-transactions-final.sql`
- ✅ Corrige la contrainte et les politiques RLS

### 2. **API Corrigée**
- ✅ Utilise `employeId` au lieu de `session.user.id`
- ✅ Corrige les requêtes GET et POST

## 🛠️ **Étapes de Résolution**

### **Étape 1 : Exécuter le Script SQL**
1. Allez dans votre **Dashboard Supabase**
2. Ouvrez **SQL Editor**
3. Copiez et exécutez le contenu de `scripts/fix-financial-transactions-final.sql`
4. **Important :** Remplacez `'votre-employee-id-ici'` par un vrai `employee_id`

### **Étape 2 : Vérifier les Données**
Le script affichera :
- ✅ Contraintes corrigées
- ✅ Politiques RLS mises à jour
- ✅ Test d'insertion réussi

### **Étape 3 : Tester l'Application**
1. Rechargez votre application
2. Essayez de soumettre une demande d'avance
3. Vérifiez que l'erreur 500 a disparu

## 🔍 **Diagnostic Avancé**

### **Si l'erreur persiste :**

#### **Vérifier votre employee_id**
```sql
-- Récupérer votre employee_id
SELECT 
  e.id as employee_id,
  e.user_id,
  e.nom,
  e.prenom,
  e.salaire_net
FROM employees e
WHERE e.user_id = 'votre-user-id-de-supabase-auth';
```

#### **Vérifier les contraintes**
```sql
-- Vérifier la contrainte utilisateur_id
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'financial_transactions'
  AND kcu.column_name = 'utilisateur_id';
```

#### **Tester l'insertion manuelle**
```sql
-- Test avec votre employee_id
INSERT INTO financial_transactions (
  montant,
  type,
  description,
  utilisateur_id,
  statut,
  date_transaction,
  reference
) VALUES (
  100000,
  'Débloqué',
  'Test manuel',
  'votre-employee-id-ici',
  'En attente',
  NOW(),
  'TEST-MANUEL'
);
```

## 📋 **Logs à Surveiller**

### **Dans la Console du Navigateur (F12)**
```
📦 Données reçues: {employeId: "...", montantDemande: "...", ...}
🔍 Recherche des données employé pour validation: ...
💾 Tentative d'insertion dans financial_transactions: ...
✅ Transaction financière créée avec ID: ...
```

### **Erreurs Possibles**
- `foreign key violation` → Problème de référence
- `new row violates row-level security policy` → Problème RLS
- `column "utilisateur_id" does not exist` → Problème de structure

## 🚀 **Solutions Alternatives**

### **Si les scripts ne fonctionnent pas :**

#### **Option 1 : Recréer la table**
```sql
-- Sauvegarder les données existantes
CREATE TABLE financial_transactions_backup AS 
SELECT * FROM financial_transactions;

-- Supprimer et recréer
DROP TABLE financial_transactions;
-- Puis exécuter la création depuis supabase-schema.sql
```

#### **Option 2 : Modifier temporairement l'API**
```typescript
// Dans route.ts, commenter la ligne utilisateur_id
const transactionData = {
  montant: parseFloat(montantDemande),
  type: 'Débloqué' as const,
  description: `Demande d'avance: ${motif.trim()}`,
  // utilisateur_id: employeId, // Commenté temporairement
  partenaire_id: entrepriseId || null,
  statut: 'En attente' as const,
  date_transaction: new Date().toISOString(),
  reference: numeroReception || `REF-${Date.now()}`
}
```

## 📞 **Support et Débogage**

### **Informations à fournir :**
1. **Résultat** du script SQL
2. **Logs complets** de la console
3. **Votre employee_id** et user_id
4. **Structure** de la table `financial_transactions`

### **Commandes de vérification :**
```sql
-- Vérifier la structure
\d financial_transactions

-- Vérifier les contraintes
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'financial_transactions';

-- Vérifier les politiques RLS
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'financial_transactions';
```

## 🎯 **Résultat Attendu**

Après avoir exécuté le script :
- ✅ L'erreur 500 disparaît
- ✅ Les demandes d'avance sont créées avec succès
- ✅ Les transactions apparaissent dans l'historique
- ✅ Le champ "Disponible ce mois-ci" fonctionne dynamiquement

## 🔧 **Changements dans l'API**

### **Avant (Problématique) :**
```typescript
utilisateur_id: session.user.id, // ID de Supabase Auth
```

### **Après (Corrigé) :**
```typescript
utilisateur_id: employeId, // ID de l'employé
```

**Le script corrige le problème de référence qui était la cause principale de l'erreur 500 !** 🎉 