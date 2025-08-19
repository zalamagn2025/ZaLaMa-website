"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';
import PhoneInput from '@/components/ui/phone-input';
import { validateAndFormatPhone, VALID_PHONE_EXAMPLES, INVALID_PHONE_EXAMPLES } from '@/utils/phoneValidation';

export default function PhoneValidationDemo() {
  const [phoneValue, setPhoneValue] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [validationCount, setValidationCount] = useState(0);

  const handlePhoneChange = (value: string) => {
    setPhoneValue(value);
    setValidationCount(prev => prev + 1);
    const result = validateAndFormatPhone(value);
    setValidationResult(result);
  };

  const testExamples = () => {
    console.log('🧪 Test des exemples de numéros valides:');
    VALID_PHONE_EXAMPLES.forEach(phone => {
      const result = validateAndFormatPhone(phone);
      console.log(`${result.isValid ? '✅' : '❌'} "${phone}" => "${result.formattedNumber}"`);
    });

    console.log('\n🧪 Test des exemples de numéros invalides:');
    INVALID_PHONE_EXAMPLES.forEach(phone => {
      const result = validateAndFormatPhone(phone);
      console.log(`${result.isValid ? '✅' : '❌'} "${phone}" => ${result.errorMessage}`);
    });
  };

  const resetValidationCount = () => {
    setValidationCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            📱 Démonstration - Validation des Numéros de Téléphone Guinéens
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Zone de test */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Test en temps réel
                </h2>
                
                <PhoneInput
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="+224 612 34 56 78"
                  label="Numéro de téléphone"
                  required={true}
                  showValidation={true}
                />

                {validationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-lg ${
                      validationResult.isValid 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {validationResult.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-medium ${
                        validationResult.isValid ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {validationResult.isValid ? 'Numéro valide' : 'Numéro invalide'}
                      </span>
                    </div>
                    
                    {validationResult.isValid && (
                      <p className="text-green-300 text-sm">
                        Formaté: <code className="bg-green-500/30 px-2 py-1 rounded">
                          {validationResult.formattedNumber}
                        </code>
                      </p>
                    )}
                    
                    {!validationResult.isValid && validationResult.errorMessage && (
                      <p className="text-red-300 text-sm">
                        Erreur: {validationResult.errorMessage}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Compteur de validations */}
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Validations déclenchées: {validationCount}</span>
                    <button
                      onClick={resetValidationCount}
                      className="ml-auto text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                  <p className="text-blue-200 text-xs mt-1">
                    Ce compteur montre le nombre de fois que la validation a été déclenchée.
                    Un nombre élevé indique des clignotements excessifs.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={testExamples}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    🧪 Tester les exemples dans la console
                  </button>
                  
                  <button
                    onClick={() => setShowExamples(!showExamples)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {showExamples ? 'Masquer' : 'Afficher'} les exemples
                  </button>

                  <button
                    onClick={() => {
                      setPhoneValue('');
                      setValidationResult(null);
                      resetValidationCount();
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    🔄 Réinitialiser le test
                  </button>
                </div>
              </div>
            </div>

            {/* Exemples et documentation */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Formats acceptés
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">✅ Formats valides :</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• +224 612 34 56 78</li>
                      <li>• 224 612 34 56 78</li>
                      <li>• 612 34 56 78</li>
                      <li>• +22461234567</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-red-400 font-medium mb-2">❌ Formats invalides :</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 12345678 (ne commence pas par 6 ou 7)</li>
                      <li>• 6123456 (trop court)</li>
                      <li>• 6123456789 (trop long)</li>
                      <li>• abc123456 (contient des lettres)</li>
                      <li>• 51234567 (commence par 5)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {showExamples && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Exemples de test</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">Numéros valides :</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {VALID_PHONE_EXAMPLES.slice(0, 8).map((phone, index) => (
                          <div
                            key={index}
                            className="text-xs bg-green-500/20 p-2 rounded border border-green-500/30"
                          >
                            {phone}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-red-400 font-medium mb-2">Numéros invalides :</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {INVALID_PHONE_EXAMPLES.map((phone, index) => (
                          <div
                            key={index}
                            className="text-xs bg-red-500/20 p-2 rounded border border-red-500/30"
                          >
                            {phone}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Optimisations Anti-Clignotement</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• ✅ Debouncing de 800ms (au lieu de 300ms)</li>
                  <li>• ✅ Validation seulement après 8 chiffres</li>
                  <li>• ✅ Évitement des validations redondantes</li>
                  <li>• ✅ Formatage intelligent sans changements inutiles</li>
                  <li>• ✅ Validation immédiate au blur</li>
                  <li>• ✅ Compteur de validations pour monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
