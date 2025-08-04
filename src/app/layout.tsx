import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "@/components/providers";
import { AutocompleteDisabler } from "@/components/auth/AutocompleteDisabler";
import { defaultMetadata } from "@/lib/metadata";
import { generateOrganizationSchema } from "@/lib/structured-data";
import { SEOProvider } from "@/components/SEO/SEOProvider";

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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
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
          dangerouslySetInnerHTML={{ __html: generateOrganizationSchema() }}
        />
      </head>
      <body
        className={twMerge(
          dmSans.className, 
          "antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100"
        )}
      >
        <ThemeProvider>
          <AuthProvider>
            <AutocompleteDisabler />
            <SEOProvider canonicalUrl="https://www.zalamagn.com">
              {children}
            </SEOProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
