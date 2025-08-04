'use client';

import { ReactNode } from 'react';
import { createStructuredDataScript } from '@/lib/structured-data';

interface SEOProviderProps {
  children: ReactNode;
  structuredData?: string;
  canonicalUrl?: string;
}

export function SEOProvider({ children, structuredData, canonicalUrl }: SEOProviderProps) {
  return (
    <>
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}
      {structuredData && (
        <script {...createStructuredDataScript(structuredData)} />
      )}
      {children}
    </>
  );
}