"use client"

import { IconArrowRight } from "@tabler/icons-react"
import { useState } from "react"
import { SalaryAdvanceForm } from "./salary-advance-form"

export function FinancialServices() {
  const [activeService, setActiveService] = useState<string | null>(null)

  // Données fictives pour la démonstration
  const userPhone = "+224 625 21 21 15"

  const services = [
    {
      id: "advance",
      title: "Avance sur salaire",
      description: "Obtenez une avance sur votre prochain salaire, pour vos imprevus et urgences financières",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-indigo-500">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="7" y1="15" x2="9" y2="15" />
          <line x1="11" y1="15" x2="13" y2="15" />
        </svg>
      ),
      maxpourcent: "25%",
      eligibility: "Disponible"
    },
    {
      id: "loan",
      title: "Conseil financier",
      description: "Obtenez des conseils financiers personnalisés pour gérer vos finances.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-green-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      maxpourcent: "50%",
      eligibility: "Disponible"
    },
    {
      id: "p2p",
      title: "Prêt entre particuliers",
      description: "Empruntez auprès d&rsquo;autres utilisateurs ou prêtez votre argent.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-yellow-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      maxpourcent: "50%",
      eligibility: "Disponible"
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Services financiers disponibles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer"
            onClick={() => setActiveService(service.id)}
          >
            <div className="flex items-center mb-4">
              {service.icon}
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">{service.title}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{service.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pourcentage max</p>
                <p className="font-semibold text-gray-900 dark:text-white">{service.maxpourcent}</p>
              </div>
              <button className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                Demander <IconArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
            {activeService === "advance" ? (
              <SalaryAdvanceForm onClose={() => setActiveService(null)} userPhone={userPhone} />
            ) : activeService === "loan" ? (
              <FinancialAdviceForm onClose={() => setActiveService(null)} />
            ) : (
              <ServiceForm serviceId={activeService} onClose={() => setActiveService(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface ServiceFormProps {
  serviceId: string
  onClose: () => void
}

function FinancialAdviceForm({ onClose }: { onClose: () => void }) {
  const [financialGoal, setFinancialGoal] = useState("")
  const [currentSituation, setCurrentSituation] = useState("")
  const [preferredContactMethod, setPreferredContactMethod] = useState("email")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simuler une soumission
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 1500)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Demande de conseil financier</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="financialGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objectif financier
            </label>
            <select
              id="financialGoal"
              value={financialGoal}
              onChange={(e) => setFinancialGoal(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Sélectionnez un objectif</option>
              <option value="budget">Établir un budget</option>
              <option value="debt">Gérer mes dettes</option>
              <option value="savings">Augmenter mon épargne</option>
              <option value="investment">Conseils d'investissement</option>
              <option value="retirement">Planification de retraite</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="currentSituation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Décrivez votre situation financière actuelle
            </label>
            <textarea
              id="currentSituation"
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Décrivez vos revenus, dépenses, dettes, épargnes et préoccupations financières actuelles"
              required
            />
          </div>

          <div>
            <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Méthode de contact préférée
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="email"
                  name="contactMethod"
                  type="radio"
                  value="email"
                  checked={preferredContactMethod === "email"}
                  onChange={() => setPreferredContactMethod("email")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="email" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="phone"
                  name="contactMethod"
                  type="radio"
                  value="phone"
                  checked={preferredContactMethod === "phone"}
                  onChange={() => setPreferredContactMethod("phone")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="phone" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Téléphone
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="meeting"
                  name="contactMethod"
                  type="radio"
                  value="meeting"
                  checked={preferredContactMethod === "meeting"}
                  onChange={() => setPreferredContactMethod("meeting")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="meeting" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Rendez-vous en personne
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              J&rsquo;accepte que mes informations soient utilisées pour me fournir des conseils financiers personnalisés
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
            {loading ? "Traitement en cours..." : "Demander un conseil"}
          </button>
        </div>
      </form>
    </div>
  )
}

function ServiceForm({ serviceId, onClose }: ServiceFormProps) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("1")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simuler une soumission
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 1500)
  }

  const getServiceTitle = () => {
    switch (serviceId) {
      case "p2p":
        return "Demande de prêt entre particuliers"
      default:
        return "Demande de service financier"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{getServiceTitle()}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant demandé (GNF)
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
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motif de la demande
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Expliquez brièvement pourquoi vous avez besoin de ce financement"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée de remboursement (mois)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="1">1 mois</option>
              <option value="3">3 mois</option>
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              J&rsquo;accepte les conditions générales et je comprends les modalités de remboursement
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
            {loading ? "Traitement en cours..." : "Soumettre la demande"}
          </button>
        </div>
      </form>
    </div>
  )
} 