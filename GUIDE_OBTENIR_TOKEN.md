# 🔑 Guide pour Obtenir un Token d'Authentification

## 🚨 **Problème Identifié**

L'erreur 401 "Unauthorized" indique que :
- ✅ L'API Route fonctionne
- ✅ L'Edge Function fonctionne
- ❌ **Le token d'authentification manque ou est invalide**

## 🔧 **Solutions**

### **1. Pour les Tests de Base (sans authentification)**

Certaines actions ne nécessitent **PAS** de token :
- ✅ `get_accounts` - Récupérer les comptes
- ✅ `verify_pin` - Vérifier un PIN
- ✅ `remove_account` - Supprimer un compte
- ✅ `update_last_login` - Mettre à jour la dernière connexion

**Seule l'action `save_account` nécessite un token !**

### **2. Pour les Tests avec Authentification**

#### **Option A: Utiliser un Token de Test**

1. **Se connecter sur l'application :**
   ```
   http://localhost:3000/auth/login
   ```

2. **Ouvrir la console du navigateur (F12)**

3. **Récupérer le token :**
   ```javascript
   // Dans la console du navigateur
   const token = localStorage.getItem('employee_access_token')
   console.log('Token:', token)
   ```

4. **Copier le token et l'utiliser dans le fichier HTTP :**
   ```http
   @testToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

#### **Option B: Créer un Token de Test**

1. **Aller sur le dashboard Supabase :**
   ```
   https://supabase.com/dashboard/project/mspmrzlqhwpdkkburjiw
   ```

2. **Aller dans Authentication > Users**

3. **Créer un utilisateur de test ou utiliser un existant**

4. **Générer un token JWT de test**

#### **Option C: Utiliser l'API d'Authentification**

```bash
# Se connecter via l'API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@example.com",
    "password": "votre-mot-de-passe"
  }'
```

## 🧪 **Tests Recommandés par Ordre**

### **1. Tests Sans Token (devraient fonctionner)**
```http
### Test 1: Récupérer les comptes
POST http://localhost:3000/api/account-management
Content-Type: application/json

{
  "action": "get_accounts",
  "data": {"deviceId": "test-device-123"}
}
```

### **2. Tests Avec Token (nécessitent authentification)**
```http
### Test 2: Sauvegarder un compte
POST http://localhost:3000/api/account-management
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "action": "save_account",
  "data": {
    "deviceId": "test-device-123",
    "email": "test@example.com",
    "nom": "Test",
    "prenom": "User"
  }
}
```

## 🔍 **Diagnostic des Erreurs**

### **Erreur 401 - "Unauthorized"**
```json
{
  "success": false,
  "error": "Erreur lors de la requête",
  "details": []
}
```

**Causes possibles :**
- ❌ Token manquant
- ❌ Token invalide
- ❌ Token expiré
- ❌ Token mal formaté

### **Erreur 400 - "Bad Request"**
```json
{
  "success": false,
  "error": "Action requise",
  "details": ["Le paramètre \"action\" est obligatoire"]
}
```

**Causes possibles :**
- ❌ Action manquante
- ❌ Données manquantes
- ❌ Format JSON invalide

## 🎯 **Tests de Validation**

### **1. Vérifier que l'API Route fonctionne**
```bash
curl -X POST http://localhost:3000/api/account-management \
  -H "Content-Type: application/json" \
  -d '{"action": "get_accounts", "data": {"deviceId": "test"}}'
```

**Résultat attendu :**
```json
{
  "success": true,
  "accounts": []
}
```

### **2. Vérifier que l'Edge Function fonctionne**
```bash
curl -X POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/account-management \
  -H "Content-Type: application/json" \
  -d '{"action": "get_accounts", "data": {"deviceId": "test"}}'
```

**Résultat attendu :**
```json
{
  "success": true,
  "accounts": []
}
```

## 🚀 **Solution Rapide**

### **Pour tester immédiatement :**

1. **Utiliser les actions qui ne nécessitent pas de token :**
   - `get_accounts`
   - `verify_pin`
   - `remove_account`
   - `update_last_login`

2. **Modifier le fichier HTTP :**
   ```http
   ### Test sans token
   POST http://localhost:3000/api/account-management
   Content-Type: application/json

   {
     "action": "get_accounts",
     "data": {"deviceId": "test-device-123"}
   }
   ```

3. **Vérifier que ça fonctionne**

4. **Ensuite, obtenir un token pour tester `save_account`**

## 📋 **Checklist de Résolution**

- [ ] API Route répond (test `get_accounts`)
- [ ] Edge Function répond (test direct)
- [ ] Actions sans token fonctionnent
- [ ] Token d'authentification obtenu
- [ ] Actions avec token fonctionnent
- [ ] Gestion d'erreurs correcte

## 💡 **Conseils**

1. **Commencer par les tests simples** (sans token)
2. **Vérifier les logs du serveur** pour plus de détails
3. **Utiliser la console du navigateur** pour récupérer le token
4. **Tester étape par étape** plutôt que tout d'un coup

**🎯 L'erreur 401 est normale pour `save_account` sans token !**
