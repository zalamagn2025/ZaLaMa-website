# 🔑 Guide de Résolution - Changement de Mot de Passe

## 🚨 Problème Identifié

L'erreur **"Route non trouvée. Utilisez /register, /login, /getme, /update-profile, /upload-photo ou /debug"** indique que l'Edge Function `employee-auth` n'a **pas** la route `change-password` implémentée.

## ✅ Solution

### 1. Déployer la Route Change-Password

Exécutez le script de déploiement :

```bash
npm run edge:deploy-employee-auth-change-password
```

Ce script va :
- ✅ Ajouter la route `POST /change-password` à l'Edge Function
- ✅ Implémenter la logique de changement de mot de passe
- ✅ Déployer automatiquement l'Edge Function

### 2. Vérifier le Déploiement

Après le déploiement, testez que la route fonctionne :

```bash
npm run test:change-password-after-deploy
```

### 3. Tester la Page

1. **Connectez-vous** via `/login` pour obtenir un token valide
2. **Allez sur** `/auth/change-password`
3. **Testez** le changement de mot de passe

## 🔧 Outils de Diagnostic

### Page de Debug
- **URL** : `/debug-auth`
- **Fonction** : Vérifier l'état d'authentification et les tokens

### Scripts de Test
- `npm run test:change-password` : Test de base de l'API
- `npm run test:change-password-after-deploy` : Test après déploiement
- `npm run check:auth` : Vérification des tokens

## 📋 Fonctionnalités de la Route Change-Password

La nouvelle route implémente :

- ✅ **Authentification JWT** : Vérification du token
- ✅ **Validation des données** : Ancien et nouveau mot de passe requis
- ✅ **Vérification de l'ancien mot de passe** : Comparaison avec le hash en base
- ✅ **Hachage sécurisé** : Nouveau mot de passe hashé avec bcrypt
- ✅ **Mise à jour en base** : Modification du `password_hash`
- ✅ **Nouveau token** : Génération d'un nouveau token de session
- ✅ **Gestion d'erreurs** : Messages d'erreur clairs

## 🎯 Workflow Complet

1. **Déployer** : `npm run edge:deploy-employee-auth-change-password`
2. **Tester** : `npm run test:change-password-after-deploy`
3. **Se connecter** : Aller sur `/login`
4. **Tester la page** : Aller sur `/auth/change-password`
5. **Changer le mot de passe** : Utiliser l'interface

## 🔍 Vérifications

### Si le problème persiste :

1. **Vérifiez les tokens** : `/debug-auth`
2. **Vérifiez la connexion** : `/login`
3. **Vérifiez les logs** : Console du navigateur
4. **Vérifiez l'Edge Function** : Logs Supabase

### Messages d'erreur courants :

- **"Route non trouvée"** → Route pas encore déployée
- **"Token d'autorisation requis"** → Pas connecté
- **"Token invalide ou expiré"** → Se reconnecter
- **"Ancien mot de passe incorrect"** → Vérifier le mot de passe actuel

## 🎉 Résultat Attendu

Après le déploiement, la page de changement de mot de passe devrait :
- ✅ Afficher le formulaire correctement
- ✅ Valider les mots de passe
- ✅ Envoyer la requête à l'API
- ✅ Afficher un message de succès
- ✅ Rediriger vers `/profile`

## 📞 Support

Si le problème persiste après ces étapes :
1. Vérifiez les logs de l'Edge Function dans Supabase
2. Vérifiez que l'Edge Function est bien déployée
3. Vérifiez que la base de données est accessible
