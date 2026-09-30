"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface PillTabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface PillTabsProps {
  tabs: PillTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  layoutIdPrefix?: string;
}

export const PillTabs: React.FC<PillTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  layoutIdPrefix = 'pillTab',
}) => {
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const isInitialMount = React.useRef(true);

  // Auto-scroll active tab into view horizontally inside its container when category changes
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const activeEl = buttonRefs.current[activeTab];
    if (activeEl) {
      const scrollContainer = activeEl.closest('.overflow-x-auto');
      if (scrollContainer) {
        const targetLeft =
          activeEl.offsetLeft -
          scrollContainer.clientWidth / 2 +
          activeEl.clientWidth / 2;
        scrollContainer.scrollTo({
          left: targetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeTab]);

  return (
    <div
      data-lenis-prevent
      className={`inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#E8ECEF]/80 backdrop-blur-xs border border-white/60 shadow-inner min-w-max shrink-0 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              buttonRefs.current[tab.id] = el;
            }}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer select-none flex items-center gap-1.5 sm:gap-2 min-h-[38px] sm:min-h-[42px] touch-manipulation ${
              isActive ? 'text-[#14334D]' : 'text-[#456176] hover:text-[#14334D]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={`${layoutIdPrefix}Indicator`}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white shadow-studio-button border border-white/80"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span className="whitespace-nowrap">{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive ? 'bg-[#9DF71F]/30 text-[#14334D] font-bold' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
