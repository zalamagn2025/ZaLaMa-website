import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "@/components/providers";
import { AutocompleteDisabler } from "@/components/auth/AutocompleteDisabler";
import { defaultMetadata } from "@/lib/metadata";

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
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
