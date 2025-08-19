"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, Zap, Users, FileText } from 'lucide-react';
import {
  NameInput,
  EmailInput,
  PhoneInputField,
  AddressInput,
  JobTitleInput,
  EmployeeIdInput,
  SalaryInput,
  DateInput,
  ExpirationDateInput,
  ApiKeyInput,
  GenderSelect,
  ContractTypeSelect
} from '@/components/ui/form-fields';
import { useEmployeeFormValidation } from '@/hooks/useFormValidation';
import { EmployeeFormData } from '@/utils/formValidation';

export default function FormValidationDemo() {
  const initialData: EmployeeFormData = {
    api_key: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    genre: 'Homme',
    poste: '',
    matricule: '',
    type_contrat: 'CDI',
    salaire_net: 0,
    date_embauche: '',
    date_expiration: ''
  };

  const {
    formData,
    validationState,
    updateField,
    validateAndSubmit,
    hasError,
    getFieldError
  } = useEmployeeFormValidation(initialData);

  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleSubmit = async (data: EmployeeFormData) => {
    // Simulation d'une soumission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmissionResult({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
    
    setShowResults(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await validateAndSubmit(handleSubmit);
    
    if (!success) {
      setSubmissionResult({
        success: false,
        errors: validationState.errors,
        timestamp: new Date().toISOString()
      });
      setShowResults(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Démonstration du Système de Validation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testez notre système de validation professionnel pour tous les champs de saisie
        </p>
      </div>

      {/* Statistiques de validation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border"
        >
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Champs totaux</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Champs valides</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Object.keys(validationState.errors).length === 0 ? '12' : '0'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">Erreurs</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {Object.keys(validationState.errors).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border"
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">État</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {validationState.isValid ? 'Prêt' : 'En cours'}
          </p>
        </motion.div>
      </div>

      {/* Formulaire */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleFormSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Étape 1: Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-500" />
              <span>Informations de base</span>
            </h3>
            
            <ApiKeyInput
              value={formData.api_key}
              onChange={(value) => updateField('api_key', value)}
              error={getFieldError('api_key')}
            />

            <NameInput
              value={formData.nom}
              onChange={(value) => updateField('nom', value)}
              label="Nom"
              placeholder="Entrez le nom"
              error={getFieldError('nom')}
            />

            <NameInput
              value={formData.prenom}
              onChange={(value) => updateField('prenom', value)}
              label="Prénom"
              placeholder="Entrez le prénom"
              error={getFieldError('prenom')}
            />

            <EmailInput
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={getFieldError('email')}
            />

            <PhoneInputField
              value={formData.telephone}
              onChange={(value) => updateField('telephone', value)}
              error={getFieldError('telephone')}
            />
          </div>

          {/* Étape 2: Informations professionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span>Informations professionnelles</span>
            </h3>

            <AddressInput
              value={formData.adresse}
              onChange={(value) => updateField('adresse', value)}
              error={getFieldError('adresse')}
            />

            <GenderSelect
              value={formData.genre}
              onChange={(value) => updateField('genre', value)}
            />

            <JobTitleInput
              value={formData.poste}
              onChange={(value) => updateField('poste', value)}
              error={getFieldError('poste')}
            />

            <EmployeeIdInput
              value={formData.matricule}
              onChange={(value) => updateField('matricule', value)}
              error={getFieldError('matricule')}
            />

                         <ContractTypeSelect
               value={formData.type_contrat}
               onChange={(value) => updateField('type_contrat', value)}
             />
             
             {/* Indicateur pour CDD */}
             {formData.type_contrat === 'CDD' && (
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800"
               >
                 <p className="flex items-center gap-1">
                   <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                   Le champ "Date d'expiration" sera requis pour les CDD
                 </p>
               </motion.div>
             )}
          </div>
        </div>

                 {/* Étape 3: Informations contractuelles */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <SalaryInput
             value={formData.salaire_net}
             onChange={(value) => updateField('salaire_net', parseFloat(value.replace(/\s/g, '')) || 0)}
             error={getFieldError('salaire_net')}
           />

           <DateInput
             value={formData.date_embauche}
             onChange={(value) => updateField('date_embauche', value)}
             label="Date d'embauche"
             fieldName="Date d'embauche"
             error={getFieldError('date_embauche')}
           />

           {/* Date d'expiration - visible seulement pour CDD */}
           <motion.div
             initial={false}
             animate={{
               opacity: formData.type_contrat === 'CDD' ? 1 : 0,
               scale: formData.type_contrat === 'CDD' ? 1 : 0.95,
               height: formData.type_contrat === 'CDD' ? 'auto' : 0,
               marginTop: formData.type_contrat === 'CDD' ? 0 : -20
             }}
             transition={{
               duration: 0.3,
               ease: "easeInOut"
             }}
             className={`overflow-hidden ${formData.type_contrat === 'CDD' ? 'pointer-events-auto' : 'pointer-events-none'}`}
           >
             <ExpirationDateInput
               value={formData.date_expiration || ''}
               onChange={(value) => updateField('date_expiration', value)}
               isVisible={formData.type_contrat === 'CDD'}
               error={getFieldError('date_expiration')}
             />
           </motion.div>
         </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center">
          <motion.button
            type="submit"
            disabled={validationState.isSubmitting || !validationState.isValid}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              validationState.isSubmitting || !validationState.isValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
            whileHover={validationState.isSubmitting || !validationState.isValid ? {} : { scale: 1.02 }}
            whileTap={validationState.isSubmitting || !validationState.isValid ? {} : { scale: 0.98 }}
          >
            {validationState.isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Envoi en cours...</span>
              </div>
            ) : (
              'Valider et soumettre'
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* Résultats */}
      {showResults && submissionResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Résultats de la validation
          </h3>
          
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(submissionResult, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Aide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          💡 Conseils d'utilisation
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Tous les champs sont validés en temps réel</li>
          <li>• Les erreurs s'affichent automatiquement</li>
          <li>• Le formatage est appliqué automatiquement</li>
          <li>• La validation est optimisée pour éviter les clignotements</li>
          <li>• Les numéros de téléphone doivent commencer par 6</li>
        </ul>
      </motion.div>
    </div>
  );
}
