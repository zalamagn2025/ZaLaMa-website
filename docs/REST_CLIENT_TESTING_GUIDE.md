# 🧪 Guide de Test avec REST Client

## 📋 Vue d'ensemble

Ce guide vous explique comment utiliser l'extension REST Client de VS Code pour tester l'Edge Function Supabase `salary-setup` et l'API locale Next.js.

## 🔧 Prérequis

### **1. Extension REST Client**
- Installez l'extension "REST Client" dans VS Code
- ID: `humao.rest-client`

### **2. Fichiers de test**
- `rest/salary-setup-tests.http` : Tests complets
- `rest/rest-client.env.json` : Variables d'environnement

## 🚀 Configuration

### **1. Variables d'environnement**
Modifiez le fichier `rest/rest-client.env.json` :

```json
{
  "development": {
    "access_token": "votre-vrai-token-ici",
    "rh_access_token": "votre-token-rh-ici",
    "responsable_access_token": "votre-token-responsable-ici",
    "admin_access_token": "votre-token-admin-ici"
  }
}
```

### **2. Obtenir des tokens d'accès**

#### **Via Supabase Dashboard :**
1. Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Authentication > Users**
4. Créez des utilisateurs avec les rôles appropriés

#### **Via API Supabase Auth :**
```bash
# Exemple pour obtenir un token
curl -X POST 'https://mspmrzlqhwpdkkburjiw.supabase.co/auth/v1/token?grant_type=password' \
  -H 'Content-Type: application/json' \
  -H 'apikey: your-anon-key' \
  -d '{
    "email": "rh@example.com",
    "password": "password123"
  }'
```

## 🧪 Tests disponibles

### **Tests Edge Function Supabase**

#### **1. Vérification du besoin de configuration**
```http
GET https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/check
Authorization: Bearer {{access_token}}
```

**Réponse attendue :**
```json
{
  "success": true,
  "needsSetup": true,
  "user": {
    "id": "user-uuid",
    "role": "rh",
    "email": "rh@example.com",
    "display_name": "John Doe",
    "currentSalary": 0,
    "partner": {
      "id": "partner-uuid",
      "company_name": "Entreprise Example"
    }
  }
}
```

#### **2. Configuration du salaire RH**
```http
POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/configure
Authorization: Bearer {{rh_access_token}}
Content-Type: application/json

{
  "salaire_net": 750000,
  "type_contrat": "CDI",
  "date_embauche": "2024-01-15",
  "poste": "Responsable RH"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Salaire configuré avec succès",
  "employee": {
    "id": "employee-uuid",
    "salaire_net": 750000,
    "poste": "Responsable RH",
    "type_contrat": "CDI",
    "updated_at": "2024-12-01T10:00:00Z"
  }
}
```

#### **3. Récupération de l'historique**
```http
GET https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/history
Authorization: Bearer {{access_token}}
```

### **Tests API Locale Next.js**

#### **1. Vérification locale**
```http
GET http://localhost:3000/api/salary-setup/check
Authorization: Bearer {{access_token}}
```

#### **2. Configuration locale**
```http
POST http://localhost:3000/api/salary-setup/configure
Authorization: Bearer {{rh_access_token}}
Content-Type: application/json

{
  "salaire_net": 750000,
  "type_contrat": "CDI",
  "date_embauche": "2024-01-15",
  "poste": "Responsable RH"
}
```

## 🔍 Tests de validation

### **1. Salaire négatif**
```http
POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/configure
Authorization: Bearer {{rh_access_token}}
Content-Type: application/json

{
  "salaire_net": -1000,
  "type_contrat": "CDI",
  "date_embauche": "2024-01-15",
  "poste": "Test"
}
```

**Réponse attendue :**
```json
{
  "success": false,
  "error": "Le salaire doit être entre 1 et 10 000 000 FG"
}
```

### **2. Type de contrat invalide**
```http
POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/configure
Authorization: Bearer {{rh_access_token}}
Content-Type: application/json

{
  "salaire_net": 750000,
  "type_contrat": "INVALID",
  "date_embauche": "2024-01-15",
  "poste": "Test"
}
```

### **3. Date future**
```http
POST https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/configure
Authorization: Bearer {{rh_access_token}}
Content-Type: application/json

{
  "salaire_net": 750000,
  "type_contrat": "CDI",
  "date_embauche": "2025-01-01",
  "poste": "Test"
}
```

## 🎯 Comment exécuter les tests

### **1. Ouvrir le fichier de test**
- Ouvrez `rest/salary-setup-tests.http` dans VS Code

### **2. Sélectionner l'environnement**
- En haut du fichier, sélectionnez l'environnement (development/production)

### **3. Exécuter un test**
- Cliquez sur "Send Request" au-dessus de chaque requête
- Ou utilisez `Ctrl+Alt+R` (Windows/Linux) ou `Cmd+Alt+R` (Mac)

### **4. Voir les résultats**
- Les résultats s'affichent dans un nouvel onglet
- Vérifiez le statut HTTP et la réponse JSON

## 📊 Interprétation des résultats

### **Codes de statut HTTP**
- `200` : Succès
- `400` : Erreur de validation
- `401` : Token invalide ou manquant
- `403` : Accès non autorisé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

### **Réponses de succès**
```json
{
  "success": true,
  "message": "Opération réussie",
  "data": { ... }
}
```

### **Réponses d'erreur**
```json
{
  "success": false,
  "error": "Message d'erreur détaillé"
}
```

## 🔧 Dépannage

### **Problèmes courants**

#### **1. Token invalide (401)**
- Vérifiez que le token est valide
- Assurez-vous que l'utilisateur existe dans Supabase
- Vérifiez que le token n'a pas expiré

#### **2. Accès non autorisé (403)**
- Vérifiez que l'utilisateur a le rôle approprié (rh/responsable)
- Assurez-vous que l'utilisateur existe dans `admin_users`

#### **3. Erreur de validation (400)**
- Vérifiez les données envoyées
- Consultez les règles de validation

#### **4. Erreur serveur (500)**
- Vérifiez les logs de l'Edge Function
- Assurez-vous que la base de données est accessible

### **Logs utiles**
- **Edge Function** : Dashboard Supabase > Edge Functions > salary-setup > Logs
- **API locale** : Terminal où `npm run dev` est exécuté

## 📝 Checklist de test

- [ ] Tokens d'accès configurés
- [ ] Utilisateurs créés dans Supabase
- [ ] Rôles assignés correctement
- [ ] Table `salary_setup_history` créée
- [ ] Serveur Next.js démarré (pour tests locaux)
- [ ] Tests de validation passés
- [ ] Tests de succès passés
- [ ] Tests d'erreur passés

## 🎉 Prochaines étapes

1. **Tester avec de vrais utilisateurs**
2. **Vérifier l'affichage de la modale dans le frontend**
3. **Tester le flux complet de configuration**
4. **Vérifier l'historique dans la base de données**
5. **Tester les différents types de contrat**

---

**Note :** N'oubliez pas de remplacer les tokens de test par de vrais tokens avant de tester en production !
