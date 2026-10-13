"use client";

import React from 'react';
import { useMagnetic, type UseMagneticOptions } from './useMagnetic';

export type ButtonVariant = 'primary-light' | 'primary-dark' | 'accent-lime' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  magneticOptions?: UseMagneticOptions;
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary-light',
  size = 'md',
  icon,
  magneticOptions,
  className = '',
  onClick,
  href,
  target,
  rel,
  disabled,
  ...props
}) => {
  const { containerRef, innerRef } = useMagnetic({
    proximity: 40,
    outerLimit: 3,
    innerLimit: 5,
    outerDuration: 1.0,
    innerDuration: 0.8,
    enabled: !disabled,
    ...magneticOptions,
  });

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs md:text-sm gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 md:py-3 text-sm md:text-base gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 md:py-4 text-base md:text-lg gap-2.5 min-h-[52px]',
  }[size];

  const variantClasses = {
    'primary-light':
      'bg-canvas text-studio-slate border border-border-subtle shadow-studio-button hover:bg-surface hover:border-studio-border-hover active:translate-y-0.5 transition-all duration-200',
    'primary-dark':
      'bg-[#304F67] text-white border border-[#14334D] shadow-studio-button-dark hover:bg-[#253f54] active:translate-y-0.5 transition-all duration-200',
    'accent-lime':
      'bg-gradient-to-r from-[#9DF71F] to-[#89E00F] text-studio-ink font-bold border border-[#7ECC0C] shadow-studio-button-lime hover:brightness-105 active:translate-y-0.5 transition-all duration-200',
    'ghost':
      'bg-transparent text-studio-muted border border-transparent hover:bg-black/5 active:translate-y-0.5 transition-all duration-200',
  }[variant];

  const content = (
    <div
      ref={innerRef as React.RefObject<HTMLDivElement>}
      className="flex items-center justify-center gap-2 pointer-events-none select-none font-medium whitespace-nowrap"
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );

  if (href) {
    return (
      <a
        ref={containerRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={`inline-flex items-center justify-center rounded-full cursor-pointer font-sans no-underline ${sizeClasses} ${variantClasses} ${variant === "accent-lime" ? "studio-art" : ""} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={containerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${variant === "accent-lime" ? "studio-art" : ""} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
};
