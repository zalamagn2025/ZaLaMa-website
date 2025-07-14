"use client";

import { useState, useRef, useEffect } from "react";
import { handleDownloadPDF, handleSharePDF } from "./useReceiptExport"; // Ajout handlers PDF
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
  IconCheckCircle,
  IconXCircle
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";

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
      setRequests(data.demandes || []);
      
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
  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
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
    date: formatDate(apiRequest.date_creation),
    type: formatMotifType(apiRequest.type_motif),
    amount: formatAmount(apiRequest.montant_demande),
    totalAmount: formatAmount(apiRequest.montant_total),
    status: apiRequest.statut,
    motif: apiRequest.motif,
    numeroReception: apiRequest.numero_reception,
    fraisService: formatAmount(apiRequest.frais_service),
    salaireDisponible: apiRequest.salaire_disponible ? formatAmount(apiRequest.salaire_disponible) : 'N/A',
    avanceDisponible: apiRequest.avance_disponible ? formatAmount(apiRequest.avance_disponible) : 'N/A',
    dateValidation: apiRequest.date_validation ? formatDate(apiRequest.date_validation) : null,
    dateRejet: apiRequest.date_rejet ? formatDate(apiRequest.date_rejet) : null,
    motifRejet: apiRequest.motif_rejet,
  };
};

