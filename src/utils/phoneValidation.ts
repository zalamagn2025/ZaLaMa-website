/**
 * Utilitaires pour la validation et le formatage des numéros de téléphone guinéens
 * Version ultra-optimisée pour la performance
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formattedNumber: string;
  errorMessage?: string;
  originalInput: string;
}

// Cache de validation pour éviter les recalculs
const validationCache = new Map<string, PhoneValidationResult>();

/**
 * Nettoie un numéro de téléphone en supprimant tous les caractères non numériques
 * Version ultra-rapide sans regex
 */
export function cleanPhoneNumber(phone: string): string {
  let result = '';
  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (char >= '0' && char <= '9') {
      result += char;
    }
  }
  return result;
}

/**
 * Nettoie un numéro de téléphone en gardant seulement les chiffres du numéro local
 * Version corrigée pour traiter les préfixes +224
 */
export function cleanPhoneNumberLocal(phone: string): string {
  let result = '';
  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (char >= '0' && char <= '9') {
      result += char;
    }
  }
  
  // Si le numéro commence par 224, le supprimer pour garder seulement le numéro local
  if (result.startsWith('224')) {
    result = result.slice(3);
  }
  
  return result;
}

/**
 * Vérifie si un numéro commence par un préfixe guinéen valide
 * Version ultra-rapide
 */
export function hasValidGuineaPrefix(phone: string): boolean {
  const cleanPhone = cleanPhoneNumber(phone);
  return cleanPhone.startsWith('224') || cleanPhone.startsWith('00224');
}

/**
 * Normalise un numéro de téléphone au format international +224XXXXXXXXX
 * Version ultra-rapide avec validation simple
 */
export function normalizePhoneNumber(phone: string): string {
  let cleanPhone = cleanPhoneNumber(phone);
  
  // Supprimer les préfixes existants (plus rapide que substring)
  if (cleanPhone.startsWith('00224')) {
    cleanPhone = cleanPhone.slice(5);
  } else if (cleanPhone.startsWith('224')) {
    cleanPhone = cleanPhone.slice(3);
  }
  
  // Vérifications ultra-rapides
  if (cleanPhone.length !== 9) {
    throw new Error('Le numéro doit contenir 9 chiffres après le préfixe');
  }
  
  // Accepter tous les préfixes valides guinéens
  if (cleanPhone[0] !== '6') {
    throw new Error('Le numéro doit commencer par 6 (opérateur guinéen)');
  }
  
  // Vérifier que le deuxième chiffre est entre 1 et 6 (61, 62, 63, 64, 65, 66)
  const secondDigit = parseInt(cleanPhone[1]);
  if (secondDigit < 1 || secondDigit > 6) {
    throw new Error('Le numéro doit commencer par 61, 62, 63, 64, 65 ou 66 (opérateurs guinéens)');
  }
  
  return `+224${cleanPhone}`;
}

/**
 * Validation ultra-rapide avec cache
 */
export function validateAndFormatPhone(phone: string): PhoneValidationResult {
  // Vérifier le cache d'abord
  if (validationCache.has(phone)) {
    return validationCache.get(phone)!;
  }

  try {
    if (!phone || phone.trim() === '') {
      const result = {
        isValid: false,
        formattedNumber: '',
        errorMessage: 'Le numéro de téléphone est requis',
        originalInput: phone
      };
      validationCache.set(phone, result);
      return result;
    }

    const normalizedNumber = normalizePhoneNumber(phone);
    
    const result = {
      isValid: true,
      formattedNumber: normalizedNumber,
      originalInput: phone
    };
    
    validationCache.set(phone, result);
    return result;
  } catch (error) {
    const result = {
      isValid: false,
      formattedNumber: '',
      errorMessage: error instanceof Error ? error.message : 'Format de numéro invalide',
      originalInput: phone
    };
    validationCache.set(phone, result);
    return result;
  }
}

/**
 * Formate un numéro de téléphone pour l'affichage (ex: +224 612 34 56 78)
 */
export function formatPhoneForDisplay(phone: string): string {
  try {
    const normalized = normalizePhoneNumber(phone);
    const numberPart = normalized.slice(4); // Enlever +224
    
    // Formater: +224 612 34 56 78
    return `+224 ${numberPart.slice(0, 3)} ${numberPart.slice(3, 5)} ${numberPart.slice(5, 7)} ${numberPart.slice(7)}`;
  } catch {
    return phone; // Retourner l'original si erreur
  }
}

/**
 * Formate un numéro de téléphone pendant la saisie
 * Version ultra-rapide sans regex
 */
