# 🔍 Diagnostic - Problème de mise à jour des avis

## 🚨 Problème identifié
L'API `/api/avis` retourne une erreur 404 et "fetch failed", empêchant la mise à jour immédiate des avis.

## 📋 Étapes de diagnostic

### 1️⃣ **Vérifier les variables d'environnement**
Dans votre fichier `.env.local`, vérifiez que vous avez :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
JWT_SECRET=votre_secret_jwt
```

### 2️⃣ **Exécuter le script de vérification SQL**
Copiez et exécutez `scripts/verification-rapide.sql` dans l'éditeur SQL de Supabase pour vérifier :
- ✅ Structure des tables
- ✅ Données existantes
- ✅ Contraintes
- ✅ Jointures

### 3️⃣ **Vérifier les logs de l'API**
1. Ouvrez la console du navigateur (F12)
2. Allez sur la page de profil → Onglet "Avis"
3. Créez un avis
4. Regardez les logs qui commencent par `🔧`, `📡`, `❌`, etc.

### 4️⃣ **Tester l'API directement**
Exécutez le script `test-api.js` pour tester l'API :
```bash
node test-api.js
```

## 🔧 Solutions possibles

### **Solution A : Problème de variables d'environnement**
Si les logs montrent "Variables d'environnement Supabase manquantes" :
1. Vérifiez votre fichier `.env.local`
2. Redémarrez le serveur : `npm run dev`

### **Solution B : Problème de base de données**
Si les logs montrent "Employé non trouvé" :
1. Exécutez `scripts/verification-rapide.sql`
2. Vérifiez qu'il y a des employés dans la table
3. Vérifiez que le `user_id` correspond

### **Solution C : Problème de contraintes**
Si les logs montrent une erreur de contrainte :
1. Exécutez `scripts/correction-avis-employee-id.sql`
2. Vérifiez que la contrainte pointe vers `employees(id)`

### **Solution D : Problème de RLS**
Si les logs montrent une erreur RLS :
1. Vérifiez que RLS est désactivé sur la table `avis`
2. Exécutez : `ALTER TABLE avis DISABLE ROW LEVEL SECURITY;`

## 📊 Logs à surveiller

### **Logs normaux :**
```
🔧 POST /api/avis - Début de la requête
✅ Utilisateur authentifié: user@example.com
🔧 Création du client Supabase...
✅ Client Supabase créé avec succès
👤 Recherche de l'employé...
✅ Employé trouvé: 123
✅ Avis créé avec succès: 456
```

### **Logs d'erreur :**
```
❌ Variables d'environnement Supabase manquantes
❌ Employé non trouvé
❌ Erreur lors de la création de l'avis
```

## 🎯 Résultat attendu
Après correction, vous devriez voir :
- ✅ L'avis apparaît immédiatement après création
- ✅ Plus besoin de rafraîchir la page
- ✅ Type de retour automatique selon les étoiles

## 📞 Prochaines étapes
1. Exécutez les étapes de diagnostic
2. Dites-moi ce que vous voyez dans les logs
3. Je vous aiderai à résoudre le problème spécifique 