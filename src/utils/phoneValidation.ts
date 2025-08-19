/**
 * Utilitaires pour la validation et le formatage des numéros de téléphone guinéens
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formattedNumber: string;
  errorMessage?: string;
  originalInput: string;
}

/**
 * Nettoie un numéro de téléphone en supprimant tous les caractères non numériques
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)\.\+\/]/g, '');
}

/**
 * Vérifie si un numéro commence par un préfixe guinéen valide
 */
export function hasValidGuineaPrefix(phone: string): boolean {
  const cleanPhone = cleanPhoneNumber(phone);
  return cleanPhone.startsWith('224') || cleanPhone.startsWith('+224') || cleanPhone.startsWith('00224');
}

/**
 * Normalise un numéro de téléphone au format international +224XXXXXXXXX
 */
export function normalizePhoneNumber(phone: string): string {
  let cleanPhone = cleanPhoneNumber(phone);
  
  // Supprimer les préfixes existants
  if (cleanPhone.startsWith('00224')) {
    cleanPhone = cleanPhone.substring(5);
  } else if (cleanPhone.startsWith('224')) {
    cleanPhone = cleanPhone.substring(3);
  } else if (cleanPhone.startsWith('+224')) {
    cleanPhone = cleanPhone.substring(4);
  }
  
  // Vérifier que le numéro commence par 6 (opérateur guinéen)
  if (!/^6/.test(cleanPhone)) {
    throw new Error('Le numéro doit commencer par 6 (opérateur guinéen)');
  }
  
  // Vérifier la longueur (9 chiffres pour les mobiles guinéens)
  if (cleanPhone.length !== 9) {
    throw new Error('Le numéro doit contenir 9 chiffres après le préfixe');
  }
  
  return `+224${cleanPhone}`;
}

/**
 * Valide et formate un numéro de téléphone guinéen
 */
export function validateAndFormatPhone(phone: string): PhoneValidationResult {
  try {
    if (!phone || phone.trim() === '') {
      return {
        isValid: false,
        formattedNumber: '',
        errorMessage: 'Le numéro de téléphone est requis',
        originalInput: phone
      };
    }

    const normalizedNumber = normalizePhoneNumber(phone);
    
    return {
      isValid: true,
      formattedNumber: normalizedNumber,
      originalInput: phone
    };
  } catch (error) {
    return {
      isValid: false,
      formattedNumber: '',
      errorMessage: error instanceof Error ? error.message : 'Format de numéro invalide',
      originalInput: phone
    };
  }
}

/**
 * Formate un numéro de téléphone pour l'affichage (ex: +224 612 34 56 78)
 */
export function formatPhoneForDisplay(phone: string): string {
  try {
    const normalized = normalizePhoneNumber(phone);
    const numberPart = normalized.substring(4); // Enlever +224
    
    // Formater: +224 612 34 56 78
    return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5, 7)} ${numberPart.substring(7)}`;
  } catch {
    return phone; // Retourner l'original si erreur
  }
}

/**
 * Formate un numéro de téléphone pendant la saisie
 * Optimisé pour éviter les changements de valeur inutiles
 */
export function formatPhoneWhileTyping(phone: string): string {
  // Si la valeur est vide, la retourner telle quelle
  if (!phone || phone.trim() === '') {
    return phone;
  }

  const cleanPhone = cleanPhoneNumber(phone);
  
  // Si le numéro commence par +224, le garder tel quel
  if (phone.startsWith('+224')) {
    const numberPart = cleanPhone.substring(3);
    if (numberPart.length <= 3) {
      return `+224 ${numberPart}`;
    } else if (numberPart.length <= 5) {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3)}`;
    } else if (numberPart.length <= 7) {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5)}`;
    } else if (numberPart.length <= 9) {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5, 7)} ${numberPart.substring(7)}`;
    } else {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5, 7)} ${numberPart.substring(7, 9)}`;
    }
  }
  
  // Si le numéro commence par 6, ajouter +224
  if (/^6/.test(cleanPhone)) {
    if (cleanPhone.length <= 3) {
      return `+224 ${cleanPhone}`;
    } else if (cleanPhone.length <= 5) {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3)}`;
    } else if (cleanPhone.length <= 7) {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5)}`;
    } else if (cleanPhone.length <= 9) {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5, 7)} ${cleanPhone.substring(7)}`;
    } else {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5, 7)} ${cleanPhone.substring(7, 9)}`;
    }
  }
  
  // Si le numéro est déjà dans un format acceptable, le retourner tel quel
  // pour éviter les changements inutiles
  if (phone.match(/^\+224\s\d{3}\s\d{2}\s\d{2}\s\d{2}$/)) {
    return phone;
  }
  
  if (phone.match(/^\+224\s\d{3}\s\d{2}\s\d{2}$/)) {
    return phone;
  }
  
  if (phone.match(/^\+224\s\d{3}\s\d{2}$/)) {
    return phone;
  }
  
  if (phone.match(/^\+224\s\d{3}$/)) {
    return phone;
  }
  
  return phone;
}

/**
 * Vérifie si un numéro de téléphone est valide sans le formater
 */
export function isPhoneValid(phone: string): boolean {
  try {
    normalizePhoneNumber(phone);
    return true;
  } catch {
    return false;
  }
}

/**
 * Exemples de numéros valides pour les tests
 */
export const VALID_PHONE_EXAMPLES = [
  '+224612345678',  // Format international complet
  '+224 612 34 56 78', // Format international avec espaces
  '224612345678',   // Format sans +
  '224 612 34 56 78', // Format sans + avec espaces
  '612345678',      // Format local
  '612 34 56 78',   // Format local avec espaces
  '00224612345678', // Format avec 00
  '612345678',      // Format local
  '612 34 56 78'    // Format local avec espaces
];

/**
 * Exemples de numéros invalides pour les tests
 */
export const INVALID_PHONE_EXAMPLES = [
  '',               // Vide
  '123456789',      // Ne commence pas par 6
  '61234567',       // Trop court (8 chiffres au lieu de 9)
  '6123456789',     // Trop long (10 chiffres)
  '61234567890',    // Trop long (11 chiffres)
  'abc123def',      // Contient des lettres
  '+33123456789',   // Préfixe français
  '+1234567890',    // Préfixe américain
  '712345678',      // Commence par 7 (invalide)
  '812345678',      // Commence par 8 (invalide)
  '912345678'       // Commence par 9 (invalide)
];
