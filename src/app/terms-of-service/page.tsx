import { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, FileText, Shield, Users, CreditCard, AlertTriangle, CheckCircle, Mail, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('termsOfService');

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent">
              Conditions d'utilisation
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl text-zalama-text-secondary max-w-4xl mx-auto leading-relaxed">
            Ces conditions d'utilisation régissent l'utilisation de la plateforme ZaLaMa et définissent 
            les droits et obligations de tous les utilisateurs de nos services d'avance sur salaire.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Définitions */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Définitions
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Dans le cadre de ces conditions d'utilisation, les termes suivants ont les significations suivantes :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>ZaLaMa :</strong> La plateforme fintech proposant des services d'avance sur salaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Utilisateur :</strong> Tout employé inscrit sur la plateforme ZaLaMa</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Partenaire :</strong> L'entreprise employeur ayant signé un contrat avec ZaLaMa</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Avance sur salaire :</strong> Le service de prêt à court terme proposé par ZaLaMa</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Plateforme :</strong> L'application web et mobile de ZaLaMa</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Éligibilité et inscription */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Éligibilité et inscription
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Pour utiliser les services ZaLaMa, vous devez remplir les conditions suivantes :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Être employé d'une entreprise partenaire de ZaLaMa</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Avoir un contrat de travail en cours de validité (CDI, CDD, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Être majeur et avoir la capacité juridique</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Fournir des informations exactes et à jour</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Accepter ces conditions d'utilisation</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Services proposés */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Services proposés
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                ZaLaMa propose les services suivants :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Avance sur salaire :</strong> Prêt à court terme jusqu'à 30% du salaire net mensuel</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Gestion de compte :</strong> Interface pour suivre vos demandes et transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Support client :</strong> Assistance technique et commerciale</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Conseils financiers :</strong> Ressources et outils de gestion budgétaire</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Limites et conditions */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Limites et conditions
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                L'utilisation des services ZaLaMa est soumise aux limites suivantes :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Montant maximum :</strong> 30% du salaire net mensuel</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Frais de service :</strong> 6% du montant demandé (minimum 5 000 GNF)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Délai de remboursement :</strong> À la prochaine date de paie</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Validation :</strong> Soumise à l'approbation de l'employeur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Disponibilité :</strong> Une demande par mois maximum</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Obligations de l'utilisateur */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Obligations de l'utilisateur
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                En utilisant la plateforme ZaLaMa, vous vous engagez à :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Fournir des informations exactes et à jour</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Protéger vos identifiants de connexion</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Utiliser la plateforme de manière légale et éthique</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Respecter les limites de montant et de fréquence</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Signaler immédiatement toute utilisation non autorisée</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Maintenir votre emploi chez l'entreprise partenaire</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Responsabilités de ZaLaMa */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Responsabilités de ZaLaMa
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                ZaLaMa s'engage à :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Maintenir la plateforme disponible et sécurisée</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Protéger la confidentialité de vos données</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Traiter les demandes dans les délais annoncés</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Fournir un support client réactif</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Respecter les réglementations financières en vigueur</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Limitation de responsabilité
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                ZaLaMa ne peut être tenu responsable :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Des pertes financières liées à l'utilisation des services</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Des interruptions de service dues à la maintenance</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Des erreurs de saisie de l'utilisateur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Des décisions de refus d'avance par l'employeur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Des problèmes techniques indépendants de notre volonté</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Résiliation */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Résiliation
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Ces conditions peuvent être résiliées dans les cas suivants :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Par l'utilisateur :</strong> À tout moment en supprimant son compte</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Par ZaLaMa :</strong> En cas de non-respect des conditions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Automatiquement :</strong> En cas de fin de contrat avec l'employeur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Conséquences :</strong> Accès immédiatement suspendu aux services</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Droit applicable */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Droit applicable
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Ces conditions d'utilisation sont régies par :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Le droit guinéen pour les aspects contractuels</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Les réglementations financières de la BCEAO</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Les lois sur la protection des données personnelles</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Les normes de sécurité financière en vigueur</span>
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
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
              </p>
              <div className="bg-zalama-bg-darker/50 rounded-xl p-6 border border-border/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span><strong>Email :</strong> contact@zalamagn.com</span>
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