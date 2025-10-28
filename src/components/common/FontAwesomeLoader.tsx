'use client';

import { useEffect } from 'react';

export function FontAwesomeLoader() {
  useEffect(() => {
    // Créer un élément link pour Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    
    // Ajouter le lien au document
    document.head.appendChild(link);
    
    // Nettoyage lors du démontage du composant
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null; // Ce composant ne rend rien
}
