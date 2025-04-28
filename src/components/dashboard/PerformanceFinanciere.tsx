import React from 'react';
//import { TrendingUp } from 'lucide-react';

export default function PerformanceFinanciere() {
  return (
    <div className="dashboard-card card-finance card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Performance financière</h2>
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col">
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Montants Financiers : </div>
              <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">25,000,000 GNF</div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">950,000 GNF</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Montant Debloqué</div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">75,000 GNF</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Montant Recuperé</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex flex-col">
              {/* Espace vide pour l'alignement */}
            </div>
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">50,000 GNF</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Revenus Generés</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">90%</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Taux Remboursement</div>
            </div>
          </div>
        </div>
      </div>
  );
}
