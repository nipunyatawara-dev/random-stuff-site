"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Item } from "@/data/items";
import { OtterLogo, MagneticButton, LoadingScreen } from "./studio";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import Footer from "./Footer";
import ColorModeToggle from "./ColorModeToggle";
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
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToY, stopLenis, startLenis } from "@/lib/lenis";
import { isSoundEnabled, toggleSound } from "@/lib/sound-fx";
const RandomRouletteModal = dynamic(() => import("./RandomRouletteModal"));
const CompareModal = dynamic(() => import("./CompareModal"));

export default function ClientPageLayout({ items }: { items: Item[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const { favorites, toggleFavorite } = useFavorites();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [hasOpenedCompare, setHasOpenedCompare] = useState(false);
  const openCompare = () => {
    setHasOpenedCompare(true);
    setShowCompare(true);
  };
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(false);
  const [isIntroDismissing, setIsIntroDismissing] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // Sync sound effect preference
  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const onSoundToggle = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean }>).detail;
      if (detail && typeof detail.enabled === "boolean") {
        setSoundOn(detail.enabled);
      }
    };
    window.addEventListener("sound-toggle", onSoundToggle);
    return () => window.removeEventListener("sound-toggle", onSoundToggle);
  }, []);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  // Ensure scroll is at the top on mount
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Show initial loading screen on mount
  useEffect(() => {
    setIsLoadingScreenVisible(true);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoadingScreenVisible(false);
    setIsIntroDismissing(false);
  };

  // Lock body scroll and halt virtual scroll when mobile drawer or active loading screen is open
  useEffect(() => {
    if (mobileDrawerOpen || (isLoadingScreenVisible && !isIntroDismissing)) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      stopLenis();
      return () => {
        document.body.style.overflow = prev;
        startLenis();
      };
    }
  }, [mobileDrawerOpen, isLoadingScreenVisible, isIntroDismissing]);

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
    <div className="min-h-screen bg-canvas text-studio-navy font-sans antialiased flex flex-col selection:bg-[#9DF71F] selection:text-studio-ink">
      {/* Charming Otter Animated Loading Screen */}
      <AnimatePresence>
        {isLoadingScreenVisible && (
          <LoadingScreen
            onComplete={handleLoadingComplete}
            onDismissStart={() => setIsIntroDismissing(true)}
          />
        )}
      </AnimatePresence>

      {/* Top Global Studio Navigation Bar */}
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-border-subtle px-4 md:px-8 py-3 select-none">
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
            <span className="font-phudu font-bold text-lg md:text-xl text-studio-navy tracking-tight">
              RANDOM STUFF
            </span>
          </button>

          {/* Desktop Right Quick Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <ColorModeToggle />
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 min-w-[36px] min-h-[36px] rounded-full bg-surface shadow-studio-button border border-border-subtle text-studio-navy hover:bg-studio-neutral-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title={soundOn ? "Disable Sound Effects" : "Enable Sound Effects"}
              aria-label={soundOn ? "Disable Sound Effects" : "Enable Sound Effects"}
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-studio-blue" />
              ) : (
                <VolumeX className="w-4 h-4 text-studio-neutral-400" />
              )}
            </button>

            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5 text-studio-blue" />}
              href="/submit"
            >
              Submit Tool
            </MagneticButton>

            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Github className="w-3.5 h-3.5 text-studio-navy" />}
              href="https://github.com/nipunyatawara-dev/random-stuff-site"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </MagneticButton>
          </div>

          {/* Mobile Actions: Sound Toggle + Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <ColorModeToggle />
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 min-w-[40px] min-h-[40px] rounded-full bg-surface shadow-xs border border-border-subtle text-studio-navy flex items-center justify-center hover:bg-studio-neutral-50 active:scale-95 transition-all cursor-pointer"
              title={soundOn ? "Disable Sound Effects" : "Enable Sound Effects"}
              aria-label={soundOn ? "Disable Sound Effects" : "Enable Sound Effects"}
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-studio-blue" />
              ) : (
                <VolumeX className="w-4 h-4 text-studio-neutral-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 min-w-[40px] min-h-[40px] rounded-full bg-surface shadow-xs border border-border-subtle text-studio-navy flex items-center justify-center hover:bg-studio-neutral-50 active:scale-95 transition-all cursor-pointer"
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
              className="relative w-full max-w-[320px] bg-surface h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-studio-neutral-100 mb-6">
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
                    <span className="font-phudu font-bold text-base text-studio-navy">
                      RANDOM STUFF
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-studio-neutral-100 flex items-center justify-center text-studio-neutral-500 hover:text-studio-neutral-800 transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Catalog Navigation Items */}
                <div className="space-y-1 mb-6">
                  <div className="px-3 text-[10px] font-mono uppercase tracking-widest font-bold text-studio-label/50 mb-2">
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
                            ? "bg-canvas text-studio-blue shadow-xs font-bold"
                            : "text-studio-muted hover:bg-studio-neutral-50 hover:text-studio-navy"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? "text-studio-blue" : "text-studio-muted"}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#9DF71F]/30 text-studio-navy font-bold">
                              {item.badge}
                            </span>
                          )}

                          {typeof item.count === "number" && (
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isActive ? "bg-[#007BE5]/10 text-studio-blue" : "bg-studio-neutral-100 text-studio-neutral-500"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}

                          {isActive && <ArrowRight className="w-3.5 h-3.5 text-studio-blue ml-1" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Discovery & Tools Actions */}
                <div className="space-y-1.5 pt-4 border-t border-studio-neutral-100">
                  <div className="px-3 text-[10px] font-mono uppercase tracking-widest font-bold text-studio-label/50 mb-2">
                    Discovery & Utilities
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setShowRoulette(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-studio-navy bg-canvas/70 hover:bg-canvas transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Surprise Roulette</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-studio-blue">Roll</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      openCompare();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-studio-navy bg-canvas/70 hover:bg-canvas transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-emerald-500" />
                      <span>Compare Tools</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-studio-neutral-400">vs</span>
                  </button>

                  <a
                    href="/submit"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-studio-navy bg-canvas/70 hover:bg-canvas transition-colors"
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
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-studio-muted hover:bg-canvas transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github className="w-4 h-4 text-studio-navy" />
                      <span>GitHub Repository</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Drawer Bottom Credit */}
              <div className="pt-4 border-t border-studio-neutral-100 text-[11px] font-mono text-studio-neutral-400 flex items-center justify-between">
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
        <div className="w-full bg-surface rounded-[22px] sm:rounded-[36px] md:rounded-[40px] p-4 sm:p-8 md:p-12 shadow-studio-card border border-studio-neutral-200/80 overflow-hidden">
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
            onOpenRoulette={() => setShowRoulette(true)}
            onOpenCompare={openCompare}
          />
        </div>
      </main>

      {/* Global Modals for Top Actions */}
      {showRoulette && (
        <RandomRouletteModal
          isOpen={showRoulette}
          onClose={() => setShowRoulette(false)}
          items={items}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {hasOpenedCompare && (
        <CompareModal
          isOpen={showCompare}
          onClose={() => setShowCompare(false)}
          allItems={items}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Studio Desk Footer */}
      <Footer />
    </div>
  );
}
