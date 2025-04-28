import React from 'react';

export default function GraphiquesVisualisations() {

  return (
    <div className="dashboard-card card-visualizations card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Graphiques & Visualisations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm md:text-base font-medium mb-3 text-[var(--zalama-gray)]">Courbes d&apos;évolution mensuelle</h3>
            <div className="relative h-64 w-full mt-4">
              {/* Ligne de base */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--zalama-border)]"></div>
              
              {/* Courbe de demandes */}
              <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                <div className="relative w-full h-full">
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-[var(--zalama-blue)]/10 rounded-t-md"></div>
                  <svg className="absolute bottom-0 left-0 right-0 h-full" viewBox="0 0 100 64" preserveAspectRatio="none">
                    <path d="M0,64 L0,40 C10,35 20,45 30,42 C40,39 50,30 60,32 C70,34 80,25 90,20 L100,15 L100,64 Z" fill="none" stroke="var(--zalama-blue)" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              
              {/* Courbe de remboursements */}
              <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                <div className="relative w-full h-full">
                  <svg className="absolute bottom-0 left-0 right-0 h-full" viewBox="0 0 100 64" preserveAspectRatio="none">
                    <path d="M0,64 L0,50 C10,48 20,42 30,45 C40,48 50,40 60,38 C70,36 80,30 90,25 L100,28 L100,64 Z" fill="none" stroke="var(--zalama-green)" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              
              {/* Mois */}
              <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between px-2">
                <div className="text-xs">Jan</div>
                <div className="text-xs">Fév</div>
                <div className="text-xs">Mar</div>
                <div className="text-xs">Avr</div>
                <div className="text-xs">Mai</div>
                <div className="text-xs">Juin</div>
              </div>
              
              {/* Légende */}
              <div className="absolute top-0 right-0 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[var(--zalama-blue)] rounded-full"></div>
                  <span className="text-xs">Demandes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[var(--zalama-green)] rounded-full"></div>
                  <span className="text-xs">Remboursements</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm md:text-base font-medium mb-3 text-[var(--zalama-gray)]">Barres comparatives</h3>
            <div className="h-64 relative mt-4">
              {/* Ligne de base */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--zalama-border)]"></div>
              
              {/* Barres par entreprise */}
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-2">
                <div className="flex flex-col items-center w-1/5">
                  <div className="w-full max-w-[30px] flex flex-col items-center">
                    <div className="h-48 w-full bg-[var(--zalama-blue)] rounded-t-md relative group">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[var(--zalama-bg-darker)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">48%</div>
                    </div>
                    <div className="text-xs mt-2">Acme Inc</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-1/5">
                  <div className="w-full max-w-[30px] flex flex-col items-center">
                    <div className="h-36 w-full bg-[var(--zalama-blue)] rounded-t-md relative group">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[var(--zalama-bg-darker)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">36%</div>
                    </div>
                    <div className="text-xs mt-2">Globex</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-1/5">
                  <div className="w-full max-w-[30px] flex flex-col items-center">
                    <div className="h-40 w-full bg-[var(--zalama-blue)] rounded-t-md relative group">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[var(--zalama-bg-darker)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">40%</div>
                    </div>
                    <div className="text-xs mt-2">Initech</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-1/5">
                  <div className="w-full max-w-[30px] flex flex-col items-center">
                    <div className="h-28 w-full bg-[var(--zalama-blue)] rounded-t-md relative group">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[var(--zalama-bg-darker)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">28%</div>
                    </div>
                    <div className="text-xs mt-2">Umbrella</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-1/5">
                  <div className="w-full max-w-[30px] flex flex-col items-center">
                    <div className="h-32 w-full bg-[var(--zalama-blue)] rounded-t-md relative group">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[var(--zalama-bg-darker)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">32%</div>
                    </div>
                    <div className="text-xs mt-2">Autres</div>
                  </div>
                </div>
              </div>
              
              {/* Légende */}
              <div className="absolute top-0 left-0 flex items-center gap-2">
                <div className="text-xs font-medium">Entreprises par volume de transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
