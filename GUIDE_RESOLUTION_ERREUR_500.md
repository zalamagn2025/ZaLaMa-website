# 🔧 Guide de Résolution - Erreur 500 Demande d'Avance

## 🚨 **Problème Identifié**
- **Erreur :** `POST /api/salary-advance/request 500 in 6317ms`
- **Cause probable :** Table `user_activities` manquante ou problème de permissions

## ✅ **Solutions Appliquées**

### 1. **API Corrigée**
- ✅ Gestion d'erreur pour `user_activities` (optionnel)
- ✅ Validation renforcée des données
- ✅ Logs détaillés pour le débogage

### 2. **Script de Correction**
- ✅ `scripts/fix-user-activities-table.sql` créé
- ✅ Vérification et création automatique de la table

## 🛠️ **Étapes de Résolution**

### **Étape 1 : Exécuter le Script SQL**
1. Allez dans votre **Dashboard Supabase**
2. Ouvrez **SQL Editor**
3. Copiez et exécutez le contenu de `scripts/fix-user-activities-table.sql`

### **Étape 2 : Vérifier les Logs**
1. Ouvrez la **console du navigateur** (F12)
2. Soumettez une nouvelle demande d'avance
3. Vérifiez les logs pour identifier l'erreur exacte

### **Étape 3 : Tester l'API**
1. Rechargez votre application
2. Essayez de soumettre une demande d'avance
3. Vérifiez que l'erreur 500 a disparu

## 🔍 **Diagnostic Avancé**

### **Si l'erreur persiste :**

#### **Vérifier la Table financial_transactions**
```sql
-- Vérifier la structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'financial_transactions'
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'financial_transactions';
```

#### **Vérifier les Permissions**
```sql
-- Vérifier que l'utilisateur peut insérer
SELECT has_table_privilege('authenticated', 'financial_transactions', 'INSERT');
SELECT has_table_privilege('authenticated', 'user_activities', 'INSERT');
```

#### **Tester l'Insertion Manuelle**
```sql
-- Tester avec votre user_id
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
  'Test insertion',
  '77a51763-16bc-4b2f-ac3c-3ca8f73945b6',
  'En attente',
  NOW(),
  'TEST-REF'
);
```

## 📋 **Logs à Surveiller**

### **Dans la Console du Navigateur**
```
📦 Données reçues: {employeId: "...", montantDemande: "...", ...}
🔍 Recherche des données employé pour validation: ...
💾 Tentative d'insertion dans financial_transactions: ...
✅ Transaction financière créée avec ID: ...
```

### **Dans les Logs Supabase**
- Erreurs de permissions
- Problèmes de contraintes
- Erreurs de validation

## 🚀 **Solutions Alternatives**

### **Si user_activities pose problème :**
1. **Solution temporaire :** L'API fonctionne sans cette table
2. **Solution permanente :** Créer la table avec le script fourni

### **Si financial_transactions pose problème :**
1. **Vérifier la structure** de la table
2. **Corriger les politiques RLS**
3. **Vérifier les contraintes**

## 📞 **Support**

### **Informations à fournir :**
1. **Logs complets** de la console
2. **Résultat** du script SQL
3. **Structure** des tables concernées
4. **Politiques RLS** actives

### **Commandes de débogage :**
```sql
-- Vérifier toutes les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les erreurs récentes
SELECT * FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY query_start DESC;
```

**Après avoir exécuté le script SQL, l'erreur 500 devrait être résolue !** 🎉 