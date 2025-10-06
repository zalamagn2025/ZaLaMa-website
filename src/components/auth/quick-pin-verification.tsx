'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import PinInput from '@/components/common/PinInput'
import { AccountSession } from '@/types/account-session'
import { IconUser, IconArrowLeft } from '@tabler/icons-react'
import Image from 'next/image'

interface QuickPinVerificationProps {
  account: AccountSession
  onSuccess: () => void
  onCancel: () => void
  onError: (error: string) => void
  verifyPin: (email: string, pin: string) => Promise<boolean>
  quickLogin?: (account: AccountSession, pin: string) => Promise<void>
}

export function QuickPinVerification({
  account,
  onSuccess,
  onCancel,
  onError,
  verifyPin,
  quickLogin
}: QuickPinVerificationProps) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePinSubmit = async () => {
    if (pin.length !== 6) {
      setError('Le PIN doit contenir 6 chiffres')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (quickLogin) {
        // Utiliser la connexion rapide si disponible
        await quickLogin(account, pin)
        onSuccess()
      } else {
        // Fallback sur la vérification simple
        const isValid = await verifyPin(account.email, pin)
        
        if (isValid) {
          onSuccess()
        } else {
          setError('PIN incorrect')
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification du PIN'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <button
          onClick={onCancel}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <IconArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        <div className="flex justify-center mb-4">
          {account.profile_image ? (
            <Image
              src={account.profile_image}
              alt={`${account.prenom} ${account.nom}`}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-[#FF671E] rounded-full flex items-center justify-center">
              <IconUser className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {account.prenom} {account.nom}
        </h2>
        <p className="text-gray-600 mb-2">{account.email}</p>
        {account.poste && (
          <p className="text-sm text-gray-500 mb-6">{account.poste}</p>
        )}
        <p className="text-gray-600 mb-6">
          Entrez votre PIN pour vous connecter rapidement
        </p>
      </div>

      <div className="space-y-6">
        <PinInput
          value={pin}
          onChange={setPin}
          onFocus={() => {}}
          onBlur={() => {}}
          placeholder="Code PIN"
          showValue={false}
          onToggleShow={() => {}}
          disabled={loading}
          hasUserInteracted={true}
          label="Code PIN"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <Button
          onClick={handlePinSubmit}
          disabled={pin.length !== 6 || loading}
          className="w-full bg-[#FF671E] hover:bg-[#FF8E53] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Vérification...
            </div>
          ) : (
            'Se connecter'
          )}
        </Button>
      </div>
    </motion.div>
  )
}
