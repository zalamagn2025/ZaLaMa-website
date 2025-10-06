'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AccountSession } from '@/types/account-session'
import { IconChevronRight, IconPlus, IconTrash, IconUser } from '@tabler/icons-react'
import Image from 'next/image'

interface AccountSelectorProps {
  onAccountSelect: (account: AccountSession) => void
  onNewAccount: () => void
  onRemoveAccount: (accountId: string) => void
  accounts: AccountSession[]
  lastUsedAccount: AccountSession | null
  loading: boolean
}

export function AccountSelector({
  onAccountSelect,
  onNewAccount,
  onRemoveAccount,
  accounts,
  lastUsedAccount,
  loading
}: AccountSelectorProps) {
  const [showAllAccounts, setShowAllAccounts] = useState(false)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF671E] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des comptes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue sur ZaLaMa
        </h1>
        <p className="text-gray-600">
          Sélectionnez votre compte pour continuer
        </p>
      </div>

      {/* Dernier compte utilisé */}
      {lastUsedAccount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Dernier compte utilisé
          </h3>
          <div
            onClick={() => onAccountSelect(lastUsedAccount)}
            className="flex items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group"
          >
            <div className="flex-shrink-0">
              {lastUsedAccount.profile_image ? (
                <Image
                  src={lastUsedAccount.profile_image}
                  alt={`${lastUsedAccount.prenom} ${lastUsedAccount.nom}`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-[#FF671E] rounded-full flex items-center justify-center">
                  <IconUser className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium text-gray-900">
                {lastUsedAccount.prenom} {lastUsedAccount.nom}
              </p>
              <p className="text-sm text-gray-600">{lastUsedAccount.email}</p>
              {lastUsedAccount.poste && (
                <p className="text-xs text-gray-500">{lastUsedAccount.poste}</p>
              )}
            </div>
            <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF671E] transition-colors" />
          </div>
        </motion.div>
      )}

      {/* Autres comptes */}
      {accounts.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Autres comptes
            </h3>
            <button
              onClick={() => setShowAllAccounts(!showAllAccounts)}
              className="text-sm text-[#FF671E] hover:text-[#FF8E53] transition-colors"
            >
              {showAllAccounts ? 'Masquer' : 'Voir tout'}
            </button>
          </div>

          <AnimatePresence>
            {showAllAccounts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {accounts
                  .filter(account => account.id !== lastUsedAccount?.id)
                  .map((account) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        {account.profile_image ? (
                          <Image
                            src={account.profile_image}
                            alt={`${account.prenom} ${account.nom}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <IconUser className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div
                        className="ml-3 flex-1 cursor-pointer"
                        onClick={() => onAccountSelect(account)}
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {account.prenom} {account.nom}
                        </p>
                        <p className="text-xs text-gray-600">{account.email}</p>
                        {account.poste && (
                          <p className="text-xs text-gray-500">{account.poste}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveAccount(account.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bouton nouveau compte */}
      <Button
        onClick={onNewAccount}
        className="w-full bg-[#FF671E] hover:bg-[#FF8E53] text-white py-3 rounded-xl font-medium transition-colors"
      >
        <IconPlus className="w-5 h-5 mr-2" />
        Se connecter avec un autre compte
      </Button>
    </div>
  )
}
