# 🔧 Guide de Dépannage - Politiques RLS Supabase

## 🚨 **Problème: "policy already exists"**

### **Erreur Rencontrée**
```
ERROR: 42710: policy "Allow authenticated users to upload motivation letters" for table "objects" already exists
```

### **Cause du Problème**
Cette erreur se produit quand vous essayez de créer une politique RLS qui existe déjà dans votre base de données Supabase.

## ✅ **Solution**

### **Étape 1: Exécuter le Script de Correction**

1. **Aller dans Supabase Dashboard**
2. **SQL Editor** (dans le menu de gauche)
3. **Copier et exécuter** le contenu de `scripts/fix-storage-policies.sql`

### **Étape 2: Vérifier la Configuration**

Après avoir exécuté le script, vous devriez voir un résultat comme ceci :

```
type    | name                    | public | file_size_limit | allowed_mime_types
--------|-------------------------|--------|-----------------|-------------------
Bucket  | motivation-letters     | false  | 10485760        | {application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}
Policy  | Allow public uploads for motivation letters | NULL | NULL | NULL
Policy  | Allow admins to read motivation letters | NULL | NULL | NULL
Policy  | Allow admins to delete motivation letters | NULL | NULL | NULL
```

## 🔍 **Vérifications Supplémentaires**

### **Vérifier les Politiques Existantes**
```sql
-- Lister toutes les politiques pour storage.objects
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%motivation%';
```

### **Vérifier le Bucket**
```sql
-- Vérifier que le bucket existe et est configuré correctement
SELECT * FROM storage.buckets WHERE name = 'motivation-letters';
```

### **Vérifier les Permissions**
```sql
-- Vérifier les permissions sur le bucket
SELECT * FROM storage.policies WHERE bucket_id = 'motivation-letters';
```

## 🚨 **Autres Problèmes Potentiels**

### **Problème 1: "Bucket not found"**
```sql
-- Solution: Créer le bucket manuellement
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'motivation-letters',
  'motivation-letters',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);
```

### **Problème 2: "Permission denied"**
```sql
-- Solution: Vérifier que RLS est activé
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### **Problème 3: "Invalid policy"**
```sql
-- Solution: Supprimer et recréer toutes les politiques
DROP POLICY IF EXISTS "Allow public uploads for motivation letters" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to read motivation letters" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete motivation letters" ON storage.objects;

-- Puis recréer avec le script de correction
```

## 🧪 **Test de la Configuration**

### **Test 1: Upload via API**
```bash
# Tester l'upload avec curl
curl -X POST http://localhost:3000/api/upload/motivation-letter \
  -F "file=@test-file.pdf"
```

### **Test 2: Vérifier les Logs**
```typescript
// Dans l'API, ajouter des logs de debug
console.log('🔧 Tentative d\'upload vers bucket:', 'motivation-letters');
console.log('📁 Nom du fichier:', fileName);
console.log('👤 User ID:', userId);
```

### **Test 3: Vérifier dans Supabase Dashboard**
1. **Storage** → **motivation-letters**
2. Vérifier que les fichiers apparaissent
3. Vérifier les permissions

## 📋 **Checklist de Vérification**

- [ ] Script de correction exécuté sans erreur
- [ ] Bucket `motivation-letters` existe
- [ ] Politiques RLS créées correctement
- [ ] Test d'upload réussi
- [ ] Fichiers visibles dans Supabase Dashboard
- [ ] API fonctionne sans authentification

## 🎯 **Résultat Attendu**

Après avoir exécuté le script de correction, vous devriez avoir :

1. **Bucket configuré** avec les bonnes limites
2. **Politiques RLS** permettant l'upload public
3. **API fonctionnelle** sans authentification
4. **Upload de fichiers** PDF/DOC/DOCX possible

## 📞 **Support**

Si le problème persiste après avoir exécuté le script de correction :

1. **Vérifiez les logs** dans Supabase Dashboard
2. **Testez l'API** avec le script de test
3. **Vérifiez les politiques** avec les requêtes SQL ci-dessus
4. **Contactez le support** si nécessaire

---

**✅ Le script de correction devrait résoudre le problème de politique existante !** 