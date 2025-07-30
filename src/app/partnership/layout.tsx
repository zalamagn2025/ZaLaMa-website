import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('partnership');

export default function PartnershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 