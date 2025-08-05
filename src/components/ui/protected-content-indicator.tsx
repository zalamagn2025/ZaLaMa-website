"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { IconShieldLock, IconEye, IconEyeOff } from '@tabler/icons-react';

interface ProtectedContentIndicatorProps {
  isProtected: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
  showToggle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProtectedContentIndicator({
  isProtected,
  isVisible,
  onToggleVisibility,
  showToggle = true,
  size = 'md'
}: ProtectedContentIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSize = sizeClasses[size];

  if (!isProtected) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Indicateur de protection */}
      <div className="flex items-center gap-1">
        <IconShieldLock className={`${iconSize} text-[#FF671E]`} />
        <span className="text-xs text-gray-400 font-medium">Protégé</span>
      </div>

      {/* Bouton de basculement */}
      {showToggle && (
        <motion.button
          onClick={onToggleVisibility}
          className="p-1 rounded-full hover:bg-gray-100/10 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isVisible ? "Masquer le contenu" : "Afficher le contenu"}
        >
          {isVisible ? (
            <IconEye className={`${iconSize} text-gray-300`} />
          ) : (
            <IconEyeOff className={`${iconSize} text-gray-400`} />
          )}
        </motion.button>
      )}
    </motion.div>
  );
} 