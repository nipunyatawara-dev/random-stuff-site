"use client";

import React, { useState } from "react";
import { X, Scale, Plus, ExternalLink, Trash2, Heart } from "lucide-react";
import type { Item } from "@/data/items";
import { playClickSound } from "@/lib/sound-fx";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: Item[];
  initialItems?: Item[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function CompareModal({
  isOpen,
  onClose,
  allItems,
  initialItems = [],
  favorites,
  onToggleFavorite,
}: CompareModalProps) {
  const [selectedItems, setSelectedItems] = useState<Item[]>(() => {
    return initialItems.length > 0 ? initialItems.slice(0, 3) : allItems.slice(0, 2);
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    playClickSound();
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = (item: Item) => {
    playClickSound();
    if (selectedItems.length >= 3) return;
    if (selectedItems.some((i) => i.id === item.id)) return;
    setSelectedItems((prev) => [...prev, item]);
    setIsAdding(false);
    setSearchQuery("");
  };

  const availableToAdd = allItems
    .filter((item) => !selectedItems.some((s) => s.id === item.id))
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    })
    .slice(0, 10);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare Tools"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-[22px] sm:rounded-[32px] p-4 sm:p-8 shadow-studio-card border border-white/90 overflow-hidden flex flex-col max-h-[90vh] relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCE8FF] flex items-center justify-center text-[#007BE5]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-phudu text-xl font-bold text-[#14334D]">
                Tool Comparator
              </h3>
              <p className="text-xs text-[#456176]">
                Compare features, category & platform specs side-by-side
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {selectedItems.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#FAFCFD] rounded-2xl border border-slate-200 p-5 shadow-studio-button flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-200 text-[#14334D] font-bold">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-phudu text-xl font-bold text-[#14334D] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#456176] font-sans line-clamp-4 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Platform Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-2 rounded-full hover:bg-slate-200/60 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                      />
                    </button>
                    <a
                      href={item.website || item.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#14334D] text-white text-xs font-semibold hover:bg-[#304F67] transition-colors"
                    >
                      <span>Visit Tool</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Add Tool Slot */}
            {selectedItems.length < 3 && (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#FAFCFD]/50 min-h-[260px]">
                {!isAdding ? (
                  <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="flex flex-col items-center gap-2 text-slate-500 hover:text-[#007BE5] transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-phudu text-sm font-bold">Add Tool to Compare</span>
                  </button>
                ) : (
                  <div className="w-full space-y-3">
                    <input
                      type="text"
                      placeholder="Search tool..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-[#14334D] placeholder-slate-400 focus:outline-hidden focus:border-[#007BE5]"
                      autoFocus
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1 text-left">
                      {availableToAdd.map((avail) => (
                        <button
                          key={avail.id}
                          type="button"
                          onClick={() => handleAdd(avail)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-200 text-[#14334D] flex items-center justify-between"
                        >
                          <span className="font-semibold truncate">{avail.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {avail.category}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
