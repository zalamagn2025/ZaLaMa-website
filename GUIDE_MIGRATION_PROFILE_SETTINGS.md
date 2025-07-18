# Guide de Migration : Déplacement des Fonctionnalités vers ProfileSettings

## 🎯 Objectif
Déplacer proprement les fonctionnalités de modification d'image de profil et de déconnexion du composant `ProfileHeader` vers le composant `ProfileSettings`.

## 📋 Changements Effectués

### 1. **Nettoyage du ProfileHeader** (`src/components/profile/profile-header.tsx`)

#### ❌ Supprimé :
- Bouton de modification d'image de profil
- Bouton de déconnexion
- Composant `EditProfileForm` complet
- Logique d'upload d'image
- Import `IconEdit` et `IconLogout`
- Fonction `handleLogout`
- État `showEditForm`

#### ✅ Conservé :
- Affichage de l'avatar (lecture seule)
- Bouton des notifications
- Navigation vers l'accueil
- Ouverture des paramètres

### 2. **Enrichissement du ProfileSettings** (`src/components/profile/profile-settings.tsx`)

#### ✨ Nouvelles fonctionnalités ajoutées :

**Modification d'image de profil :**
- Bouton "Modifier" dans la section "Mon compte"
- Modal de modification d'image avec preview
- Upload vers Supabase Storage
- Mise à jour de la colonne `photo_url` dans la table `employees`
- Validation des formats (JPG, PNG, WebP) et taille (5MB max)
- Gestion des erreurs et feedback utilisateur

**Déconnexion :**
- Bouton "Se déconnecter" dans la section "Sécurité"
- Intégration avec `useAuth().logout()`
- Redirection vers `/login`
- Style cohérent avec le thème

#### 🔧 Améliorations techniques :
- Service `ImageUploadService` pour gérer l'upload
- Gestion des URLs blob pour le preview
- Nettoyage automatique des ressources
- Synchronisation avec Supabase

### 3. **Nouveau Service** (`src/services/imageUploadService.ts`)

#### Fonctionnalités :
- `uploadProfileImage()` : Upload vers Supabase Storage + mise à jour DB
- `deleteProfileImage()` : Suppression d'anciennes images
- `getProfileImageUrl()` : Récupération de l'URL de l'image
- Validation des formats et tailles
- Gestion d'erreurs robuste

### 4. **Mise à jour de la Base de Données**

#### Script SQL : `scripts/add-photo-url-to-employees.sql`
```sql
-- Ajouter la colonne photo_url à la table employees
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);
```

#### Types TypeScript mis à jour :
- Ajout de `photo_url: string | null` dans les types `employees`
- Cohérence avec le schéma Supabase

## 🚀 Instructions de Déploiement

### 1. **Exécuter le script SQL**
```bash
# Dans Supabase SQL Editor, exécuter :
scripts/add-photo-url-to-employees.sql
```

### 2. **Vérifier la structure**
```sql
-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND column_name = 'photo_url';
```

### 3. **Configurer Supabase Storage**
Assurez-vous que le bucket `zalama-storage` existe avec les bonnes permissions :
```sql
-- Créer le bucket si nécessaire
INSERT INTO storage.buckets (id, name, public)
VALUES ('zalama-storage', 'zalama-storage', true);
```

### 4. **Tester les fonctionnalités**
1. Ouvrir les paramètres depuis ProfileHeader
2. Cliquer sur "Modifier" dans la section "Mon compte"
3. Sélectionner une image et l'uploader
4. Vérifier que l'image s'affiche dans ProfileHeader
5. Tester la déconnexion

## 🔧 Configuration Supabase Storage

### Permissions RLS pour le bucket :
```sql
-- Permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'zalama-storage' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permettre la lecture publique des images de profil
CREATE POLICY "Public can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'zalama-storage');

-- Permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Users can delete own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🎨 Améliorations UX

### ProfileHeader (nettoyé) :
- Interface plus épurée
- Focus sur l'affichage des informations
- Navigation simplifiée

### ProfileSettings (enrichi) :
- Section "Mon compte" avec modification d'image
- Section "Sécurité" avec déconnexion
- Modal d'upload avec preview en temps réel
- Feedback visuel et notifications toast

## 🔍 Points de Contrôle

### ✅ Vérifications à effectuer :
- [ ] La colonne `photo_url` existe dans la table `employees`
- [ ] Le bucket `zalama-storage` est configuré
- [ ] Les permissions RLS sont correctes
- [ ] L'upload d'image fonctionne
- [ ] La déconnexion redirige vers `/login`
- [ ] L'image s'affiche dans ProfileHeader après upload
- [ ] Les erreurs sont gérées proprement

### 🐛 Dépannage courant :
- **Erreur upload** : Vérifier les permissions du bucket
- **Image ne s'affiche pas** : Vérifier l'URL publique du bucket
- **Déconnexion échoue** : Vérifier la configuration AuthContext

## 📝 Notes Techniques

### Architecture :
- **ProfileHeader** : Affichage en lecture seule
- **ProfileSettings** : Interface de modification
- **ImageUploadService** : Logique métier d'upload
- **Supabase Storage** : Stockage des fichiers
- **Table employees** : Stockage des URLs

### Sécurité :
- Validation des types de fichiers
- Limitation de la taille (5MB)
- Permissions RLS appropriées
- Nettoyage des anciennes images

### Performance :
- Preview en temps réel avec URL.createObjectURL()
- Nettoyage automatique des ressources blob
- Upload optimisé vers Supabase Storage

## 🎉 Résultat Final

L'utilisateur peut maintenant :
1. **Modifier son image de profil** depuis les paramètres
2. **Se déconnecter** depuis les paramètres
3. **Voir sa nouvelle image** dans le header du profil
4. **Bénéficier d'une interface cohérente** et intuitive

La séparation des responsabilités est maintenant claire :
- **ProfileHeader** : Affichage et navigation
- **ProfileSettings** : Configuration et modifications 