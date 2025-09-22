# 🔐 Intégration Vérification PIN - Edge Function

## 📋 **Préparation terminée côté Frontend**

### ✅ **Modifications apportées :**

1. **Route API supprimée** : `/api/auth/verify-pin` supprimée
2. **Vérification frontend désactivée** : Temporairement commentée
3. **PIN ajouté aux données** : Le PIN est maintenant envoyé à l'edge function
4. **Types TypeScript mis à jour** : `CreateDemandRequest` inclut le PIN

### 🔄 **Flux actuel :**

```
1. Frontend (salary-advance-form.tsx)
   ↓ (envoie PIN dans demandData)
2. useEmployeeDemands.createDemand()
   ↓ (transmet le PIN)
3. /api/employee-demands/create
   ↓ (passe le PIN à l'edge function)
4. Edge Function employee-demands/create
   ↓ (DOIT vérifier le PIN ici)
5. Base de données Supabase
```

## 🛠️ **À implémenter côté Edge Function**

### 📝 **Données reçues :**

L'edge function reçoit maintenant :
```typescript
{
  montant_demande: number,
  type_motif: string,
  motif: string,
  numero_reception?: string,
  enable_multi_months?: boolean,
  months?: number,
  pin: string // ← NOUVEAU : PIN à vérifier
}
```

### 🔐 **Vérification PIN requise :**

**Dans l'edge function `employee-demands/create` :**

1. **Récupérer le PIN** depuis `requestData.pin`
2. **Récupérer l'ID employé** depuis le token JWT
3. **Vérifier le PIN** en base de données :
   ```sql
   SELECT pin FROM employes 
   WHERE id = employe_id AND user_id = user_id_from_token
   ```
4. **Comparer les PIN** : `employeData.pin === requestData.pin`
5. **Si incorrect** : Retourner erreur 401
6. **Si correct** : Continuer la création de la demande

### 📊 **Structure de réponse d'erreur :**

```typescript
// Si PIN incorrect
{
  success: false,
  error: "Code PIN incorrect",
  message: "Le code PIN saisi ne correspond pas à votre compte"
}

// Si PIN manquant
{
  success: false,
  error: "Code PIN requis",
  message: "Un code PIN est requis pour créer une demande"
}
```

### 🧪 **Test de validation :**

**Scénarios à tester :**
- ✅ PIN correct → Demande créée
- ❌ PIN incorrect → Erreur 401
- ❌ PIN manquant → Erreur 400
- ❌ PIN < 6 chiffres → Erreur 400
- ❌ PIN > 6 chiffres → Erreur 400

## 🚀 **Avantages de cette approche :**

1. **Sécurité maximale** : Vérification côté serveur
2. **Pas de contournement** : Impossible de bypasser la vérification
3. **Cohérence** : Même logique pour tous les clients
4. **Audit** : Logs centralisés côté edge function

## 📝 **Notes importantes :**

- Le PIN est envoyé en **clair** (à chiffrer si nécessaire)
- La vérification doit être **synchrone** avant création
- Les **tentatives échouées** peuvent être loggées
- Le **rate limiting** peut être ajouté côté edge function

---

**Status :** ✅ Frontend prêt - ⏳ Edge Function à implémenter















