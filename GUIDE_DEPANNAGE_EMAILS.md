# 🔧 GUIDE DE DÉPANNAGE - EMAILS ZALAMA

## 📧 **CONFIGURATION REQUISE**

### **Variables d'environnement nécessaires :**

```env
# Configuration Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@zalama.com
ADMIN_EMAIL=admin@zalamagn.com
```

## 📋 **EMAILS ENVOYÉS PAR DEMANDE DE PARTENARIAT**

Pour chaque demande de partenariat, **5 emails sont envoyés** :

1. **📧 Email à l'admin** (`ADMIN_EMAIL`)
   - **Destinataire** : `admin@zalamagn.com` (ou valeur de `ADMIN_EMAIL`)
   - **Contenu** : Template détaillé avec toutes les informations de la demande
   - **Objectif** : Notification complète de nouvelle demande

2. **📧 Email à contact@zalamagn.com**
   - **Destinataire** : `contact@zalamagn.com` (fixe)
   - **Contenu** : Template détaillé avec toutes les informations de la demande
   - **Objectif** : Notification pour l'équipe contact

3. **📧 Email de confirmation à l'entreprise** (`data.email`)
   - **Destinataire** : Email de l'entreprise (saisi dans le formulaire)
   - **Contenu** : Template de confirmation personnalisé
   - **Objectif** : Accusé de réception pour l'entreprise

4. **📧 Email de confirmation au représentant légal** (`data.rep_email`)
   - **Destinataire** : Email du représentant légal
   - **Contenu** : Template de confirmation personnalisé
   - **Objectif** : Accusé de réception pour le représentant

5. **📧 Email de confirmation au responsable RH** (`data.hr_email`)
   - **Destinataire** : Email du responsable RH
   - **Contenu** : Template de confirmation personnalisé
   - **Objectif** : Accusé de réception pour le RH

## 🔍 **DIAGNOSTIC DES PROBLÈMES**

### **1. Vérifier la configuration**

```bash
# Exécuter le script de test
node test-email-config.js
```

### **2. Problèmes courants**

#### **❌ RESEND_API_KEY manquante**
```
Erreur: Clé API Resend manquante. Veuillez configurer RESEND_API_KEY
```
**Solution :**
- Vérifier que `RESEND_API_KEY` est définie dans `.env`
- Obtenir une clé API depuis [Resend Dashboard](https://resend.com/api-keys)

#### **❌ Domaine non configuré**
```
Erreur: Domain not found
```
**Solution :**
- Configurer le domaine `zalama.com` dans Resend
- Vérifier les enregistrements DNS

#### **❌ Email FROM invalide**
```
Erreur: Invalid from address
```
**Solution :**
- Utiliser un email du domaine configuré : `noreply@zalama.com`
- Vérifier que le domaine est vérifié dans Resend

#### **❌ Rate limiting**
```
Erreur: Rate limit exceeded
```
**Solution :**
- Attendre quelques minutes
- Vérifier les limites de votre plan Resend

## 🧪 **TESTS MANUELS**

### **Test 1 : Configuration de base**
```bash
node test-email-config.js
```

### **Test 2 : Test professionnel complet**
```bash
node test-partnership-emails-pro.js
```

### **Test 2 : Envoi d'email simple**
```javascript
// Dans la console du navigateur ou un script Node.js
const testData = {
  company_name: "Test Entreprise",
  legal_status: "SARL",
  rccm: "GN-2023-B-12345",
  nif: "123456789",
  activity_domain: "Informatique",
  headquarters_address: "123 Test Street",
  phone: "+224123456789",
  email: "test@example.com", // Email valide pour test
  employees_count: 50,
  payroll: "50000000 GNF",
  cdi_count: 30,
  cdd_count: 20,
  payment_day: 25,
  rep_full_name: "Test Rep",
  rep_position: "Directeur",
  rep_email: "rep@test.com",
  rep_phone: "+224123456789",
  hr_full_name: "Test RH",
  hr_email: "rh@test.com",
  hr_phone: "+224123456789"
};

// Appeler l'API
fetch('/api/partnership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
});
```

## 📊 **MONITORING**

### **Logs à surveiller :**

```javascript
// Dans les logs de l'application
console.log('📧 Résultats envoi e-mails partenariat:', {
  company: data.company_name,
  adminSuccess: emailResult.adminEmail.success,
  userSuccess: emailResult.userEmail.success,
  overallSuccess: emailResult.overallSuccess
});
```

### **Erreurs courantes dans les logs :**

1. **`Clé API Resend manquante`** → Configurer `RESEND_API_KEY`
2. **`Domain not found`** → Configurer le domaine dans Resend
3. **`Invalid from address`** → Vérifier `EMAIL_FROM`
4. **`Rate limit exceeded`** → Attendre ou vérifier les limites

## 🚀 **SOLUTIONS RAPIDES**

### **1. Configuration minimale**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@zalama.com
ADMIN_EMAIL=admin@zalamagn.com
```

### **2. Test avec email temporaire**
- Utiliser un email Gmail temporaire pour les tests
- Vérifier que l'email arrive dans les spams

### **3. Vérification Resend**
- Se connecter au [Dashboard Resend](https://resend.com)
- Vérifier les domaines configurés
- Vérifier les logs d'envoi

## 📞 **SUPPORT**

Si les problèmes persistent :
1. Vérifier les logs de l'application
2. Exécuter `node test-email-config.js`
3. Vérifier la configuration Resend
4. Tester avec un email valide

---

**Dernière mise à jour :** $(date)  
**Version :** 1.0.0 