'use client'
import React, { useState } from 'react';

export function SimpleTestButton() {
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [email, setEmail] = useState('');

  const switchToForgotPassword = () => {
    setIsForgotPasswordMode(true);
  };

  const switchToLogin = () => {
    setIsForgotPasswordMode(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isForgotPasswordMode ? 'Mot de passe oublié' : 'Connexion'}
        </h2>
        
        {!isForgotPasswordMode ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 border rounded"
            />
            
            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Se souvenir de moi
              </label>
              
              <button
                type="button"
                onClick={switchToForgotPassword}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            
            <button
              type="button"
              onClick={switchToForgotPassword}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              TEST: Mot de passe oublié
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
            />
            
            <button
              type="button"
              onClick={() => console.log('Envoyer email')}
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
            >
              Envoyer le lien de réinitialisation
            </button>
            
            <button
              type="button"
              onClick={switchToLogin}
              className="w-full bg-gray-600 text-white p-3 rounded hover:bg-gray-700"
            >
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 