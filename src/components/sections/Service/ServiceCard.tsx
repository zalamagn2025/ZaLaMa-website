import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  ctaText?: string; // Make ctaText optional
  ctaLink?: string; // Make ctaLink optional
  icon: React.ReactNode;
  delay?: number;
  fullWidth?: boolean;
  className?: string; // Add className prop
}

export function ServiceCard({
  title,
  description,
  features,
  ctaText,
  ctaLink,
  icon,
  delay = 0,
  fullWidth = false,
  className = '',
  ...props
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`flex flex-col h-full p-6 rounded-2xl bg-gray-800/50 border border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 ${fullWidth ? 'w-full' : 'w-full max-w-md'} ${className}`}
      {...props}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-[#FF671E]">
              <div className="w-6 h-6 flex items-center justify-center">
                {icon}
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <div className={`${fullWidth ? 'text-center' : ''} flex-1 flex flex-col`}>
          <p className="text-gray-300 mb-4">{description}</p>
          
          <ul className={`space-y-2 mt-4 ${fullWidth ? 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto' : 'space-y-2'}`}>
            {features.map((feature, index) => (
              <li key={index} className={`flex items-center gap-2 ${fullWidth ? 'flex-col text-center' : ''}`}>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" color='#FF671E' />
                </div>
                <span className="text-sm text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          {ctaText && ctaLink && (
            <div className="mt-auto pt-4">
              <Button asChild className="w-full">
                <Link href={ctaLink}>
                  {ctaText}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}