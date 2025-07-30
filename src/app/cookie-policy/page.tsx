import { Metadata } from 'next';
import Link from "next/link";
import { ArrowLeft, Cookie, Shield, Settings, Eye, Clock, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata('cookiePolicy');

export default function CookiePolicyPage() {
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
              <Cookie className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent">
              Politique de Cookies
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl text-zalama-text-secondary max-w-4xl mx-auto leading-relaxed">
            Cette politique explique comment ZaLaMa utilise les cookies et technologies similaires 
            pour améliorer votre expérience sur notre plateforme d'avances sur salaire.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Qu'est-ce qu'un cookie */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Qu'est-ce qu'un cookie ?
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) 
                lorsque vous visitez un site web. Les cookies permettent de :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Mémoriser vos préférences et paramètres</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Améliorer la sécurité de votre compte</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Analyser l'utilisation de notre plateforme</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Personnaliser votre expérience utilisateur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Assurer le bon fonctionnement de nos services</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Types de cookies utilisés */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Types de cookies utilisés
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Cookies essentiels */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-zalama-text flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Cookies essentiels
                </h3>
                <p className="text-zalama-text-secondary">
                  Ces cookies sont nécessaires au fonctionnement de la plateforme et ne peuvent pas être désactivés.
                </p>
                <ul className="space-y-2 ml-4 text-zalama-text-secondary">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Authentification et sécurité de session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Protection contre les attaques CSRF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Gestion des préférences de langue</span>
                  </li>
                </ul>
              </div>

              {/* Cookies de performance */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-zalama-text flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Cookies de performance
                </h3>
                <p className="text-zalama-text-secondary">
                  Ces cookies nous aident à comprendre comment vous utilisez notre plateforme.
                </p>
                <ul className="space-y-2 ml-4 text-zalama-text-secondary">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Analyse des pages les plus visitées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Mesure des temps de chargement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Détection des erreurs techniques</span>
                  </li>
                </ul>
              </div>

              {/* Cookies de fonctionnalité */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-zalama-text flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Cookies de fonctionnalité
                </h3>
                <p className="text-zalama-text-secondary">
                  Ces cookies améliorent votre expérience en mémorisant vos choix.
                </p>
                <ul className="space-y-2 ml-4 text-zalama-text-secondary">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Préférences de thème (clair/sombre)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Paramètres de notification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                    <span>Préférences d'affichage du tableau de bord</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies tiers */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Cookies tiers
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Nous utilisons également des services tiers qui peuvent placer des cookies :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Google Analytics :</strong> Analyse de l'utilisation de la plateforme</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Supabase :</strong> Authentification et base de données</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Resend :</strong> Envoi d'emails transactionnels</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Nimbasms :</strong> Envoi de SMS de notification</span>
                </li>
              </ul>
              <p className="text-sm text-zalama-text-secondary/80 mt-4">
                Chaque service tiers a sa propre politique de confidentialité concernant l'utilisation des cookies.
              </p>
            </div>
          </section>

          {/* Durée de conservation */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Durée de conservation
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Les cookies sont conservés pour des durées variables selon leur type :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies persistants :</strong> Conservés jusqu'à 2 ans maximum</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies d'authentification :</strong> 30 jours pour la sécurité</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies analytiques :</strong> 13 mois conformément au RGPD</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Gestion des cookies */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Gestion des cookies
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Vous pouvez contrôler et gérer les cookies de plusieurs façons :
              </p>
              
              <div className="space-y-4">
                <div className="bg-zalama-bg-darker/50 rounded-xl p-6 border border-border/20">
                  <h3 className="text-lg font-semibold text-zalama-text mb-3">Paramètres du navigateur</h3>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                      <span>Chrome : Paramètres → Confidentialité et sécurité → Cookies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                      <span>Firefox : Options → Confidentialité et sécurité → Cookies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                      <span>Safari : Préférences → Confidentialité → Cookies</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zalama-bg-darker/50 rounded-xl p-6 border border-border/20">
                  <h3 className="text-lg font-semibold text-zalama-text mb-3">Bannière de consentement</h3>
                  <p>
                    Lors de votre première visite, une bannière vous permet de choisir quels types de cookies accepter.
                    Vous pouvez modifier vos choix à tout moment via les paramètres de votre compte.
                  </p>
                </div>

                <div className="bg-zalama-bg-darker/50 rounded-xl p-6 border border-border/20">
                  <h3 className="text-lg font-semibold text-zalama-text mb-3">Suppression manuelle</h3>
                  <p>
                    Vous pouvez supprimer tous les cookies existants via les paramètres de votre navigateur.
                    Notez que cela peut affecter le fonctionnement de certains services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact de la désactivation */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Trash2 className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Impact de la désactivation
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                La désactivation de certains cookies peut affecter votre expérience :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies essentiels :</strong> La plateforme ne fonctionnera pas correctement</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies de performance :</strong> Nous ne pourrons pas optimiser l'expérience</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies de fonctionnalité :</strong> Vos préférences ne seront pas sauvegardées</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span><strong>Cookies tiers :</strong> Certains services externes peuvent ne pas fonctionner</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Mise à jour de la politique */}
          <section className="bg-zalama-bg-dark/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zalama-text">
                Mise à jour de cette politique
              </h2>
            </div>
            
            <div className="space-y-4 text-zalama-text-secondary leading-relaxed">
              <p>
                Cette politique de cookies peut être mise à jour pour refléter :
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>L'évolution de nos services et technologies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>Les changements de réglementation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                  <span>L'ajout de nouveaux services tiers</span>
                </li>
              </ul>
              <p className="text-sm text-zalama-text-secondary/80 mt-4">
                Nous vous informerons de toute modification importante via un avis sur la plateforme 
                ou par email.
              </p>
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
                Pour toute question concernant notre utilisation des cookies, vous pouvez nous contacter :
              </p>
              <div className="bg-zalama-bg-darker/50 rounded-xl p-6 border border-border/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span><strong>Email :</strong> contact@zalamagn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span><strong>Délégué à la protection des données :</strong> mryoula@zalamagn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-primary" />
                    <span><strong>Support technique :</strong> support@zalamagn.com</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zalama-text-secondary/80">
                Nous nous engageons à répondre à votre demande dans un délai maximum de 48 heures.
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