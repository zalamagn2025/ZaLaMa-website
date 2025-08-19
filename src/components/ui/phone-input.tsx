"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  validateAndFormatPhone, 
  formatPhoneWhileTyping, 
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
  const [shouldValidate, setShouldValidate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction de validation optimisée
  const validatePhone = useCallback((phoneValue: string) => {
    // Éviter de valider si la valeur n'a pas changé
    if (phoneValue === lastValidatedValue) {
      return;
    }

    // Éviter de valider si le champ est vide
    if (!phoneValue.trim()) {
      setValidationResult(null);
      setLastValidatedValue('');
      onValidationChange?.(false, '');
      return;
    }

    // Éviter de valider si la valeur est trop courte (moins de 3 caractères)
    const digitsOnly = phoneValue.replace(/[^\d]/g, '');
    if (digitsOnly.length < 3) {
      setValidationResult(null);
      return;
    }

         // Éviter de valider si la valeur est en cours de saisie (pas assez de chiffres)
     if (digitsOnly.length < 9) {
       setValidationResult(null);
       return;
     }

    setIsValidating(true);
    setShouldValidate(true);
    
    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Délai pour éviter trop de validations pendant la saisie
    timeoutRef.current = setTimeout(() => {
      const result = validateAndFormatPhone(phoneValue);
      setValidationResult(result);
      setLastValidatedValue(phoneValue);
      onValidationChange?.(result.isValid, result.formattedNumber);
      setIsValidating(false);
      setShouldValidate(false);
    }, 800); // Augmenté à 800ms pour réduire les clignotements
  }, [lastValidatedValue, onValidationChange]);

  // Validation en temps réel optimisée
  useEffect(() => {
    // Ne valider que si la valeur a suffisamment de caractères (9 chiffres)
    const digitsOnly = value.replace(/[^\d]/g, '');
    if (digitsOnly.length >= 9) {
      validatePhone(value);
    } else {
      // Réinitialiser la validation si la valeur est trop courte
      setValidationResult(null);
      setShouldValidate(false);
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, validatePhone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Formater pendant la saisie
    const formattedValue = formatPhoneWhileTyping(inputValue);
    onChange(formattedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Valider immédiatement lors du blur si la valeur a changé
    if (value.trim() && value !== lastValidatedValue) {
      // Nettoyer le timeout en cours
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      validatePhone(value);
    }
  };

  const getInputClassName = () => {
    let baseClass = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
    
    if (validationResult?.isValid) {
      baseClass += " border-green-500 focus-visible:border-green-500";
    } else if (validationResult && !validationResult.isValid) {
      baseClass += " border-red-500 focus-visible:border-red-500";
    } else if (isFocused) {
      baseClass += " border-blue-500 focus-visible:border-blue-500";
    }
    
    return `${baseClass} ${className}`;
  };

  const getValidationIcon = () => {
    // Ne montrer le spinner que si on valide vraiment et que la valeur a changé
    if (isValidating && shouldValidate && value.trim() && value !== lastValidatedValue) {
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
    
    return <Phone className="w-4 h-4 text-gray-400" />;
  };

  const getValidationMessage = () => {
    // Ne montrer "Validation en cours..." que si on valide vraiment
    if (isValidating && shouldValidate && value.trim() && value !== lastValidatedValue) {
      return "Validation en cours...";
    }
    
    if (validationResult?.isValid) {
      return "Numéro valide";
    }
    
    if (validationResult?.errorMessage) {
      return validationResult.errorMessage;
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
          autoComplete="tel"
        />
        
        {showValidation && validationResult && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute -bottom-6 left-0 text-xs ${
                validationResult.isValid ? 'text-green-600' : 'text-red-600'
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
      
      {/* Aide contextuelle */}
      {isFocused && !validationResult?.isValid && value.trim() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded border"
        >
          <p className="font-medium mb-1">Format attendu :</p>
                     <ul className="space-y-1 text-xs">
             <li>• +224 612 34 56 78</li>
             <li>• 224 612 34 56 78</li>
             <li>• 612 34 56 78</li>
             <li>• +224612345678</li>
           </ul>
                     <p className="mt-1 text-xs">
             Le numéro doit commencer par 6 (opérateur guinéen)
           </p>
        </motion.div>
      )}
    </div>
  );
}

export default PhoneInput;
