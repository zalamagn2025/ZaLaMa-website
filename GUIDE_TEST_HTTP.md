# 🧪 Guide de Test HTTP - API Account Management

## 📁 **Fichiers de Test Disponibles**

### **1. `test-account-management.http`** - Tests Complets
- ✅ 20 tests différents
- ✅ Tous les scénarios possibles
- ✅ Tests de performance
- ✅ Tests d'erreurs
- ✅ Tests de nettoyage

### **2. `test-api-simple.http`** - Tests Rapides
- ✅ 5 tests essentiels
- ✅ Tests de base
- ✅ Idéal pour débuter

## 🚀 **Comment Utiliser les Fichiers HTTP**

### **Avec VS Code (REST Client Extension)**

1. **Installer l'extension :**
   ```
   Extensions → Rechercher "REST Client" → Installer
   ```

2. **Ouvrir le fichier :**
   ```
   test-api-simple.http
   ```

3. **Exécuter les tests :**
   - Cliquer sur "Send Request" au-dessus de chaque requête
   - Ou utiliser `Ctrl+Alt+R` (Windows) / `Cmd+Alt+R` (Mac)

### **Avec IntelliJ IDEA / WebStorm**

1. **Ouvrir le fichier :**
   ```
   test-account-management.http
   ```

2. **Exécuter les tests :**
   - Cliquer sur le bouton ▶️ à côté de chaque requête
   - Ou utiliser `Ctrl+Shift+F10`

### **Avec cURL (Terminal)**

```bash
# Copier-coller les requêtes dans le terminal
curl -X POST http://localhost:3000/api/account-management \
  -H "Content-Type: application/json" \
  -d '{"action": "get_accounts", "data": {"deviceId": "test-device-123"}}'
```

## 🎯 **Tests Recommandés par Ordre**

### **1. Tests de Base (test-api-simple.http)**
```
1. Test basique - Récupérer les comptes
2. Test de sauvegarde (sans token)
3. Test de vérification PIN
4. Test d'action invalide
5. Test de méthode GET (non autorisée)
```

### **2. Tests Avancés (test-account-management.http)**
```
1. Test de l'API Route Next.js
2. Test de l'Edge Function directe
3. Test de sauvegarde avec token
4. Test de vérification PIN
5. Test de suppression de compte
6. Test de mise à jour dernière connexion
7. Test d'action invalide
8. Test de méthode GET
9. Test de requête malformée
10. Test avec données complètes
```

## 📊 **Résultats Attendus**

### **✅ Succès (200 OK)**
```json
{
  "success": true,
  "accounts": [],
  "message": "Comptes récupérés avec succès"
}
```

### **❌ Erreur d'Authentification (401)**
```json
{
  "success": false,
  "error": "Token d'authentification requis",
  "details": ["Le token Bearer est manquant"]
}
```

### **❌ Erreur de Validation (400)**
```json
{
  "success": false,
  "error": "Action requise",
  "details": ["Le paramètre \"action\" est obligatoire"]
}
```

### **❌ Méthode Non Autorisée (405)**
```json
{
  "success": false,
  "error": "Méthode non autorisée",
  "details": ["Seule la méthode POST est supportée"]
}
```

## 🔧 **Configuration des Variables**

### **Modifier les Variables dans le Fichier HTTP**
```http
### Variables
@baseUrl = http://localhost:3000
@deviceId = test-device-123
@testToken = your_actual_token_here
```

### **Variables d'Environnement**
```bash
# Dans .env.local
NEXT_PUBLIC_SUPABASE_URL=https://mspmrzlqhwpdkkburjiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ton_anon_key
SUPABASE_SERVICE_ROLE_KEY=ton_service_role_key
```

## 🚨 **Dépannage**

### **Erreur "Connection refused"**
```bash
# Vérifier que le serveur tourne
npm run dev

# Vérifier le port
curl http://localhost:3000
```

### **Erreur "404 Not Found"**
```bash
# Vérifier l'URL de l'API
curl http://localhost:3000/api/account-management
```

### **Erreur "500 Internal Server Error"**
```bash
# Vérifier les logs du serveur
# Vérifier que l'Edge Function est déployée
npx supabase@latest functions list
```

### **Erreur "CORS"**
```bash
# Vérifier les headers CORS dans l'Edge Function
# Vérifier que l'API Route a les bons headers
```

## 📈 **Métriques de Performance**

### **Temps de Réponse Attendus**
- API Route: < 500ms
- Edge Function: < 1s
- Requêtes simples: < 200ms

### **Taux de Succès Attendus**
- Requêtes valides: > 95%
- Gestion d'erreurs: > 99%
- Validation: > 99%

## 🎉 **Validation Finale**

L'API est considérée comme fonctionnelle si :
- ✅ Tous les tests de base passent
- ✅ Les erreurs sont gérées correctement
- ✅ Les temps de réponse sont acceptables
- ✅ Aucune erreur critique dans les logs

## 💡 **Conseils d'Utilisation**

1. **Commencer par les tests simples**
2. **Vérifier les logs du serveur**
3. **Tester avec des données réelles**
4. **Vérifier la sécurité (tokens)**
5. **Nettoyer après les tests**

**🚀 Prêt à tester l'API !**
