# React 19 / Next.js Lifecycle & `useGSAP()` Integration Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/02-gsap-react-lifecycle-usegsap.md`  
> **Target:** Scoped Selectors, React StrictMode Safety, and Leak-Free Memory Disposal  

---

## 1. Why `useGSAP()` is Mandatory in React 19 & Next.js

In React 18 and React 19, components render under **StrictMode**, meaning hooks mount, unmount, and remount immediately in development to test for memory leaks and idempotency.

### The Pitfall of Bare `useEffect()`:
```typescript
// ❌ WRONG: Causes memory leaks, orphaned ScrollTriggers, and selector collisions
useEffect(() => {
  gsap.to('.card', { opacity: 1 }); // Animates ALL .card elements across the whole page!
  ScrollTrigger.create({ trigger: '.card' }); // Orphaned on hot-reload or route change!
}, []);
```

### The Solution: `@gsap/react` `useGSAP()`:
`useGSAP()` is a specialized hook that wraps the callback inside a `gsap.context()`:
1. **Scoped DOM Queries**: Calling `gsap.to('.item')` only queries elements that are descendants of `scope.current`. It will never accidentally mutate elements from other components.
2. **Automatic Garbage Collection**: When the component unmounts or dependencies change, all tweens, timelines, and ScrollTriggers created within the hook are automatically killed and reverted.
3. **StrictMode Safe**: Safely handles the mount $\to$ unmount $\to$ remount cycle without duplicate animations or visual glitches.

---

## 2. Standard Component Implementation Pattern

```tsx
'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function FeatureCardGroup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. All selectors here are strictly scoped to containerRef!
      gsap.from('.feature-card', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 2. Hairline border draw-on
      gsap.from('.cad-divider-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.cad-divider-line',
          start: 'top 85%',
        },
      });
    },
    {
      scope: containerRef, // Mandatory scope isolation
      dependencies: [],    // Re-run if dependencies change
    }
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="cad-divider-line h-[1px] bg-[#1E1E24]" />
      <div className="grid grid-cols-2 gap-4">
        <div className="feature-card bg-[#0A0A0C] border border-[#1E1E24] p-4">AST Engine</div>
        <div className="feature-card bg-[#0A0A0C] border border-[#1E1E24] p-4">Blast Radius</div>
      </div>
    </div>
  );
}
```

---

## 3. Safe Event Handlers with `contextSafe()`

When animating in response to user events (like `onClick` or `onMouseEnter`), standard functions created outside `useGSAP` are not automatically bound to the GSAP context. 

Use `contextSafe()` to wrap event handlers so they are cleaned up if the component unmounts during active execution:

```tsx
'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function InteractiveCadNode() {
  const nodeRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: nodeRef });

  // contextSafe wraps the handler in the active GSAP context
  const handleMouseEnter = contextSafe(() => {
    gsap.to(nodeRef.current, {
      scale: 1.05,
      borderColor: '#F59E0B',
      duration: 0.25,
      ease: 'power2.out',
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(nodeRef.current, {
      scale: 1.0,
      borderColor: '#1E1E24',
      duration: 0.35,
      ease: 'power2.out',
    });
  });

  return (
    <div
      ref={nodeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="p-4 bg-[#0A0A0C] border border-[#1E1E24] transition-colors cursor-pointer"
    >
      AST NODE
    </div>
  );
}
```

---

## 4. Next.js App Router Route Change Rules

When navigating between routes in Next.js (`/` $\to$ `/graph` $\to$ `/profile-analytics`):
1. **DOM Height Mutation**: Next.js updates the DOM tree without triggering a browser `resize` event.
2. **ScrollTrigger Stale Offsets**: Pre-calculated trigger start and end positions become obsolete.
3. **The Solution**: In our root provider (`SmoothScrollProvider.tsx`), subscribe to `usePathname()` and execute `ScrollTrigger.refresh()`:

```typescript
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useScrollTriggerRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    // Delay 50ms to allow React 19 to commit DOM nodes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);
}
```
