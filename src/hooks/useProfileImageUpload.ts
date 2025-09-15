import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../contexts/EmployeeAuthContext';
import { employeeAuthService } from '../lib/apiEmployeeAuth';
import { toast } from 'sonner';

export interface UseProfileImageUploadReturn {
  avatarFile: File | null;
  avatarPreview: string;
  imageError: string | null;
  isUploading: boolean;
  setAvatarFile: (file: File | null) => void;
  setAvatarPreview: (url: string) => void;
  setImageError: (error: string | null) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: () => Promise<void>;
  resetUpload: () => void;
}

export function useProfileImageUpload(
  initialPhotoURL?: string, 
  userDataOverride?: any
): UseProfileImageUploadReturn {
  const { employee: contextUserData, loading } = useEmployeeAuth();
  
  // ✅ Utiliser les données passées en paramètre en priorité, sinon le contexte
  const userData = userDataOverride || contextUserData;
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialPhotoURL || '');
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setImageError('Format non supporté. Veuillez utiliser une image au format JPG, PNG ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('L\'image est trop volumineuse. Taille maximale : 5MB.');
      return;
    }

    setImageError(null);
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

  };

  const handleImageUpload = async () => {
    if (loading) {
      setImageError('Veuillez patienter pendant le chargement des données...');
      return;
    }

    if (!userData) {
      console.error('❌ Aucune donnée utilisateur disponible');
      setImageError('Vous devez être connecté pour modifier votre photo de profil. Veuillez vous connecter.');
      return;
    }

    if (!avatarFile) {
      setImageError('Veuillez sélectionner une image avant d\'enregistrer');
      return;
    }

    setIsUploading(true);
    setImageError(null);

    try {
      // ✅ Utiliser l'API route via employeeAuthService
      const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
      if (!accessToken) {
        setImageError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      const result = await employeeAuthService.uploadPhoto(accessToken, avatarFile);

      if (result.success) {
        toast.success('Photo de profil mise à jour avec succès !');
        setAvatarFile(null);
        
        // ✅ Mettre à jour l'aperçu avec la nouvelle URL si disponible
        if (result.data?.photo_url) {
          setAvatarPreview(result.data.photo_url);
        }
      } else {
        console.error('❌ Erreur lors de l\'upload:', result.error);
        setImageError(result.error || 'Une erreur est survenue lors du téléversement');
      }
    } catch (error) {
      console.error('💥 Erreur lors du téléversement de l\'image:', error);
      setImageError('Une erreur inattendue est survenue');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setAvatarFile(null);
    setImageError(null);
    setIsUploading(false);
  };

  return {
    avatarFile,
    avatarPreview,
    imageError,
    isUploading,
    setAvatarFile,
    setAvatarPreview,
    setImageError,
    handleAvatarChange,
    handleImageUpload,
    resetUpload,
  };
}