export function formatPhoneWhileTyping(phone: string): string {
  // Si la valeur est vide, la retourner telle quelle
  if (!phone || phone.trim() === '') {
    return phone;
  }

  const cleanPhone = cleanPhoneNumber(phone);
  
  // Vérifications ultra-rapides sans regex
  if (phone.startsWith('+224')) {
    const numberPart = cleanPhone.slice(3);
    const len = numberPart.length;
    
    if (len <= 3) return `+224 ${numberPart}`;
    if (len <= 5) return `+224 ${numberPart.slice(0, 3)} ${numberPart.slice(3)}`;
    if (len <= 7) return `+224 ${numberPart.slice(0, 3)} ${numberPart.slice(3, 5)} ${numberPart.slice(5)}`;
    if (len <= 9) return `+224 ${numberPart.slice(0, 3)} ${numberPart.slice(3, 5)} ${numberPart.slice(5, 7)} ${numberPart.slice(7)}`;
    return `+224 ${numberPart.slice(0, 3)} ${numberPart.slice(3, 5)} ${numberPart.slice(5, 7)} ${numberPart.slice(7, 9)}`;
  }
  
  // Si le numéro commence par 6, ajouter +224
  if (cleanPhone[0] === '6') {
    const len = cleanPhone.length;
    
    if (len <= 3) return `+224 ${cleanPhone}`;
    if (len <= 5) return `+224 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
    if (len <= 7) return `+224 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5)}`;
    if (len <= 9) return `+224 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 7)} ${cleanPhone.slice(7)}`;
    return `+224 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 7)} ${cleanPhone.slice(7, 9)}`;
  }
  
  // Vérifications ultra-rapides sans regex
  if (phone.startsWith('+224 ')) {
    const parts = phone.split(' ');
    if (parts.length === 5 && parts[1].length === 3 && parts[2].length === 2 && parts[3].length === 2 && parts[4].length === 2) {
      return phone;
    }
    if (parts.length === 4 && parts[1].length === 3 && parts[2].length === 2 && parts[3].length === 2) {
      return phone;
    }
    if (parts.length === 3 && parts[1].length === 3 && parts[2].length === 2) {
      return phone;
    }
    if (parts.length === 2 && parts[1].length === 3) {
      return phone;
    }
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
 * Validation ultra-rapide pour la saisie en temps réel
 * Retourne true si le format semble correct, false sinon
 */
export function quickPhoneValidation(phone: string): boolean {
  if (!phone || phone.trim() === '') return false;
  
  const cleanPhone = cleanPhoneNumberLocal(phone);
  
  // Vérifications ultra-rapides
  if (cleanPhone.length < 9) return false;
  if (cleanPhone.length > 12) return false;
  
  // Accepter tous les préfixes valides guinéens
  // 61, 62, 63, 64, 65, 66 sont des préfixes valides
  if (cleanPhone[0] !== '6') return false;
  
  // Vérifier que le deuxième chiffre est entre 1 et 6 (61, 62, 63, 64, 65, 66)
  const secondDigit = parseInt(cleanPhone[1]);
  if (secondDigit < 1 || secondDigit > 6) return false;
  
  return true;
}

/**
 * Nettoyer le cache de validation (utile pour libérer la mémoire)
 */
export function clearValidationCache(): void {
  validationCache.clear();
}

/**
 * Exemples de numéros valides pour les tests
 */
export const VALID_PHONE_EXAMPLES = [
  '+224612345678',  // Format international complet (Orange)
  '+224 612 34 56 78', // Format international avec espaces (Orange)
  '+224628775473',  // Format international complet (MTN)
  '+224 628 77 54 73', // Format international avec espaces (MTN)
  '+224635123456',  // Format international complet (Cellcom)
  '+224 635 12 34 56', // Format international avec espaces (Cellcom)
  '+224641234567',  // Format international complet (MTN)
  '+224 641 23 45 67', // Format international avec espaces (MTN)
  '+224651234567',  // Format international complet (Orange)
  '+224 651 23 45 67', // Format international avec espaces (Orange)
  '+224663867866',  // Format international complet (Nouvel opérateur)
  '+224 663 86 78 66', // Format international avec espaces (Nouvel opérateur)
  '224612345678',   // Format sans + (Orange)
  '224 612 34 56 78', // Format sans + avec espaces (Orange)
  '224628775473',   // Format sans + (MTN)
  '224 628 77 54 73', // Format sans + avec espaces (MTN)
  '612345678',      // Format local (Orange)
  '612 34 56 78',   // Format local avec espaces (Orange)
  '628775473',      // Format local (MTN)
  '628 77 54 73',   // Format local avec espaces (MTN)
  '663867866',      // Format local (Nouvel opérateur)
  '663 86 78 66',   // Format local avec espaces (Nouvel opérateur)
  '00224612345678', // Format avec 00 (Orange)
  '00224628775473', // Format avec 00 (MTN)
  '00224663867866'  // Format avec 00 (Nouvel opérateur)
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
