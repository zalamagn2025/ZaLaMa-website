"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Upload, X, AlertCircle, CheckCircle, File, Type } from 'lucide-react'

interface MotivationLetterInputProps {
  textValue: string
  fileValue: File | null
  onTextChange: (value: string) => void
  onFileChange: (file: File | null) => void
  onBlur: () => void
  hasError: boolean
  isValid: boolean
  errorMessage: string
  delay?: number
}

export function MotivationLetterInput({
  textValue,
  fileValue,
  onTextChange,
  onFileChange,
  onBlur,
  hasError,
  isValid,
  errorMessage,
  delay = 0
}: MotivationLetterInputProps) {
  const [inputType, setInputType] = useState<'text' | 'file'>('text')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximum : 5 MB')
        return
      }
      
      // Vérifier le type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('Format de fichier non supporté. Utilisez PDF ou Word (.doc, .docx)')
        return
      }
      
      onFileChange(file)
      onTextChange('') // Vider le texte si on upload un fichier
    }
  }

  const handleTextChange = (value: string) => {
    onTextChange(value)
    if (fileValue) {
      onFileChange(null) // Supprimer le fichier si on écrit du texte
    }
  }

  const removeFile = () => {
    onFileChange(null)
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-4"
    >
      <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
        Lettre de motivation <span className="text-red-400">*</span>
      </label>

      {/* Choix du type d'entrée */}
      <div className="flex gap-2">
        <motion.button
          type="button"
          onClick={() => setInputType('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            inputType === 'text'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
              : 'bg-blue-950/30 text-blue-300 border border-blue-700/50 hover:bg-blue-950/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Type className="h-4 w-4" />
          Rédiger
        </motion.button>
        
        <motion.button
          type="button"
          onClick={() => setInputType('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            inputType === 'file'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
              : 'bg-blue-950/30 text-blue-300 border border-blue-700/50 hover:bg-blue-950/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload className="h-4 w-4" />
          Uploader
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {inputType === 'text' ? (
          <motion.div
            key="text-input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={onBlur}
              placeholder="Rédigez votre lettre de motivation ici..."
              rows={8}
              className={`w-full bg-blue-950/30 border text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent p-4 transition-all resize-none ${
                hasError 
                  ? 'border-red-500/70' 
                  : isValid 
                  ? 'border-green-500/70' 
                  : 'border-blue-700/70'
              }`}
            />
            <p className="text-xs text-blue-300/70 mt-2">
              <FileText className="inline h-3 w-3 mr-1" />
              Minimum 100 caractères recommandé
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="file-input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-2 border-dashed border-blue-700/50 rounded-xl p-6 text-center hover:border-orange-500/50 transition-colors">
              {fileValue ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Fichier uploadé</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-300">
                    <File className="h-4 w-4" />
                    <span>{fileValue.name}</span>
                    <span className="text-xs text-blue-400">
                      ({formatFileSize(fileValue.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    <X className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-blue-400 mx-auto" />
                  <div>
                    <p className="text-blue-100 font-medium mb-1">
                      Cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-blue-300/70 text-sm">
                      PDF ou Word (max 5 MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Choisir un fichier
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Afficher l'erreur */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 mt-1 text-red-400 text-xs"
        >
          <AlertCircle className="h-3 w-3" />
          {errorMessage}
        </motion.div>
      )}
      
      {/* Afficher "Valide" */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 mt-1 text-green-400 text-xs"
        >
          <CheckCircle className="h-3 w-3" />
          Valide
        </motion.div>
      )}
    </motion.div>
  )
} 