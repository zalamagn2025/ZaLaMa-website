'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    legalRepresentative: '',
    position: '',
    headquartersAddress: '',
    phone: '',
    email: '',
    employeesCount: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
    // Logique d'envoi à l'API
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 rounded-3xl shadow-2xl backdrop-blur-lg bg-blue-900/10 border border-blue-700"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 mb-3">
          Formulaire de Partenariat
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Raison sociale */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
              RAISON SOCIALE
            </label>
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
            />
          </motion.div>
          
          {/* Représentant légal */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
              REPRÉSENTANT LÉGAL
            </label>
            <Input
              name="legalRepresentative"
              value={formData.legalRepresentative}
              onChange={handleChange}
              required
              className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
            />
          </motion.div>
        </div>

        {/* Fonction */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
            FONCTION
          </label>
          <Input
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
          />
        </motion.div>

        {/* Adresse */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
            ADRESSE DU SIÈGE
          </label>
          <Input
            name="headquartersAddress"
            value={formData.headquartersAddress}
            onChange={handleChange}
            required
            className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Téléphone */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
              TÉLÉPHONE
            </label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
            />
          </motion.div>
          
          {/* Email */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
              EMAIL PROFESSIONNEL
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
            />
          </motion.div>
        </div>

        {/* Nombre employés */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-semibold text-blue-100 mb-2 tracking-wide">
            NOMBRE D&apos;EMPLOYÉS
          </label>
          <Input
            name="employeesCount"
            type="number"
            value={formData.employeesCount}
            onChange={handleChange}
            required
            className="bg-blue-950/50 border-blue-700 text-white placeholder-blue-400 h-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent px-3"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="pt-4"
        >
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:shadow-orange-500/30 px-4"
          >
            SOUMETTRE LA DEMANDE
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};