import { Metadata } from 'next';

// Types pour les données structurées
export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

export interface ServiceData {
  name: string;
  description: string;
  url: string;
  provider: string;
  areaServed: string;
  serviceType: string;
}

export interface WebPageData {
  name: string;
  description: string;
  url: string;
  breadcrumb?: string[];
}

export interface FinancialServiceData extends ServiceData {
  serviceType: 'FinancialService';
  feesAndCommissionsSpecification: string;
  interestRate?: string;
  loanTerm?: string;
}

// Données de l'organisation ZaLaMa
export const zalamaOrganization: OrganizationData = {
  name: 'ZaLaMa',
  url: 'https://www.zalamagn.com',
  logo: 'https://www.zalamagn.com/images/zalama-logo.svg',
  description: 'ZaLaMa est une solution fintech innovante qui permet aux salariés d\'accéder facilement à une avance sur salaire, sans stress, en toute sécurité.',
  address: {
    streetAddress: 'Carrefour Constantin - Immeuble DING CITY, 3ème étage - C/Matam - Conakry - Guinée',
    addressLocality: 'Matam',
    addressRegion: 'Conakry',
    postalCode: '224',
    addressCountry: 'GN'
  },
  contactPoint: {
    telephone: '+224625607878',
    contactType: 'Customer Service',
    email: 'contact@zalamagn.com'
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=61578697800477',
  ]
};

// Génération des balises structurées pour l'organisation
export function generateOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: zalamaOrganization.name,
    url: zalamaOrganization.url,
    logo: zalamaOrganization.logo,
    description: zalamaOrganization.description,
    address: {
      '@type': 'PostalAddress',
      ...zalamaOrganization.address
    },
    contactPoint: {
      '@type': 'ContactPoint',
      ...zalamaOrganization.contactPoint
    },
    sameAs: zalamaOrganization.sameAs,
    areaServed: {
      '@type': 'Country',
      name: 'Guinée'
    },
    serviceType: 'Avance sur salaire',
    feesAndCommissionsSpecification: '6,5% de frais de service',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: zalamaOrganization.url,
      serviceType: 'Online'
    }
  };

  return JSON.stringify(schema);
}

// Génération des balises structurées pour les services
export function generateServiceSchema(serviceData: ServiceData): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceData.name,
    description: serviceData.description,
    url: serviceData.url,
    provider: {
      '@type': 'Organization',
      name: serviceData.provider,
      url: zalamaOrganization.url
    },
    areaServed: {
      '@type': 'Country',
      name: serviceData.areaServed
    },
    serviceType: serviceData.serviceType,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: serviceData.url,
      serviceType: 'Online'
    }
  };

  return JSON.stringify(schema);
}

// Génération des balises structurées pour les services financiers
export function generateFinancialServiceSchema(serviceData: FinancialServiceData): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: serviceData.name,
    description: serviceData.description,
    url: serviceData.url,
    provider: {
      '@type': 'Organization',
      name: serviceData.provider,
      url: zalamaOrganization.url
    },
    areaServed: {
      '@type': 'Country',
      name: serviceData.areaServed
    },
    serviceType: serviceData.serviceType,
    feesAndCommissionsSpecification: serviceData.feesAndCommissionsSpecification,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: serviceData.url,
      serviceType: 'Online'
    }
  };

  return JSON.stringify(schema);
}

// Génération des balises structurées pour les pages web
export function generateWebPageSchema(pageData: WebPageData): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageData.name,
    description: pageData.description,
    url: pageData.url,
    publisher: {
      '@type': 'Organization',
      name: zalamaOrganization.name,
      url: zalamaOrganization.url
    },
    breadcrumb: pageData.breadcrumb ? {
      '@type': 'BreadcrumbList',
      itemListElement: pageData.breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item,
        item: `${zalamaOrganization.url}${item}`
      }))
    } : undefined
  };

  return JSON.stringify(schema);
}

// Génération des balises structurées pour le FAQ
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return JSON.stringify(schema);
}

// Génération des balises structurées pour le breadcrumb
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return JSON.stringify(schema);
}

// Fonction pour injecter les balises structurées (à utiliser dans les composants React)
export function createStructuredDataScript(data: string) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: data }
  };
}

 