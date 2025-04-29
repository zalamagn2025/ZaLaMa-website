import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

export default function StatistiquesGenerales() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Données pour le graphique en camembert
  const userTypeData = [
    { name: 'Étudiants', value: 45 },
    { name: 'Salariés', value: 40 },
    { name: 'Pensionnés', value: 15 },
  ];

  // Couleurs plus vives pour chaque segment
  const COLORS = ['#3b82f6', '#10b981', '#6366f1'];

  // Fonction pour le rendu des secteurs actifs
  const renderActiveShape = (props : any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="var(--zalama-text-light)" fontSize="16" fontWeight="bold">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="var(--zalama-text-light)" fontSize="14">
          {`${value}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_ : any, index : any) => {
    setActiveIndex(index);
  };

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
        
        {/* Graphique à droite - Recharts PieChart amélioré */}
        <div className="flex flex-col items-center mt-6 md:mt-0 md:w-1/2">
          <div className="h-50 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  stroke="var(--zalama-bg-dark)"
                  strokeWidth={2}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Proportion']}
                  contentStyle={{ 
                    backgroundColor: 'var(--zalama-bg-darker)', 
                    borderColor: 'var(--zalama-border)', 
                    color: 'var(--zalama-text-light)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'var(--zalama-text-light)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center">
            {userTypeData.map((entry, index) => (
              <div 
                key={`legend-${index}`} 
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setActiveIndex(index)}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm font-medium">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
