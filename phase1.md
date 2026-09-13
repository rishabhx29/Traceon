# Phase 1: Foundation & Design System Setup — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/phases/phase1.md` (and root `phase1.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Zero code modified until this phase is initiated  
> **Authoring Team:** Visual Design, Performance, UI Critic, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

Phase 1 establishes the indestructible technical and visual foundation for the entire Traceon UI/UX refactor. Without this foundation, advanced 3D spatial components, Lenis smooth scrolling, and GSAP timelines will suffer from frame drops, layout shifts, or conflicting styles.

### Core Objectives:
1. **Purge all generic AI slop colors** permanently from `globals.css`. Replace them with the Obsidian Industrial Monochrome and Semantic Engineering Phosphors palette.
2. **Install and configure the complete animation toolchain**: GSAP v3.15, `@gsap/react`, Lenis, Anime.js v4, Three.js, `@react-three/fiber`, and `@react-three/drei`.
3. **Build the Lenis + GSAP RAF Synchronized Scroll Engine** (`SmoothScrollProvider.tsx`) with zero-lag ticker synchronization, Next.js route change refreshes, and mobile touch safety.
4. **Configure technical typography**: `Space Grotesk` (Display), `Inter` (Body), and `JetBrains Mono` (Telemetry & Code) with zero layout shift font loading.
5. **Construct 5 essential CAD Draftsman UI primitives** (`PopActuator`, `BlueprintFrame`, `MonoLabel`, `CADDivider`, `PhosphorBadge`) that will be reused across all subsequent phases.

---

## 2. Multi-Agent Orchestration & Simultaneous Collaboration Matrix

During the execution of Phase 1, the following subagents collaborate simultaneously with strict dependency gating:

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 1 MULTI-AGENT EXECUTION FLOW                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   [Agent 10: Agent Orchestrator]                                                      │
│        │                                                                              │
│        ├──► Assigns Subphase 1.1 (Dependencies) ──► [Implementor Agent]               │
│        │                                                     │                        │
│        │                                                     ▼                        │
│        │                                           [Agent 9: Checker Agent]           │
│        │                                           VERIFICATION GATE 1.1              │
│        │                                                     │                        │
│        ├──► Assigns Subphase 1.2 & 1.3 (Tokens & Fonts) ────► [Implementor Agent]    │
│        │                                                     │                        │
│        │                                                     ▼                        │
│        │                                           [Agent 9: Checker Agent]           │
│        │                                           VERIFICATION GATE 1.2 & 1.3        │
│        │                                                     │                        │
│        ├──► Assigns Subphase 1.4 (Scroll Engine) ───────────► [Implementor Agent]    │
│        │                                                     │                        │
│        │                                                     ▼                        │
│        │                                           [Agent 9: Checker Agent]           │
│        │                                           VERIFICATION GATE 1.4              │
│        │                                                     │                        │
│        ├──► Assigns Subphase 1.5 (UI Primitives) ───────────► [Implementor Agent]    │
│        │                                                     │                        │
│        │                                                     ▼                        │
│        │                                           [Agent 9: Checker Agent]           │
│        │                                           VERIFICATION GATE 1.5              │
│        │                                                     │                        │
│        └──► Final Phase 1 Audit ────────────────────────────► [Agent 9: Checker Agent]│
│                                                            & [Agent 8: Perf Agent]    │
│                                                            PASS -> Unlock Phase 2     │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Subagent Roles & Mandates:
1. **`agent-orchestrator-workflow-mgr` (Workflow Manager)**:
   - Enforces atomic execution of one subphase at a time.
   - Prevents any files in future phases (e.g. `MasterHero.tsx`, `CodeNucleus.tsx`, `HUDNavbar.tsx`) from being modified prematurely.
   - Automatically halts execution if a verification gate fails.
2. **`phase1-foundation-implementor` (Implementation Subagent)**:
   - Dedicated write-enabled developer subagent tasked with creating and editing files according to the strict code specifications below.
3. **`ui-critic-qa-agent` (The Checker Agent)**:
   - Reviews every modified file immediately after generation.
   - Performs regex and grep audits for banned colors (`#8b5cf6`, `indigo`, `purple`, `violet`, `cyan`, `blue`, `#3b82f6`).
   - Checks contrast ratios (minimum 4.5:1 for body text, 3:1 for large display).
   - Verifies TypeScript compilation with zero errors.
   - Issues a formal `PASS` or `REWORK` verdict with exact file and line references.
