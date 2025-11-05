"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconCheck, IconClock, IconX } from "@tabler/icons-react"
import { PaymentServiceCard, PaymentData } from "./payment-service-card"

interface PendingPaymentsProps {
  userId: string
  onClose: () => void
  salaireDisponible?: number
}

export function PendingPayments({ userId, onClose, salaireDisponible = 0 }: PendingPaymentsProps) {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les paiements en attente dynamiquement
  useEffect(() => {
    const loadPendingPayments = async () => {
      try {
        setIsLoading(true)
        
        // Récupérer les paiements depuis l'API
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')
        if (!accessToken) {
          console.warn("⚠️ Token d'authentification manquant")
          setPayments([])
          return
        }

        // TODO: Remplacer par un vrai appel API pour récupérer les paiements en attente
        // const response = await fetch('/api/payments/pending', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`,
        //     'Content-Type': 'application/json',
        //   },
        // })
        
        // Pour l'instant, on simule un appel API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Créer la liste des paiements dynamiquement
        const allPayments: PaymentData[] = []
        
        // Ajouter le paiement de salaire si disponible
        if (salaireDisponible > 0) {
          const salaryPayment: PaymentData = {
            id: "salary-payment",
            clientName: "Paiement de salaire",
            clientEmail: "salaire@zalama.gn",
            amount: salaireDisponible,
            currency: "GNF",
            status: "pending",
            createdAt: new Date().toISOString(),
            reference: `SAL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`
          }
          allPayments.push(salaryPayment)
        }
        
        // TODO: Ajouter ici les autres paiements récupérés depuis l'API
        // allPayments.push(...apiPayments)
        
        setPayments(allPayments)
      } catch (error) {
        console.error('Erreur lors du chargement des paiements en attente:', error)
        setPayments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPendingPayments()
  }, [userId, salaireDisponible])

  const handleStatusChange = (paymentId: string, newStatus: PaymentData['status']) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: newStatus,
            receivedAt: newStatus === 'received' ? new Date().toISOString() : payment.receivedAt
          }
        : payment
    ))
  }

  const handleDownload = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId)
    if (payment) {
      const receipt = `RÉCÉPISSÉ DE PAIEMENT\n\nClient: ${payment.clientName}\nMontant: ${payment.amount.toLocaleString()} GNF\nDate: ${new Date().toLocaleDateString('fr-FR')}\nRéférence: ${payment.reference}`
      const blob = new Blob([receipt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `recu-${payment.reference}.txt`
      link.click()
      URL.revokeObjectURL(url)
    }
  }


  return (
    <div className="bg-[#010D3E] rounded-2xl shadow-xl border border-gray-100/10 max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white">Paiements en Attente</h2>
          <p className="text-white/60 mt-1">Paiements à recevoir</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <IconX className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Contenu */}
      <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((_, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-white/20 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/40 mb-4">
              <IconClock className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Aucun paiement en attente</h3>
            <p className="text-white/60">
              Vous n'avez pas de paiements à recevoir pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PaymentServiceCard
                  payment={payment}
                  onStatusChange={handleStatusChange}
                  onDownload={handleDownload}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

