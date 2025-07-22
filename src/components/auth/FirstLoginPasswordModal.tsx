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
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
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