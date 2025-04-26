"use client";
import React from 'react';
import { Activity, AlertTriangle, Shield, TrendingUp, FileText, Star } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Statistiques générales */}
      <div className="dashboard-card card-stats card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Statistiques générales</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Statistiques à gauche */}
          <div className="flex flex-col space-y-4 md:space-y-6 md:w-1/2">
            <div className="flex flex-col">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">25,840</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Nombre d&apos;utilisateurs inscrits</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">5,200</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Répartition utilisateurs côté mois ci</div>
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
          </div>
        </div>
        <div className="ml-4 space-y-2 mt-4 flex flex-col justify-end items-end content-end">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[var(--zalama-blue)] rounded-full mr-2"></div>
            <span>Étudiants</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[var(--zalama-blue-accent)] rounded-full mr-2"></div>
            <span>Salariés et pensionnés</span>
          </div>
        </div>
        
      </div>
      
      {/* Performance financière */}
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
      
      {/* Activité des partenaires */}
      <div className="dashboard-card card-partners card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Activité des partenaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-[var(--zalama-gray)]">12</div>
            <div className="text-sm text-[var(--zalama-gray)]/70">Nouveaux partenaires ce mois-ci</div>
          </div>
          
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-[var(--zalama-gray)]">45</div>
            <div className="text-sm text-[var(--zalama-gray)]/70">Partenaires actifs</div>
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
              <h3 className="text-sm font-medium mb-3 text-[var(--zalama-gray)]">Revenus générés</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-[var(--zalama-gray)]">€125k</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Total</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-[var(--zalama-gray)]">€45k</div>
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
      
      {/* Activité par service */}
      <div className="dashboard-card card-services card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Activité par service</h2>
        <div className="flex flex-wrap md:flex-nowrap justify-between">
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">1240</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Demandes d&apos;avance</div>
            </div>
            <div className="h-16 w-px bg-[var(--zalama-border)] hidden md:block"></div>
          </div>
          
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">620</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">P2P</div>
            </div>
            <div className="h-16 w-px bg-[var(--zalama-border)] hidden md:block"></div>
          </div>
          
          <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex flex-col px-4">
              <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">510</div>
              <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Paiement</div>
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
          
          <div className="flex flex-col px-4 w-full sm:w-auto">
            <div className="text-2xl md:text-3xl font-bold text-[var(--zalama-gray)]">180</div>
            <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Autres</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-base md:text-lg font-semibold mb-3 text-[var(--zalama-blue)]">Temps moyen de traitement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--zalama-green)] rounded-full"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">75%</div>
                <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Approuvés</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--zalama-red)] rounded-full"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">15%</div>
                <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">Rejetés</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--zalama-yellow)] rounded-full"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--zalama-gray)]">10%</div>
                <div className="text-xs md:text-sm text-[var(--zalama-gray)]/70">En Cours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Données Utilisateurs */}
      <div className="dashboard-card card-users card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Données utilisateurs</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-[var(--zalama-gray)]">Répartition par âge, sexe, région</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">18-25 ans</span>
                </div>
                <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">26-40 ans</span>
                </div>
                <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">(en idhnk balanæ et</span>
                </div>
                <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">pensionnes)</span>
                </div>
                <div className="w-full bg-[var(--zalama-bg-light)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--zalama-blue)] h-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-[var(--zalama-gray)]">Localisation géographique</h3>
            <div className="relative h-32 w-full bg-[var(--zalama-bg-light)] rounded-lg overflow-hidden">
              {/* Carte simplifiée de l'Afrique comme sur l'image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <path d="M80,40 C100,30 120,30 140,40 C150,60 160,80 150,100 C140,120 130,140 120,160 C100,170 80,170 60,160 C50,140 40,120 50,100 C60,80 70,60 80,40 Z" fill="#60a5fa" opacity="0.6" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-2xl font-bold text-[var(--zalama-gray)]">4,7</div>
            <div className="text-sm text-[var(--zalama-gray)]">stars</div>
            <div className="flex ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-[var(--zalama-blue)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Alertes et notifications */}
      <div className="dashboard-card card-alerts card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Alertes et notifications</h2>
        <div className="space-y-4">
          <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-[var(--zalama-warning)] mt-1" />
            <div>
              <div className="font-medium">Retards de paiement</div>
              <div className="text-sm text-[var(--zalama-gray)]/70">15 utilisateurs ont des retards de paiement de plus de 30 jours</div>
            </div>
          </div>
          
          <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-start gap-3">
            <Shield className="text-[var(--zalama-blue)] mt-1" />
            <div>
              <div className="font-medium">Vérifications d&apos;identité</div>
              <div className="text-sm text-[var(--zalama-gray)]/70">28 vérifications d&apos;identité en attente</div>
            </div>
          </div>
          
          <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-start gap-3">
            <Activity className="text-[var(--zalama-green)] mt-1" />
            <div>
              <div className="font-medium">Pic d&apos;activité</div>
              <div className="text-sm text-[var(--zalama-gray)]/70">Pic d&apos;activité détecté à 14h30 aujourd&apos;hui</div>
            </div>
          </div>
          
          <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-start gap-3">
            <TrendingUp className="text-[var(--zalama-blue)] mt-1" />
            <div>
              <div className="font-medium">Augmentation des transactions</div>
              <div className="text-sm text-[var(--zalama-gray)]/70">+22% de transactions par rapport à la semaine dernière</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visualisations et rapports */}
      <div className="dashboard-card card-visualizations card bg-[var(--zalama-bg-dark)] text-[var(--zalama-text-light)] rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-[var(--zalama-blue)]">Visualisations et rapports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3 text-[var(--zalama-gray)]">Transactions mensuelles</h3>
            <div className="h-64 flex items-end justify-between gap-2 mt-4">
              <div className="flex flex-col items-center">
                <div className="bg-[var(--zalama-blue)] w-8 h-32 rounded-t-md"></div>
                <div className="text-xs mt-2">Jan</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[var(--zalama-blue)] w-8 h-40 rounded-t-md"></div>
                <div className="text-xs mt-2">Fév</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[var(--zalama-blue)] w-8 h-36 rounded-t-md"></div>
                <div className="text-xs mt-2">Mar</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[var(--zalama-blue)] w-8 h-48 rounded-t-md"></div>
                <div className="text-xs mt-2">Avr</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[var(--zalama-blue)] w-8 h-52 rounded-t-md"></div>
                <div className="text-xs mt-2">Mai</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[var(--zalama-blue)] w-8 h-44 rounded-t-md"></div>
                <div className="text-xs mt-2">Juin</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3 text-[var(--zalama-gray)]">Rapports disponibles</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-center gap-3">
                <FileText className="text-[var(--zalama-blue)]" />
                <div>
                  <div className="font-medium">Rapport mensuel - Avril 2025</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Généré le 02/05/2025</div>
                </div>
              </div>
              
              <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-center gap-3">
                <FileText className="text-[var(--zalama-blue)]" />
                <div>
                  <div className="font-medium">Analyse des tendances</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Mis à jour aujourd&apos;hui</div>
                </div>
              </div>
              
              <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-center gap-3">
                <FileText className="text-[var(--zalama-blue)]" />
                <div>
                  <div className="font-medium">Rapport de performance</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Mis à jour il y a 3 jours</div>
                </div>
              </div>
              
              <div className="p-3 bg-[var(--zalama-bg-darker)] rounded-lg flex items-center gap-3">
                <Star className="text-[var(--zalama-warning)]" />
                <div>
                  <div className="font-medium">Satisfaction client</div>
                  <div className="text-sm text-[var(--zalama-gray)]/70">Mis à jour il y a 1 semaine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
