import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const { updateUserData, userData: contextUserData, loading, refreshUserData } = useAuth();
  
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

    // Forcer le rechargement des données si userData est null et qu'on n'est pas en cours de chargement
    if (!userData && !loading) {
      console.log('🔄 Tentative de rechargement des données utilisateur...');
      // Seulement si on a un currentUser dans le contexte
      refreshUserData().catch(error => {
        console.warn('⚠️ Impossible de recharger les données utilisateur:', error.message);
      });
    }
  }, [userData, loading, refreshUserData]);

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

    // ✅ Support pour différentes structures de données
    const employeeId = userData.employeId || userData.id;

    console.log('🔍 Debug handleImageUpload:', {
      avatarFile: avatarFile ? 'Fichier sélectionné' : 'Aucun fichier',
      loading,
      userData: userData ? 'Données employee présentes' : 'Aucune donnée employee',
      employeeId,
      userDataKeys: userData ? Object.keys(userData) : 'Aucune donnée',
      userDataValues: userData ? {
        employeId: userData.employeId || userData.id,
        nom: userData.nom,
        prenom: userData.prenom,
        user_id: userData.user_id,
        id: userData.id
      } : 'Aucune donnée',
    });

    if (!avatarFile) {
      setImageError('Veuillez sélectionner une image avant d\'enregistrer');
      return;
    }

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

      const result = await ImageUploadService.uploadProfileImage(avatarFile, employeeId);

      if (result.success && result.url) {
        console.log('✅ Upload réussi, mise à jour du contexte...');

        // ✅ Mettre à jour l'aperçu immédiatement
        setAvatarPreview(result.url);

        // ✅ Forcer le rechargement des données depuis la base
        try {
          await refreshUserData();
          console.log('✅ Données utilisateur rechargées depuis la base');
        } catch (error) {
          console.warn('⚠️ Erreur rechargement données:', error);
          // Fallback : essayer updateUserData si refreshUserData échoue
          try {
            await updateUserData({ photo_url: result.url });
            console.log('✅ Données mises à jour via updateUserData');
          } catch (updateError) {
            console.warn('⚠️ Erreur updateUserData aussi:', updateError);
            console.log('🔄 Forcement d\'un rechargement de page dans 2 secondes...');
            // Dernier recours : recharger la page pour voir la nouvelle photo
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }

        toast.success('Photo de profil mise à jour avec succès !');
        setAvatarFile(null);
        console.log('✅ Processus de mise à jour terminé avec succès');
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