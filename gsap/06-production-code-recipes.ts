/**
 * Production Code Recipes & Utilities for GSAP 3.15 & ScrollTrigger
 * 
 * Target: Traceon Next.js 15 Application
 * Location: docs/gsap/06-production-code-recipes.ts
 */

'use client';

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── 1. ROUTE REFRESH HOOK ───────────────────────────────────────────────────

/**
 * Automatically recalculates all ScrollTrigger trigger offsets when navigating
 * between Next.js client-side routes.
 */
export function useScrollTriggerRefresh(delayMs = 60) {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, delayMs);

    return () => clearTimeout(timer);
  }, [pathname, delayMs]);
}

// ─── 2. HUD NAVBAR COMPRESSION HOOK ──────────────────────────────────────────

export interface NavbarCompressOptions {
  thresholdPx?: number;
  expandedHeight?: number;
  compressedHeight?: number;
}

/**
 * Compresses navbar height and increases backdrop blur on scroll down.
 */
export function useNavbarCompress(
  navbarRef: RefObject<HTMLElement | null>,
  options: NavbarCompressOptions = {}
) {
  const { thresholdPx = 40, expandedHeight = 64, compressedHeight = 48 } = options;

  useEffect(() => {
    if (!navbarRef.current) return;

    const trigger = ScrollTrigger.create({
      start: `top -=${thresholdPx}`,
      end: 99999,
      onEnter: () => {
        gsap.to(navbarRef.current, {
          height: compressedHeight,
          backgroundColor: 'rgba(10, 10, 12, 0.92)',
          borderColor: '#1E1E24',
          duration: 0.25,
          ease: 'power2.out',
        });
      },
      onLeaveBack: () => {
        gsap.to(navbarRef.current, {
          height: expandedHeight,
          backgroundColor: 'rgba(5, 5, 6, 0.75)',
          borderColor: 'transparent',
          duration: 0.25,
          ease: 'power2.out',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [navbarRef, thresholdPx, expandedHeight, compressedHeight]);
}

// ─── 3. PINNED HORIZONTAL TRACK HOOK ─────────────────────────────────────────

export interface HorizontalTrackOptions {
  panelCount: number;
  scrollDistanceMultiplier?: number;
  snapEnabled?: boolean;
  onProgress?: (progress: number, activeIndex: number) => void;
}

/**
 * Pins a section vertically while translating an inner track horizontally along the X-axis.
 */
export function usePinnedHorizontalTrack(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  options: HorizontalTrackOptions
) {
  const {
    panelCount,
    scrollDistanceMultiplier = 3.5,
    snapEnabled = true,
    onProgress,
  } = options;

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const tween = gsap.to(trackRef.current, {
        xPercent: -100 * (panelCount - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          end: () => `+=${window.innerHeight * scrollDistanceMultiplier}`,
          snap: snapEnabled
            ? {
                snapTo: 1 / (panelCount - 1),
                duration: { min: 0.2, max: 0.45 },
                delay: 0.08,
                ease: 'power2.out',
              }
            : undefined,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * panelCount),
              panelCount - 1
            );
            onProgress?.(self.progress, index);
          },
        },
      });

      return () => {
        tween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [sectionRef, trackRef, panelCount, scrollDistanceMultiplier, snapEnabled, onProgress]);
}

// ─── 4. BATCH CARD REVEAL HOOK ───────────────────────────────────────────────

/**
 * Smoothly cascades and reveals a grid of CAD cards as they enter the viewport.
 */
export function useCardBatchReveal(containerRef: RefObject<HTMLElement | null>, selector = '.blueprint-card') {
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(selector);
    if (cards.length === 0) return;

    const batch = ScrollTrigger.batch(cards, {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: 'auto',
          }
        );
      },
    });

    return () => {
      batch.forEach((t) => t.kill());
    };
  }, [containerRef, selector]);
}
