/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration CORS globale pour les API routes
  async headers() {
    return [
      {
        // Appliquer à toutes les API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Sera remplacé dynamiquement par notre logique CORS
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
    ];
  },
  
  // Autres configurations existantes...
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  
  // Configuration pour les images externes
  images: {
    domains: [
      'localhost', 
      'zalamagn.com', 
      'www.zalamagn.com',
      'mspmrzlqhwpdkkburjiw.supabase.co', // Ajout du hostname Supabase
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mspmrzlqhwpdkkburjiw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zalamagn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zalamagn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
