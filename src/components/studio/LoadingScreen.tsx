"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { PageLoadingProgress } from "@/lib/page-loading";

export interface LoadingScreenProps {
  onComplete: () => void;
  onDismissStart?: () => void;
  progress: PageLoadingProgress;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  onDismissStart,
  progress,
}) => {
  const [isFinishing, setIsFinishing] = useState(false);
  const finishingRef = React.useRef(false);
  const completeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onDismissStartRef = React.useRef(onDismissStart);
  onDismissStartRef.current = onDismissStart;

  const handleFinish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);
    onDismissStartRef.current?.();
    completeTimerRef.current = setTimeout(() => {
      onCompleteRef.current();
    }, 450);
  }, []);

  useEffect(() => () => {
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
  }, []);

  // Handle escape key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFinish]);

  // Only resource completion starts dismissal; the timer above is exit motion.
  useEffect(() => {
    if (progress.done) handleFinish();
  }, [progress.done, handleFinish]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={isFinishing ? { opacity: 0, y: "-100%" } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1], // Deceleration cubic-bezier
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas text-studio-navy select-none overflow-hidden ${
        isFinishing ? "pointer-events-none" : ""
      }`}
      aria-label="Loading site"
    >
      {/* Ambient background studio lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-[#82CCFF]/25 via-[#9DF71F]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#82CCFF]/15 blur-2xl" />
      </div>

      {/* Centerpiece Studio Stage: Otter & Progress Bar Only */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Animated Otter Mascot with Water Ripples */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Concentric Water Waves beneath the floating otter */}
          <motion.div
            animate={{
              scale: [0.85, 1.45],
              opacity: [0.55, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute bottom-6 w-32 h-10 rounded-full border-2 border-[#82CCFF]/60 bg-[#82CCFF]/10 pointer-events-none"
          />

          <motion.div
            animate={{
              scale: [0.85, 1.45],
              opacity: [0.55, 0],
            }}
            transition={{
              duration: 2.2,
              delay: 1.1,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute bottom-6 w-32 h-10 rounded-full border-2 border-[#89E00F]/45 bg-[#89E00F]/5 pointer-events-none"
          />

          {/* Bobbing Floating Otter Character */}
          <motion.div
            animate={
              isFinishing
                ? { scale: [1, 1.14, 1], y: [0, -14, 0] }
                : { y: [0, -8, 0], rotate: [-1, 1, -1] }
            }
            transition={
              isFinishing
                ? { duration: 0.45, ease: "easeOut" }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
            className="relative z-10 w-32 h-32 flex items-center justify-center drop-shadow-xl"
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="load-star-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#B5FF2E" />
                  <stop offset="100%" stopColor="#00D2FF" />
                </linearGradient>
                <filter id="load-otter-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor="#89E00F" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Ears with wiggle */}
              <motion.g
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: "50%", originY: "35%" }}
              >
                <circle cx="28" cy="28" r="9.5" fill="#14334D" />
                <circle cx="28" cy="28" r="5.2" fill="#89E00F" />
                <circle cx="72" cy="28" r="9.5" fill="#14334D" />
                <circle cx="72" cy="28" r="5.2" fill="#89E00F" />
              </motion.g>

              {/* Head */}
              <ellipse cx="50" cy="46" rx="28" ry="24" fill="#14334D" />

              {/* Body / Chest */}
              <path
                d="M32 64 C26 72, 24 88, 30 94 C42 96, 58 96, 70 94 C76 88, 74 72, 68 64 Z"
                fill="#14334D"
              />
              {/* Cream Belly */}
              <ellipse cx="50" cy="78" rx="14" ry="14" fill="#FAFCFD" />
              <ellipse cx="50" cy="78" rx="11" ry="11" fill="#E8ECEF" />

              {/* Muzzle */}
              <ellipse cx="50" cy="52" rx="13" ry="9" fill="#FAFCFD" />
              {/* Nose */}
              <path d="M46 47 C48 45, 52 45, 54 47 C54 50, 46 50, 46 47 Z" fill="#14334D" />
              {/* Smile */}
              <path d="M46 51 Q50 55 54 51" stroke="#14334D" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              {/* Round Lime Glasses with Sheen */}
              <g>
                <circle cx="39" cy="41" r="9.5" stroke="#89E00F" strokeWidth="3" fill="#14334D" />
                <circle cx="61" cy="41" r="9.5" stroke="#89E00F" strokeWidth="3" fill="#14334D" />
                <path d="M48.5 41 Q50 39 51.5 41" stroke="#89E00F" strokeWidth="3" strokeLinecap="round" />
                {/* Glasses Glint / Shimmer */}
                <motion.line
                  x1="33"
                  y1="37"
                  x2="38"
                  y2="37"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </g>

              {/* Eyes with Natural Blink */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  times: [0, 0.45, 0.48, 0.52, 1],
                }}
                style={{ originY: "41%" }}
              >
                {/* Left Eye */}
                <circle cx="39" cy="41" r="4.5" fill="#FFFFFF" />
                <circle cx="39.5" cy="41" r="2.5" fill="#14334D" />
                <circle cx="40.5" cy="40" r="1.1" fill="#FFFFFF" />

                {/* Right Eye */}
                <circle cx="61" cy="41" r="4.5" fill="#FFFFFF" />
                <circle cx="60.5" cy="41" r="2.5" fill="#14334D" />
                <circle cx="61.5" cy="40" r="1.1" fill="#FFFFFF" />
              </motion.g>

              {/* Whiskers */}
              <line x1="23" y1="50" x2="33" y2="52" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />
              <line x1="22" y1="55" x2="33" y2="55" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />
              <line x1="77" y1="50" x2="67" y2="52" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />
              <line x1="78" y1="55" x2="67" y2="55" stroke="#14334D" strokeWidth="2" strokeLinecap="round" />

              {/* Paws & Star */}
              <motion.g
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ originX: "74%", originY: "74%" }}
                filter="url(#load-otter-glow)"
              >
                <polygon
                  points="74,62 77,71 86,74 77,77 74,86 71,77 62,74 71,71"
                  fill="url(#load-star-grad)"
                />
                <circle cx="74" cy="74" r="3" fill="#FFFFFF" />
              </motion.g>

              {/* Little Paws holding the star */}
              <ellipse cx="66" cy="74" rx="4.5" ry="3.5" fill="#14334D" />
              <ellipse cx="34" cy="74" rx="4.5" ry="3.5" fill="#14334D" />
            </svg>
          </motion.div>
        </div>

        {/* Tactile Progress Pill Track (Only Otter & Progress Bar) */}
        <div className="w-48 sm:w-56 mt-4"
          role="progressbar"
          aria-label="Initial page resources"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.known ? progress.percent : undefined}
          aria-valuetext={progress.known
            ? `${progress.completed} of ${progress.total} startup resources finished${progress.failed ? `; ${progress.failed} unavailable` : ""}`
            : "Preparing the initial catalog"}
          aria-busy={!progress.done}
        >
          <div className="relative w-full h-2.5 sm:h-3 bg-surface rounded-full p-0.5 border border-border-subtle/80 shadow-[0px_1px_2px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.08)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#007BE5] via-[#82CCFF] to-[#89E00F]"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
