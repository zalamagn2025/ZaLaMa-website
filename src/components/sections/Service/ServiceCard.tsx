import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  // ctaText: string;
  // ctaLink: string;
  icon: React.ReactNode;
  delay?: number;
}

export function ServiceCard({
  title,
  description,
  features,
  // ctaText,
  // ctaLink,
  icon,
  delay = 0
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="flex flex-col h-full p-6 rounded-2xl bg-gray-800/50 border border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-300 mb-4 flex-grow">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-primary flex-shrink-0" color='#FF671E' />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* <div className="mt-auto">
        <Button asChild className="w-full">
          <Link href={ctaLink}>
            {ctaText}
          </Link>
        </Button>
      </div> */}
    </motion.div>
  );
}
