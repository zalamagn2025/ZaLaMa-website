import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import SEOProvider from "../components/SEO/SEOProvider";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZaLaMa SAS",
  description: "La fintech des avances sur salaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="relative">
      <body
        className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}
      >
        <SEOProvider />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
