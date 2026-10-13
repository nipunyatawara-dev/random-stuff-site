"use client";

import dynamic from "next/dynamic";
import DirectoryCard from "./DirectoryCard";
import React, { useEffect, useMemo, useRef, useState, useCallback, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Item } from "@/data/items";
import { CURATED_STACKS, type CuratedStack } from "@/data/stacks";
import {
  Search,
  Heart,
  Sparkles,
  Scale,
  Download,
  Upload,
  X,
  ExternalLink,
  Share2,
  Trash2,
  Github,
  Link2,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { itemMatchesPlatformTag } from "@/lib/platform-tags";
import { searchItems } from "@/lib/item-search";
import { playClickSound, playSuccessSound } from "@/lib/sound-fx";
import {
  PillTabs,
  TiltCard,
  MagneticButton,
} from "./studio";
const CommandPalette = dynamic(() => import("./CommandPalette"));
const CompareModal = dynamic(() => import("./CompareModal"));
const RandomRouletteModal = dynamic(() => import("./RandomRouletteModal"));

const INITIAL_VISIBLE_ITEMS = 36;
const LOAD_MORE_ITEMS = 24;

export interface ContentSectionProps {
  initialItems: Item[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onOpenRoulette?: () => void;
  onOpenCompare?: () => void;
}

export default function ContentSection({
  initialItems,
  activeCategory: externalCategory,
  onCategoryChange: externalCategoryChange,
  onOpenRoulette,
  onOpenCompare,
}: ContentSectionProps) {
  const [items] = useState<Item[]>(initialItems);
  const [internalCategory, setInternalCategory] = useState("all");
  const activeCategory = externalCategory ?? internalCategory;

  const setActiveCategory = useCallback(
    (cat: string) => {
      if (externalCategoryChange) {
        externalCategoryChange(cat);
      } else {
        setInternalCategory(cat);
      }
    },
    [externalCategoryChange]
  );

  const [activeTag, setActiveTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Favorites state
  const { favorites, isFavorite, toggleFavorite, clearFavorites, removeFavorites, addFavorites } = useFavorites();
  const [selectedFavs, setSelectedFavs] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [showRoulette, setShowRoulette] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [hasOpenedCompare, setHasOpenedCompare] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const handleOpenRoulette = useCallback(() => {
    if (onOpenRoulette) onOpenRoulette();
    else setShowRoulette(true);
  }, [onOpenRoulette]);

  const handleOpenCompare = useCallback(() => {
    if (onOpenCompare) onOpenCompare();
    else {
      setHasOpenedCompare(true);
      setShowCompare(true);
    }
  }, [onOpenCompare]);

  // Sync initial state from URL search parameters or hash
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get("q");
      const cat = url.searchParams.get("category");
      const tag = url.searchParams.get("tag");
      const toolId =
        url.searchParams.get("tool") ||
        (window.location.hash ? window.location.hash.replace(/^#/, "") : null);

      if (q) setSearchQuery(q);
      if (
        cat &&
        ["Websites", "Softwares", "Scripts", "stacks", "favorites", "all"].includes(cat)
      ) {
        setActiveCategory(cat);
      }
      if (tag) setActiveTag(tag);
      if (toolId) {
        const found = items.find((item) => item.id === toolId);
        if (found) setPreviewItem(found);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, [items, setActiveCategory]);

  // Sync state changes back to URL without reloading
  const isFirstSyncRef = useRef(true);
  useEffect(() => {
    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;
      return;
    }
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    if (searchQuery.trim()) {
      url.searchParams.set("q", searchQuery.trim());
    } else {
      url.searchParams.delete("q");
    }

    if (activeCategory && activeCategory !== "all") {
      url.searchParams.set("category", activeCategory);
    } else {
      url.searchParams.delete("category");
    }

    if (activeTag && activeTag !== "all") {
      url.searchParams.set("tag", activeTag);
    } else {
      url.searchParams.delete("tag");
    }

    if (previewItem) {
      url.searchParams.set("tool", previewItem.id);
    } else {
      url.searchParams.delete("tool");
    }

    const nextSearch = url.searchParams.toString();
    const nextUrl = nextSearch ? `${url.pathname}?${nextSearch}` : url.pathname;
    window.history.replaceState({}, "", nextUrl);
  }, [searchQuery, activeCategory, activeTag, previewItem]);

  // Stacks state
  const [activeStack, setActiveStack] = useState<CuratedStack | null>(null);
  const [stackCopied, setStackCopied] = useState(false);

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keep the candidate array stable while typing so search can reuse its index.
  const candidateItems = useMemo(() => {
    let list = items;

    // Filter by category tab
    if (activeCategory === "favorites") {
      list = list.filter((i) => isFavorite(i.id));
    } else if (activeCategory === "stacks") {
      if (activeStack) {
        const stackSet = new Set(activeStack.itemIds);
        list = list.filter((i) => stackSet.has(i.id));
      }
    } else if (activeCategory !== "all") {
      list = list.filter((i) => i.category === activeCategory);
    }

    // Filter by platform / tag
    if (activeTag !== "all") {
      list = list.filter((i) => itemMatchesPlatformTag(i, activeTag));
    }

    return list;
  }, [items, activeCategory, activeTag, isFavorite, activeStack]);

  const filteredItems = useMemo(() => {
    return deferredSearchQuery.trim()
      ? searchItems(candidateItems, deferredSearchQuery)
      : candidateItems;
  }, [candidateItems, deferredSearchQuery]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Reset pagination when filter criteria change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ITEMS);
  }, [activeCategory, activeTag, deferredSearchQuery, activeStack]);

  // Reset active stack when navigating to another category
  useEffect(() => {
    if (activeCategory !== "stacks") {
      setActiveStack(null);
    }
  }, [activeCategory]);

  // Handle favorites batch actions
  const handleSelectFav = useCallback((id: string) => {
    setSelectedFavs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAllFavs = () => {
    const favIds = items.filter((item) => isFavorite(item.id)).map((item) => item.id);
    if (selectedFavs.length === favIds.length) {
      setSelectedFavs([]);
    } else {
      setSelectedFavs(favIds);
    }
  };

  const handleOpenSelected = () => {
    const selected = items.filter((item) => selectedFavs.includes(item.id));
    if (selected.length > 5) {
      if (!confirm(`You are about to open ${selected.length} tabs. Continue?`)) return;
    }
    selected.forEach((item, index) => {
      setTimeout(() => {
        window.open(item.website || item.github, "_blank");
      }, index * 100);
    });
  };

  const handleRemoveSelected = () => {
    if (selectedFavs.length > 0) {
      if (confirm(`Remove ${selectedFavs.length} items from favorites?`)) {
        removeFavorites(selectedFavs);
        setSelectedFavs([]);
        setIsSelectionMode(false);
      }
    } else {
      if (confirm("Are you sure you want to remove all favorites?")) {
        clearFavorites();
        setSelectedFavs([]);
        setIsSelectionMode(false);
      }
    }
  };

  const handleExport = async (format: "md" | "json" | "html") => {
    playClickSound();
    const favItems = items.filter((item) => isFavorite(item.id));
    if (favItems.length === 0) return;

    const {
      triggerFileDownload, exportFavoritesMarkdown, exportFavoritesJson, exportFavoritesHtml,
    } = await import("@/lib/export-favorites");
    if (format === "md") {
      triggerFileDownload("favorites.md", exportFavoritesMarkdown(favItems), "text/markdown");
    } else if (format === "json") {
      triggerFileDownload("favorites.json", exportFavoritesJson(favItems), "application/json");
    } else if (format === "html") {
      triggerFileDownload("favorites.html", exportFavoritesHtml(favItems), "text/html");
    }
    setIsExportMenuOpen(false);
    playSuccessSound();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const { parseFavoritesImport } = await import("@/lib/export-favorites");
      const res = parseFavoritesImport(text);
      if (res.ids.length > 0) {
        addFavorites(res.ids);
        alert(`Successfully imported ${res.ids.length} tools into your favorites!`);
      }
    } catch {
      alert("Failed to parse favorites file. Please upload a valid JSON export.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const categoryTabs = [
    { id: "all", label: "All Tools", count: items.length },
    { id: "Websites", label: "Websites", count: items.filter((i) => i.category === "Websites").length },
    { id: "Softwares", label: "Software", count: items.filter((i) => i.category === "Softwares").length },
    { id: "Scripts", label: "Scripts", count: items.filter((i) => i.category === "Scripts").length },
    { id: "stacks", label: "Curated Stacks" },
    { id: "favorites", label: "Favorites", count: favorites.length },
  ];

  const platformTags = [
    { id: "all", label: "All Platforms" },
    { id: "macos", label: "macOS" },
    { id: "windows", label: "Windows" },
    { id: "linux", label: "Linux" },
    { id: "web", label: "Web" },
    { id: "cli", label: "CLI / Terminal" },
    { id: "open-source", label: "Open Source" },
  ];

  return (
    <section id="catalog-section" className="w-full select-none">
      {/* Top Filter & Navigation Bar */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Category Pill Tabs */}
        <div className="w-full relative">
          <div
            className="w-full overflow-x-auto no-scrollbar flex items-center justify-start md:justify-center py-1.5 px-0.5"
          >
            <PillTabs
              tabs={categoryTabs}
              activeTab={activeCategory}
              onChange={(id) => {
                playClickSound();
                setActiveCategory(id);
                if (id !== "stacks") setActiveStack(null);
              }}
            />
          </div>
        </div>

        {/* Search Bar & Quick Tool Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Tactile Clay Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-blue" />
            <input
              type="text"
              placeholder="Search 350+ tools, tags (#cli, #macos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-20 py-2.5 rounded-full bg-surface shadow-studio-button border border-border-subtle text-sm text-studio-navy placeholder-studio-light-muted focus:outline-hidden focus:ring-2 focus:ring-[#007BE5]/25 focus:border-[#007BE5] transition-all font-sans"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-studio-neutral-400 hover:text-studio-neutral-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCommandPalette(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center text-[10px] font-mono uppercase tracking-wider text-studio-neutral-400 bg-studio-neutral-100 border border-studio-neutral-200 px-2 py-0.5 rounded-md hover:bg-studio-neutral-200 transition-colors cursor-pointer"
              >
                ⌘K
              </button>
            )}
          </div>

          {/* Quick Utility Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-start sm:justify-end">
            <MagneticButton
              variant="primary-light"
              size="sm"
              icon={<Scale className="w-3.5 h-3.5 text-studio-blue" />}
              onClick={handleOpenCompare}
            >
              Compare
            </MagneticButton>

            <MagneticButton
              variant="accent-lime"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5 text-studio-navy" />}
              onClick={handleOpenRoulette}
            >
              Roulette
            </MagneticButton>

            {activeCategory === "favorites" && favorites.length > 0 && (
              <div className="relative">
                <MagneticButton
                  variant="primary-light"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5 text-studio-slate" />}
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                >
                  Export / Import
                </MagneticButton>

                {isExportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-2xl shadow-studio-popover border border-border-subtle p-2 z-30 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleExport("md")}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-studio-navy hover:bg-canvas transition-colors"
                    >
                      Export as Markdown (.md)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport("json")}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-studio-navy hover:bg-canvas transition-colors"
                    >
                      Export as JSON (.json)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport("html")}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-studio-navy hover:bg-canvas transition-colors"
                    >
                      Export as HTML (.html)
                    </button>
                    <div className="border-t border-studio-neutral-100 my-1" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-studio-blue hover:bg-canvas font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Import JSON</span>
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </div>
            )}
          </div>
        </div>

        {/* Platform Tags Filter Bar */}
        {activeCategory !== "stacks" && (
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 py-1"
          >
            <span className="text-[11px] font-mono uppercase tracking-wider text-studio-label/50 font-bold mr-1 shrink-0">
              Filter:
            </span>
            {platformTags.map((tag) => {
              const isActive = activeTag === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTag(tag.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-surface text-studio-navy shadow-studio-button font-bold border border-border-subtle"
                      : "bg-canvas text-studio-muted hover:text-studio-navy hover:bg-studio-neutral-200/80"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CURATED STACKS VIEW */}
      {activeCategory === "stacks" && (
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-2 border-b border-studio-neutral-100">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-studio-blue font-bold">
                Tailored Toolkits
              </span>
              <h2 className="font-phudu text-2xl md:text-3xl font-black text-studio-navy">
                Curated Builder Stacks
              </h2>
            </div>
            {activeStack && (
              <button
                type="button"
                onClick={() => setActiveStack(null)}
                className="text-xs font-bold text-studio-blue hover:underline"
              >
                ← View All Stacks
              </button>
            )}
          </div>

          {!activeStack ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {CURATED_STACKS.map((stack, idx) => {
                const variants: Array<"blue" | "green" | "amber" | "slate"> = ["blue", "green", "slate", "amber"];
                return (
                  <TiltCard
                    key={stack.id}
                    variant={variants[idx % variants.length]}
                    title={stack.title}
                    category="CURATED STACK"
                    countOrPrice={`${stack.itemIds.length} Tools`}
                    description={stack.description}
                    onClick={() => {
                      playClickSound();
                      setActiveStack(stack);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-canvas border border-studio-neutral-200/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-surface text-studio-blue font-bold border border-studio-neutral-200">
                  Active Stack
                </span>
                <h3 className="font-phudu text-2xl font-black text-studio-navy mt-1">
                  {activeStack.title}
                </h3>
                <p className="text-xs text-studio-muted mt-1 max-w-xl">
                  {activeStack.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <MagneticButton
                  variant="primary-light"
                  size="sm"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const shareUrl = `${window.location.origin}#stack=${activeStack.itemIds.join(",")}`;
                    navigator.clipboard.writeText(shareUrl);
                    setStackCopied(true);
                    playSuccessSound();
                    setTimeout(() => setStackCopied(false), 2000);
                  }}
                >
                  {stackCopied ? "Link Copied!" : "Share Stack"}
                </MagneticButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAVORITES TOOLBAR (When in Favorites tab) */}
      {activeCategory === "favorites" && favorites.length > 0 && (
        <div className="p-4 rounded-2xl bg-canvas border border-studio-neutral-200/80 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                isSelectionMode
                  ? "bg-[#14334D] text-white"
                  : "bg-surface text-studio-navy shadow-xs"
              }`}
            >
              {isSelectionMode ? "Exit Selection" : "Select Multiple"}
            </button>

            {isSelectionMode && (
              <>
                <button
                  type="button"
                  onClick={handleSelectAllFavs}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface text-studio-navy shadow-xs hover:bg-studio-neutral-100 transition-colors"
                >
                  {selectedFavs.length === favorites.length ? "Deselect All" : "Select All"}
                </button>
                <span className="text-xs font-mono text-studio-muted">
                  ({selectedFavs.length} selected)
                </span>
              </>
            )}
          </div>

          {isSelectionMode && selectedFavs.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenSelected}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#007BE5] text-white hover:bg-[#0066CC] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tabs</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveSelected}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* DIRECTORY ITEMS GRID */}
      {displayedItems.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-surface-soft rounded-3xl border border-studio-neutral-200/80 p-8">
          <div className="w-16 h-16 rounded-full bg-studio-neutral-100 flex items-center justify-center text-studio-neutral-400 mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-phudu text-xl font-bold text-studio-navy mb-1">
            No Tools Found
          </h3>
          <p className="text-sm text-studio-muted max-w-md mb-4">
            {activeCategory === "favorites"
              ? "You haven't added any tools to your favorites yet. Click the heart icon on any card to save it!"
              : "Try adjusting your search keywords or switching platform filters."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-studio-blue hover:underline"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {displayedItems.map((item) => (
            <DirectoryCard
              key={item.id}
              item={item}
              isFav={isFavorite(item.id)}
              isSelected={selectedFavs.includes(item.id)}
              isSelectionMode={isSelectionMode}
              onPreview={setPreviewItem}
              onSelectFavorite={handleSelectFav}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* PROGRESSIVE LOAD / LOAD MORE BUTTON */}
      {displayedItems.length < filteredItems.length && (
        <div className="flex justify-center mt-12 mb-4">
          <MagneticButton
            variant="primary-light"
            size="lg"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_ITEMS)}
          >
            Load More Tools ({filteredItems.length - displayedItems.length} remaining)
          </MagneticButton>
        </div>
      )}

      {/* MODAL: TOOL DETAILS INSPECTOR */}
      <AnimatePresence>
        {previewItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 select-none"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-surface rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-studio-card border border-studio-neutral-200 overflow-y-auto max-h-[90vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-studio-neutral-100 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-studio-neutral-100 text-studio-blue font-bold">
                    {previewItem.category}
                  </span>
                  {previewItem.isNew && (
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#9DF71F]/30 text-studio-navy font-bold">
                      New
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="w-8 h-8 rounded-full bg-studio-neutral-100 flex items-center justify-center text-studio-neutral-500 hover:text-studio-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-phudu text-2xl sm:text-3xl font-black text-studio-navy mb-1">
                  {previewItem.title}
                </h3>
                <p className="text-sm text-studio-muted font-sans leading-relaxed">
                  {previewItem.description}
                </p>
              </div>

              {previewItem.tags && previewItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {previewItem.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-canvas text-studio-neutral-600"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-studio-neutral-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      toggleFavorite(previewItem.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canvas text-xs font-semibold text-studio-navy hover:bg-studio-neutral-200 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(previewItem.id) ? "fill-red-500 text-red-500" : "text-studio-neutral-400"
                      }`}
                    />
                    <span>{isFavorite(previewItem.id) ? "In Favorites" : "Save Tool"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const toolUrl = `${window.location.origin}/?tool=${previewItem.id}`;
                      navigator.clipboard.writeText(toolUrl);
                      setLinkCopied(true);
                      playSuccessSound();
                      setTimeout(() => setLinkCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-canvas text-xs font-semibold text-studio-navy hover:bg-studio-neutral-200 transition-colors cursor-pointer"
                    title="Copy direct shareable link to this tool"
                  >
                    <Link2 className="w-3.5 h-3.5 text-studio-blue" />
                    <span>{linkCopied ? "Link Copied!" : "Copy Link"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {previewItem.github && (
                    <MagneticButton
                      variant="primary-light"
                      size="md"
                      icon={<Github className="w-4 h-4 text-studio-navy" />}
                      href={previewItem.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go to Source
                    </MagneticButton>
                  )}

                  <MagneticButton
                    variant="accent-lime"
                    size="md"
                    icon={<ExternalLink className="w-4 h-4 text-studio-navy" />}
                    href={previewItem.website || previewItem.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {previewItem.website ? "Visit Website →" : "Launch Tool →"}
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMMAND PALETTE */}
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          items={items}
          onSelectItem={(item) => {
            setPreviewItem(item);
          }}
          onOpenRandom={handleOpenRoulette}
          onOpenFavorites={() => setActiveCategory("favorites")}
          onOpenCompare={handleOpenCompare}
          onExportFavorites={() => handleExport("md")}
        />
      )}

      {/* Fallback Modals (Only active if not controlled globally by parent layout) */}
      {!onOpenCompare && hasOpenedCompare && (
        <CompareModal
          isOpen={showCompare}
          onClose={() => setShowCompare(false)}
          allItems={items}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {!onOpenRoulette && showRoulette && (
        <RandomRouletteModal
          isOpen={showRoulette}
          onClose={() => setShowRoulette(false)}
          items={items}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </section>
  );
}
