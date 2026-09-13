/**
 * Production Code Recipes & Utilities for Lenis Smooth Scroll Engine
 * 
 * Target: Traceon Next.js 15 Application
 * Location: docs/lenis/06-production-code-recipes.tsx
 */

'use client';

import React, { useEffect, useRef, forwardRef, HTMLAttributes } from 'react';
import { ReactLenis, type LenisRef, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import 'lenis/dist/lenis.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── 1. PRODUCTION-HARDENED SMOOTH SCROLL PROVIDER ───────────────────────────

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Single unified clock update function
    function update(time: number) {
      // Convert GSAP time (seconds) to Lenis time (milliseconds)
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // 2. Wire Lenis into GSAP shared ticker
    gsap.ticker.add(update);

    // 3. Disable lag smoothing to eliminate rubber-banding on heavy frame spikes
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    // 4. Client route transition: immediately reset scroll and refresh triggers
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false, // Mandatory: driven exclusively by GSAP ticker
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2.0,
      }}
    >
      {children}
    </ReactLenis>
  );
}

// ─── 2. USE SCROLL VELOCITY & PROGRESS HOOK ──────────────────────────────────

export interface ScrollTelemetry {
  scroll: number;
  velocity: number;
  direction: number;
  progress: number;
}

/**
 * Hook to read real-time scroll metrics from Lenis.
 */
export function useLenisScrollTelemetry(onScrollUpdate: (telemetry: ScrollTelemetry) => void) {
  useLenis((lenis) => {
    onScrollUpdate({
      scroll: lenis.scroll,
      velocity: lenis.velocity,
      direction: lenis.direction,
      progress: lenis.progress,
    });
  });
}

// ─── 3. PROGRAMMATIC SCROLL-TO HOOK ──────────────────────────────────────────

/**
 * Hook for smooth programmatic scrolling to anchors, elements, or pixel coordinates.
 */
export function useScrollTo() {
  const lenis = useLenis();

  return (target: number | string | HTMLElement, offsetPx = -64) => {
    lenis?.scrollTo(target, {
      offset: offsetPx,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };
}

// ─── 4. ISOLATED CONTAINER WRAPPER ───────────────────────────────────────────

export interface LenisPreventContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Declares data-lenis-prevent on an element so that wheel and touch events
 * do not trigger the global page scroller.
 */
export const LenisPreventContainer = forwardRef<HTMLDivElement, LenisPreventContainerProps>(
  ({ children, className, ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        data-lenis-prevent
        className={cn('overflow-auto', className)}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

LenisPreventContainer.displayName = 'LenisPreventContainer';
export default SmoothScrollProvider;
