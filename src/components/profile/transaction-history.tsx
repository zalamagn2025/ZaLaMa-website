"use client";

import { useState, useRef } from "react";
import { 
  IconSearch, 
  IconFilter, 
  IconEye, 
  IconDownload, 
  IconX,
  IconClock,
  IconCheck,
  IconCircle,
  IconFileText,
  IconPhone,
  IconCalendar,
  IconCurrency,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { TransactionPDF } from "./TransactionPDF";
import { ImageRecu } from "./ImageRecu";
import { useEmployeeDemands } from "@/hooks/useEmployeeDemands";
import { SalaryAdvanceDemand } from "@/types/employee-demands";

// Interface pour les demandes d'avance (compatible avec les Edge Functions)
interface SalaryAdvanceRequest extends SalaryAdvanceDemand {
  employe?: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  partenaire?: {
    id: string;
    nom: string;
    adresse: string;
  };
  date_creation?: string;
  date_validation?: string;
  date_rejet?: string;
  motif_rejet?: string;
  salaire_disponible?: number;
  avance_disponible?: number;
}

// Fonction pour convertir les données API en format d'affichage
const convertApiRequestToDisplay = (apiRequest: SalaryAdvanceRequest) => {
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(/\//g, ' ');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMotifType = (type: string): string => {
    switch (type) {
      case "TRANSPORT": return "Transport";
      case "SANTE": return "Santé";
      case "EDUCATION": return "Éducation";
      case "LOGEMENT": return "Logement";
      case "ALIMENTATION": return "Alimentation";
      case "URGENCE_FAMILIALE": return "Urgence familiale";
      case "FRAIS_MEDICAUX": return "Frais médicaux";
      case "FRAIS_SCOLAIRES": return "Frais scolaires";
      case "REPARATION_VEHICULE": return "Réparation véhicule";
      case "FRAIS_DEUIL": return "Frais deuil";
      case "AUTRE": return "Autre";
      default: return type || "Non précisé";
    }
  };

  // Déterminer si c'est une avance échelonnée
  const isMultiMonth = apiRequest.num_installments && apiRequest.num_installments > 1;
  const numInstallments = apiRequest.num_installments || 1;
  const monthlyAmount = isMultiMonth 
    ? apiRequest.montant_demande / numInstallments
    : apiRequest.montant_demande;
  
  // Formater l'affichage du montant
  let amountDisplay = formatAmount(apiRequest.montant_demande);
  if (isMultiMonth) {
    amountDisplay = `${formatAmount(monthlyAmount)}/mois × ${numInstallments}`;
  }

  return {
    id: apiRequest.id,
    date: formatFullDate(apiRequest.date_creation || apiRequest.created_at),
    type: formatMotifType(apiRequest.type_motif),
    amount: formatAmount(apiRequest.montant_demande),
    amountDisplay: amountDisplay,
    isMultiMonth: isMultiMonth,
    numInstallments: numInstallments,
    monthlyAmount: formatAmount(monthlyAmount),
    totalAmount: formatAmount(apiRequest.montant_total),
    status: apiRequest.statut,
    motif: apiRequest.motif,
    numeroReception: apiRequest.numero_reception,
    fraisService: formatAmount(apiRequest.frais_service),
    salaireDisponible: apiRequest.salaire_disponible ? formatAmount(apiRequest.salaire_disponible) : "Non précisé",
    avanceDisponible: apiRequest.avance_disponible ? formatAmount(apiRequest.avance_disponible) : "Non précisé",
    dateValidation: apiRequest.date_validation ? formatFullDate(apiRequest.date_validation) : null,
    dateRejet: apiRequest.date_rejet ? formatFullDate(apiRequest.date_rejet) : null,
    motifRejet: apiRequest.motif_rejet || "Non précisé",
    telephone: apiRequest.employe?.telephone || "Non précisé",
    nomEmploye: apiRequest.employe ? `${apiRequest.employe.prenom} ${apiRequest.employe.nom}` : "Non précisé",
    nomPartenaire: apiRequest.partenaire?.nom || "Non précisé",
  };
};

// Icône du service d'avance sur salaire
const SalaryAdvanceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgb(255, 255, 255)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10"
    style={{ color: 'rgb(255, 255, 255)' }}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="7" y1="15" x2="9" y2="15" />
    <line x1="11" y1="15" x2="13" y2="15" />
  </svg>
);