4. **`visual-design-system-researcher` (Theme Guardian)**:
   - Validates that all colors, borders, spacing units, and typography adhere to the CAD Draftsman industrial aesthetic.
5. **`performance-tech-feasibility-researcher` (Performance Guardian)**:
   - Audits the RAF loop in `SmoothScrollProvider` to confirm `autoRaf: false`, `lagSmoothing(0)`, and no redundant ticker bindings.

---

## 3. Visual Design System & Theme Specifications

### 3.1 The Obsidian Industrial Monochrome & Engineering Phosphors Palette
Traceon rejects the ubiquitous generic "AI SaaS" template aesthetics (purple glows, neon blue gradients, blurry pastel glassmorphism). The palette is strictly modeled on **precision aviation HUDs, avionics displays, and mechanical CAD drafting tables**.

| Token Name | CSS Variable | Hex Value | Purpose & Architectural Usage | Contrast vs Void |
| :--- | :--- | :--- | :--- | :--- |
| **Obsidian Void** | `--color-void` | `#050506` | Deepest non-reflective background canvas | Baseline (1.0) |
| **Carbon Strata** | `--color-carbon` | `#0A0A0C` | Primary cards, technical sidebars, omnibox | 1.1:1 |
| **Matte Slate** | `--color-slate` | `#121215` | Elevated panels, active states, pressed buttons | 1.3:1 |
| **Precision Steel** | `--color-steel` | `#1E1E24` | 1px hairline borders, structural crosshair dividers | 1.8:1 |
| **Graphite** | `--color-graphite` | `#2A2A32` | Secondary dividers, disabled states, hover borders | 2.5:1 |
| **Titanium Stark** | `--color-text-0` | `#F5F5F7` | Primary display headlines, active values | **18.8:1 (AAA)** |
| **Technical Bone** | `--color-text-1` | `#D1D1D6` | Standard body copy, readable prose | **13.5:1 (AAA)** |
| **Muted Telemetry**| `--color-text-2` | `#7A7A85` | Monospaced tags, coordinate labels, timestamps | **5.4:1 (AA)** |
| **Dimmed Telemetry**| `--color-text-3` | `#52525B` | Corner crosshairs `+`, disabled text, guidelines | 3.2:1 |
| **Cadmium Amber** | `--color-cadmium` | `#F59E0B` | Active AST traversal, circular dependency warnings, primary actuators | **11.2:1 (AAA)** |
| **Cadmium Dim** | `--color-cadmium-dim` | `#D97706` | Hover & focus borders for amber elements | 8.2:1 (AAA) |
| **Phosphor Emerald**| `--color-phosphor` | `#10B981` | Clean compilation, passing tests, developer genome | **10.1:1 (AAA)** |
| **Phosphor Dim** | `--color-phosphor-dim` | `#059669` | Hover states for emerald indicators | 7.0:1 (AAA) |
| **Seismic Vermilion**| `--color-seismic` | `#EF4444` | High blast radius (>70 impact), broken imports | **6.1:1 (AA)** |
| **Seismic Dim** | `--color-seismic-dim` | `#DC2626` | Pressed states for critical alerts | 4.8:1 (AA) |

> ❌ **BANNED COLORS (Checker Agent Auto-Fails if Detected)**:  
> `#3b82f6` (blue), `#6366f1` (indigo), `#8b5cf6` (purple), `#a855f7` (violet), `#06b6d4` (cyan), `#ec4899` (pink), or any pastel aurora gradient.

### 3.2 Typography Tokens
- **Display Font**: `Space Grotesk` (Weights: 600, 700) — Mechanical geometric sans-serif for headings.
- **Body Font**: `Inter` (Weights: 400, 500) — Crisp, legible Swiss neo-grotesque for prose and descriptions.
- **Mono Font**: `JetBrains Mono` (Weights: 400, 500, 700) — Primary monospace for telemetry, AST nodes, and code. Fallback: `Fira Code`.

