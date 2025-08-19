/**
 * Système de validation professionnel pour tous les champs de saisie
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  formattedValue?: string;
}

export interface FieldValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
  format?: (value: string) => string;
}

/**
 * Validation des noms (nom, prénom)
 */
export function validateName(value: string, fieldName: string = "Nom"): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: `${fieldName} est requis`
    };
  }

  const trimmedValue = value.trim();
  
  if (trimmedValue.length < 2) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit contenir au moins 2 caractères`
    };
  }

  if (trimmedValue.length > 50) {
    return {
      isValid: false,
      errorMessage: `${fieldName} ne peut pas dépasser 50 caractères`
    };
  }

  // Vérifier qu'il ne contient que des lettres, espaces, tirets et apostrophes
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(trimmedValue)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} ne peut contenir que des lettres, espaces, tirets et apostrophes`
    };
  }

  // Capitaliser la première lettre de chaque mot
  const formattedValue = trimmedValue
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    isValid: true,
    formattedValue
  };
}

/**
 * Validation des emails
 */
export function validateEmail(value: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "L'adresse email est requise"
    };
  }

  const trimmedValue = value.trim().toLowerCase();
  
  // Regex plus stricte pour les emails
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(trimmedValue)) {
    return {
      isValid: false,
      errorMessage: "Format d'adresse email invalide"
    };
  }

  if (trimmedValue.length > 254) {
    return {
      isValid: false,
      errorMessage: "L'adresse email est trop longue"
    };
  }

  return {
    isValid: true,
    formattedValue: trimmedValue
  };
}

/**
 * Validation des adresses
 */
export function validateAddress(value: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "L'adresse est requise"
    };
  }

  const trimmedValue = value.trim();
  
  if (trimmedValue.length < 10) {
    return {
      isValid: false,
      errorMessage: "L'adresse doit contenir au moins 10 caractères"
    };
  }

  if (trimmedValue.length > 200) {
    return {
      isValid: false,
      errorMessage: "L'adresse ne peut pas dépasser 200 caractères"
    };
  }

  // Capitaliser la première lettre
  const formattedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

  return {
    isValid: true,
    formattedValue
  };
}

/**
 * Validation des postes
 */
export function validateJobTitle(value: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "Le poste est requis"
    };
  }

  const trimmedValue = value.trim();
  
  if (trimmedValue.length < 3) {
    return {
      isValid: false,
      errorMessage: "Le poste doit contenir au moins 3 caractères"
    };
  }

  if (trimmedValue.length > 100) {
    return {
      isValid: false,
      errorMessage: "Le poste ne peut pas dépasser 100 caractères"
    };
  }

  // Capitaliser la première lettre
  const formattedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

  return {
    isValid: true,
    formattedValue
  };
}

/**
 * Validation des matricules
 */
export function validateEmployeeId(value: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "Le matricule est requis"
    };
  }

  const trimmedValue = value.trim().toUpperCase();
  
  if (trimmedValue.length < 3) {
    return {
      isValid: false,
      errorMessage: "Le matricule doit contenir au moins 3 caractères"
    };
  }

  if (trimmedValue.length > 20) {
    return {
      isValid: false,
      errorMessage: "Le matricule ne peut pas dépasser 20 caractères"
    };
  }

  // Vérifier qu'il ne contient que des lettres et chiffres
  if (!/^[A-Z0-9]+$/.test(trimmedValue)) {
    return {
      isValid: false,
      errorMessage: "Le matricule ne peut contenir que des lettres et chiffres"
    };
  }

  return {
    isValid: true,
    formattedValue: trimmedValue
  };
}

/**
 * Validation des salaires
 */
export function validateSalary(value: string | number): ValidationResult {
  if (!value || value === '') {
    return {
      isValid: false,
      errorMessage: "Le salaire est requis"
    };
  }

  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
  
  if (isNaN(numericValue)) {
    return {
      isValid: false,
      errorMessage: "Le salaire doit être un nombre valide"
    };
  }

  if (numericValue < 500000) {
    return {
      isValid: false,
      errorMessage: "Le salaire minimum est de 500 000 GNF"
    };
  }

  if (numericValue > 50000000) {
    return {
      isValid: false,
      errorMessage: "Le salaire maximum est de 50 000 000 GNF"
    };
  }

  // Formater avec des espaces pour les milliers
  const formattedValue = numericValue.toLocaleString('fr-FR');

  return {
    isValid: true,
    formattedValue: formattedValue
  };
}

/**
 * Validation des dates
 */
export function validateDate(value: string, fieldName: string = "Date"): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: `${fieldName} est requise`
    };
  }

  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      errorMessage: `${fieldName} invalide`
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Pour les dates d'embauche, ne pas permettre les dates futures
  if (fieldName.includes("embauche") && date > today) {
    return {
      isValid: false,
      errorMessage: "La date d'embauche ne peut pas être dans le futur"
    };
  }

  // Pour les dates d'expiration, ne pas permettre les dates passées
  if (fieldName.includes("expiration") && date < today) {
    return {
      isValid: false,
      errorMessage: "La date d'expiration ne peut pas être dans le passé"
    };
  }

  return {
    isValid: true,
    formattedValue: value
  };
}

