# Multi-Instance Nested Scrolling & Overscroll Control Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/10-multi-instance-nested-scrolling.md`  
> **Target:** Independent Smooth Scrolling in Sidecars, Spec Panels, and Terminal Modals  

---

## 1. Concept: Multi-Instance Lenis

While the root `<SmoothScrollProvider>` manages global page navigation, certain high-density CAD panels benefit from their own **independent smooth scrolling context**:
- `NodeDetailSidecar.tsx`: Reading long TypeScript AST token listings.
- `FeatureMatrix.tsx`: Inspecting detailed commit diff previews.

### The Nested Scroll Problem:
In standard web pages, when an inner scrollable panel reaches the bottom, continuing to scroll causes the outer page to suddenly scroll away (**scroll chaining**). 

---

## 2. Using Nested `<ReactLenis>` with `overscroll: false`

Lenis allows instantiating child scrollers that inherit smooth scrolling while strictly trapping overscroll:

```tsx
'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';

export function NestedCadSpecDrawer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-96 h-full bg-[#0A0A0C] border-l border-[#1E1E24]">
      <ReactLenis
        // By omitting the 'root' prop, Lenis targets this container instead of window!
        options={{
          duration: 0.8,
          orientation: 'vertical',
          overscroll: false,          // Traps scroll; never bleeds into parent page!
          allowNestedScroll: true,
          smoothWheel: true,
        }}
        className="h-full overflow-y-auto"
      >
        <div className="p-6 space-y-4">
          {children}
        </div>
      </ReactLenis>
    </div>
  );
}
```

---

## 3. Configuration Comparison: Root vs Nested Scrollers

| Setting | Root Scroller (`window`) | Nested Scroller (Sidecar / Modal) |
|:---|:---|:---|
| `root` | `true` | `false` (Omitted) |
| `autoRaf` | `false` (Driven by GSAP) | `true` (Can run independently) |
| `overscroll`| `true` | `false` (Zero bleed into background) |
| `duration` | `1.2s` | `0.6s - 0.8s` (Tighter, faster for reading) |
