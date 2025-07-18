-- Créer une politique permissive pour permettre l'upload d'images
-- Cette politique permet à tous les utilisateurs authentifiés d'uploader dans le bucket zalama-storage

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'zalama-storage');

-- Politique pour permettre la lecture des images (accès public)
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'zalama-storage');

-- Politique pour permettre la mise à jour des métadonnées
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'zalama-storage');

-- Politique pour permettre la suppression (optionnel, pour permettre aux utilisateurs de supprimer leurs images)
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'zalama-storage');

-- Vérifier que les politiques ont été créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'; 