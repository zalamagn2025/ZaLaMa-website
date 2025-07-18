# 📊 Guide Complet - Logique de Gestion des Transactions

## 🎯 **Vue d'Ensemble**

Ce guide explique comment les demandes d'avance sur salaire sont gérées et comment elles se transforment en transactions.

## 🔄 **Flux Complet**

### **1. Demande d'Avance (Point de Départ)**

```sql
-- L'employé soumet une demande
salary_advance_requests {
  id: "demande-123",
  employe_id: "employe-456",
  partenaire_id: "partenaire-789",
  montant_demande: 500000,
  motif: "Urgence familiale",
  statut: "En attente"  -- Statut initial
}
```

### **2. Transaction Automatique (Créée en même temps)**

```sql
-- Une transaction est automatiquement créée
transactions {
  id: "transaction-abc",
  demande_avance_id: "demande-123",  -- Lien vers la demande
  employe_id: "employe-456",
  entreprise_id: "partenaire-789",
  montant: 500000,
  statut: "EN_COURS",  -- Statut initial
  methode_paiement: "MOBILE_MONEY"
}
```

## 📈 **Évolution des Statuts**

### **Demande d'Avance (`salary_advance_requests`)**
```
'En attente' → 'Validé' → 'Rejeté'
```

### **Transaction (`transactions`)**
```
'EN_COURS' → 'EFFECTUEE' → 'ECHOUE'
```

## 🛠️ **Gestion des Statuts**

### **API de Mise à Jour**
- **Endpoint :** `PUT /api/salary-advance/status`
- **Fonction :** Met à jour le statut de la demande ET de la transaction
- **Paramètres :** `demandeId`, `newStatus`, `motifRejet` (optionnel)

### **Exemple d'Utilisation**
```javascript
// Valider une demande
await fetch('/api/salary-advance/status', {
  method: 'PUT',
  body: JSON.stringify({
    demandeId: 'demande-123',
    newStatus: 'Validé'
  })
})

// Rejeter une demande
await fetch('/api/salary-advance/status', {
  method: 'PUT',
  body: JSON.stringify({
    demandeId: 'demande-123',
    newStatus: 'Rejeté',
    motifRejet: 'Limite mensuelle dépassée'
  })
})
```

## 📊 **Relations entre Tables**

```sql
-- Relation 1:1 entre demande et transaction
salary_advance_requests.id ←→ transactions.demande_avance_id

-- Relation employé
salary_advance_requests.employe_id → employees.id
transactions.employe_id → employees.id

-- Relation entreprise
salary_advance_requests.partenaire_id → partners.id
transactions.entreprise_id → partners.id
```

## 🎨 **Interface Utilisateur**

### **Composant TransactionHistory**
- ✅ Affiche les transactions depuis la table `transactions`
- ✅ Inclut les relations avec `employees` et `partners`
- ✅ Affiche le statut et les détails de paiement

### **Composant SalaryAdvanceForm**
- ✅ Crée une demande dans `salary_advance_requests`
- ✅ Crée automatiquement une entrée dans `transactions`
- ✅ Retourne l'ID de la demande créée

## 🔧 **API Endpoints**

### **1. Création de Demande**
```
POST /api/salary-advance/request
→ Crée dans salary_advance_requests
→ Crée automatiquement dans transactions
```

### **2. Mise à Jour de Statut**
```
PUT /api/salary-advance/status
→ Met à jour salary_advance_requests.statut
→ Met à jour transactions.statut
```

### **3. Récupération des Transactions**
```
GET /api/transactions
→ Récupère depuis transactions
→ Inclut les relations employees/partners
```

## 📋 **Cas d'Usage**

### **Cas 1: Demande Validée**
1. Employé soumet une demande → `salary_advance_requests.statut = 'En attente'`
2. Transaction créée → `transactions.statut = 'EN_COURS'`
3. Admin valide → `salary_advance_requests.statut = 'Validé'`
4. Transaction mise à jour → `transactions.statut = 'EFFECTUEE'`

### **Cas 2: Demande Rejetée**
1. Employé soumet une demande → `salary_advance_requests.statut = 'En attente'`
2. Transaction créée → `transactions.statut = 'EN_COURS'`
3. Admin rejette → `salary_advance_requests.statut = 'Rejeté'`
4. Transaction mise à jour → `transactions.statut = 'ECHOUE'`

## 🎯 **Avantages de cette Architecture**

### **1. Séparation des Responsabilités**
- `salary_advance_requests` : Gestion des demandes
- `transactions` : Historique des paiements

### **2. Flexibilité**
- Une demande peut être rejetée mais la transaction reste
- L'historique est préservé même si la demande change

### **3. Traçabilité**
- Chaque demande a sa transaction correspondante
- Historique complet des mouvements financiers

### **4. Performance**
- Index sur les relations clés
- Requêtes optimisées avec les bonnes colonnes

## 🚀 **Prochaines Étapes**

1. ✅ **Implémenter l'API de mise à jour de statut**
2. ✅ **Tester le flux complet**
3. ✅ **Ajouter des notifications lors des changements de statut**
4. ✅ **Créer un dashboard admin pour gérer les demandes**

## 📝 **Notes Importantes**

- Les erreurs de création de transaction ne font pas échouer la demande
- Les notifications sont envoyées en arrière-plan
- Le statut de la transaction peut être mis à jour indépendamment
- La méthode de paiement peut être mise à jour lors du paiement effectif 