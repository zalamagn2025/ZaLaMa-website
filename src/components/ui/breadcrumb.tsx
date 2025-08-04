'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { generateBreadcrumbSchema, createStructuredDataScript } from '@/lib/structured-data';

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ 
  items, 
  className,
  showHome = true 
}: BreadcrumbProps) {
  // Ajouter l'accueil si demandé et s'il n'est pas déjà présent
  const breadcrumbItems = showHome && items[0]?.url !== '/' 
    ? [{ name: 'Accueil', url: '/' }, ...items]
    : items;

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      {/* Balises structurées pour le breadcrumb */}
      <script {...createStructuredDataScript(breadcrumbSchema)} />
      
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {item.current ? (
              <span
                className={cn(
                  'text-sm font-medium',
                  item.current 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                )}
                aria-current="page"
              >
                {index === 0 && showHome ? (
                  <HomeIcon className="h-4 w-4" />
                ) : (
                  item.name
                )}
              </span>
            ) : (
              <Link
                href={item.url}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {index === 0 && showHome ? (
                  <HomeIcon className="h-4 w-4" />
                ) : (
                  item.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Composant pour les pages de services
export function ServiceBreadcrumb({ serviceName }: { serviceName: string }) {
  const items: BreadcrumbItem[] = [
    { name: 'Services', url: '/services' },
    { name: serviceName, url: '#', current: true }
  ];

  return <Breadcrumb items={items} className="mb-6" />;
}

// Composant pour les pages de partenariat
export function PartnershipBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { name: 'Partenariat', url: '/partnership', current: true }
  ];

  return <Breadcrumb items={items} className="mb-6" />;
}

// Composant pour les pages de contact
export function ContactBreadcrumb() {
  const items: BreadcrumbItem[] = [
    { name: 'Contact', url: '/contact', current: true }
  ];

  return <Breadcrumb items={items} className="mb-6" />;
}
