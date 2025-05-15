import { BackgroundEffects } from '@/components/ui/background-effects';
import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Handshake, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react';

export default function PartenariatPage() {
  const avantages = [
    {
      title: 'Visibilité accrue',
      description: 'Bénéficiez d\'une exposition à notre communauté grandissante d\'utilisateurs.',
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    },
    {
      title: 'Réseau professionnel',
      description: 'Accédez à un réseau d\'entreprises et de professionnels partageant les mêmes valeurs.',
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      title: 'Sécurité garantie',
      description: 'Des transactions sécurisées et une protection des données de vos employés.',
      icon: <ShieldCheck className="w-6 h-6 text-primary" />
    }
  ];

  const offres = [
    {
      title: 'Partenariat Standard',
      price: 'Gratuit',
      description: 'Pour les petites entreprises',
      features: [
        'Accès à notre plateforme',
        'Support de base',
        'Rapports mensuels',
      ],
      popular: false
    },
    {
      title: 'Partenariat Premium',
      price: 'Sur mesure',
      description: 'Pour les moyennes et grandes entreprises',
      features: [
        'Toutes les fonctionnalités Standard',
        'Support prioritaire',
        'Rapports personnalisés',
        'Formation de vos équipes',
        'Solutions sur mesure',
      ],
      popular: true
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Devenez Partenaire ZaLaMa
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Rejoignez notre réseau de partenaires et offrez des solutions financières innovantes à vos employés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Handshake className="w-5 h-5" />
                  Devenir Partenaire
                </Button>
                <Button variant="outline" size="lg">
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Avantages Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi devenir partenaire ?</h2>
              <p className="text-muted-foreground text-lg">
                Découvrez les avantages de rejoindre notre réseau de partenaires privilégiés.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {avantages.map((avantage, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {avantage.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{avantage.title}</h3>
                  <p className="text-muted-foreground">{avantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offres Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos offres de partenariat</h2>
              <p className="text-muted-foreground text-lg">
                Choisissez la formule qui correspond le mieux aux besoins de votre entreprise.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {offres.map((offre, index) => (
                <Card key={index} className={`relative overflow-hidden ${offre.popular ? 'border-primary/30 shadow-lg' : ''}`}>
                  {offre.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-12">
                      Populaire
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{offre.title}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">{offre.price}</span>
                      {offre.price !== 'Gratuit' && <span className="text-muted-foreground">/sur mesure</span>}
                    </div>
                    <CardDescription>{offre.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {offre.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" size="lg">
                      Choisir cette offre
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à nous rejoindre ?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Rejoignez notre réseau de partenaires et offrez des solutions financières innovantes à vos employés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Handshake className="w-5 h-5" />
                  Devenir Partenaire
                </Button>
                <Button variant="outline" size="lg">
                  Contactez-nous
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
