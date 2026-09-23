"use client";

import React, { useState } from 'react';
import { ChameleonLogo } from './Icons';
import {
  Compass,
  Globe,
  Monitor,
  Terminal,
  Layers,
  Heart,
  Plus,
  Sparkles,
  Github,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SidebarNavProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  favoritesCount?: number;
  onOpenSubmit?: () => void;
  onOpenRoulette?: () => void;
  className?: string;
}

interface CommunityQuote {
  author: string;
  role: string;
  avatar: string;
  quote: string;
}

const COMMUNITY_QUOTES: Record<string, CommunityQuote> = {
  shocka: {
    author: 'ShockaGG',
    role: 'Creator & Maintainer',
    avatar: '/icon.png',
    quote: 'Random Stuff exists because the internet is filled with incredible hidden gems that deserve a clean, noise-free home.',
  },
  dev: {
    author: 'Alex R.',
    role: 'Full-Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    quote: 'Found Raycast, Warp, and 10+ command-line tools I use every single day from this directory.',
  },
  design: {
    author: 'Elena M.',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    quote: 'The curation quality is top-tier. No sponsored junk, just pure utility.',
  },
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeCategory = 'all',
  onSelectCategory,
  favoritesCount = 0,
  onOpenSubmit,
  onOpenRoulette,
  className = '',
}) => {
  const [hoveredQuote, setHoveredQuote] = useState<string | null>(null);

  const navItems = [
    { id: 'all', label: 'Explore Directory', icon: <Compass className="w-4 h-4" /> },
    { id: 'Websites', label: 'Websites', icon: <Globe className="w-4 h-4" /> },
    { id: 'Softwares', label: 'Software', icon: <Monitor className="w-4 h-4" /> },
    { id: 'Scripts', label: 'Scripts & CLI', icon: <Terminal className="w-4 h-4" /> },
    { id: 'stacks', label: 'Curated Stacks', icon: <Layers className="w-4 h-4" />, badge: 'Featured' },
    {
      id: 'favorites',
      label: 'My Favorites',
      icon: <Heart className="w-4 h-4" />,
      count: favoritesCount,
    },
  ];

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col justify-between py-6 px-4 bg-[#F0F2F5] text-[#304F67] border-r border-[#D6DCE1]/70 select-none ${className}`}
    >
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <ChameleonLogo size={34} />
          <div>
            <div className="font-phudu text-xl font-black tracking-tight text-[#14334D] leading-none">
              RANDOM STUFF
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#456176] uppercase font-bold mt-1">
              Studio Directory
            </div>
          </div>
        </div>

        {/* Directory Navigation */}
        <nav className="space-y-1 mb-8">
          <div className="px-3 text-[10px] font-mono uppercase tracking-widest font-bold text-[#304F68]/50 mb-2">
            Catalog
          </div>
          {navItems.map((item) => {
            const isActive = item.id === activeCategory;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory?.(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#14334D] shadow-studio-button font-bold'
                    : 'text-[#456176] hover:text-[#14334D] hover:bg-white/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#007BE5]' : 'text-[#456176]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {isActive && <ArrowRight className="w-3.5 h-3.5 text-[#007BE5]" />}

                {item.badge && !isActive && (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#9DF71F]/30 text-[#14334D] font-bold">
                    {item.badge}
                  </span>
                )}

                {typeof item.count === 'number' && item.count > 0 && !isActive && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-[#14334D]">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-2 mb-6">
          <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#304F68]/50 mb-2">
            Discovery & Tools
          </div>
          <div className="space-y-1.5">
            {onOpenRoulette && (
              <button
                type="button"
                onClick={onOpenRoulette}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#14334D] bg-white/60 hover:bg-white hover:shadow-xs transition-all cursor-pointer border border-white/60"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Random Roulette</span>
                </div>
                <span className="text-[10px] font-mono text-[#007BE5] font-bold">Try</span>
              </button>
            )}

            <a
              href="/submit"
              onClick={(e) => {
                if (onOpenSubmit) {
                  e.preventDefault();
                  onOpenSubmit();
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#14334D] bg-white/60 hover:bg-white hover:shadow-xs transition-all cursor-pointer border border-white/60"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-[#89E00F]" />
                <span>Submit a Tool</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">+</span>
            </a>

            <a
              href="https://github.com/nipunyatawara-dev/random-stuff-site"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#456176] hover:text-[#14334D] hover:bg-white/60 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section: Community & Curation Proof */}
      <div className="relative px-2 pt-4 border-t border-[#D6DCE1]/80">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest font-bold text-[#304F68]/50 mb-2">
          <span>Curator & Community</span>
          <span className="text-[#89E00F] font-bold">350+</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
          {[
            { id: 'shocka', label: '✦ Shocka' },
            { id: 'dev', label: '⦿ Devs' },
            { id: 'design', label: '◎ Design' },
          ].map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredQuote(item.id)}
              onMouseLeave={() => setHoveredQuote(null)}
              className="p-1.5 rounded-lg text-[11px] text-[#456176] hover:text-[#14334D] hover:bg-white/80 transition-colors cursor-pointer text-center"
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Floating Testimonial Speech Bubble Card */}
        <AnimatePresence>
          {hoveredQuote && COMMUNITY_QUOTES[hoveredQuote] && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-full bottom-2 ml-3 w-72 p-4 rounded-2xl bg-white shadow-studio-popover border border-white/90 z-50 pointer-events-none"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={COMMUNITY_QUOTES[hoveredQuote].avatar}
                  alt={COMMUNITY_QUOTES[hoveredQuote].author}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-[#14334D]">
                    {COMMUNITY_QUOTES[hoveredQuote].author}
                  </div>
                  <div className="text-[10px] text-[#456176]">
                    {COMMUNITY_QUOTES[hoveredQuote].role}
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[#304F67] italic font-sans">
                &ldquo;{COMMUNITY_QUOTES[hoveredQuote].quote}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};
