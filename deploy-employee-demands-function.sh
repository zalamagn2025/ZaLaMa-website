#!/bin/bash

# Script pour déployer l'Edge Function employee-demands
# Assurez-vous d'avoir Supabase CLI installé et d'être connecté

echo "🚀 Déploiement de l'Edge Function employee-demands..."

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé. Installez-le d'abord:"
    echo "npm install -g supabase"
    exit 1
fi

# Vérifier si on est connecté à Supabase
if ! supabase status &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à Supabase. Connectez-vous d'abord:"
    echo "supabase login"
    exit 1
fi

# Déployer la fonction
echo "📦 Déploiement de la fonction employee-demands..."
supabase functions deploy employee-demands

if [ $? -eq 0 ]; then
    echo "✅ Edge Function employee-demands déployée avec succès!"
    echo ""
    echo "🔗 URL de la fonction:"
    echo "https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-demands"
    echo ""
    echo "📋 Endpoints disponibles:"
    echo "- POST /cancel - Annuler une demande"
    echo "- GET /list - Liste des demandes"
    echo "- GET /stats - Statistiques des demandes"
    echo "- POST /create - Créer une demande"
    echo ""
    echo "🧪 Vous pouvez maintenant tester l'annulation des demandes!"
else
    echo "❌ Erreur lors du déploiement de la fonction"
    exit 1
fi
