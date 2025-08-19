"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  AlertCircle,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Hash,
  Users,
  Info,
  AlertTriangle
} from "lucide-react";
import { useRegisterEmployee, EmployeeRegistrationData } from "@/hooks/useRegisterEmployee";
import PhoneInput from "@/components/ui/phone-input";
import { validateAndFormatPhone } from "@/utils/phoneValidation";
import { 
  validateName, 
  validateEmail, 
  validateAddress, 
  validateJobTitle, 
  validateEmployeeId, 
  validateSalary, 
  validateDate, 
  validateContractType, 
  validateGender, 
  validateApiKey as validateApiKeyUtil,
  validateEmployeeForm,
  FormValidationErrors
} from "@/utils/formValidation";

// Composant Input réutilisable avec le style du login
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${className}`}
      {...props}
    />
  );
}

// Composant Select réutilisable
function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${className}`}
      {...props}
    />
  );
}

export default function EmployeeRegisterForm() {
  const router = useRouter();
  const { registerEmployee, loading, success, error, data, resetState } = useRegisterEmployee();
  
  // États pour les deux étapes
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [validatingApiKey, setValidatingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
     const [partnerInfo, setPartnerInfo] = useState<{ 
     company_name: string;
     logo_url?: string;
     partner_id?: string;
     is_active?: boolean;
     legal_status?: string;
     rccm?: string;
     nif?: string;
     activity_domain?: string;
     phone?: string;
     email?: string;
     status?: string;
     inscription_enabled?: boolean;
   } | null>(null);
  
  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);
  
        // États pour le formulaire complet
    const [formData, setFormData] = useState<EmployeeRegistrationData>({
      api_key: "",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      genre: "Homme",
      poste: "",
      matricule: "",
      type_contrat: "CDI",
      salaire_net: 0,
      date_embauche: "",
      date_expiration: "",
    });

  // États pour la validation du téléphone
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    formattedValue: ""
  });

  // États pour les erreurs de validation (seulement lors de la soumission)
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});

  // Validation des champs
  const validateStep1 = () => {
    return apiKey.trim().length > 0 && !apiKeyError;
  };

  // Fonction pour valider la clé API via l'API route
  const validateApiKey = async () => {
    console.log('validateApiKey appelé avec:', apiKey);
    
    if (!apiKey.trim()) {
      console.log('ApiKey vide');
      setApiKeyError("Le code entreprise est requis");
      return false;
    }

    setValidatingApiKey(true);
    setApiKeyError(null);

    try {
      console.log('🔍 Validation via API route...');
      
      const response = await fetch('/api/validate-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
      });

      console.log('📡 Réponse validation:', response.status);
      const result = await response.json();
      console.log('📋 Résultat validation:', result);

             if (result.success) {
         console.log('✅ Validation réussie pour:', result.data?.company_name);
         setPartnerInfo({
           company_name: result.data?.company_name || 'Entreprise inconnue',
           logo_url: result.data?.logo_url,
           partner_id: result.data?.partner_id,
           is_active: result.data?.status === 'approved',
           legal_status: result.data?.legal_status,
           rccm: result.data?.rccm,
           nif: result.data?.nif,
           activity_domain: result.data?.activity_domain,
           phone: result.data?.phone,
           email: result.data?.email,
           status: result.data?.status,
           inscription_enabled: result.data?.inscription_enabled
         });
         setApiKeyError(null);
         return true;
       } else {
        console.log('❌ Validation échouée:', result.error);
        setApiKeyError(result.message || result.error || "Code entreprise invalide");
        setPartnerInfo(null);
        return false;
      }

    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setApiKeyError("Erreur de connexion. Veuillez réessayer.");
      setPartnerInfo(null);
      return false;
    } finally {
      setValidatingApiKey(false);
    }
  };

     // Fonction simple pour vérifier si le bouton doit être activé
   const isFormValid = () => {
     // Vérifier si l'inscription est activée pour cette entreprise
     if (partnerInfo && partnerInfo.inscription_enabled === false) {
       return false;
     }
     
     return formData.nom?.trim() && 
            formData.prenom?.trim() && 
            formData.email?.trim() && 
            formData.poste?.trim() && 
            formData.salaire_net > 0 && 
            phoneValidation.isValid;
   };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleStep1Submit appelé avec apiKey:', apiKey);
    const isValid = await validateApiKey();
    console.log('Résultat validation:', isValid);
    if (isValid) {
      setFormData(prev => ({ ...prev, api_key: apiKey }));
      setStep(2);
    }
  };



  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation avant soumission avec affichage des erreurs
    const errors: FormValidationErrors = {};
    
    if (!formData.nom?.trim()) errors.nom = "Le nom est obligatoire";
    if (!formData.prenom?.trim()) errors.prenom = "Le prénom est obligatoire";
    if (!formData.email?.trim()) errors.email = "L'email est obligatoire";
    if (!formData.poste?.trim()) errors.poste = "Le poste est obligatoire";
         if (!formData.salaire_net || formData.salaire_net <= 0) errors.salaire_net = "Le salaire doit être supérieur à 0";
    
    // Validation du téléphone
    if (!phoneValidation.isValid) {
      errors.telephone = "Format de téléphone invalide";
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    
    // Validation de la date d'expiration pour CDD
    if (formData.type_contrat === 'CDD' && !formData.date_expiration) {
      errors.date_expiration = "La date d'expiration est obligatoire pour un CDD";
    }
    
    // Mettre à jour les erreurs de validation
    setValidationErrors(errors);
    
    // Si il y a des erreurs, ne pas soumettre
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Préparer les données pour l'envoi
    const dataToSend = {
      ...formData,
      telephone: phoneValidation.formattedValue || formData.telephone
    };
    
    await registerEmployee(dataToSend);
  };

  const handleInputChange = (field: keyof EmployeeRegistrationData, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si le type de contrat change de CDD vers autre chose, réinitialiser la date d'expiration
      if (field === 'type_contrat' && value !== 'CDD') {
        newData.date_expiration = '';
        // Supprimer l'erreur de validation pour la date d'expiration
        setValidationErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.date_expiration;
          return newErrors;
        });
      }
      
      return newData;
    });
  };

  const goBackToStep1 = () => {
    setStep(1);
    resetState();
    setApiKeyError(null);
    setPartnerInfo(null);
  };

  const handleSuccess = () => {
    // Rediriger vers la page de connexion après 3 secondes
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  // Fonction pour afficher les erreurs de validation
  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName];
  };



  // Si succès, afficher le message de confirmation
  if (success && data) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
        {/* Background effects similaires au login */}
        <div className="absolute inset-0" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#FF671E]/20 blur-[80px]" />
        
                 <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="w-full max-w-lg relative z-10"
         >
           <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-white/[0.05] shadow-2xl">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white">
                Inscription réussie !
              </h2>
              
                             <p className="text-white/70 text-sm">
                 Votre inscription a été validée avec succès.
               </p>
               
                               <div className="space-y-3 text-sm text-left">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Email de confirmation envoyé à {formData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>SMS de confirmation envoyé à {phoneValidation.formattedValue || formData.telephone}</span>
                  </div>
                   <div className="flex items-center gap-2 text-blue-300">
                     <div className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center">
                       <Info className="w-2.5 h-2.5 text-white" />
                     </div>
                     <span>Contactez votre RH ou représentant pour activer votre compte</span>
                   </div>
                   <div className="flex items-center gap-2 text-orange-300">
                     <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center">
                       <AlertTriangle className="w-2.5 h-2.5 text-white" />
                     </div>
                     <span>Si non approuvé, votre inscription sera annulée dans 7 jours et vous devrez vous réinscrire</span>
                   </div>
                </div>
              
              
              <button
                onClick={handleSuccess}
                className="w-full bg-[#FF671E] text-white font-medium py-2 rounded-lg hover:bg-[#FF671E]/90 transition-colors"
              >
                Aller à la connexion maintenant
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Éviter le rendu côté serveur pour éviter les problèmes d'hydratation
  if (!isClient) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-lg relative z-10">
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.05] shadow-2xl">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Chargement...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Bouton Retour */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white/90 text-[#FF671E] font-semibold rounded shadow transition-all z-20"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Retour
      </button>
      
      {/* Background effects */}
      <div className="absolute inset-0" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#FF671E]/20 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#FF671E]/20 blur-[60px]"
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {/* Header */}
          <div className="text-center space-y-2 mb-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>

            <h1 className="text-xl font-bold text-white">
              Inscription Employé
            </h1>
            
            <p className="text-white/60 text-sm">
              {step === 1 ? 'Étape 1/2 : Code entreprise' : 'Étape 2/2 : Informations personnelles'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>Progression</span>
              <span>{step}/2</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-[#FF671E] h-2 rounded-full"
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

                     {/* Messages d'erreur globaux */}
           <AnimatePresence>
             {error && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95, y: -20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: -20 }}
                 transition={{ type: "spring", stiffness: 300, damping: 25 }}
                 className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
               >
                 <div className="flex items-start gap-3">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                     <AlertCircle className="w-4 h-4 text-red-400" />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-red-200 font-semibold text-sm mb-1">Erreur d'inscription</h4>
                     <p className="text-red-300 text-sm leading-relaxed">{error}</p>
                   </div>
                 </div>


               </motion.div>
             )}
           </AnimatePresence>

          {/* Étape 1: Code entreprise */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleStep1Submit}
                className="space-y-4"
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
              >
                <div className="space-y-3">
                  <motion.div 
                    className={`relative ${focusedInput === "api_key" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Building className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "api_key" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                                             <Input
                         type="text"
                         placeholder="Code entreprise (API Key)"
                         value={apiKey}
                         onChange={(e) => {
                           setApiKey(e.target.value);
                           // Réinitialiser les erreurs quand l'utilisateur tape
                           if (apiKeyError) {
                             setApiKeyError(null);
                             setPartnerInfo(null);
                           }
                         }}
                         onFocus={() => setFocusedInput("api_key")}
                         onBlur={() => setFocusedInput(null)}
                         required
                         className={`w-full bg-white/5 border-2 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10 ${
                           apiKeyError 
                             ? 'border-red-500 focus:border-red-500' 
                             : focusedInput === "api_key"
                             ? 'border-[#FF671E] focus:border-[#FF671E]'
                             : 'border-white/20 hover:border-white/30'
                         }`}
                       />
                    </div>
                  </motion.div>
                </div>

                                 {/* Message d'erreur pour la clé API */}
                 <AnimatePresence>
                   {apiKeyError && (
                     <motion.div
                       initial={{ opacity: 0, scale: 0.95, y: -10 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95, y: -10 }}
                       transition={{ type: "spring", stiffness: 300, damping: 25 }}
                       className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
                     >
                       <div className="flex items-center gap-3">
                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                           <AlertCircle className="w-3 h-3 text-red-400" />
                         </div>
                         <p className="text-red-200 text-sm font-medium">{apiKeyError}</p>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {/* Message de succès pour la clé API */}
                 <AnimatePresence>
                   {partnerInfo && (
                     <motion.div
                       initial={{ opacity: 0, scale: 0.95, y: -10 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95, y: -10 }}
                       transition={{ type: "spring", stiffness: 300, damping: 25 }}
                       className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-xl backdrop-blur-sm"
                     >
                       <div className="flex items-center gap-3">
                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                           <CheckCircle className="w-3 h-3 text-green-400" />
                         </div>
                         <div className="flex items-center gap-3 flex-1">
                                                       {partnerInfo.logo_url && (
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white border border-white/30 flex items-center justify-center">
                                <img 
                                  src={partnerInfo.logo_url} 
                                  alt={`Logo ${partnerInfo.company_name}`}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                           <div className="flex-1">
                             <p className="text-green-200 text-sm font-medium">
                               Code valide pour : <span className="font-semibold text-green-100">{partnerInfo.company_name}</span>
                             </p>
                             {partnerInfo.is_active !== undefined && (
                               <p className="text-green-300/70 text-xs">
                                 Statut : {partnerInfo.is_active ? 'Actif' : 'Inactif'}
                               </p>
                             )}
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                                 <motion.button
                   whileHover={{ 
                     scale: 1.02,
                     boxShadow: "0 8px 25px rgba(255, 103, 30, 0.3)"
                   }}
                   whileTap={{ scale: 0.98 }}
                   type="submit"
                   disabled={!validateStep1() || validatingApiKey}
                   className="w-full relative group/button mt-8"
                 >
                   <div className="relative overflow-hidden bg-gradient-to-r from-[#FF671E] to-[#FF8533] disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-[#FF671E]/20">
                     <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <AnimatePresence mode="wait">
                       {validatingApiKey ? (
                         <motion.div
                           key="loading"
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.8 }}
                           className="flex items-center justify-center gap-3"
                         >
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span className="text-sm font-semibold">Vérification du code entreprise...</span>
                         </motion.div>
                       ) : (
                         <motion.span
                           key="button-text"
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 10 }}
                           className="flex items-center justify-center gap-2 text-sm font-semibold"
                         >
                           <span>Valider et continuer</span>
                           <ArrowRight className="w-4 h-4" />
                         </motion.span>
                       )}
                     </AnimatePresence>
                   </div>
                 </motion.button>
              </motion.form>
            )}

                         {/* Étape 2: Formulaire complet */}
             {step === 2 && (
               <motion.form
                 key="step2"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ duration: 0.3 }}
                 onSubmit={handleStep2Submit}
                 className="space-y-4"
                 autoComplete="off"
                 data-form-type="other"
                 data-lpignore="true"
               >
                 {/* Affichage des informations de l'entreprise */}
                 {partnerInfo && (
                   <>
                     <motion.div
                       initial={{ opacity: 0, y: -20, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       transition={{ type: "spring", stiffness: 300, damping: 25 }}
                       className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-500/30 rounded-xl backdrop-blur-sm"
                     >
                     <div className="flex items-start gap-4">
                                               {partnerInfo.logo_url && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white border border-white/30 shadow-lg flex items-center justify-center">
                            <img 
                              src={partnerInfo.logo_url} 
                              alt={`Logo ${partnerInfo.company_name}`}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-blue-200 font-semibold text-lg">
                             {partnerInfo.company_name}
                           </h3>
                           {partnerInfo.legal_status && (
                             <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                               {partnerInfo.legal_status}
                             </span>
                           )}
                         </div>
                         
                         <p className="text-blue-300/70 text-sm mb-2">
                           Inscription en cours pour cette entreprise
                         </p>
                         
                         <div className="flex flex-wrap gap-4 text-xs">
                           {partnerInfo.activity_domain && (
                             <div className="flex items-center gap-1">
                               <span className="text-blue-300/60">Domaine :</span>
                               <span className="text-blue-200 font-medium">{partnerInfo.activity_domain}</span>
                             </div>
                           )}
                           
                           {partnerInfo.status && (
                             <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${
                                 partnerInfo.status === 'approved' ? 'bg-green-400' : 
                                 partnerInfo.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                               }`}></div>
                               <span className="text-blue-300/60">Statut :</span>
                               <span className={`font-medium ${
                                 partnerInfo.status === 'approved' ? 'text-green-300' : 
                                 partnerInfo.status === 'pending' ? 'text-yellow-300' : 'text-red-300'
                               }`}>
                                 {partnerInfo.status === 'approved' ? 'Approuvé' : 
                                  partnerInfo.status === 'pending' ? 'En attente' : 'Rejeté'}
                               </span>
                             </div>
                           )}
                           
                           {partnerInfo.inscription_enabled !== undefined && (
                             <div className="flex items-center gap-1">
                               <span className="text-blue-300/60">Inscription :</span>
                               <span className={`font-medium ${partnerInfo.inscription_enabled ? 'text-green-300' : 'text-red-300'}`}>
                                 {partnerInfo.inscription_enabled ? 'Activée' : 'Désactivée'}
                               </span>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   </motion.div>
                   
                   {/* Message d'avertissement si l'inscription est désactivée */}
                   {partnerInfo.inscription_enabled === false && (
                     <motion.div
                       initial={{ opacity: 0, y: -10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       transition={{ type: "spring", stiffness: 300, damping: 25 }}
                       className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
                     >
                       <div className="flex items-center gap-3">
                         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                           <AlertCircle className="w-3 h-3 text-red-400" />
                         </div>
                         <div className="flex-1">
                           <h4 className="text-red-200 font-semibold text-sm mb-1">Inscription temporairement désactivée</h4>
                           <p className="text-red-300 text-sm">
                             L'inscription des employés est actuellement désactivée pour {partnerInfo.company_name}. 
                             Veuillez contacter l'administrateur de votre entreprise.
                           </p>
                         </div>
                       </div>
                     </motion.div>
                   )}
                   </>
                 )}
                                 {/* Section Informations Personnelles */}
                 <div className="space-y-6">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-8 h-8 rounded-full bg-[#FF671E]/20 flex items-center justify-center">
                       <User className="w-4 h-4 text-[#FF671E]" />
                     </div>
                     <h3 className="text-white font-semibold text-lg">Informations Personnelles</h3>
                   </div>
                   
                   {/* Grille principale avec espacement amélioré */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Nom */}
                  <motion.div 
                    className={`relative ${focusedInput === "nom" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <label className="block text-white/70 text-xs font-medium mb-0.5">Nom de Famille <span className="text-[#FF671E]">*</span></label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "nom" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Ex: Konaté, Diallo..."
                        value={formData.nom}
                                                 onChange={(e) => {
                           handleInputChange('nom', e.target.value);
                         }}
                        onFocus={() => setFocusedInput("nom")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className={`w-full bg-transparent border-b text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none ${
                          getFieldError('nom') ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#FF671E]'
                        }`}
                      />
                    </div>
                                         {getFieldError('nom') && (
                       <motion.div
                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                       >
                         <p className="text-red-300 text-xs flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           {getFieldError('nom')}
                         </p>
                       </motion.div>
                     )}
                  </motion.div>

                  {/* Prénom */}
                  <motion.div 
                    className={`relative ${focusedInput === "prenom" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <label className="block text-white/70 text-xs font-medium mb-0.5">Prénom <span className="text-[#FF671E]">*</span></label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "prenom" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Ex: Mamadou, Fatou..."
                        value={formData.prenom}
                                                 onChange={(e) => {
                           handleInputChange('prenom', e.target.value);
                         }}
                        onFocus={() => setFocusedInput("prenom")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className={`w-full bg-transparent border-b text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none ${
                          getFieldError('prenom') ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#FF671E]'
                        }`}
                      />
                    </div>
                                         {getFieldError('prenom') && (
                       <motion.div
                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                       >
                         <p className="text-red-300 text-xs flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           {getFieldError('prenom')}
                         </p>
                       </motion.div>
                     )}
                  </motion.div>

                  {/* Email */}
                  <motion.div 
                    className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <label className="block text-white/70 text-xs font-medium mb-0.5">Email Professionnel <span className="text-[#FF671E]">*</span></label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder="Ex: employe@entreprise.com"
                        value={formData.email}
                                                 onChange={(e) => {
                           handleInputChange('email', e.target.value);
                         }}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className={`w-full bg-transparent border-b text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none ${
                          getFieldError('email') ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#FF671E]'
                        }`}
                      />
                    </div>
                                         {getFieldError('email') && (
                       <motion.div
                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                       >
                         <p className="text-red-300 text-xs flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           {getFieldError('email')}
                         </p>
                       </motion.div>
                     )}
                  </motion.div>

                                     {/* Téléphone */}
                   <motion.div 
                     className={`relative ${focusedInput === "telephone" ? 'z-10' : ''}`}
                     whileFocus={{ scale: 1.02 }}
                     whileHover={{ scale: 1.01 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                   >
                     <PhoneInput
                       value={formData.telephone}
                       onChange={(value) => handleInputChange('telephone', value)}
                       onValidationChange={(isValid, formattedValue) => {
                         setPhoneValidation({ isValid, formattedValue });
                       }}
                       placeholder="+224 612 34 56 78"
                       label="Numéro de Téléphone"
                       required={true}
                       className="w-full bg-transparent border-b border-white/20 focus:border-[#FF671E] text-white placeholder:text-white/30 h-12 transition-all duration-300 focus:bg-white/5 rounded-none"
                       showValidation={false}
                     />
                     
                   </motion.div>

                                     {/* Genre */}
                   <motion.div 
                     className={`relative ${focusedInput === "genre" ? 'z-10' : ''}`}
                     whileFocus={{ scale: 1.02 }}
                     whileHover={{ scale: 1.01 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                   >
                     <label className="block text-white/70 text-xs font-medium mb-0.5">Genre <span className="text-[#FF671E]">*</span></label>
                     <div className="relative flex items-center overflow-hidden rounded-lg">
                       <Users className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                         focusedInput === "genre" ? 'text-white' : 'text-white/40'
                       }`} />
                       
                       <Select
                         value={formData.genre}
                         onChange={(e) => handleInputChange('genre', e.target.value as 'Homme' | 'Femme' | 'Autre')}
                         onFocus={() => setFocusedInput("genre")}
                         onBlur={() => setFocusedInput(null)}
                         required
                         className="w-full bg-transparent border-b border-white/20 focus:border-[#FF671E] text-white h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none appearance-none cursor-pointer"
                         style={{
                           backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                           backgroundPosition: 'right 0.5rem center',
                           backgroundRepeat: 'no-repeat',
                           backgroundSize: '1.5em 1.5em',
                           paddingRight: '2.5rem'
                         }}
                       >
                         <option value="">Sélectionner le genre</option>
                         <option value="Homme">Homme</option>
                         <option value="Femme">Femme</option>
                         <option value="Autre">Autre</option>
                       </Select>
                     </div>
                   </motion.div>

                   {/* Adresse */}
                   <motion.div 
                     className={`relative ${focusedInput === "adresse" ? 'z-10' : ''}`}
                     whileFocus={{ scale: 1.02 }}
                     whileHover={{ scale: 1.01 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                   >
                     <label className="block text-white/70 text-xs font-medium mb-0.5">Adresse Complète</label>
                     <div className="relative flex items-center overflow-hidden rounded-lg">
                       <MapPin className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                         focusedInput === "adresse" ? 'text-white' : 'text-white/40'
                       }`} />
                       
                       <Input
                         type="text"
                         placeholder="Ex: 123 Rue de la Paix, Conakry, Guinée"
                         value={formData.adresse}
                         onChange={(e) => {
                           handleInputChange('adresse', e.target.value);
                         }}
                         onFocus={() => setFocusedInput("adresse")}
                         onBlur={() => setFocusedInput(null)}
                         className={`w-full bg-transparent border-b text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none ${
                           getFieldError('adresse') ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#FF671E]'
                         }`}
                       />
                     </div>
                     {getFieldError('adresse') && (
                       <motion.div
                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                       >
                         <p className="text-red-300 text-xs flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           {getFieldError('adresse')}
                         </p>
                       </motion.div>
                     )}
                   </motion.div>
                  </div>
                </div>

               {/* Section Informations Professionnelles */}
               <div className="space-y-6 mt-8">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-[#FF671E]/20 flex items-center justify-center">
                     <Briefcase className="w-4 h-4 text-[#FF671E]" />
                   </div>
                   <h3 className="text-white font-semibold text-lg">Informations Professionnelles</h3>
                 </div>
                 
                 {/* Grille pour les informations professionnelles */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Poste */}
                  <motion.div 
                    className={`relative ${focusedInput === "poste" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <label className="block text-white/70 text-xs font-medium mb-0.5">Poste / Fonction <span className="text-[#FF671E]">*</span></label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Briefcase className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "poste" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Ex: Développeur, Comptable, Manager..."
                        value={formData.poste}
                                                 onChange={(e) => {
                           handleInputChange('poste', e.target.value);
                         }}
                        onFocus={() => setFocusedInput("poste")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className={`w-full bg-transparent border-b text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none ${
                          getFieldError('poste') ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#FF671E]'
                        }`}
                      />
                    </div>
                                         {getFieldError('poste') && (
                       <motion.div
                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                       >
                         <p className="text-red-300 text-xs flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           {getFieldError('poste')}
                         </p>
                       </motion.div>
                     )}
                  </motion.div>

                  {/* Matricule */}
                  <motion.div 
                    className={`relative ${focusedInput === "matricule" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                                          <label className="block text-white/70 text-xs font-medium mb-0.5">Numéro Matricule</label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Hash className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "matricule" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                                              <Input
                          type="text"
                          placeholder="Ex: EMP001, MAT2024... (optionnel)"
                          value={formData.matricule}
                          onChange={(e) => handleInputChange('matricule', e.target.value)}
                          onFocus={() => setFocusedInput("matricule")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-[#FF671E] text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none"
                        />
                    </div>
                  </motion.div>

                  {/* Type de contrat */}
                  <motion.div 
                    className={`relative ${focusedInput === "type_contrat" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                                          <label className="block text-white/70 text-xs font-medium mb-0.5">Type de Contrat <span className="text-[#FF671E]">*</span></label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Briefcase className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "type_contrat" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                                              <Select
                          value={formData.type_contrat}
                          onChange={(e) => handleInputChange('type_contrat', e.target.value as 'CDI' | 'CDD' | 'Consultant' | 'Stage' | 'Autre')}
                          onFocus={() => setFocusedInput("type_contrat")}
                          onBlur={() => setFocusedInput(null)}
                          required
                          className="w-full bg-transparent border-b border-white/20 focus:border-[#FF671E] text-white h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                        >
                        <option value="">Sélectionner le type de contrat</option>
                        <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                        <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Stage">Stage</option>
                        <option value="Autre">Autre</option>
                      </Select>
                    </div>
                  </motion.div>

                  {/* Salaire net */}
                  <motion.div 
                    className={`relative ${focusedInput === "salaire_net" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <label className="block text-white/70 text-xs font-medium mb-0.5">Salaire Net Mensuel <span className="text-[#FF671E]">*</span></label>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <DollarSign className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "salaire_net" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="number"
                        placeholder="Ex: 500000 (entre 50k et 50M GNF)"
                        value={formData.salaire_net}
                                                 onChange={(e) => {
                           const value = parseFloat(e.target.value) || 0;
                           handleInputChange('salaire_net', value);
                         }}
                        onFocus={() => setFocusedInput("salaire_net")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        min="50000"
                        max="50000000"
                        step="1000"
                        className={`w-full bg-transparent border-b text-white placeholder:text-white/30 h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none ${
                          getFieldError('salaire_net') ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#FF671E]'
                        }`}
                      />
                    </div>
                                         {getFieldError('salaire_net') && (
                       <motion.div
                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                       >
                         <p className="text-red-300 text-xs flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" />
                           {getFieldError('salaire_net')}
                         </p>
                       </motion.div>
                     )}
                  </motion.div>

                  

                                     {/* Date d'expiration - Affichage conditionnel pour CDD */}
                   {formData.type_contrat === 'CDD' && (
                     <motion.div 
                       className={`relative ${focusedInput === "date_expiration" ? 'z-10' : ''}`}
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: "auto" }}
                       exit={{ opacity: 0, height: 0 }}
                       transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     >
                       <label className="block text-white/70 text-xs font-medium mb-0.5">Date d'Expiration <span className="text-[#FF671E]">*</span></label>
                       <div className="relative flex items-center overflow-hidden rounded-lg">
                         <Calendar className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                           focusedInput === "date_expiration" ? 'text-white' : 'text-white/40'
                         }`} />
                         
                         <Input
                           type="date"
                           value={formData.date_expiration}
                           onChange={(e) => handleInputChange('date_expiration', e.target.value)}
                           onFocus={() => setFocusedInput("date_expiration")}
                           onBlur={() => setFocusedInput(null)}
                           required
                           min={formData.date_embauche || new Date().toISOString().split('T')[0]}
                           max="2100-12-31"
                           className="w-full bg-transparent border-b border-white/20 focus:border-[#FF671E] text-white h-12 transition-all duration-300 pl-10 focus:bg-white/5 rounded-none"
                         />
                       </div>
                                               {getFieldError('date_expiration') && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                          >
                            <p className="text-red-300 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {getFieldError('date_expiration')}
                            </p>
                          </motion.div>
                        )}
                     </motion.div>
                   )}
                  </div>
                </div>

                



                

                {/* Légende des champs obligatoires */}
                <div className="mt-4 text-center">
                  <p className="text-white/60 text-xs">
                    <span className="text-[#FF671E]">*</span> Champs obligatoires
                  </p>
                </div>

                {/* Séparateur */}
                <div className="border-t border-white/10 my-8"></div>

                                 {/* Messages d'erreur de validation */}
                 <AnimatePresence>
                   {Object.keys(validationErrors).length > 0 && (
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 20 }}
                       transition={{ type: "spring", stiffness: 300, damping: 25 }}
                       className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl backdrop-blur-sm"
                     >
                       <div className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                           <AlertCircle className="w-4 h-4 text-orange-400" />
                         </div>
                         <div className="flex-1">
                           <h4 className="text-orange-200 font-semibold text-sm mb-2">Veuillez corriger les erreurs suivantes :</h4>
                           <ul className="space-y-1">
                             {Object.entries(validationErrors).map(([field, error]) => (
                               <li key={field} className="text-orange-300 text-sm flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                 {error}
                               </li>
                             ))}
                           </ul>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {/* Boutons avec animations améliorées */}
                 <div className="flex gap-4 mt-8">
                   <motion.button
                     type="button"
                     onClick={goBackToStep1}
                     whileHover={{ 
                       scale: 1.02,
                       backgroundColor: "rgba(255, 255, 255, 0.15)",
                       boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                     }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     className="flex-1 bg-white/10 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm border border-white/10"
                   >
                     <ArrowLeft className="w-4 h-4" />
                     <span>Retour</span>
                   </motion.button>

                   <motion.button
                     whileHover={{ 
                       scale: 1.02,
                       boxShadow: "0 8px 25px rgba(255, 103, 30, 0.3)"
                     }}
                     whileTap={{ scale: 0.98 }}
                     type="submit"
                     disabled={loading || !isFormValid()}
                     className="flex-1 relative group/button"
                   >
                     <div className="relative overflow-hidden bg-gradient-to-r from-[#FF671E] to-[#FF8533] disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-[#FF671E]/20">
                       <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <AnimatePresence mode="wait">
                         {loading ? (
                           <motion.div
                             key="loading"
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.8 }}
                             className="flex items-center justify-center gap-2"
                           >
                             <Loader2 className="w-5 h-5 animate-spin" />
                             <span className="text-sm font-medium">Inscription en cours...</span>
                           </motion.div>
                         ) : (
                           <motion.span
                             key="button-text"
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: 10 }}
                             className="flex items-center justify-center gap-2 text-sm font-semibold"
                           >
                             <span>Finaliser l'inscription</span>
                             <ArrowRight className="w-4 h-4" />
                           </motion.span>
                         )}
                       </AnimatePresence>
                     </div>
                   </motion.button>
                 </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
