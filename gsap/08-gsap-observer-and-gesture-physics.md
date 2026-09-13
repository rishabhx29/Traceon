# GSAP Observer & Multi-Input Gesture Physics Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/08-gsap-observer-and-gesture-physics.md`  
> **Target:** Pointer Gestures, Horizontal Carousels, and Scroll-Free Scrubber Control  

---

## 1. What is the GSAP Observer Plugin?

`Observer` (`import { Observer } from 'gsap/Observer'`) normalizes touch swipes, mouse wheel ticks, and pointer dragging across all browsers and devices into a unified, event-driven API.

### Why Observer Beats Native Listeners:
1. **Multi-Input Normalization**: A single configuration handles desktop mouse wheels, trackpad two-finger swipes, and mobile touchscreen gestures identically.
2. **Directional Thresholds**: Automatically filters out minor tremors and micro-movements using `tolerance: 15`.
3. **No Dummy Scroll Containers**: Unlike ScrollTrigger which requires a scrollable element or spacer, Observer can drive carousels, scrubbers, and 3D scenes without any scrollbar.

---

## 2. Observer Configuration Specification

```typescript
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

export function createCarouselObserver(
  targetElement: HTMLElement,
  onNext: () => void,
  onPrev: () => void
) {
  let animating = false;

  const observer = Observer.create({
    target: targetElement,
    type: 'wheel,touch,pointer', // Listen to mouse wheel, touch swipes, and click-drags
    wheelSpeed: -1,              // Invert wheel if needed
    tolerance: 20,               // Ignore movements smaller than 20px
    preventDefault: true,        // Prevent page scroll when interacting with this component
    onRight: () => {
      if (animating) return;
      animating = true;
      onPrev();
      setTimeout(() => (animating = false), 400);
    },
    onLeft: () => {
      if (animating) return;
      animating = true;
      onNext();
      setTimeout(() => (animating = false), 400);
    },
  });

  return observer;
}
```

---

## 3. Application in Traceon: `CommitScrubber.tsx` & `ArchetypeCarousel.tsx`

1. **Commit Scrubber Timeline**:
   - Sweeping the mouse wheel or swiping horizontally advances or reverses git commit points.
   - Snaps to the nearest commit notch using `onLeft` and `onRight`.
2. **Archetype 3D Carousel**:
   - Swiping spins the cylindrical 3D card ring by $360^\circ / N$.
   - Interacting with the cards does not fight the vertical Lenis smooth scroller because `preventDefault: true` isolates the gesture.
