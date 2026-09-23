"use client";

import React from 'react';
import {
  MagneticButton,
  PolaroidCard,
  InlineBadge,
  ProjectsFolderIcon,
  OtterLogo,
} from './studio';
import { Sparkles, Plus, ArrowDown } from 'lucide-react';

export interface HeroSectionProps {
  totalItemsCount?: number;
  onExploreClick?: () => void;
  onRouletteClick?: () => void;
  onSubmitClick?: () => void;
}

export default function HeroSection({
  totalItemsCount = 350,
  onExploreClick,
  onRouletteClick,
  onSubmitClick,
}: HeroSectionProps) {
  const scrollToCatalog = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-4 pb-12 md:pb-16 flex flex-col items-center select-none">
      {/* Main Display Headline */}
      <div className="max-w-[860px] mx-auto text-center px-2 sm:px-4 mb-3 sm:mb-4">
        <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold text-[#304F67] leading-[1.2] sm:leading-[1.16] tracking-[-0.035em]">
          The <InlineBadge type="otter" /> directory{' '}
          <span className="text-[#A0AFBB] font-normal">for builders</span>{' '}
          <br className="hidden md:inline" />
          <span className="text-[#A0AFBB] font-normal">who simply</span> can&apos;t afford to waste time
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#456176] font-medium max-w-xl mx-auto mt-3 sm:mt-4 leading-relaxed">
          Every essential bookmark, desktop software, and script you need.{' '}
          <span className="font-caveat text-xl sm:text-2xl md:text-3xl font-bold text-[#007BE5] underline decoration-wavy decoration-[#82CCFF]">
            Handpicked daily
          </span>
          . No sponsored noise, just craft.
        </p>
      </div>

      {/* Hero Magnetic CTA Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 my-6 sm:my-8 px-2 sm:px-4">
        <MagneticButton
          variant="primary-light"
          size="lg"
          icon={<ProjectsFolderIcon size={22} />}
          onClick={scrollToCatalog}
        >
          Explore {totalItemsCount}+ Tools
        </MagneticButton>

        {onRouletteClick && (
          <MagneticButton
            variant="accent-lime"
            size="lg"
            icon={<Sparkles className="w-5 h-5 text-[#14334D]" />}
            onClick={onRouletteClick}
          >
            Surprise Roulette
          </MagneticButton>
        )}

        <MagneticButton
          variant="primary-dark"
          size="lg"
          icon={<Plus className="w-5 h-5 text-white" />}
          href="/submit"
          onClick={onSubmitClick}
        >
          Submit a Tool
        </MagneticButton>
      </div>

      {/* Polaroid Scrapbook Stage */}
      <div className="w-full max-w-[860px] mx-auto mt-4 sm:mt-6 mb-6 sm:mb-8 px-1 sm:px-4">
        <div
          data-lenis-prevent
          className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-4 md:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar pb-3 sm:pb-0 items-center justify-start sm:justify-items-center snap-x snap-mandatory px-3 sm:px-0"
        >
          {/* Polaroid 1: Raycast */}
          <div className="snap-center shrink-0 w-[240px] sm:w-full flex justify-center">
            <PolaroidCard
              caption="Feels fresh....."
              pinType="red-pin"
              rotation={-4}
              className="w-full max-w-[240px]"
              onClick={scrollToCatalog}
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#14334D] to-slate-800 p-4 flex flex-col justify-between items-center text-center">
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                    Top Software
                  </span>
                </div>
                <div className="my-auto">
                  <span className="font-phudu text-2xl font-black text-white block">Raycast</span>
                  <span className="text-[11px] text-[#82CCFF] font-medium mt-0.5 block">Launcher on steroids</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ★ 100% Free Tier
                </span>
              </div>
            </PolaroidCard>
          </div>

          {/* Polaroid 2: Builder Stacks */}
          <div className="snap-center shrink-0 w-[240px] sm:w-full flex justify-center">
            <PolaroidCard
              caption="Builder Stacks"
              pinType="paperclip"
              rotation={3}
              className="w-full max-w-[240px]"
              onClick={scrollToCatalog}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#8ED5FF] via-[#BFE5FF] to-[#73C800] p-4 flex flex-col justify-between items-center text-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#14334D] font-bold">
                  Curated Kits
                </span>
                <div className="my-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/80 shadow-studio-button flex items-center justify-center mb-1.5">
                    <OtterLogo size={28} />
                  </div>
                  <span className="font-phudu text-lg font-black text-[#14334D]">
                    Developer & Design
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#14334D] font-bold bg-white/60 px-2 py-0.5 rounded-full">
                  4 Power Stacks
                </span>
              </div>
            </PolaroidCard>
          </div>

          {/* Polaroid 3: Studio Motto */}
          <div className="snap-center shrink-0 w-[240px] sm:w-full flex justify-center">
            <PolaroidCard
              caption="Our Motto"
              pinType="green-pin"
              rotation={-2}
              className="w-full max-w-[240px]"
              onClick={scrollToCatalog}
            >
              <div className="w-full h-full bg-[#14334D] text-white p-4 flex flex-col justify-between items-center text-center">
                <span className="font-phudu text-[11px] font-bold text-[#9DF71F] uppercase tracking-widest">
                  Principle
                </span>
                <div className="my-auto space-y-1">
                  <span className="font-sans font-black text-sm block tracking-tight">
                    ZERO SPONSORED ADS
                  </span>
                  <span className="font-caveat text-xl text-[#82CCFF] block">
                    Only tools that matter
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-300">
                  Community Driven
                </span>
              </div>
            </PolaroidCard>
          </div>
        </div>
      </div>

      {/* Downward Scroll Guide */}
      <button
        type="button"
        onClick={scrollToCatalog}
        aria-label="Scroll to directory catalog"
        className="mt-2 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#456176] hover:text-[#14334D] transition-colors cursor-pointer group"
      >
        <span>Browse All Tools Below</span>
        <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
      </button>
    </section>
  );
}
