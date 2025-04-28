import React from 'react';

export default function ActiviteParPartenaires() {
  return (
    <div className="dashboard-card card-partners card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Activité des partenaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-[var(--zalama-gray)]">12</div>
            <div className="text-sm text-[var(--zalama-gray)]/70">Total partenaires</div>
          </div>
          
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-[var(--zalama-gray)]">45</div>
            <div className="text-sm text-[var(--zalama-gray)]/70">Total Employés</div>
          </div>

          <div className="flex flex-col">
            <div className="text-3xl font-bold text-[var(--zalama-gray)]">25</div>
            <div className="text-sm text-[var(--zalama-gray)]/70">Nouveaux Partenaires</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3 text-[var(--zalama-gray)]">Employés par entreprise</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Acme Inc.</span>
                <span className="text-sm">120</span>
              </div>
              <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Globex Corp</span>
                <span className="text-sm">85</span>
              </div>
              <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Initech</span>
                <span className="text-sm">65</span>
              </div>
              <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            {/* Revenus générés */}
            <div className="p-6 bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
              <h3 className="text-sm font-medium mb-3 text-[var(--zalama-gray)]">Montant Debloqué par l&apos;entreprise : Acme Inc.</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-[var(--zalama-gray)]">25,000,000 GNF</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Total</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-[var(--zalama-gray)]">15,000,000 GNF</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Ce mois-ci</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-[var(--zalama-green)]">+18%</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Vs. mois dernier</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
