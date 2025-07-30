import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('avanceSurSalaire');

export default function AvanceSurSalaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 