"use client";

import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Hash, DollarSign, Calendar, Key } from 'lucide-react';
import ValidatedInput from './validated-input';
import PhoneInput from './phone-input';
import { 
  validateName, 
  validateEmail, 
  validateAddress, 
  validateJobTitle, 
  validateEmployeeId, 
  validateSalary, 
  validateDate, 
  validateApiKey 
} from '@/utils/formValidation';

// Composant pour les noms (nom, prénom)
export function NameInput({ 
  value, 
  onChange, 
  label = "Nom", 
  placeholder = "Entrez votre nom",
  required = true,
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  [key: string]: any;
}) {
  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={(val) => validateName(val, label)}
      label={label}
      placeholder={placeholder}
      required={required}
      icon={<User className="w-4 h-4 text-gray-400" />}
      minLength={2}
      maxLength={50}
      {...props}
    />
  );
}

// Composant pour les emails
export function EmailInput({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={validateEmail}
      label="Adresse email"
      placeholder="exemple@entreprise.com"
      type="email"
      required={true}
      icon={<Mail className="w-4 h-4 text-gray-400" />}
      {...props}
    />
  );
}

// Composant pour les adresses
export function AddressInput({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={validateAddress}
      label="Adresse"
      placeholder="123 Rue de la Paix, Conakry"
      required={true}
      icon={<MapPin className="w-4 h-4 text-gray-400" />}
      minLength={10}
      maxLength={200}
      {...props}
    />
  );
}

// Composant pour les postes
export function JobTitleInput({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={validateJobTitle}
      label="Poste"
      placeholder="Développeur Full Stack"
      required={true}
      icon={<Briefcase className="w-4 h-4 text-gray-400" />}
      minLength={3}
      maxLength={100}
      {...props}
    />
  );
}

// Composant pour les matricules
export function EmployeeIdInput({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  const formatEmployeeId = (value: string) => {
    // Convertir en majuscules et supprimer les caractères non alphanumériques
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={validateEmployeeId}
      label="Matricule"
      placeholder="EMP001"
      required={true}
      icon={<Hash className="w-4 h-4 text-gray-400" />}
      formatWhileTyping={formatEmployeeId}
      minLength={3}
      maxLength={20}
      {...props}
    />
  );
}

// Composant pour les salaires
export function SalaryInput({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string | number;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  const formatSalary = (value: string) => {
    // Supprimer tous les caractères non numériques sauf le point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Convertir en nombre et formater
    const number = parseFloat(numericValue);
    if (!isNaN(number)) {
      return number.toLocaleString('fr-FR');
    }
    
    return numericValue;
  };

  return (
    <ValidatedInput
      value={value.toString()}
      onChange={onChange}
      validate={(val) => validateSalary(val)}
      label="Salaire net (GNF)"
      placeholder="1 500 000"
      type="text"
      required={true}
      icon={<DollarSign className="w-4 h-4 text-gray-400" />}
      formatWhileTyping={formatSalary}
      {...props}
    />
  );
}

// Composant pour les dates
export function DateInput({ 
  value, 
  onChange, 
  label = "Date",
  fieldName = "Date",
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fieldName?: string;
  [key: string]: any;
}) {
  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={(val) => validateDate(val, fieldName)}
      label={label}
      type="date"
      required={true}
      icon={<Calendar className="w-4 h-4 text-gray-400" />}
      {...props}
    />
  );
}

// Composant pour la date d'expiration (conditionnel pour CDD)
export function ExpirationDateInput({ 
  value, 
  onChange, 
  isVisible = false,
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  isVisible?: boolean;
  [key: string]: any;
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={(val) => validateDate(val, 'Date d\'expiration')}
      label="Date d'expiration *"
      type="date"
      required={true}
      icon={<Calendar className="w-4 h-4 text-gray-400" />}
      {...props}
    />
  );
}

// Composant pour les clés API
export function ApiKeyInput({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  return (
    <ValidatedInput
      value={value}
      onChange={onChange}
      validate={validateApiKey}
      label="Clé API"
      placeholder="sk-1234567890abcdef..."
      type="password"
      required={true}
      icon={<Key className="w-4 h-4 text-gray-400" />}
      minLength={10}
      maxLength={100}
      {...props}
    />
  );
}

// Composant pour les téléphones (utilise le composant spécialisé)
export function PhoneInputField({ 
  value, 
  onChange, 
  onValidationChange,
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, formattedValue: string) => void;
  [key: string]: any;
}) {
  return (
    <PhoneInput
      value={value}
      onChange={onChange}
      onValidationChange={onValidationChange}
      label="Numéro de téléphone"
      placeholder="+224 612 34 56 78"
      required={true}
      {...props}
    />
  );
}

// Composant pour les sélecteurs
export function SelectInput({ 
  value, 
  onChange, 
  options, 
  label, 
  required = false,
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  required?: boolean;
  [key: string]: any;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        {...props}
      >
        <option value="">Sélectionnez...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Composant pour les genres
export function GenderSelect({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  const genderOptions = [
    { value: 'Homme', label: 'Homme' },
    { value: 'Femme', label: 'Femme' },
    { value: 'Autre', label: 'Autre' }
  ];

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      options={genderOptions}
      label="Genre"
      required={true}
      {...props}
    />
  );
}

// Composant pour les types de contrat
export function ContractTypeSelect({ 
  value, 
  onChange, 
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}) {
  const contractOptions = [
    { value: 'CDI', label: 'CDI (Contrat à Durée Indéterminée)' },
    { value: 'CDD', label: 'CDD (Contrat à Durée Déterminée)' },
    { value: 'STAGE', label: 'Stage' },
    { value: 'INTERIM', label: 'Intérim' }
  ];

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      options={contractOptions}
      label="Type de contrat"
      required={true}
      {...props}
    />
  );
}
