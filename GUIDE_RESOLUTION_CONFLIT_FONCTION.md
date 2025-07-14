# Guide de Résolution du Conflit de Fonction create_notification

## 🚨 Problème identifié

L'erreur `function create_notification(uuid, unknown, text, unknown) is not unique` indique qu'il y a plusieurs fonctions SQL nommées `create_notification` avec des signatures similaires dans votre base de données Supabase.

## 🔍 Diagnostic

### Cause du problème
- Plusieurs fonctions `create_notification` ont été créées avec des types de paramètres ambigus (`unknown`)
- PostgreSQL ne peut pas distinguer quelle fonction utiliser
- Cela bloque l'insertion dans la table `partnership_requests`

### Impact
- ❌ **Insertion échoue** dans Supabase
- ❌ **SMS et e-mails ne sont pas envoyés** (car l'insertion échoue en premier)
- ❌ **Formulaire de partenariat ne fonctionne pas**

## 🛠️ Solution

### Étape 1: Exécuter le script de résolution

1. **Allez dans votre dashboard Supabase**
2. **Ouvrez l'éditeur SQL**
3. **Copiez et exécutez** le contenu du fichier `scripts/fix-create-notification-conflict.sql`

### Étape 2: Vérification

Le script va :
- ✅ **Diagnostiquer** toutes les fonctions `create_notification` existantes
- ✅ **Supprimer** les fonctions dupliquées
- ✅ **Créer** une fonction unique et robuste
- ✅ **Tester** la nouvelle fonction
- ✅ **Nettoyer** les données de test

### Étape 3: Test de la solution

Après exécution du script, testez votre formulaire de partenariat :

```bash
# Test avec le script de test complet
node test-partnership-submission-complete.js
```

## 📋 Fonctions créées

### 1. `create_notification()` - Fonction principale
```sql
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_titre TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'Information'
)
RETURNS UUID
```

**Utilisation :**
```sql
SELECT create_notification(
  'user-uuid-here',
  'Titre de la notification',
  'Message de la notification',
  'Information'
);
```

### 2. `create_notification_for_partner()` - Pour les partenaires
```sql
CREATE OR REPLACE FUNCTION create_notification_for_partner(
  p_partner_id UUID,
  p_titre TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'Information'
)
RETURNS SETOF UUID
```

**Utilisation :**
```sql
SELECT create_notification_for_partner(
  'partner-uuid-here',
  'Notification partenaire',
  'Message pour tous les employés du partenaire',
  'Information'
);
```

### 3. `create_system_notification()` - Pour tous les utilisateurs
```sql
CREATE OR REPLACE FUNCTION create_system_notification(
  p_titre TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'Information'
)
RETURNS SETOF UUID
```

**Utilisation :**
```sql
SELECT create_system_notification(
  'Notification système',
  'Message pour tous les utilisateurs',
  'Information'
);
```

## 🔧 Fonctionnalités des nouvelles fonctions

### Validation robuste
- ✅ Vérification des paramètres NULL
- ✅ Validation des chaînes vides
- ✅ Gestion d'erreurs avec messages explicites

### Sécurité
- ✅ `SECURITY DEFINER` pour les privilèges appropriés
- ✅ Validation des types de données
- ✅ Gestion des exceptions

### Flexibilité
- ✅ Types de paramètres spécifiques (plus d'`unknown`)
- ✅ Valeurs par défaut pour les paramètres optionnels
- ✅ Retour d'UUID pour identification

## 🧪 Tests inclus

Le script inclut des tests automatiques :

1. **Test de diagnostic** - Liste toutes les fonctions existantes
2. **Test de création** - Crée une notification de test
3. **Test de nettoyage** - Supprime les données de test
4. **Vérification finale** - Confirme que tout fonctionne

## 📊 Résultats attendus

Après exécution du script, vous devriez voir :

```
✅ Conflit de fonction create_notification résolu avec succès!
```

Et dans les logs :
```
NOTICE: Test réussi: notification créée avec ID [uuid]
```

## 🚀 Prochaines étapes

### Immédiat
1. ✅ **Exécutez le script** de résolution
2. ✅ **Testez le formulaire** de partenariat
3. ✅ **Vérifiez les logs** pour confirmer le bon fonctionnement

### Vérification
1. **Soumettez une vraie demande** de partenariat
2. **Vérifiez que les SMS** sont envoyés
3. **Vérifiez que les e-mails** sont envoyés
4. **Vérifiez l'insertion** dans Supabase

## 🔍 Monitoring

### Logs à surveiller
```
📧 Envoi e-mail admin pour: [Company Name]
✅ E-mail admin envoyé avec succès: { messageId: "abc123", duration: "245ms" }
📱 SMS envoyés avec succès: [Summary]
```

### Erreurs à éviter
- ❌ `function create_notification is not unique`
- ❌ `Could not choose a best candidate function`
- ❌ `You might need to add explicit type casts`

## 🛡️ Prévention

Pour éviter ce problème à l'avenir :

1. **Utilisez des types spécifiques** au lieu d'`unknown`
2. **Testez les fonctions** avant de les déployer
3. **Documentez les signatures** de vos fonctions
4. **Utilisez des noms uniques** pour éviter les conflits

## 📞 Support

Si le problème persiste après exécution du script :

1. **Vérifiez les logs** de l'éditeur SQL Supabase
2. **Consultez les erreurs** détaillées dans les logs
3. **Contactez le support** si nécessaire

---

**Note** : Ce script est conçu pour être sûr et réversible. Il ne supprime que les fonctions problématiques et crée des versions améliorées. 