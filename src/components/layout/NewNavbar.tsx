"use client";

import { MenuIcon, UserRound, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type DropdownKey = "solutions" | "resources" | null;

const mainLinks = [
  { label: "Accueil", href: "/" },
  { label: "Entreprise", href: "/enterprise" },
  { label: "Solutions", dropdownKey: "solutions" as const },
  { label: "Ressources", dropdownKey: "resources" as const },
  { label: "A propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const resourcesLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Guides", href: "/guides" },
  { label: "Webinars", href: "/webinars" },
];

const solutionsLinks = [
  { label: "Salaire à la demande", href: "/solutions/pay-on-demand" },
  { label: "Budget coaching", href: "/solutions/coaching" },
  { label: "Épargne collective", href: "/solutions/savings" },
];

const containerClasses =
  "max-w-[1200px] mx-auto flex items-center justify-between gap-6 px-6";

export const NewNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<DropdownKey>(null);
  const [mobileDropdown, setMobileDropdown] = useState<DropdownKey>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      setMobileDropdown(null);
    }
  }, [isMenuOpen]);

  const renderLinks = (variant: "desktop" | "mobile") => (
    <div
      className={
        variant === "desktop"
          ? "hidden lg:flex items-center gap-8 text-sm font-medium"
          : "flex flex-col gap-4 text-base font-medium"
      }
    >
      {mainLinks.map((link) => {
        if (link.dropdownKey) {
          const dropdownKey = link.dropdownKey;
          const dropdownVisible =
            variant === "desktop"
              ? desktopDropdown === dropdownKey
              : mobileDropdown === dropdownKey;
          const dropdownItems =
            dropdownKey === "resources" ? resourcesLinks : solutionsLinks;

          return (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() =>
                variant === "desktop" && setDesktopDropdown(dropdownKey)
              }
              onMouseLeave={() =>
                variant === "desktop" && setDesktopDropdown(null)
              }
            >
              <button
                className="flex items-center gap-1 text-white/80 hover:text-white transition"
                onClick={() =>
                  variant === "mobile" &&
                  setMobileDropdown((prev) =>
                    prev === dropdownKey ? null : dropdownKey,
                  )
                }
                aria-haspopup="menu"
                aria-expanded={dropdownVisible}
              >
                {link.label}
                <ChevronDown className="h-4 w-4" />
              </button>
              {dropdownVisible && (
                <div
                  className={
                    variant === "desktop"
                      ? "absolute left-0 top-9 w-52 rounded-2xl bg-white/95 text-sm text-gray-900 shadow-xl"
                      : "mt-3 rounded-2xl bg-white/95 text-gray-900 shadow-lg"
                  }
                >
                  <ul className="p-3 space-y-1">
                    {dropdownItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-left text-gray-900 hover:bg-[#0d2dcf]/5"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            className="text-white/80 hover:text-white transition"
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="relative isolate w-full bg-[#0C046A] text-white">
      <div className="py-5">
        <div className={`${containerClasses} relative z-10`}>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/zalamaLogo.svg"
              width={140}
              height={40}
              alt="ZaLaMa logo"
              priority
              className="h-10 w-auto"
            />
          </Link>

          {renderLinks("desktop")}

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/recommendations"
              className="inline-flex items-center gap-2 rounded-[5px] bg-[#ff671e] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e55c1a]"
            >
              <UserRound className="h-4 w-4" />
              Pour les employés
            </Link>
          </div>

          <button
            className="lg:hidden rounded-full border border-white/30 p-2 text-white"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0C046A] px-6 py-6">
            {renderLinks("mobile")}
            <Link
              href="/recommendations"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff671e] px-5 py-3 text-sm font-semibold text-white"
            >
              <UserRound className="h-4 w-4" />
              Pour les employés
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
