# Scroll Isolation & `data-lenis-prevent` Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/03-scroll-isolation-and-data-lenis-prevent.md`  
> **Target:** Wheel Event Isolation, Graph Canvases, and Code Spec Drawers  

---

## 1. The Scroll Conflict Problem in CAD Workstations

In standard content-heavy websites, every mouse wheel tick belongs to the page scroller. In Traceon, the functional application routes are **mission-critical CAD workstations**:
- `/graph/[repoId]`: Mouse wheel input must zoom in and pan the ReactFlow AST dependency canvas.
- 3D Code Nucleus: Mouse wheel input zooms camera focal length.
- Node Detail Sidecar & Terminal Loggers: Internal vertical scroll must traverse source code lines.

### The Conflict:
If Lenis intercepts wheel events globally, turning the mouse wheel inside the AST graph causes the entire page to scroll away underneath the user's cursor, destroying usability.

---

## 2. How `data-lenis-prevent` Works

Lenis intercepts wheel and touch events at the `window` level. Before processing the event into virtual scroll delta, Lenis traverses up the DOM tree from `event.target`:

```
event.target (e.g. <canvas> or ReactFlow node)
       │
       ▼
parentElement.closest('[data-lenis-prevent]')
       │
       ├──► Found? ──► Lenis ignores event. Native wheel/zoom executes!
       │
       └──► Not found? ──► Lenis computes virtual page scroll.
```

---

## 3. Mandatory Usage Locations in Traceon

| Screen / Component | Element to Tag | Purpose |
|:---|:---|:---|
| `src/app/graph/[repoId]/page.tsx` | Outer ReactFlow container `<div>` | Wheel zooms AST nodes; never scrolls page |
| `Interactive3DTreeCanvas.tsx` | Outer `<Canvas>` wrapper `<div>` | Wheel zooms 3D camera; never scrolls page |
| `NodeDetailSidecar.tsx` | Drawer code inspection container | Code editor scrolls vertically within panel |
| `CommandOmnibox.tsx` | Command search results list `<ul>` | Arrow keys & wheel scroll search items |
| `LexicalStreamLoader.tsx` | Terminal token waterfall box | Token logs scroll independently |

### Implementation Snippet:
```tsx
<div
  className="relative w-full h-[calc(100vh-64px)] bg-[#050506]"
  data-lenis-prevent
>
  <ReactFlow nodes={nodes} edges={edges} ... />
</div>
```

---

## 4. Drop-in Reusable Wrapper Component

```tsx
'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LenisPreventContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Ensures wheel and touch events inside this container are strictly isolated
 * from the global Lenis page scroller.
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
export default LenisPreventContainer;
```

---

## 5. CSS Traps to Avoid

1. **Never Set `overflow: hidden` on `html` or `body`**:
   - Setting `html, body { overflow: hidden }` breaks Lenis's internal limit calculations and stops smooth scrolling completely.
2. **Always Use `data-lenis-prevent` on Modals**:
   - Any modal or drawer with internal scrolling content must include `data-lenis-prevent` to prevent background page bleed.
