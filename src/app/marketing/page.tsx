'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Megaphone, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Zap,
  Calculator,
  Smartphone,
  Building,
  ArrowRight,
  Star,
  AlertCircle,
  Target,
  BarChart3,
  Eye,
  Globe,
  Monitor,
  Settings,
  PieChart,
  DollarSign,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundEffects } from "@/components/ui/background-effects";

// Composant Section réutilisable
interface SectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, description, icon, children, className = "" }: SectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mb-6">
            {icon}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-zalama-text-secondary max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

// Composant InfoCard réutilisable
interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

function InfoCard({ title, description, icon, delay = 0, className = "" }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className={`h-full ${className}`}
    >
      <Card className="h-full bg-zalama-bg-dark/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
              {icon}
            </div>
            <CardTitle className="text-xl font-bold text-zalama-text">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-zalama-text-secondary leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Composant CallToAction réutilisable
function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mb-8">
              <Megaphone className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-6">
              Prêt à booster votre visibilité ?
            </h2>
            <p className="text-lg sm:text-xl text-zalama-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les entreprises qui font confiance à ZaLaMa pour atteindre leur audience cible et maximiser leur ROI publicitaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white border-0 px-8 py-4 text-lg font-semibold">
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/partnership">
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold">
                  Devenir partenaire
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zalama-bg-darker via-zalama-bg-dark to-zalama-bg-darker">
      <BackgroundEffects />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Bouton retour en haut à gauche */}
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-zalama-text-secondary hover:text-primary transition-colors bg-zalama-bg-dark/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-border/30 hover:border-primary/30">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
          </Link>
        </div>

        {/* Header */}
        <section className="relative pt-16 md:pt-24 lg:pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mb-6">
                <Megaphone className="w-10 h-10" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-6">
                Marketing & Publicité
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-zalama-text-secondary max-w-4xl mx-auto leading-relaxed mb-8">
                Un espace publicitaire intégré permettant aux entreprises locales et internationales de promouvoir leurs produits et services auprès de notre communauté d'utilisateurs.
              </p>

              {/* Stats rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-zalama-text-secondary">Ciblage intelligent</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">Temps réel</div>
                  <div className="text-zalama-text-secondary">Statistiques & analyses</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-zalama-text-secondary">Visibilité locale</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Qu'est-ce que le marketing ZaLaMa */}
        <Section
          title="Qu'est-ce que le marketing ZaLaMa ?"
          description="Une plateforme publicitaire innovante qui connecte les entreprises à une audience qualifiée et engagée."
          icon={<Megaphone className="w-8 h-8" />}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Ciblage intelligent</h3>
                    <p className="text-zalama-text-secondary">
                      Atteignez votre audience idéale grâce à notre système de ciblage basé sur les données démographiques et comportementales.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Analyses en temps réel</h3>
                    <p className="text-zalama-text-secondary">
                      Suivez les performances de vos campagnes avec des statistiques détaillées et des rapports personnalisés.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Visibilité locale forte</h3>
                    <p className="text-zalama-text-secondary">
                      Bénéficiez d'une visibilité optimale auprès de notre communauté d'utilisateurs en Guinée et au-delà.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-8"
            >
              <h3 className="text-2xl font-bold text-zalama-text mb-6">Fonctionnalités principales</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Ciblage intelligent par localisation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Interfaces de gestion avancées</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Statistiques en temps réel</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Visibilité locale renforcée</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Soutien technologique complet</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Accompagnement personnalisé</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Qui peut en bénéficier */}
        <Section
          title="Qui peut en bénéficier ?"
          description="Notre plateforme marketing est ouverte à tous les types d'entreprises souhaitant développer leur visibilité et leur clientèle."
          icon={<Users className="w-8 h-8" />}
          className="bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="PME locales"
              description="Petites et moyennes entreprises guinéennes souhaitant développer leur visibilité sur le marché local."
              icon={<Building className="w-6 h-6" />}
              delay={0}
            />
            <InfoCard
              title="Grandes entreprises"
              description="Sociétés établies cherchant à renforcer leur présence et à atteindre de nouveaux segments de clientèle."
              icon={<TrendingUp className="w-6 h-6" />}
              delay={1}
            />
            <InfoCard
              title="Startups & entrepreneurs"
              description="Nouvelles entreprises et entrepreneurs innovants souhaitant faire connaître leurs produits et services."
              icon={<Zap className="w-6 h-6" />}
              delay={2}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-zalama-bg-darker/50 rounded-2xl border border-border/30 p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zalama-text mb-3">Avantages pour tous</h3>
                <ul className="space-y-2 text-zalama-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Audience qualifiée et engagée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Coûts publicitaires optimisés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Retour sur investissement mesurable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Support technique dédié</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* Comment ça fonctionne */}
        <Section
          title="Comment ça fonctionne ?"
          description="Un processus simple en 4 étapes pour lancer votre campagne publicitaire sur ZaLaMa."
          icon={<TrendingUp className="w-8 h-8" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Contact</h3>
              <p className="text-zalama-text-secondary">
                Contactez notre équipe marketing pour discuter de vos objectifs et de votre budget.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Stratégie</h3>
              <p className="text-zalama-text-secondary">
                Nous élaborons ensemble une stratégie publicitaire adaptée à vos besoins et à votre audience cible.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Lancement</h3>
              <p className="text-zalama-text-secondary">
                Votre campagne est lancée et optimisée en continu pour maximiser son efficacité.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Suivi</h3>
              <p className="text-zalama-text-secondary">
                Suivez vos performances en temps réel et ajustez votre stratégie selon les résultats.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Avantages */}
        <Section
          title="Quels sont les avantages ?"
          description="Découvrez pourquoi des centaines d'entreprises font confiance à ZaLaMa pour leur stratégie marketing."
          icon={<CheckCircle2 className="w-8 h-8" />}
          className="bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Ciblage précis</h3>
                  <p className="text-zalama-text-secondary">
                    Atteignez votre audience idéale grâce à notre technologie de ciblage avancée basée sur la localisation et les comportements.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Interface intuitive</h3>
                  <p className="text-zalama-text-secondary">
                    Gérez vos campagnes facilement avec notre interface moderne et nos outils d'analyse en temps réel.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">ROI optimisé</h3>
                  <p className="text-zalama-text-secondary">
                    Maximisez votre retour sur investissement grâce à nos tarifs compétitifs et notre optimisation continue.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Visibilité locale</h3>
                  <p className="text-zalama-text-secondary">
                    Bénéficiez d'une visibilité renforcée auprès de notre communauté d'utilisateurs en Guinée.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Analyses détaillées</h3>
                  <p className="text-zalama-text-secondary">
                    Accédez à des rapports détaillés et des métriques avancées pour optimiser vos campagnes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Support dédié</h3>
                  <p className="text-zalama-text-secondary">
                    Bénéficiez d'un accompagnement personnalisé et d'un support technique réactif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Sécurité et confidentialité */}
        <Section
          title="Sécurité & confidentialité"
          description="Vos données publicitaires et celles de votre audience sont protégées par les plus hauts standards de sécurité."
          icon={<Shield className="w-8 h-8" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="Protection des données"
              description="Respect total du RGPD et des lois locales sur la protection des données personnelles."
              icon={<Shield className="w-6 h-6" />}
              delay={0}
            />
            <InfoCard
              title="Transparence totale"
              description="Contrôlez entièrement vos campagnes et accédez à toutes les données de performance."
              icon={<Eye className="w-6 h-6" />}
              delay={1}
            />
            <InfoCard
              title="Audience qualifiée"
              description="Accédez à une audience authentique et engagée, sans bots ni faux comptes."
              icon={<Users className="w-6 h-6" />}
              delay={2}
            />
          </div>
        </Section>

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
} 