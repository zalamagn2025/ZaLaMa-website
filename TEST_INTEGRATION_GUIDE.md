# 🧪 Guide de Test - Intégration Account Management

## ✅ **Tests Automatiques**

### **1. Exécuter le script de test**
```bash
node test-account-management.js
```

### **2. Vérifier les endpoints**
```bash
# Test API Route
curl -X POST http://localhost:3000/api/account-management \
  -H "Content-Type: application/json" \
  -d '{"action": "get_accounts", "data": {"deviceId": "test"}}'

# Test Edge Function directe
curl -X POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/account-management \
  -H "Content-Type: application/json" \
  -d '{"action": "get_accounts", "data": {"deviceId": "test"}}'
```

## 🎯 **Tests Manuels**

### **1. Test de l'interface utilisateur**

#### **Étape 1: Démarrer le serveur**
```bash
npm run dev
```

#### **Étape 2: Aller sur la page de connexion**
```
http://localhost:3000/auth/login
```

#### **Étape 3: Vérifier l'affichage**
- ✅ Page de connexion s'affiche
- ✅ Interface responsive
- ✅ Animations fluides
- ✅ Pas d'erreurs dans la console

### **2. Test du flux de connexion**

#### **Premier accès (nouvel utilisateur)**
1. Cliquer sur "Se connecter avec un autre compte"
2. Remplir le formulaire de connexion
3. Se connecter avec email + mot de passe
4. ✅ Vérifier que le compte est sauvegardé
5. ✅ Vérifier la redirection vers /dashboard

#### **Retour utilisateur (comptes existants)**
1. Rafraîchir la page
2. ✅ Vérifier que les comptes s'affichent
3. Cliquer sur un compte
4. Saisir le PIN (6 chiffres)
5. ✅ Vérifier la connexion rapide
6. ✅ Vérifier la redirection vers /dashboard

### **3. Test des fonctionnalités**

#### **Gestion des comptes**
- ✅ Affichage du dernier compte utilisé
- ✅ Liste des autres comptes
- ✅ Suppression de comptes
- ✅ Ajout de nouveaux comptes

#### **Vérification PIN**
- ✅ Saisie de PIN (6 chiffres)
- ✅ Validation du format
- ✅ Vérification via API
- ✅ Gestion des erreurs

#### **Sécurité**
- ✅ PIN jamais stocké
- ✅ Chiffrement localStorage
- ✅ Validation côté serveur
- ✅ Gestion des tokens

## 🔍 **Vérifications Techniques**

### **1. Console du navigateur**
```javascript
// Vérifier que les comptes sont chargés
console.log('Comptes:', localStorage.getItem('zalama_accounts'))

// Vérifier le device ID
console.log('Device ID:', localStorage.getItem('zalama_device_id'))

// Vérifier l'état d'authentification
console.log('Token:', localStorage.getItem('employee_access_token'))
```

### **2. Network Tab**
- ✅ Requêtes vers `/api/account-management`
- ✅ Requêtes vers l'Edge Function
- ✅ Pas d'erreurs 404/500
- ✅ Temps de réponse < 2s

### **3. Base de données**
```sql
-- Vérifier les comptes sauvegardés
SELECT * FROM device_accounts ORDER BY last_login DESC;

-- Vérifier les sessions
SELECT * FROM account_sessions;

-- Vérifier l'historique
SELECT * FROM login_history ORDER BY created_at DESC;
```

## 🚨 **Dépannage**

### **Erreurs courantes**

#### **1. "Module not found"**
```bash
npm install crypto-js @types/crypto-js
```

#### **2. "Edge Function not found"**
```bash
npx supabase@latest functions deploy account-management
```

#### **3. "Tables not found"**
Exécuter le script SQL de création des tables

#### **4. "CORS error"**
Vérifier que l'Edge Function a les bons headers CORS

#### **5. "Token invalid"**
Vérifier les variables d'environnement

### **Logs utiles**
```javascript
// Activer les logs détaillés
localStorage.setItem('debug', 'true')

// Vérifier les erreurs
console.error('Erreur:', error)
```

## 📊 **Métriques de Performance**

### **Temps de réponse attendus**
- API Route: < 500ms
- Edge Function: < 1s
- Chargement comptes: < 2s
- Vérification PIN: < 1s

### **Taux de succès attendus**
- Connexion: > 95%
- Vérification PIN: > 90%
- Sauvegarde compte: > 99%

## ✅ **Checklist de Validation**

- [ ] API Route fonctionne
- [ ] Edge Function déployée
- [ ] Tables créées
- [ ] Variables d'environnement configurées
- [ ] Interface utilisateur responsive
- [ ] Flux de connexion complet
- [ ] Gestion des erreurs
- [ ] Sécurité respectée
- [ ] Performance acceptable
- [ ] Tests automatisés passent

## 🎉 **Validation Finale**

L'intégration est considérée comme réussie si :
1. ✅ Tous les tests automatiques passent
2. ✅ L'interface utilisateur fonctionne
3. ✅ Le flux de connexion est complet
4. ✅ Aucune erreur critique
5. ✅ Performance acceptable

**🚀 L'intégration est prête pour la production !**
