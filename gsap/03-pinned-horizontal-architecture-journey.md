# Pinned Horizontal Architecture Journey Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/03-pinned-horizontal-architecture-journey.md`  
> **Target:** Phase 4 Homepage Feature: `ArchitectureJourney.tsx`  

---

## 1. Concept & Architectural Intent

The **Architecture Journey** is a signature centerpiece of Traceon's landing experience:
- Instead of a generic vertical scroll of feature text blocks, the user enters a **pinned horizontal CAD drafting bay**.
- The page locks in place vertically while downward scroll wheel movement translates a 4-panel container horizontally along the X-axis from right to left.
- Each panel represents a milestone in the codebase analysis pipeline:
  1. **Panel 1: INGESTION** (URL input stream, git clone, token parsing).
  2. **Panel 2: AST COMPILATION** (Hierarchical syntax tree compilation, dependency edge routing).
  3. **Panel 3: RISK MAPPING** (Circular dependency detection, blast radius thermal heat map).
  4. **Panel 4: ENGINEER DNA** (CURISM hexagonal radar expanding from the center).

---

## 2. Mathematical Coordinate Mechanics

Let $N = 4$ be the number of journey panels. 
The horizontal track contains $N$ panels, each spanning $100\text{vw}$, resulting in a total track width of $400\text{vw}$.

### Total Horizontal Displacement:
$$\Delta X = -100\% \cdot (N - 1) = -300\%$$

### Vertical Pin Distance:
To provide a smooth, deliberate reading tempo, vertical scroll distance is calibrated to:
$$\text{Scroll Distance} = (N - 1) \cdot 1200\text{px} = 3600\text{px}$$

### Discrete Panel Snap Ratios:
Snapping to individual panel centers uses increments of:
$$\text{Snap Interval} = \frac{1}{N - 1} = \frac{1}{3} \approx 0.3333$$
Snapping points: `[0.0, 0.3333, 0.6666, 1.0]`.

---

## 3. Complete Reference Implementation

```tsx
'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MonoLabel } from '@/components/ui/MonoLabel';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const STAGES = [
  { id: '01', title: 'REPOSITORY INGESTION', tag: 'INPUT_STREAM' },
  { id: '02', title: 'AST COMPILATION', tag: 'GRAPH_DAG' },
  { id: '03', title: 'ARCHITECTURAL RISK MAPPING', tag: 'BLAST_RADIUS' },
  { id: '04', title: 'DEVELOPER DNA GENOME', tag: 'CURISM_RADAR' },
];

export function ArchitectureJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.journey-panel');

        // Master horizontal translation tween
        const horizontalTween = gsap.to(trackRef.current, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1.2,
            end: () => `+=${window.innerHeight * 3.5}`,
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.1,
              ease: 'power2.out',
            },
            onUpdate: (self) => {
              // Update bottom progress bar width
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${self.progress * 100}%`;
              }
              // Calculate active panel index
              const index = Math.min(
                Math.floor(self.progress * panels.length),
                panels.length - 1
              );
              setActiveStage(index);
            },
          },
        });

        // Nested child animation: Panel 2 tree draw-on
        gsap.from('.panel-2-visual', {
          scale: 0.8,
          opacity: 0,
          scrollTrigger: {
            trigger: '.journey-panel-2',
            containerAnimation: horizontalTween,
            start: 'left 60%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Mobile degradation: Simple vertical stack without pinning
      mm.add('(max-width: 1023px)', () => {
        gsap.utils.toArray<HTMLElement>('.journey-panel').forEach((panel) => {
          gsap.from(panel, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
            },
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-[#050506]">
      {/* HUD Telemetry Header Bar */}
      <div className="absolute top-6 left-8 right-8 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          <MonoLabel
            text={`STAGE [${STAGES[activeStage].id}/04]: ${STAGES[activeStage].title}`}
            size="xs"
            color="amber"
          />
        </div>
        <span className="font-mono text-xs text-[#7A7A85]">
          {STAGES[activeStage].tag}
        </span>
      </div>

      {/* Horizontal Panels Track */}
      <div
        ref={trackRef}
        className="flex w-[400vw] h-screen items-center will-change-transform"
      >
        {STAGES.map((stage, idx) => (
          <div
            key={stage.id}
            className={`journey-panel journey-panel-${idx + 1} w-screen h-full flex flex-col justify-center px-16 relative border-r border-[#1E1E24]/60`}
          >
            <div className="max-w-xl">
              <span className="font-mono text-xs text-[#F59E0B] tracking-widest block mb-2">
                // MILESTONE {stage.id}
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {stage.title}
              </h2>
              <p className="font-sans text-sm text-[#D1D1D6] leading-relaxed">
                Deterministic syntactic graph analysis with microsecond topological resolution.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E1E24]">
        <div
          ref={progressBarRef}
          className="h-full bg-[#F59E0B] w-0 transition-all duration-75 ease-out"
        />
      </div>
    </section>
  );
}
```
