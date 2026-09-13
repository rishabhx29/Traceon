# Lenis + GSAP RAF Ticker Synchronization Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/02-gsap-raf-ticker-synchronization.md`  
> **Target:** Single-Clock RAF Loop, Time-Unit Conversions, and lagSmoothing(0)  

---

## 1. The Dual-Loop Failure Mode

When Lenis is initialized with its default configuration, it starts its own `requestAnimationFrame` loop. Concurrently, GSAP maintains its own internal RAF ticker for tweens and ScrollTriggers.

### Why Dual Loops Fail on 120Hz/144Hz Displays:
1. **Clock Desynchronization**: Frame timestamps drift apart by 2ms to 8ms.
2. **ScrollTrigger Stuttering**: ScrollTrigger evaluates element visibility based on an outdated scroll position, causing scrubbed animations to visually jitter and stutter.
3. **Redundant GPU Work**: Two separate RAF callbacks trigger layout recalculations in the same browser frame.

---

## 2. The Single Unified Clock Architecture

In Traceon, **GSAP's ticker acts as the single master clock**. Lenis is relegated to a pure mathematical calculator driven directly by GSAP:

```
Browser Hardware Display Clock (60Hz / 120Hz / 144Hz)
                        │
                        ▼
             GSAP Shared RAF Ticker
              (gsap.ticker.add)
                        │
         ┌──────────────┴──────────────┐
         │ time (seconds)              │ time * 1000 (milliseconds)
         ▼                             ▼
   ScrollTrigger                lenis.raf(ms)
 (Update Positions)           (Compute New Scroll Y)
```

---

## 3. The Time-Unit Conversion Trap

A subtle bug occurs if time units are mismatched:
- **GSAP Ticker** passes elapsed time in **seconds** (e.g. `time = 1.542`).
- **Lenis `raf()`** expects elapsed time in **milliseconds** (e.g. `1542`).
- **The Rule**: Always multiply GSAP time by `1000`:
  ```typescript
  lenisRef.current?.lenis?.raf(time * 1000);
  ```

---

## 4. Production Reference Implementation: `SmoothScrollProvider.tsx`

```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import 'lenis/dist/lenis.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Single unified update function
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000); // Seconds to milliseconds
    }

    // 2. Wire Lenis to GSAP ticker
    gsap.ticker.add(update);

    // 3. Disable GSAP lag smoothing to eliminate rubber-banding on heavy frames
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger calculations on Next.js client-side route transitions
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
        autoRaf: false, // Mandatory: disable internal RAF loop
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

export default SmoothScrollProvider;
```
