'use client';
import { FeatureCard } from '@/components/grid-feature-cards';
import { Handshake, Zap, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
const features = [
  {
    title: 'Confiance & Transparence',
    icon: Handshake,
    description: 'Bâtissez un partenariat solide basé sur la confiance, l’écoute et la transparence. Nous valorisons chaque relation et travaillons main dans la main avec nos partenaires.'
  },
  {
    title: 'Visibilité accrue',
    icon: Zap,
    description: 'Profitez de notre réseau et de nos canaux de communication pour accroître la notoriété de votre marque auprès d’une audience engagée.'
  },
  {
    title: 'Accès à une communauté dynamique',
    icon: Users,
    description: 'Rejoignez une communauté active et bénéficiez de synergies avec d’autres partenaires, clients et experts du secteur.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-4 md:py-5">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
        <AnimatedContainer className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            Pourquoi devenir partenaire&nbsp;?
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            Découvrez les avantages exclusifs réservés à nos partenaires et rejoignez une aventure humaine et innovante.
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
