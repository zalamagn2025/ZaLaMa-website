"use client"

import { IconArrowRight } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SalaryAdvanceForm } from "./salary-advance-form"
import { AI } from "@/components/profile/AI"
import { UserWithEmployeData } from "@/types/employe"
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  nom: string
  description: string
  categorie: string
  frais_attribues: number
  pourcentage_max: number
  duree: string
  disponible: boolean
  image_url?: string
  date_creation: string
  created_at: string
  updated_at: string
}

export function FinancialServices({ user }: { user: UserWithEmployeData }) {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('services')
          .select('*')
    
        if (error) {
          console.error("Erreur lors de la récupération des services:", error)
          setError(error.message)
          return
        }
        
        setServices(data || [])
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error)
        setError("Erreur de connexion")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Map Supabase services to the format used in the component
  const mappedServices = services.map(service => {
    return {
      id: service.id,
      nom: service.nom,
      title: service.nom,
      description: service.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-8 w-8 ${
            service.nom.toLowerCase().includes("avance") ? "text-blue-500" :
            service.nom.toLowerCase().includes("prêt") ? "text-orange-500" :
            "text-green-500"
          }`}
        >
          {service.nom.toLowerCase().includes("avance") && (
            <>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <line x1="7" y1="15" x2="9" y2="15" />
              <line x1="11" y1="15" x2="13" y2="15" />
            </>
          )}
          {service.nom.toLowerCase().includes("prêt") && (
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </>
          )}
          {service.nom.toLowerCase().includes("conseil") && (
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </>
          )}
        </svg>
      ),
      maxpourcent: service.nom.toLowerCase().includes("prêt") ? undefined : `${service.pourcentage_max}%`,
      maxAmount: service.nom.toLowerCase().includes("prêt") ? "25 000 000" : undefined,
      eligibility: service.disponible ? "Disponible" : "Indisponible"
    }
  })

  return (
    <div className="py-8 bg-[#010D3E]">
      {/* <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white mb-8 text-center"
      >
        Services financiers disponibles
      </motion.h2> */}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border border-gray-100/30 animate-pulse"
            >
              <div className="h-8 w-8 bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-full mb-4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Recharger
          </button>
        </div>
      ) : mappedServices.length === 0 ? (
        <div className="text-center text-white">
          <p className="mb-4">Aucun service disponible</p>
          <p className="text-sm text-gray-400">Vérifiez que les services ont été ajoutés à la base de données</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {mappedServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={service.eligibility === "Disponible" ? { 
                scale: 1.03,
                boxShadow: service.nom.toLowerCase().includes("avance") ? "0 8px 20px rgba(59, 130, 246, 0.3)" : 
                          service.nom.toLowerCase().includes("conseil") ? "0 8px 20px rgba(34, 197, 94, 0.3)" : 
                          "0 8px 20px rgba(249, 115, 22, 0.3)"
              } : {}}
              className={`bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border ${
                service.nom.toLowerCase().includes("avance") ? "border-blue-500/30" : 
                service.nom.toLowerCase().includes("conseil") ? "border-green-500/30" : 
                "border-orange-500/30"
              } ${service.eligibility === "Disponible" ? "cursor-pointer" : "cursor-not-allowed opacity-60"} transition-all duration-300 relative overflow-hidden flex flex-col h-64`}
              onClick={() => {
                if (service.eligibility === "Disponible") {
                  if (service.nom.toLowerCase().includes("conseil")) {
                    setIsChatbotOpen(true)
                  } else {
                    setActiveService(service.id)
                  }
                }
              }}
            >
              <motion.div
                className={`absolute top-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full ${
                  service.eligibility === "Disponible" 
                    ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53]" 
                    : "bg-gray-500"
                }`}
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
                    {service.nom.toLowerCase().includes("prêt") ? "Montant max" : "Pourcentage max"}
                  </p>
                  <p className="font-semibold text-white">{service.nom.toLowerCase().includes("prêt") ? service.maxAmount : service.maxpourcent}</p>
                </div>
                <motion.button
                  whileHover={service.eligibility === "Disponible" ? { scale: 1.1, x: 5 } : {}}
                  whileTap={service.eligibility === "Disponible" ? { scale: 0.95 } : {}}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (service.eligibility === "Disponible") {
                      if (service.nom.toLowerCase().includes("conseil")) {
                        setIsChatbotOpen(true)
                      } else {
                        setActiveService(service.id)
                      }
                    }
                  }}
                  className={`inline-flex items-center text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300 ${
                    service.eligibility === "Disponible"
                      ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF551E] hover:to-[#FF7E53]"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={service.eligibility !== "Disponible"}
                >
                  Demander <IconArrowRight className="ml-1 h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeService && !services.find(s => s.id === activeService)?.nom.toLowerCase().includes("conseil") && (
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
              {services.find(s => s.id === activeService)?.nom.toLowerCase().includes("avance") ? (
                <SalaryAdvanceForm onClose={() => setActiveService(null)} user={user} />
              ) : (
                <div className="text-white text-center p-4">
                  <p>Le formulaire pour ce service n&apos;est pas encore disponible.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveService(null)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white rounded-lg"
                  >
                    Fermer
                  </motion.button>
                </div>
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