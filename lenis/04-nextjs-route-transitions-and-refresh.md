# Next.js 15 App Router Route Transitions & `scrollTo` Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/04-nextjs-route-transitions-and-refresh.md`  
> **Target:** Client Navigation, Scroll Position Resets, and Anchor Jumps  

---

## 1. The Route Transition Problem in Next.js 15

In Next.js App Router, navigating between pages (e.g. from `/` $\to$ `/graph` $\to$ `/profile-analytics`) is performed via client-side React subtree re-rendering without a full page reload:
1. **Residual Scroll Position**: If a user scrolls 2,000px down on the landing page and clicks a link, the newly rendered page might inherit the 2,000px offset or jump erratically.
2. **Obsolete Scroll Limits**: The landing page may have a scroll height of 8,000px, while `/graph` has a scroll height of 100vh. Lenis's internal `limit` value must be updated immediately.

---

## 2. The `lenis.scrollTo()` API

Lenis provides a programmatic scroll engine capable of handling top resets, smooth anchor links, and target offsets:

```typescript
lenis.scrollTo(target, options);
```

### Supported Parameters:

| Parameter | Type | Purpose | Example |
|:---|:---|:---|:---|
| `target` | `number \| string \| HTMLElement` | Destination coordinate, CSS selector, or node | `0`, `'#features'`, `el` |
| `offset` | `number` | Pixel offset (e.g. negative navbar height) | `-64` (for fixed HUDNavbar) |
| `duration` | `number` | Duration of scroll animation in seconds | `1.2` |
| `immediate` | `boolean` | Instantly jump without animation (for page route changes) | `true` |
| `lock` | `boolean` | Freeze user input until destination is reached | `false` |
| `force` | `boolean` | Override active user interaction | `true` |
| `onComplete` | `(lenis) => void` | Callback when scroll completes | `() => console.log('Arrived')` |

---

## 3. Production Route Transition Hook

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useLenisRouteHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // 1. Instantly reset scroll to top on page route transition
    lenis.scrollTo(0, { immediate: true });

    // 2. Allow React 19 to commit DOM nodes, then refresh ScrollTrigger
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname, lenis]);
}
```

---

## 4. Smooth Anchor Navigation Pattern (Navbar & CTAs)

When clicking a link in `HUDNavbar.tsx` that links to an on-page section (e.g. `#architecture` or `#curism`):

```tsx
'use client';

import React from 'react';
import { useLenis } from 'lenis/react';

export function NavAnchorLink({ href, label }: { href: string; label: string }) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      lenis?.scrollTo(href, {
        offset: -64, // Accounts for 64px fixed HUDNavbar height
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="font-mono text-xs text-[#7A7A85] hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}
```
