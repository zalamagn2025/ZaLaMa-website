import React from 'react';
import { Target, Award, Clock } from 'lucide-react';

export default function ObjectifsPerformances() {
  return (
    <div className="dashboard-card card-objectives card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Objectifs & Performances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-[var(--zalama-blue-accent)]/10 mr-4">
              <Target size={24} className="text-[var(--zalama-blue)]" />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Progression des objectifs mensuels</div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Nouveaux utilisateurs</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 bg-[var(--zalama-bg-darker)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--zalama-blue)]" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Volume de prêts</span>
                    <span>82%</span>
                  </div>
                  <div className="h-2 bg-[var(--zalama-bg-darker)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--zalama-blue)]" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Partenariats</span>
                    <span>60%</span>
                  </div>
                  <div className="h-2 bg-[var(--zalama-bg-darker)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--zalama-blue)]" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-[var(--zalama-blue-accent)]/10 mr-4">
              <Award size={24} className="text-[var(--zalama-blue)]" />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Taux de croissance mensuel</div>
              <div className="flex items-end mt-2">
                <div className="text-2xl font-bold text-[var(--zalama-gray)]">+12.5%</div>
                <div className="text-xs text-green-500 ml-2 mb-1">+2.3% vs mois précédent</div>
              </div>
              <div className="text-xs text-[var(--zalama-gray)]/70 mt-1">
                Progression constante depuis 3 mois
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-6">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-[var(--zalama-blue-accent)]/10 mr-4">
              <Clock size={24} className="text-[var(--zalama-blue)]" />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Performance des équipes</div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Réactivité service client</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-[var(--zalama-bg-darker)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--zalama-green)]" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Traitement des demandes</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-[var(--zalama-bg-darker)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--zalama-green)]" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Résolution des problèmes</span>
                    <span>78%</span>
                  </div>
                  <div className="h-2 bg-[var(--zalama-bg-darker)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--zalama-green)]" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-[var(--zalama-blue-accent)]/10 mr-4">
              <Award size={24} className="text-[var(--zalama-blue)]" />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Satisfaction globale</div>
              <div className="flex items-center mt-2">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">87%</span>
                  </div>
                  <div className="w-20 h-20 rounded-full" style={{ background: 'conic-gradient(var(--zalama-green) 87%, var(--zalama-bg-darker) 0)' }}></div>
                </div>
                <div className="ml-4 text-xs text-[var(--zalama-gray)]/70">
                  <div>Basé sur les retours clients</div>
                  <div className="mt-1 text-green-500">+5% vs trimestre précédent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