// Animations
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  }),
  hover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

// Fonction pour générer et télécharger le PDF
const generateAndDownloadPDF = async (request: ReturnType<typeof convertApiRequestToDisplay>) => {
  try {
    const blob = await pdf(
      <TransactionPDF
        montant={request.amount}
        statut={request.status as "En attente" | "Approuvée" | "Rejetée"}
        date={request.date}
        typeMotif={request.type}
        fraisService={request.fraisService}
        dateValidation={request.dateValidation || undefined}
        motifRejet={request.motifRejet}
      />
    ).toBlob();
    saveAs(blob, `Demande_Avance_Salaire_${request.id}.pdf`);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    alert("Une erreur est survenue lors de la génération du PDF.");
  }
};

interface TransactionHistoryProps {
  user?: any; // Prop optionnelle pour compatibilité
}

export function TransactionHistory({ user }: TransactionHistoryProps = {}) {
  const { demands: apiRequests, isLoadingDemands: loading, demandsError: error } = useEmployeeDemands();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    period: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const requestsPerPage = 10;

  const allRequests = apiRequests.map(convertApiRequestToDisplay);

  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.numeroReception && request.numeroReception.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filters.type === "" ||
      request.type.toLowerCase().includes(filters.type.toLowerCase());

    const matchesStatus =
      filters.status === "" ||
      request.status.toLowerCase() === filters.status.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    switch (status.toLowerCase()) {
      case "en attente":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "approuvée":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "rejetée":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <IconClock className="w-3 h-3" />;
    switch (status.toLowerCase()) {
      case "en attente":
        return <IconClock className="w-3 h-3" />;
      case "approuvée":
        return <IconCheck className="w-3 h-3" />;
      case "rejetée":
        return <IconX className="w-3 h-3" />;
      default:
        return <IconClock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return "Inconnu";
    switch (status.toLowerCase()) {
      case "en attente":
        return "En attente";
      case "approuvée":
        return "Approuvée";
      case "rejetée":
        return "Rejetée";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF671E] mr-3"></div>
          <span style={{ color: 'rgb(255, 255, 255)' }}>Chargement des demandes...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    const isAuthError = error.includes('Token') || error.includes('authentification') || error.includes('connecter');
    
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCircle className="w-6 h-6" style={{ color: 'rgb(248, 113, 113)' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>
            {isAuthError ? 'Authentification requise' : 'Erreur de chargement'}
          </h3>
          <p style={{ color: 'rgb(156, 163, 175)' }} className="mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            {isAuthError ? (
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'rgb(255, 103, 30)', color: 'rgb(255, 255, 255)' }}
              >
                Se connecter
              </button>
            ) : (
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'rgb(255, 103, 30)', color: 'rgb(255, 255, 255)' }}
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SalaryAdvanceIcon />
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'rgb(255, 255, 255)' }}>Demandes d'avance sur salaire</h2>
              <p style={{ color: 'rgb(156, 163, 175)' }} className="text-sm">
                {filteredRequests.length} demande{filteredRequests.length !== 1 ? "s" : ""} trouvée{filteredRequests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgb(255, 255, 255)',
                '--tw-ring-color': 'rgb(255, 142, 83)',
                '--tw-placeholder-color': 'rgb(156, 163, 175)'
              } as any}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 flex items-center gap-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
          >
            <IconFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Type de motif",
                    name: "type",
                    options: [
                      { value: "", label: "Tous" },
                      { value: "transport", label: "Transport" },
                      { value: "sante", label: "Santé" },
                      { value: "education", label: "Éducation" },
                      { value: "logement", label: "Logement" },
                      { value: "alimentation", label: "Alimentation" },
                      { value: "urgence", label: "Urgence" },
                    ],
                  },
                  {
                    label: "Statut",
                    name: "status",
                    options: [
                      { value: "", label: "Tous" },
                      { value: "en attente", label: "En attente" },
                      { value: "approuvée", label: "Approuvée" },
                      { value: "rejetée", label: "Rejetée" },
                    ],
                  },
                  {
                    label: "Période",
                    name: "period",
                    options: [
                      { value: "", label: "Toutes les dates" },
                      { value: "month", label: "Ce mois" },
                      { value: "quarter", label: "Ce trimestre" },
                      { value: "year", label: "Cette année" },
                    ],
                  },
                ].map((filter, index) => (
                  <motion.div
                    key={filter.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {filter.label}
                    </label>
                    <select
                      className="block w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white focus:outline-none focus:ring-2 shadow-sm transition-all duration-300"
                      style={{ 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgb(255, 255, 255)',
                        '--tw-ring-color': 'rgb(255, 142, 83)'
                      } as any}
                      value={filters[filter.name as keyof typeof filters]}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          [filter.name]: e.target.value,
                        });
                        setCurrentPage(1);
                      }}
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {currentRequests.length > 0 ? (
          currentRequests.map((request, index) => (
            <motion.div
              key={`${request.id}-${index}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-[#010D3E]/50 backdrop-blur-md rounded-xl border overflow-hidden shadow-lg"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, rgb(255, 103, 30), rgb(255, 142, 83))' }}>
                      <SalaryAdvanceIcon />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg" style={{ color: 'rgb(255, 255, 255)' }}>
                          Avance sur salaire
                        </h3>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(156, 163, 175)' }}>
                          <IconPhone className="w-3 h-3" />
                          <span>{request.telephone}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <IconCurrency className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Montant :</span>
                        <span className="font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>
                          {request.isMultiMonth ? (
                            <>{request.amount} <span className="text-xs opacity-75">({request.monthlyAmount}/mois sur {request.numInstallments} mois)</span></>
                          ) : request.amount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Le {request.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRequest(request.id)}
                        className="px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
                      >
                        <IconEye className="w-4 h-4" />
                        Voir détail
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 bg-[#010D3E]/30 backdrop-blur-md rounded-xl border"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <IconFileText className="w-8 h-8" style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
            </div>
            <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Aucune demande d'avance trouvée</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Vous n'avez pas encore soumis de demande d'avance</p>
          </motion.div>
        )}
      </motion.div>

      {filteredRequests.length > requestsPerPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-center sm:text-left" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Affichage de <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{indexOfFirstRequest + 1}</span> à{" "}
            <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{Math.min(indexOfLastRequest, filteredRequests.length)}</span>{" "}
            sur <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{filteredRequests.length}</span> demandes
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
            >
              Précédent
            </motion.button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "text-white"
                        : "bg-[#010D3E]/50 border text-white/60 hover:bg-[#010D3E]/70 hover:text-white"
                    }`}
                    style={currentPage === page 
                      ? { background: 'linear-gradient(to right, rgb(255, 103, 30), rgb(255, 142, 83))' }
                      : { borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
            >
              Suivant
            </motion.button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010D3E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative mx-auto w-full max-w-lg max-h-[90vh] bg-[#010D3E] rounded-2xl shadow-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedRequest(null)}
                className="absolute top-6 right-6 p-2 rounded-lg transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                <IconX className="w-7 h-7" />
              </motion.button>
              <div ref={modalRef}>
                <div className="flex flex-col w-full items-center mb-4">
                  <div className="w-32 h-32 mb-2 flex items-center justify-center">
                    <img src="/images/zalama-logo.svg" alt="ZaLaMa Logo" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <IconFileText className="w-8 h-8" style={{ color: 'rgb(251, 146, 60)' }} />
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'rgb(255, 255, 255)' }}>Détails de la demande</h3>
                  </div>
                </div>

                {selectedRequest && (() => {
                  const request = allRequests.find((r) => r.id === selectedRequest)!;
                  let fieldsToShow: Array<{ label: string; value: string; type?: string }> = [];
                  if (request.status === "Rejetée") {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      ...(request.isMultiMonth ? [
                        { label: "Paiement échelonné", value: `${request.monthlyAmount}/mois sur ${request.numInstallments} mois`, type: "info" }
                      ] : []),
                      { label: "Motif de rejet", value: request.motifRejet },
                      { label: "Expéditeur", value: "LengoPay" },
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.date, type: "date" },
                    ];
                  } else if (request.status === "En attente") {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      ...(request.isMultiMonth ? [
                        { label: "Paiement échelonné", value: `${request.monthlyAmount}/mois sur ${request.numInstallments} mois`, type: "info" }
                      ] : []),
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.date, type: "date" },
                    ];
                  } else if (request.status === "Approuvée") {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      ...(request.isMultiMonth ? [
                        { label: "Paiement échelonné", value: `${request.monthlyAmount}/mois sur ${request.numInstallments} mois`, type: "info" }
                      ] : []),
                      { label: "Frais de service", value: `-${request.fraisService}`, type: "fees" },
                      { label: "Montant reçu", value: `${(parseInt((request.amount || "0").replace(/[^0-9]/g, ""), 10) - parseInt((request.fraisService || "0").replace(/[^0-9]/g, ""), 10)).toLocaleString("fr-FR")} GNF`, type: "total" },
                      { label: "Expéditeur", value: "LengoPay" },
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.date, type: "date" },
                      { label: "Date de validation", value: request.dateValidation || request.date, type: "date" },
                      { label: "Référence", value: request.numeroReception || `REF-${request.id.slice(-8)}`, type: "ref" },
                    ];
                  } else {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      ...(request.isMultiMonth ? [
                        { label: "Paiement échelonné", value: `${request.monthlyAmount}/mois sur ${request.numInstallments} mois`, type: "info" }
                      ] : []),
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.date, type: "date" },
                    ];
                  }
                  return (
                    <div className="w-full max-w-2xl mx-auto rounded-2xl p-0 md:p-0 flex flex-col" style={{ minHeight: "320px" }}>
                      <div className={`${request.status === "Approuvée" ? "overflow-y-auto max-h-[60vh]" : ""} flex-1 flex flex-col divide-y`} style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        {fieldsToShow.map((item, subIndex) => (
                          <div key={subIndex} className="flex items-center justify-between py-4 px-2 md:px-4">
                            <span className="text-base md:text-lg font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {item.label}
                            </span>
                            <span className={`text-right text-base md:text-lg font-bold ${
                              item.type === "amount" || item.type === "total"
                                ? "text-orange-400"
                                : item.type === "fees"
                                  ? "text-red-400"
                                  : item.type === "info"
                                    ? "text-blue-400"
                                    : item.type === "ref" || item.type === "date"
                                      ? "text-white"
                                      : item.type === "status"
                                        ? "text-blue-300"
                                        : "text-white"
                            }`} style={{
                              color: item.type === "amount" || item.type === "total"
                                ? 'rgb(251, 146, 60)'
                                : item.type === "fees"
                                  ? 'rgb(248, 113, 113)'
                                  : item.type === "info"
                                    ? 'rgb(96, 165, 250)'
                                    : item.type === "ref" || item.type === "date"
                                      ? 'rgb(255, 255, 255)'
                                      : item.type === "status"
                                        ? 'rgb(147, 197, 253)'
                                        : 'rgb(255, 255, 255)'
                            }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-8 pt-8 pb-2 sticky bottom-0" style={{ backgroundColor: 'rgb(1, 13, 62)' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => generateAndDownloadPDF(request)}
                          className="w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
                          style={{ background: 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(29, 78, 216))' }}
                        >
                          <IconDownload className="w-7 h-7" style={{ color: 'rgb(255, 255, 255)' }} />
                        </motion.button>
                        <ImageRecu 
                          request={request}
                          modalRef={modalRef}
                          onClose={() => setSelectedRequest(null)}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}