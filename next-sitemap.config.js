/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.zalamagn.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/api/*',
    '/admin/*',
    '/profile/*',
    '/login',
    '/auth/*',
    '/forgot-password',
    '/reset-password',
    '/update-password',
    '/404',
    '/500'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/login',
          '/auth/',
          '/forgot-password',
          '/reset-password',
          '/update-password',
          '/_next/',
          '/static/'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/login',
          '/auth/',
          '/forgot-password',
          '/reset-password',
          '/update-password'
        ]
      }
    ],
    additionalSitemaps: [
      'https://www.zalamagn.com/sitemap.xml'
    ]
  },
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Personnalisation des priorités par page
    const priorities = {
      '/': 1.0,
      '/about': 0.8,
      '/services': 0.9,
      '/avance-sur-salaire': 0.9,
      '/conseil-financier': 0.8,
      '/marketing': 0.8,
      '/partnership': 0.8,
      '/contact': 0.7,
      '/privacy-policy': 0.3,
      '/terms-of-service': 0.3,
      '/cookie-policy': 0.3
    };

    const changefreqs = {
      '/': 'daily',
      '/about': 'monthly',
      '/services': 'weekly',
      '/avance-sur-salaire': 'weekly',
      '/conseil-financier': 'weekly',
      '/marketing': 'weekly',
      '/partnership': 'weekly',
      '/contact': 'monthly'
    };

    return {
      loc: path,
      changefreq: changefreqs[path] || config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    };
  },
}; 