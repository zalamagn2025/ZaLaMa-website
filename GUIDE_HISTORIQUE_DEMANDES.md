# 📊 Guide - Historique des Demandes d'Avance vs Transactions

## 🎯 **Clarification Importante**

Vous avez absolument raison de vous interroger ! Il y a une différence importante entre :

### **1. Historique des Demandes d'Avance (Recommandé pour l'employé)**
- ✅ **Source :** `salary_advance_requests`
- ✅ **Contenu :** Les demandes que l'employé a soumises
- ✅ **Statuts :** En attente, Validé, Rejeté, Annulé
- ✅ **Informations :** Motif, montant, date de demande, statut
- ✅ **Pertinence :** L'employé veut voir ses demandes

### **2. Historique des Transactions (Technique)**
- ❌ **Source :** `transactions`
- ❌ **Contenu :** Entrées techniques créées automatiquement
- ❌ **Statuts :** EN_COURS, EFFECTUEE, ECHOUE
- ❌ **Informations :** Détails de paiement, méthodes de paiement
- ❌ **Pertinence :** Plus technique, moins pertinent pour l'employé

## 🔄 **Flux Complet**

```
1. Employé soumet une demande → salary_advance_requests
2. Système crée automatiquement → transactions (pour traçabilité)
3. L'employé voit → Historique des demandes (salary_advance_requests)
4. L'admin peut voir → Historique des transactions (transactions)
```

## 📱 **Interface Utilisateur**

### **Pour l'Employé (Historique des Demandes)**
```typescript
// Composant : SalaryAdvanceHistory
// Source : /api/salary-advance/request (GET)
// Table : salary_advance_requests

Affichage :
- Type de motif (Transport, Santé, etc.)
- Montant demandé
- Statut de la demande (En attente, Validé, Rejeté)
- Date de demande
- Motif de rejet (si applicable)
```

### **Pour l'Admin (Historique des Transactions)**
```typescript
// Composant : TransactionHistory (pour admin)
// Source : /api/transactions (GET)
// Table : transactions

Affichage :
- Méthode de paiement
- Statut de transaction
- Détails techniques
- Historique complet des mouvements
```

## 🎨 **Composants à Utiliser**

### **Pour l'Employé (Profil)**
```tsx
// Dans le profil employé
<SalaryAdvanceHistory />
```

### **Pour l'Admin (Dashboard)**
```tsx
// Dans le dashboard admin
<TransactionHistory />
```

## 📊 **Exemple d'Affichage**

### **Historique des Demandes (Employé)**
```
📋 Demande d'avance - Transport
💰 500,000 GNF
⏳ En attente
📅 15 Jan 2024
📝 Urgence familiale
```

### **Historique des Transactions (Admin)**
```
💳 Transaction - Mobile Money
💰 500,000 GNF
✅ EFFECTUEE
📅 15 Jan 2024
🔗 Lien vers demande: demande-123
```

## ✅ **Recommandation**

**Utilisez l'historique des demandes d'avance** pour l'interface employé car :
1. ✅ Plus pertinent pour l'utilisateur
2. ✅ Affiche les informations importantes (motif, statut)
3. ✅ Interface plus claire et compréhensible
4. ✅ Correspond aux attentes de l'utilisateur

## 🔧 **Implémentation**

Le composant `SalaryAdvanceHistory` est maintenant disponible et affiche :
- ✅ Les demandes depuis `salary_advance_requests`
- ✅ Le statut de chaque demande
- ✅ Les détails complets (motif, montant, etc.)
- ✅ Interface mobile-first et moderne
- ✅ Filtres et recherche
- ✅ Pagination
- ✅ Partage et export

## 🎯 **Résumé**

- **Employé** → Voir ses demandes d'avance (historique des demandes)
- **Admin** → Voir toutes les transactions (historique des transactions)
- **Système** → Crée automatiquement les deux pour traçabilité complète 