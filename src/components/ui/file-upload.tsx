"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FileUploadProps {
  onFileUploaded: (url: string) => void
  onFileRemoved: () => void
  acceptedTypes?: string[]
  maxSize?: number // en bytes
  label?: string
  placeholder?: string
  className?: string
}

export function FileUpload({
  onFileUploaded,
  onFileRemoved,
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB par défaut
  label = "Lettre de motivation",
  placeholder = "Glissez votre fichier ici ou cliquez pour sélectionner",
  className = ""
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    url: string
    size: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      // Créer FormData pour l'upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload vers l'API
      const response = await fetch('/api/upload/motivation-letter', {
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
        size: file.size
      })

      // Notifier le parent
      onFileUploaded(result.url)

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
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive 
            ? 'border-[#FF671E] bg-[#FF671E]/5' 
            : uploadedFile 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
              : 'border-gray-300 dark:border-gray-600 hover:border-[#FF671E]'
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
              className="space-y-2"
            >
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="mx-auto h-12 w-12 text-[#FF671E]" />
                </motion.div>
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {isUploading ? 'Upload en cours...' : label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
            className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
            type="button"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Message d'erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 