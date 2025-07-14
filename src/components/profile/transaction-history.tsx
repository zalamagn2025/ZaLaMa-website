"use client";

import { useState, useRef, useEffect } from "react";
import { 
  IconSearch, 
  IconFilter, 
  IconEye, 
  IconDownload, 
  IconShare, 
  IconX,
  IconChevronRight,
  IconClock,
  IconCheck,
  IconX as IconClose,
  IconDotsVertical,
  IconAlertCircle,
  IconCircle,
  IconFileText,
  IconPhone,
  IconCalendar,
  IconCurrency,
  IconUser
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { SalaryAdvanceReceipt } from "./SalaryAdvanceReceipt";
import { useReceiptExport } from "./useReceiptExport";
import { generateSalaryAdvancePDF } from "@/utils/generateSalaryAdvancePDF";

// Interface pour les demandes d'avance
interface SalaryAdvanceRequest {
  id: string;
  employe_id: string;
  partenaire_id: string;
  montant_demande: number;
  type_motif: string;
  motif: string;
  numero_reception?: string;
  frais_service: number;
  montant_total: number;
  salaire_disponible?: number;
  avance_disponible?: number;
  statut: 'En attente' | 'Validé' | 'Rejeté' | 'Annulé';
  date_creation: string;
  date_validation?: string;
  date_rejet?: string;
  motif_rejet?: string;
  created_at: string;
  updated_at: string;
  // Relations avec les tables employes et partenaires
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
}

// Hook pour récupérer les demandes d'avance
function useSalaryAdvanceRequests() {
  const [requests, setRequests] = useState<SalaryAdvanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/salary-advance/request');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes');
      }
      
      const data = await response.json();
      console.log('📋 Réponse API:', data);
      
      setRequests(data.data || []);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests
  };
}

