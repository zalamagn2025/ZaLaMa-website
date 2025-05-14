'use client';

import dynamic from 'next/dynamic';

// Import dynamique avec désactivation du SSR pour éviter les problèmes d'hydratation
const FonctionnementZalamaComponent = dynamic(
  () => import('../../common/FonctionnementZalama'),
  { ssr: false }
);

export default function FonctionnementZalamaClient() {
  return <FonctionnementZalamaComponent />;
}
