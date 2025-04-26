import StatCard from '@/components/Dashboard/StatCard';
import { Users, BarChart2, PieChart, AlertCircle } from 'lucide-react';

const stats = [
  { label: "Utilisateurs inscrits", value: 25840, icon: <Users />, accent: "bg-blue-600" },
  { label: "Montant avancé (€)", value: "1 200 000", icon: <BarChart2 />, accent: "bg-blue-600" },
  { label: "Demandes ce mois", value: 1240, icon: <PieChart />, accent: "bg-blue-600" },
  { label: "Alertes actives", value: 3, icon: <AlertCircle />, accent: "bg-red-600" },
];

export default function EntrepriseDashboardHome() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="card p-6 mt-6">
        <h2 className="text-blue text-lg font-semibold mb-4">Bienvenue sur le dashboard ZaLaMa Entreprise !</h2>
        <p>Retrouvez ici toutes les statistiques et informations clés sur vos utilisateurs, finances, services, partenaires, alertes et performances.</p>
      </div>
    </div>
  );
}
