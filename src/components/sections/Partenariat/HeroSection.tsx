import { Hero } from "@/components/hero";


function HeroDemo() {
  return (
    <Hero
      title="Devenez client ZaLaMa"
      subtitle="Rejoignez notre réseau et offrez à vos employés des solutions financières innovantes, simples et sécurisées. Ensemble, faisons évoluer le bien-être financier en entreprise."
      actions={[
        {
          label: "Devenir client",
          href: "/partnership/formulaire",
          variant: "default"
        },
        {
          label: "En savoir plus",
          href: "#processus-adhesion",
          variant: "outline"
        }
      ]}
      titleClassName="text-4xl md:text-5xl font-extrabold text-primary mb-4"
      subtitleClassName="text-lg md:text-xl max-w-[600px] text-muted-foreground"
      actionsClassName="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
    />
  );
}

export { HeroDemo }