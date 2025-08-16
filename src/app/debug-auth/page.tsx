"use client";

import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { employeeAuthService } from '@/lib/apiEmployeeAuth';

export default function DebugAuthPage() {
  const { employee, isAuthenticated } = useEmployeeAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkAuthStatus = () => {
      const info: any = {
        // État du contexte
        contextEmployee: employee ? 'Présent' : 'Absent',
        contextIsAuthenticated: isAuthenticated,
        
        // Tokens dans localStorage
        accessToken: localStorage.getItem('employee_access_token') ? 'Présent' : 'Absent',
        refreshToken: localStorage.getItem('employee_refresh_token') ? 'Présent' : 'Absent',
        
        // Service
        serviceIsAuthenticated: employeeAuthService.isAuthenticated(),
        serviceAccessToken: employeeAuthService.getAccessToken() ? 'Présent' : 'Absent',
      };

      // Décoder le token si présent
      const token = localStorage.getItem('employee_access_token');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          
          const currentTime = Math.floor(Date.now() / 1000);
          info.tokenExpired = payload.exp < currentTime;
          info.tokenExpiry = new Date(payload.exp * 1000).toLocaleString();
          info.tokenIssued = new Date(payload.iat * 1000).toLocaleString();
          info.tokenUserId = payload.sub;
          info.tokenEmail = payload.email;
                 } catch (error) {
           info.tokenError = error instanceof Error ? error.message : String(error);
         }
      }

      setDebugInfo(info);
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 2000);
    return () => clearInterval(interval);
  }, [employee, isAuthenticated]);

  const clearTokens = () => {
    localStorage.removeItem('employee_access_token');
    localStorage.removeItem('employee_refresh_token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug - État d'Authentification</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* État du Contexte */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📋 État du Contexte</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Employee:</span>
                <span className={debugInfo.contextEmployee === 'Présent' ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.contextEmployee}
                </span>
              </div>
              <div className="flex justify-between">
                <span>isAuthenticated:</span>
                <span className={debugInfo.contextIsAuthenticated ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.contextIsAuthenticated ? '✅ OUI' : '❌ NON'}
                </span>
              </div>
            </div>
          </div>

          {/* Tokens localStorage */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🔐 Tokens localStorage</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Access Token:</span>
                <span className={debugInfo.accessToken === 'Présent' ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.accessToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Refresh Token:</span>
                <span className={debugInfo.refreshToken === 'Présent' ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.refreshToken}
                </span>
              </div>
            </div>
          </div>

          {/* Service */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">⚙️ Service</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>isAuthenticated():</span>
                <span className={debugInfo.serviceIsAuthenticated ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.serviceIsAuthenticated ? '✅ OUI' : '❌ NON'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>getAccessToken():</span>
                <span className={debugInfo.serviceAccessToken === 'Présent' ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.serviceAccessToken}
                </span>
              </div>
            </div>
          </div>

          {/* Détails du Token */}
          {debugInfo.accessToken === 'Présent' && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">🔍 Détails du Token</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Expiré:</span>
                  <span className={debugInfo.tokenExpired ? 'text-red-400' : 'text-green-400'}>
                    {debugInfo.tokenExpired ? '❌ OUI' : '✅ NON'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expire le:</span>
                  <span className="text-yellow-400">{debugInfo.tokenExpiry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Émis le:</span>
                  <span className="text-blue-400">{debugInfo.tokenIssued}</span>
                </div>
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span className="text-purple-400">{debugInfo.tokenUserId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-cyan-400">{debugInfo.tokenEmail}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🛠️ Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={clearTokens}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              🗑️ Effacer les Tokens
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              🔄 Actualiser
            </button>
            <a
              href="/login"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              🔐 Aller à la Connexion
            </a>
            <a
              href="/auth/change-password"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              🔑 Tester Changement MDP
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">💡 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Si les tokens sont absents, allez à la page de connexion</li>
            <li>Si le token est expiré, reconnectez-vous</li>
            <li>Si tout semble correct mais que ça ne marche pas, effacez les tokens et reconnectez-vous</li>
            <li>Vérifiez que l'Edge Function employee-auth a bien la route change-password</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
