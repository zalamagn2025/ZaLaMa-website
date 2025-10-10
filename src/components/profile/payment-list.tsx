"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconSearch, IconFilter, IconDownload, IconEye, IconX, IconCalendar, IconCurrency, IconUser, IconClock, IconCheck, IconRefresh, IconFileText, IconShare } from "@tabler/icons-react"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import { PaymentData } from "./payment-service-card"
import { useWithdrawalHistory, WithdrawalHistoryItem } from "@/hooks/useWithdrawalHistory"

// Fonction de conversion des données d'historique en PaymentData
const convertHistoryToPaymentData = (historyItem: WithdrawalHistoryItem): PaymentData => {
  const isRetrait = historyItem.type === 'RETRAIT'
  
  return {
    id: historyItem.id,
    clientName: isRetrait ? historyItem.nom_beneficiaire || 'Employé' : historyItem.partenaire || 'Entreprise',
    clientEmail: isRetrait ? '' : 'contact@entreprise.com', // Pas d'email pour les retraits
    amount: historyItem.montant_final || historyItem.montant,
    currency: 'GNF',
    status: mapStatusToPaymentStatus(historyItem.statut),
    createdAt: historyItem.date_demande,
    receivedAt: historyItem.date_traitement || undefined,
    reference: historyItem.reference,
    notes: historyItem.commentaire || undefined,
    // Données spécifiques aux retraits
    ...(isRetrait && {
      type: 'RETRAIT' as const,
      typeCompte: historyItem.type_compte,
      numeroReception: historyItem.numero_reception,
      fraisRetrait: historyItem.frais_retrait,
      transfer: historyItem.transfer
    })
  }
}

// Fonction de mapping des statuts
const mapStatusToPaymentStatus = (statut: string): PaymentData['status'] => {
  switch (statut) {
    case 'EN_ATTENTE':
      return 'pending'
    case 'TRAITE':
    case 'APPROUVE':
      return 'received'
    case 'REJETE':
    case 'ANNULE':
      return 'cancelled'
    case 'EXPIRE':
      return 'expired'
    default:
      return 'pending'
  }
}

// Interface pour le PDF (simplifié pour les paiements)
const PaymentPDF = ({ payment }: { payment: PaymentData }) => (
  <div>
    <h1>Détails du Paiement</h1>
    <p>Référence: {payment.reference}</p>
    <p>Client: {payment.clientName}</p>
    <p>Email: {payment.clientEmail}</p>
    <p>Montant: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: payment.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(payment.amount)}</p>
    <p>Statut: {payment.status}</p>
    <p>Date: {new Date(payment.createdAt).toLocaleDateString("fr-FR")}</p>
    {payment.receivedAt && <p>Date de réception: {new Date(payment.receivedAt).toLocaleDateString("fr-FR")}</p>}
    {payment.notes && <p>Notes: {payment.notes}</p>}
  </div>
)

// Icône pour les paiements
const PaymentIcon = () => (
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
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="15" r="1" />
    <circle cx="12" cy="15" r="1" />
    <circle cx="16" cy="15" r="1" />
  </svg>
)

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
}

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
}

interface PaymentListProps {
  payments: PaymentData[]
  onStatusChange?: (paymentId: string, newStatus: PaymentData['status']) => void
  onDownload?: (paymentId: string) => void
  onShare?: (paymentId: string) => void
  onRefresh?: () => void
  isLoading?: boolean
}

type FilterStatus = 'all' | 'pending' | 'received' | 'cancelled' | 'expired'
type SortBy = 'date' | 'amount' | 'client' | 'status'

