export interface LogoUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    fileName: string;
    filePath: string;
    publicUrl: string;
    fileSize: number;
    fileType: string;
  };
}

export interface LogoDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    fileName: string;
  };
}

class LogoUploadService {
  private baseUrl = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-logo';

  /**
   * Upload un logo vers Supabase Storage
   * @param file - Le fichier à uploader
   * @returns Promise<LogoUploadResponse>
   */
  async uploadLogo(file: File): Promise<LogoUploadResponse> {
    try {
      console.log('🚀 Début upload logo:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('📥 Réponse upload logo:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur upload logo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload'
      };
    }
  }

  /**
   * Supprimer un logo du stockage
   * @param fileName - Le nom du fichier à supprimer
   * @returns Promise<LogoDeleteResponse>
   */
  async deleteLogo(fileName: string): Promise<LogoDeleteResponse> {
    try {
      console.log('🗑️ Début suppression logo:', fileName);

      const url = `${this.baseUrl}?fileName=${encodeURIComponent(fileName)}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('📥 Réponse suppression logo:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur suppression logo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la suppression'
      };
    }
  }

  /**
   * Valider un fichier avant upload
   * @param file - Le fichier à valider
   * @returns { isValid: boolean, error?: string }
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou SVG.'
      };
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Fichier trop volumineux. Taille maximale: 5MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Convertir un fichier en base64 (pour compatibilité avec l'ancien système)
   * @param file - Le fichier à convertir
   * @returns Promise<string>
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

// Instance singleton
export const logoUploadService = new LogoUploadService();

