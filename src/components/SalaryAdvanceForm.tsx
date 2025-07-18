'use client'

import React, { useState, useEffect } from 'react'
import { 
  CheckIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface SalaryAdvanceFormProps {
  onClose: () => void
}

interface FormData {
  employeId: string
  montantDemande: string
  typeMotif: string
  motif: string
  numeroReception: string
  fraisService: string
  montantTotal: string
  salaireDisponible: string
  avanceDisponible: string
  entrepriseId: string
}

interface Transaction {
  id: string
  montant: number
  date_transaction: string
  statut: string
  type: string
}

export default function SalaryAdvanceForm({ onClose }: SalaryAdvanceFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    employeId: '',
    montantDemande: '',
    typeMotif: '',
    motif: '',
    numeroReception: '',
    fraisService: '0',
    montantTotal: '',
    salaireDisponible: '',
    avanceDisponible: '',
    entrepriseId: ''
  })

  // Calculer l'avance disponible dynamiquement avec les vraies données
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        
        const response = await fetch('/api/auth/me')
        const result = await response.json()

        if (result.user) {
          const userData = result.user
          
          console.log('📊 Données utilisateur récupérées:', userData)
          console.log('🏢 Partenaire ID:', userData.partenaireId)

          // Utiliser la même logique que le profil pour calculer l'avance disponible
          const salaireNet = userData.salaireNet || 0
          
          // Calculer les jours ouvrables écoulés ce mois-ci (pour information seulement)
          const today = new Date()
          const currentMonth = today.getMonth()
          const currentYear = today.getFullYear()
          
          const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, today.getDate())
          const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
          
          // L'avance sur salaire est limitée à 25% du salaire net (pas de calcul de jours)
          const availableAdvance = Math.floor(salaireNet * 0.25)
          
          console.log('💰 Calcul avance sur salaire:', {
            salaireNet,
            availableAdvance,
            workingDaysElapsed,
            totalWorkingDays,
            partenaireId: userData.partenaireId
          })

          setFormData(prev => ({
            ...prev,
            employeId: userData.employeId,
            entrepriseId: userData.partenaireId,
            salaireDisponible: salaireNet.toLocaleString(),
            avanceDisponible: availableAdvance.toLocaleString()
          }))

        } else {
          console.error('Erreur récupération données:', result.error)
        }

      } catch (error) {
        console.error('Erreur fetch données:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Fonction pour calculer les jours ouvrables écoulés (même logique que le profil)
  const getWorkingDaysElapsed = (year: number, month: number, currentDay: number): number => {
    let workingDays = 0
    
    for (let day = 1; day <= currentDay; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      
      // Exclure samedi (6) et dimanche (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++
      }
    }
    
    return workingDays
  }

  // Fonction pour calculer le total de jours ouvrables dans le mois (même logique que le profil)
  const getTotalWorkingDaysInMonth = (year: number, month: number): number => {
    const lastDay = new Date(year, month + 1, 0).getDate()
    let totalWorkingDays = 0
    
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      
      // Exclure samedi (6) et dimanche (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        totalWorkingDays++
      }
    }
    
    return totalWorkingDays
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Calculer le montant total automatiquement
      if (field === 'montantDemande' || field === 'fraisService') {
        const montant = parseFloat(updated.montantDemande) || 0
        const frais = parseFloat(updated.fraisService) || 0
        updated.montantTotal = (montant + frais).toString()
      }
      
      return updated
    })
  }

  const handleStep1Submit = () => {
    if (!formData.montantDemande || !formData.motif) {
      return
    }
    setCurrentStep(2)
  }

  const handleStep2Submit = () => {
    setCurrentStep(3)
  }

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setPasswordError('Veuillez saisir votre mot de passe')
      return
    }

    setIsSubmitting(true)
    setPasswordError('')

    try {
      const requestData = {
        employeId: formData.employeId,
        montantDemande: formData.montantDemande,
        typeMotif: formData.typeMotif,
        motif: formData.motif,
        numeroReception: formData.numeroReception,
        fraisService: formData.fraisService,
        montantTotal: formData.montantTotal,
        salaireDisponible: formData.salaireDisponible,
        avanceDisponible: formData.avanceDisponible,
        entrepriseId: formData.entrepriseId,
        password: password
      }

      console.log('📤 Données envoyées à l\'API:', requestData)

      const response = await fetch('/api/salary-advance/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (result.success) {
        setCurrentStep(4) // Étape de succès
        setSuccessMessage(result.message)
      } else {
        // Gestion des erreurs spécifiques
        if (result.locked) {
          setPasswordError(`🔒 ${result.message}`)
        } else if (result.attempts) {
          const remainingAttempts = result.maxAttempts - result.attempts
          setPasswordError(`⚠️ ${result.message}`)
          // Afficher un avertissement visuel
          if (remainingAttempts <= 1) {
            setPasswordError(`🚨 Attention ! Il ne vous reste qu'${remainingAttempts} tentative. Vérifiez bien votre mot de passe.`)
          }
        } else {
          setPasswordError(result.message || 'Erreur lors de la soumission')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      setPasswordError('Erreur de connexion. Vérifiez votre connexion internet.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setPassword('')
    setPasswordError('')
    setSuccessMessage('')
    setFormData({
      employeId: '',
      montantDemande: '',
      typeMotif: '',
      motif: '',
      numeroReception: '',
      fraisService: '0',
      montantTotal: '',
      salaireDisponible: '',
      avanceDisponible: '',
      entrepriseId: ''
    })
  }

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Calcul de votre avance disponible...
            </h3>
            <p className="text-sm text-gray-600">
              Récupération de vos données en cours
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Demande d'avance sur salaire
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Étape {currentStep} sur 4</span>
              <span>{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Étape 1: Saisie des informations */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Informations de la demande
                </h3>
                <p className="text-sm text-gray-600">
                  Remplissez les informations de votre demande d'avance
                </p>
              </div>

              {/* Montant disponible */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Avance disponible</span>
                  <span className="text-lg font-bold text-blue-900">{formData.avanceDisponible} GNF</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Limite mensuelle: 25% de votre salaire net
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Information: {getWorkingDaysElapsed(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())} jours ouvrables écoulés sur {getTotalWorkingDaysInMonth(new Date().getFullYear(), new Date().getMonth())} jours
                </p>
              </div>

              {/* Montant demandé */}
              <div>
                <label htmlFor="montantDemande" className="block text-sm font-medium text-gray-700 mb-2">
                  Montant demandé (GNF)
                </label>
                <input
                  type="number"
                  id="montantDemande"
                  value={formData.montantDemande}
                  onChange={(e) => handleInputChange('montantDemande', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 100000"
                  max={parseFloat(formData.avanceDisponible.replace(/,/g, ''))}
                />
                {formData.montantDemande && parseFloat(formData.montantDemande) > parseFloat(formData.avanceDisponible.replace(/,/g, '')) && (
                  <p className="mt-1 text-sm text-red-600">
                    Le montant demandé dépasse votre avance disponible
                  </p>
                )}
              </div>

              {/* Type de motif */}
              <div>
                <label htmlFor="typeMotif" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de motif
                </label>
                <select
                  id="typeMotif"
                  value={formData.typeMotif}
                  onChange={(e) => handleInputChange('typeMotif', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="urgent">Urgent</option>
                  <option value="medical">Médical</option>
                  <option value="education">Éducation</option>
                  <option value="logement">Logement</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Motif détaillé */}
              <div>
                <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-2">
                  Motif détaillé
                </label>
                <textarea
                  id="motif"
                  value={formData.motif}
                  onChange={(e) => handleInputChange('motif', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez le motif de votre demande..."
                />
              </div>

              {/* Bouton suivant */}
              <button
                onClick={handleStep1Submit}
                disabled={!formData.montantDemande || !formData.motif || parseFloat(formData.montantDemande) > parseFloat(formData.avanceDisponible.replace(/,/g, ''))}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}

          {/* Étape 2: Vérification des détails */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vérification des détails
                </h3>
                <p className="text-sm text-gray-600">
                  Vérifiez les informations de votre demande
                </p>
              </div>

              {/* Résumé de la demande */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Résumé de votre demande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant demandé:</span>
                    <span className="font-medium">{parseFloat(formData.montantDemande).toLocaleString()} GNF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type de motif:</span>
                    <span className="font-medium capitalize">{formData.typeMotif}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motif:</span>
                    <span className="font-medium">{formData.motif}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de service:</span>
                    <span className="font-medium">{parseFloat(formData.fraisService).toLocaleString()} GNF</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Total:</span>
                    <span className="text-gray-900 font-bold">{parseFloat(formData.montantTotal).toLocaleString()} GNF</span>
                  </div>
                </div>
              </div>

              {/* Informations importantes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800 font-medium">Informations importantes</p>
                    <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                      <li>• Votre demande sera traitée dans les 24-48h</li>
                      <li>• Le montant sera déduit de votre prochain salaire</li>
                      <li>• Des frais de service peuvent s'appliquer</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Retour
                </button>
                <button
                  onClick={handleStep2Submit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation par mot de passe */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <LockClosedIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirmation de sécurité
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Pour finaliser votre demande, veuillez saisir votre mot de passe de compte
                </p>
              </div>

              {/* Résumé de la demande */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Résumé de votre demande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant demandé:</span>
                    <span className="font-medium">{parseFloat(formData.montantDemande).toLocaleString()} GNF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motif:</span>
                    <span className="font-medium">{formData.motif}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de service:</span>
                    <span className="font-medium">{parseFloat(formData.fraisService).toLocaleString()} GNF</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Total:</span>
                    <span className="text-gray-900 font-bold">{parseFloat(formData.montantTotal).toLocaleString()} GNF</span>
                  </div>
                </div>
              </div>

              {/* Champ mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe de votre compte
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      passwordError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Saisissez votre mot de passe"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {passwordError && (
                  <div className="mt-2 p-3 rounded-md bg-red-50 border border-red-200">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{passwordError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informations de sécurité */}
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-800 font-medium">Sécurité renforcée</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Votre mot de passe est vérifié de manière sécurisée. Après 3 tentatives incorrectes, 
                        votre compte sera temporairement verrouillé pour votre sécurité.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={isSubmitting || !password.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </div>
                  ) : (
                    'Confirmer la demande'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Étape 4: Succès */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Demande envoyée avec succès !
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {successMessage || 'Votre demande d\'avance a été enregistrée et sera traitée dans les plus brefs délais.'}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Prochaines étapes</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Vous recevrez une notification par email</li>
                  <li>• Le statut sera mis à jour dans votre profil</li>
                  <li>• Traitement sous 24-48h</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Nouvelle demande
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 