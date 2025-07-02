'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, Calendar, MessageCircle, RefreshCw } from 'lucide-react'
import { useAvisSWR } from '@/hooks/use-avis-swr'

export function AvisHistory() {
  const { avis, loading, error } = useAvisSWR()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
      />
    ))
  }

  const getTypeRetourIcon = (type: string) => {
    return type === 'positif' ? (
      <ThumbsUp className="w-4 h-4 text-green-500" />
    ) : (
      <ThumbsDown className="w-4 h-4 text-red-500" />
    )
  }

  const getTypeRetourText = (type: string) => {
    return type === 'positif' ? 'Positif' : 'Négatif'
  }

  if (loading) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-[#FF671E] animate-spin mr-3" />
          <span className="text-white">Chargement des avis...</span>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erreur de chargement</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF671E] text-white rounded-lg hover:bg-[#FF8E53] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </motion.div>
    )
  }

  if (avis.length === 0) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun avis</h3>
          <p className="text-gray-400">
            Vous n'avez pas encore donné d'avis. Soyez le premier à partager votre expérience !
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-[#FF671E]" />
        Historique de vos avis ({avis.length})
      </h3>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {avis.map((avisItem, index) => (
            <motion.div
              key={avisItem.id}
              className="bg-[#0A1A4F]/50 rounded-lg p-4 border border-[#1A3A8F]/50"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              layout
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(avisItem.note)}
                  </div>
                  <span className="text-sm text-gray-300 ml-2">
                    {avisItem.note}/5
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {avisItem.type_retour && (
                    <div className="flex items-center gap-1 text-xs">
                      {getTypeRetourIcon(avisItem.type_retour)}
                      <span className="text-gray-400">
                        {getTypeRetourText(avisItem.type_retour)}
                      </span>
                    </div>
                  )}
                  
                  {avisItem.approuve && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      Approuvé
                    </span>
                  )}
                </div>
              </div>

              {avisItem.commentaire && (
                <p className="text-white text-sm mb-3 leading-relaxed">
                  {avisItem.commentaire}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {avisItem.date_avis ? formatDate(avisItem.date_avis) : 'Date inconnue'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 