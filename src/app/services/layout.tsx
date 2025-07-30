import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('services');

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 