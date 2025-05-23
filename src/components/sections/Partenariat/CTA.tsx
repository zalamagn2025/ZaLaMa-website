"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import Link from "next/link";

export function CTA() {
  const words = [
    { text: "Rejoignez", className: "text-[var(--zalama-primary)]" },
    { text: "le", },
    { text: "réseau", className: "text-[var(--zalama-blue)]" },
    { text: "ZaLaMa", className: "font-bold text-[var(--zalama-success)]" },
    { text: "!", },
  ];
  return (
    <section className="relative flex items-center justify-center py-16 md:py-24">
      <div className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl bg-[var(--zalama-card)] border border-[var(--zalama-border)] shadow-xl px-6 py-12 text-center flex flex-col items-center gap-4 dark:bg-[var(--zalama-bg-dark)]/80">
        <div className="flex items-center justify-center mb-4">
          <span className="inline-flex items-center justify-center rounded-full bg-[var(--zalama-primary)]/10 p-4">
            <UserPlus2 className="h-8 w-8 text-[var(--zalama-primary)]" />
          </span>
        </div>
        <TypewriterEffectSmooth words={words} />
        <p className="text-base md:text-lg text-[var(--zalama-gray)] mb-6 max-w-xl mx-auto">
          Offrez à vos employés la solution financière innovante et responsable ZaLaMa. Notre équipe vous accompagne à chaque étape du partenariat.
        </p>
        <Link href="#formulaire">
          <Button size="lg" className="text-base font-semibold px-8 py-4">
            Formulaire de partenariat
          </Button>
        </Link>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--zalama-primary)]/10 to-transparent rounded-b-3xl" />
      </div>
    </section>
  );
}

