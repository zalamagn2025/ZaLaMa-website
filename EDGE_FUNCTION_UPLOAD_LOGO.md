# Edge Function - Upload Logo

## 🎯 Objectif

Cette Edge Function permet l'upload et la suppression de logos de partenaires vers le bucket Supabase Storage `partner-logos`.

## 📁 Structure

```
supabase/functions/upload-logo/
├── index.ts          # Code principal de l'Edge Function
```

## 🚀 Déploiement

### 1. Créer le bucket Storage

Dans votre dashboard Supabase, créez un bucket nommé `partner-logos` :

```sql
-- Créer le bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner-logos', 'partner-logos', true);
```

### 2. Configurer les politiques RLS

```sql
-- Politique pour permettre l'upload
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'partner-logos');

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'partner-logos');

-- Politique pour permettre la suppression
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'partner-logos');
```

### 3. Déployer l'Edge Function

```bash
# Depuis la racine du projet
supabase functions deploy upload-logo
```

## 🔧 Utilisation

### Upload d'un logo

**Endpoint :** `POST https://[PROJECT_REF].supabase.co/functions/v1/upload-logo`

**Headers :**
```
Content-Type: multipart/form-data
```

**Body :**
```
file: [File] - Le fichier image à uploader
```

**Réponse de succès :**
```json
{
  "success": true,
  "message": "Logo uploadé avec succès",
  "data": {
    "fileName": "partner-logo-1703123456789-abc123.png",
    "filePath": "partner-logo-1703123456789-abc123.png",
    "publicUrl": "https://[PROJECT_REF].supabase.co/storage/v1/object/public/partner-logos/partner-logo-1703123456789-abc123.png",
    "fileSize": 1024000,
    "fileType": "image/png"
  }
}
```

### Suppression d'un logo

**Endpoint :** `DELETE https://[PROJECT_REF].supabase.co/functions/v1/upload-logo?fileName=[FILENAME]`

**Réponse de succès :**
```json
{
  "success": true,
  "message": "Logo supprimé avec succès",
  "data": {
    "fileName": "partner-logo-1703123456789-abc123.png"
  }
}
```

## 📋 Validation

### Types de fichiers acceptés
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- SVG (.svg)

### Limites
- **Taille maximale :** 5MB
- **Types MIME autorisés :** `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/svg+xml`

## 🔒 Sécurité

### Validation côté serveur
- Vérification du type MIME
- Validation de la taille du fichier
- Génération de noms de fichiers uniques avec timestamp
- Protection contre les injections de fichiers malveillants

### CORS
- Headers CORS configurés pour permettre les requêtes cross-origin
- Support des requêtes preflight OPTIONS

## 🛠️ Intégration côté client

### Service TypeScript

```typescript
import { logoUploadService } from '@/services/logoUploadService';

// Upload d'un logo
const file = event.target.files[0];
const result = await logoUploadService.uploadLogo(file);

if (result.success) {
  console.log('Logo uploadé:', result.data.publicUrl);
} else {
  console.error('Erreur:', result.error);
}

// Suppression d'un logo
const deleteResult = await logoUploadService.deleteLogo(fileName);
```

### Composant React

```typescript
import { LogoUpload } from '@/components/ui/logo-upload';

<LogoUpload
  onFileUploaded={(url) => console.log('Logo uploadé:', url)}
  onFileRemoved={() => console.log('Logo supprimé')}
  onFileDataChange={(fileData) => console.log('Données du fichier:', fileData)}
/>
```

## 🐛 Gestion d'erreurs

### Erreurs communes

1. **Type de fichier non autorisé**
   ```json
   {
     "success": false,
     "error": "Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou SVG."
   }
   ```

2. **Fichier trop volumineux**
   ```json
   {
     "success": false,
     "error": "Fichier trop volumineux. Taille maximale: 5MB"
   }
   ```

3. **Aucun fichier fourni**
   ```json
   {
     "success": false,
     "error": "Aucun fichier fourni"
   }
   ```

## 📊 Monitoring

### Logs utiles
- Upload réussi : `✅ Logo uploadé avec succès`
- Suppression réussie : `✅ Logo supprimé avec succès`
- Erreurs : `❌ Erreur upload logo:` ou `❌ Erreur suppression logo:`

### Métriques à surveiller
- Taux de succès des uploads
- Taille moyenne des fichiers
- Types de fichiers les plus utilisés
- Erreurs de validation

## 🔄 Migration depuis l'ancien système

### Changements principaux
1. **Upload direct** : Plus besoin de stocker en base64 temporairement
2. **URLs publiques** : Les logos sont directement accessibles via URL
3. **Gestion des erreurs** : Validation côté serveur renforcée
4. **Performance** : Upload asynchrone avec feedback en temps réel

### Compatibilité
- Le système conserve la compatibilité avec l'ancien format base64
- Les URLs publiques sont automatiquement générées
- Migration transparente pour l'utilisateur final

## 🎉 Avantages

1. **Performance** : Upload direct vers le stockage
2. **Sécurité** : Validation côté serveur
3. **Scalabilité** : Gestion automatique des fichiers
4. **Maintenance** : Code centralisé et réutilisable
5. **Monitoring** : Logs détaillés pour le debugging

