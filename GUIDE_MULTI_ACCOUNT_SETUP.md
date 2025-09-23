# 🚀 Guide d'Installation - Système Multi-Comptes ZaLaMa

## ✅ **Ce qui a été créé**

### **1. Types TypeScript**
- `src/types/account-session.ts` - Interfaces pour la gestion des comptes

### **2. Services**
- `src/services/web-encryption.ts` - Chiffrement des données localStorage
- `src/services/account-session-service.ts` - Gestion des comptes via Edge Function

### **3. Hook React**
- `src/hooks/useAccountSession.ts` - Hook pour la gestion des comptes

### **4. Composants UI**
- `src/components/auth/account-selector.tsx` - Sélecteur de comptes
- `src/components/auth/quick-pin-verification.tsx` - Vérification PIN rapide

### **5. Page de connexion**
- `src/app/auth/login/page.tsx` - Page de connexion mise à jour

### **6. Edge Function**
- `supabase/functions/account-management/index.ts` - API backend

## 🔧 **Configuration requise**

### **1. Variables d'environnement**

Crée un fichier `.env.local` avec :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ton_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=ton_service_role_key_ici

# Edge Function URL
NEXT_PUBLIC_EDGE_FUNCTION_URL=https://ton-projet.supabase.co/functions/v1/account-management

# Clé de chiffrement pour localStorage
NEXT_PUBLIC_ENCRYPTION_KEY=zalama_super_secret_key_2024

# PIN Salt (pour l'Edge Function)
PIN_SALT=zalama_pin_salt_2024
```

### **2. Déployer l'Edge Function**

```bash
npx supabase@latest functions deploy account-management
```

### **3. Vérifier les tables**

Assure-toi que les tables sont créées dans Supabase :
- `device_accounts`
- `account_sessions` (optionnel)
- `login_history` (optionnel)

## 🎯 **Comment ça fonctionne**

### **1. Premier accès**
1. Utilisateur se connecte normalement (email + mot de passe)
2. Les infos de profil sont sauvegardées dans `device_accounts`
3. Redirection vers le dashboard

### **2. Retour utilisateur**
1. Affichage des comptes depuis localStorage
2. Clic sur un compte → Saisie du PIN
3. Vérification via `/api/auth/verify-password`
4. Connexion rapide si PIN correct

### **3. Sécurité**
- ✅ PIN jamais stocké (ni en clair ni en hash)
- ✅ Vérification via API existante
- ✅ Chiffrement des données localStorage
- ✅ RLS activé sur les tables

## 🔄 **Intégration avec l'existant**

### **1. Modifier la connexion existante**

Dans ton composant de connexion actuel, ajoute :

```typescript
import { useAccountSession } from '@/hooks/useAccountSession'

const { saveAccount } = useAccountSession()

// Après connexion réussie
const handleLoginSuccess = (userData: any) => {
  // Sauvegarder le compte
  saveAccount(userData)
  // Rediriger
  router.push('/dashboard')
}
```

### **2. Utiliser la page de connexion**

Remplace ta page de connexion actuelle par :
- `src/app/auth/login/page.tsx` (déjà créée)

## 🧪 **Test de la fonctionnalité**

### **1. Test local**

```bash
# Démarrer le serveur
npm run dev

# Aller sur /auth/login
# Tester la sélection de comptes
# Tester la vérification PIN
```

### **2. Test Edge Function**

```bash
# Tester l'API
curl -X POST https://ton-projet.supabase.co/functions/v1/account-management \
  -H "Content-Type: application/json" \
  -d '{"action": "get_accounts", "data": {"deviceId": "test"}}'
```

## 🚨 **Dépannage**

### **1. Erreur de types crypto-js**
```bash
npm install @types/crypto-js --save-dev
# Redémarrer le serveur de développement
```

### **2. Edge Function non déployée**
```bash
npx supabase@latest functions deploy account-management
```

### **3. Tables manquantes**
Exécuter le script SQL de création des tables

### **4. Variables d'environnement**
Vérifier que `.env.local` est bien configuré

## 📱 **Fonctionnalités**

- ✅ Sélection de comptes multiples
- ✅ Connexion rapide par PIN
- ✅ Sauvegarde sécurisée des profils
- ✅ Suppression de comptes
- ✅ Interface responsive
- ✅ Animations fluides
- ✅ Gestion d'erreurs

## 🎉 **C'est prêt !**

Le système multi-comptes est maintenant intégré dans ton projet ZaLaMa !

**Prochaines étapes :**
1. Configurer les variables d'environnement
2. Déployer l'Edge Function
3. Tester la fonctionnalité
4. Intégrer avec ton système de connexion existant
