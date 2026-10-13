"use client";

import Image from "next/image";
import { memo } from "react";
import { ArrowUpRight, Check, ExternalLink, Github, Heart } from "lucide-react";
import type { Item } from "@/data/items";
import { getVisiblePlatformTags } from "@/lib/platform-tags";
import { playClickSound } from "@/lib/sound-fx";

type DirectoryCardProps = {
  item: Item;
  isNew: boolean;
  isFav: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  onPreview: (item: Item) => void;
  onSelectFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

// Keep unchanged cards out of search-input, modal, and favorites rerenders.
const DirectoryCard = memo(function DirectoryCard({
  item, isNew, isFav, isSelected, isSelectionMode, onPreview, onSelectFavorite, toggleFavorite,
}: DirectoryCardProps) {
  const visibleTags = getVisiblePlatformTags(item);
  let domain = "";
  try {
    const rawUrl = item.website || item.github;
    if (rawUrl) {
      const u = new URL(rawUrl);
      domain = u.hostname.replace(/^www\./, "");
    }
  } catch {
    domain = "";
  }

  return (
    <div
      onClick={() => onPreview(item)}
      className="directory-card group relative bg-surface rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 md:p-6 shadow-studio-card border border-studio-neutral-100/90 hover:border-[#82CCFF]/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden select-none cursor-pointer"
    >
      <button type="button" className="sr-only preview-trigger" aria-haspopup="dialog">
        View details for {item.title}
      </button>
      <div>
        {/* Top Row: Avatar Icon + Category / New badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-canvas border border-studio-neutral-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                width={44}
                height={44}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-phudu font-bold text-base text-studio-blue">
                {item.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isNew && (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full bg-[#9DF71F]/30 text-studio-navy border border-[#9DF71F]/50">
                New
              </span>
            )}
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full bg-studio-neutral-100 text-studio-muted">
              {item.category}
            </span>
          </div>
        </div>

        {/* Title and Domain */}
        <div className="mb-2">
          <a
            href={item.website || item.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-phudu text-lg font-bold text-studio-navy group-hover:text-studio-blue active:text-studio-blue transition-colors inline-flex items-center gap-1.5 tracking-tight"
          >
            <span className="line-clamp-1">{item.title}</span>
            <ArrowUpRight className="w-4 h-4 text-studio-neutral-400 group-hover:text-studio-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {domain && (
            <span className="text-[11px] font-mono text-studio-light-muted font-medium block truncate mt-0.5">
              {domain}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-studio-muted font-sans leading-relaxed line-clamp-3 mb-4">
          {item.description}
        </p>

        {/* Visible Platform Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleTags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-canvas text-studio-muted"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Row: Source Button + Favorite + Launch */}
      <div className="pt-3 border-t border-studio-neutral-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {item.github && (
            <a
              href={item.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas hover:bg-[#14334D] text-studio-navy hover:text-white text-xs font-semibold transition-colors cursor-pointer min-h-[36px] touch-manipulation"
              title="Go to Source Code on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isSelectionMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFavorite(item.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-[#14334D] text-white"
                  : "bg-studio-neutral-100 text-studio-neutral-400 hover:bg-studio-neutral-200"
              }`}
            >
              {isSelected ? <Check className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full border border-studio-neutral-400" />}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              toggleFavorite(item.id);
            }}
            className="p-2.5 min-w-[38px] min-h-[38px] rounded-full bg-canvas hover:bg-studio-red-50 text-studio-neutral-400 hover:text-red-500 transition-all cursor-pointer group/fav flex items-center justify-center touch-manipulation"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 group-hover/fav:scale-115 ${
                isFav ? "fill-red-500 text-red-500" : "text-studio-neutral-400"
              }`}
            />
          </button>

          <a
            href={item.website || item.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 min-w-[38px] min-h-[38px] rounded-full bg-canvas hover:bg-[#007BE5] text-studio-neutral-500 hover:text-white transition-all cursor-pointer flex items-center justify-center touch-manipulation"
            title={item.website ? "Visit Website" : "Open Tool"}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
});

export default DirectoryCard;
