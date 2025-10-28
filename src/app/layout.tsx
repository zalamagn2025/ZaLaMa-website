import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { EmployeeAuthProvider } from "../contexts/EmployeeAuthContext";
import { AccountAuthProvider } from "../contexts/AccountAuthContext";
import { ThemeProvider } from "@/components/providers";
import { AutocompleteDisabler } from "@/components/auth/AutocompleteDisabler";
import { defaultMetadata } from "@/lib/metadata";
import { generateOrganizationSchema } from "@/lib/structured-data";
import { SEOProvider } from "@/components/SEO/SEOProvider";
import { FontAwesomeLoader } from "@/components/common/FontAwesomeLoader";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = defaultMetadata;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="relative" suppressHydrationWarning={true}>
      <head>
        {/* Font Awesome est chargé via next.config.js pour éviter les erreurs d'hydratation */}
        {/* Désactiver l'auto-complétion et les suggestions de mots de passe */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="autocomplete" content="off" />
        <meta name="data-form-type" content="other" />
        <meta name="data-lpignore" content="true" />
        
        {/* Préchargement des ressources critiques */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://mspmrzlqhwpdkkburjiw.supabase.co" />
        
        {/* Balises structurées globales */}
        <script
          type="application/ld+json"
        />
      </head>
      <body className={twMerge("min-h-screen bg-background font-sans antialiased", dmSans.className)}>
        <FontAwesomeLoader />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EmployeeAuthProvider>
            <AccountAuthProvider>
              <SEOProvider>
                <AutocompleteDisabler />
                {children}
              </SEOProvider>
            </AccountAuthProvider>
          </EmployeeAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
