"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  validateAndFormatPhone, 
  formatPhoneWhileTyping, 
  quickPhoneValidation,
  PhoneValidationResult 
} from '@/utils/phoneValidation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, formattedValue: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  showValidation?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "+224 612 34 56 78",
  label = "Numéro de téléphone",
  required = false,
  disabled = false,
  className = "",
  error,
  showValidation = true
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [validationResult, setValidationResult] = useState<PhoneValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidatedValue, setLastValidatedValue] = useState<string>('');
  const [quickValidation, setQuickValidation] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onValidationChangeRef = useRef(onValidationChange);

  // Mettre à jour la référence de onValidationChange
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  // Validation ultra-rapide en temps réel
  const handleQuickValidation = useCallback((phoneValue: string) => {
    if (!phoneValue.trim()) {
      setQuickValidation(null);
      return;
    }

    // Validation instantanée pour l'UX
    const isQuickValid = quickPhoneValidation(phoneValue);
    setQuickValidation(isQuickValid);

    // Si la validation rapide échoue, pas besoin de validation complète
    if (!isQuickValid) {
      setValidationResult(null);
      onValidationChangeRef.current?.(false, phoneValue);
      return;
    }

    // Validation complète seulement si nécessaire
    if (phoneValue !== lastValidatedValue && phoneValue.trim().length >= 12) {
      setIsValidating(true);
      
      // Timeout ultra-court pour la validation complète
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        const result = validateAndFormatPhone(phoneValue);
        setValidationResult(result);
        setLastValidatedValue(phoneValue);
        onValidationChangeRef.current?.(result.isValid, result.formattedNumber);
        setIsValidating(false);
      }, 150); // Réduit à 150ms pour une réponse quasi-instantanée
    }
  }, [lastValidatedValue]);

  // Validation en temps réel ultra-rapide
  useEffect(() => {
    handleQuickValidation(value);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, handleQuickValidation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Formatage instantané pendant la saisie
    const formattedValue = formatPhoneWhileTyping(inputValue);
    onChange(formattedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Validation immédiate au blur si la valeur a changé
    if (value.trim() && value !== lastValidatedValue && quickValidation) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Validation complète immédiate au blur
      const result = validateAndFormatPhone(value);
      setValidationResult(result);
      setLastValidatedValue(value);
      onValidationChangeRef.current?.(result.isValid, result.formattedNumber);
    }
  };

  const getInputClassName = () => {
    let baseClass = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
    
    if (validationResult?.isValid) {
      baseClass += " border-green-500 focus-visible:border-green-500";
    } else if (validationResult && !validationResult.isValid) {
      baseClass += " border-red-500 focus-visible:border-red-500";
    } else if (quickValidation === true) {
      baseClass += " border-blue-400 focus-visible:border-blue-400";
    } else if (quickValidation === false) {
      baseClass += " border-orange-400 focus-visible:border-orange-400";
    } else if (isFocused) {
      baseClass += " border-blue-500 focus-visible:border-blue-500";
    }
    
    return `${baseClass} ${className}`;
  };

  const getValidationIcon = () => {
    // Spinner ultra-rapide
    if (isValidating && value.trim().length >= 12) {
      return (
        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
      );
    }
    
    if (validationResult?.isValid) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (validationResult && !validationResult.isValid) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    // Indicateurs de validation rapide
    if (quickValidation === true) {
      return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
    
    if (quickValidation === false && value.trim().length >= 9) {
      return <AlertCircle className="w-4 h-4 text-orange-400" />;
    }
    
    return <Phone className="w-4 h-4 text-gray-400" />;
  };

  const getValidationMessage = () => {
    if (isValidating && value.trim().length >= 12) {
      return "Validation...";
    }
    
    if (validationResult?.isValid) {
      return "Numéro valide";
    }
    
    if (validationResult?.errorMessage) {
      return validationResult.errorMessage;
    }
    
    // Messages de validation rapide
    if (quickValidation === true) {
      return "Format correct";
    }
    
    if (quickValidation === false && value.trim().length >= 9) {
      return "Vérifiez le format";
    }
    
    return "";
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
          type="tel"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClassName()}
          style={{ paddingLeft: '2.5rem' }}
          suppressHydrationWarning={true}
        />
        
        {showValidation && (validationResult || quickValidation !== null) && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute -bottom-6 left-0 text-xs ${
                validationResult?.isValid || quickValidation === true 
                  ? 'text-green-600' 
                  : validationResult && !validationResult.isValid
                  ? 'text-red-600'
                  : quickValidation === false
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              {getValidationMessage()}
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

export default PhoneInput;
