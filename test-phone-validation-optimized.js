/**
 * Test des optimisations anti-clignotement pour la validation des numéros de téléphone
 */

// Simulation des fonctions de validation optimisées
function cleanPhoneNumber(phone) {
  return phone.replace(/[\s\-\(\)\.\+\/]/g, '');
}

function formatPhoneWhileTyping(phone) {
  // Si la valeur est vide, la retourner telle quelle
  if (!phone || phone.trim() === '') {
    return phone;
  }

  const cleanPhone = cleanPhoneNumber(phone);
  
  // Si le numéro est déjà dans un format acceptable, le retourner tel quel
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
  
  return phone;
}

function shouldValidate(phoneValue) {
  const digitsOnly = phoneValue.replace(/[^\d]/g, '');
  return digitsOnly.length >= 9;
}

// Test des optimisations
console.log('🧪 TEST DES OPTIMISATIONS ANTI-CLIGNOTEMENT\n');

// Test 1: Formatage intelligent
console.log('📋 Test 1: Formatage intelligent (évite les changements inutiles)');
const formatTests = [
  '+224 612 34 56 78', // Déjà formaté
  '+224 612 34 56',    // Déjà formaté
  '+224 612 34',       // Déjà formaté
  '+224 612',          // Déjà formaté
  '612345678',         // À formater
  '612 34 56 78',      // À formater
  '',                  // Vide
];

formatTests.forEach(test => {
  const result = formatPhoneWhileTyping(test);
  const changed = result !== test;
  console.log(`${changed ? '🔄' : '✅'} "${test}" => "${result}" ${changed ? '(changé)' : '(inchangé)'}`);
});
console.log('');

// Test 2: Logique de validation conditionnelle
console.log('📋 Test 2: Logique de validation conditionnelle');
const validationTests = [
  '',           // Vide
  '6',          // Trop court
  '61',         // Trop court
  '612',        // Trop court
  '6123',       // Trop court
  '61234',      // Trop court
  '612345',     // Trop court
  '6123456',    // Trop court
  '61234567',   // Trop court
  '612345678',  // Valide
  '6123456789', // Trop long
  '+224612345678', // Valide
];

validationTests.forEach(test => {
  const should = shouldValidate(test);
  const digitsOnly = test.replace(/[^\d]/g, '');
  console.log(`${should ? '✅' : '⏸️'} "${test}" (${digitsOnly.length} chiffres) => ${should ? 'Valider' : 'Ne pas valider'}`);
});
console.log('');

// Test 3: Simulation de saisie utilisateur
console.log('📋 Test 3: Simulation de saisie utilisateur (anti-clignotement)');
const userTyping = [
  '6',
  '61',
  '612',
  '6123',
  '61234',
  '612345',
  '6123456',
  '61234567',
  '612345678',
  '6123456789'
];

let validationCount = 0;
let lastValidatedValue = '';

userTyping.forEach((input, index) => {
  const formatted = formatPhoneWhileTyping(input);
  const shouldValidateNow = shouldValidate(formatted);
  const valueChanged = formatted !== lastValidatedValue;
  
  if (shouldValidateNow && valueChanged) {
    validationCount++;
    lastValidatedValue = formatted;
  }
  
  console.log(`Étape ${index + 1}: "${input}" => "${formatted}" ${shouldValidateNow ? '✅' : '⏸️'} ${valueChanged ? '🔄' : '✅'} (Validations: ${validationCount})`);
});

console.log(`\n🎯 Total des validations déclenchées: ${validationCount} (au lieu de ${userTyping.length} sans optimisation)`);
console.log(`📉 Réduction: ${Math.round((1 - validationCount / userTyping.length) * 100)}%`);

// Test 4: Performance
console.log('\n📋 Test 4: Test de performance');
const performanceTests = [
  '+224 612 34 56 78', // Formaté
  '+224 612 34 56 78', // Même valeur (ne devrait pas valider)
  '+224 612 34 56 78', // Même valeur (ne devrait pas valider)
  '612345678',         // Nouvelle valeur
  '612345678',         // Même valeur (ne devrait pas valider)
  '712345678',         // Nouvelle valeur (invalide)
];

let perfValidationCount = 0;
let perfLastValue = '';

performanceTests.forEach((test, index) => {
  const shouldValidateNow = shouldValidate(test);
  const valueChanged = test !== perfLastValue;
  
  if (shouldValidateNow && valueChanged) {
    perfValidationCount++;
    perfLastValue = test;
  }
  
  console.log(`Test ${index + 1}: "${test}" ${shouldValidateNow && valueChanged ? '✅ Valider' : '⏸️ Ignorer'} (Validations: ${perfValidationCount})`);
});

console.log(`\n🎯 Validations effectives: ${perfValidationCount}/${performanceTests.length} (${Math.round((1 - perfValidationCount / performanceTests.length) * 100)}% d'économies)`);

// Test 5: Validation des opérateurs
console.log('\n📋 Test 5: Validation des opérateurs guinéens');
const operatorTests = [
  '612345678',  // ✅ Valide (commence par 6)
  '712345678',  // ❌ Invalide (commence par 7)
  '812345678',  // ❌ Invalide (commence par 8)
  '912345678',  // ❌ Invalide (commence par 9)
  '123456789',  // ❌ Invalide (commence par 1)
];

operatorTests.forEach(test => {
  const startsWith6 = /^6/.test(test.replace(/[^\d]/g, ''));
  console.log(`${startsWith6 ? '✅' : '❌'} "${test}" => ${startsWith6 ? 'Valide (commence par 6)' : 'Invalide (ne commence pas par 6)'}`);
});

console.log('\n🎉 Tests des optimisations terminés !');
console.log('\n📊 Résumé des optimisations :');
console.log('• Debouncing de 800ms au lieu de 300ms');
console.log('• Validation seulement après 9 chiffres');
console.log('• Évitement des validations redondantes');
console.log('• Formatage intelligent sans changements inutiles');
console.log('• Validation immédiate au blur');
console.log('• Réduction significative des clignotements');
console.log('• Validation stricte : uniquement les numéros commençant par 6');
