# GSAP Flip Plugin & Layout Morphing Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/07-gsap-flip-layout-morphing.md`  
> **Target:** Seamless Layout State Transitions, Card Expansions, and Graph HUD Morphing  

---

## 1. What is the FLIP Technique?

**FLIP** stands for **F**irst, **L**ast, **I**nvert, **P**lay:
1. **First**: Record the starting position and size of elements (`getBoundingClientRect()`).
2. **Last**: Apply the DOM change immediately (e.g. changing CSS classes, reordering elements in a grid, or toggling fullscreen). Record the final position and size.
3. **Invert**: Apply a `transform: translate(...) scale(...)` to position the element back to where it started.
4. **Play**: Animate the transform back to zero (`transform: none`), creating the illusion of smooth physical layout morphing without triggering costly continuous browser reflows.

The GSAP `Flip` plugin (`import { Flip } from 'gsap/Flip'`) automates this entire pipeline in a single, high-performance API.

---

## 2. Using `Flip` with React & `@gsap/react`

In Traceon, `Flip` is used when:
- Expanding an AST node card from the 2x2 Feature Matrix into a full-width inspector.
- Re-sorting candidate engineers in `SquadMatcher.tsx` based on CURISM score.
- Toggling between **Architecture View** and **DNA View** in `LensSwitcher.tsx`.

### Core API Pattern:
```tsx
'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

export function MorphingCadCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const toggleExpand = contextSafe(() => {
    // 1. Capture initial state of all cards
    const state = Flip.getState('.flip-card, .card-title, .card-content');

    // 2. Mutate React state (switches classes from compact to expanded)
    setExpanded((prev) => !prev);

    // 3. Defer Flip.from to next microtask after React updates DOM
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: 'power3.out',
        absolute: true, // Prevents layout collapse during transition
        nested: true,   // Handles nested text/content scaling cleanly
        scale: true,    // Uses GPU transforms instead of width/height
        onComplete: () => {
          console.log('Layout morph complete');
        },
      });
    });
  });

  return (
    <div ref={containerRef} className="p-4">
      <div
        onClick={toggleExpand}
        className={`flip-card bg-[#0A0A0C] border border-[#1E1E24] cursor-pointer ${
          expanded ? 'w-full h-96' : 'w-64 h-32'
        }`}
      >
        <h3 className="card-title font-mono text-sm text-white">AST CARD</h3>
        <p className="card-content font-sans text-xs text-[#7A7A85]">Telemetry specs</p>
      </div>
    </div>
  );
}
```

---

## 3. Key Parameters & Best Practices

| Option | Value | Purpose |
|:---|:---|:---|
| `duration` | `0.4` to `0.7` | Decisive, mechanical layout transition speed |
| `ease` | `'power3.out'` | Decelerates smoothly with high initial velocity |
| `absolute` | `true` | Positions morphing elements absolutely so siblings don't jump |
| `nested` | `true` | Counter-scales inner child elements so text doesn't distort |
| `fade` | `true` | Smoothly cross-fades elements entering or leaving the DOM |
