# Scroll Locking & Modal Management Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/07-scroll-locking-and-modal-management.md`  
> **Target:** Freezing Virtual Scroll for Command Omnibox, Drawers, and Fullscreen Modals  

---

## 1. The Scroll Lock Problem in Single-Page Apps

When a modal opens (such as the `Cmd+K` Command Omnibox or the AST Node Detail Sidecar), scrolling inside the modal or pressing arrow keys must **not** cause the underlying background page to scroll.

### The Pitfall of `body { overflow: hidden }`:
In standard CSS, setting `document.body.style.overflow = 'hidden'` removes the browser scrollbar, causing a jarring **15px horizontal layout shift** as the entire page re-flows to fill the vacated scrollbar width.

### The Lenis Solution: `lenis.stop()` and `lenis.start()`:
Lenis provides native methods to freeze virtual scrolling:
```typescript
lenis.stop();  // Pauses all virtual scroll events; preserves scrollbar width!
lenis.start(); // Resumes smooth scrolling seamlessly
```
Because Lenis manages virtual scroll coordinates in software, calling `lenis.stop()` freezes the viewport at the current position without altering native CSS overflow or causing layout shifts.

---

## 2. Drop-in React Hook: `useLenisLock`

```typescript
'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/**
 * Freezes the background Lenis smooth scroller while a modal or overlay is open.
 */
export function useLenisLock(isLocked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (isLocked) {
      lenis.stop();
    } else {
      lenis.start();
    }

    // Always restore scroll on unmount
    return () => {
      lenis.start();
    };
  }, [isLocked, lenis]);
}
```

---

## 3. Implementation in `CommandOmnibox.tsx`

```tsx
'use client';

import React from 'react';
import { useLenisLock } from '@/hooks/useLenisLock';

export function CommandOmnibox({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Freezes background page scroll while Omnibox is open
  useLenisLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div
        data-lenis-prevent
        className="w-full max-w-xl bg-[#0A0A0C] border border-[#1E1E24] p-4"
      >
        {/* Omnibox input and searchable list */}
      </div>
    </div>
  );
}
```
