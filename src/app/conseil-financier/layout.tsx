import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('conseilFinancier');

export default function ConseilFinancierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 