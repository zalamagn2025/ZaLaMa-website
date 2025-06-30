# 🔧 Guide de Résolution Final - Erreur 500 Demande d'Avance

## 🚨 **Problème Identifié**
- **Erreur :** `POST /api/salary-advance/request 500`
- **Cause principale :** Mismatch entre `utilisateur_id` et la référence de table
- **Détail :** `utilisateur_id` fait référence à `users(id)` mais nous utilisons `auth.users(id)`

## ✅ **Solutions Créées**

### 1. **Script de Correction de Référence**
- ✅ `scripts/fix-financial-transactions-reference.sql`
- ✅ Corrige la contrainte de clé étrangère

### 2. **Script de Correction RLS**
- ✅ `scripts/fix-financial-transactions-rls.sql`
- ✅ Corrige les politiques de sécurité

## 🛠️ **Étapes de Résolution**

### **Étape 1 : Exécuter le Script de Référence**
1. Allez dans votre **Dashboard Supabase**
2. Ouvrez **SQL Editor**
3. Copiez et exécutez le contenu de `scripts/fix-financial-transactions-reference.sql`
4. **Important :** Remplacez `'votre-user-id-ici'` par votre vrai `user_id` de Supabase Auth

### **Étape 2 : Exécuter le Script RLS**
1. Dans le même **SQL Editor**
2. Copiez et exécutez le contenu de `scripts/fix-financial-transactions-rls.sql`
3. **Important :** Remplacez `'votre-user-id-ici'` par votre vrai `user_id`

### **Étape 3 : Vérifier les Résultats**
Les scripts afficheront :
- ✅ Contraintes corrigées
- ✅ Politiques RLS mises à jour
- ✅ Test d'insertion réussi

## 🔍 **Diagnostic Avancé**

### **Si l'erreur persiste après les scripts :**

#### **Vérifier votre user_id**
```sql
-- Dans Supabase SQL Editor, exécutez :
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'votre-email@example.com';
```

#### **Vérifier les données employé**
```sql
-- Vérifier que vous avez des données employé
SELECT 
  id,
  user_id,
  nom,
  prenom,
  salaire_net
FROM employees 
WHERE user_id = 'votre-user-id-ici';
```

#### **Tester l'insertion manuelle**
```sql
-- Test direct avec votre user_id
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
  'votre-user-id-ici',
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

#### **Option 2 : Modifier l'API temporairement**
```typescript
// Dans route.ts, commenter la ligne utilisateur_id
const transactionData = {
  montant: parseFloat(montantDemande),
  type: 'Débloqué' as const,
  description: `Demande d'avance: ${motif.trim()}`,
  // utilisateur_id: session.user.id, // Commenté temporairement
  partenaire_id: entrepriseId || null,
  statut: 'En attente' as const,
  date_transaction: new Date().toISOString(),
  reference: numeroReception || `REF-${Date.now()}`
}
```

## 📞 **Support et Débogage**

### **Informations à fournir :**
1. **Résultat** des scripts SQL
2. **Logs complets** de la console
3. **Votre user_id** de Supabase Auth
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

Après avoir exécuté les scripts :
- ✅ L'erreur 500 disparaît
- ✅ Les demandes d'avance sont créées avec succès
- ✅ Les transactions apparaissent dans l'historique
- ✅ Le champ "Disponible ce mois-ci" fonctionne dynamiquement

**Les scripts corrigent le problème de référence qui était la cause principale de l'erreur 500 !** 🎉 