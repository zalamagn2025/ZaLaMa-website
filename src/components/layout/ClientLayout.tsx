// components/layout/ClientLayout.tsx
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import SEOProvider from "../SEO/SEOProvider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
        <SEOProvider/>
        <AuthProvider>{children}</AuthProvider>
    </>
  );
}
