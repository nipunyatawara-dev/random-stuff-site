"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ExternalLink, RotateCw, X, Heart } from "lucide-react";
import type { Item } from "@/data/items";
import { playRollSound, playSuccessSound, playClickSound } from "@/lib/sound-fx";
import { MagneticButton } from "./studio/MagneticButton";

interface RandomRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function RandomRouletteModal({
  isOpen,
  onClose,
  items,
  favorites,
  onToggleFavorite,
}: RandomRouletteModalProps) {
  const [isRolling, setIsRolling] = useState(true);
  const [displayItem, setDisplayItem] = useState<Item | null>(null);
  const [finalItem, setFinalItem] = useState<Item | null>(null);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRoll = React.useCallback(() => {
    if (items.length === 0) return;
    setIsRolling(true);
    setFinalItem(null);

    // Pick target winner
    const target = items[Math.floor(Math.random() * items.length)];

    let speed = 40; // ms
    let elapsed = 0;
    const totalDuration = 1200; // ms

    const tick = () => {
      const randomCandidate = items[Math.floor(Math.random() * items.length)];
      setDisplayItem(randomCandidate);
      playRollSound();

      elapsed += speed;
      if (elapsed > 600) {
        speed += 25;
      }

      if (elapsed < totalDuration) {
        rollIntervalRef.current = setTimeout(tick, speed);
      } else {
        setDisplayItem(target);
        setFinalItem(target);
        setIsRolling(false);
        playSuccessSound();
      }
    };

    rollIntervalRef.current = setTimeout(tick, speed);
  }, [items]);

  useEffect(() => {
    if (isOpen) {
      startRoll();
    } else {
      if (rollIntervalRef.current) {
        clearTimeout(rollIntervalRef.current);
      }
      setIsRolling(false);
    }

    return () => {
      if (rollIntervalRef.current) {
        clearTimeout(rollIntervalRef.current);
      }
    };
  }, [isOpen, startRoll]);

  if (!isOpen) return null;

  const current = finalItem || displayItem || items[0];
  const isFav = current ? favorites.includes(current.id) : false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Random Tool Roulette"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-[22px] sm:rounded-[32px] p-4 sm:p-8 shadow-studio-card border border-white/90 overflow-y-auto max-h-[90vh] flex flex-col relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#89E00F] animate-pulse" />
            <h3 className="font-phudu text-lg font-bold text-[#14334D]">
              {isRolling ? "ROULETTE SCANNING..." : "DISCOVERED ITEM"}
            </h3>
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

        {/* Content & Roll Stage */}
        <div className="py-4 sm:py-6 flex flex-col items-center text-center">
          <div
            className={`w-full py-6 sm:py-8 px-4 sm:px-6 rounded-2xl border transition-all duration-300 relative overflow-hidden mb-6 ${
              isRolling
                ? "border-[#82CCFF] bg-[#F0F7FF] shadow-inner"
                : "border-slate-200 bg-[#FAFCFD] shadow-studio-button"
            }`}
          >
            {/* Category tag */}
            <div className="mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white border border-slate-200 text-[#007BE5] font-bold shadow-xs">
                {current?.category || "Tool"}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-phudu text-2xl sm:text-3xl font-black text-[#14334D] tracking-tight mb-2">
              {current?.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-[#456176] font-sans leading-relaxed line-clamp-3 max-w-sm mx-auto min-h-[4rem]">
              {current?.description}
            </p>

            {/* Tags */}
            {current?.tags && current.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {current.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <MagneticButton
              variant="primary-light"
              size="md"
              icon={<RotateCw className={`w-4 h-4 ${isRolling ? "animate-spin" : ""}`} />}
              disabled={isRolling}
              onClick={startRoll}
            >
              Roll Again
            </MagneticButton>

            {current && (
              <>
                <MagneticButton
                  variant="primary-light"
                  size="md"
                  icon={
                    <Heart
                      className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                    />
                  }
                  onClick={() => onToggleFavorite(current.id)}
                >
                  {isFav ? "Saved" : "Save"}
                </MagneticButton>

                <MagneticButton
                  variant="accent-lime"
                  size="md"
                  icon={<ExternalLink className="w-4 h-4 text-[#14334D]" />}
                  href={current.website || current.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Tool →
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
