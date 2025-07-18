# 🚀 Guide de Mise à Jour - Formulaire de Partenariat

## 📋 **Résumé des Modifications**

### 🔄 **1. Modification du champ "Date de paiement"**
- **Ancien** : Champ date complet
- **Nouveau** : Sélecteur de jour du mois (1-31) avec validation selon le mois
- **UX** : Sélection mois → sélection jour valide

### ✨ **2. Nouvelle étape "Lettre de motivation"**
- **Suppression** : Upload de fichier de l'étape 1
- **Ajout** : Étape 4 dédiée à la lettre de motivation
- **Choix** : Texte direct OU upload fichier (PDF/Word, max 5MB)
- **Stockage** : 
  - Texte → `motivation_letter_text`
  - Fichier → `motivation_letter_url`

---

## 🗄️ **1. Scripts SQL à Exécuter**

### **A. Mise à jour de la table partnership_requests**
```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- Fichier : scripts/update-partnership-fields.sql
```

### **B. Configuration du bucket de stockage**
```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- Fichier : scripts/setup-partnership-storage.sql
```

---

## 🎯 **2. Nouveaux Composants**

### **A. PaymentDaySelector**
- **Fichier** : `src/components/ui/payment-day-selector.tsx`
- **Fonctionnalités** :
  - Sélection mois → jour
  - Validation selon le mois (février max 29)
  - UX fluide avec animations

### **B. MotivationLetterInput**
- **Fichier** : `src/components/ui/motivation-letter-input.tsx`
- **Fonctionnalités** :
  - Choix texte OU fichier
  - Validation taille (5MB) et type
  - Interface intuitive

---

## 🔧 **3. Modifications des Fichiers Existants**

### **A. Types TypeScript**
```typescript
// src/types/partenaire.ts
// Ajout du champ motivation_letter_text
```

### **B. API Route**
```typescript
// src/app/api/partnership/route.ts
// Ajout de la validation et gestion des nouveaux champs
```

### **C. Formulaire Principal**
```typescript
// src/components/sections/Partenariat/PartnershipForm.tsx
// - Remplacement du champ date de paiement
// - Suppression upload de l'étape 1
// - Ajout de l'étape 4
// - Logique de validation mise à jour
```

### **D. Nouvelle API Upload**
```typescript
// src/app/api/partnership/upload/route.ts
// Gestion de l'upload des fichiers de lettre
```

---

## 🚀 **4. Étapes de Déploiement**

### **Étape 1 : Base de données**
1. Exécuter `scripts/update-partnership-fields.sql`
2. Exécuter `scripts/setup-partnership-storage.sql`
3. Vérifier les contraintes et index

### **Étape 2 : Composants**
1. Créer `src/components/ui/payment-day-selector.tsx`
2. Créer `src/components/ui/motivation-letter-input.tsx`
3. Mettre à jour `src/types/partenaire.ts`

### **Étape 3 : API**
1. Créer `src/app/api/partnership/upload/route.ts`
2. Mettre à jour `src/app/api/partnership/route.ts`

### **Étape 4 : Formulaire**
1. Mettre à jour `src/components/sections/Partenariat/PartnershipForm.tsx`
2. Tester la navigation entre étapes
3. Vérifier la validation

---

## 🧪 **5. Tests à Effectuer**

### **A. Test du sélecteur de jour**
- [ ] Sélection mois → jours disponibles
- [ ] Validation février (max 29)
- [ ] Validation mois 30 jours
- [ ] Persistance des valeurs

### **B. Test de la lettre de motivation**
- [ ] Choix texte → désactivation fichier
- [ ] Choix fichier → désactivation texte
- [ ] Validation taille fichier (5MB)
- [ ] Validation type fichier (PDF/Word)
- [ ] Upload vers Supabase Storage
- [ ] Sauvegarde en base

### **C. Test du flow complet**
- [ ] Navigation 4 étapes
- [ ] Validation par étape
- [ ] Soumission finale
- [ ] Gestion erreurs

---

## 🔍 **6. Points d'Attention**

### **A. Validation**
- La lettre de motivation est obligatoire (texte OU fichier)
- Le texte doit faire minimum 100 caractères
- Le fichier doit être PDF ou Word, max 5MB

### **B. UX**
- L'utilisateur ne peut pas fournir texte ET fichier
- Le sélecteur de jour est intuitif (mois → jour)
- Les animations sont fluides

### **C. Sécurité**
- Validation côté client ET serveur
- Politiques RLS appropriées
- Limitation taille et type fichiers

---

## 🐛 **7. Dépannage**

### **Erreur "motivation_letter_text not found"**
```sql
-- Vérifier que le champ existe
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'partnership_requests' 
AND column_name = 'motivation_letter_text';
```

### **Erreur upload fichier**
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

### **Erreur validation**
- Vérifier les types TypeScript
- Contrôler les noms de champs (snake_case vs camelCase)
- Tester la validation côté client

---

## ✅ **8. Checklist de Validation**

- [ ] Scripts SQL exécutés
- [ ] Nouveaux composants créés
- [ ] Types TypeScript mis à jour
- [ ] API routes fonctionnelles
- [ ] Formulaire mis à jour
- [ ] Tests effectués
- [ ] Validation UX/UI
- [ ] Tests de soumission
- [ ] Gestion erreurs
- [ ] Documentation mise à jour

---

## 📞 **Support**

En cas de problème :
1. Vérifier les logs console
2. Contrôler les politiques RLS
3. Tester les API individuellement
4. Vérifier les types TypeScript 