"use client";

import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, ArrowLeft, User } from 'lucide-react';
import { AccountSession } from "@/types/account-session";
import Image from 'next/image';

interface AccountSelectorCardProps {
  accounts: AccountSession[];
  lastUsedAccount: AccountSession | null;
  loading: boolean;
  onAccountSelect: (account: AccountSession) => void;
  onNewAccount: () => void;
  onRemoveAccount: (accountId: string) => void;
  onBack?: () => void;
}

export default function AccountSelectorCard({
  accounts,
  lastUsedAccount,
  loading,
  onAccountSelect,
  onNewAccount,
  onRemoveAccount,
  onBack
}: AccountSelectorCardProps) {
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);

  const handleRemoveAccount = async (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // console.log('🗑️ Tentative de suppression du compte:', accountId);
    setRemovingAccount(accountId);
    try {
      // console.log('🔄 Appel de onRemoveAccount...');
      await onRemoveAccount(accountId);
      // console.log('✅ Suppression réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
    } finally {
      setRemovingAccount(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 text-white/60">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <span className="text-sm">Chargement des comptes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compte utilisé récemment */}
      {lastUsedAccount && (
        <div className="space-y-2">
          <p className="text-sm text-white/60 font-medium">Dernière connexion</p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <button
              onClick={() => onAccountSelect(lastUsedAccount)}
              className="w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF671E] to-[#FF8A4C] flex items-center justify-center overflow-hidden">
                  {lastUsedAccount.profile_image ? (
                    <Image
                      src={lastUsedAccount.profile_image}
                      alt={`${lastUsedAccount.prenom} ${lastUsedAccount.nom}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {lastUsedAccount.prenom} {lastUsedAccount.nom}
                  </p>
                  <p className="text-white/60 text-sm truncate">
                    {lastUsedAccount.email}
                  </p>
                  {lastUsedAccount.poste && (
                    <p className="text-white/40 text-xs truncate">
                      {lastUsedAccount.poste} • {lastUsedAccount.entreprise}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/60">Rapide</span>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      )}

      {/* Autres comptes */}
      {accounts.filter(acc => acc.id !== lastUsedAccount?.id).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-white/60 font-medium">Autres comptes</p>
          <div className="space-y-2">
            <AnimatePresence>
              {accounts
                .filter(acc => acc.id !== lastUsedAccount?.id)
                .map((account, index) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => onAccountSelect(account)}
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center overflow-hidden">
                          {account.profile_image ? (
                            <Image
                              src={account.profile_image}
                              alt={`${account.prenom} ${account.nom}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-white/60" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 font-medium text-sm truncate">
                            {account.prenom} {account.nom}
                          </p>
                          <p className="text-white/50 text-xs truncate">
                            {account.email}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleRemoveAccount(account.id, e)}
                          disabled={removingAccount === account.id}
                          className="p-1 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors duration-200"
                        >
                          {removingAccount === account.id ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-red-400 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </button>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Bouton nouveau compte */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => {
          // console.log('🆕 Bouton "Nouveau compte" cliqué !');
          onNewAccount();
        }}
        className="w-full p-4 rounded-lg bg-gradient-to-r from-[#FF671E]/20 to-[#FF8A4C]/20 border border-[#FF671E]/30 hover:from-[#FF671E]/30 hover:to-[#FF8A4C]/30 hover:border-[#FF671E]/50 transition-all duration-300"
      >
        <div className="flex items-center justify-center space-x-3">
          <Plus className="w-5 h-5 text-[#FF671E]" />
          <span className="text-[#FF671E] font-medium">Nouveau compte</span>
        </div>
      </motion.button>

      {/* Bouton retour si disponible */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onBack}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-center space-x-2">
            <ArrowLeft className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">Retour</span>
          </div>
        </motion.button>
      )}
    </div>
  );
}