### 3.3 CAD Blueprint Drafting Grid Tokens
- **Baseline Grid**: 8px modular unit (`--grid-unit: 8px`).
- **Drafting Wireframe**: Hairline grid lines drawn with `rgba(255, 255, 255, 0.05)` at 64px intervals.
- **Corner Crosshairs**: `+` symbols rendered at card corners using absolute positioning in `10px` monospaced text (`#52525B`).

---

## 4. Animation & Motion Architecture

### 4.1 Lenis + GSAP Synchronization Pattern
To guarantee 60fps / 120fps smooth scrolling synchronized with ScrollTrigger:
1. Initialize `ReactLenis` with `autoRaf: false` (Lenis does NOT run its own requestAnimationFrame).
2. Wire Lenis into GSAP's shared RAF ticker:
   ```typescript
   gsap.ticker.add((time: number) => {
     lenisRef.current?.lenis?.raf(time * 1000); // convert seconds to ms
   });
   gsap.ticker.lagSmoothing(0); // eliminate lag jumps during fast scrolls
   ```
3. Refresh ScrollTrigger on route changes via Next.js `usePathname()`.
4. Add `data-lenis-prevent` to nested scroll containers (like code blocks and graph canvases).

### 4.2 Anime.js v4 Spring Physics
All mechanical buttons (`PopActuator`) use Anime.js v4 spring physics:
- **Down-press**: 2px translation on Z/Y axis with `duration: 80ms`.
- **Rebound**: Spring damping with `createSpring({ stiffness: 200, damping: 12 })`.
- **CSS Fallback**: Guaranteed zero layout shift even before JS hydration using:
  ```css
  transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.1s cubic-bezier(0.2, 0, 0, 1);
  ```

---

## 5. Inspirations, References & External Benchmarks

1. **VengeanceUI (`vengenceui.com`)**:
   - Component: *3D Pop Button / Pop Actuator* — Physical tactile depression with mil-spec LED indicator lights.
   - Reference: Hardware mastering audio consoles and avionics toggle switches.
2. **React Bits (`reactbits.dev`)**:
   - Reference: *Magnet Lines* and *Variable Proximity* for subtle physics-based cursor interactions.
3. **Linear (`linear.app`) & Stripe Radar**:
   - Reference: Precision dark-mode tables, hairline 1px borders, high data density without clutter.
4. **CAD / Aviation Drafting Interfaces**:
   - Reference: Autodesk, Blender wireframes, HUD coordinate telemetry bars.

---

## 6. Complete Reference Code & Implementation Specifications

