import { Metadata } from 'next';

// Configuration de base pour toutes les métadonnées
const baseMetadata: Metadata = {
  metadataBase: new URL('https://www.zalamagn.com'),
  title: {
    default: 'ZaLaMa - La Fintech des Avances sur Salaire',
    template: '%s | ZaLaMa'
  },
  description: 'ZaLaMa est une solution fintech innovante qui permet aux salariés d\'accéder facilement à une avance sur salaire, sans stress, en toute sécurité.',
  keywords: [
    'ZaLaMa',
    'avance sur salaire',
    'fintech',
    'Guinée',
    'prêt salarié',
    'finance',
    'mobile money',
    'conseil financier',
    'marketing',
    'partenariat'
  ],
  authors: [{ name: 'ZaLaMa SAS' }],
  creator: 'ZaLaMa SAS',
  publisher: 'ZaLaMa SAS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // À remplacer par le vrai code
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.zalamagn.com',
    siteName: 'ZaLaMa',
    title: 'ZaLaMa - La Fintech des Avances sur Salaire',
    description: 'Solution fintech innovante pour les avances sur salaire en Guinée',
    images: [
      {
        url: '/images/zalamaOGimg.png',
        width: 1200,
        height: 630,
        alt: 'ZaLaMa - Plateforme d\'avances sur salaire',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZaLaMa - La Fintech des Avances sur Salaire',
    description: 'Solution fintech innovante pour les avances sur salaire en Guinée',
    images: ['/images/zalamaOGimg.png'],
    creator: '@zalama',
    site: '@zalama',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  category: 'finance',
};

// Métadonnées spécifiques pour chaque page
export const pageMetadata = {
  home: {
    title: 'Accueil',
    description: 'Découvrez ZaLaMa, la solution fintech innovante pour les avances sur salaire en Guinée. Accès rapide à 25% de votre salaire, conseil financier IA et services marketing.',
    keywords: ['accueil', 'ZaLaMa', 'avance sur salaire', 'fintech', 'Guinée'],
    openGraph: {
      title: 'ZaLaMa - La Fintech des Avances sur Salaire',
      description: 'Solution fintech innovante pour les avances sur salaire en Guinée',
    },
  },

  about: {
    title: 'À propos de ZaLaMa',
    description: 'Découvrez l\'histoire, la mission et les valeurs de ZaLaMa. Une fintech innovante dédiée à l\'inclusion financière en Guinée.',
    keywords: ['à propos', 'histoire', 'mission', 'valeurs', 'équipe', 'ZaLaMa'],
    openGraph: {
      title: 'À propos de ZaLaMa - Notre Mission',
      description: 'Découvrez l\'histoire et la mission de ZaLaMa, fintech innovante pour l\'inclusion financière',
    },
  },

  services: {
    title: 'Nos Services',
    description: 'Découvrez tous nos services : avance sur salaire, conseil financier IA, marketing et publicité. Solutions complètes pour entreprises et particuliers.',
    keywords: ['services', 'avance sur salaire', 'conseil financier', 'marketing', 'publicité'],
    openGraph: {
      title: 'Nos Services - ZaLaMa',
      description: 'Services complets : avance sur salaire, conseil financier IA, marketing et publicité',
    },
  },

  avanceSurSalaire: {
    title: 'Avance sur salaire',
    description: 'Accédez rapidement à 25% de votre salaire avant la date de paie officielle. Traitement en moins de 10 minutes, frais transparents de 6,5%.',
    keywords: ['avance sur salaire', 'prêt salarié', 'finance', 'mobile money', 'Guinée'],
    openGraph: {
      title: 'Avance sur salaire - ZaLaMa',
      description: 'Accédez à 25% de votre salaire en moins de 10 minutes. Frais transparents de 6,5%.',
    },
  },

  conseilFinancier: {
    title: 'Conseil financier',
    description: 'Accompagnement personnalisé par IA pour optimiser vos finances, gérer vos dépenses et planifier votre avenir financier. Service gratuit 24/7.',
    keywords: ['conseil financier', 'IA', 'gestion finances', 'budget', 'épargne'],
    openGraph: {
      title: 'Conseil financier IA - ZaLaMa',
      description: 'Accompagnement personnalisé par IA pour optimiser vos finances. Service gratuit 24/7.',
    },
  },

  marketing: {
    title: 'Marketing & Publicité',
    description: 'Plateforme publicitaire innovante pour connecter les entreprises à une audience qualifiée et engagée. Ciblage intelligent et analyses en temps réel.',
    keywords: ['marketing', 'publicité', 'ciblage', 'visibilité', 'plateforme publicitaire'],
    openGraph: {
      title: 'Marketing & Publicité - ZaLaMa',
      description: 'Plateforme publicitaire innovante avec ciblage intelligent et analyses temps réel',
    },
  },

  partnership: {
    title: 'Partenariat',
    description: 'Rejoignez le réseau de partenaires ZaLaMa. Bénéficiez de nos services fintech et développez votre activité avec notre plateforme innovante.',
    keywords: ['partenariat', 'réseau', 'partenaires', 'collaboration', 'développement'],
    openGraph: {
      title: 'Partenariat - ZaLaMa',
      description: 'Rejoignez notre réseau de partenaires et développez votre activité',
    },
  },

  contact: {
    title: 'Contact',
    description: 'Contactez l\'équipe ZaLaMa pour toute question sur nos services d\'avance sur salaire, conseil financier ou partenariat.',
    keywords: ['contact', 'support', 'aide', 'assistance', 'ZaLaMa'],
    openGraph: {
      title: 'Contact - ZaLaMa',
      description: 'Contactez notre équipe pour toute question sur nos services',
    },
  },

  login: {
    title: 'Connexion Employé',
    description: 'Accédez à votre espace personnel ZaLaMa. Gérez vos avances sur salaire et consultez vos informations financières.',
    keywords: ['connexion', 'espace personnel', 'employé', 'dashboard'],
    openGraph: {
      title: 'Connexion Employé - ZaLaMa',
      description: 'Accédez à votre espace personnel et gérez vos avances sur salaire',
    },
    robots: {
      index: false,
      follow: false,
    },
  },

  profile: {
    title: 'Mon Profil',
    description: 'Gérez votre profil ZaLaMa, consultez l\'historique de vos avances sur salaire et accédez à vos documents.',
    keywords: ['profil', 'historique', 'documents', 'avances'],
    openGraph: {
      title: 'Mon Profil - ZaLaMa',
      description: 'Gérez votre profil et consultez l\'historique de vos avances',
    },
    robots: {
      index: false,
      follow: false,
    },
  },

  privacyPolicy: {
    title: 'Politique de confidentialité',
    description: 'Découvrez comment ZaLaMa protège vos données personnelles et respecte votre vie privée. Informations détaillées sur la collecte et l\'utilisation des données.',
    keywords: ['confidentialité', 'données personnelles', 'protection', 'RGPD', 'vie privée'],
    openGraph: {
      title: 'Politique de confidentialité - ZaLaMa',
      description: 'Comment ZaLaMa protège vos données personnelles et respecte votre vie privée',
    },
  },

  termsOfService: {
    title: 'Conditions d\'utilisation',
    description: 'Consultez les conditions d\'utilisation de la plateforme ZaLaMa. Règles, droits et obligations pour l\'utilisation de nos services fintech.',
    keywords: ['conditions', 'utilisation', 'règles', 'droits', 'obligations'],
    openGraph: {
      title: 'Conditions d\'utilisation - ZaLaMa',
      description: 'Conditions d\'utilisation de la plateforme ZaLaMa',
    },
  },

  cookiePolicy: {
    title: 'Politique de Cookies',
    description: 'Découvrez comment ZaLaMa utilise les cookies pour améliorer votre expérience sur notre plateforme d\'avances sur salaire.',
    keywords: ['cookies', 'traceurs', 'expérience utilisateur', 'préférences'],
    openGraph: {
      title: 'Politique de Cookies - ZaLaMa',
      description: 'Comment ZaLaMa utilise les cookies pour améliorer votre expérience',
    },
  },

  forgotPassword: {
    title: 'Mot de passe oublié',
    description: 'Réinitialisez votre mot de passe ZaLaMa en toute sécurité. Procédure simple et sécurisée pour retrouver l\'accès à votre compte.',
    keywords: ['mot de passe', 'réinitialisation', 'sécurité', 'compte'],
    openGraph: {
      title: 'Mot de passe oublié - ZaLaMa',
      description: 'Réinitialisez votre mot de passe en toute sécurité',
    },
    robots: {
      index: false,
      follow: false,
    },
  },

  resetPassword: {
    title: 'Réinitialisation du mot de passe',
    description: 'Définissez un nouveau mot de passe pour votre compte ZaLaMa. Interface sécurisée et procédure simple.',
    keywords: ['nouveau mot de passe', 'sécurité', 'compte'],
    openGraph: {
      title: 'Réinitialisation du mot de passe - ZaLaMa',
      description: 'Définissez un nouveau mot de passe pour votre compte',
    },
    robots: {
      index: false,
      follow: false,
    },
  },
};

// Fonction utilitaire pour générer les métadonnées
export function generateMetadata(pageKey: keyof typeof pageMetadata, customData?: Partial<Metadata>): Metadata {
  const pageData = pageMetadata[pageKey];
  
  return {
    ...baseMetadata,
    title: pageData.title,
    description: pageData.description,
    keywords: [...baseMetadata.keywords!, ...pageData.keywords],
    openGraph: {
      ...baseMetadata.openGraph,
      title: pageData.openGraph.title,
      description: pageData.openGraph.description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: pageData.openGraph.title,
      description: pageData.openGraph.description,
    },
    robots: 'robots' in pageData ? pageData.robots : baseMetadata.robots,
    ...customData,
  };
}

// Métadonnées par défaut
export const defaultMetadata = baseMetadata; 