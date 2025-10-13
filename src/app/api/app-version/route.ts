import { NextRequest, NextResponse } from 'next/server'

// Configuration des versions de l'application
// Version actuelle sur App Store: 1.0.2 (https://apps.apple.com/fr/app/zalama/id6752520885)
const APP_VERSION_CONFIG = {
  ios: {
    version: '2.0.12',
    buildNumber: '12',
    url: 'https://apps.apple.com/fr/app/zalama/id6752520885',
    releaseNotes: [
      'Design moderne et intuitif',
      'Performance améliorée (+40%)',
      'Corrections de bugs et stabilité renforcée',
      'Mode sombre optimisé',
      'Notifications push en temps réel',
      'Page Tarifs détaillée',
      'Gestion des appareils connectés',
      'Saisie automatique du code PIN'
    ]
  },
  android: {
      version: '2.0.12',
    buildNumber: '12',
    url: 'https://play.google.com/store/apps/details?id=com.zalama.mobile',
    releaseNotes: [
      '🎨 Nouveau design moderne et intuitif',
      '⚡ Performance améliorée de 40%',
      '🐛 Corrections de bugs et améliorations de stabilité',
      '🌙 Support du mode sombre optimisé',
      '🔔 Notifications push en temps réel',
      '📊 Page Tarifs avec informations détaillées',
      '🔐 Gestion des appareils connectés',
      '✨ Auto-submit du code PIN'
    ]
  },
  // Version minimale requise (en dessous, l'utilisateur est forcé de mettre à jour)
  minVersion: '1.0.0',
  // Force la mise à jour pour tous les utilisateurs
  forceUpdate: false
}

export async function GET(request: NextRequest) {
  try {
    console.log('📱 Vérification de version d\'application demandée')

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') // ios ou android
    const currentVersion = searchParams.get('version')

    console.log('🔍 Paramètres:', { platform, currentVersion })

    // Retourner la configuration complète
    const response = {
      success: true,
      data: {
        ...APP_VERSION_CONFIG,
        timestamp: new Date().toISOString(),
        // Informations additionnelles si version fournie
        ...(currentVersion && {
          updateAvailable: compareVersions(
            platform === 'ios' 
              ? APP_VERSION_CONFIG.ios.version 
              : APP_VERSION_CONFIG.android.version,
            currentVersion
          ) > 0,
          isUpdateRequired: compareVersions(currentVersion, APP_VERSION_CONFIG.minVersion) < 0
        })
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache 5 minutes
      }
    })

  } catch (error) {
    console.error('❌ Erreur lors de la vérification de version:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la vérification de version'
      },
      { status: 500 }
    )
  }
}

// Fonction pour comparer les versions (format: x.y.z)
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0
    const part2 = parts2[i] || 0

    if (part1 > part2) return 1
    if (part1 < part2) return -1
  }

  return 0
}

// Support OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

