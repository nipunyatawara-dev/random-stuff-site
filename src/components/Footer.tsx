"use client";

import React from "react";
import { ChameleonLogo, MagneticButton } from "./studio";
import { Plus, Github, ExternalLink, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-12 mb-6 px-3 sm:px-6 select-none">
      <div className="w-full max-w-[1600px] mx-auto bg-white/90 backdrop-blur-md rounded-[32px] md:rounded-[40px] p-8 md:p-12 shadow-studio-card border border-white/90 flex flex-col items-center text-center">
        {/* Top Chameleon Brand Badge */}
        <div className="flex items-center gap-2.5 mb-4">
          <ChameleonLogo size={36} />
          <span className="font-phudu text-2xl font-black text-[#14334D] tracking-tight">
            RANDOM STUFF
          </span>
        </div>

        {/* Narrative & Two-Tone Subtitle */}
        <p className="font-sans text-base sm:text-lg text-[#304F67] font-medium max-w-lg leading-relaxed mb-1">
          A high-taste directory <span className="text-[#A0AFBB] font-normal">for builders</span>{" "}
          <br className="hidden sm:inline" />
          <span className="text-[#A0AFBB] font-normal">who want the</span> very best software & web tools.
        </p>

        <p className="font-caveat text-xl sm:text-2xl text-[#007BE5] font-bold mb-8">
          Free forever. No sponsored bias. Pure utility.
        </p>

        {/* Action Magnetic Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <MagneticButton
            variant="accent-lime"
            size="md"
            icon={<Plus className="w-4 h-4 text-[#14334D]" />}
            href="/submit"
          >
            Submit a Tool
          </MagneticButton>

          <MagneticButton
            variant="primary-light"
            size="md"
            icon={<Github className="w-4 h-4 text-[#14334D]" />}
            href="https://github.com/nipunyatawara-dev/random-stuff-site"
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
          </MagneticButton>

          <MagneticButton
            variant="primary-light"
            size="md"
            icon={<ExternalLink className="w-4 h-4 text-[#007BE5]" />}
            href="https://shocka.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ShockaGG Portfolio
          </MagneticButton>
        </div>

        {/* Bottom Hairline & Credits */}
        <div className="w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#456176]">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <a
              href="https://shocka.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#14334D] hover:text-[#007BE5] transition-colors underline"
            >
              ShockaGG
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/nipun.is.existing/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#14334D] transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span>•</span>
            <span className="text-slate-400">Next.js 16</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
