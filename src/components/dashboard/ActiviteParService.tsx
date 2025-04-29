import React from 'react';



export default function ActiviteParService() {
  return (
    <div className="dashboard-card card-services card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Activité par service</h2>
        <div className="flex flex-wrap md:flex-nowrap justify-between">
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">1240</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Avance</div>
            </div>
            <div className="h-16 w-px bg-[var(--zalama-border)] hidden md:block"></div>
          </div>
          
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">620</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Pret P2P</div>
            </div>
            <div className="h-16 w-px bg-[var(--zalama-border)] hidden md:block"></div>
          </div>
          
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">510</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Conseil Financier</div>
            </div>
            <div className="h-16 w-px bg-[var(--zalama-border)] hidden md:block"></div>
          </div>
          
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">350</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Marketing</div>
            </div>
            <div className="h-16 w-px bg-[var(--zalama-border)] hidden md:block"></div>
          </div>
          
          
        </div>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--zalama-green)] rounded-full"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">20</div>
                <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Approuvés</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--zalama-red)] rounded-full"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">40</div>
                <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Rejetés</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--zalama-yellow)] rounded-full"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">30</div>
                <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">En Cours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
  );
}
