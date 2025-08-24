"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, X, CheckCircle, AlertCircle } from 'lucide-react'

interface LogoUploadProps {
  onFileUploaded: (url: string) => void
  onFileRemoved: () => void
  label?: string
  placeholder?: string
  className?: string
  hasError?: boolean
  isValid?: boolean
  errorMessage?: string
}

export function LogoUpload({
  onFileUploaded,
  onFileRemoved,
  label = "Logo de l'entreprise",
  placeholder = "Glissez votre logo ici ou cliquez pour sélectionner",
  className = "",
  hasError = false,
  isValid = false,
  errorMessage = ""
}: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    url: string
    size: number
    preview: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  const handleFileUpload = async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      // Validation du type de fichier
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const allowedExtensions = acceptedTypes.map(type => type.replace('.', ''))
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new Error(`Type de fichier non autorisé. Types acceptés: ${acceptedTypes.join(', ')}`)
      }

      // Validation de la taille
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024))
        throw new Error(`Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`)
      }

      // Créer un aperçu de l'image
      const preview = URL.createObjectURL(file)

      // Créer FormData pour l'upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'logo')

             // TODO: Remplacer par votre propre route d'upload
       // Upload vers l'API temporairement désactivé
       throw new Error('Upload temporairement désactivé - Route en cours de configuration')

       // Code original commenté pour référence :
       /*
       const response = await fetch('/api/upload/logo', {
         method: 'POST',
         body: formData,
       })

       const result = await response.json()

       if (!result.success) {
         throw new Error(result.error || 'Erreur lors de l\'upload')
       }

       // Mettre à jour l'état
       setUploadedFile({
         name: file.name,
         url: result.url,
         size: file.size,
         preview: preview
       })

       // Notifier le parent
       onFileUploaded(result.url)
       */

    } catch (error) {
      console.error('Erreur upload:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeFile = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview)
    }
    setUploadedFile(null)
    setError(null)
    onFileRemoved()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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
              <div>
                <p className="text-sm font-medium text-blue-100">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-blue-300/60">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="mx-auto h-12 w-12 text-orange-500" />
                </motion.div>
              ) : (
                <Image className="mx-auto h-12 w-12 text-blue-300/60" />
              )}
              <div>
                <p className="text-sm font-medium text-blue-100">
                  {isUploading ? 'Upload en cours...' : label}
                </p>
                <p className="text-xs text-blue-300/60">
                  {placeholder}
                </p>
                <p className="text-xs text-blue-300/40 mt-1">
                  Types acceptés: {acceptedTypes.join(', ')} • Max: {formatFileSize(maxSize)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de suppression */}
        {uploadedFile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={removeFile}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors"
            type="button"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Message d'erreur */}
      <AnimatePresence>
        {(error || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1 text-red-400 text-xs"
          >
            <AlertCircle className="h-3 w-3" />
            {error || errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de validation */}
      <AnimatePresence>
        {isValid && uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1 text-green-400 text-xs"
          >
            <CheckCircle className="h-3 w-3" />
            Logo valide
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
