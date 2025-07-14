import React from "react";
import Image from "next/image";

interface SalaryAdvanceReceiptProps {
  montant: string;
  frais: string;
  total: string;
  statut: string;
  date: string;
  telephone: string;
  reference: string;
  service: string;
}

export const SalaryAdvanceReceipt = React.forwardRef<HTMLDivElement, SalaryAdvanceReceiptProps>(
  (
    { montant, frais, total, statut, date, telephone, reference, service },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="w-[340px] bg-white rounded-2xl shadow-xl border border-gray-200 mx-auto p-0 font-sans text-[#222]"
        style={{ fontFamily: 'Inter, Arial, sans-serif', minHeight: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <Image src="/images/zalama-logo.svg" alt="ZaLaMa" width={48} height={48} />
          <div className="w-10 h-10 bg-[#FF671E] rounded-md flex items-center justify-center">
            <div className="w-6 h-1 bg-white rounded" />
          </div>
        </div>
        <div className="text-center font-semibold text-lg text-[#222] pb-2 pt-1">{statut === 'Validé' ? "Avance validée !" : statut === 'Rejeté' ? "Demande rejetée" : "Demande d'avance envoyée"}</div>
        {/* Tableau infos */}
        <div className="bg-gray-50 rounded-xl mx-4 my-2 border border-gray-100">
          <div className="flex justify-between px-4 py-2 text-base">
            <span>Montant</span>
            <span className="font-bold text-[#FF671E]">{montant}</span>
          </div>
          <div className="flex justify-between px-4 py-2 text-base">
            <span>Frais</span>
            <span>{frais}</span>
          </div>
          <div className="flex justify-between px-4 py-2 text-base border-t border-gray-200">
            <span>Total</span>
            <span className="font-bold">{total}</span>
          </div>
        </div>
        <div className="px-6 py-1">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">Téléphone</span>
            <span className="font-medium">{telephone}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">Référence</span>
            <span className="font-semibold">{reference}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-medium">{service}</span>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 py-3 border-t border-gray-100">
          Reçu généré par l’application ZaLaMa
        </div>
      </div>
    );
  }
);
SalaryAdvanceReceipt.displayName = "SalaryAdvanceReceipt"; 