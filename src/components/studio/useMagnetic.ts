import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface UseMagneticOptions {
  /** Proximity padding in px outside the button bounds to trigger magnetic attraction (default: 40) */
  proximity?: number;
  /** Maximum displacement of the outer button shell in px (default: 3) */
  outerLimit?: number;
  /** Maximum displacement of the inner icon and text in px (default: 5) */
  innerLimit?: number;
  /** Elastic animation duration for outer shell in seconds (default: 1.0) */
  outerDuration?: number;
  /** Elastic animation duration for inner content in seconds (default: 0.8) */
  innerDuration?: number;
  /** Whether the magnetic effect is active (default: true) */
  enabled?: boolean;
}

export function useMagnetic({
  outerLimit = 3,
  innerLimit = 5,
  outerDuration = 1.0,
  innerDuration = 0.8,
  enabled = true,
}: UseMagneticOptions = {}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    // Initialize optimized GSAP quickTo setters with elastic spring curves
    const quickOuterX = gsap.quickTo(container, 'x', {
      duration: outerDuration,
      ease: 'elastic.out(1, 0.5)',
    });
    const quickOuterY = gsap.quickTo(container, 'y', {
      duration: outerDuration,
      ease: 'elastic.out(1, 0.5)',
    });
    const quickInnerX = gsap.quickTo(inner, 'x', {
      duration: innerDuration,
      ease: 'elastic.out(1, 0.55)',
    });
    const quickInnerY = gsap.quickTo(inner, 'y', {
      duration: innerDuration,
      ease: 'elastic.out(1, 0.55)',
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      quickOuterX(Math.max(-outerLimit, Math.min(outerLimit, 0.15 * deltaX)));
      quickOuterY(Math.max(-outerLimit, Math.min(outerLimit, 0.15 * deltaY)));
      quickInnerX(Math.max(-innerLimit, Math.min(innerLimit, 0.25 * deltaX)));
      quickInnerY(Math.max(-innerLimit, Math.min(innerLimit, 0.25 * deltaY)));
    };

    const handleMouseLeave = () => {
      quickOuterX(0);
      quickOuterY(0);
      quickInnerX(0);
      quickInnerY(0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      // Clean up inline transforms on unmount
      gsap.set([container, inner], { x: 0, y: 0 });
    };
  }, [outerLimit, innerLimit, outerDuration, innerDuration, enabled]);

  return { containerRef, innerRef };
}
