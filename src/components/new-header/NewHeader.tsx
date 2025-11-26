'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, User } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Entreprise', href: '/about' },
  { label: 'Solutions', href: '/services', hasDropdown: true },
  { label: 'Ressources', href: '/resources', hasDropdown: true },
  { label: 'A propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const NewHeader = () => {
  const pathname = usePathname();

  return (
    <header className="relative z-40">
      {/* Barre bleue + motif de points */}
      <div className="relative h-[72px] w-full border-b border-[#1b45ff] bg-[#060d8a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/zalamaLogo.svg"
              width={150}
              height={40}
              alt="ZaLaMa"
              priority
              className="h-[32px] w-auto sm:h-[36px]"
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-10 text-[13px] text-white/80 sm:flex">
            {navLinks.map((item) => {
              const isActive =
                item.label === 'Accueil' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative flex items-center gap-1.5 pb-[6px] transition-colors hover:text-white"
                >
                  <span className={isActive ? 'text-white' : 'text-white/80'}>
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown className="h-3 w-3 text-white/70" strokeWidth={2} />
                  )}
                  {item.label === 'Accueil' && (
                    <span className="pointer-events-none absolute inset-x-0 -bottom-[2px] mx-auto h-[2px] w-8 rounded-full bg-[#ff671e]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bouton "Pour les employés" */}
          <div className="flex items-center justify-end">
            <Link href="/login">
              <button className="inline-flex items-center gap-2 rounded-[6px] bg-[#ff671e] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(255,103,30,0.45)] transition hover:bg-[#e55c1a]">
                <User className="h-4 w-4" />
                <span>Pour les employés</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};