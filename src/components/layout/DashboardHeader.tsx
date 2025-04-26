"use client"
import { Bell, Sun, Moon } from 'lucide-react';
import React, { useState } from 'react';

export default function DashboardHeader() {
  const [dark, setDark] = useState(true);
  // TODO: Brancher sur le vrai context/theme global

  return (
    <header className="w-full h-18 flex items-center justify-between px-4 md:px-8 bg-[var(--zalama-header-blue)] border-b border-[var(--zalama-border)] shadow-sm sticky top-0 z-20">
      {/* Titre du dashboard */}
      <h1 className="text-xl font-bold text-white">Tableau de Bord</h1>
      {/* Bloc actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <button
          className="relative focus:outline-none"
          aria-label="Voir les notifications"
        >
          <Bell className="w-6 h-6 text-zinc-300" />
          <span className="animate-ping absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full px-1">3</span>
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors focus:outline-none"
          aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-zinc-200" />}
        </button>
      </div>
    </header>
  );
}

