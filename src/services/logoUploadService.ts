'use client';

import { createClient } from '@supabase/supabase-js';

// Interfaces pour les réponses
export interface LogoUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    fileName: string;        // Nom du fichier généré
    filePath: string;        // Chemin du fichier dans le bucket
    publicUrl: string;       // URL publique du fichier
    fileSize: number;        // Taille du fichier en bytes
    fileType: string;        // Type MIME du fichier
  };
}

export interface LogoDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Service pour l'upload et la gestion des logos de partenaires
 * Utilise l'edge function Supabase upload-partner-logo
 */
class LogoUploadService {
  // Utiliser la route API locale directe vers Supabase Storage (plus fiable)
  private baseUrl = '/api/upload-logo-direct';

  /**
   * Upload un logo vers Supabase Storage via l'edge function
   * @param file - Le fichier à uploader
   * @param partnerId - L'ID du partenaire (optionnel, généré automatiquement si non fourni)
   * @returns Promise<LogoUploadResponse>
   */
  async uploadLogo(file: File, partnerId?: string): Promise<LogoUploadResponse> {
    try {
      console.log('🚀 Début upload logo partenaire:', {
        name: file.name,
        size: file.size,
        type: file.type,
        partnerId: partnerId || 'auto-generated'
      });

      const formData = new FormData();
      formData.append('logo', file); // L'API route attend 'logo'

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('📥 Réponse upload logo partenaire:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        result
      });

      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status, response.statusText);
        console.error('❌ Détails de l\'erreur:', result);
        throw new Error(result.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur upload logo partenaire:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload'
      };
    }
  }

  /**
   * Upload un logo avec un ID de partenaire spécifique
   * @param file - Le fichier à uploader
   * @param partnerId - L'ID du partenaire
   * @returns Promise<LogoUploadResponse>
   */
  async uploadLogoForPartner(file: File, partnerId: string): Promise<LogoUploadResponse> {
    try {
      console.log('🚀 Début upload logo pour partenaire:', {
        name: file.name,
        size: file.size,
        type: file.type,
        partnerId
      });

      const formData = new FormData();
      formData.append('logo', file); // L'API route attend 'logo'

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('📥 Réponse upload logo partenaire:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        result
      });

      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status, response.statusText);
        console.error('❌ Détails de l\'erreur:', result);
        throw new Error(result.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur upload logo partenaire:', error);
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

      const url = `/api/delete-logo?fileName=${encodeURIComponent(fileName)}`;
      
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
   * @returns FileValidationResult
   */
  validateFile(file: File): FileValidationResult {
    // Types de fichiers autorisés
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/svg+xml'
    ];

    // Vérifier le type MIME
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou SVG.'
      };
    }

    // Vérifier la taille (2MB max selon la documentation)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `Fichier trop volumineux. Taille maximale: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * Obtenir l'URL de l'edge function
   * @returns string
   */
  getEdgeFunctionUrl(): string {
    return this.baseUrl;
  }
}

// Instance singleton du service
export const logoUploadService = new LogoUploadService();

