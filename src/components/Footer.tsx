"use client";

import React from "react";
import { OtterLogo, MagneticButton } from "./studio";
import { Plus, Github, ExternalLink, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-12 mb-6 px-3 sm:px-6 select-none">
      <div className="w-full max-w-[1600px] mx-auto bg-surface/90 backdrop-blur-md rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-studio-card border border-studio-neutral-200/80 flex flex-col items-center text-center">
        {/* Top Otter Brand Badge */}
        <div className="flex items-center gap-2.5 mb-4">
          <OtterLogo size={36} />
          <span className="font-phudu text-2xl font-black text-studio-navy tracking-tight">
            RANDOM STUFF
          </span>
        </div>

        {/* Narrative & Two-Tone Subtitle */}
        <p className="font-sans text-base sm:text-lg text-studio-slate font-medium max-w-lg leading-relaxed mb-1">
          A high-taste directory <span className="text-studio-light-muted font-normal">for builders</span>{" "}
          <br className="hidden sm:inline" />
          <span className="text-studio-light-muted font-normal">who want the</span> very best software & web tools.
        </p>

        <p className="font-caveat text-xl sm:text-2xl text-studio-blue font-bold mb-8">
          Free forever. No sponsored bias. Pure utility.
        </p>

        {/* Action Magnetic Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <MagneticButton
            variant="accent-lime"
            size="md"
            icon={<Plus className="w-4 h-4 text-studio-navy" />}
            href="/submit"
          >
            Submit a Tool
          </MagneticButton>

          <MagneticButton
            variant="primary-light"
            size="md"
            icon={<Github className="w-4 h-4 text-studio-navy" />}
            href="https://github.com/nipunyatawara-dev/random-stuff-site"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub
          </MagneticButton>

          <MagneticButton
            variant="primary-light"
            size="md"
            icon={<ExternalLink className="w-4 h-4 text-studio-blue" />}
            href="https://shocka.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ShockaGG Portfolio
          </MagneticButton>
        </div>

        {/* Bottom Hairline & Credits */}
        <div className="w-full pt-6 border-t border-studio-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-studio-muted">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <a
              href="https://shocka.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-studio-navy hover:text-studio-blue transition-colors underline"
            >
              ShockaGG
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/nipun.is.existing/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-studio-navy transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span>•</span>
            <span className="text-studio-neutral-400">Next.js 16</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
