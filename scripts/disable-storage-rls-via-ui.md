# Désactiver RLS via l'interface Supabase

## Étapes à suivre :

1. **Accédez à votre projet Supabase**
   - Connectez-vous à https://supabase.com
   - Sélectionnez votre projet

2. **Allez dans Storage**
   - Dans le menu de gauche, cliquez sur "Storage"
   - Cliquez sur "Policies" dans le sous-menu

3. **Désactivez RLS temporairement**
   - Trouvez le bucket `zalama-storage`
   - Cliquez sur le bouton "RLS" pour le désactiver
   - Ou modifiez les politiques pour permettre l'upload

4. **Alternative : Créer une politique permissive**
   - Au lieu de désactiver RLS, créez une politique qui permet l'upload :
   ```sql
   -- Politique pour permettre l'upload à tous les utilisateurs authentifiés
   CREATE POLICY "Allow authenticated uploads" ON storage.objects
   FOR INSERT TO authenticated
   WITH CHECK (bucket_id = 'zalama-storage');
   ```

5. **Testez l'upload d'image**
   - Essayez d'uploader une image depuis votre application
   - Vérifiez que ça fonctionne

6. **Réactivez RLS avec des politiques appropriées**
   - Une fois que l'upload fonctionne, réactivez RLS
   - Créez des politiques plus restrictives si nécessaire

## Politiques recommandées pour la production :

```sql
-- Permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'zalama-storage' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre la lecture des images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'zalama-storage');

-- Permettre la suppression de ses propres images
CREATE POLICY "Allow users to delete own images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'zalama-storage' AND auth.uid()::text = (storage.foldername(name))[1]);
``` 