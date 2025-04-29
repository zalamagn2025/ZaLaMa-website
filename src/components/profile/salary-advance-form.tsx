"use client"

import { useState } from "react"
import { IconCreditCard, IconX, IconCheck } from "@tabler/icons-react"

interface SalaryAdvanceFormProps {
  onClose: () => void
  userPhone: string
}

export function SalaryAdvanceForm({ onClose, userPhone }: SalaryAdvanceFormProps) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [receivePhone, setReceivePhone] = useState(userPhone)
  const [useDefaultPhone, setUseDefaultPhone] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simuler une soumission
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Fermer après 2 secondes en cas de succès
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
          <IconCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Demande envoyée avec succès</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Votre demande d&rsquo;avance sur salaire a été soumise et est en cours de traitement.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <IconCreditCard className="h-6 w-6 text-indigo-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Demande d&rsquo;avance sur salaire</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant demandé (GNF) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ex: 500000"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Vous pouvez demander jusqu&rsquo;à 750,000 GNF (30% de votre salaire)
            </p>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motif de la demande <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Expliquez brièvement pourquoi vous avez besoin de cette avance"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="receive-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numéro de réception <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  id="use-default"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  checked={useDefaultPhone}
                  onChange={() => {
                    setUseDefaultPhone(!useDefaultPhone)
                    if (!useDefaultPhone) {
                      setReceivePhone(userPhone)
                    }
                  }}
                />
                <label htmlFor="use-default" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Utiliser mon numéro
                </label>
              </div>
            </div>
            <input
              type="tel"
              id="receive-phone"
              value={receivePhone}
              onChange={(e) => setReceivePhone(e.target.value)}
              disabled={useDefaultPhone}
              className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${useDefaultPhone ? 'opacity-60' : ''}`}
              placeholder="Ex: +224 625 21 21 15"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Numéro qui recevra l&rsquo;argent via Mobile Money
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Informations importantes</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Le montant sera déduit de votre prochain salaire</li>
                    <li>Des frais de service de 2% seront appliqués</li>
                    <li>Le traitement prend généralement 24 heures ouvrables</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              J&rsquo;accepte les conditions générales et je comprends que cette avance sera déduite de mon prochain salaire
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement en cours...
              </>
            ) : (
              "Soumettre la demande"
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 