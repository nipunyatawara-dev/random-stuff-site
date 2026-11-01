import { useRef } from 'react';
export interface UseMagneticOptions { enabled?: boolean; proximity?: number; outerLimit?: number; innerLimit?: number; outerDuration?: number; innerDuration?: number; }
// Native controls stay stationary; no global pointer or animation-frame work.
export function useMagnetic(_options: UseMagneticOptions = {}) { void _options; return { containerRef: useRef<HTMLElement>(null), innerRef: useRef<HTMLDivElement>(null) }; }
