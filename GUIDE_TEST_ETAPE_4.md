# 🧪 Guide de Test - Étape 4 Lettre de Motivation

## 📋 **Vérification de l'Implémentation**

### ✅ **Étape 4 Implémentée**
- **Fichier** : `src/components/sections/Partenariat/PartnershipForm.tsx`
- **Lignes** : 1120-1200 (environ)
- **Composant** : `MotivationLetterInput`

### 🔄 **Navigation Corrigée**
- **Étape 3** → Bouton "Suivant" → **Étape 4**
- **Étape 4** → Bouton "Soumettre la demande" → **Soumission**

---

## 🎯 **Test de l'Étape 4**

### **1. Navigation**
- [ ] Aller à l'étape 1, remplir tous les champs
- [ ] Cliquer "Suivant" → Étape 2
- [ ] Remplir l'étape 2, cliquer "Suivant" → Étape 3
- [ ] Remplir l'étape 3, cliquer "Suivant" → **Étape 4**
- [ ] Vérifier que l'étape 4 s'affiche avec le composant `MotivationLetterInput`

### **2. Fonctionnalités de l'Étape 4**
- [ ] **Choix texte** : Cliquer sur "Rédiger"
- [ ] **Zone de texte** : S'affiche avec placeholder
- [ ] **Choix fichier** : Cliquer sur "Uploader"
- [ ] **Zone d'upload** : S'affiche avec drag & drop
- [ ] **Validation** : Les deux options ne peuvent pas être remplies en même temps

### **3. Validation**
- [ ] **Sans rien** : Erreur "Vous devez fournir une lettre de motivation"
- [ ] **Avec texte court** : Erreur "Minimum 100 caractères"
- [ ] **Avec fichier invalide** : Erreur de type/taille
- [ ] **Avec texte valide** : ✅ Valide
- [ ] **Avec fichier valide** : ✅ Valide

### **4. Soumission**
- [ ] **Remplir lettre valide** → Cliquer "Soumettre la demande"
- [ ] **Upload fichier** → Vérifier l'upload vers Supabase
- [ ] **Sauvegarde en base** → Vérifier les champs `motivation_letter_text` et `motivation_letter_url`

---

## 🔧 **Dépannage**

### **Problème : Étape 4 ne s'affiche pas**
```typescript
// Vérifier dans le code :
{step === 4 && (
  <motion.form>
    <MotivationLetterInput />
  </motion.form>
)}
```

### **Problème : Navigation bloquée à l'étape 3**
```typescript
// Vérifier la validation de l'étape 3 :
validateStep(3) // Doit retourner true
```

### **Problème : Composant MotivationLetterInput non trouvé**
```bash
# Vérifier que le fichier existe :
ls src/components/ui/motivation-letter-input.tsx
```

### **Problème : Validation échoue**
```typescript
// Vérifier les logs console :
console.log('🔧 PaymentDay validation:', stringValue, typeof stringValue);
```

---

## 📊 **Structure Attendue**

### **Étape 4 - Interface**
```
┌─────────────────────────────────────┐
│ Lettre de motivation *             │
│                                     │
│ [Rédiger] [Uploader]               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Rédigez votre lettre de        │ │
│ │ motivation ici...               │ │
│ │                                 │ │
│ │ Minimum 100 caractères          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Précédent] [Soumettre la demande] │
└─────────────────────────────────────┘
```

### **Données Envoyées**
```json
{
  "motivation_letter_text": "Texte de la lettre...",
  "motivation_letter_url": "https://...",
  "payment_day": 15,
  // ... autres champs
}
```

---

## ✅ **Checklist de Validation**

- [ ] Étape 4 s'affiche après l'étape 3
- [ ] Composant MotivationLetterInput fonctionne
- [ ] Choix texte/fichier exclusif
- [ ] Validation côté client
- [ ] Upload de fichier vers Supabase
- [ ] Sauvegarde en base de données
- [ ] Messages d'erreur appropriés
- [ ] Navigation fluide entre étapes
- [ ] Soumission finale réussie

---

## 🐛 **Problèmes Courants**

### **1. "MotivationLetterInput not found"**
- Vérifier l'import : `import { MotivationLetterInput } from '@/components/ui/motivation-letter-input'`
- Vérifier que le fichier existe

### **2. "Validation échoue à l'étape 4"**
- Vérifier la fonction `validateMotivationLetter()`
- Vérifier les champs `motivation_letter_text` et `motivation_letter_url`

### **3. "Upload ne fonctionne pas"**
- Vérifier l'API `/api/partnership/upload`
- Vérifier les politiques RLS Supabase
- Vérifier la taille et le type de fichier

### **4. "Navigation bloquée"**
- Vérifier `validateStep(4)` dans `handleSubmitStep`
- Vérifier les erreurs de validation

---

## 📞 **Support**

Si l'étape 4 ne fonctionne pas :
1. Vérifier les logs console (F12)
2. Contrôler que tous les composants sont importés
3. Tester la validation étape par étape
4. Vérifier la navigation entre étapes 