import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
}

export default function StatCard({ label, value, icon, accent = 'bg-blue-600' }: StatCardProps) {
  return (
    <div className={`flex items-center gap-4 p-6 rounded-xl shadow-md bg-zinc-900 border border-zinc-800 min-w-[200px]`}>  
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${accent} bg-opacity-20 text-blue-400 text-2xl`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
        <div className="text-zinc-400 text-sm">{label}</div>
      </div>
    </div>
  );
}