### 6.1 `src/app/globals.css` (Complete Specification)
```css
@import "tailwindcss";

@theme {
  /* ─── Obsidian Industrial Monochrome & Engineering Phosphors ─── */
  /* Zero AI slop colors. No blue, purple, violet, indigo, or cyan. */

  /* Obsidian Foundation (Non-Reflective, High-Depth Surfaces) */
  --color-void: #050506;
  --color-carbon: #0A0A0C;
  --color-slate: #121215;
  --color-steel: #1E1E24;
  --color-graphite: #2A2A32;

  /* Legacy surface aliases (for gradual backward compatibility) */
  --color-surface-0: #050506;
  --color-surface-1: #0A0A0C;
  --color-surface-2: #121215;
  --color-surface-3: #1E1E24;
  --color-surface-4: #2A2A32;

  /* Semantic Engineering Phosphors — Strictly for Data States */
  --color-cadmium: #F59E0B;
  --color-cadmium-dim: #D97706;
  --color-phosphor: #10B981;
  --color-phosphor-dim: #059669;
  --color-seismic: #EF4444;
  --color-seismic-dim: #DC2626;

  /* Legacy accent aliases */
  --color-emerald: #10B981;
  --color-emerald-dim: #059669;
  --color-amber: #F59E0B;
  --color-amber-dim: #D97706;
  --color-rose: #EF4444;

  /* Typography Spectrum */
  --color-text-0: #F5F5F7;
  --color-text-1: #D1D1D6;
  --color-text-2: #7A7A85;
  --color-text-3: #52525B;

  /* Structural Lines */
  --color-stroke: #1E1E24;
  --color-stroke-subtle: #121215;
  --color-wireframe: rgba(255, 255, 255, 0.05);

  /* Grid System */
  --grid-unit: 8px;

  /* Typography Stacks */
  --font-body: 'Inter', system-ui, sans-serif;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

@layer base {
  * {
    border-color: var(--color-stroke);
  }

  html {
    color-scheme: dark;
  }

  body {
    background-color: var(--color-void);
    color: var(--color-text-0);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }

  ::selection {
    background-color: var(--color-cadmium);
    color: var(--color-void);
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-steel);
    border-radius: 99px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-3);
  }
}

@layer components {
  /* Dot matrix background (8px grid) */
  .dot-matrix {
    background-image: radial-gradient(circle, var(--color-wireframe) 1px, transparent 1px);
    background-size: calc(var(--grid-unit) * 3) calc(var(--grid-unit) * 3);
  }

  /* Blueprint wireframe grid */
  .wireframe-grid {
    background-image:
      linear-gradient(var(--color-wireframe) 1px, transparent 1px),
      linear-gradient(90deg, var(--color-wireframe) 1px, transparent 1px);
    background-size: calc(var(--grid-unit) * 8) calc(var(--grid-unit) * 8);
  }

  /* Blueprint card (CAD Spec-Sheet style) */
  .blueprint-card {
    background: var(--color-carbon);
    border: 1px solid var(--color-steel);
    position: relative;
    transition: border-color 0.15s ease-out;
  }

  .blueprint-card:hover {
    border-color: var(--color-text-3);
  }

  .mono-label {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-text-2);
  }

  /* Focus ring (amber phosphor) */
  :focus-visible {
    outline: 2px solid var(--color-cadmium);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 6.2 `src/components/providers/SmoothScrollProvider.tsx` (Complete Specification)
```typescript
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

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function update(time: number) {
      // time is in seconds from GSAP ticker, convert to ms for Lenis
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger calculations on Next.js page route changes
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScrollProvider;
```

---

### 6.3 `src/components/ui/PopActuator.tsx` (Complete Specification)
```typescript
'use client';

import React, { useState, useRef, forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { animate, createSpring } from 'animejs';

export type PopActuatorSize = 'sm' | 'md' | 'lg';
export type PopActuatorLedColor = 'amber' | 'emerald' | 'seismic' | 'cadmium' | 'phosphor';

export interface PopActuatorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ledColor?: PopActuatorLedColor;
  className?: string;
  disabled?: boolean;
  size?: PopActuatorSize;
}

const sizeClasses: Record<PopActuatorSize, string> = {
  sm: 'h-7 px-2.5 py-1 text-[10px] gap-1.5',
  md: 'h-9 px-3.5 py-1.5 text-xs gap-2',
  lg: 'h-11 px-5 py-2.5 text-sm gap-2.5',
};

const ledColorStyles: Record<PopActuatorLedColor, { dot: string; glow: string }> = {
  amber: { dot: 'bg-[#F59E0B]', glow: 'shadow-[0_0_6px_#F59E0B]' },
  cadmium: { dot: 'bg-[#F59E0B]', glow: 'shadow-[0_0_6px_#F59E0B]' },
  emerald: { dot: 'bg-[#10B981]', glow: 'shadow-[0_0_6px_#10B981]' },
  phosphor: { dot: 'bg-[#10B981]', glow: 'shadow-[0_0_6px_#10B981]' },
  seismic: { dot: 'bg-[#EF4444]', glow: 'shadow-[0_0_6px_#EF4444]' },
};

export const PopActuator = forwardRef<HTMLButtonElement, PopActuatorProps>(
  (
    {
      children,
      onClick,
      ledColor,
      className,
      disabled = false,
      size = 'md',
      type = 'button',
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      onKeyDown,
      onKeyUp,
      style,
      ...restProps
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const internalRef = useRef<HTMLButtonElement | null>(null);

    const setRef = (node: HTMLButtonElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    };

    const pressDown = () => {
      if (disabled) return;
      setIsPressed(true);

      if (internalRef.current) {
        try {
          animate(internalRef.current, {
            translateY: 2,
            duration: 80,
            ease: createSpring({ stiffness: 200, damping: 12 }),
          });
        } catch {
          // Handled by CSS transition fallback
        }
      }
    };

    const releaseUp = () => {
      if (disabled) return;
      setIsPressed(false);

      if (internalRef.current) {
        try {
          animate(internalRef.current, {
            translateY: 0,
            duration: 250,
            ease: createSpring({ stiffness: 200, damping: 12 }),
          });
        } catch {
          // Handled by CSS transition fallback
        }
      }
    };

    return (
      <button
        ref={setRef}
        type={type}
        disabled={disabled}
        data-pressed={isPressed ? 'true' : 'false'}
        onClick={onClick}
        onMouseDown={(e) => { pressDown(); onMouseDown?.(e); }}
        onMouseUp={(e) => { releaseUp(); onMouseUp?.(e); }}
        onMouseLeave={(e) => { if (isPressed) releaseUp(); onMouseLeave?.(e); }}
        onTouchStart={(e) => { pressDown(); onTouchStart?.(e); }}
        onTouchEnd={(e) => { releaseUp(); onTouchEnd?.(e); }}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !isPressed) pressDown();
          onKeyDown?.(e);
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') releaseUp();
          onKeyUp?.(e);
        }}
        style={{
          transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
          transition: 'transform 0.1s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.1s cubic-bezier(0.2, 0, 0, 1)',
          ...style,
        }}
        className={cn(
          'relative inline-flex items-center justify-center font-mono uppercase tracking-[0.12em] font-medium rounded-sm border cursor-pointer select-none outline-none',
          'bg-[#121215] text-[#F5F5F7] border-[#1E1E24]',
          'hover:border-[#7A7A85] hover:bg-[#1A1A20]',
          'focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-1 focus-visible:ring-offset-[#050506]',
          isPressed
            ? 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-[#7A7A85]'
            : 'shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]',
          disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          sizeClasses[size],
          className
        )}
        {...restProps}
      >
        {ledColor && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full shrink-0', ledColorStyles[ledColor].dot, ledColorStyles[ledColor].glow)}
            aria-hidden="true"
          />
        )}
        <span className="truncate">{children}</span>
      </button>
    );
  }
);

