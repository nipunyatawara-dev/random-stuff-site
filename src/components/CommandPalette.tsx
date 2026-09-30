"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Sparkles,
  Scale,
  Download,
  X,
  Compass,
  CornerDownLeft,
} from "lucide-react";
import type { Item } from "@/data/items";
import { searchItems } from "@/lib/item-search";
import { playClickSound } from "@/lib/sound-fx";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenRandom: () => void;
  onOpenFavorites: () => void;
  onOpenSandbox?: () => void;
  onOpenCompare: () => void;
  onExportFavorites: () => void;
}

interface ActionItem {
  id: string;
  type: "action";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  handler: () => void;
  category: "Actions";
}

export default function CommandPalette({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onOpenRandom,
  onOpenFavorites,
  onOpenCompare,
  onExportFavorites,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const actions: ActionItem[] = useMemo(
    () => [
      {
        id: "action-random",
        type: "action",
        title: "Random Roulette",
        subtitle: "Let destiny pick a random tool for you",
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        handler: () => {
          onClose();
          onOpenRandom();
        },
        category: "Actions",
      },
      {
        id: "action-favorites",
        type: "action",
        title: "View Favorites",
        subtitle: "Browse your saved bookmarks and tools",
        icon: <Compass className="w-4 h-4 text-[#007BE5]" />,
        handler: () => {
          onClose();
          onOpenFavorites();
        },
        category: "Actions",
      },
      {
        id: "action-compare",
        type: "action",
        title: "Compare Tools",
        subtitle: "Side-by-side comparison of tools",
        icon: <Scale className="w-4 h-4 text-emerald-500" />,
        handler: () => {
          onClose();
          onOpenCompare();
        },
        category: "Actions",
      },
      {
        id: "action-export",
        type: "action",
        title: "Export Favorites",
        subtitle: "Download favorites as Markdown, JSON or HTML",
        icon: <Download className="w-4 h-4 text-[#304F67]" />,
        handler: () => {
          onClose();
          onExportFavorites();
        },
        category: "Actions",
      },
    ],
    [onClose, onOpenRandom, onOpenFavorites, onOpenCompare, onExportFavorites]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    return searchItems(items, query).slice(0, 8);
  }, [items, query]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase().trim();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );
  }, [actions, query]);

  const totalResults = useMemo(
    () => [...filteredActions, ...filteredItems],
    [filteredActions, filteredItems]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < totalResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : totalResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = totalResults[selectedIndex];
        if (!selected) return;
        if ("handler" in selected) {
          selected.handler();
        } else {
          onSelectItem(selected);
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, totalResults, onSelectItem, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-[28px] shadow-studio-card border border-white/90 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-[#FAFCFD]">
          <Search className="w-5 h-5 text-[#007BE5]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a tool name, category (#macos, #cli), or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#14334D] font-medium placeholder-slate-400 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto p-3 space-y-1">
          {totalResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-mono">
              No matching tools or commands found
            </div>
          ) : (
            totalResults.map((entry, idx) => {
              const isSelected = idx === selectedIndex;
              const isAction = "handler" in entry;

              return (
                <div
                  key={entry.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    playClickSound();
                    if (isAction) {
                      entry.handler();
                    } else {
                      onSelectItem(entry);
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#F0F2F5] shadow-xs text-[#14334D]"
                      : "text-[#456176] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
                      {isAction ? (
                        entry.icon
                      ) : (
                        <span className="font-phudu font-bold text-xs text-[#007BE5]">
                          {entry.title.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#14334D] truncate flex items-center gap-2">
                        <span>{entry.title}</span>
                        {!isAction && (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-200 text-[#304F67]">
                            {entry.category}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {isAction ? entry.subtitle : entry.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <CornerDownLeft className="w-4 h-4 text-[#007BE5] shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-[#FAFCFD] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#007BE5] font-bold">Random Stuff</span>
        </div>
      </div>
    </div>
  );
}
