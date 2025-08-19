/**
 * Test de validation des numéros de téléphone guinéens
 */

// Import des fonctions de validation (simulation pour le test)
const { 
  validateAndFormatPhone, 
  formatPhoneWhileTyping, 
  normalizePhoneNumber,
  cleanPhoneNumber,
  VALID_PHONE_EXAMPLES,
  INVALID_PHONE_EXAMPLES
} = require('./src/utils/phoneValidation.ts');

// Fonctions de test (simulation)
function cleanPhoneNumber(phone) {
  return phone.replace(/[\s\-\(\)\.\+\/]/g, '');
}

function normalizePhoneNumber(phone) {
  let cleanPhone = cleanPhoneNumber(phone);
  
  // Supprimer les préfixes existants
  if (cleanPhone.startsWith('00224')) {
    cleanPhone = cleanPhone.substring(5);
  } else if (cleanPhone.startsWith('224')) {
    cleanPhone = cleanPhone.substring(3);
  } else if (cleanPhone.startsWith('+224')) {
    cleanPhone = cleanPhone.substring(4);
  }
  
  // Vérifier que le numéro commence par 6 ou 7 (opérateurs guinéens)
  if (!/^[6-7]/.test(cleanPhone)) {
    throw new Error('Le numéro doit commencer par 6 ou 7');
  }
  
  // Vérifier la longueur (8 chiffres après le préfixe)
  if (cleanPhone.length !== 8) {
    throw new Error('Le numéro doit contenir 8 chiffres après le préfixe');
  }
  
  // Vérifier que ce sont bien des chiffres
  if (!/^\d{8}$/.test(cleanPhone)) {
    throw new Error('Le numéro ne doit contenir que des chiffres');
  }
  
  return `+224${cleanPhone}`;
}

function validateAndFormatPhone(phone) {
  const originalInput = phone;
  
  try {
    // Vérifier si le champ est vide
    if (!phone || phone.trim().length === 0) {
      return {
        isValid: false,
        formattedNumber: '',
        errorMessage: 'Le numéro de téléphone est obligatoire',
        originalInput
      };
    }
    
    // Vérifier la longueur minimale
    const cleanPhone = cleanPhoneNumber(phone);
    if (cleanPhone.length < 8) {
      return {
        isValid: false,
        formattedNumber: '',
        errorMessage: 'Le numéro de téléphone est trop court',
        originalInput
      };
    }
    
    // Vérifier la longueur maximale
    if (cleanPhone.length > 15) {
      return {
        isValid: false,
        formattedNumber: '',
        errorMessage: 'Le numéro de téléphone est trop long',
        originalInput
      };
    }
    
    // Normaliser le numéro
    const formattedNumber = normalizePhoneNumber(phone);
    
    return {
      isValid: true,
      formattedNumber,
      originalInput
    };
    
  } catch (error) {
    return {
      isValid: false,
      formattedNumber: '',
      errorMessage: error instanceof Error ? error.message : 'Format de numéro invalide',
      originalInput
    };
  }
}

