"use client";

import React, { useState, useEffect } from "react";
import type { Item } from "@/data/items";
import { OtterLogo, MagneticButton, LoadingScreen } from "./studio";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import Footer from "./Footer";
import { useFavorites } from "@/hooks/useFavorites";
import {
  Sparkles,
  Plus,
  Github,
  Menu,
  X,
  Compass,
  Globe,
  Monitor,
  Terminal,
  Layers,
  Heart,
  Scale,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToY } from "@/lib/lenis";
import RandomRouletteModal from "./RandomRouletteModal";
import CompareModal from "./CompareModal";

export default function ClientPageLayout({ items }: { items: Item[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const { favorites, toggleFavorite } = useFavorites();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);

  // Ensure scroll is at the top on mount
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Check if initial session loading screen should be shown
  useEffect(() => {
    try {
      const hasSeenIntro = sessionStorage.getItem("rs_intro_seen");
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!hasSeenIntro && !prefersReducedMotion) {
        setIsLoadingScreenVisible(true);
      }
    } catch {
      // In case sessionStorage is blocked in private browsing
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoadingScreenVisible(false);
    scrollToY(0, { immediate: true });
    window.scrollTo(0, 0);
    try {
      sessionStorage.setItem("rs_intro_seen", "true");
    } catch {
      // Ignore
    }
  };

  // Lock body scroll when mobile drawer or loading screen is open
  useEffect(() => {
    if (mobileDrawerOpen || isLoadingScreenVisible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileDrawerOpen, isLoadingScreenVisible]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      scrollToY(top);
    }
  };

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setMobileDrawerOpen(false);
    scrollToCatalog();
  };

  const navItems = [
    { id: "all", label: "Explore All Tools", icon: <Compass className="w-4 h-4" />, count: items.length },
    {
      id: "Websites",
      label: "Websites",
      icon: <Globe className="w-4 h-4" />,
      count: items.filter((i) => i.category === "Websites").length,
    },
    {
      id: "Softwares",
      label: "Software",
      icon: <Monitor className="w-4 h-4" />,
      count: items.filter((i) => i.category === "Softwares").length,
    },
    {
      id: "Scripts",
      label: "Scripts & CLI",
      icon: <Terminal className="w-4 h-4" />,
      count: items.filter((i) => i.category === "Scripts").length,
    },
    {
      id: "stacks",
      label: "Curated Stacks",
      icon: <Layers className="w-4 h-4" />,
      badge: "Featured",
    },
    {
      id: "favorites",
      label: "My Favorites",
      icon: <Heart className="w-4 h-4" />,
      count: favorites.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#14334D] font-sans antialiased flex flex-col selection:bg-[#9DF71F] selection:text-[#14334D]">
      {/* Charming Otter Animated Loading Screen */}
      <AnimatePresence>
        {isLoadingScreenVisible && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Top Global Studio Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F0F2F5]/85 backdrop-blur-md border-b border-[#D6DCE1] px-4 md:px-8 py-3 select-none">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsLoadingScreenVisible(true)}
            className="flex items-center gap-3 cursor-pointer group text-left"
            title="Replay Otter Intro"
            aria-label="Replay intro animation"
          >
            <div className="group-hover:scale-105 transition-transform duration-200">
              <OtterLogo size={32} />
            </div>
            <span className="font-phudu font-bold text-lg md:text-xl text-[#14334D] tracking-tight">
              RANDOM STUFF
            </span>
          </button>

          {/* Desktop Right Quick Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 text-[#007BE5]" />}
              href="/submit"
            >
              Submit Tool
            </MagneticButton>

            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Github className="w-3.5 h-3.5 text-[#14334D]" />}
              href="https://github.com/nipunyatawara-dev/random-stuff-site"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </MagneticButton>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 min-w-[40px] min-h-[40px] rounded-full bg-white shadow-xs text-[#14334D] flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Open mobile menu"
              aria-expanded={mobileDrawerOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Slide Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setIsLoadingScreenVisible(true);
                    }}
                    className="flex items-center gap-2.5 cursor-pointer text-left group"
                    title="Replay Otter Intro"
                    aria-label="Replay intro animation"
                  >
                    <div className="group-hover:scale-105 transition-transform duration-200">
                      <OtterLogo size={28} />
                    </div>
                    <span className="font-phudu font-bold text-base text-[#14334D]">
                      RANDOM STUFF
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Catalog Navigation Items */}
                <div className="space-y-1 mb-6">
                  <div className="px-3 text-[10px] font-mono uppercase tracking-widest font-bold text-[#304F68]/50 mb-2">
                    Catalog Categories
                  </div>
                  {navItems.map((item) => {
                    const isActive = item.id === activeCategory;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectCategory(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-[#F0F2F5] text-[#007BE5] shadow-xs font-bold"
                            : "text-[#456176] hover:bg-slate-50 hover:text-[#14334D]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? "text-[#007BE5]" : "text-[#456176]"}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#9DF71F]/30 text-[#14334D] font-bold">
                              {item.badge}
                            </span>
                          )}

                          {typeof item.count === "number" && (
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isActive ? "bg-[#007BE5]/10 text-[#007BE5]" : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}

                          {isActive && <ArrowRight className="w-3.5 h-3.5 text-[#007BE5] ml-1" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Discovery & Tools Actions */}
                <div className="space-y-1.5 pt-4 border-t border-slate-100">
                  <div className="px-3 text-[10px] font-mono uppercase tracking-widest font-bold text-[#304F68]/50 mb-2">
                    Discovery & Utilities
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setShowRoulette(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#14334D] bg-[#F0F2F5]/70 hover:bg-[#F0F2F5] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Surprise Roulette</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#007BE5]">Roll</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setShowCompare(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#14334D] bg-[#F0F2F5]/70 hover:bg-[#F0F2F5] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-emerald-500" />
                      <span>Compare Tools</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">vs</span>
                  </button>

                  <a
                    href="/submit"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#14334D] bg-[#F0F2F5]/70 hover:bg-[#F0F2F5] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Plus className="w-4 h-4 text-[#89E00F]" />
                      <span>Submit a Tool</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#89E00F]">+</span>
                  </a>

                  <a
                    href="https://github.com/nipunyatawara-dev/random-stuff-site"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#456176] hover:bg-[#F0F2F5] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github className="w-4 h-4 text-[#14334D]" />
                      <span>GitHub Repository</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Drawer Bottom Credit */}
              <div className="pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>350+ Curated Tools</span>
                <span className="text-[#89E00F] font-bold">100% Free</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Studio Viewport Container */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-2 sm:p-6 flex flex-col items-center">
        {/* Main Rounded Studio Card Canvas */}
        <div className="w-full bg-white rounded-[22px] sm:rounded-[36px] md:rounded-[40px] p-4 sm:p-8 md:p-12 shadow-studio-card border border-white/80 overflow-hidden">
          <HeroSection
            totalItemsCount={items.length}
            onExploreClick={scrollToCatalog}
            onRouletteClick={() => setShowRoulette(true)}
            onSubmitClick={() => {
              window.location.href = "/submit";
            }}
          />

          <ContentSection
            initialItems={items}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </main>

      {/* Global Modals for Top Actions */}
      <RandomRouletteModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        items={items}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        allItems={items}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      {/* Studio Desk Footer */}
      <Footer />
    </div>
  );
}
