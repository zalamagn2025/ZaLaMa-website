# 🚀 Guide d'Implémentation - Upload de Lettre de Motivation

## 📋 **Étapes d'Implémentation**

### **Étape 1: Configuration de la Base de Données**

1. **Exécuter le script SQL pour ajouter le champ**
   ```bash
   # Copier et exécuter dans l'éditeur SQL de Supabase
   # scripts/add-motivation-letter-field.sql
   ```

2. **Configurer le bucket de stockage**
   ```bash
   # Copier et exécuter dans l'éditeur SQL de Supabase
   # scripts/setup-storage-bucket.sql
   ```

### **Étape 2: Configuration des Variables d'Environnement**

Vérifiez que vous avez ces variables dans votre `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
```

### **Étape 3: Créer l'API d'Upload**

Le fichier `src/app/api/upload/motivation-letter/route.ts` est déjà créé avec :
- ✅ Validation des types MIME
- ✅ Validation de la taille (10MB max)
- ✅ Authentification requise
- ✅ Génération de noms de fichiers uniques
- ✅ Gestion d'erreurs complète

### **Étape 4: Intégrer le Composant d'Upload**

1. **Importer le composant dans votre formulaire**
   ```typescript
   import { FileUpload } from '@/components/ui/file-upload'
   ```

2. **Ajouter l'état pour l'URL du fichier**
   ```typescript
   const [motivationLetterUrl, setMotivationLetterUrl] = useState('')
   ```

3. **Ajouter le composant dans le formulaire**
   ```typescript
   <FileUpload
     onFileUploaded={(url) => setMotivationLetterUrl(url)}
     onFileRemoved={() => setMotivationLetterUrl('')}
     acceptedTypes={['.pdf', '.doc', '.docx']}
     maxSize={10 * 1024 * 1024} // 10MB
     label="Lettre de motivation"
     placeholder="Glissez votre lettre de motivation ici"
   />
   ```

### **Étape 5: Mettre à Jour l'API de Soumission**

L'API `src/app/api/partnership/route.ts` a été mise à jour pour inclure le champ `motivation_letter_url`.

### **Étape 6: Tester l'Implémentation**

1. **Tester l'upload**
   - Sélectionner un fichier PDF/DOC/DOCX
   - Vérifier que l'upload fonctionne
   - Vérifier que l'URL est bien enregistrée

2. **Tester la validation**
   - Essayer d'uploader un fichier non autorisé
   - Essayer d'uploader un fichier trop volumineux
   - Vérifier les messages d'erreur

## 🔒 **Sécurité et Bonnes Pratiques**

### **Validation Côté Client**
- ✅ Types de fichiers autorisés
- ✅ Taille maximale
- ✅ Interface utilisateur intuitive

### **Validation Côté Serveur**
- ✅ Authentification requise
- ✅ Validation des types MIME
- ✅ Validation de la taille
- ✅ Noms de fichiers sécurisés

### **Stockage Sécurisé**
- ✅ Bucket privé
- ✅ Politiques RLS configurées
- ✅ Accès restreint aux admins

## 🚨 **Erreurs Potentielles à Éviter**

### **1. Problèmes de CORS**
```typescript
// Assurez-vous que votre API gère les CORS
export async function POST(request: NextRequest) {
  // Votre code ici
}
```

### **2. Problèmes de Taille de Fichier**
```typescript
// Vérifiez la configuration de Next.js
// next.config.ts
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
}
```

### **3. Problèmes d'Authentification**
```typescript
// Assurez-vous que l'utilisateur est authentifié
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
}
```

### **4. Problèmes de Stockage**
```typescript
// Vérifiez que le bucket existe
const { data: buckets } = await supabase.storage.listBuckets()
const motivationLettersBucket = buckets?.find(b => b.name === 'motivation-letters')
if (!motivationLettersBucket) {
  // Créer le bucket si nécessaire
}
```

## 📊 **Monitoring et Debugging**

### **Logs à Surveiller**
```typescript
console.log('📤 Upload démarré:', fileName)
console.log('✅ Upload réussi:', publicUrl)
console.log('❌ Erreur upload:', error)
```

### **Métriques à Suivre**
- Nombre d'uploads réussis/échoués
- Taille moyenne des fichiers
- Types de fichiers les plus uploadés
- Temps de traitement

## 🧪 **Tests Recommandés**

### **Tests Fonctionnels**
1. ✅ Upload de fichier PDF valide
2. ✅ Upload de fichier DOC valide
3. ✅ Upload de fichier DOCX valide
4. ✅ Rejet de fichier non autorisé
5. ✅ Rejet de fichier trop volumineux
6. ✅ Suppression de fichier uploadé

### **Tests de Sécurité**
1. ✅ Tentative d'upload sans authentification
2. ✅ Tentative d'accès direct aux fichiers
3. ✅ Validation des types MIME côté serveur
4. ✅ Protection contre les injections

## 🎯 **Optimisations Futures**

### **Performance**
- Compression automatique des images
- CDN pour les fichiers statiques
- Cache des métadonnées

### **Fonctionnalités**
- Prévisualisation des PDF
- Édition en ligne des documents
- Versioning des fichiers

### **Sécurité**
- Scan antivirus des fichiers
- Chiffrement des fichiers sensibles
- Audit trail des uploads

## 📞 **Support et Dépannage**

### **Problèmes Courants**

1. **"Bucket not found"**
   - Vérifiez que le script de création du bucket a été exécuté
   - Vérifiez les permissions RLS

2. **"File too large"**
   - Vérifiez la limite dans la configuration du bucket
   - Vérifiez la validation côté client

3. **"Unauthorized"**
   - Vérifiez l'authentification de l'utilisateur
   - Vérifiez les politiques RLS

### **Commandes de Debug**
```bash
# Vérifier la structure de la table
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'partnership_requests';

# Vérifier les buckets
SELECT * FROM storage.buckets WHERE name = 'motivation-letters';

# Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

---

**✅ Implémentation terminée !** Votre système d'upload de lettres de motivation est maintenant opérationnel. 