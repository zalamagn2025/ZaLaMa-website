"use client";

import React, { useState } from 'react';
import { PhoneInput } from '@/components/ui/phone-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, CheckCircle, XCircle, Phone } from 'lucide-react';

export function PhoneValidationDemo() {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const [validationTime, setValidationTime] = useState<number>(0);
  const [testResults, setTestResults] = useState<Array<{
    input: string;
    isValid: boolean;
    time: number;
    formatted: string;
  }>>([]);

  const handleValidationChange = (valid: boolean, formatted: string) => {
    setIsValid(valid);
    setFormattedValue(formatted);
  };

  const runPerformanceTest = () => {
    const testNumbers = [
      '612345678',
      '+224612345678',
      '224612345678',
      '00224612345678',
      '612 34 56 78',
      '+224 612 34 56 78',
      '61234567', // invalide
      '712345678', // invalide
      '6123456789', // invalide
      'abc123def', // invalide
    ];

    const results = testNumbers.map(input => {
      const start = performance.now();
      const isValid = /^\+2246\d{8}$/.test(input.replace(/\D/g, ''));
      const end = performance.now();
      
      return {
        input,
        isValid,
        time: end - start,
        formatted: isValid ? `+224${input.replace(/\D/g, '').slice(-9)}` : 'Invalide'
      };
    });

    setTestResults(results);
    
    const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
    setValidationTime(avgTime);
  };

  const clearTest = () => {
    setTestResults([]);
    setValidationTime(0);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🚀 Validation Ultra-Rapide des Numéros de Téléphone
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testez la performance de validation en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composant de test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Test en Temps Réel
            </CardTitle>
            <CardDescription>
              Saisissez un numéro et observez la validation instantanée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              onValidationChange={handleValidationChange}
              placeholder="+224 612 34 56 78"
              label="Numéro de téléphone"
              required
            />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Statut:</span>
                {isValid ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Valide
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="w-3 h-3 mr-1" />
                    En cours
                  </Badge>
                )}
              </div>
              
              {formattedValue && (
                <div className="text-sm">
                  <span className="font-medium">Formaté:</span> {formattedValue}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tests de performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Tests de Performance
            </CardTitle>
            <CardDescription>
              Mesurez la vitesse de validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runPerformanceTest} variant="default">
                Lancer les Tests
              </Button>
              <Button onClick={clearTest} variant="outline">
                Effacer
              </Button>
            </div>

            {validationTime > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Temps moyen de validation:</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {validationTime.toFixed(3)}ms
                  </Badge>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  ⚡ Ultra-rapide ! La validation se fait en temps réel
                </p>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Résultats des tests:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded border ${
                        result.isValid 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono">{result.input}</span>
                        <Badge variant="outline" className="text-xs">
                          {result.time.toFixed(3)}ms
                        </Badge>
                      </div>
                      <div className="text-xs opacity-75">
                        {result.formatted}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations techniques */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Optimisations Implémentées</CardTitle>
          <CardDescription>
            Techniques utilisées pour une validation ultra-rapide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700 dark:text-green-300">
                ✅ Validation en Temps Réel
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Validation instantanée dès 9 chiffres</li>
                <li>• Feedback visuel immédiat</li>
                <li>• Formatage automatique pendant la saisie</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700 dark:text-blue-300">
                🚀 Performance
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Cache de validation intelligent</li>
                <li>• Timeout réduit à 150ms</li>
                <li>• Suppression des regex coûteuses</li>
                <li>• Validation conditionnelle</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-purple-700 dark:text-purple-300">
                🎨 UX Améliorée
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Indicateurs visuels colorés</li>
                <li>• Messages contextuels</li>
                <li>• Animations fluides</li>
                <li>• États de validation clairs</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700 dark:text-orange-300">
                🔧 Technique
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• useCallback pour optimiser les re-renders</li>
                <li>• Gestion intelligente des timeouts</li>
                <li>• Validation en deux étapes</li>
                <li>• Nettoyage automatique des ressources</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PhoneValidationDemo;
