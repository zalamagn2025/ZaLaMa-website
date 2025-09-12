'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { PaymentDaySelector } from '@/components/ui/payment-day-selector';
import PhoneInput from '@/components/ui/phone-input';
import CurrencyInput from '@/components/ui/currency-input';
import { LogoUpload } from '@/components/ui/logo-upload';
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
          aria-label={label}
          className={`bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all ${
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
    logoUrl: '',
    siteWeb: '',
    nombreAnneesActivite: '',
    agreement: false,
    repFullName: '',
    repEmail: '',
    repPhone: '+224',
    repPosition: '',
    hrFullName: '',
    hrEmail: '',
    hrPhone: '+224'
  });

  // État pour les données du logo (fichier sélectionné)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);



  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(new Set());

  // États pour la validation des téléphones
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    formattedValue: ""
  });
  const [repPhoneValidation, setRepPhoneValidation] = useState({
    isValid: false,
    formattedValue: ""
  });
  const [hrPhoneValidation, setHrPhoneValidation] = useState({
    isValid: false,
    formattedValue: ""
  });

  // État pour la validation de la masse salariale
  const [payrollValidation, setPayrollValidation] = useState({
    isValid: false,
    numericValue: 0
  });



  // Fonction pour réinitialiser le formulaire
  const resetForm = useCallback(() => {
    const emptyData = {
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
      logoUrl: '',
      siteWeb: '',
      nombreAnneesActivite: '',
      agreement: false,
      repFullName: '',
      repEmail: '',
      repPhone: '+224',
      repPosition: '',
      hrFullName: '',
      hrEmail: '',
      hrPhone: '+224'
    };

    setFormData(emptyData);
    setTouched({});
    setErrors({});
    setValidatedSteps(new Set());
    setError('');
    setStep(1);
    
    // Réinitialiser les validations des téléphones
    setPhoneValidation({ isValid: false, formattedValue: "" });
    setRepPhoneValidation({ isValid: false, formattedValue: "" });
    setHrPhoneValidation({ isValid: false, formattedValue: "" });
    
    // Réinitialiser la validation de la masse salariale
    setPayrollValidation({ isValid: false, numericValue: 0 });

    // Réinitialiser les données du logo
    setLogoFile(null);
    setLogoPreview(null);

  }, []);

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
        if (!phoneValidation.isValid) return 'Format de téléphone invalide';
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
        if (!payrollValidation.isValid) return 'Montant invalide';
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
        if (!stringValue) return 'Le jour de paiement est obligatoire';
        const day = parseInt(stringValue);
        if (isNaN(day) || day < 1 || day > 31) return 'Le jour doit être entre 1 et 31';
        break;
        
      case 'logoUrl':
        // Validation supprimée car maintenant gérée par l'upload de fichier
        break;
        
      case 'siteWeb':
        if (stringValue.trim() && stringValue.length > 255) return 'L\'URL du site web ne peut pas dépasser 255 caractères';
        if (stringValue.trim() && !stringValue.startsWith('http://') && !stringValue.startsWith('https://')) {
          return 'L\'URL du site web doit commencer par http:// ou https://';
        }
        break;
        
      case 'nombreAnneesActivite':
        if (stringValue.trim()) {
          const years = parseInt(stringValue);
          if (isNaN(years) || years < 0) return 'Le nombre d\'années d\'activité doit être positif';
        }
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
        if (!repPhoneValidation.isValid) return 'Format de téléphone invalide';
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
        if (!hrPhoneValidation.isValid) return 'Format de téléphone invalide';
        break;
        
      case 'agreement':
        if (!value) return 'Vous devez accepter l\'engagement';
        break;
        

    }
    
    return '';
  }, [phoneValidation.isValid, repPhoneValidation.isValid, hrPhoneValidation.isValid, payrollValidation.isValid]);

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
  const handleHrFullNameBlur = useCallback(() => handleBlur('hrFullName'), [handleBlur]);
  const handleHrEmailBlur = useCallback(() => handleBlur('hrEmail'), [handleBlur]);
  const handleLogoUrlBlur = useCallback(() => handleBlur('logoUrl'), [handleBlur]);
  const handleSiteWebBlur = useCallback(() => handleBlur('siteWeb'), [handleBlur]);
  const handleNombreAnneesActiviteBlur = useCallback(() => handleBlur('nombreAnneesActivite'), [handleBlur]);

  const validateStep = useCallback((stepNumber: number) => {
    const stepFields: Record<number, string[]> = {
      1: ['companyName', 'legalStatus', 'rccm', 'nif', 'activityDomain', 'headquartersAddress', 'phone', 'email', 'employeesCount', 'payroll', 'cdiCount', 'cddCount', 'paymentDay', 'logoUrl', 'siteWeb', 'nombreAnneesActivite'],
      2: ['repFullName', 'repPosition', 'repEmail', 'repPhone'],
      3: ['hrFullName', 'hrEmail', 'hrPhone', 'agreement']
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
    

    
    // Si pas d'erreurs, marquer l'étape comme validée
    if (Object.keys(newErrors).length === 0) {
      setValidatedSteps(prev => new Set([...prev, stepNumber]));
    }
    
    return Object.keys(newErrors).length === 0;
  }, [validateField, formData, phoneValidation.isValid, repPhoneValidation.isValid, hrPhoneValidation.isValid, payrollValidation.isValid]);

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
      logoUrl: '',
      siteWeb: '',
      nombreAnneesActivite: '',
      agreement: false,
      repFullName: '',
      repEmail: '',
      repPhone: '+224',
      repPosition: '',
      hrFullName: '',
      hrEmail: '',
      hrPhone: '+224'
    });
    setErrors({});
    setTouched({});
    
    // Réinitialiser les validations des téléphones
    setPhoneValidation({ isValid: false, formattedValue: "" });
    setRepPhoneValidation({ isValid: false, formattedValue: "" });
    setHrPhoneValidation({ isValid: false, formattedValue: "" });
    
    // Réinitialiser la validation de la masse salariale
    setPayrollValidation({ isValid: false, numericValue: 0 });
    
    // Réinitialiser les données du logo
    setLogoFile(null);
    setLogoPreview(null);
    
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
      if (!validateStep(3)) {
        setError('Veuillez corriger toutes les erreurs avant de soumettre');
        return;
      }
      
      // Envoi réel à l'API
      setLoading(true);

    try {
        // Upload du logo si un fichier est sélectionné
        let logoUrl: string | undefined = formData.logoUrl || undefined;
        if (logoFile && !logoUrl) {
          const uploadedUrl = await uploadLogoOnSubmit(logoFile);
          if (!uploadedUrl) {
            setError('Erreur lors de l\'upload du logo. Veuillez réessayer.');
            setLoading(false);
            return;
          }
          logoUrl = uploadedUrl;
        }

        // Transformer les données selon le format attendu par l'Edge Function
        const finalData = {
          company_name: formData.companyName?.trim() || '',
          legal_status: formData.legalStatus?.trim() || '',
          rccm: formData.rccm?.trim() || '',
          nif: formData.nif?.trim() || '',
          activity_domain: formData.activityDomain?.trim() || '',
          headquarters_address: formData.headquartersAddress?.trim() || '',
          phone: phoneValidation.formattedValue || formData.phone?.trim() || '',
          email: formData.email?.trim() || '',
          employees_count: parseInt(formData.employeesCount) || 0,
          payroll: payrollValidation.numericValue.toString() || '',
          cdi_count: parseInt(formData.cdiCount) || 0,
          cdd_count: parseInt(formData.cddCount) || 0,
          payment_day: formData.paymentDay && formData.paymentDay.trim() !== '' ? parseInt(formData.paymentDay) : undefined,
          // Logo : envoyer l'URL si disponible
          logo_url: logoUrl || undefined,
          site_web: formData.siteWeb?.trim() || undefined,
          nombre_annees_activite: formData.nombreAnneesActivite?.trim() ? parseInt(formData.nombreAnneesActivite) : undefined,
          rep_full_name: formData.repFullName?.trim() || '',
          rep_position: formData.repPosition?.trim() || '',
          rep_email: formData.repEmail?.trim() || '',
          rep_phone: repPhoneValidation.formattedValue || formData.repPhone?.trim() || '',
          hr_full_name: formData.hrFullName?.trim() || '',
          hr_email: formData.hrEmail?.trim() || '',
          hr_phone: hrPhoneValidation.formattedValue || formData.hrPhone?.trim() || '',
          agreement: Boolean(formData.agreement)
        };


        const response = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(finalData),
      });

        const result = await response.json();

      if (!response.ok) {
          // Afficher les détails de l'erreur
          const errorMessage = result.error || 'Erreur lors de la soumission';
          const errorDetails = result.details ? 
            `\nDétails: ${Array.isArray(result.details) ? result.details.join(', ') : result.details}` : '';
          throw new Error(`${errorMessage}${errorDetails}`);
        }

        if (result.success) {
      setSuccess(true);
      
        // Réinitialisation après 15 secondes
      setTimeout(() => {
          handleCloseDrawer();
        }, 15000);
        } else {
          // Afficher les détails de l'erreur même si response.ok
          const errorMessage = result.error || 'Erreur lors de la soumission';
          const errorDetails = result.details ? 
            `\nDétails: ${Array.isArray(result.details) ? result.details.join(', ') : result.details}` : '';
          throw new Error(`${errorMessage}${errorDetails}`);
        }

    } catch (err) {
      console.error('❌ Erreur lors de l\'envoi:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
    }
  }, [validateStep, step, formData, handleCloseDrawer, phoneValidation.formattedValue, repPhoneValidation.formattedValue, hrPhoneValidation.formattedValue, payrollValidation.numericValue]);

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





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // onSubmit(formData) // This line was removed as per the new_code, as the onSubmit prop was removed.
  }

  // Script de diagnostic pour l'Edge Function
  useEffect(() => {
    // Script de test pour diagnostiquer le problème de création de demande
    console.log('🔍 Diagnostic Edge Function - Problème de création...');
    
    // Fonction pour tester l'Edge Function avec différents scénarios
    (window as any).diagnoseEdgeFunctionIssue = async () => {
      console.log('🚀 Diagnostic du problème de création de demande...');
      
      // Test 1: Données exactes de la documentation
      const testData1 = {
        company_name: "Entreprise Test SARL",
        legal_status: "SARL",
        rccm: "RC/2024/001",
        nif: "NIF2024001",
        activity_domain: "Technologie",
        headquarters_address: "123 Avenue de la République, Conakry, Guinée",
        phone: "+224123456789",
        email: "contact@entreprisetest.gn",
        employees_count: 25,
        payroll: "50000000",
        cdi_count: 20,
        cdd_count: 5,
        payment_date: "2024-02-15",
        rep_full_name: "Mamadou Diallo",
        rep_position: "Directeur Général",
        rep_email: "mamadou.diallo@entreprisetest.gn",
        rep_phone: "+224123456789",
        hr_full_name: "Fatoumata Camara",
        hr_email: "fatoumata.camara@entreprisetest.gn",
        hr_phone: "+224123456790",
        agreement: true,
        payment_day: 25
      };

      
      try {
        const response1 = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData1)
        });

        const result1 = await response1.json();
              } catch (error) {
        }

      // Test 2: Données avec date actuelle
      const testData2 = {
        ...testData1,
        payment_date: new Date().toISOString().split('T')[0]
      };

      console.log('📤 Test 2 - Données avec date actuelle:', testData2);
      
      try {
        const response2 = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData2)
        });

        const result2 = await response2.json();
        console.log('📥 Réponse Test 2:', {
          status: response2.status,
          success: result2.success,
          error: result2.error,
          details: result2.details,
          message: result2.message
        });
              } catch (error) {
          console.log('❌ Erreur Test 2:', (error as Error).message);
        }

      // Test 3: Sans payment_day
      const testData3: any = {
        ...testData1,
        payment_date: new Date().toISOString().split('T')[0]
      };
      delete testData3.payment_day;

      console.log('📤 Test 3 - Sans payment_day:', testData3);
      
      try {
        const response3 = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData3)
        });

        const result3 = await response3.json();
        console.log('📥 Réponse Test 3:', {
          status: response3.status,
          success: result3.success,
          error: result3.error,
          details: result3.details,
          message: result3.message
        });
              } catch (error) {
          console.log('❌ Erreur Test 3:', (error as Error).message);
        }

      console.log('📝 Actions disponibles:');
      console.log('- window.diagnoseEdgeFunctionIssue() : Diagnostic complet');
    };

    // Fonction pour tester avec les données exactes du formulaire
    (window as any).testWithFormData = async () => {
      console.log('🎯 Test avec les données exactes du formulaire...');
      
      // Données qui seraient envoyées par le formulaire pré-rempli
      const formData = {
        company_name: "Entreprise Test SARL",
        legal_status: "SARL",
        rccm: "RC/2024/001",
        nif: "NIF2024001",
        activity_domain: "Technologie",
        headquarters_address: "123 Avenue de la République, Conakry, Guinée",
        phone: "+224123456789",
        email: "contact@entreprisetest.gn",
        employees_count: 25,
        payroll: "50000000",
        cdi_count: 20,
        cdd_count: 5,
        payment_date: new Date().toISOString().split('T')[0],
        rep_full_name: "Mamadou Diallo",
        rep_position: "Directeur Général",
        rep_email: "mamadou.diallo@entreprisetest.gn",
        rep_phone: "+224123456789",
        hr_full_name: "Fatoumata Camara",
        hr_email: "fatoumata.camara@entreprisetest.gn",
        hr_phone: "+224123456790",
        agreement: true,
        payment_day: 25
      };

      console.log('📤 Données du formulaire:', formData);
      
      try {
        const response = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('📥 Réponse Edge Function:', {
          status: response.status,
          success: result.success,
          error: result.error,
          details: result.details,
          message: result.message,
          requestId: result.requestId
        });

        if (result.success) {
          console.log('✅ Succès ! Request ID:', result.requestId);
        } else {
          console.log('❌ Échec:', result.error);
          console.log('📋 Détails:', result.details);
        }
              } catch (error) {
          console.log('❌ Erreur:', (error as Error).message);
        }
    };

    console.log('📝 Fonctions disponibles:');
    console.log('- window.diagnoseEdgeFunctionIssue() : Diagnostic complet');
    console.log('- window.testWithFormData() : Test avec données du formulaire');
  }, []);

  // Fonction pour uploader le logo lors de la soumission
  const uploadLogoOnSubmit = async (file: File): Promise<string | undefined> => {
    try {
      console.log('🖼️ Upload du logo lors de la soumission...');
      
      // Convertir le fichier en base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Appeler l'API d'upload
      const formData = new FormData();
      formData.append('logo', file);
      formData.append('partner_id', `temp-${Date.now()}`);

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du logo');
      }

      const result = await response.json();
      if (result.success && result.data?.publicUrl) {
        console.log('✅ Logo uploadé avec succès:', result.data.publicUrl);
        return result.data.publicUrl;
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('❌ Erreur upload logo:', error);
      return undefined;
    }
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
          Devenez Partenaire - Étape {step}/3
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
             suppressHydrationWarning={true}
           >
            <FormField 
            name="companyName"
              label="Nom de l'entreprise" 
              placeholder="Ex: Entreprise XYZ SARL"
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
                placeholder="Ex: RCCM-CON-01-A-2023"
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
                placeholder="Ex: NIF-12345678"
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
              placeholder="Ex: 123 Rue du Commerce, Conakry"
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
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                  Téléphone <span className="text-red-400">*</span>
                </label>
                <PhoneInput
              value={formData.phone}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, phone: value }));
                    if (errors.phone) {
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }
                  }}
                  onValidationChange={(isValid, formattedValue) => {
                    setPhoneValidation({ isValid, formattedValue });
                  }}
                  placeholder="+224 612 34 56 78"
                  label=""
                  required={true}
                  className={`w-full bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all ${
                    touched.phone && errors.phone 
                      ? 'border-red-500/70' 
                      : validatedSteps.has(1) && touched.phone && !errors.phone && formData.phone && phoneValidation.isValid
                      ? 'border-green-500/70' 
                      : 'border-blue-700/70'
                  }`}
                  showValidation={false}
                />
                {!!(touched.phone && errors.phone) && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-1 text-red-400 text-xs"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </motion.div>
                )}
                {validatedSteps.has(1) && !!(touched.phone && !errors.phone && formData.phone && phoneValidation.isValid) && (
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
              
              <FormField 
              name="email"
                label="Email professionnel" 
              type="email"
                placeholder="Ex: contact@entreprise.com"
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
                placeholder="Ex: 50"
                delay={0.8}
              value={formData.employeesCount}
              onChange={handleChange}
                onBlur={handleEmployeesCountBlur}
                hasError={!!(touched.employeesCount && errors.employeesCount)}
                isValid={validatedSteps.has(1) && !!(touched.employeesCount && !errors.employeesCount && formData.employeesCount)}
                errorMessage={errors.employeesCount || ''}
              />

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                  Masse salariale <span className="text-red-400">*</span>
                </label>
                <CurrencyInput
              value={formData.payroll}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, payroll: value }));
                    if (errors.payroll) {
                      setErrors(prev => ({ ...prev, payroll: '' }));
                    }
                  }}
                  onValidationChange={(isValid, numericValue) => {
                    setPayrollValidation({ isValid, numericValue });
                  }}
                  placeholder="0"
                  label=""
                  required={true}
                                     min={100000}
                  max={999999999999}
                  className={`w-full bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all ${
                    touched.payroll && errors.payroll 
                      ? 'border-red-500/70' 
                      : validatedSteps.has(1) && touched.payroll && !errors.payroll && formData.payroll && payrollValidation.isValid
                      ? 'border-green-500/70' 
                      : 'border-blue-700/70'
                  }`}
                  showValidation={false}
                />
                {!!(touched.payroll && errors.payroll) && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-1 text-red-400 text-xs"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.payroll}
                  </motion.div>
                )}
                {validatedSteps.has(1) && !!(touched.payroll && !errors.payroll && formData.payroll && payrollValidation.isValid) && (
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

              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  name="cdiCount" 
                  label="CDI" 
                  type="number"
                  placeholder="Ex: 30"
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
                  placeholder="Ex: 20"
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

            {/* Upload du logo */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                Logo de l'entreprise <span className="text-blue-300/60">(optionnel)</span>
              </label>
              <LogoUpload
                onFileUploaded={(url) => {
                  console.log('🎯 Logo uploadé avec succès, URL:', url);
                  setFormData(prev => ({ ...prev, logoUrl: url }));
                  if (errors.logoUrl) {
                    setErrors(prev => ({ ...prev, logoUrl: '' }));
                  }
                }}
                onFileRemoved={() => {
                  setFormData(prev => ({ ...prev, logoUrl: '' }));
                  setLogoFile(null);
                  setLogoPreview(null);
                }}
                onFileDataChange={(fileData) => {
                  console.log('📁 Données du fichier reçues:', fileData);
                  if (errors.logoUrl) {
                    setErrors(prev => ({ ...prev, logoUrl: '' }));
                  }
                }}
                onFileSelected={(file) => {
                  console.log('📁 Fichier sélectionné pour upload différé:', file);
                  setLogoFile(file);
                  // Créer une preview
                  const preview = URL.createObjectURL(file);
                  setLogoPreview(preview);
                  if (errors.logoUrl) {
                    setErrors(prev => ({ ...prev, logoUrl: '' }));
                  }
                }}
                label="Logo de l'entreprise"
                placeholder="Glissez votre logo ici ou cliquez pour sélectionner"
                hasError={!!(touched.logoUrl && errors.logoUrl)}
                isValid={validatedSteps.has(1) && !!(touched.logoUrl && !errors.logoUrl && (formData.logoUrl || logoFile))}
                errorMessage={errors.logoUrl || ''}
              />
            </motion.div>

            {/* Autres champs optionnels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                name="siteWeb"
                label="Site web de l'entreprise" 
                type="url"
                placeholder="https://www.entreprise.com"
                required={false}
                delay={1.15}
                value={formData.siteWeb}
                onChange={handleChange}
                onBlur={handleSiteWebBlur}
                hasError={!!(touched.siteWeb && errors.siteWeb)}
                isValid={validatedSteps.has(1) && !!(touched.siteWeb && !errors.siteWeb && formData.siteWeb)}
                errorMessage={errors.siteWeb || ''}
              />
              
              <FormField 
                name="nombreAnneesActivite"
                label="Nombre d'années d'activité" 
                type="number"
                placeholder="Ex: 5"
                required={false}
                delay={1.2}
                value={formData.nombreAnneesActivite}
                onChange={handleChange}
                onBlur={handleNombreAnneesActiviteBlur}
                hasError={!!(touched.nombreAnneesActivite && errors.nombreAnneesActivite)}
                isValid={validatedSteps.has(1) && !!(touched.nombreAnneesActivite && !errors.nombreAnneesActivite && formData.nombreAnneesActivite)}
                errorMessage={errors.nombreAnneesActivite || ''}
              />
            </div>



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
             suppressHydrationWarning={true}
           >
            <FormField 
              name="repFullName" 
              label="Nom complet du représentant" 
              placeholder="Ex: Mamadou DIALLO"
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
              placeholder="Ex: m.diallo@entreprise.com"
              delay={0.5}
              value={formData.repEmail}
              onChange={handleChange}
              onBlur={handleRepEmailBlur}
              hasError={!!(touched.repEmail && errors.repEmail)}
              isValid={validatedSteps.has(2) && !!(touched.repEmail && !errors.repEmail && formData.repEmail)}
              errorMessage={errors.repEmail || ''}
            />

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                Téléphone du représentant <span className="text-red-400">*</span>
              </label>
              <PhoneInput
              value={formData.repPhone}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, repPhone: value }));
                  if (errors.repPhone) {
                    setErrors(prev => ({ ...prev, repPhone: '' }));
                  }
                }}
                onValidationChange={(isValid, formattedValue) => {
                  setRepPhoneValidation({ isValid, formattedValue });
                }}
                placeholder="+224 612 34 56 78"
                label=""
                required={true}
                className={`w-full bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all ${
                  touched.repPhone && errors.repPhone 
                    ? 'border-red-500/70' 
                    : validatedSteps.has(2) && touched.repPhone && !errors.repPhone && formData.repPhone && repPhoneValidation.isValid
                    ? 'border-green-500/70' 
                    : 'border-blue-700/70'
                }`}
                showValidation={false}
              />
              {!!(touched.repPhone && errors.repPhone) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-1 text-red-400 text-xs"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.repPhone}
                </motion.div>
              )}
              {validatedSteps.has(2) && !!(touched.repPhone && !errors.repPhone && formData.repPhone && repPhoneValidation.isValid) && (
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
             onSubmit={(e) => handleSubmitStep(e, null)}
             className="space-y-7"
             suppressHydrationWarning={true}
           >
            <FormField 
              name="hrFullName" 
              label="Nom complet du RH" 
              placeholder="Ex: Aissatou BAH"
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
              placeholder="Ex: rh@entreprise.com"
              delay={0.45}
              value={formData.hrEmail}
              onChange={handleChange}
              onBlur={handleHrEmailBlur}
              hasError={!!(touched.hrEmail && errors.hrEmail)}
              isValid={validatedSteps.has(3) && !!(touched.hrEmail && !errors.hrEmail && formData.hrEmail)}
              errorMessage={errors.hrEmail || ''}
            />

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                Téléphone du responsable RH <span className="text-red-400">*</span>
              </label>
              <PhoneInput
              value={formData.hrPhone}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, hrPhone: value }));
                  if (errors.hrPhone) {
                    setErrors(prev => ({ ...prev, hrPhone: '' }));
                  }
                }}
                onValidationChange={(isValid, formattedValue) => {
                  setHrPhoneValidation({ isValid, formattedValue });
                }}
                placeholder="+224 655 12 34 56"
                label=""
                required={true}
                className={`w-full bg-blue-950/30 border text-white placeholder:text-gray-300/30 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all ${
                  touched.hrPhone && errors.hrPhone 
                    ? 'border-red-500/70' 
                    : validatedSteps.has(3) && touched.hrPhone && !errors.hrPhone && formData.hrPhone && hrPhoneValidation.isValid
                    ? 'border-green-500/70' 
                    : 'border-blue-700/70'
                }`}
                showValidation={false}
              />
              {!!(touched.hrPhone && errors.hrPhone) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-1 text-red-400 text-xs"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.hrPhone}
                </motion.div>
              )}
              {validatedSteps.has(3) && !!(touched.hrPhone && !errors.hrPhone && formData.hrPhone && hrPhoneValidation.isValid) && (
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
                  <span className="drop-shadow-sm">Envoyer la demande</span>
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
