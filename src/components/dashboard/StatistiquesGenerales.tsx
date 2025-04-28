import React from 'react';

export default function StatistiquesGenerales() {
  return (
    <div className="dashboard-card card-stats card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
    <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Statistiques générales</h2>
    <div className="flex flex-col md:flex-row gap-6">
      {/* Statistiques à gauche */}
      <div className="flex flex-col space-y-4 md:space-y-6 md:w-1/2">
        <div className="flex flex-col">
          <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">25,840</div>
          <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Utilisateurs inscrits</div>
        </div>
        <div className="flex flex-col">
          <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">5,200</div>
          <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Utilisateurs actifs</div>
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="flex flex-col">
            <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">870</div>
            <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Nouveaux inscrits ce mois-ci</div>
          </div>
        </div>
      </div>
      
      {/* Graphique à droite */}
      <div className="flex flex-col items-center mt-6 md:mt-0 md:w-1/2">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg md:text-xl font-bold">40%</span>
          </div>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full" style={{ background: 'conic-gradient(var(--zalama-blue) 40%, var(--zalama-blue-accent) 0)' }}></div>
        </div>
        <div className="ml-4 space-y-2 mt-4 flex flex-col justify-start items-start content-end">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[var(--zalama-blue)] rounded-full mr-2"></div>
            <span>Étudiants</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[var(--zalama-blue-accent)] rounded-full mr-2"></div>
            <span>Salariés</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[var(--zalama-blue-accent)] rounded-full mr-2"></div>
            <span>Pensionnes</span>
          </div>
        </div>
      </div>
      
    </div>
    
    
  </div>
  );
}
