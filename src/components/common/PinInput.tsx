"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeClosed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  showValue: boolean;
  onToggleShow: () => void;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  hasUserInteracted?: boolean;
  hasUserInteractedWithConfirm?: boolean;
  isConfirmField?: boolean;
  label?: string;
}

// Fonction pour formater le PIN (masquer les chiffres)
const formatPin = (value: string, show: boolean) => {
  if (show) return value;
  return value.replace(/\d/g, '•');
};

// Composant Input PIN style OTP
export default function PinInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  showValue,
  onToggleShow,
  className,
  ref,
  disabled = false,
  hasUserInteracted = false,
  hasUserInteractedWithConfirm = false,
  isConfirmField = false,
  label = "Code PIN",
  ...props
}: PinInputProps) {
  const digits = value.split('').concat(Array(6 - value.length).fill(''));

  return (
    <div className="relative">
      {/* Header avec icônes */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-white/40" />
          <span className="text-sm text-white/60 font-medium">{label}</span>
        </div>
        
        {/* Bouton toggle visibility */}
        <div 
          onClick={onToggleShow} 
          className="cursor-pointer p-1 rounded hover:bg-white/10 transition-colors duration-300"
        >
          {showValue ? (
            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
          ) : (
            <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
          )}
        </div>
      </div>
      
      {/* Zone de saisie avec input invisible */}
      <div className="relative">
        {/* Input invisible pour la saisie */}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          className={`absolute inset-0 w-full h-12 opacity-0 z-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          maxLength={6}
          {...props}
        />
        
        {/* Affichage OTP */}
        <div className="flex gap-3 justify-center">
          {digits.map((digit, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-mono transition-all duration-300 relative",
                disabled 
                  ? "border-white/10 bg-white/5 text-white/20 cursor-not-allowed"
                  : digit 
                    ? "border-[#FF671E] bg-[#FF671E]/10 text-white" 
                    : "border-white/20 bg-white/5 text-white/30",
                !disabled && index === value.length && "border-[#FF671E] bg-[#FF671E]/5 shadow-lg shadow-[#FF671E]/20"
              )}
              animate={{
                scale: !disabled && (isConfirmField ? hasUserInteractedWithConfirm : hasUserInteracted) && index === value.length ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: !disabled && (isConfirmField ? hasUserInteractedWithConfirm : hasUserInteracted) && index === value.length ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {digit ? (showValue ? digit : '•') : ''}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

