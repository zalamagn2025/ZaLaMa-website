"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface PaymentDaySelectorProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  hasError: boolean
  isValid: boolean
  errorMessage: string
  delay?: number
}

export function PaymentDaySelector({
  value,
  onChange,
  onBlur,
  hasError,
  isValid,
  errorMessage,
  delay = 0
}: PaymentDaySelectorProps) {
  const [selectedDay, setSelectedDay] = useState<string>('')

  // Options des jours (1 à 31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  // Jours qui peuvent poser problème (30, 31)
  const problematicDays = [30, 31]

  // Gérer le changement de jour
  const handleDayChange = (dayValue: string) => {
    setSelectedDay(dayValue)
    onChange(dayValue)
  }

  // Initialiser la valeur si elle existe
  useMemo(() => {
    if (value) {
      setSelectedDay(value)
    }
  }, [value])

  // Vérifier si le jour sélectionné est problématique
  const isProblematicDay = selectedDay && problematicDays.includes(parseInt(selectedDay))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
    >
      <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
        Jour de paiement <span className="text-red-400">*</span>
      </label>
      
      <div className="space-y-3">
        {/* Sélection du jour */}
        <select
          value={selectedDay}
          onChange={(e) => handleDayChange(e.target.value)}
          onBlur={onBlur}
          className={`bg-blue-950/30 border text-white h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all w-full ${
            hasError 
              ? 'border-red-500/70' 
              : isValid 
              ? 'border-green-500/70' 
              : 'border-blue-700/70'
          }`}
        >
          <option value="" className="bg-blue-950 text-white">
            Sélectionner le jour du mois
          </option>
          {days.map(day => (
            <option key={day} value={day.toString()} className="bg-blue-950 text-white">
              {day}
            </option>
          ))}
        </select>

        {/* Message d'aide principal */}
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 p-3 bg-blue-950/20 rounded-lg border border-blue-700/30"
          >
            <Calendar className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-300/90">
              <p className="font-medium mb-1">
                Paiement récurrent le {selectedDay} de chaque mois
              </p>
              <p className="text-blue-300/70">
                Le paiement sera automatiquement prévu pour ce jour chaque mois
              </p>
            </div>
          </motion.div>
        )}

        {/* Avertissement pour les jours problématiques */}
        {isProblematicDay && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30"
          >
            <Info className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-300/90">
              <p className="font-medium mb-1">
                Attention aux mois courts
              </p>
              <p className="text-amber-300/70">
                {selectedDay === '30' 
                  ? 'Février n\'a que 28 ou 29 jours. Le paiement sera prévu pour le dernier jour du mois.'
                  : 'Février (28/29 jours), avril, juin, septembre et novembre (30 jours) n\'ont pas 31 jours. Le paiement sera prévu pour le dernier jour du mois.'
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
      
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