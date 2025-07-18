# 🚨 Guide de Dépannage - Erreur "fetch failed"

## **Problème Identifié**
```
TypeError: fetch failed
POST /api/partnership 500 in 22287ms
```

## ✅ **Solutions Immédiates**

### **Étape 1: Vérifier les Variables d'Environnement**

1. **Exécuter le script de vérification**
   ```bash
   node scripts/check-env-variables.js
   ```

2. **Vérifier votre fichier `.env.local`**
   ```env
   NEXT_PRIVATE_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PRIVATE_SUPABASE_ANON_KEY=votre_clé_anon
   SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
   ```

### **Étape 2: Redémarrer le Serveur**

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### **Étape 3: Vérifier la Connexion Internet**

L'erreur `fetch failed` peut indiquer un problème de réseau.

## 🔧 **Corrections Apportées**

### **1. API Partnership Corrigée**
- ✅ Utilisation de `createServerClient` au lieu de `createClient`
- ✅ Gestion des cookies pour Next.js App Router
- ✅ Logs de debug améliorés

### **2. Gestion d'Erreur Améliorée**
- ✅ Logs détaillés des erreurs Supabase
- ✅ Vérification des variables d'environnement
- ✅ Messages d'erreur plus informatifs

## 🧪 **Tests de Vérification**

### **Test 1: Variables d'Environnement**
```bash
node scripts/check-env-variables.js
```

### **Test 2: Connexion Supabase**
```bash
# Vérifier que la table existe
# Dans Supabase SQL Editor:
SELECT * FROM partnership_requests LIMIT 1;
```

### **Test 3: API Endpoint**
```bash
# Tester l'API directement
curl -X POST http://localhost:3000/api/partnership \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🚨 **Problèmes Courants et Solutions**

### **Problème 1: Variables d'environnement manquantes**
```bash
# Solution: Vérifier .env.local
cat .env.local
```

### **Problème 2: Clés Supabase incorrectes**
```bash
# Solution: Vérifier dans Supabase Dashboard
# Settings → API → Project API keys
```

### **Problème 3: Table inexistante**
```sql
-- Solution: Vérifier que la table existe
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'partnership_requests';
```

### **Problème 4: Problème de réseau**
```bash
# Solution: Vérifier la connectivité
ping votre-projet.supabase.co
```

## 📊 **Logs à Surveiller**

### **Logs Normaux**
```
📤 Tentative d'insertion des données: {...}
🔗 URL Supabase: https://...
🔑 Clé Supabase configurée: true
✅ Données insérées avec succès: {...}
```

### **Logs d'Erreur**
```
❌ Erreur Supabase: { message: '...', details: '...', hint: '...', code: '...' }
```

## 🎯 **Étapes de Résolution**

1. **Exécuter le script de vérification**
2. **Vérifier les variables d'environnement**
3. **Redémarrer le serveur**
4. **Tester l'API**
5. **Vérifier les logs**

## 📞 **Support**

Si le problème persiste :

1. **Vérifiez les logs** dans le terminal
2. **Exécutez les tests** de vérification
3. **Vérifiez la connectivité** à Supabase
4. **Contactez le support** si nécessaire

---

**✅ L'API a été corrigée pour utiliser le bon client Supabase !** 