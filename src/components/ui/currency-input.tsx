"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, numericValue: number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  showValidation?: boolean;
  min?: number;
  max?: number;
}

export function CurrencyInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "",
  label = "Montant en GNF",
  required = false,
  disabled = false,
  className = "",
  error,
  showValidation = true,
  min = 0,
  max = 999999999999
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour nettoyer la valeur (supprimer tous les points)
  const cleanValue = useCallback((value: string): string => {
    return value.replace(/\./g, '');
  }, []);

  // Fonction pour formater avec des points de milliers
  const formatValue = useCallback((value: string): string => {
    if (!value) return '';
    
    // Nettoyer d'abord
    const cleaned = cleanValue(value);
    
    // Formater avec des points de milliers
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }, [cleanValue]);

  // Fonction pour valider le montant
  const validateAmount = useCallback((amount: string) => {
    const numericValue = parseFloat(cleanValue(amount));
    
    if (!amount.trim()) {
      setIsValid(false);
      setValidationMessage("");
      onValidationChange?.(false, 0);
      return;
    }
    
    if (isNaN(numericValue) || numericValue <= 0) {
      setIsValid(false);
      setValidationMessage("Montant invalide");
      onValidationChange?.(false, 0);
      return;
    }
    
    if (numericValue < min) {
      setIsValid(false);
      setValidationMessage(`Le montant minimum est ${min.toLocaleString('fr-FR')} GNF`);
      onValidationChange?.(false, numericValue);
      return;
    }
    
    if (numericValue > max) {
      setIsValid(false);
      setValidationMessage(`Le montant maximum est ${max.toLocaleString('fr-FR')} GNF`);
      onValidationChange?.(false, numericValue);
      return;
    }
    
    setIsValid(true);
    setValidationMessage("Montant valide");
    onValidationChange?.(true, numericValue);
  }, [cleanValue, min, max, onValidationChange]);

  // Validation en temps réel avec délai
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      validateAmount(value);
    }, 500);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, validateAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permettre seulement les chiffres
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    // Mettre à jour la valeur
    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    validateAmount(value);
  };

  // Afficher toujours la valeur formatée
  const displayValue = formatValue(value);

  const getInputClassName = () => {
    let baseClass = "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
    
    if (isValid && value.trim()) {
      baseClass += " border-green-500 focus-visible:border-green-500";
    } else if (validationMessage && !isValid && value.trim()) {
      baseClass += " border-red-500 focus-visible:border-red-500";
    } else if (isFocused) {
      baseClass += " border-blue-500 focus-visible:border-blue-500";
    }
    
    return `${baseClass} ${className}`;
  };

  const getValidationIcon = () => {
    if (isValid && value.trim()) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (validationMessage && !isValid && value.trim()) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    return <span className="text-xs font-medium text-gray-400">GNF</span>;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getValidationIcon()}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          style={{ paddingLeft: '2.5rem' }}
          autoComplete="off"
        />
        
        {showValidation && validationMessage && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute -bottom-6 left-0 text-xs ${
                isValid ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {validationMessage}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.div>
      )}
    </div>
  );
}

export default CurrencyInput;
