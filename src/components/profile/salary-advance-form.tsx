"use client"

import { useState } from "react"
import { IconCreditCard, IconX, IconCheck, IconInfoCircle } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"

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
    
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Close after 2 seconds on success
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <div className="flex items-start justify-center min-h-screen pt-16"> {/* Changé de pt-10 à pt-16 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#010D3E] rounded-2xl shadow-2xl shadow-blue-500/10"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                className="text-center p-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
                  className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#FF671E] to-[#FF8E53] shadow-[0_0_15px_rgba(255,103,30,0.5)]"
                >
                  <IconCheck className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h3 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-6 text-xl font-semibold text-white"
                >
                  Demande envoyée avec succès
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-2 text-sm text-gray-300"
                >
                  Votre demande d&apos;avance sur salaire a été soumise et est en cours de traitement.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] shadow-lg"
                    >
                      <IconCreditCard className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      Avance sur salaire
                    </h3>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-[#0A1A5A] transition-colors"
                  >
                    <IconX className="h-5 w-5 text-gray-300" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <label htmlFor="amount" className="text-sm font-medium text-gray-300">
                      Montant demandé (GNF)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white"
                        placeholder="Ex: 500000"
                        required
                      />
                      <span className="absolute right-3 top-3 text-xs text-gray-400">
                        GNF
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Maximum: 750,000 GNF (30% de votre salaire)
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <label htmlFor="reason" className="text-sm font-medium text-gray-300">
                      Motif de la demande
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white"
                      placeholder="Expliquez pourquoi vous avez besoin de cette avance..."
                      required
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <label htmlFor="receive-phone" className="text-sm font-medium text-gray-300">
                        Numéro de réception
                      </label>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="use-default" className="text-xs text-gray-400">
                          Utiliser mon numéro
                        </label>
                        <div className="relative inline-flex items-center">
                          <input
                            id="use-default"
                            type="checkbox"
                            className="sr-only peer"
                            checked={useDefaultPhone}
                            onChange={() => {
                              setUseDefaultPhone(!useDefaultPhone)
                              if (!useDefaultPhone) {
                                setReceivePhone(userPhone)
                              }
                            }}
                          />
                          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF671E] peer-checked:to-[#FF8E53]"></div>
                        </div>
                      </div>
                    </div>
                    <input
                      type="tel"
                      id="receive-phone"
                      value={receivePhone}
                      onChange={(e) => setReceivePhone(e.target.value)}
                      disabled={useDefaultPhone}
                      className={`block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white ${useDefaultPhone ? 'opacity-60' : ''}`}
                      placeholder="Ex: +224 625 21 21 15"
                      required
                    />
                    <p className="text-xs text-gray-400">
                      L&apos;argent sera envoyé via Mobile Money
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    className="p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]"
                  >
                    <div className="flex items-start space-x-3">
                      <IconInfoCircle className="h-5 w-5 text-[#FF8E53] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-[#FF8E53]">Informations importantes</h3>
                        <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Le montant sera déduit de votre prochain salaire</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Frais de service: 2% du montant</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Traitement sous 24 heures ouvrables</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <input
                      id="terms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-600 text-[#FF671E] focus:ring-[#FF671E] focus:ring-offset-0"
                      required
                    />
                    <label htmlFor="terms" className="text-xs text-gray-400">
                      J&apos;accepte que cette avance soit déduite de mon prochain salaire et je comprends les conditions générales.
                    </label>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    className="flex justify-end space-x-3 pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0A1A5A] hover:bg-[#142B7F] transition-colors duration-200"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] shadow-lg hover:shadow-[#FF671E]/30 disabled:opacity-70 transition-all duration-200 relative overflow-hidden"
                    >
                      {loading ? (
                        <>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          <span className="opacity-0">Soumettre</span>
                        </>
                      ) : (
                        "Soumettre la demande"
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#010D3E] to-transparent pointer-events-none" />
      </motion.div>
    </div>
  )
}