PopActuator.displayName = 'PopActuator';
export default PopActuator;
```

---

### 6.4 `src/components/ui/BlueprintFrame.tsx` (Complete Specification)
```typescript
'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BlueprintFrameProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  label?: string;
  className?: string;
  contentClassName?: string;
}

export const BlueprintFrame = forwardRef<HTMLDivElement, BlueprintFrameProps>(
  ({ children, label, className, contentClassName, ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative border border-[#1E1E24] bg-[#050506] rounded-sm',
          className
        )}
        {...restProps}
      >
        {/* 4 Corner Crosshair Marks */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-3 h-3 text-[#52525B] text-[10px] font-mono leading-none select-none pointer-events-none z-20" aria-hidden="true">+</div>
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-3 h-3 text-[#52525B] text-[10px] font-mono leading-none select-none pointer-events-none z-20" aria-hidden="true">+</div>
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 flex items-center justify-center w-3 h-3 text-[#52525B] text-[10px] font-mono leading-none select-none pointer-events-none z-20" aria-hidden="true">+</div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 flex items-center justify-center w-3 h-3 text-[#52525B] text-[10px] font-mono leading-none select-none pointer-events-none z-20" aria-hidden="true">+</div>

        {/* Optional Coordinate Header Label */}
        {label && (
          <div className="flex items-center gap-2 border-b border-[#1E1E24] bg-[#0A0A0C] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#7A7A85] select-none">
            <span className="w-1 h-1 bg-[#7A7A85]/50 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </div>
        )}

        {/* Frame Contents */}
        <div className={cn(contentClassName)}>{children}</div>
      </div>
    );
  }
);

BlueprintFrame.displayName = 'BlueprintFrame';
export default BlueprintFrame;
```

---

### 6.5 `src/components/ui/MonoLabel.tsx`
```typescript
'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface MonoLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
}

export const MonoLabel = forwardRef<HTMLSpanElement, MonoLabelProps>(
  ({ children, className, ...restProps }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'font-mono text-[10px] uppercase tracking-[0.15em] text-[#7A7A85]',
          className
        )}
        {...restProps}
      >
        {children}
      </span>
    );
  }
);

MonoLabel.displayName = 'MonoLabel';
export default MonoLabel;
```

---

### 6.6 `src/components/ui/CADDivider.tsx`
```typescript
'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CADDividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  className?: string;
}