/**
 * Validation des types de contrat
 */
export function validateContractType(value: string): ValidationResult {
  const validTypes = ['CDI', 'CDD', 'STAGE', 'INTERIM'];
  
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "Le type de contrat est requis"
    };
  }

  if (!validTypes.includes(value.toUpperCase())) {
    return {
      isValid: false,
      errorMessage: "Type de contrat invalide"
    };
  }

  return {
    isValid: true,
    formattedValue: value.toUpperCase()
  };
}

/**
 * Validation des genres
 */
export function validateGender(value: string): ValidationResult {
  const validGenders = ['Homme', 'Femme', 'Autre'];
  
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "Le genre est requis"
    };
  }

  if (!validGenders.includes(value)) {
    return {
      isValid: false,
      errorMessage: "Genre invalide"
    };
  }

  return {
    isValid: true,
    formattedValue: value
  };
}

/**
 * Validation des clés API
 */
export function validateApiKey(value: string): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: "La clé API est requise"
    };
  }

  const trimmedValue = value.trim();
  
  if (trimmedValue.length < 10) {
    return {
      isValid: false,
      errorMessage: "La clé API doit contenir au moins 10 caractères"
    };
  }

  if (trimmedValue.length > 100) {
    return {
      isValid: false,
      errorMessage: "La clé API ne peut pas dépasser 100 caractères"
    };
  }

  return {
    isValid: true,
    formattedValue: trimmedValue
  };
}

/**
 * Validation générique avec règles personnalisées
 */
export function validateField(value: any, rules: FieldValidationRule): ValidationResult {
  // Vérification required
  if (rules.required && (!value || value.toString().trim() === '')) {
    return {
      isValid: false,
      errorMessage: rules.message || "Ce champ est requis"
    };
  }

  // Si la valeur est vide et pas required, c'est valide
  if (!value || value.toString().trim() === '') {
    return { isValid: true };
  }

  const stringValue = value.toString().trim();

  // Vérification minLength
  if (rules.minLength && stringValue.length < rules.minLength) {
    return {
      isValid: false,
      errorMessage: rules.message || `Minimum ${rules.minLength} caractères requis`
    };
  }

  // Vérification maxLength
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return {
      isValid: false,
      errorMessage: rules.message || `Maximum ${rules.maxLength} caractères autorisés`
    };
  }

  // Vérification pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return {
      isValid: false,
      errorMessage: rules.message || "Format invalide"
    };
  }

  // Vérification custom
  if (rules.custom && !rules.custom(value)) {
    return {
      isValid: false,
      errorMessage: rules.message || "Valeur invalide"
    };
  }

  // Formatage si spécifié
  const formattedValue = rules.format ? rules.format(stringValue) : stringValue;

  return {
    isValid: true,
    formattedValue
  };
}

/**
 * Validation complète du formulaire d'inscription
 */
export interface EmployeeFormData {
  api_key: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  genre: string;
  poste: string;
  matricule: string;
  type_contrat: string;
  salaire_net: number;
  date_embauche: string;
  date_expiration?: string;
}

export interface FormValidationErrors {
  [key: string]: string;
}

export function validateEmployeeForm(data: EmployeeFormData): {
  isValid: boolean;
  errors: FormValidationErrors;
  formattedData: EmployeeFormData;
} {
  const errors: FormValidationErrors = {};
  const formattedData = { ...data };

  // Validation de chaque champ
  const validations = [
    { field: 'api_key', result: validateApiKey(data.api_key) },
    { field: 'nom', result: validateName(data.nom, 'Nom') },
    { field: 'prenom', result: validateName(data.prenom, 'Prénom') },
    { field: 'email', result: validateEmail(data.email) },
    { field: 'adresse', result: validateAddress(data.adresse) },
    { field: 'genre', result: validateGender(data.genre) },
    { field: 'poste', result: validateJobTitle(data.poste) },
    { field: 'matricule', result: validateEmployeeId(data.matricule) },
    { field: 'type_contrat', result: validateContractType(data.type_contrat) },
    { field: 'salaire_net', result: validateSalary(data.salaire_net) },
    { field: 'date_embauche', result: validateDate(data.date_embauche, 'Date d\'embauche') }
  ];

  // Date d'expiration obligatoire seulement pour CDD
  if (data.type_contrat === 'CDD') {
    validations.push({
      field: 'date_expiration',
      result: validateDate(data.date_expiration || '', 'Date d\'expiration')
    });
  } else {
    // Si ce n'est pas un CDD, réinitialiser la date d'expiration
    formattedData.date_expiration = '' as string;
  }

  // Traitement des résultats
  validations.forEach(({ field, result }) => {
    if (!result.isValid) {
      errors[field] = result.errorMessage || 'Champ invalide';
    } else if (result.formattedValue !== undefined) {
      formattedData[field as keyof EmployeeFormData] = result.formattedValue as any;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedData
  };
}
