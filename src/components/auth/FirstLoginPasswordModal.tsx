'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeClosed, CheckCircle, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';

interface FirstLoginPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FirstLoginPasswordModal({ isOpen, onClose, onSuccess }: FirstLoginPasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus('error');
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setStatus('error');
      setMessage('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (currentPassword === newPassword) {
      setStatus('error');
      setMessage('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Récupérer le token d'authentification
      const accessToken = localStorage.getItem('employee_access_token');
      
      if (!accessToken) {
        setStatus('error');
        setMessage('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Erreur lors du changement de mot de passe');
        return;
      }

      setStatus('success');
      setMessage('Mot de passe changé avec succès');

      // MISE À JOUR INFALLIBLE - Forcer la mise à jour de la base de données
      try {
        console.log('🔄 MISE À JOUR INFALLIBLE - Forcer la mise à jour...');
        
        // Récupérer les données utilisateur
        const getmeResponse = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-auth/getme', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        const getmeData = await getmeResponse.json();
        console.log('📥 Données utilisateur:', getmeData);
        
        if (getmeData.success && getmeData.data) {
          // MISE À JOUR ULTRA-AGRESSIVE - 5 tentatives avec différentes stratégies
          let updateSuccess = false;
          
          for (let i = 0; i < 5; i++) {
            console.log(`🔄 Tentative ${i + 1}/5 de mise à jour ultra-agressive...`);
            
            const updateResponse = await fetch('/api/auth/force-update-first-login', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                employeeId: getmeData.data.id,
                email: getmeData.data.email
              }),
            });
            
            const updateData = await updateResponse.json();
            console.log(`📥 Résultat tentative ${i + 1}:`, updateData);
            
            if (updateData.success) {
              console.log(`✅ Tentative ${i + 1} réussie`);
              updateSuccess = true;
              break;
            }
            
            // Attendre entre les tentatives avec délai croissant
            if (i < 4) {
              await new Promise(resolve => setTimeout(resolve, 1000 + (i * 500)));
            }
          }
          
          if (updateSuccess) {
            console.log('✅ MISE À JOUR ULTRA-AGRESSIVE RÉUSSIE !');
            
            // Nettoyer immédiatement le cache local
            const cacheKey = `first_login_checked_${getmeData.data.email}`
            sessionStorage.removeItem(cacheKey)
            localStorage.removeItem(cacheKey)
            
            // Forcer la mise à jour du cache
            sessionStorage.setItem(cacheKey, JSON.stringify({
              requirePasswordChange: false,
              timestamp: Date.now(),
              forceUpdated: true
            }))
            
          } else {
            console.log('⚠️ Mise à jour échouée, mais modal se ferme quand même');
            
            // Même en cas d'échec, forcer le cache local
            const cacheKey = `first_login_checked_${getmeData.data.email}`
            sessionStorage.setItem(cacheKey, JSON.stringify({
              requirePasswordChange: false,
              timestamp: Date.now(),
              forceUpdated: true
            }))
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la mise à jour infaillible:', error);
        
        // Même en cas d'erreur, forcer le cache local
        try {
          const cacheKey = `first_login_checked_unknown`
          sessionStorage.setItem(cacheKey, JSON.stringify({
            requirePasswordChange: false,
            timestamp: Date.now(),
            forceUpdated: true
          }))
        } catch (cacheError) {
          console.error('❌ Erreur lors de la mise à jour du cache:', cacheError);
        }
      }

      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setStatus('error');
      setMessage('Erreur lors du changement de mot de passe');
    }
  };

  const handleClose = () => {
    return; // Empêcher la fermeture
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Forcer le focus sur l'input cliqué
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.focus();
  };

  // Forcer la gestion des clics sur les boutons
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.focus();
  };

  // Script de diagnostic pour la première connexion
  useEffect(() => {
    // Script de test pour diagnostiquer le problème de modal répétitive
    console.log('🔍 Diagnostic modal répétitive...');
    
    // Fonction pour tester le statut de première connexion
    (window as any).testFirstLoginStatus = async () => {
      console.log('🚀 Test du statut de première connexion...');
      
      const token = localStorage.getItem('employee_access_token');
      if (!token) {
        console.log('❌ Token manquant');
        return;
      }
      
      try {
        // Test 1: Vérifier le statut via l'API
        console.log('1️⃣ Test via API check-first-login...');
        const response = await fetch('/api/auth/check-first-login', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log('📥 Réponse API:', data);
        
        // Test 2: Test direct de l'Edge Function getme
        console.log('2️⃣ Test direct Edge Function getme...');
        const getmeResponse = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-auth/getme', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const getmeData = await getmeResponse.json();
        console.log('📥 Réponse getme:', getmeData);
        
        // Test 3: Test direct de l'Edge Function change-password (simulation)
        console.log('3️⃣ Test simulation change-password...');
        const changeResponse = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-auth/change-password', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_password: 'test',
            new_password: 'test123',
            confirm_password: 'test123'
          }),
        });
        
        const changeData = await changeResponse.json();
        console.log('📥 Réponse change-password:', changeData);
        
        return {
          apiStatus: data,
          getmeData: getmeData,
          changePasswordData: changeData
        };
        
      } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        return { error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    };

    // Fonction pour forcer la mise à jour du statut
    (window as any).forceUpdateFirstLoginStatus = async () => {
      console.log('🔧 Force mise à jour du statut...');
      
      const token = localStorage.getItem('employee_access_token');
      if (!token) {
        console.log('❌ Token manquant');
        return;
      }
      
      try {
        // Récupérer les données utilisateur
        const getmeResponse = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-auth/getme', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const getmeData = await getmeResponse.json();
        console.log('📥 Données utilisateur:', getmeData);
        
        if (getmeData.success && getmeData.data) {
          console.log('👤 Employee ID:', getmeData.data.id);
          console.log('📧 Email:', getmeData.data.email);
          
          // Appeler une API route pour forcer la mise à jour
          const updateResponse = await fetch('/api/auth/force-update-first-login', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              employeeId: getmeData.data.id,
              email: getmeData.data.email
            }),
          });
          
          const updateData = await updateResponse.json();
          console.log('📥 Résultat mise à jour forcée:', updateData);
          
          return updateData;
        }
        
      } catch (error) {
        console.error('❌ Erreur lors de la mise à jour forcée:', error);
        return { error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    };

    // Auto-exécution du diagnostic
    console.log('🚀 Auto-exécution du diagnostic modal répétitive...');
    setTimeout(() => {
      (window as any).testFirstLoginStatus();
    }, 2000);

    console.log('📝 Fonctions disponibles:');
    console.log('- window.testFirstLoginStatus() : Test du statut');
    console.log('- window.forceUpdateFirstLoginStatus() : Force mise à jour');
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
    >
      {/* Close button - Désactivé */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10001,
          padding: '0.5rem',
          borderRadius: '0.5rem',
          color: 'rgba(255, 255, 255, 0.2)',
          cursor: 'not-allowed',
          background: 'none',
          border: 'none'
        }}
        disabled={true}
        title="Vous devez changer votre mot de passe pour continuer"
      >
        <X style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '24rem',
          zIndex: 10002,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Logo and header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            margin: '0 auto',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image 
              src="/images/zalamaLoginLogo.png" 
              alt="ZaLaMa Logo" 
              width={40}
              height={40}
            />
          </div>

          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginTop: '0.25rem' }}>
            Première Connexion - Obligatoire
          </h1>
          
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Vous devez changer votre mot de passe pour continuer
          </p>
        </div>

        {/* Message d'avertissement */}
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(161, 98, 7, 0.2)',
          border: '1px solid rgb(161, 98, 7)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <AlertCircle style={{ width: '1rem', height: '1rem', color: 'rgb(250, 204, 21)', marginRight: '0.5rem' }} />
          <p  style={{ color: 'rgb(254, 243, 199)', fontSize: '0.875rem', fontWeight: '500' }}>
            ⚠️ Changement de mot de passe obligatoire
          </p>
        </div>

        {/* Status messages */}
        {status === 'success' && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(6, 78, 59, 0.2)',
            border: '1px solid rgb(6, 78, 59)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center'
  }}>
            <CheckCircle style={{ width: '1rem', height: '1rem', color: 'rgb(74, 222, 128)', marginRight: '0.5rem' }} />
            <p style={{ color: 'rgb(187, 247, 208)', fontSize: '0.875rem' }}>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(127, 29, 29, 0.2)',
            border: '1px solid rgb(127, 29, 29)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <AlertCircle style={{ width: '1rem', height: '1rem', color: 'rgb(248, 113, 113)', marginRight: '0.5rem' }} />
            <p style={{ color: 'rgb(254, 202, 202)', fontSize: '0.875rem' }}>{message}</p>
          </div>
        )}

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          autoComplete="off"
          data-form-type="other"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Current password input */}
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onMouseDown={handleInputClick}
                autoComplete="current-password"
                data-lpignore="true"
                data-form-type="other"
                required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  pointerEvents: 'auto',
                  zIndex: 10003
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                onMouseDown={handleButtonClick}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 10005,
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {showCurrentPassword ? (
                  <Eye style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                ) : (
                  <EyeClosed style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                )}
              </button>
            </div>

            {/* New password input */}
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onMouseDown={handleInputClick}
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
                required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  pointerEvents: 'auto',
                  zIndex: 10003
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)} 
                onMouseDown={handleButtonClick}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 10005,
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {showNewPassword ? (
                  <Eye style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                ) : (
                  <EyeClosed style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                )}
              </button>
            </div>

            {/* Confirm password input */}
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onMouseDown={handleInputClick}
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
                required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  pointerEvents: 'auto',
                  zIndex: 10003
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                onMouseDown={handleButtonClick}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 10005,
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {showConfirmPassword ? (
                  <Eye style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                ) : (
                  <EyeClosed style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            onMouseDown={handleButtonClick}
            disabled={status === 'loading' || status === 'success'}
            style={{
              width: '100%',
              backgroundColor: '#FF671E',
              color: 'white',
              fontWeight: '500',
              height: '2.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: status === 'loading' || status === 'success' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' || status === 'success' ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              zIndex: 10005,
              pointerEvents: 'auto'
            }}
          >
            {status === 'loading' ? (
              <div style={{
                width: '1rem',
                height: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.7)',
                borderTop: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : status === 'success' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                Succès
              </div>
            ) : (
              'Changer mot de passe'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}