export const CADDivider = forwardRef<HTMLDivElement, CADDividerProps>(
  ({ label, className, ...restProps }, ref) => {
    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn('relative flex items-center w-full my-4 select-none', className)}
          {...restProps}
        >
          <div className="flex-1 h-[1px] bg-[#1E1E24]" />
          <div className="flex items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#7A7A85]">
            <span className="h-2 w-[1px] bg-[#7A7A85]/50" aria-hidden="true" />
            <span>{label}</span>
            <span className="h-2 w-[1px] bg-[#7A7A85]/50" aria-hidden="true" />
          </div>
          <div className="flex-1 h-[1px] bg-[#1E1E24]" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn('relative flex items-center justify-center w-full h-[1px] bg-[#1E1E24] my-4 select-none', className)}
        {...restProps}
      >
        <span className="absolute h-2 w-[1px] bg-[#7A7A85]/50" aria-hidden="true" />
      </div>
    );
  }
);

CADDivider.displayName = 'CADDivider';
export default CADDivider;
```

---

### 6.7 `src/components/ui/PhosphorBadge.tsx`
```typescript
'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type PhosphorBadgeVariant = 'cadmium' | 'phosphor' | 'seismic';

export interface PhosphorBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: PhosphorBadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<PhosphorBadgeVariant, { dot: string; text: string; border: string; bg: string }> = {
  cadmium: {
    dot: 'bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]',
    text: 'text-[#F59E0B]',
    border: 'border-[#F59E0B]/30',
    bg: 'bg-[#F59E0B]/5',
  },
  phosphor: {
    dot: 'bg-[#10B981] shadow-[0_0_6px_#10B981]',
    text: 'text-[#10B981]',
    border: 'border-[#10B981]/30',
    bg: 'bg-[#10B981]/5',
  },
  seismic: {
    dot: 'bg-[#EF4444] shadow-[0_0_6px_#EF4444]',
    text: 'text-[#EF4444]',
    border: 'border-[#EF4444]/30',
    bg: 'bg-[#EF4444]/5',
  },
};

export const PhosphorBadge = forwardRef<HTMLSpanElement, PhosphorBadgeProps>(
  ({ variant, children, className, ...restProps }, ref) => {
    const styles = variantStyles[variant];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border select-none',
          'font-mono text-[10px] uppercase tracking-[0.15em]',
          styles.bg,
          styles.border,
          styles.text,
          className
        )}
        {...restProps}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', styles.dot)} aria-hidden="true" />
        <span className="truncate">{children}</span>
      </span>
    );
  }
);

PhosphorBadge.displayName = 'PhosphorBadge';
export default PhosphorBadge;
```

---

## 7. Granular Subphase Breakdown & Execution Plan

### Subphase 1.1: Dependency Installation & Toolchain Lock
- **Action**: Run `npm install gsap @gsap/react lenis animejs three @react-three/fiber @react-three/drei` and `npm install -D @types/three`.
- **Target Files**: `package.json`, `package-lock.json`.
- **Resource Toolkits & Reference Paths to Access**:
  * `animejs/01-anime-v4-complete-api-reference.ts` — Verify Anime.js v4 API signatures, timeline syntax, and package exports.
  * `gsap/01-gsap-core-and-timelines.ts` — Check GSAP v3 core plugin registration, timeline syntax, and `@gsap/react` integration.
  * `lenis/05-lenis-smooth-scroll.ts` — Verify Lenis instance creation and options (`autoRaf: false`, `smoothTouch: false`).
- **Checker Agent Gate 1.1**:
  - [ ] Check `package.json` contains `gsap`, `lenis`, `animejs`, `three`, `@react-three/fiber`, `@react-three/drei`.
  - [ ] Verify `npm ls gsap lenis animejs three` returns resolved versions without peer dependency conflicts.

### Subphase 1.2: Design Tokens & globals.css Overhaul
- **Action**: Replace `src/app/globals.css` with the complete Obsidian Industrial specification (Section 6.1).
- **Target File**: `src/app/globals.css`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/README.md` (Section 1: Token Specification & Color Lock) — Strict verification of Obsidian `#0A0A0A`, Carbon `#121212`, Graphite `#1E1E1E`, Steel `#262626`, Phosphor Amber `#FFB000`, Phosphor Emerald `#10B981`, Laser Vermilion `#FF3333`.
- **Checker Agent Gate 1.2**:
  - [ ] Grep for `#8b5cf6`, `purple`, `violet`, `indigo`, `cyan`, `#3b82f6` -> Must return 0 matches.
  - [ ] Verify `--color-void: #050506` and `--color-steel: #1E1E24` are present.
  - [ ] Verify `prefers-reduced-motion` zero-duration block is present.