// Fonction pour convertir les données API en format d'affichage
const convertApiRequestToDisplay = (apiRequest: SalaryAdvanceRequest) => {
  // Formater la date complète
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formater le type de motif
  const formatMotifType = (type: string): string => {
    switch (type) {
      case 'TRANSPORT':
        return 'Transport';
      case 'SANTE':
        return 'Santé';
      case 'EDUCATION':
        return 'Éducation';
      case 'LOGEMENT':
        return 'Logement';
      case 'ALIMENTATION':
        return 'Alimentation';
      case 'URGENCE_FAMILIALE':
        return 'Urgence familiale';
      case 'FRAIS_MEDICAUX':
        return 'Frais médicaux';
      case 'FRAIS_SCOLAIRES':
        return 'Frais scolaires';
      case 'REPARATION_VEHICULE':
        return 'Réparation véhicule';
      case 'FRAIS_DEUIL':
        return 'Frais deuil';
      case 'AUTRE':
        return 'Autre';
      default:
        return type;
    }
  };

  return {
    id: apiRequest.id,
    date: formatFullDate(apiRequest.date_creation),
    type: formatMotifType(apiRequest.type_motif),
    amount: formatAmount(apiRequest.montant_demande),
    totalAmount: formatAmount(apiRequest.montant_total),
    status: apiRequest.statut,
    motif: apiRequest.motif,
    numeroReception: apiRequest.numero_reception,
    fraisService: formatAmount(apiRequest.frais_service),
    salaireDisponible: apiRequest.salaire_disponible ? formatAmount(apiRequest.salaire_disponible) : 'N/A',
    avanceDisponible: apiRequest.avance_disponible ? formatAmount(apiRequest.avance_disponible) : 'N/A',
    dateValidation: apiRequest.date_validation ? formatFullDate(apiRequest.date_validation) : null,
    dateRejet: apiRequest.date_rejet ? formatFullDate(apiRequest.date_rejet) : null,
    motifRejet: apiRequest.motif_rejet,
    // Informations de l'employé
    telephone: apiRequest.numero_reception || 'N/A',
    nomEmploye: apiRequest.employe ? `${apiRequest.employe.prenom} ${apiRequest.employe.nom}` : 'N/A',
    // Informations du partenaire
    nomPartenaire: apiRequest.partenaire?.nom || 'N/A',
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
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-white"
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
      type: "spring",
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
      type: "spring",
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

const sharePopupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

// Utilitaire pour formater le montant
function formatAmount(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
// Utilitaire pour formater la date
function formatFullDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function TransactionHistory() {
  const { requests: apiRequests, loading, error } = useSalaryAdvanceRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [shareRequest, setShareRequest] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    period: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const sharePopupRef = useRef<HTMLDivElement>(null);

  // Ajout pour la génération de reçu
  const { receiptRef, downloadReceipt, shareReceipt } = useReceiptExport();

  // Convertir les demandes API en format d'affichage
  const allRequests = apiRequests.map(convertApiRequestToDisplay);

  // Filtrer les demandes
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

  // Pagination
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

  // Gestion du clic en dehors du popup de partage
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sharePopupRef.current &&
        !sharePopupRef.current.contains(event.target as Node)
      ) {
        setShareRequest(null);
      }
    };

    if (shareRequest) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareRequest]);

  // Fonctions utilitaires pour les statuts
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    switch (status.toLowerCase()) {
      case "en attente":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "validé":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "rejeté":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "annulé":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <IconClock className="w-3 h-3" />;
    switch (status.toLowerCase()) {
      case "en attente":
        return <IconClock className="w-3 h-3" />;
      case "validé":
        return <IconCheck className="w-3 h-3" />;
      case "rejeté":
        return <IconX className="w-3 h-3" />;
      case "annulé":
        return <IconCircle className="w-3 h-3" />;
      default:
        return <IconClock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return "Inconnu";
    switch (status.toLowerCase()) {
      case "en attente":
        return "En attente";
      case "validé":
        return "Validé";
      case "rejeté":
        return "Rejeté";
      case "annulé":
        return "Annulé";
      default:
        return status;
    }
  };

  // Fonction de partage
  const shareRequestDetails = (requestId: string) => {
    const request = allRequests.find((r) => r.id === requestId);
    if (!request) return null;

    const text = `Demande d'avance sur salaire - ${request.type} - ${request.amount} - Statut: ${request.status}`;
    const url = `${window.location.origin}/profile`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };
  };

  // Ajout pour la génération de PDF
  // const handleDownloadPDF = async (request: SalaryAdvanceRequest) => {
  //   try {
  //     const montant = formatAmount(request.montant_demande);
  //     const date = formatFullDate(request.date_creation);
  //     // On accepte tous les statuts, mais on mappe "Annulé" en "Rejeté" pour le PDF
  //     const statut = request.statut === 'Annulé' ? 'Rejeté' : request.statut;
  //     const blob = await generateSalaryAdvancePDF({
  //       id: request.id,
  //       montant,
  //       statut,
  //       date,
  //       telephone: request.numero_reception || 'N/A',
  //       reference: request.numero_reception || `REF-${request.id.slice(-8)}`,
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `recu-zalama-${request.id}.pdf`;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //     alert("PDF téléchargé !");
  //   } catch (err) {
  //     alert("Erreur lors de la génération du PDF.");
  //   }
  // };

  // const handleSharePDF = async (request: SalaryAdvanceRequest) => {
  //   try {
  //     const montant = formatAmount(request.montant_demande);
  //     const date = formatFullDate(request.date_creation);
  //     const statut = request.statut === 'Annulé' ? 'Rejeté' : request.statut;
  //     const blob = await generateSalaryAdvancePDF({
  //       id: request.id,
  //       montant,
  //       statut,
  //       date,
  //       telephone: request.numero_reception || 'N/A',
  //       reference: request.numero_reception || `REF-${request.id.slice(-8)}`,
  //     });
  //     const file = new File([blob], `recu-zalama-${request.id}.pdf`, { type: "application/pdf" });
  //     if (navigator.canShare && navigator.canShare({ files: [file] })) {
  //       await navigator.share({
  //         files: [file],
  //         title: "Reçu ZaLaMa",
  //         text: "Voici mon reçu d'avance sur salaire généré par ZaLaMa.",
  //       });
  //     } else {
  //       // Fallback : téléchargement
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `recu-zalama-${request.id}.pdf`;
  //       a.click();
  //       URL.revokeObjectURL(url);
  //       alert("PDF téléchargé (partage non supporté sur ce navigateur)");
  //     }
  //   } catch (err) {
  //     alert("Erreur lors du partage du PDF.");
  //   }
  // };

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
          <span className="text-white">Chargement des demandes...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconAlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Erreur de chargement</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF671E] text-white rounded-lg hover:bg-[#FF8E53] transition-colors"
          >
            Réessayer
          </button>
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
      {/* Header avec titre et statistiques */}
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
              <h2 className="text-xl font-bold text-white">Demandes d'avance sur salaire</h2>
              <p className="text-gray-400 text-sm">
                {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} trouvée{filteredRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8E53] focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#010D3E]/70 transition-all duration-300 flex items-center gap-2"
          >
            <IconFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </motion.button>
        </div>

        {/* Filtres avancés */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-white/10"
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
                      { value: "validé", label: "Validée" },
                      { value: "rejeté", label: "Rejetée" },
                      { value: "annulé", label: "Annulée" },
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
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      {filter.label}
                    </label>
                    <select
                      className="block w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF8E53] focus:border-transparent shadow-sm transition-all duration-300"
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

      {/* Liste des demandes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {apiRequests.slice(indexOfFirstRequest, indexOfLastRequest).length > 0 ? (
          apiRequests.slice(indexOfFirstRequest, indexOfLastRequest).map((request, index) => (
            <motion.div
              key={`${request.id}-${index}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-[#010D3E]/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg"
            >
              {/* Contenu principal de la carte */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icône du service */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-xl flex items-center justify-center shadow-lg">
                      <SalaryAdvanceIcon />
                    </div>
                  </div>
                  {/* Informations principales */}
                  <div className="flex-1 min-w-0">
                    {/* Titre et statut */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg mb-1">
                          Avance sur salaire
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <IconPhone className="w-3 h-3" />
                          <span>{request.numero_reception || 'N/A'}</span>
                        </div>
                      </div>
                      {/* Badge de statut */}
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full border ${getStatusColor(request.statut)}`}
                      >
                        {getStatusIcon(request.statut)}
                        {getStatusText(request.statut)}
                      </span>
                    </div>
                    {/* Montant et date */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <IconCurrency className="w-4 h-4 text-gray-400" />
                        <span className="text-white/80 text-sm">Montant demandé :</span>
                        <span className="text-white font-semibold">{formatAmount(request.montant_demande)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4 text-gray-400" />
                        <span className="text-white/80 text-sm">Le {formatFullDate(request.date_creation)}</span>
                      </div>
                    </div>
                    {/* Boutons d'action */}
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRequest(request.id)}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium flex items-center gap-2"
                      >
                        <IconEye className="w-4 h-4" />
                        Voir détail
                      </motion.button>
                      {/* <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        // onClick={() => handleDownloadPDF(request)}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium flex items-center gap-2"
                      >
                        <IconDownload className="w-4 h-4" />
                        Télécharger PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        // onClick={() => handleSharePDF(request)}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium flex items-center gap-2"
                      >
                        <IconShare className="w-4 h-4" />
                        Partager PDF
                      </motion.button> */}
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
            className="text-center py-12 bg-[#010D3E]/30 backdrop-blur-md rounded-xl border border-[#1A3A8F]"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconFileText className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 text-lg">Aucune demande d'avance trouvée</p>
            <p className="text-white/40 text-sm mt-2">Vous n'avez pas encore soumis de demande d'avance</p>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination - Mobile Optimized */}
      {filteredRequests.length > requestsPerPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-white/60 text-center sm:text-left">
            Affichage de <span className="font-medium text-white">{indexOfFirstRequest + 1}</span> à{" "}
            <span className="font-medium text-white">
              {Math.min(indexOfLastRequest, filteredRequests.length)}
            </span>{" "}
            sur <span className="font-medium text-white">{filteredRequests.length}</span> demandes
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
                        ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white"
                        : "bg-[#010D3E]/50 border border-white/10 text-white/60 hover:bg-[#010D3E]/70 hover:text-white"
                    }`}
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
              className={`px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Suivant
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Modale de détails - Scrollable et responsive */}
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
              className="relative mx-auto w-full max-w-lg max-h-[90vh] bg-[#010D3E] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la modale */}
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <SalaryAdvanceIcon />
                  <h3 className="text-xl font-bold text-white">Demande d'Avance sur salaire</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRequest(null)}
                  className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <IconX className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                {selectedRequest && (
                  <div className="space-y-4">
                    {(() => {
                      const request = allRequests.find((r) => r.id === selectedRequest)!;
                      return (
                        <>
                          {[
                            { label: "Type de motif", value: request.type },
                            { label: "Statut", value: request.status },
                            { label: "Montant demandé", value: request.amount },
                            { label: "Frais de service", value: `-${request.fraisService}` },
                            { label: "Montant reçu", value: `${(parseInt((request.amount || "0").toString().replace(/\s/g, ""), 10) -parseInt((request.fraisService || "0").toString().replace(/\s/g, ""), 10)).toLocaleString('fr-FR')} GNF`},
                            { label: "Expéditeur", value: "LengoPay" },
                            { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                            // { label: "Motif", value: request.motif },
                            // { label: "Salaire disponible", value: request.salaireDisponible },
                            // { label: "Avance disponible", value: request.avanceDisponible },
                            // { label: "Date de création", value: request.date },
                            { label: "Date", value: request.dateValidation || "N/A" },
                            // { label: "Date de rejet", value: request.dateRejet || "N/A" },
                            // { label: "Motif de rejet", value: request.motifRejet || "N/A" },
                            // { label: "Nom de l'employé", value: request.nomEmploye },
                            // { label: "Téléphone de l'employé", value: request.telephone },
                            // { label: "Nom du partenaire", value: request.nomPartenaire },
                          ].map((item, subIndex) => (
                            <div key={subIndex} className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">{item.label} :</span>
                              <span className="text-white font-medium">{item.value}</span>
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}