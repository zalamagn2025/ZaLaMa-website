import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../contexts/EmployeeAuthContext';
import { ImageUploadService } from '../services/imageUploadService';
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

  useEffect(() => {
    console.log('🔍 useProfileImageUpload Debug:', {
      userData: userData ? 'Présent' : 'Absent',
      loading,
      userDataKeys: userData ? Object.keys(userData) : 'Aucune donnée',
      userDataValues: userData ? {
        employeId: userData.employeId || userData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        user_id: userData.user_id,
        id: userData.id
      } : 'Aucune donnée',
    });

    // Note: Le nouveau contexte EmployeeAuthContext gère automatiquement le chargement des données
    if (!userData && !loading) {
      console.log('⚠️ Aucune donnée utilisateur disponible');
    }
  }, [userData, loading]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log('🔍 Debug handleAvatarChange:', {
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      } : 'Aucun fichier sélectionné',
    });

    if (!file) {
      console.log('❌ Aucun fichier sélectionné');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      console.log('❌ Format non supporté:', file.type);
      setImageError('Format non supporté. Veuillez utiliser une image au format JPG, PNG ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ Fichier trop volumineux:', file.size);
      setImageError('L\'image est trop volumineuse. Taille maximale : 5MB.');
      return;
    }

    console.log('✅ Fichier validé, mise à jour des états');
    setImageError(null);
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    console.log('✅ États mis à jour:', {
      avatarFile: 'Fichier défini',
      avatarPreview: 'URL créée',
    });
  };

  const handleImageUpload = async () => {
    if (loading) {
      console.log('⏳ Attente du chargement des données...');
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

    // ✅ Support pour différentes structures de données
    const employeeId = userData.employeId || userData.id;

    if (!employeeId) {
      console.error('❌ Aucun employee ID trouvé dans les données employee:', userData);
      setImageError('Impossible de récupérer l\'identifiant employee. Veuillez vous reconnecter.');
      return;
    }

    setIsUploading(true);
    setImageError(null);

    try {
      console.log('🚀 Début de l\'upload de l\'image de profil...');
      console.log('👤 Employee ID utilisé:', employeeId);

      // Utiliser le service d'upload existant pour l'instant
      const result = await ImageUploadService.uploadProfileImage(avatarFile, employeeId);

      if (result.success && result.url) {
        console.log('✅ Upload réussi');
        setAvatarPreview(result.url);
        toast.success('Photo de profil mise à jour avec succès !');
        setAvatarFile(null);
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