'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Brain, 
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
  MessageSquare,
  BarChart3,
  Target,
  Lightbulb,
  BookOpen,
  Headphones
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
              <Brain className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-6">
              Prêt à optimiser vos finances ?
            </h2>
            <p className="text-lg sm:text-xl text-zalama-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les milliers d'utilisateurs qui font confiance à notre IA pour une gestion financière intelligente et personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white border-0 px-8 py-4 text-lg font-semibold">
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ConseilFinancierPage() {
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
                <Brain className="w-10 h-10" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-6">
                Conseil financier
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-zalama-text-secondary max-w-4xl mx-auto leading-relaxed mb-8">
                Accompagnement personnalisé par IA pour optimiser vos finances, gérer vos dépenses et planifier votre avenir financier en toute sérénité.
              </p>

              {/* Stats rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-zalama-text-secondary">Disponibilité</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">IA</div>
                  <div className="text-zalama-text-secondary">Intelligence artificielle</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">0€</div>
                  <div className="text-zalama-text-secondary">Frais de service</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Qu'est-ce que le conseil financier */}
        <Section
          title="Qu'est-ce que le conseil financier ?"
          description="Un accompagnement intelligent et personnalisé pour optimiser votre gestion financière et atteindre vos objectifs."
          icon={<Brain className="w-8 h-8" />}
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
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">IA personnalisée</h3>
                    <p className="text-zalama-text-secondary">
                      Notre intelligence artificielle analyse vos habitudes financières pour vous proposer des conseils adaptés à votre situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Disponibilité 24/7</h3>
                    <p className="text-zalama-text-secondary">
                      Accédez à vos conseils financiers à tout moment, jour et nuit, depuis votre application mobile ou le site web.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Objectifs personnalisés</h3>
                    <p className="text-zalama-text-secondary">
                      Définissez vos objectifs financiers et recevez des recommandations spécifiques pour les atteindre efficacement.
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
                  <span className="text-zalama-text-secondary">Chat intelligent avec l'IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Gestion des dépenses</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Livre de comptabilité</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Stimulateur financier</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Alertes intelligentes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-zalama-text-secondary">Planification budgétaire</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Qui peut en bénéficier */}
        <Section
          title="Qui peut en bénéficier ?"
          description="Notre service de conseil financier est accessible à tous les utilisateurs ZaLaMa, quel que soit leur niveau de connaissances financières."
          icon={<Users className="w-8 h-8" />}
          className="bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="Débutants"
              description="Personnes qui souhaitent apprendre les bases de la gestion financière et établir de bonnes habitudes."
              icon={<BookOpen className="w-6 h-6" />}
              delay={0}
            />
            <InfoCard
              title="Gestionnaires confirmés"
              description="Utilisateurs expérimentés qui veulent optimiser leur stratégie financière et diversifier leurs investissements."
              icon={<TrendingUp className="w-6 h-6" />}
              delay={1}
            />
            <InfoCard
              title="Professionnels"
              description="Entrepreneurs et indépendants qui ont besoin d'un accompagnement pour la gestion de leur trésorerie."
              icon={<Building className="w-6 h-6" />}
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
                    <span>Accès gratuit et illimité au service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Conseils adaptés à votre profil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Suivi de vos progrès financiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Ressources éducatives personnalisées</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* Comment ça fonctionne */}
        <Section
          title="Comment ça fonctionne ?"
          description="Un processus simple en 4 étapes pour optimiser votre gestion financière avec l'aide de notre IA."
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
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Connexion</h3>
              <p className="text-zalama-text-secondary">
                Connectez-vous à votre compte ZaLaMa et accédez au service de conseil financier.
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
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Analyse</h3>
              <p className="text-zalama-text-secondary">
                L'IA analyse vos données financières et identifie vos habitudes de consommation.
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
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Recommandations</h3>
              <p className="text-zalama-text-secondary">
                Recevez des conseils personnalisés et des recommandations d'optimisation.
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
                Suivez vos progrès et ajustez vos objectifs avec l'aide continue de l'IA.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Avantages */}
        <Section
          title="Quels sont les avantages ?"
          description="Découvrez pourquoi des milliers d'utilisateurs font confiance à notre IA pour optimiser leurs finances."
          icon={<CheckCircle2 className="w-8 h-8" />}
          className="bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">IA intelligente</h3>
                  <p className="text-zalama-text-secondary">
                    Algorithmes avancés qui s'adaptent à votre profil et évoluent avec vos besoins.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Disponibilité totale</h3>
                  <p className="text-zalama-text-secondary">
                    Accès à vos conseils 24h/24 et 7j/7, sans attente ni rendez-vous.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Personnalisation</h3>
                  <p className="text-zalama-text-secondary">
                    Conseils adaptés à votre situation, vos objectifs et votre niveau de risque.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Analyses détaillées</h3>
                  <p className="text-zalama-text-secondary">
                    Rapports et graphiques pour visualiser vos finances et identifier les opportunités.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Chat interactif</h3>
                  <p className="text-zalama-text-secondary">
                    Dialoguez naturellement avec l'IA pour obtenir des réponses à vos questions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Conseils pratiques</h3>
                  <p className="text-zalama-text-secondary">
                    Suggestions concrètes et actionnables pour améliorer votre situation financière.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Sécurité et confidentialité */}
        <Section
          title="Sécurité & confidentialité"
          description="Vos données financières sont protégées par les plus hauts standards de sécurité et de confidentialité."
          icon={<Shield className="w-8 h-8" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="Chiffrement avancé"
              description="Toutes vos données financières sont chiffrées avec des algorithmes de cryptage de niveau bancaire."
              icon={<Shield className="w-6 h-6" />}
              delay={0}
            />
            <InfoCard
              title="Confidentialité totale"
              description="Vos informations personnelles et financières ne sont jamais partagées avec des tiers."
              icon={<CheckCircle2 className="w-6 h-6" />}
              delay={1}
            />
            <InfoCard
              title="Conformité RGPD"
              description="Respect total du Règlement Général sur la Protection des Données et des lois locales."
              icon={<Building className="w-6 h-6" />}
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