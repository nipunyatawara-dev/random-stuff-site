"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTiltCard } from './useTiltCard';

export interface TiltCardProps {
  variant?: 'blue' | 'green' | 'amber' | 'slate';
  title?: string;
  category?: string;
  countOrPrice?: string;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  description?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  variant = 'blue',
  title = 'RANDOM STUFF',
  category = 'CURATED STACK',
  countOrPrice = '12 Tools',
  badgeText = 'Stack Pack',
  className = '',
  onClick,
  icon,
  description,
}) => {
  const {
    cardRef,
    rotateX,
    rotateY,
    glareBackground,
    handleMouseMove,
    handleMouseLeave,
  } = useTiltCard({ maxTilt: 12 });

  const theme = {
    blue: {
      gradient: 'linear-gradient(135deg, #CCE8FF 0%, #89CEFF 50%, #54B4FF 100%)',
      titleColor: 'text-[#007BE5]/30',
      textColor: 'text-[#0055AA]',
      borderColor: 'border-[#82CCFF]/60',
      subTextColor: 'text-[#0066CC]/80',
    },
    green: {
      gradient: 'linear-gradient(135deg, #BFFB52 0%, #9DF71F 50%, #82DC05 100%)',
      titleColor: 'text-[#237F00]/25',
      textColor: 'text-[#1E6B02]',
      borderColor: 'border-[#9DF71F]/60',
      subTextColor: 'text-[#1E6B02]/85',
    },
    amber: {
      gradient: 'linear-gradient(135deg, #FFE7B3 0%, #FFD166 50%, #F59E0B 100%)',
      titleColor: 'text-[#B45309]/25',
      textColor: 'text-[#92400E]',
      borderColor: 'border-[#F59E0B]/50',
      subTextColor: 'text-[#92400E]/85',
    },
    slate: {
      gradient: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 50%, #94A3B8 100%)',
      titleColor: 'text-[#334155]/25',
      textColor: 'text-[#1E293B]',
      borderColor: 'border-[#CBD5E1]/60',
      subTextColor: 'text-[#334155]/85',
    },
  }[variant];

  return (
    <div style={{ perspective: 1000 }} className={`w-full select-none ${className}`}>
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: theme.gradient,
        }}
        className={`relative h-[240px] w-full rounded-[24px] p-6 flex flex-col justify-between overflow-hidden cursor-pointer shadow-studio-card border ${theme.borderColor} transition-shadow duration-300 hover:shadow-2xl`}
      >
        {/* Interactive Dynamic Glare Sheen */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-[24px]"
          style={{ background: glareBackground }}
        />

        {/* Otter Watermark graphic in background */}
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-[200px] h-[200px] opacity-15">
          <svg viewBox="0 0 100 100" fill="currentColor" className={`w-full h-full ${theme.textColor}`}>
            <circle cx="30" cy="30" r="9" />
            <circle cx="70" cy="30" r="9" />
            <ellipse cx="50" cy="50" rx="28" ry="24" />
            <path d="M32 68 C26 76, 24 90, 30 96 C42 98, 58 98, 70 96 C76 90, 74 76, 68 68 Z" />
            <polygon points="76,62 79,70 87,73 79,76 76,84 73,76 65,73 73,70" />
          </svg>
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="p-2 rounded-xl bg-white/50 backdrop-blur-xs text-[#14334D] shadow-xs">{icon}</span>}
            <h4 className={`font-phudu text-2xl font-black tracking-tight ${theme.textColor}`}>
              {title}
            </h4>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-white/60 text-[#14334D] backdrop-blur-xs shadow-xs">
            {badgeText}
          </span>
        </div>

        {/* Card Description */}
        {description && (
          <p className={`relative z-10 text-xs line-clamp-2 leading-relaxed font-sans font-medium ${theme.subTextColor}`}>
            {description}
          </p>
        )}

        {/* Card Footer: Category & Count */}
        <div className="relative z-10 flex flex-col gap-0.5 pt-2">
          <span className={`text-[11px] font-mono tracking-[0.15em] uppercase font-bold ${theme.textColor}`}>
            {category}
          </span>
          <div className="flex items-center justify-between">
            <h3 className={`font-phudu text-3xl font-black tracking-tight ${theme.textColor}`}>
              {countOrPrice}
            </h3>
            <span className="text-xs font-bold text-[#14334D] bg-white/70 px-3 py-1 rounded-full shadow-xs">
              View Stack →
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
