"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroImageSrc = "/images/ZaLaMa%20hero%20img%20design%202.png";
const HERO_IMAGE_WIDTH = 700;
const HERO_IMAGE_HEIGHT = 520;

const heroGradientStyle: CSSProperties = {
  background: "linear-gradient(180deg, #0C046A 0%, #0a0360 55%, #08024d 100%)",
};

const dotPatternStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
  backgroundSize: "26px 26px",
};

const heroImageWrapperStyle: CSSProperties = {
  width: `${HERO_IMAGE_WIDTH}px`,
  maxWidth: "none",
};

export const NewHero = () => {
  return (
    <section
      className="relative overflow-hidden text-white lg:overflow-visible"
      style={heroGradientStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={dotPatternStyle}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="relative mx-auto w-full max-w-[1280px] px-4 pt-8 pb-24 sm:px-6 lg:pt-16 lg:pb-40 lg:px-0 lg:pl-16 lg:pr-[640px]">
          <div className="space-y-8 max-w-[720px]">
            <div className="space-y-5">
              <h1 className="w-[756px] h-[180px] text-[30px] font-bold leading-[36px] sm:text-[40px] sm:leading-[46px] lg:text-[55px] lg:leading-[60px] flex items-center">
                Le bien-être financier de vos employés est un levier de performance&nbsp;!
              </h1>
              <p className="text-base text-white/80 sm:text-lg lg:max-w-[520px]">
                Lorem ipsum dolor sit amet consectetur. Arcu tellus etiam neque
                erat. Gravida mattis ut sed purus ut nec arcu aenean curabitur.
                Ultricies felis fringilla vel posuere gravida egestas non.
                Ornare ultrices posuere posuere varius eget amet.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row pb-8">
              <Link
                href="/partnership"
                className="inline-flex items-center justify-center rounded-full bg-[#ff671e] px-8 py-3 text-base font-semibold text-white shadow-[0_20px_35px_rgba(255,103,30,0.35)] transition hover:bg-[#e55c1a]"
              >
                Devenir partenaire
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-8 py-3 text-base font-semibold text-white/90 transition hover:border-white hover:text-white"
              >
                En savoir plus <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="flex w-full max-w-[495px] flex-col gap-[21px] sm:flex-row pb-14">
              <Link
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noreferrer"
                className="flex h-[83px] flex-1 items-center gap-4 rounded-[50px] border border-white/10 bg-gradient-to-b from-[#1b1f82] to-[#070a43] px-5 text-left shadow-[0_24px_60px_rgba(8,9,41,0.45)] transition hover:border-white/30 hover:bg-[#10146a]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Image
                    src="/assets/appstore-badge.svg"
                    alt="Apple App Store logo"
                    width={29}
                    height={27}
                    priority
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] uppercase tracking-[0.08em] text-white/70">
                    Download on the
                  </p>
                  <p className="text-lg font-semibold text-white">App Store</p>
                </div>
              </Link>

              <Link
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noreferrer"
                className="flex h-[83px] flex-1 items-center gap-4 rounded-[50px] border border-white/10 bg-gradient-to-b from-[#1b1f82] to-[#070a43] px-5 text-left shadow-[0_24px_60px_rgba(8,9,41,0.45)] transition hover:border-white/30 hover:bg-[#10146a]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Image
                    src="/assets/googleplay-badge.svg"
                    alt="Google Play logo"
                    width={38}
                    height={42}
                    priority
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] uppercase tracking-[0.08em] text-white/70">
                    Get it on
                  </p>
                  <p className="text-lg font-semibold text-white">Google Play</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:flex lg:items-start pt-4">
            <div className="relative" style={heroImageWrapperStyle}>
              <Image
                src={heroImageSrc}
                width={HERO_IMAGE_WIDTH}
                height={HERO_IMAGE_HEIGHT}
                alt="ZaLaMa interface preview"
                className="h-auto w-full object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,8,35,0) 0%, rgba(2,2,6,1) 75%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
};