export function SalaryAdvanceHistory() {
  const { requests: apiRequests, loading, error } = useSalaryAdvanceRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [shareRequest, setShareRequest] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    period: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const sharePopupRef = useRef<HTMLDivElement>(null);

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
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Gestion du clic en dehors du popup de partage
  const handleClickOutside = (event: MouseEvent) => {
    if (sharePopupRef.current && !sharePopupRef.current.contains(event.target as Node)) {
      setShareRequest(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Afficher l'état de chargement
  if (loading) {
    return (
      <div className="bg-[#010D3E]/50 backdrop-blur-md rounded-2xl p-6 border border-[#1A3A8F]">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#FF671E] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60">Chargement des demandes d'avance...</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher l'erreur
  if (error) {
    return (
      <div className="bg-[#010D3E]/50 backdrop-blur-md rounded-2xl p-6 border border-[#1A3A8F]">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <IconX className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-red-400 text-center">Erreur lors du chargement des demandes</p>
            <p className="text-white/40 text-sm text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Styles et animations
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Validé":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "En attente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rejeté":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Annulé":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Validé":
        return <IconCheckCircle className="w-4 h-4" />;
      case "En attente":
        return <IconClock className="w-4 h-4" />;
      case "Rejeté":
        return <IconXCircle className="w-4 h-4" />;
      case "Annulé":
        return <IconX className="w-4 h-4" />;
      default:
        return <IconClock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Validé":
        return "Validée";
      case "En attente":
        return "En attente";
      case "Rejeté":
        return "Rejetée";
      case "Annulé":
        return "Annulée";
      default:
        return status;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: i * 0.05 },
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const sharePopupVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const shareRequestDetails = (requestId: string) => {
    const request = allRequests.find((r) => r.id === requestId);
    if (!request) return null;

    const text = `Demande d'avance ZaLaMa - ${request.type} - ${request.amount} - Statut: ${request.status}`;
    const encodedText = encodeURIComponent(text);

    return {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(window.location.href)}`,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#010D3E] p-4 sm:p-6 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header Section - Mobile First */}
      <div className="flex flex-col gap-4 mb-6">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-bold text-white"
        >
          Historique des Demandes d'Avance
        </motion.h2>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex-1"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF8E53] focus:border-transparent shadow-sm transition-all duration-300"
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#010D3E]/70 transition-all duration-300 flex items-center gap-2"
          >
            <IconFilter className="h-5 w-5" />
            <span className="hidden sm:inline">Filtres</span>
          </motion.button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-4 border border-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Type",
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
      </div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {currentRequests.length > 0 ? (
          currentRequests.map((request, index) => (
            <motion.div
              key={`${request.id}-${index}`}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              className="bg-[#010D3E]/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg"
            >
              {/* Main Card Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {/* ZaLaMa Logo */}
                      <div className="w-8 h-8 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">ZL</span>
                      </div>
                      
                      {/* Request Type */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">
                          {request.type}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {request.numeroReception || `REF-${request.id.slice(-8)}`}
                        </p>
                      </div>
                    </div>

                    {/* Amount and Date */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-white">
                        {request.amount}
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm">
                          {request.date}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {/* Expand/Collapse Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setExpandedRequest(
                        expandedRequest === request.id ? null : request.id
                      )}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <IconChevronRight 
                        className={`w-4 h-4 text-white/60 transition-transform ${
                          expandedRequest === request.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </motion.button>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRequest(request.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Voir détails"
                      >
                        <IconEye className="h-4 w-4 text-white/60" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownloadPDF({
                          id: request.id,
                          amount: request.amount,
                          status: request.status,
                          date: request.date,
                          telephone: "", // à compléter si dispo
                          numeroReception: request.numeroReception || `REF-${request.id.slice(-8)}`
                        })}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Télécharger le reçu PDF"
                      >
                        <IconDownload className="h-4 w-4 text-white/60" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSharePDF({
                          id: request.id,
                          amount: request.amount,
                          status: request.status,
                          date: request.date,
                          telephone: "", // à compléter si dispo
                          numeroReception: request.numeroReception || `REF-${request.id.slice(-8)}`
                        })}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Partager le reçu PDF"
                      >
                        <IconShare className="h-4 w-4 text-white/60" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedRequest === request.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Motif</span>
                          <span className="text-white text-sm">{request.motif}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Montant total</span>
                          <span className="text-white text-sm">{request.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Frais de service</span>
                          <span className="text-white text-sm">{request.fraisService}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Salaire disponible</span>
                          <span className="text-white text-sm">{request.salaireDisponible}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Avance disponible</span>
                          <span className="text-white text-sm">{request.avanceDisponible}</span>
                        </div>
                        {request.dateValidation && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Date de validation</span>
                            <span className="text-white text-sm">{request.dateValidation}</span>
                          </div>
                        )}
                        {request.dateRejet && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Date de rejet</span>
                            <span className="text-white text-sm">{request.dateRejet}</span>
                          </div>
                        )}
                        {request.motifRejet && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Motif de rejet</span>
                            <span className="text-white text-sm">{request.motifRejet}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertCircle className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 text-lg">Aucune demande d'avance trouvée</p>
            <p className="text-white/40 text-sm mt-2">Essayez de modifier vos filtres</p>
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

      {/* Modal for Request Details */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010D3E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative mx-auto p-6 w-full max-w-lg bg-[#010D3E] rounded-2xl shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Détails de la Demande</h3>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRequest(null)}
                  className="text-white/50 hover:text-white"
                >
                  <IconX className="w-6 h-6" />
                </motion.button>
              </div>

              {selectedRequest && (
                <div className="space-y-4">
                  {(() => {
                    const request = allRequests.find((r) => r.id === selectedRequest)!;
                    return (
                      <>
                        {[
                          { label: "Numéro de référence", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                          { label: "Date de demande", value: request.date },
                          { label: "Type", value: request.type },
                          { label: "Montant demandé", value: request.amount },
                          { label: "Montant total", value: request.totalAmount },
                          { label: "Frais de service", value: request.fraisService },
                          { label: "Motif", value: request.motif },
                          {
                            label: "Statut",
                            value: (
                              <span
                                className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(
                                  request.status
                                )}`}
                              >
                                {getStatusText(request.status)}
                              </span>
                            ),
                          },
                          { label: "Salaire disponible", value: request.salaireDisponible },
                          { label: "Avance disponible", value: request.avanceDisponible },
                          ...(request.dateValidation ? [{ label: "Date de validation", value: request.dateValidation }] : []),
                          ...(request.dateRejet ? [{ label: "Date de rejet", value: request.dateRejet }] : []),
                          ...(request.motifRejet ? [{ label: "Motif de rejet", value: request.motifRejet }] : []),
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <p className="text-sm text-white/80">{item.label}</p>
                            <p className="font-medium text-white">{item.value}</p>
                          </motion.div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex justify-end gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShareRequest(selectedRequest);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Partager
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Popup */}
      <AnimatePresence>
        {shareRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010D3E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={sharePopupRef}
              variants={sharePopupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative mx-auto p-6 w-full max-w-md bg-[#010D3E] rounded-2xl shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Partager la demande</h3>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShareRequest(null)}
                  className="text-white/50 hover:text-white"
                >
                  <IconX className="h-5 w-5" />
                </motion.button>
              </div>

              {shareRequest && (
                <div className="space-y-4">
                  {(() => {
                    const shareLinks = shareRequestDetails(shareRequest);
                    if (!shareLinks) return null;

                    return (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "WhatsApp", url: shareLinks.whatsapp, color: "bg-green-500" },
                          { name: "Facebook", url: shareLinks.facebook, color: "bg-blue-600" },
                          { name: "Telegram", url: shareLinks.telegram, color: "bg-blue-500" },
                          { name: "Twitter", url: shareLinks.twitter, color: "bg-blue-400" },
                        ].map((platform, index) => (
                          <motion.a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`${platform.color} text-white p-3 rounded-xl text-center font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                          >
                            {platform.name}
                          </motion.a>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 