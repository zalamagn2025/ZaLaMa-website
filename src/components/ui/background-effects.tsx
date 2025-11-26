import React from 'react';

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grand halo bleu en haut à gauche */}
      {/* Grand halo bleu clair en haut à gauche */}
      <div 
        className="absolute w-[700px] h-[700px] -top-1/3 -left-1/3 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.35) 0%, rgba(147, 197, 253, 0) 70%)',
          filter: 'blur(90px)'
        }}
      />
      
      {/* Halo bleu clair en bas à droite */}
      <div 
        className="absolute w-[600px] h-[600px] -bottom-1/4 -right-1/4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.35) 0%, rgba(96, 165, 250, 0) 70%)',
          filter: 'blur(100px)'
        }}
      />
      
      {/* Lueur centrale plus prononcée */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.25) 0%, rgba(96, 165, 250, 0) 70%)',
          filter: 'blur(120px)'
        }}
      />
      
      {/* Effet de particules subtil */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(147, 197, 253, 0.2) 1px, transparent 1px)',
          backgroundSize: '25px 25px',
          opacity: 0.4
        }}
      />
    </div>
  );
};
