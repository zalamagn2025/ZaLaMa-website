'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo, memo } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { PaymentDaySelector } from '@/components/ui/payment-day-selector';
import { MotivationLetterInput } from '@/components/ui/motivation-letter-input';
import { CreatePartnershipRequest } from '@/types/partenaire';

// Composant FormField mémorisé pour éviter les re-renders
const FormField = memo(({ 
  name, 
  label, 
  type = 'text', 
  placeholder = '', 
  required = true,
  options = null,
  delay = 0,
  value,
  onChange,
  onBlur,
  hasError,
  isValid,
  errorMessage
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[] | null;
  delay?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  hasError: boolean;
  isValid: boolean;
  errorMessage: string;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
    >
      <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`bg-blue-950/30 border text-white h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all w-full ${
            hasError 
              ? 'border-red-500/70' 
              : isValid 
              ? 'border-green-500/70' 
              : 'border-blue-700/70'
          }`}
        >
          <option value="" className="bg-blue-950 text-white">
            Sélectionnez {label.toLowerCase()}
          </option>
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-blue-950 text-white">
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          className={`bg-blue-950/30 border text-white placeholder-gray-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all ${
            hasError 
              ? 'border-red-500/70' 
              : isValid 
              ? 'border-green-500/70' 
              : 'border-blue-700/70'
          }`}
        />
      )}
      
      {/* Afficher l'erreur seulement si le champ a été validé ET qu'il y a une erreur */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 mt-1 text-red-400 text-xs"
        >
          <AlertCircle className="h-3 w-3" />
          {errorMessage}
        </motion.div>
      )}
      
      {/* Afficher "Valide" seulement si le champ a été validé ET qu'il n'y a pas d'erreur ET qu'il y a une valeur */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 mt-1 text-green-400 text-xs"
        >
          <CheckCircle className="h-3 w-3" />
          Valide
        </motion.div>
      )}
    </motion.div>
  );
});

FormField.displayName = 'FormField';

