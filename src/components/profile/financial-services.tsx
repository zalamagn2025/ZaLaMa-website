"use client"

import { IconArrowRight, IconX } from "@tabler/icons-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SalaryAdvanceForm } from "./salary-advance-form"
import { AI } from "@/components/profile/AI"
import { UserWithEmployeData } from "@/types/employe"

export function FinancialServices({ user }: { user: UserWithEmployeData }) {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
 

  const services = [
    {
      id: "advance",
      title: "Avance sur salaire",
      description: "Obtenez une avance sur votre prochain salaire, pour vos imprevus et urgences financières",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500">
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
      id: "p2p",
      title: "Prêt entre particuliers",
      description: "Des prêts directs entre utilisateurs, à moindre coût pour les emprunteurs et rentables pour les prêteurs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      maxAmount: "25 000 000",
      eligibility: "Indisponible"
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
      eligibility: "Indisponible"
    }
  ]

  return (
    <div className="py-8 bg-[#010D3E]">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white mb-8 text-center"
      >
        Services financiers disponibles
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: service.id === "advance" ? "0 8px 20px rgba(59, 130, 246, 0.3)" : 
                        service.id === "loan" ? "0 8px 20px rgba(34, 197, 94, 0.3)" : 
                        "0 8px 20px rgba(249, 115, 22, 0.3)"
            }}
            className={`bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border ${
              service.id === "advance" ? "border-blue-500/30" : 
              service.id === "loan" ? "border-green-500/30" : 
              "border-orange-500/30"
            } cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col h-64`}
            onClick={() => {
              if (service.id === "loan") {
                setIsChatbotOpen(true)
              } else {
                setActiveService(service.id)
              }
            }}
          >
            <motion.div
              className="absolute top-2 right-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white text-xs font-medium px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
            >
              {service.eligibility}
            </motion.div>
            <div className="flex items-center mb-4">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                {service.icon}
              </motion.div>
              <h3 className="ml-3 text-lg font-semibold text-white">{service.title}</h3>
            </div>
            <p className="text-white/80 text-sm mb-4 flex-grow">{service.description}</p>
            <div className="flex justify-between items-center mt-auto">
              <div>
                <p className="text-xs text-white/60">
                  {service.id === "p2p" ? "Montant max" : "Pourcentage max"}
                </p>
                <p className="font-semibold text-white">{service.id === "p2p" ? service.maxAmount : service.maxpourcent}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click from triggering
                  if (service.id === "loan") {
                    setIsChatbotOpen(true)
                  } else {
                    setActiveService(service.id)
                  }
                }}
                className="inline-flex items-center text-sm font-medium text-white bg-gradient-to-r from-[#FF671E] to-[#FF8E53] px-4 py-2 rounded-lg hover:from-[#FF551E] hover:to-[#FF7E53] transition-all duration-300"
              >
                Demander <IconArrowRight className="ml-1 h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeService && activeService !== "loan" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-[#010D3E] rounded-2xl p-6 shadow-xl border border-gray-100/10"
            >
              {activeService === "advance" ? (
                <SalaryAdvanceForm onClose={() => setActiveService(null)}  user={user}  />
              ) : (
                <ServiceForm serviceId={activeService} onClose={() => setActiveService(null)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[448px] bg-[#010D3E] shadow-xl z-50 p-4"
          >
            <div className="mb-4">
              <h2 className="text-white text-lg font-semibold">AI Chatbot</h2>
            </div>
            <AI onClose={() => setIsChatbotOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
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
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 1500)
  }

  const getServiceTitle = () => {
    switch (serviceId) {
      case "p2p":
        return "Demande de prêt entre particuliers"
      case "loan":
        return "Demande de conseil financier"
      default:
        return "Demande de service financier"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">{getServiceTitle()}</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#010D3E]/50"
        >
          <IconX className="h-5 w-5 text-white" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-white/80 mb-1">
            Montant demandé (GNF)
          </label>
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 103, 30, 0.3)" }}
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full px-3 py-2 bg-[#010D3E]/50 border border-gray-100/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF8E53] transition-all duration-200"
            placeholder="Ex: 500000"
            required
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-white/80 mb-1">
            Motif de la demande
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 103, 30, 0.3)" }}
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 bg-[#010D3E]/50 border border-gray-100/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF8E53] transition-all duration-200"
            placeholder="Expliquez brièvement pourquoi vous avez besoin de ce financement"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-white/80 mb-1">
            Durée de remboursement (mois)
          </label>
          <motion.select
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 103, 30, 0.3)" }}
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full px-3 py-2 bg-[#010D3E]/50 border border-gray-100/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF8E53] transition-all duration-200"
            required
          >
            <option value="1">1 mois</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
          </motion.select>
        </div>

        <div className="flex items-center mt-6">
          <motion.input
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-[#FF8E53] focus:ring-[#FF8E53] border-gray-100/10 rounded"
            checked={true}
            onChange={() => {}}
            readOnly
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-white/80">
            J&apos;accepte les conditions générales et je comprends les modalités de remboursement
          </label>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#010D3E]/50 border border-gray-100/10 rounded-lg text-sm font-medium text-white hover:bg-[#010D3E]/70 transition-all duration-200"
          >
            Annuler
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white rounded-lg text-sm font-medium hover:from-[#FF551E] hover:to-[#FF7E53] disabled:opacity-70 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Traitement...
              </div>
            ) : (
              "Soumettre la demande"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}