function formatPhoneWhileTyping(phone) {
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
    } else {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5, 7)} ${numberPart.substring(7)}`;
    }
  }
  
  // Si le numéro commence par 224, ajouter le +
  if (cleanPhone.startsWith('224')) {
    const numberPart = cleanPhone.substring(3);
    if (numberPart.length <= 3) {
      return `+224 ${numberPart}`;
    } else if (numberPart.length <= 5) {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3)}`;
    } else if (numberPart.length <= 7) {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5)}`;
    } else {
      return `+224 ${numberPart.substring(0, 3)} ${numberPart.substring(3, 5)} ${numberPart.substring(5, 7)} ${numberPart.substring(7)}`;
    }
  }
  
  // Si le numéro commence par 6 ou 7, ajouter +224
  if (/^[6-7]/.test(cleanPhone)) {
    if (cleanPhone.length <= 3) {
      return `+224 ${cleanPhone}`;
    } else if (cleanPhone.length <= 5) {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3)}`;
    } else if (cleanPhone.length <= 7) {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5)}`;
    } else if (cleanPhone.length <= 8) {
      return `+224 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5, 7)} ${cleanPhone.substring(7)}`;
    }
  }
  
  return phone;
}

// Exemples de test
const VALID_PHONE_EXAMPLES = [
  '+22461234567',
  '+22471234567',
  '22461234567',
  '22471234567',
  '0022461234567',
  '0022471234567',
  '61234567',
  '71234567',
  '+224 612 34 56 78',
  '224 612 34 56 78',
  '612 34 56 78',
  '+224-612-34-56-78',
  '224-612-34-56-78',
  '612-34-56-78'
];

const INVALID_PHONE_EXAMPLES = [
  '12345678', // Ne commence pas par 6 ou 7
  '6123456',  // Trop court
  '6123456789', // Trop long
  'abc123456', // Contient des lettres
  '6123456a',  // Contient des lettres
  '51234567',  // Commence par 5
  '81234567',  // Commence par 8
  '91234567'   // Commence par 9
];

// Tests
console.log('🧪 TESTS DE VALIDATION DES NUMÉROS DE TÉLÉPHONE GUINÉENS\n');

// Test 1: Nettoyage des numéros
console.log('📋 Test 1: Nettoyage des numéros');
console.log('cleanPhoneNumber("+224 612 34 56 78") =>', cleanPhoneNumber("+224 612 34 56 78"));
console.log('cleanPhoneNumber("224-612-34-56-78") =>', cleanPhoneNumber("224-612-34-56-78"));
console.log('cleanPhoneNumber("612 34 56 78") =>', cleanPhoneNumber("612 34 56 78"));
console.log('');

// Test 2: Normalisation des numéros
console.log('📋 Test 2: Normalisation des numéros');
VALID_PHONE_EXAMPLES.slice(0, 5).forEach(phone => {
  try {
    const normalized = normalizePhoneNumber(phone);
    console.log(`✅ "${phone}" => "${normalized}"`);
  } catch (error) {
    console.log(`❌ "${phone}" => Erreur: ${error.message}`);
  }
});
console.log('');

// Test 3: Formatage pendant la saisie
console.log('📋 Test 3: Formatage pendant la saisie');
const typingExamples = [
  '612',
  '6123',
  '61234',
  '612345',
  '6123456',
  '61234567',
  '+224612',
  '+2246123',
  '+22461234',
  '+224612345',
  '+2246123456',
  '+22461234567'
];

typingExamples.forEach(phone => {
  const formatted = formatPhoneWhileTyping(phone);
  console.log(`"${phone}" => "${formatted}"`);
});
console.log('');

// Test 4: Validation complète
console.log('📋 Test 4: Validation complète - Numéros valides');
VALID_PHONE_EXAMPLES.forEach(phone => {
  const result = validateAndFormatPhone(phone);
  if (result.isValid) {
    console.log(`✅ "${phone}" => "${result.formattedNumber}"`);
  } else {
    console.log(`❌ "${phone}" => ${result.errorMessage}`);
  }
});
console.log('');

console.log('📋 Test 4: Validation complète - Numéros invalides');
INVALID_PHONE_EXAMPLES.forEach(phone => {
  const result = validateAndFormatPhone(phone);
  if (result.isValid) {
    console.log(`✅ "${phone}" => "${result.formattedNumber}" (inattendu!)`);
  } else {
    console.log(`❌ "${phone}" => ${result.errorMessage}`);
  }
});
console.log('');

// Test 5: Cas particuliers
console.log('📋 Test 5: Cas particuliers');
const specialCases = [
  '', // Vide
  '   ', // Espaces
  'abc', // Lettres seulement
  '123', // Chiffres seulement
  '+224', // Préfixe seulement
  '6123456789012345', // Trop long
  '6123456', // Trop court
  '6123456a', // Avec lettre
  '6123456.', // Avec point
  '6123456-', // Avec tiret
  '6123456 ', // Avec espace à la fin
  ' 61234567', // Avec espace au début
];

specialCases.forEach(phone => {
  const result = validateAndFormatPhone(phone);
  if (result.isValid) {
    console.log(`✅ "${phone}" => "${result.formattedNumber}"`);
  } else {
    console.log(`❌ "${phone}" => ${result.errorMessage}`);
  }
});
console.log('');

console.log('🎉 Tests terminés !');
