/**
 * Test de performance pour la validation des numéros de téléphone
 * Compare la version originale vs la version optimisée
 */

// Simulation des fonctions originales (lentes)
function originalCleanPhoneNumber(phone) {
  return phone.replace(/[\s\-\(\)\.\+\/]/g, '');
}

function originalFormatPhoneWhileTyping(phone) {
  if (!phone || phone.trim() === '') {
    return phone;
  }

  const cleanPhone = originalCleanPhoneNumber(phone);
  
  // Regex coûteuses (version originale)
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
  
  // Regex multiples coûteuses (version originale)
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

// Simulation des fonctions optimisées (rapides)
function optimizedCleanPhoneNumber(phone) {
  let result = '';
  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (char >= '0' && char <= '9') {
      result += char;
    }
  }
  return result;
}

function optimizedFormatPhoneWhileTyping(phone) {
  if (!phone || phone.trim() === '') {
    return phone;
  }

  const cleanPhone = optimizedCleanPhoneNumber(phone);
  
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

// Fonction de test de performance
function runPerformanceTest(testNumbers, iterations = 1000) {
  console.log(`\n🧪 Test de performance avec ${iterations} itérations...`);
  
  // Test version originale
  const originalStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testNumbers.forEach(phone => {
      originalFormatPhoneWhileTyping(phone);
    });
  }
  const originalEnd = performance.now();
  const originalTime = originalEnd - originalStart;
  
  // Test version optimisée
  const optimizedStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testNumbers.forEach(phone => {
      optimizedFormatPhoneWhileTyping(phone);
    });
  }
  const optimizedEnd = performance.now();
  const optimizedTime = optimizedEnd - optimizedStart;
  
  // Calculs
  const improvement = ((originalTime - optimizedTime) / originalTime) * 100;
  const speedup = originalTime / optimizedTime;
  
  return {
    original: originalTime,
    optimized: optimizedTime,
    improvement,
    speedup
  };
}

// Nombres de test
const testNumbers = [
  '612345678',
  '+224612345678',
  '224612345678',
  '00224612345678',
  '612 34 56 78',
  '+224 612 34 56 78',
  '+224 612 34 56',
  '+224 612 34',
  '+224 612',
  '61234567',
  '712345678',
  '6123456789',
  'abc123def'
];

// Tests avec différentes tailles
const testSizes = [100, 500, 1000, 5000];

console.log('🚀 Test de Performance - Validation des Numéros de Téléphone');
console.log('=' .repeat(60));

testSizes.forEach(size => {
  const results = runPerformanceTest(testNumbers, size);
  
  console.log(`\n📊 Résultats pour ${size} itérations:`);
  console.log(`   Version originale: ${results.original.toFixed(2)}ms`);
  console.log(`   Version optimisée: ${results.optimized.toFixed(2)}ms`);
  console.log(`   Amélioration: ${results.improvement.toFixed(1)}%`);
  console.log(`   Accélération: ${results.speedup.toFixed(1)}x plus rapide`);
});

// Test de validation en temps réel
console.log('\n🎯 Test de validation en temps réel:');
console.log('=' .repeat(40));

const realTimeNumbers = [
  '6',
  '61',
  '612',
  '6123',
  '61234',
  '612345',
  '6123456',
  '61234567',
  '612345678',
  '+224 612 34 56 78'
];

console.log('\nValidation progressive:');
realTimeNumbers.forEach(phone => {
  const start = performance.now();
  const result = optimizedFormatPhoneWhileTyping(phone);
  const end = performance.now();
  const time = end - start;
  
  console.log(`   "${phone}" → "${result}" (${time.toFixed(3)}ms)`);
});

console.log('\n✨ Test terminé !');
console.log('💡 La version optimisée devrait être significativement plus rapide.');
