import StatCard from '@/components/Dashboard/StatCard';
import { Users, UserCheck, UserX, Smile } from 'lucide-react';

const stats = [
  { label: "Total inscrits", value: 25840, icon: <Users />, accent: "bg-blue-600" },
  { label: "Actifs ce mois", value: 5200, icon: <UserCheck />, accent: "bg-green-600" },
  { label: "Nouveaux inscrits", value: 870, icon: <Smile />, accent: "bg-purple-600" },
  { label: "Utilisateurs bloqués", value: 12, icon: <UserX />, accent: "bg-red-600" },
];

const users = [
  { nom: 'Jean Dupont', email: 'jean@zalama.com', statut: 'Actif', satisfaction: 4.8 },
  { nom: 'Marie Diallo', email: 'marie@zalama.com', statut: 'Actif', satisfaction: 4.5 },
  { nom: 'Ali Traoré', email: 'ali@zalama.com', statut: 'Bloqué', satisfaction: 3.2 },
  { nom: 'Fatou Camara', email: 'fatou@zalama.com', statut: 'Actif', satisfaction: 4.9 },
];

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-blue mb-4">Utilisateurs inscrits</h1>
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      {/* Filtres mock */}
      <div className="card p-4 flex flex-wrap gap-4 items-center mt-6 bg-[#223056] border-[#29345c]">
        <input placeholder="Rechercher par nom ou email..." className="bg-[#1a2236] border border-[#29345c] rounded px-4 py-2 text-zalama-gray focus:outline-none w-64" />
        <select className="bg-[#1a2236] border border-[#29345c] rounded px-4 py-2 text-zalama-gray">
          <option>Statut</option>
          <option>Actif</option>
          <option>Bloqué</option>
        </select>
      </div>
      {/* Tableau utilisateurs mock */}
      <div className="card p-0 mt-6 overflow-x-auto bg-[#223056] border-[#29345c]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#223056] text-blue">
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Statut</th>
              <th className="py-3 px-4 text-left">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-[#29345c] hover:bg-[#202946]">
                <td className="py-2 px-4">{u.nom}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.statut === 'Actif' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{u.statut}</span>
                </td>
                <td className="py-2 px-4">{u.satisfaction} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}