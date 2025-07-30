import { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Users, Mail, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('privacyPolicy');

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zalama-bg-darker via-zalama-bg-dark to-zalama-bg-darker">
        <BackgroundEffects />
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
           <Link href="/" className="inline-flex items-center gap-2 text-zalama-text-secondary hover:text-primary transition-colors mb-6">
             <ArrowLeft className="w-4 h-4" />
             Retour à l'accueil
           </Link>
           
           <div className="flex items-center justify-center gap-4 mb-6">
             <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
               <Shield className="w-6 h-6" />
             </div>
             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent">
               Politique de confidentialité
             </h1>
           </div>
           
           <p className="text-lg sm:text-xl text-zalama-text-secondary max-w-4xl mx-auto leading-relaxed">
             Chez ZaLaMa, nous nous engageons à protéger votre vie privée et à traiter vos données personnelles 
             avec la plus grande transparence et sécurité. Cette politique décrit comment nous collectons, 
             utilisons et protégeons vos informations.
           </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Collecte des données */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Collecte des données
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Nous collectons les informations suivantes pour vous fournir nos services :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Informations d'identification (nom, prénom, email, téléphone)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Informations professionnelles (poste, entreprise, salaire)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Données de transaction (historique des avances, montants)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Données techniques (adresse IP, cookies, logs de connexion)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Utilisation des données */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Utilisation des données
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Traiter vos demandes d'avance sur salaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Vérifier votre éligibilité et calculer les limites</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Assurer la sécurité de votre compte et prévenir la fraude</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Améliorer nos services et personnaliser votre expérience</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Vous informer des nouveautés et offres pertinentes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Stockage et sécurité */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Stockage et sécurité
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Chiffrement SSL/TLS pour toutes les transmissions de données</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Stockage sécurisé sur des serveurs conformes aux normes internationales</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Accès restreint aux données avec authentification multi-facteurs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Surveillance continue et audits de sécurité réguliers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Sauvegarde automatique et récupération de données</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Droits des utilisateurs */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Vos droits
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Conformément au RGPD et aux lois locales, vous disposez des droits suivants :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Droit d'accès :</strong> Consulter vos données personnelles</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Droit de rectification :</strong> Corriger des données inexactes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Conservation des données */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Conservation des données
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Nous conservons vos données uniquement le temps nécessaire à la réalisation des finalités 
                pour lesquelles elles ont été collectées :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Données de compte :</strong> Pendant la durée de votre inscription + 3 ans</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Données de transaction :</strong> 10 ans (obligation légale comptable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Logs de connexion :</strong> 12 mois pour la sécurité</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies :</strong> Selon la durée définie dans notre politique cookies</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Nous contacter
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                vous pouvez nous contacter :
              </p>
              <div className="bg-zalama-bg-darker/50 rounded-xl p-6 border border-border/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span><strong>Email :</strong> Contact@zalamagn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span><strong>Délégué à la protection des données :</strong> mryoula@zalamagn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-primary" />
                    <span><strong>Support technique :</strong> support@zalamagn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span><strong>Adresse :</strong> Carrefour Constantin - Immeuble DING CITY, 3ème étage - C/Matam - Conakry - Guinée</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zalama-text-secondary/80">
                Nous nous engageons à répondre à votre demande dans un délai maximum de 24 heures.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border/30">
            <p className="text-sm text-zalama-text-secondary/80 mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white border-0">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}