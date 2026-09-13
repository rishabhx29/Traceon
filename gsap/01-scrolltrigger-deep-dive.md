# ScrollTrigger Master Reference & Deep Dive

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/01-scrolltrigger-deep-dive.md`  
> **Target:** Pinned Scrollers, Scrubbed Timelines, containerAnimation, and Responsive matchMedia  

---

## 1. Core ScrollTrigger Configuration Architecture

`ScrollTrigger` links GSAP timelines and tweens directly to page scroll positions. In Traceon, it powers the hero 3D morphing, the horizontal architecture journey, and the HUD navbar compression.

### Master Configuration Object:
```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const trigger = ScrollTrigger.create({
  trigger: '#target-container',   // Element that defines scroll boundaries
  start: 'top top',              // Trigger starts when top of element hits top of viewport
  end: '+=3000',                 // Extends scroll distance by 3000px
  pin: true,                     // Pins target-container during scroll distance
  pinSpacing: true,              // Adds spacer padding so subsequent content is pushed down
  scrub: 1.2,                    // 1.2s smooth inertial lag behind scroll wheel
  anticipatePin: 1,              // Prevents microscopic jump when pinning begins
  fastScrollEnd: true,           // Snaps immediately to end if user scrolls violently fast
  preventOverlaps: true,         // Halts competing tweens
  onUpdate: (self) => {
    // self.progress (0.0 to 1.0)
    // self.direction (1 = forward/down, -1 = backward/up)
    // self.velocity (pixels/second)
  },
});
```

---

## 2. Scrubbing: Boolean vs Numerical Inertia

| Scrub Mode | Syntax | Physical Behavior | Verdict in Traceon |
|:---|:---|:---|:---|
| **Boolean** | `scrub: true` | Instant 1:1 lock to scrollbar thumb. Zero dampening. | ❌ **Rejected**: Looks jerky with wheel mice |
| **Micro-Lag** | `scrub: 0.5` | 500ms catch-up time. Snappy. | ⚠️ Use only for text reveals |
| **Precision Damped** | `scrub: 1.2` | 1200ms smooth inertial catch-up. Replicates physical mass. | ✅ **Standard for 3D Morphing & Hero** |
| **Heavy Inertial** | `scrub: 1.8` | 1800ms floaty dampening. | ❌ Too sluggish for technical tools |

---

## 3. Nested `containerAnimation` for Horizontal Scroll

When a horizontal section translates along the X axis (e.g. `xPercent: -300`), normal vertical `ScrollTrigger` instances inside the children fail because child elements move horizontally, not vertically.

GSAP provides `containerAnimation` to link child triggers directly to the horizontal tween:

```typescript
// 1. Master horizontal scroll timeline
const horizontalTween = gsap.to('.panels-slider', {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    pin: true,
    scrub: 1.2,
    end: () => '+=' + document.querySelector('.panels-slider')!.scrollWidth,
  },
});

// 2. Child trigger attached to the horizontal movement
gsap.from('.panel-3 .radar-chart', {
  scale: 0.2,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: '.panel-3',
    containerAnimation: horizontalTween, // Links to master horizontal tween!
    start: 'left center',               // Fires when left edge of panel-3 hits center of viewport
    toggleActions: 'play none none reverse',
  },
});
```

---

## 4. Responsive Degradation with `gsap.matchMedia()`

Heavy pinned sections and 3D camera sweeps must gracefully degrade on mobile viewports (`< 1024px`) to prevent scroll-locking or awkward horizontal swipes:

```typescript
const mm = gsap.matchMedia();

mm.add({
  isDesktop: '(min-width: 1024px)',
  isMobile: '(max-width: 1023px)',
}, (context) => {
  const { isDesktop, isMobile } = context.conditions as { isDesktop: boolean; isMobile: boolean };

  if (isDesktop) {
    // Desktop: Full pinned horizontal journey spanning 400vw
    gsap.to('.panels-slider', {
      xPercent: -300,
      scrollTrigger: {
        trigger: '.horizontal-wrapper',
        pin: true,
        scrub: 1.2,
        end: '+=4000',
      },
    });
  } else {
    // Mobile: Vertical stack of CAD cards without pinning
    gsap.utils.toArray<HTMLElement>('.panel-card').forEach((card) => {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      });
    });
  }
});
```

---

## 5. Performance Best Practices Checklist

1. **`fastScrollEnd: true`**: When users flick their mouse wheel rapidly, prevents animations from getting stuck halfway through.
2. **`anticipatePin: 1`**: Instructs ScrollTrigger to start calculating pin offset 1 frame early, eliminating visible 1px jump at pin entry.
3. **Always Clean Up on Route Changes**: Call `ScrollTrigger.getAll().forEach(t => t.kill())` when navigating away, or rely on `@gsap/react` `useGSAP()`.
4. **Coordinate with Lenis**: Never set `window.scrollTo` manually. Call `lenis.scrollTo()` or trigger `ScrollTrigger.refresh()`.