export const PartnershipForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    legalStatus: '',
    rccm: '',
    nif: '',
    activityDomain: '',
    headquartersAddress: '',
    phone: '+224',
    email: '',
    employeesCount: '',
    payroll: '',
    cdiCount: '',
    cddCount: '',
    paymentDate: '',
    paymentDay: '',
    agreement: false,
    repFullName: '',
    repEmail: '',
    repPhone: '+224',
    repPosition: '',
    hrFullName: '',
    hrEmail: '',
    hrPhone: '+224',
    motivation_letter_url: '', // URL du fichier uploadé
    motivation_letter_text: '' // Texte de la lettre rédigée
  });

  // État pour le fichier de lettre de motivation
  const [motivationLetterFile, setMotivationLetterFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(new Set());

  // Validation des champs - mémorisé
  const validateField = useCallback((name: string, value: string | boolean) => {
    const stringValue = String(value);
    
    switch (name) {
      case 'companyName':
        if (!stringValue.trim()) return 'Le nom de l\'entreprise est obligatoire';
        if (stringValue.length < 2) return 'Le nom doit contenir au moins 2 caractères';
        break;
        
      case 'legalStatus':
        if (!stringValue) return 'Veuillez sélectionner un statut juridique';
        break;
        
      case 'rccm':
        if (!stringValue.trim()) return 'Le RCCM est obligatoire';
        if (stringValue.length < 5) return 'Le RCCM doit contenir au moins 5 caractères';
        break;
        
      case 'nif':
        if (!stringValue.trim()) return 'Le NIF est obligatoire';
        if (stringValue.length < 5) return 'Le NIF doit contenir au moins 5 caractères';
        break;
        
      case 'activityDomain':
        if (!stringValue) return 'Veuillez sélectionner un domaine d\'activité';
        break;
        
      case 'headquartersAddress':
        if (!stringValue.trim()) return 'L\'adresse du siège est obligatoire';
        if (stringValue.length < 10) return 'L\'adresse doit contenir au moins 10 caractères';
        break;
        
      case 'phone':
        if (!stringValue.trim()) return 'Le téléphone est obligatoire';
        break;
        
      case 'email':
        if (!stringValue.trim()) return 'L\'email est obligatoire';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) return 'Format d\'email invalide';
        break;
        
      case 'employeesCount':
        if (!stringValue) return 'Le nombre d\'employés est obligatoire';
        const count = parseInt(stringValue);
        if (isNaN(count) || count < 1) return 'Le nombre d\'employés doit être supérieur à 0';
        break;
        
      case 'payroll':
        if (!stringValue.trim()) return 'La masse salariale est obligatoire';
        break;
        
      case 'cdiCount':
        if (!stringValue) return 'Le nombre de CDI est obligatoire';
        const cdi = parseInt(stringValue);
        if (isNaN(cdi) || cdi < 0) return 'Le nombre de CDI doit être positif';
        break;
        
      case 'cddCount':
        if (!stringValue) return 'Le nombre de CDD est obligatoire';
        const cdd = parseInt(stringValue);
        if (isNaN(cdd) || cdd < 0) return 'Le nombre de CDD doit être positif';
        break;
        
      case 'paymentDate':
        // Validation supprimée car remplacée par paymentDay
        break;
        
      case 'paymentDay':
        console.log('🔧 PaymentDay validation:', stringValue, typeof stringValue);
        if (!stringValue) return 'Le jour de paiement est obligatoire';
        const day = parseInt(stringValue);
        if (isNaN(day) || day < 1 || day > 31) return 'Le jour doit être entre 1 et 31';
        break;
        
      case 'repFullName':
        if (!stringValue.trim()) return 'Le nom du représentant est obligatoire';
        if (stringValue.length < 3) return 'Le nom doit contenir au moins 3 caractères';
        break;
        
      case 'repPosition':
        if (!stringValue.trim()) return 'La fonction du représentant est obligatoire';
        break;
        
      case 'repEmail':
        if (!stringValue.trim()) return 'L\'email du représentant est obligatoire';
        const repEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!repEmailRegex.test(stringValue)) return 'Format d\'email invalide';
        break;
        
      case 'repPhone':
        if (!stringValue.trim()) return 'Le téléphone du représentant est obligatoire';
        break;
        
      case 'hrFullName':
        if (!stringValue.trim()) return 'Le nom du responsable RH est obligatoire';
        if (stringValue.length < 3) return 'Le nom doit contenir au moins 3 caractères';
        break;
        
      case 'hrEmail':
        if (!stringValue.trim()) return 'L\'email du responsable RH est obligatoire';
        const hrEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!hrEmailRegex.test(stringValue)) return 'Format d\'email invalide';
        break;
        
      case 'hrPhone':
        if (!stringValue.trim()) return 'Le téléphone du responsable RH est obligatoire';
        break;
        
      case 'agreement':
        if (!value) return 'Vous devez accepter l\'engagement';
        break;
        
      case 'motivation_letter_url':
        // Validation supprimée car maintenant gérée par le nouveau composant
        break;
      case 'motivation_letter_text':
        // Validation supprimée car maintenant gérée par le nouveau composant
        break;
    }
    
    return '';
  }, []);

  // Handle change mémorisé
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Ne pas valider pendant la saisie, seulement effacer l'erreur si elle existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name: string) => {
    // Ne pas valider sur blur, juste marquer comme touché
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Fonctions wrapper pour onBlur
  const handleCompanyNameBlur = useCallback(() => handleBlur('companyName'), [handleBlur]);
  const handleLegalStatusBlur = useCallback(() => handleBlur('legalStatus'), [handleBlur]);
  const handleRccmBlur = useCallback(() => handleBlur('rccm'), [handleBlur]);
  const handleNifBlur = useCallback(() => handleBlur('nif'), [handleBlur]);
  const handleActivityDomainBlur = useCallback(() => handleBlur('activityDomain'), [handleBlur]);
  const handleHeadquartersAddressBlur = useCallback(() => handleBlur('headquartersAddress'), [handleBlur]);
  const handlePhoneBlur = useCallback(() => handleBlur('phone'), [handleBlur]);
  const handleEmailBlur = useCallback(() => handleBlur('email'), [handleBlur]);
  const handleEmployeesCountBlur = useCallback(() => handleBlur('employeesCount'), [handleBlur]);
  const handlePayrollBlur = useCallback(() => handleBlur('payroll'), [handleBlur]);
  const handleCdiCountBlur = useCallback(() => handleBlur('cdiCount'), [handleBlur]);
  const handleCddCountBlur = useCallback(() => handleBlur('cddCount'), [handleBlur]);
  const handlePaymentDateBlur = useCallback(() => handleBlur('paymentDate'), [handleBlur]);
  const handlePaymentDayBlur = useCallback(() => handleBlur('paymentDay'), [handleBlur]);
  const handleRepFullNameBlur = useCallback(() => handleBlur('repFullName'), [handleBlur]);
  const handleRepPositionBlur = useCallback(() => handleBlur('repPosition'), [handleBlur]);
  const handleRepEmailBlur = useCallback(() => handleBlur('repEmail'), [handleBlur]);
  const handleRepPhoneBlur = useCallback(() => handleBlur('repPhone'), [handleBlur]);
  const handleHrFullNameBlur = useCallback(() => handleBlur('hrFullName'), [handleBlur]);
  const handleHrEmailBlur = useCallback(() => handleBlur('hrEmail'), [handleBlur]);
  const handleHrPhoneBlur = useCallback(() => handleBlur('hrPhone'), [handleBlur]);

  const validateStep = useCallback((stepNumber: number) => {
    const stepFields: Record<number, string[]> = {
      1: ['companyName', 'legalStatus', 'rccm', 'nif', 'activityDomain', 'headquartersAddress', 'phone', 'email', 'employeesCount', 'payroll', 'cdiCount', 'cddCount', 'paymentDay'],
      2: ['repFullName', 'repPosition', 'repEmail', 'repPhone'],
      3: ['hrFullName', 'hrEmail', 'hrPhone', 'agreement'],
      4: [] // Pas de champs spécifiques, validation spéciale pour la lettre de motivation
    };
    
    const fieldsToValidate = stepFields[stepNumber];
    const newErrors: Record<string, string> = {};
    
    // Marquer tous les champs de l'étape comme touchés ET validés
    setTouched(prev => {
      const newTouched = { ...prev };
      fieldsToValidate.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });
    
    // Valider tous les champs de l'étape
    fieldsToValidate.forEach(field => {
      const fieldError = validateField(field, formData[field as keyof typeof formData]);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });
    
    // Valider les champs uniques si c'est l'étape 1, 2 ou 3 (qui contiennent emails)
    if (stepNumber === 1 || stepNumber === 2 || stepNumber === 3) {
      const emails = [formData.email, formData.repEmail, formData.hrEmail].filter(Boolean);
      
      const emailDuplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
      
      if (emailDuplicates.length > 0) {
        newErrors.email = 'Les emails doivent être uniques';
        newErrors.repEmail = 'Les emails doivent être uniques';
        newErrors.hrEmail = 'Les emails doivent être uniques';
      }
    }
    
    setErrors(newErrors);
    
    // Validation spéciale pour l'étape 4 (lettre de motivation)
    if (stepNumber === 4) {
      const motivationError = validateMotivationLetter()
      if (motivationError) {
        newErrors.motivation_letter = motivationError
      }
    }
    
    // Si pas d'erreurs, marquer l'étape comme validée
    if (Object.keys(newErrors).length === 0) {
      setValidatedSteps(prev => new Set([...prev, stepNumber]));
    }
    
    return Object.keys(newErrors).length === 0;
  }, [validateField, formData]);

  const handleCloseDrawer = useCallback(() => {
    setSuccess(false);
    setFormData({
      companyName: '',
      legalStatus: '',
      rccm: '',
      nif: '',
      activityDomain: '',
      headquartersAddress: '',
      phone: '+224',
      email: '',
      employeesCount: '',
      payroll: '',
      cdiCount: '',
      cddCount: '',
      paymentDate: '',
      paymentDay: '',
      agreement: false,
      repFullName: '',
      repEmail: '',
      repPhone: '+224',
      repPosition: '',
      hrFullName: '',
      hrEmail: '',
      hrPhone: '+224',
      motivation_letter_url: '', // URL du fichier uploadé
      motivation_letter_text: '' // Texte de la lettre rédigée
    });
    setErrors({});
    setTouched({});
    router.push('https://www.zalamagn.com');
  }, [router]);

  const handleSubmitStep = useCallback(async (e: React.FormEvent<HTMLFormElement>, nextStep: number | null) => {
    e.preventDefault();
    setError('');
    
    if (nextStep) {
      if (validateStep(step)) {
        setStep(nextStep);
      } else {
        setError('Veuillez corriger les erreurs avant de continuer');
      }
    } else {
      // Validation finale avant envoi
      if (!validateStep(4)) {
        setError('Veuillez corriger toutes les erreurs avant de soumettre');
        return;
      }
      
      // Upload du fichier si présent
      let motivationLetterUrl = formData.motivation_letter_url;
      
      if (motivationLetterFile) {
        try {
          const formDataFile = new FormData();
          formDataFile.append('file', motivationLetterFile);
          formDataFile.append('folder', 'partnership-letters');
          
          const uploadResponse = await fetch('/api/partnership/upload', {
            method: 'POST',
            body: formDataFile,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Erreur lors de l\'upload du fichier');
          }
          
          const uploadResult = await uploadResponse.json();
          motivationLetterUrl = uploadResult.url;
        } catch (uploadError) {
          console.error('❌ Erreur upload:', uploadError);
          throw new Error('Erreur lors de l\'upload de la lettre de motivation');
        }
      }
      
      // Envoi réel à l'API
      setLoading(true);

    try {
        const finalData = {
          ...formData,
          motivation_letter_url: motivationLetterUrl,
          motivation_letter_text: formData.motivation_letter_text || null
        };

        console.log('📤 Envoi des données de partenariat:', finalData);

      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la soumission');
      }

      const result = await response.json();
      console.log('✅ Demande envoyée avec succès:', result);
      
      setSuccess(true);
      
        // Réinitialisation après 15 secondes
      setTimeout(() => {
          handleCloseDrawer();
        }, 15000);

    } catch (err) {
      console.error('❌ Erreur lors de l\'envoi:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
    }
  }, [validateStep, step, formData, handleCloseDrawer]);

  // Options pour les domaines d'activité - mémorisé
  const activityDomains = useMemo(() => [
    { value: 'Agriculture', label: 'Agriculture et Agroalimentaire' },
    { value: 'Banque', label: 'Banque et Finance' },
    { value: 'Commerce', label: 'Commerce et Distribution' },
    { value: 'Construction', label: 'Construction et BTP' },
    { value: 'Education', label: 'Éducation et Formation' },
    { value: 'Energie', label: 'Énergie et Mines' },
    { value: 'Industrie', label: 'Industrie et Manufacture' },
    { value: 'Informatique', label: 'Informatique et Technologies' },
    { value: 'Logistique', label: 'Logistique et Transport' },
    { value: 'Sante', label: 'Santé et Pharmacie' },
    { value: 'Telecom', label: 'Télécommunications' },
    { value: 'Tourisme', label: 'Tourisme et Hôtellerie' },
    { value: 'Autre', label: 'Autre domaine d\'activité' }
  ], []);

  // Options pour les statuts juridiques - mémorisé
  const legalStatusOptions = useMemo(() => [
    { value: 'SAS', label: 'SAS (Société par Actions Simplifiée)' },
    { value: 'SA', label: 'SA (Société Anonyme)' },
    { value: 'SARL', label: 'SARL (Société à Responsabilité Limitée)' },
    { value: 'EURL', label: 'EURL (Entreprise Unipersonnelle à Responsabilité Limitée)' },
    { value: 'SNC', label: 'SNC (Société en Nom Collectif)' },
    { value: 'SCS', label: 'SCS (Société en Commandite Simple)' },
    { value: 'SCA', label: 'SCA (Société en Commandite par Actions)' },
    { value: 'SCOP', label: 'SCOP (Société Coopérative de Production)' },
    { value: 'Association', label: 'Association' },
    { value: 'ONG', label: 'ONG (Organisation Non Gouvernementale)' },
    { value: 'Autre', label: 'Autre' }
  ], []);

  const handleInputChange = (field: keyof CreatePartnershipRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUploaded = (url: string) => {
    handleInputChange('motivation_letter_url', url)
    setTouched(prev => ({ ...prev, motivation_letter_url: true }))
  }

  const handleFileRemoved = () => {
    handleInputChange('motivation_letter_url', '')
    setTouched(prev => ({ ...prev, motivation_letter_url: true }))
  }

  // Nouvelles fonctions pour la lettre de motivation
  const handleMotivationLetterTextChange = (text: string) => {
    handleInputChange('motivation_letter_text', text)
    setTouched(prev => ({ ...prev, motivation_letter_text: true }))
  }

  const handleMotivationLetterFileChange = (file: File | null) => {
    setMotivationLetterFile(file)
    if (file) {
      handleInputChange('motivation_letter_url', '')
      setTouched(prev => ({ ...prev, motivation_letter_url: true }))
    }
  }

  // Validation personnalisée pour la lettre de motivation
  const validateMotivationLetter = () => {
    const hasText = formData.motivation_letter_text.trim().length > 0
    const hasFile = motivationLetterFile !== null
    
    if (!hasText && !hasFile) {
      return 'Vous devez fournir une lettre de motivation (texte ou fichier)'
    }
    
    if (hasText && hasFile) {
      return 'Vous ne pouvez pas fournir à la fois un texte et un fichier'
    }
    
    if (hasText && formData.motivation_letter_text.trim().length < 100) {
      return 'Le texte de la lettre doit contenir au moins 100 caractères'
    }
    
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // onSubmit(formData) // This line was removed as per the new_code, as the onSubmit prop was removed.
  }

  const setMotivationLetterUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      motivation_letter_url: url
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-blue-900/10 border border-blue-700/80"
    >
      {/* Bouton de retour */}
      <motion.div 
        whileHover={{ x: -3 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="mb-8"
      >
        <Link href="https://www.zalamagn.com/partnership" passHref>
          <Button variant="ghost" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Retour aux partenariats</span>
          </Button>
        </Link>
      </motion.div>

      {/* Titre et progression */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.h2 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400 mb-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Devenez Partenaire - Étape {step}/4
        </motion.h2>
        <motion.p 
          className="text-blue-300/90 text-sm max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {step === 1 && "Informations sur l'entreprise"}
          {step === 2 && "Informations du représentant"}
          {step === 3 && "Informations du responsable RH"}
        </motion.p>
        <motion.div 
          className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mt-5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmitStep(e, 2)}
            className="space-y-7"
          >
            <FormField 
            name="companyName"
              label="Nom de l'entreprise" 
              placeholder="Ex: Entreprise ABC"
              delay={0.4}
            value={formData.companyName}
            onChange={handleChange}
              onBlur={handleCompanyNameBlur}
              hasError={!!(touched.companyName && errors.companyName)}
              isValid={validatedSteps.has(1) && !!(touched.companyName && !errors.companyName && formData.companyName)}
              errorMessage={errors.companyName || ''}
            />

            <FormField 
            name="legalStatus"
              label="Statut juridique"
              options={legalStatusOptions}
              delay={0.45}
            value={formData.legalStatus}
            onChange={handleChange}
              onBlur={handleLegalStatusBlur}
              hasError={!!(touched.legalStatus && errors.legalStatus)}
              isValid={validatedSteps.has(1) && !!(touched.legalStatus && !errors.legalStatus && formData.legalStatus)}
              errorMessage={errors.legalStatus || ''}
            />

        {/* RCCM et NIF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
              name="rccm"
                label="RCCM" 
                placeholder="Ex: GN-2023-B-12345"
                delay={0.5}
              value={formData.rccm}
              onChange={handleChange}
                onBlur={handleRccmBlur}
                hasError={!!(touched.rccm && errors.rccm)}
                isValid={validatedSteps.has(1) && !!(touched.rccm && !errors.rccm && formData.rccm)}
                errorMessage={errors.rccm || ''}
              />
              
              <FormField 
              name="nif"
                label="NIF" 
                placeholder="Ex: 123456789"
                delay={0.55}
              value={formData.nif}
                onChange={handleChange}
                onBlur={handleNifBlur}
                hasError={!!(touched.nif && errors.nif)}
                isValid={validatedSteps.has(1) && !!(touched.nif && !errors.nif && formData.nif)}
                errorMessage={errors.nif || ''}
              />
            </div>

            <FormField 
              name="activityDomain" 
              label="Domaine d'activité"
              options={activityDomains}
              delay={0.6}
              value={formData.activityDomain}
              onChange={handleChange}
              onBlur={handleActivityDomainBlur}
              hasError={!!(touched.activityDomain && errors.activityDomain)}
              isValid={validatedSteps.has(1) && !!(touched.activityDomain && !errors.activityDomain && formData.activityDomain)}
              errorMessage={errors.activityDomain || ''}
            />

            <FormField 
            name="headquartersAddress"
              label="Adresse du siège" 
              placeholder="Ex: 123 Avenue de la République, Conakry"
              delay={0.65}
            value={formData.headquartersAddress}
            onChange={handleChange}
              onBlur={handleHeadquartersAddressBlur}
              hasError={!!(touched.headquartersAddress && errors.headquartersAddress)}
              isValid={validatedSteps.has(1) && !!(touched.headquartersAddress && !errors.headquartersAddress && formData.headquartersAddress)}
              errorMessage={errors.headquartersAddress || ''}
            />

        {/* Téléphone et Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
              name="phone"
                label="Téléphone" 
              type="tel"
                placeholder="+224 xxx xxx xxx"
                delay={0.7}
              value={formData.phone}
              onChange={handleChange}
                onBlur={handlePhoneBlur}
                hasError={!!(touched.phone && errors.phone)}
                isValid={validatedSteps.has(1) && !!(touched.phone && !errors.phone && formData.phone)}
                errorMessage={errors.phone || ''}
              />
              
              <FormField 
              name="email"
                label="Email professionnel" 
              type="email"
                placeholder="contact@entreprise.com"
                delay={0.75}
              value={formData.email}
              onChange={handleChange}
                onBlur={handleEmailBlur}
                hasError={!!(touched.email && errors.email)}
                isValid={validatedSteps.has(1) && !!(touched.email && !errors.email && formData.email)}
                errorMessage={errors.email || ''}
              />
        </div>

        {/* Informations sur les employés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormField 
              name="employeesCount"
                label="Nombre d'employés" 
              type="number"
                placeholder="50"
                delay={0.8}
              value={formData.employeesCount}
              onChange={handleChange}
                onBlur={handleEmployeesCountBlur}
                hasError={!!(touched.employeesCount && errors.employeesCount)}
                isValid={validatedSteps.has(1) && !!(touched.employeesCount && !errors.employeesCount && formData.employeesCount)}
                errorMessage={errors.employeesCount || ''}
              />

              <FormField 
              name="payroll"
                label="Masse salariale" 
                placeholder="Ex: 500 000 000 GNF"
                delay={0.85}
              value={formData.payroll}
                onChange={handleChange}
                onBlur={handlePayrollBlur}
                hasError={!!(touched.payroll && errors.payroll)}
                isValid={validatedSteps.has(1) && !!(touched.payroll && !errors.payroll && formData.payroll)}
                errorMessage={errors.payroll || ''}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  name="cdiCount" 
                  label="CDI" 
                  type="number"
                  placeholder="30"
                  delay={0.9}
                  value={formData.cdiCount}
                  onChange={handleChange}
                  onBlur={handleCdiCountBlur}
                  hasError={!!(touched.cdiCount && errors.cdiCount)}
                  isValid={validatedSteps.has(1) && !!(touched.cdiCount && !errors.cdiCount && formData.cdiCount)}
                  errorMessage={errors.cdiCount || ''}
                />
                <FormField 
                  name="cddCount" 
                  label="CDD" 
                  type="number"
                  placeholder="20"
                  delay={0.95}
                  value={formData.cddCount}
                  onChange={handleChange}
                  onBlur={handleCddCountBlur}
                  hasError={!!(touched.cddCount && errors.cddCount)}
                  isValid={validatedSteps.has(1) && !!(touched.cddCount && !errors.cddCount && formData.cddCount)}
                  errorMessage={errors.cddCount || ''}
                />
              </div>
            </div>

            <PaymentDaySelector
              value={formData.paymentDay?.toString() || ''}
              onChange={(value) => {
                console.log('🔧 PaymentDay onChange:', value, typeof value);
                setFormData(prev => ({ ...prev, paymentDay: value }));
                if (errors.paymentDay) {
                  setErrors(prev => ({ ...prev, paymentDay: '' }));
                }
              }}
              onBlur={handlePaymentDayBlur}
              hasError={!!(touched.paymentDay && errors.paymentDay)}
              isValid={validatedSteps.has(1) && !!(touched.paymentDay && !errors.paymentDay && formData.paymentDay)}
              errorMessage={errors.paymentDay || ''}
              delay={1}
            />



            {/* Bouton de soumission */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-6"
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="drop-shadow-sm">Suivant</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </motion.div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmitStep(e, 3)}
            className="space-y-7"
          >
            <FormField 
              name="repFullName" 
              label="Nom complet du représentant" 
              placeholder="Ex: Mamadou Diallo"
              delay={0.4}
              value={formData.repFullName}
              onChange={handleChange}
              onBlur={handleRepFullNameBlur}
              hasError={!!(touched.repFullName && errors.repFullName)}
              isValid={validatedSteps.has(2) && !!(touched.repFullName && !errors.repFullName && formData.repFullName)}
              errorMessage={errors.repFullName || ''}
            />

            <FormField 
              name="repPosition" 
              label="Fonction du représentant" 
              placeholder="Ex: Directeur Général"
              delay={0.45}
              value={formData.repPosition}
              onChange={handleChange}
              onBlur={handleRepPositionBlur}
              hasError={!!(touched.repPosition && errors.repPosition)}
              isValid={validatedSteps.has(2) && !!(touched.repPosition && !errors.repPosition && formData.repPosition)}
              errorMessage={errors.repPosition || ''}
            />

            <FormField 
              name="repEmail" 
              label="Email du représentant" 
              type="email"
              placeholder="representant@entreprise.com"
              delay={0.5}
              value={formData.repEmail}
              onChange={handleChange}
              onBlur={handleRepEmailBlur}
              hasError={!!(touched.repEmail && errors.repEmail)}
              isValid={validatedSteps.has(2) && !!(touched.repEmail && !errors.repEmail && formData.repEmail)}
              errorMessage={errors.repEmail || ''}
            />

            <FormField 
              name="repPhone" 
              label="Téléphone du représentant" 
              type="tel"
              placeholder="+224 xxx xxx xxx"
              delay={0.55}
              value={formData.repPhone}
                onChange={handleChange}
              onBlur={handleRepPhoneBlur}
              hasError={!!(touched.repPhone && errors.repPhone)}
              isValid={validatedSteps.has(2) && !!(touched.repPhone && !errors.repPhone && formData.repPhone)}
              errorMessage={errors.repPhone || ''}
            />

            {/* Boutons de navigation */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="w-full h-14 rounded-xl text-base font-bold border-blue-700/70 text-blue-200 hover:bg-blue-950/30"
                >
                  Précédent
                </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </Button>
            </motion.div>
          </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmitStep(e, 4)}
            className="space-y-7"
          >
            <FormField 
              name="hrFullName" 
              label="Nom complet du RH" 
              placeholder="Ex: Fatou Camara"
              delay={0.4}
              value={formData.hrFullName}
              onChange={handleChange}
              onBlur={handleHrFullNameBlur}
              hasError={!!(touched.hrFullName && errors.hrFullName)}
              isValid={validatedSteps.has(3) && !!(touched.hrFullName && !errors.hrFullName && formData.hrFullName)}
              errorMessage={errors.hrFullName || ''}
            />

            <FormField 
              name="hrEmail" 
              label="Email du responsable RH" 
              type="email"
              placeholder="rh@entreprise.com"
              delay={0.45}
              value={formData.hrEmail}
              onChange={handleChange}
              onBlur={handleHrEmailBlur}
              hasError={!!(touched.hrEmail && errors.hrEmail)}
              isValid={validatedSteps.has(3) && !!(touched.hrEmail && !errors.hrEmail && formData.hrEmail)}
              errorMessage={errors.hrEmail || ''}
            />

            <FormField 
              name="hrPhone" 
              label="Téléphone du responsable RH" 
              type="tel"
              placeholder="+224 xxx xxx xxx"
              delay={0.5}
              value={formData.hrPhone}
              onChange={handleChange}
              onBlur={handleHrPhoneBlur}
              hasError={!!(touched.hrPhone && errors.hrPhone)}
              isValid={validatedSteps.has(3) && !!(touched.hrPhone && !errors.hrPhone && formData.hrPhone)}
              errorMessage={errors.hrPhone || ''}
            />

        {/* Lettre d'engagement */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileHover={{ scale: 1.01 }}
          className="pt-6"
        >
          <div className="flex items-start bg-blue-950/20 p-4 rounded-xl border border-blue-700/50">
            <div className="flex items-center h-5 mt-1">
              <input
                id="agreement"
                name="agreement"
                type="checkbox"
                checked={formData.agreement}
                onChange={handleChange}
                required
                className="focus:ring-orange-500 h-5 w-5 text-orange-500 border-blue-700 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="agreement" className="font-medium text-blue-100/90 text-sm leading-snug">
                Je m&apos;engage à coopérer pleinement dans le cadre de ce partenariat et à fournir toutes les informations nécessaires à la réussite de notre collaboration.
              </label>
            </div>
          </div>
              {!!(touched.agreement && errors.agreement) && (
          <motion.div
                  initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-1 text-red-400 text-xs"
          >
                  <AlertCircle className="h-3 w-3" />
                  {errors.agreement}
          </motion.div>
        )}
              {validatedSteps.has(3) && !!(touched.agreement && !errors.agreement && formData.agreement) && (
          <motion.div
                  initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-1 text-green-400 text-xs"
          >
                  <CheckCircle className="h-3 w-3" />
                  Valide
          </motion.div>
        )}
            </motion.div>

            {/* Boutons de navigation */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-full h-14 rounded-xl text-base font-bold border-blue-700/70 text-blue-200 hover:bg-blue-950/30"
                >
                  Précédent
                </Button>
              </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
                      <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </Button>
        </motion.div>
            </div>
          </motion.form>
        )}

        {step === 4 && (
          <motion.form
            key="step4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmitStep(e, null)}
            className="space-y-7"
          >
            <MotivationLetterInput
              textValue={formData.motivation_letter_text}
              fileValue={motivationLetterFile}
              onTextChange={handleMotivationLetterTextChange}
              onFileChange={handleMotivationLetterFileChange}
              onBlur={() => setTouched(prev => ({ ...prev, motivation_letter: true }))}
              hasError={!!(touched.motivation_letter && errors.motivation_letter)}
              isValid={validatedSteps.has(4) && !!(touched.motivation_letter && !errors.motivation_letter)}
              errorMessage={errors.motivation_letter || ''}
              delay={0.4}
            />

            {/* Boutons de navigation */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="w-full h-14 rounded-xl text-base font-bold border-blue-700/70 text-blue-200 hover:bg-blue-950/30"
                >
                  Précédent
                </Button>
              </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
                  disabled={loading}
            className="w-full h-14 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                      <span className="drop-shadow-sm">Suivant</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </Button>
        </motion.div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Drawer de succès */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-full p-8 rounded-3xl shadow-2xl bg-blue-900/90 border border-orange-500"
          >
            <motion.button
              onClick={handleCloseDrawer}
              className="absolute top-2 right-2 text-white hover:text-orange-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
            <div className="text-center">
              <motion.h3 
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Demande envoyée avec succès !
              </motion.h3>
              <motion.p
                className="text-blue-100 text-sm max-w-md mx-auto leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Votre demande de partenariat pour <span className="font-semibold">{formData.companyName}</span> a été enregistrée. 
                Nous contacterons <span className="font-semibold">{formData.repFullName}</span> ({formData.repEmail}) et <span className="font-semibold">{formData.hrFullName}</span> ({formData.hrEmail}) bientôt.
              </motion.p>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mt-6"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};
