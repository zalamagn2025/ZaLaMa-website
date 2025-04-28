"use client";
import React from 'react';


import StatistiquesGenerales from '@/components/dashboard/StatistiquesGenerales';
import PerformanceFinanciere from '@/components/dashboard/PerformanceFinanciere';
import ActiviteParPartenaires from '@/components/dashboard/ActiviteParPartenaires';
import ActiviteParService from '@/components/dashboard/ActiviteParService';
import DonneesUtilisateurs from '@/components/dashboard/DonneesUtilisateurs';
import AlertesRisques from '@/components/dashboard/AlertesRisques';
import GraphiquesVisualisations from '@/components/dashboard/GraphiquesVisualisations';
import ObjectifsPerformances from '@/components/dashboard/ObjectifsPerformances';

export default function DashboardPage() {
  

  return (
    <div className="dashboard-container">
      {/*Statistiques Generales */}
      <StatistiquesGenerales />
      
      
      {/* Performance financière */}
      <PerformanceFinanciere />
      
      
      {/* Activité des partenaires */}
      <ActiviteParPartenaires />
      
      
      {/* Activité par service */}
      <ActiviteParService />
      
      {/* Données Utilisateurs */}
      <DonneesUtilisateurs />
      
      
      {/* Alertes et notifications */}
      <AlertesRisques />
      
      {/* Graphiques & Visualisations */}
      <GraphiquesVisualisations />

      {/* Objectifs & Performances */}
      <ObjectifsPerformances />
      
    </div>
  );
}
