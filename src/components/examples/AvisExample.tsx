'use client';

import React, { useState, useEffect } from 'react';
import { useAvis } from '@/hooks/useAvis';
import { CreateAvisRequest } from '@/types/avis';

interface AvisExampleProps {
  accessToken: string;
}

export default function AvisExample({ accessToken }: AvisExampleProps) {
  const {
    avis,
    loading,
    error,
    stats,
    pagination,
    fetchAvis,
    createAvis,
    updateAvis,
    deleteAvis,
    getStats,
    canCreateAvis,
    clearError,
    setAccessToken
  } = useAvis(accessToken);

  const [formData, setFormData] = useState<CreateAvisRequest>({
    note: 5,
    commentaire: '',
    type_retour: 'positif'
  });

  const [editingAvis, setEditingAvis] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CreateAvisRequest>>({});
  const [limitInfo, setLimitInfo] = useState<any>(null);

  // Initialiser le token et charger les données
  useEffect(() => {
    setAccessToken(accessToken);
    fetchAvis();
    getStats();
    checkLimit();
  }, [accessToken]);

  const checkLimit = async () => {
    try {
      const limit = await canCreateAvis();
      setLimitInfo(limit);
    } catch (error) {
      console.error('Erreur lors de la vérification de la limite:', error);
    }
  };

  const handleCreateAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.commentaire.trim()) {
      alert('Le commentaire est requis');
      return;
    }

    try {
      await createAvis(formData);
      setFormData({ note: 5, commentaire: '', type_retour: 'positif' });
      await checkLimit();
      alert('Avis créé avec succès !');
    } catch (error) {
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inattendue'}`);
    }
  };

  const handleUpdateAvis = async (id: string) => {
    try {
      await updateAvis(id, editData);
      setEditingAvis(null);
      setEditData({});
      alert('Avis mis à jour avec succès !');
    } catch (error) {
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inattendue'}`);
    }
  };

  const handleDeleteAvis = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        await deleteAvis(id);
        await checkLimit();
        alert('Avis supprimé avec succès !');
      } catch (error) {
        alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inattendue'}`);
      }
    }
  };

  const startEditing = (avis: any) => {
    setEditingAvis(avis.id);
    setEditData({
      note: avis.note,
      commentaire: avis.commentaire,
      type_retour: avis.type_retour
    });
  };

  if (loading && avis.length === 0) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Gestion des Avis</h1>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Statistiques */}
      {stats && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Statistiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_avis}</div>
              <div className="text-sm text-gray-600">Total avis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.moyenne_note.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Moyenne note</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.avis_positifs}</div>
              <div className="text-sm text-gray-600">Avis positifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.avis_negatifs}</div>
              <div className="text-sm text-gray-600">Avis négatifs</div>
            </div>
          </div>
        </div>
      )}

      {/* Limite quotidienne */}
      {limitInfo && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📈 Limite quotidienne</h3>
          <div className="flex items-center space-x-4">
            <span>Avis aujourd'hui: {limitInfo.currentCount}/{limitInfo.limit}</span>
            <span className="text-sm text-gray-600">
              ({limitInfo.remaining} restants)
            </span>
            {!limitInfo.canPost && (
              <span className="text-red-600 font-semibold">
                Limite atteinte pour aujourd'hui
              </span>
            )}
          </div>
        </div>
      )}

      {/* Formulaire de création */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📝 Créer un nouvel avis</h2>
        <form onSubmit={handleCreateAvis} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (1-5)
            </label>
            <select
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              {[1, 2, 3, 4, 5].map(note => (
                <option key={note} value={note}>{note} étoile{note > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire
            </label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Votre commentaire..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de retour
            </label>
            <select
              value={formData.type_retour}
              onChange={(e) => setFormData({ ...formData, type_retour: e.target.value as 'positif' | 'negatif' })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="positif">Positif</option>
              <option value="negatif">Négatif</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || (limitInfo && !limitInfo.canPost)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Création...' : 'Créer l\'avis'}
          </button>
        </form>
      </div>

      {/* Liste des avis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📋 Mes avis ({avis.length})</h2>
        
        {avis.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun avis trouvé</p>
        ) : (
          <div className="space-y-4">
            {avis.map((avis) => (
              <div key={avis.id} className="border border-gray-200 p-4 rounded-lg">
                {editingAvis === avis.id ? (
                  // Mode édition
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <select
                        value={editData.note || avis.note}
                        onChange={(e) => setEditData({ ...editData, note: Number(e.target.value) })}
                        className="p-1 border border-gray-300 rounded"
                      >
                        {[1, 2, 3, 4, 5].map(note => (
                          <option key={note} value={note}>{note}</option>
                        ))}
                      </select>
                      <select
                        value={editData.type_retour || avis.type_retour}
                        onChange={(e) => setEditData({ ...editData, type_retour: e.target.value as 'positif' | 'negatif' })}
                        className="p-1 border border-gray-300 rounded"
                      >
                        <option value="positif">Positif</option>
                        <option value="negatif">Négatif</option>
                      </select>
                    </div>
                    <textarea
                      value={editData.commentaire || avis.commentaire}
                      onChange={(e) => setEditData({ ...editData, commentaire: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateAvis(avis.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => {
                          setEditingAvis(null);
                          setEditData({});
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  // Mode affichage
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">{avis.note}/5</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          avis.type_retour === 'positif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {avis.type_retour}
                        </span>
                        {avis.approuve && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Approuvé
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(avis)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteAvis(avis.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{avis.commentaire}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(avis.date_avis).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => fetchAvis({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:bg-gray-100"
            >
              Précédent
            </button>
            <span className="px-3 py-1">
              Page {pagination.page} sur {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchAvis({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:bg-gray-100"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
