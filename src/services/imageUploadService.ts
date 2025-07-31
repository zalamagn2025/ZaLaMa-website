import { supabase } from '@/lib/supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageUploadService {
  /**
   * Upload une image vers Supabase Storage et met à jour la photo_url dans la table employees
   * S'assure qu'il n'y ait qu'une seule photo par employé
   */
  static async uploadProfileImage(
    file: File, 
    employeeId: string,
  ): Promise<ImageUploadResult> {
    try {
      // 1. Vérifier le type et la taille du fichier
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        return {
          success: false,
          error: 'Format non supporté. Veuillez utiliser une image au format JPG, PNG ou WebP.'
        };
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB max
        return {
          success: false,
          error: 'L\'image est trop volumineuse. Taille maximale : 5MB.'
        };
      }

      // 2. Récupérer l'ancienne photo pour la supprimer plus tard
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('photo_url')
        .eq('id', employeeId)
        .single();

      if (employeeError) {
        console.error('❌ Erreur récupération employé:', employeeError);
        return {
          success: false,
          error: 'Erreur lors de la récupération des données employé'
        };
      }

      const oldPhotoUrl = employeeData?.photo_url;

      // 3. Générer un nom de fichier unique par employé (écrase l'ancien)
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}.${fileExt}`;
      const filePath = fileName; // Directement à la racine du bucket

      console.log('📤 Upload vers Supabase Storage:', {
        bucket: 'profiles-images',
        filePath,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type,
        employeeId,
        oldPhotoUrl: oldPhotoUrl ? 'Existante' : 'Aucune'
      });

      // 4. Upload vers le bucket profiles-images avec upsert pour remplacer l'ancienne
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // ✅ Remplace automatiquement si existe déjà
        });

      if (uploadError) {
        console.error('❌ Erreur upload Supabase:', uploadError);
        return {
          success: false,
          error: 'Erreur lors du téléversement de l\'image'
        };
      }

      console.log('✅ Upload réussi:', uploadData);

      // 5. Obtenir l'URL publique avec cache buster
      const { data: urlData } = supabase.storage
        .from('profiles-images')
        .getPublicUrl(filePath);

      // ✅ Ajouter un timestamp pour forcer le refresh du cache navigateur
      const timestamp = Date.now();
      const publicUrl = `${urlData.publicUrl}?t=${timestamp}`;

      console.log('🔗 URL publique avec cache buster générée:', publicUrl);

      // 6. Mettre à jour la photo_url dans la table employees
      const { error: updateError } = await supabase
        .from('employees')
        .update({ 
          photo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (updateError) {
        console.error('❌ Erreur mise à jour photo_url:', updateError);
        // Supprimer le fichier uploadé en cas d'erreur
        await supabase.storage
          .from('profiles-images')
          .remove([filePath]);
        
        return {
          success: false,
          error: 'Erreur lors de la mise à jour du profil'
        };
      }

      console.log('✅ Photo de profil mise à jour avec succès');

      return {
        success: true,
        url: publicUrl
      };

    } catch (error) {
      console.error('💥 Erreur upload image:', error);
      return {
        success: false,
        error: 'Une erreur inattendue est survenue'
      };
    }
  }

  /**
   * Supprime une ancienne image de profil du bucket profiles-images
   */
  static async deleteProfileImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le nom du fichier depuis l'URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Le fichier est directement à la racine du bucket profiles-images
      const filePath = fileName;

      console.log('🗑️ Suppression de l\'ancienne image:', { imageUrl, fileName, filePath });

      // Supprimer le fichier du bucket profiles-images
      const { error } = await supabase.storage
        .from('profiles-images')
        .remove([filePath]);

      if (error) {
        console.error('❌ Erreur suppression image:', error);
        return false;
      }

      console.log('✅ Ancienne image supprimée avec succès');
      return true;
    } catch (error) {
      console.error('💥 Erreur suppression image:', error);
      return false;
    }
  }

  /**
   * Récupère l'URL de l'image de profil d'un employé
   */
  static async getProfileImageUrl(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('photo_url')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur récupération photo_url:', error);
        return null;
      }

      return data?.photo_url || null;
    } catch (error) {
      console.error('Erreur récupération photo_url:', error);
      return null;
    }
  }
} 