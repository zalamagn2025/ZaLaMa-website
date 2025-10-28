/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration CORS globale pour les API routes
  async headers() {
    return [
      // Configuration Font Awesome
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '<https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css>; rel=preload; as=style; onload="this.onload=null;this.rel=\'stylesheet\'"',
          },
          {
            key: 'Link',
            value: '<https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css>; rel=stylesheet',
          },
        ],
      },
      // Configuration CORS pour les API
      {
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
  
  // Configuration pour les packages externes (corrigé)
  serverExternalPackages: ['bcryptjs'],
  
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
