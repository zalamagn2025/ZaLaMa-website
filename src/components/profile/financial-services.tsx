"use client"

import { useState } from "react"
import { IconCreditCard, IconReceipt, IconCoin, IconArrowRight } from "@tabler/icons-react"
import { SalaryAdvanceForm } from "./salary-advance-form"

export function FinancialServices() {
  const [activeService, setActiveService] = useState<string | null>(null)

  // Données fictives pour la démonstration
  const userPhone = "+224 625 21 21 15"

  const services = [
    {
      id: "advance",
      title: "Avance sur salaire",
      description: "Obtenez une avance sur votre prochain salaire, remboursable automatiquement.",
      icon: <IconCreditCard className="h-8 w-8 text-indigo-500" />,
      maxAmount: "750,000 GNF",
      eligibility: "Disponible"
    },
    {
      id: "loan",
      title: "Prêt personnel",
      description: "Empruntez pour vos projets personnels avec des taux avantageux.",
      icon: <IconReceipt className="h-8 w-8 text-green-500" />,
      maxAmount: "5,000,000 GNF",
      eligibility: "Disponible"
    },
    {
      id: "p2p",
      title: "Prêt entre particuliers",
      description: "Empruntez auprès d'autres utilisateurs ou prêtez votre argent.",
      icon: <IconCoin className="h-8 w-8 text-yellow-500" />,
      maxAmount: "3,000,000 GNF",
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Montant max</p>
                <p className="font-semibold text-gray-900 dark:text-white">{service.maxAmount}</p>
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
      case "loan":
        return "Demande de prêt personnel"
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
              J'accepte les conditions générales et je comprends les modalités de remboursement
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