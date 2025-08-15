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
  Users
} from "lucide-react";
import { useRegisterEmployee, EmployeeRegistrationData } from "@/hooks/useRegisterEmployee";

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
  const [partnerInfo, setPartnerInfo] = useState<{ company_name: string } | null>(null);
  
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
        console.log('✅ Validation réussie pour:', result.partner_name);
        setPartnerInfo({ company_name: result.partner_name });
        setApiKeyError(null);
        return true;
      } else {
        console.log('❌ Validation échouée:', result.error);
        setApiKeyError(result.error || "Code entreprise invalide");
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

  const validateStep2 = () => {
    const required = [
      formData.nom, formData.prenom, formData.email, formData.telephone,
      formData.adresse, formData.poste, formData.matricule, formData.salaire_net,
      formData.date_embauche, formData.date_expiration
    ];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+224|00224)?[6-7][0-9]{8}$/;
    
    return (
      required.every(field => field && field.toString().trim().length > 0) &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.telephone.replace(/\s+/g, '')) &&
      formData.salaire_net > 0
    );
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
    if (validateStep2()) {
      await registerEmployee(formData);
    }
  };

  const handleInputChange = (field: keyof EmployeeRegistrationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          className="w-full max-w-md relative z-10"
        >
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.05] shadow-2xl">
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
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/80 text-sm">
                  <span className="font-semibold">Entreprise :</span> {data.partner_name}
                </p>
                <p className="text-white/80 text-sm mt-1">
                  <span className="font-semibold">ID Employé :</span> {data.employee_id}
                </p>
              </div>
              
              <p className="text-white/60 text-xs">
                Vous allez être redirigé vers la page de connexion...
              </p>
              
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
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/[0.05] shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
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
          <div className="mb-6">
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

          {/* Messages d'erreur */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
              >
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <p className="text-red-200 text-sm">{error}</p>
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
                        className={`w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10 ${
                          apiKeyError ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Message d'erreur pour la clé API */}
                <AnimatePresence>
                  {apiKeyError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                      <p className="text-red-200 text-sm">{apiKeyError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message de succès pour la clé API */}
                <AnimatePresence>
                  {partnerInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <p className="text-green-200 text-sm">
                        Code valide pour : <span className="font-semibold">{partnerInfo.company_name}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!validateStep1() || validatingApiKey}
                  className="w-full relative group/button mt-6"
                >
                  <div className="relative overflow-hidden bg-[#FF671E] disabled:bg-gray-600 disabled:opacity-50 text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {validatingApiKey ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">Vérification...</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Continuer
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <motion.div 
                    className={`relative ${focusedInput === "nom" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "nom" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Nom"
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        onFocus={() => setFocusedInput("nom")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Prénom */}
                  <motion.div 
                    className={`relative ${focusedInput === "prenom" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "prenom" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Prénom"
                        value={formData.prenom}
                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                        onFocus={() => setFocusedInput("prenom")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div 
                    className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder="Email professionnel"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Téléphone */}
                  <motion.div 
                    className={`relative ${focusedInput === "telephone" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Phone className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "telephone" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="tel"
                        placeholder="Téléphone (+224...)"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        onFocus={() => setFocusedInput("telephone")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Genre */}
                  <motion.div 
                    className={`relative ${focusedInput === "genre" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
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
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      >
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Autre">Autre</option>
                      </Select>
                    </div>
                  </motion.div>

                  {/* Poste */}
                  <motion.div 
                    className={`relative ${focusedInput === "poste" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Briefcase className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "poste" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Poste"
                        value={formData.poste}
                        onChange={(e) => handleInputChange('poste', e.target.value)}
                        onFocus={() => setFocusedInput("poste")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Matricule */}
                  <motion.div 
                    className={`relative ${focusedInput === "matricule" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Hash className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "matricule" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="text"
                        placeholder="Matricule"
                        value={formData.matricule}
                        onChange={(e) => handleInputChange('matricule', e.target.value)}
                        onFocus={() => setFocusedInput("matricule")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
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
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      >
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
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
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <DollarSign className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "salaire_net" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="number"
                        placeholder="Salaire net (GNF)"
                        value={formData.salaire_net}
                        onChange={(e) => handleInputChange('salaire_net', parseFloat(e.target.value) || 0)}
                        onFocus={() => setFocusedInput("salaire_net")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        min="0"
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Date d'embauche */}
                  <motion.div 
                    className={`relative ${focusedInput === "date_embauche" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Calendar className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "date_embauche" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="date"
                        value={formData.date_embauche}
                        onChange={(e) => handleInputChange('date_embauche', e.target.value)}
                        onFocus={() => setFocusedInput("date_embauche")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Date d'expiration */}
                  <motion.div 
                    className={`relative ${focusedInput === "date_expiration" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
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
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Adresse (pleine largeur) */}
                <motion.div 
                  className={`relative ${focusedInput === "adresse" ? 'z-10' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="relative flex items-center overflow-hidden rounded-lg">
                    <MapPin className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                      focusedInput === "adresse" ? 'text-white' : 'text-white/40'
                    }`} />
                    
                    <Input
                      type="text"
                      placeholder="Adresse complète"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                      onFocus={() => setFocusedInput("adresse")}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                    />
                  </div>
                </motion.div>

                {/* Boutons */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={goBackToStep1}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-white/10 text-white font-medium py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !validateStep2()}
                    className="flex-1 relative group/button"
                  >
                    <div className="relative overflow-hidden bg-[#FF671E] disabled:bg-gray-600 disabled:opacity-50 text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1 text-sm font-medium"
                          >
                            S'inscrire
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
