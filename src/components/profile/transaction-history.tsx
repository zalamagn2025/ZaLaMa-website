"use client";

import { useState, useRef, useEffect } from "react";
import { IconSearch, IconFilter, IconEye, IconDownload, IconShare, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionPDF } from "./TransactionPDF";

// Définition du type Transaction pour correspondre à TransactionPDF.tsx
interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  status: "Approuvé" | "En attente" | "Rejeté";
  paymentStatus: "Remboursé" | "En cours" | "Échoué";
  description: string;
}

// Données fictives corrigées
const allTransactions: Transaction[] = [
  {
    id: "TX123456",
    date: "15/05/2023",
    type: "Avance sur salaire",
    amount: "500,000 GNF",
    status: "Approuvé",
    paymentStatus: "Remboursé",
    description: "Avance sur salaire de mai 2023",
  },
  {
    id: "TX123457",
    date: "02/06/2023",
    type: "Prêt personnel",
    amount: "1,200,000 GNF",
    status: "Approuvé",
    paymentStatus: "En cours",
    description: "Prêt pour rénovation domicile",
  },
  {
    id: "TX123458",
    date: "10/07/2023",
    type: "Avance sur salaire",
    amount: "300,000 GNF",
    status: "Approuvé",
    paymentStatus: "Remboursé",
    description: "Avance sur salaire de juillet 2023",
  },
  {
    id: "TX123459",
    date: "25/07/2023",
    type: "Prêt entre particuliers",
    amount: "800,000 GNF",
    status: "Approuvé",
    paymentStatus: "En cours",
    description: "Prêt pour frais médicaux",
  },
  {
    id: "TX123460",
    date: "05/08/2023",
    type: "Avance sur salaire",
    amount: "450,000 GNF",
    status: "En attente",
    paymentStatus: "En cours",
    description: "Avance sur salaire d'août 2023",
  },
  {
    id: "TX123461",
    date: "15/08/2023",
    type: "Prêt personnel",
    amount: "750,000 GNF",
    status: "Rejeté",
    paymentStatus: "Échoué",
    description: "Prêt pour vacances",
  },
  {
    id: "TX123462",
    date: "20/08/2023",
    type: "Prêt entre particuliers",
    amount: "1,500,000 GNF",
    status: "Approuvé",
    paymentStatus: "En cours",
    description: "Prêt pour frais scolaires",
  },
];

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [shareTransaction, setShareTransaction] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    period: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const sharePopupRef = useRef<HTMLDivElement>(null);

  // Filtrer les transactions
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filters.type === "" ||
      (filters.type === "advance" && transaction.type === "Avance sur salaire") ||
      (filters.type === "loan" && transaction.type === "Prêt personnel") ||
      (filters.type === "p2p" && transaction.type === "Prêt entre particuliers");

    const matchesStatus =
      filters.status === "" ||
      (filters.status === "approved" && transaction.status === "Approuvé") ||
      (filters.status === "pending" && transaction.status === "En attente") ||
      (filters.status === "rejected" && transaction.status === "Rejeté");

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Gestion du clic en dehors du popup de partage
  const handleClickOutside = (event: MouseEvent) => {
    if (sharePopupRef.current && !sharePopupRef.current.contains(event.target as Node)) {
      setShareTransaction(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Styles et animations
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approuvé":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "En attente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rejeté":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Remboursé":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "En cours":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Échoué":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: i * 0.05 },
    }),
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(1, 13, 62, 0.7)",
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

  // Partager une transaction
  const shareTransactionDetails = (transactionId: string) => {
    const transaction = allTransactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    const shareText =
      `Détails de ma transaction ${transaction.id}:\n\n` +
      `Type: ${transaction.type}\n` +
      `Montant: ${transaction.amount}\n` +
      `Statut: ${transaction.status}\n` +
      `Date: ${transaction.date}`;

    const shareUrl = `https://monapp.com/transactions/${transaction.id}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&e=${encodeURIComponent(shareText)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#010D3E] p-6 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white"
        >
          Historique des Transactions
        </motion.h2>

        <div className="flex gap-3 w-full sm:w-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-full sm:w-64"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF8E53] focus:border-transparent shadow-sm transition-all duration-300"
              placeholder="Rechercher une transaction..."
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
            whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(255, 103, 30, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <IconFilter className="h-4 w-4 mr-2" />
            Filtres
          </motion.button>
        </div>
      </div>

      {/* Filter Section */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-[#010D3E]/70 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Type",
                  name: "type",
                  options: [
                    { value: "", label: "Tous" },
                    { value: "advance", label: "Avance sur salaire" },
                    { value: "loan", label: "Prêt personnel" },
                    { value: "p2p", label: "Prêt entre particuliers" },
                  ],
                },
                {
                  label: "Statut",
                  name: "status",
                  options: [
                    { value: "", label: "Tous" },
                    { value: "approved", label: "Approuvé" },
                    { value: "pending", label: "En attente" },
                    { value: "rejected", label: "Rejeté" },
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
            <div className="mt-4 flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilters({
                    type: "",
                    status: "",
                    period: "",
                  });
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#010D3E]/70 transition-all duration-300"
              >
                Réinitialiser
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Appliquer
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#010D3E]/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[#010D3E]/70">
              <tr>
                {["ID Transaction", "Date", "Type", "Montant", "Statut", "Paiement", "Actions"].map(
                  (header, index) => (
                    <motion.th
                      key={header}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider ${
                        header === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {header}
                    </motion.th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={rowVariants}
                    className="transition-all duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getPaymentStatusColor(
                          transaction.paymentStatus
                        )}`}
                      >
                        {transaction.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedTransaction(transaction.id)}
                          className="text-[#FF8E53] hover:text-[#FF671E]"
                        >
                          <IconEye className="h-5 w-5" />
                        </motion.button>

                        <PDFDownloadLink
                          document={<TransactionPDF transaction={transaction} />}
                          fileName={`transaction_${transaction.id}.pdf`}
                        >
                          {({ loading }) => (
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: -10 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-white/50 hover:text-white/80"
                              disabled={loading}
                            >
                              <IconDownload className="h-5 w-5" />
                            </motion.button>
                          )}
                        </PDFDownloadLink>

                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShareTransaction(transaction.id)}
                          className="text-white/50 hover:text-white/80"
                        >
                          <IconShare className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={7} className="px-6 py-4 text-center text-white/80">
                    Aucune transaction trouvée
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#010D3E]/50 backdrop-blur-md px-4 py-3 flex items-center justify-between border-t border-white/10 sm:px-6"
          >
            <div className="flex-1 flex justify-between sm:hidden">
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
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm text-white/80">
                Affichage de <span className="font-medium">{indexOfFirstTransaction + 1}</span> à{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastTransaction, filteredTransactions.length)}
                </span>{" "}
                sur <span className="font-medium">{filteredTransactions.length}</span> transactions
              </p>
              <div className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-2 rounded-l-xl border border-white/10 bg-[#010D3E]/50 text-sm font-medium text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Précédent</span>
                  ‹
                </motion.button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => paginate(pageNum)}
                      className={`px-4 py-2 border border-white/10 text-sm font-medium transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white"
                          : "bg-[#010D3E]/50 text-white hover:bg-[#010D3E]/70"
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-2 rounded-r-xl border border-white/10 bg-[#010D3E]/50 text-sm font-medium text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Suivant</span>
                  ›
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal for Transaction Details */}
      <AnimatePresence>
        {selectedTransaction && (
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
                <h3 className="text-xl font-bold text-white">Détails de la Transaction</h3>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedTransaction(null)}
                  className="text-white/50 hover:text-white"
                >
                  ×
                </motion.button>
              </div>

              {allTransactions.find((t) => t.id === selectedTransaction) && (
                <div className="space-y-4">
                  {(() => {
                    const transaction = allTransactions.find((t) => t.id === selectedTransaction)!;
                    return (
                      <>
                        {[
                          { label: "ID Transaction", value: transaction.id },
                          { label: "Date", value: transaction.date },
                          { label: "Type", value: transaction.type },
                          { label: "Montant", value: transaction.amount },
                          { label: "Description", value: transaction.description },
                          {
                            label: "Statut",
                            value: (
                              <span
                                className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            ),
                          },
                          {
                            label: "Statut de paiement",
                            value: (
                              <span
                                className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getPaymentStatusColor(
                                  transaction.paymentStatus
                                )}`}
                              >
                                {transaction.paymentStatus}
                              </span>
                            ),
                          },
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
                <PDFDownloadLink
                  document={<TransactionPDF transaction={allTransactions.find((t) => t.id === selectedTransaction)!} />}
                  fileName={`transaction_${selectedTransaction}.pdf`}
                >
                  {({ loading }) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-[#010D3E]/50 border border-white/10 text-white hover:bg-[#010D3E]/70 transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? "Génération..." : "Télécharger PDF"}
                    </motion.button>
                  )}
                </PDFDownloadLink>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(255, 103, 30, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Fermer
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Popup Modale */}
      <AnimatePresence>
        {shareTransaction && (
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
                <h3 className="text-lg font-bold text-white">Partager la transaction</h3>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShareTransaction(null)}
                  className="text-white/50 hover:text-white"
                >
                  <IconX className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Partagez les détails de cette transaction sur les plateformes suivantes :
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      name: "WhatsApp",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ),
                      color: "bg-green-500 hover:bg-green-600",
                    },
                    {
                      name: "Facebook",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      ),
                      color: "bg-blue-600 hover:bg-blue-700",
                    },
                    {
                      name: "Telegram",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                        </svg>
                      ),
                      color: "bg-blue-400 hover:bg-blue-500",
                    },
                    {
                      name: "Twitter",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      ),
                      color: "bg-blue-300 hover:bg-blue-400",
                    },
                  ].map((platform) => {
                    const shareUrl = shareTransactionDetails(shareTransaction)?.[
                      platform.name.toLowerCase() as keyof ReturnType<typeof shareTransactionDetails>
                    ];
                    return (
                      <motion.a
                        key={platform.name}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={shareUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${platform.color} text-white rounded-lg p-3 flex flex-col items-center justify-center text-sm transition-colors duration-300`}
                      >
                        <div className="mb-1">{platform.icon}</div>
                        <span>{platform.name}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}