'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, FileImage } from 'lucide-react';
import { logoUploadService } from '../../services/logoUploadService';

interface LogoUploadProps {
  onFileUploaded: (url: string) => void;
  onFileRemoved: () => void;
  onFileDataChange: (fileData: { base64: string; filename: string } | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  isValid?: boolean;
  errorMessage?: string;
}

export const LogoUpload = ({
  onFileUploaded,
  onFileRemoved,
  onFileDataChange,
  label = "Logo de l'entreprise",
  placeholder = "Glissez votre logo ici ou cliquez pour sélectionner",
  className = "",
  hasError = false,
  isValid = false,
  errorMessage = ""
}: LogoUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
    size: number;
    preview: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validation du fichier
      const validation = logoUploadService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Créer un aperçu de l'image
      const preview = URL.createObjectURL(file);

      // Upload vers l'Edge Function
      const uploadResult = await logoUploadService.uploadLogo(file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Erreur lors de l\'upload');
      }

      // Mettre à jour l'état avec les informations du fichier uploadé
      setUploadedFile({
        name: file.name,
        url: uploadResult.data!.publicUrl,
        size: file.size,
        preview: preview
      });

      // Notifier le parent avec l'URL du fichier uploadé
      onFileUploaded(uploadResult.data!.publicUrl);

      // Convertir en base64 pour compatibilité avec l'ancien système
      const base64 = await logoUploadService.fileToBase64(file);
      onFileDataChange({
        base64: base64,
        filename: uploadResult.data!.fileName
      });

      console.log('✅ Logo uploadé avec succès:', {
        fileName: uploadResult.data!.fileName,
        publicUrl: uploadResult.data!.publicUrl,
        fileSize: uploadResult.data!.fileSize
      });

    } catch (err) {
      console.error('❌ Erreur upload logo:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeFile = async () => {
    try {
      // Si on a un fichier uploadé, le supprimer du stockage
      if (uploadedFile?.url) {
        // Extraire le nom du fichier de l'URL
        const urlParts = uploadedFile.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        console.log('🗑️ Suppression du logo:', fileName);
        
        const deleteResult = await logoUploadService.deleteLogo(fileName);
        if (!deleteResult.success) {
          console.error('❌ Erreur suppression logo:', deleteResult.error);
          // On continue quand même pour nettoyer l'interface
        }
      }

      // Nettoyer l'interface
      if (uploadedFile?.preview) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
      setUploadedFile(null);
      setError(null);
      onFileRemoved();
      if (onFileDataChange) {
        onFileDataChange(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      console.log('✅ Logo supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      // Nettoyer l'interface même en cas d'erreur
      if (uploadedFile?.preview) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
      setUploadedFile(null);
      setError(null);
      onFileRemoved();
      if (onFileDataChange) {
        onFileDataChange(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone d'upload */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive 
            ? 'border-orange-500 bg-orange-500/5' 
            : uploadedFile 
              ? 'border-green-500/70 bg-green-500/5' 
              : hasError
              ? 'border-red-500/70 bg-red-500/5'
              : isValid
              ? 'border-green-500/70 bg-green-500/5'
              : 'border-blue-700/70 bg-blue-950/30 hover:border-orange-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="text-center">
          {uploadedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="relative mx-auto w-20 h-20">
                <img
                  src={uploadedFile.preview}
                  alt="Aperçu du logo"
                  className="w-full h-full object-cover rounded-lg border-2 border-green-500/30"
                />
                <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
              >
                <X className="h-3 w-3" />
                Supprimer
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                ) : (
                  <FileImage className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isUploading ? 'Traitement en cours...' : label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Types acceptés: {acceptedTypes.join(', ')} • Max: 5MB
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Indicateur de drag & drop */}
        {!uploadedFile && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: dragActive ? 1 : 0 }}
            className="absolute inset-0 bg-orange-500/10 border-2 border-orange-500 rounded-xl flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-orange-500 mb-2" />
              <p className="text-sm font-medium text-orange-600">
                Déposez votre fichier ici
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Messages d'erreur et de validation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {hasError && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
          </motion.div>
        )}

        {isValid && !error && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300">Logo valide</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