export function PaymentList({
  payments: mockPayments, // Renommer pour éviter la confusion
  onStatusChange,
  onDownload,
  onShare,
  onRefresh,
  isLoading = false
}: PaymentListProps) {
  // Utiliser l'historique réel des retraits et paiements
  const { 
    history, 
    retraits, 
    paiements, 
    loading: historyLoading, 
    error: historyError, 
    stats,
    refetch: refetchHistory 
  } = useWithdrawalHistory()

  // Convertir l'historique en format PaymentData
  const realPayments = useMemo(() => {
    return history.map(convertHistoryToPaymentData)
  }, [history])

  // Utiliser les données réelles si disponibles, sinon les données mockées
  const payments = realPayments.length > 0 ? realPayments : mockPayments
  const isLoadingData = historyLoading || isLoading

  // Fonction de refresh combinée
  const handleRefresh = () => {
    if (realPayments.length > 0) {
      refetchHistory()
    } else if (onRefresh) {
      onRefresh()
    }
  }
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const paymentsPerPage = 10
  const modalRef = useRef<HTMLDivElement>(null)

  // Filtrage et tri des paiements
  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments.filter(payment => {
      const matchesSearch = searchTerm === '' || 
        payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.reference && payment.reference.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter

      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'client':
          comparison = a.clientName.localeCompare(b.clientName)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [payments, searchTerm, statusFilter, sortBy, sortOrder])

  const indexOfLastPayment = currentPage * paymentsPerPage
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage
  const currentPayments = filteredAndSortedPayments.slice(indexOfFirstPayment, indexOfLastPayment)
  const totalPages = Math.ceil(filteredAndSortedPayments.length / paymentsPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "received":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "cancelled":
      case "expired":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <IconClock className="w-3 h-3" />
    switch (status.toLowerCase()) {
      case "pending":
        return <IconClock className="w-3 h-3" />
      case "received":
        return <IconCheck className="w-3 h-3" />
      case "cancelled":
      case "expired":
        return <IconX className="w-3 h-3" />
      default:
        return <IconClock className="w-3 h-3" />
    }
  }

  const getStatusText = (status: string | undefined) => {
    if (!status) return "Inconnu"
    switch (status.toLowerCase()) {
      case "pending":
        return "En attente"
      case "received":
        return "Reçu"
      case "cancelled":
        return "Annulé"
      case "expired":
        return "Expiré"
      default:
        return status
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(/\//g, ' ')
  }

  const generateAndDownloadPDF = async (payment: PaymentData) => {
    try {
      const blob = await pdf(<PaymentPDF payment={payment} />).toBlob()
      saveAs(blob, `Paiement_${payment.reference}.pdf`)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error)
      alert("Une erreur est survenue lors de la génération du PDF.")
    }
  }

  if (isLoading) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF671E] mr-3"></div>
          <span style={{ color: 'rgb(255, 255, 255)' }}>Chargement des paiements...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <PaymentIcon />
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'rgb(255, 255, 255)' }}>Paiements</h2>
              <p style={{ color: 'rgb(156, 163, 175)' }} className="text-sm">
                {realPayments.length > 0 ? (
                  <>
                    {stats.total} opération{stats.total !== 1 ? "s" : ""} • {stats.total_retraits} retrait{stats.total_retraits !== 1 ? "s" : ""} • {stats.total_paiements} paiement{stats.total_paiements !== 1 ? "s" : ""}
                  </>
                ) : (
                  <>
                    {filteredAndSortedPayments.length} paiement{filteredAndSortedPayments.length !== 1 ? "s" : ""} trouvé{filteredAndSortedPayments.length !== 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isLoadingData}
              className="p-2 text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              <IconRefresh className={`h-5 w-5 ${isLoadingData ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <IconFilter className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {historyError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
          >
            <p className="text-red-400 text-sm">
              ⚠️ Erreur lors du chargement de l'historique: {historyError}
            </p>
            <button
              onClick={handleRefresh}
              className="text-red-300 hover:text-red-200 text-xs underline mt-1"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <input
              type="text"
              placeholder="Rechercher un paiement..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
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
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 flex items-center gap-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
          >
            <IconFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </motion.button>
        </div>

        {/* Filtres (style conservé de l'original) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Rechercher
                  </label>
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                      }}
                      placeholder="Client, email, référence..."
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Statut
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as FilterStatus)
                      setCurrentPage(1)
                    }}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="received">Reçus</option>
                    <option value="cancelled">Annulés</option>
                    <option value="expired">Expirés</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Trier par
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortBy, 'asc' | 'desc']
                      setSortBy(newSortBy)
                      setSortOrder(newSortOrder)
                      setCurrentPage(1)
                    }}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date-desc">Date (récent)</option>
                    <option value="date-asc">Date (ancien)</option>
                    <option value="amount-desc">Montant (élevé)</option>
                    <option value="amount-asc">Montant (faible)</option>
                    <option value="client-asc">Client (A-Z)</option>
                    <option value="client-desc">Client (Z-A)</option>
                    <option value="status-asc">Statut (A-Z)</option>
                    <option value="status-desc">Statut (Z-A)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Liste des paiements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {isLoadingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="bg-[#010D3E]/50 backdrop-blur-md rounded-xl border overflow-hidden shadow-lg animate-pulse"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-600 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentPayments.length > 0 ? (
          currentPayments.map((payment, index) => (
            <motion.div
              key={`${payment.id}-${index}`}
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
                      <PaymentIcon />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg" style={{ color: 'rgb(255, 255, 255)' }}>
                            {payment.type === 'RETRAIT' ? 'Retrait' : 'Paiement'}
                          </h3>
                          {payment.type === 'RETRAIT' && (
                            <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
                              RETRAIT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(156, 163, 175)' }}>
                          <IconUser className="w-3 h-3" />
                          <span>{payment.clientName}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full border ${getStatusColor(payment.status)}`}
                      >
                        {getStatusIcon(payment.status)}
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <IconCurrency className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Montant :</span>
                        <span className="font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>{formatAmount(payment.amount)}</span>
                        {payment.type === 'RETRAIT' && payment.fraisRetrait && payment.fraisRetrait > 0 && (
                          <span className="text-orange-400 text-xs">
                            (frais: -{formatAmount(payment.fraisRetrait)})
                          </span>
                        )}
                      </div>
                      {payment.type === 'RETRAIT' && payment.typeCompte && (
                        <div className="flex items-center gap-2">
                          <IconUser className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Type de compte :</span>
                          <span className="font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>{payment.typeCompte}</span>
                        </div>
                      )}
                      {payment.type === 'RETRAIT' && payment.numeroReception && (
                        <div className="flex items-center gap-2">
                          <IconUser className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Numéro :</span>
                          <span className="font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>{payment.numeroReception}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Le {formatFullDate(payment.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPayment(payment.id)}
                        className="px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
                      >
                        <IconEye className="w-4 h-4" />
                        Voir détail
                      </motion.button>
                      {onStatusChange && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onStatusChange(payment.id, payment.status === 'pending' ? 'received' : 'pending')}
                          className="px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
                        >
                          <IconCheck className="w-4 h-4" />
                          {payment.status === 'pending' ? 'Marquer comme reçu' : 'Marquer comme en attente'}
                        </motion.button>
                      )}
                      {onDownload && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDownload(payment.id)}
                          className="px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
                        >
                          <IconDownload className="w-4 h-4" />
                          Télécharger
                        </motion.button>
                      )}
                      {onShare && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onShare(payment.id)}
                          className="px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
                        >
                          <IconShare className="w-4 h-4" />
                          Partager
                        </motion.button>
                      )}
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
            <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Aucun paiement trouvé</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {searchTerm || statusFilter !== 'all' 
                ? "Aucun paiement ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de paiements."
              }
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      {filteredAndSortedPayments.length > paymentsPerPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-center sm:text-left" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Affichage de <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{indexOfFirstPayment + 1}</span> à{" "}
            <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{Math.min(indexOfLastPayment, filteredAndSortedPayments.length)}</span>{" "}
            sur <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{filteredAndSortedPayments.length}</span> paiements
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
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (page > totalPages) return null
                
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
                )
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

      {/* Modale des détails */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010D3E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPayment(null)}
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
                onClick={() => setSelectedPayment(null)}
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
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'rgb(255, 255, 255)' }}>Détails du paiement</h3>
                  </div>
                </div>

                {selectedPayment && (() => {
                  const payment = filteredAndSortedPayments.find((p) => p.id === selectedPayment)!
                  const fieldsToShow = [
                    { label: "Statut", value: getStatusText(payment.status), type: "status" },
                    { label: "Client", value: payment.clientName },
                    { label: "Email", value: payment.clientEmail },
                    { label: "Montant", value: formatAmount(payment.amount), type: "amount" },
                    { label: "Date", value: formatFullDate(payment.createdAt), type: "date" },
                    ...(payment.receivedAt ? [{ label: "Date de réception", value: formatFullDate(payment.receivedAt), type: "date" }] : []),
                    { label: "Référence", value: payment.reference, type: "ref" },
                    ...(payment.notes ? [{ label: "Notes", value: payment.notes }] : []),
                  ]
                  return (
                    <div className="w-full max-w-2xl mx-auto rounded-2xl p-0 md:p-0 flex flex-col" style={{ minHeight: "320px" }}>
                      <div className="flex-1 flex flex-col divide-y" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        {fieldsToShow.map((item, subIndex) => (
                          <div key={subIndex} className="flex items-center justify-between py-4 px-2 md:px-4">
                            <span className="text-base md:text-lg font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {item.label}
                            </span>
                            <span className={`text-right text-base md:text-lg font-bold ${
                              item.type === "amount" ? "text-orange-400" :
                              item.type === "date" || item.type === "ref" ? "text-white" :
                              item.type === "status" ? "text-blue-300" :
                              "text-white"
                            }`} style={{
                              color: item.type === "amount" ? 'rgb(251, 146, 60)' :
                                     item.type === "date" || item.type === "ref" ? 'rgb(255, 255, 255)' :
                                     item.type === "status" ? 'rgb(147, 197, 253)' :
                                     'rgb(255, 255, 255)'
                            }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
