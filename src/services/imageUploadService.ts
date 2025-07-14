import { supabase } from '@/lib/supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageUploadService {
  /**
   * Upload une image vers Supabase Storage et met à jour la photo_url dans la table employees
   */
  static async uploadProfileImage(
    file: File, 
    userId: string,
    employeeId?: string
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

      // 2. Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      // 3. Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('employee-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload Supabase:', uploadError);
        return {
          success: false,
          error: 'Erreur lors du téléversement de l\'image'
        };
      }

      // 4. Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('employee-photos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 5. Mettre à jour la photo_url dans la table employees
      const { error: updateError } = await supabase
        .from('employees')
        .update({ 
          photo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Erreur mise à jour photo_url:', updateError);
        // Supprimer le fichier uploadé en cas d'erreur
        await supabase.storage
          .from('employee-photos')
          .remove([filePath]);
        
        return {
          success: false,
          error: 'Erreur lors de la mise à jour du profil'
        };
      }

      return {
        success: true,
        url: publicUrl
      };

    } catch (error) {
      console.error('Erreur upload image:', error);
      return {
        success: false,
        error: 'Une erreur inattendue est survenue'
      };
    }
  }

  /**
   * Supprime une ancienne image de profil
   */
  static async deleteProfileImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `profile-images/${fileName}`;

      // Supprimer le fichier
      const { error } = await supabase.storage
        .from('employee-photos')
        .remove([filePath]);

      if (error) {
        console.error('Erreur suppression image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur suppression image:', error);
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