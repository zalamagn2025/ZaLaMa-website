'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    legalStatus: '',
    rccm: '',
    nif: '',
    legalRepresentative: '',
    position: '',
    headquartersAddress: '',
    phone: '',
    email: '',
    employeesCount: '',
    payroll: '',
    cdiCount: '',
    cddCount: '',
    agreement: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📤 Envoi des données de partenariat:', formData);

      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la soumission');
      }

      const result = await response.json();
      console.log('✅ Demande envoyée avec succès:', result);
      
      setSuccess(true);
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setFormData({
          companyName: '',
          legalStatus: '',
          rccm: '',
          nif: '',
          legalRepresentative: '',
          position: '',
          headquartersAddress: '',
          phone: '',
          email: '',
          employeesCount: '',
          payroll: '',
          cdiCount: '',
          cddCount: '',
          agreement: false
        });
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('❌ Erreur lors de l\'envoi:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-blue-900/10 border border-blue-700/80"
    >
      {/* Bouton de retour avec animation */}
      <motion.div 
        whileHover={{ x: -3 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="mb-8"
      >
        <Link href="http://localhost:3001/partnership" passHref>
          <Button variant="ghost" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Retour aux partenariats</span>
          </Button>
        </Link>
      </motion.div>

      {/* Titre stylisé avec animations */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.h2 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400 mb-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Devenez Partenaire
        </motion.h2>
        <motion.p 
          className="text-blue-300/90 text-sm max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Remplissez ce formulaire pour initier un partenariat stratégique avec notre organisation
        </motion.p>
        <motion.div 
          className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mt-5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        />
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Nom de l'entreprise */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ 
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300 }
          }}
        >
          <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
            Nom de l&apos;entreprise
          </label>
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
          />
        </motion.div>

        {/* Tous les autres champs avec la même structure animée */}
        {/* Raison sociale */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ 
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300 }
          }}
        >
          <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
            Raison sociale
          </label>
          <Input
            name="legalStatus"
            value={formData.legalStatus}
            onChange={handleChange}
            required
            className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
          />
        </motion.div>

        {/* RCCM et NIF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
              RCCM
            </label>
            <Input
              name="rccm"
              value={formData.rccm}
              onChange={handleChange}
              required
              className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
              NIF
            </label>
            <Input
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              required
              className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
            />
          </motion.div>
        </div>

        {/* Représentant légal */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ 
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300 }
          }}
        >
          <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
            Représentant légal
          </label>
          <Input
            name="legalRepresentative"
            value={formData.legalRepresentative}
            onChange={handleChange}
            required
            className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
          />
        </motion.div>

        {/* Fonction */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          whileHover={{ 
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300 }
          }}
        >
          <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
            Fonction
          </label>
          <Input
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
          />
        </motion.div>

        {/* Adresse */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ 
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300 }
          }}
        >
          <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
            Adresse du siège
          </label>
          <Input
            name="headquartersAddress"
            value={formData.headquartersAddress}
            onChange={handleChange}
            required
            className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
          />
        </motion.div>

        {/* Téléphone et Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
              Téléphone
            </label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
              Email professionnel
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
            />
          </motion.div>
        </div>

        {/* Informations sur les employés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
              Nombre d&apos;employés
            </label>
            <Input
              name="employeesCount"
              type="number"
              value={formData.employeesCount}
              onChange={handleChange}
              required
              className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ 
              scale: 1.01,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
              Masse salariale
            </label>
            <Input
              name="payroll"
              type="text"
              value={formData.payroll}
              onChange={handleChange}
              required
              className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              whileHover={{ 
                scale: 1.01,
                transition: { type: 'spring', stiffness: 300 }
              }}
            >
              <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                CDI
              </label>
              <Input
                name="cdiCount"
                type="number"
                value={formData.cdiCount}
                onChange={handleChange}
                required
                className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ 
                scale: 1.01,
                transition: { type: 'spring', stiffness: 300 }
              }}
            >
              <label className="block text-sm font-medium text-blue-100/90 mb-2 tracking-wide">
                CDD
              </label>
              <Input
                name="cddCount"
                type="number"
                value={formData.cddCount}
                onChange={handleChange}
                required
                className="bg-blue-950/30 border-blue-700/70 text-white placeholder-blue-400/60 h-11 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent px-4 transition-all"
              />
            </motion.div>
          </div>
        </div>

        {/* Lettre d'engagement */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          whileHover={{ 
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300 }
          }}
          className="pt-6"
        >
          <div className="flex items-start bg-blue-950/20 p-4 rounded-xl border border-blue-700/50">
            <div className="flex items-center h-5 mt-1">
              <input
                id="agreement"
                name="agreement"
                type="checkbox"
                checked={formData.agreement}
                onChange={handleChange}
                required
                className="focus:ring-orange-500 h-5 w-5 text-orange-500 border-blue-700 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="agreement" className="font-medium text-blue-100/90 text-sm leading-snug">
                Je m&apos;engage à coopérer pleinement dans le cadre de ce partenariat et à fournir toutes les informations nécessaires à la réussite de notre collaboration.
              </label>
            </div>
          </div>
        </motion.div>

        {/* Messages d'état */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
          >
            ✅ Votre demande de partenariat a été envoyée avec succès ! Nous vous contacterons bientôt.
          </motion.div>
        )}

        {/* Bouton de soumission */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          whileHover={{ 
            scale: 1.02,
            transition: { type: 'spring', stiffness: 300 }
          }}
          whileTap={{ scale: 0.98 }}
          className="pt-6"
        >
          <Button
            type="submit"
            disabled={loading || success}
            className="w-full h-14 rounded-xl text-base font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi en cours...</span>
              </>
            ) : success ? (
              <>
                <span className="drop-shadow-sm">Demande envoyée ✓</span>
              </>
            ) : (
              <>
                <span className="drop-shadow-sm">Soumettre la demande</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
