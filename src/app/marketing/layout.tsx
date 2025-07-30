import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('marketing');

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 