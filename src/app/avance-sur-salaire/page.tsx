'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard, 
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
  AlertCircle
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
              <Zap className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-6">
              Prêt à faire votre première demande ?
            </h2>
            <p className="text-lg sm:text-xl text-zalama-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les milliers d'employés qui font confiance à ZaLaMa pour leurs besoins financiers urgents.
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

export default function AvanceSurSalairePage() {
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
                <CreditCard className="w-10 h-10" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent mb-6">
                Avance sur salaire
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-zalama-text-secondary max-w-4xl mx-auto leading-relaxed mb-8">
                Accédez rapidement à une partie de votre salaire avant la date de paie officielle. 
                Solution financière innovante pour gérer vos imprévus et urgences en toute sérénité.
              </p>

              {/* Stats rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">25%</div>
                  <div className="text-zalama-text-secondary">Du salaire net</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">&lt; 10 min</div>
                  <div className="text-zalama-text-secondary">Traitement</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">2%</div>
                  <div className="text-zalama-text-secondary">Frais de service</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Qu'est-ce que l'avance sur salaire */}
        <Section
          title="Qu'est-ce que l'avance sur salaire ?"
          description="Une solution financière moderne qui vous permet d'accéder à une partie de votre salaire avant la date de paie officielle."
          icon={<CreditCard className="w-8 h-8" />}
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
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Accès anticipé à votre salaire</h3>
                    <p className="text-zalama-text-secondary">
                      Obtenez jusqu'à 25% de votre salaire net avant la date de paie officielle pour faire face aux imprévus.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Traitement ultra-rapide</h3>
                    <p className="text-zalama-text-secondary">
                      Votre demande est traitée en moins de 10 minutes après validation par votre employeur.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 mt-1">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zalama-text mb-2">Frais transparents</h3>
                    <p className="text-zalama-text-secondary">
                      Seulement 2% de frais de service (minimum 5 000 GNF) pour un service de qualité professionnelle.
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
              <h3 className="text-2xl font-bold text-zalama-text mb-6">Exemple concret</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zalama-text-secondary">Salaire net mensuel</span>
                  <span className="text-zalama-text font-semibold">2 000 000 GNF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zalama-text-secondary">Avance disponible (25%)</span>
                  <span className="text-primary font-semibold">500 000 GNF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zalama-text-secondary">Frais de service (2%)</span>
                  <span className="text-zalama-text-secondary">10 000 GNF</span>
                </div>
                <div className="border-t border-border/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zalama-text font-semibold">Montant reçu</span>
                    <span className="text-primary font-bold text-xl">490 000 GNF</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Qui peut en bénéficier */}
        <Section
          title="Qui peut en bénéficier ?"
          description="Notre service d'avance sur salaire est accessible à tous les employés des entreprises partenaires ZaLaMa."
          icon={<Users className="w-8 h-8" />}
          className="bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="Employés en CDI"
              description="Salariés avec un contrat à durée indéterminée dans une entreprise partenaire ZaLaMa."
              icon={<Building className="w-6 h-6" />}
              delay={0}
            />
            <InfoCard
              title="Employés en CDD"
              description="Salariés avec un contrat à durée déterminée, sous réserve de la durée restante du contrat."
              icon={<Clock className="w-6 h-6" />}
              delay={1}
            />
            <InfoCard
              title="Pensionnaires"
              description="Retraités et pensionnaires affiliés à une institution partenaire de ZaLaMa."
              icon={<Star className="w-6 h-6" />}
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
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zalama-text mb-3">Conditions d'éligibilité</h3>
                <ul className="space-y-2 text-zalama-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Être employé d'une entreprise partenaire ZaLaMa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Avoir un contrat de travail en cours de validité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Être majeur et avoir la capacité juridique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span>Respecter les limites de montant et de fréquence</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* Comment ça fonctionne */}
        <Section
          title="Comment ça fonctionne ?"
          description="Un processus simple et transparent en 4 étapes pour obtenir votre avance sur salaire."
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
                Connectez-vous à votre compte ZaLaMa depuis l'application ou le site web.
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
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Demande</h3>
              <p className="text-zalama-text-secondary">
                Remplissez le formulaire avec le montant souhaité et le motif de votre demande.
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
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Validation</h3>
              <p className="text-zalama-text-secondary">
                Votre employeur valide la demande et ZaLaMa traite votre dossier.
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
              <h3 className="text-xl font-semibold text-zalama-text mb-3">Réception</h3>
              <p className="text-zalama-text-secondary">
                Recevez les fonds sur votre compte mobile money en moins de 10 minutes.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Avantages */}
        <Section
          title="Quels sont les avantages ?"
          description="Découvrez pourquoi des milliers d'employés choisissent ZaLaMa pour leurs besoins financiers."
          icon={<CheckCircle2 className="w-8 h-8" />}
          className="bg-gradient-to-br from-primary/5 via-orange-500/5 to-blue-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Rapidité exceptionnelle</h3>
                  <p className="text-zalama-text-secondary">
                    Traitement en moins de 10 minutes après validation. Plus besoin d'attendre la fin du mois !
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Sécurité garantie</h3>
                  <p className="text-zalama-text-secondary">
                    Données chiffrées, authentification sécurisée et validation par votre employeur.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Frais transparents</h3>
                  <p className="text-zalama-text-secondary">
                    Seulement 2% de frais de service, sans surprise ni coût caché.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Accessibilité totale</h3>
                  <p className="text-zalama-text-secondary">
                    Application mobile et site web disponibles 24h/24 et 7j/7.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Gestion responsable</h3>
                  <p className="text-zalama-text-secondary">
                    Limite de 25% du salaire pour éviter le surendettement et favoriser une gestion saine.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zalama-text mb-2">Support dédié</h3>
                  <p className="text-zalama-text-secondary">
                    Équipe support disponible pour vous accompagner à chaque étape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Sécurité et confidentialité */}
        <Section
          title="Sécurité & confidentialité"
          description="Vos données et transactions sont protégées par les plus hauts standards de sécurité."
          icon={<Shield className="w-8 h-8" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="Chiffrement SSL/TLS"
              description="Toutes les communications sont chiffrées pour protéger vos informations personnelles et financières."
              icon={<Shield className="w-6 h-6" />}
              delay={0}
            />
            <InfoCard
              title="Authentification sécurisée"
              description="Connexion sécurisée avec mot de passe et validation par votre employeur pour chaque demande."
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