### Subphase 1.3: Typography Stack in Root Layout
- **Action**: Configure `Space_Grotesk`, `Inter`, and `JetBrains_Mono` in `src/app/layout.tsx`. Wrap layout with font CSS variables.
- **Target File**: `src/app/layout.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/02-kinetic-typography-and-ciphers.tsx` — Typography baseline styling, monospace font weight pairing, and character kerning rules.
- **Checker Agent Gate 1.3**:
  - [ ] Verify `JetBrains_Mono` is imported from `next/font/google` with variable `--font-mono`.
  - [ ] Verify body uses `bg-void` and `text-text-0`.

### Subphase 1.4: Lenis + GSAP Synchronized Scroll Engine
- **Action**: Create `src/components/providers/SmoothScrollProvider.tsx` (Section 6.2). Wrap `<SmoothScrollProvider>` inside `NextAuthProvider` in `src/app/layout.tsx`.
- **Target Files**: `src/components/providers/SmoothScrollProvider.tsx`, `src/app/layout.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `lenis/05-lenis-smooth-scroll.ts` — Core `LenisScrollEngine` patterns, RAF ticker binding, and `useLenis()` hook.
  * `lenis/06-integrated-cad-motion-controller.ts` — Synchronized CAD motion controller coordinating Lenis with ScrollTrigger.
  * `gsap/02-scrolltrigger-and-pinning.ts` — `initScrollTriggerWithLenis()` pattern, `gsap.ticker.lagSmoothing(0)`, and route change refresh.
- **Checker Agent Gate 1.4**:
  - [ ] Verify `autoRaf: false` on `ReactLenis`.
  - [ ] Verify `gsap.ticker.add` and `gsap.ticker.lagSmoothing(0)` are properly wired and removed on unmount.
  - [ ] Verify `ScrollTrigger.refresh()` is called on pathname changes.

### Subphase 1.5: Precision CAD UI Component Primitives
- **Action**: Create the 5 UI primitives in `src/components/ui/`: `PopActuator.tsx`, `BlueprintFrame.tsx`, `MonoLabel.tsx`, `CADDivider.tsx`, `PhosphorBadge.tsx`, and `index.ts`.
- **Target Files**: `src/components/ui/*`.
- **Resource Toolkits & Reference Paths to Access**:
  * `PopActuator`:
    - Component Template: `Reference_components/01-tactile-actuators-and-buttons.tsx` (`VengeancePopActuator`)
    - Physics Engine: `animejs/02-spring-and-easing-physics.ts` (`tactilePopButtonSpring`, `createSpring({ stiffness: 200, damping: 12 })`)
  * `BlueprintFrame`:
    - Component Template: `Reference_components/03-cad-frames-and-spotlight-cards.tsx` (`IndustrialBlueprintFrame`)
  * `MonoLabel` / `PhosphorBadge`:
    - Component Template: `Reference_components/01-tactile-actuators-and-buttons.tsx` (`CADCornerReticleButton`) & `Reference_components/02-kinetic-typography-and-ciphers.tsx`
  * `CADDivider`:
    - Component Template: `Reference_components/07-background-grids-and-magnet-lines.tsx` (`AxisRulerOverlay`)
- **Checker Agent Gate 1.5**:
  - [ ] Verify `PopActuator` handles mousedown 2px depression and Anime.js spring rebound with CSS fallback.
  - [ ] Verify `BlueprintFrame` renders 4 corner `+` crosshairs.
  - [ ] Verify all components export both named and default exports, with `displayName` defined for forwardRef.

### Subphase 1.6: Final Phase 1 Audit & TypeScript Lock
- **Action**: Run `tsc --noEmit` across the entire codebase.
- **Checker Agent Gate 1.6**:
  - [ ] `tsc --noEmit` exits with code 0.
  - [ ] No regression in existing routes (`/home`, `/graph`, `/dashboard`, `/repo`, `/profile`).
  - [ ] Phase 1 sign-off issued by Orchestrator Agent. Phase 2 unlocked.
