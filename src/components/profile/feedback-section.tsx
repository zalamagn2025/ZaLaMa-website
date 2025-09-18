'use client'

import { motion } from 'framer-motion'
import { Star, StarHalf, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useAvisSWR, useAvisLimit } from '@/hooks/use-avis-swr'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

// type Service = {
//   id: string
//   name: string
// }

// const services: Service[] = [
//   { id: 'avance-salaire', name: 'Avance sur salaire' },
//   { id: 'pret-personnel', name: 'Prêt personnel' },
//   { id: 'epargne', name: 'Compte épargne' },
//   { id: 'conseil-financier', name: 'Conseil financier' },
// ]

export function FeedbackSection() {
  // const [selectedService, setSelectedService] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'positif' | 'negatif' | null>(null)
  
  const { createAvis, error: avisError } = useAvisSWR()
  const { limitInfo, loading: limitLoading } = useAvisLimit()

  // Automatiser le type de retour selon le nombre d'étoiles
  useEffect(() => {
    if (rating >= 3) {
      setFeedbackType('positif')
    } else if (rating > 0) {
      setFeedbackType('negatif')
    } else {
      setFeedbackType(null)
    }
  }, [rating])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!rating || !comment || !feedbackType) {
      return
    }

    // Vérifier la limite avant l'envoi
    if (limitInfo && !limitInfo.canPost) {
      return
    }

    try {
      const success = await createAvis({
        note: rating,
        commentaire: comment,
        type_retour: feedbackType
      })
      
      if (success) {
        // Réinitialiser le formulaire
        setRating(0)
        setHoverRating(0)
        setComment('')
        setFeedbackType(null)
        setIsSubmitted(true)
        
        /*console.log('✅ Avis créé avec SWR, mise à jour optimiste en cours...')*/
        
        // Réinitialiser le message de succès après 3 secondes
        setTimeout(() => {
          setIsSubmitted(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'avis:', error)
    }
  }

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        disabled={limitInfo && !limitInfo.canPost}
      >
        {star <= (hoverRating || rating) ? (
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        ) : star - 0.5 <= (hoverRating || rating) ? (
          <StarHalf className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        ) : (
          <Star className="w-8 h-8 text-gray-400" />
        )}
      </button>
    ))
  }

  const getFeedbackTypeText = () => {
    if (rating >= 3) {
      return 'Positif (automatique)'
    } else if (rating > 0) {
      return 'Négatif (automatique)'
    }
    return 'Sélectionnez une note'
  }

  const getFeedbackTypeColor = () => {
    if (rating >= 3) {
      return 'text-green-300'
    } else if (rating > 0) {
      return 'text-red-300'
    }
    return 'text-gray-400'
  }

  // Vérifier si le formulaire doit être désactivé
  const isFormDisabled = limitInfo && !limitInfo.canPost

  return (
    <motion.div 
      className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <svg 
          className="w-6 h-6 text-[#FF671E]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
          />
        </svg>
        Donnez votre avis
      </h3>
      
      {/* Affichage des informations de limite */}
      {!limitLoading && limitInfo && (
        <motion.div 
          className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            limitInfo.canPost 
              ? 'bg-green-500/10 border-green-500/30 text-green-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {limitInfo.canPost ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <div className="flex-1">
            <div className="font-medium">
              {limitInfo.canPost 
                ? `Vous pouvez encore poster ${limitInfo.remaining} avis aujourd'hui`
                : 'Limite d\'avis quotidienne atteinte'
              }
            </div>
            <div className="text-sm opacity-80">
              {limitInfo.currentCount}/{limitInfo.limit} avis utilisés aujourd'hui
            </div>
          </div>
          {limitInfo.canPost && (
            <div className="text-xs bg-green-500/20 px-2 py-1 rounded-full">
              {limitInfo.remaining} restant{limitInfo.remaining > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>
      )}
      
      {avisError && (
        <motion.div 
          className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {avisError}
        </motion.div>
      )}
      
      {isSubmitted ? (
        <motion.div 
          className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Merci pour votre avis ! Votre retour est précieux pour nous.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section commentée pour le moment
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Service concerné</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="bg-[#0A1A4F] border-[#1A3A8F] text-white">
                <SelectValue placeholder="Sélectionnez un service" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A1A4F] border-[#1A3A8F] text-white">
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          */}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Note</label>
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-3 text-gray-400 text-sm">
                {rating > 0 ? `${rating} étoile${rating > 1 ? 's' : ''}` : 'Aucune note'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Type de retour</label>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                rating >= 3
                  ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                  : rating > 0
                  ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                  : 'bg-[#0A1A4F] border border-[#1A3A8F] text-gray-400'
              }`}>
                {rating >= 3 ? (
                  <ThumbsUp className="w-5 h-5" />
                ) : rating > 0 ? (
                  <ThumbsDown className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5" />
                )}
                <span className={getFeedbackTypeColor()}>
                  {getFeedbackTypeText()}
                </span>
              </div>
              
              {rating > 0 && (
                <span className="text-xs text-gray-500">
                  {rating >= 3 
                    ? '≥ 3 étoiles = Positif' 
                    : '< 3 étoiles = Négatif'
                  }
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Votre avis</label>
            <textarea
              className="flex w-full min-h-[120px] rounded-md border border-[#1A3A8F] bg-[#0A1A4F] px-3 py-2 text-sm text-white placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3A8F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={isFormDisabled ? "Limite d'avis quotidienne atteinte" : "Dites-nous ce que vous avez pensé de ce service..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!rating || !comment || !feedbackType || isFormDisabled}
              className="bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF8E53] hover:to-[#FF671E] text-white font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isFormDisabled ? 'Limite atteinte' : 'Envoyer mon avis'}
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  )
}
