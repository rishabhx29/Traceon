# Lenis Smooth Scroll Engine Architecture Guide

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Directory:** `docs/lenis/` (mirrored at root `lenis/`)  
> **Subject:** Complete Reference Manual, Mathematical LERP Dynamics & Production Blueprints for Lenis Smooth Scroll  
> **Author:** Antigravity AI Engineering & Motion Architecture Team  

---

## 1. Executive Summary & Strategic Intent

**Lenis** (by darkroom.engineering, v1.3.26) is the foundational smooth scrolling engine for Traceon.

Unlike heavy, antiquated virtual scrolling libraries that hijack native DOM scroll and break browser accessibility, Lenis is **non-invasive**:
1. **Preserves Native Scroll APIs**: `window.scrollY`, `IntersectionObserver`, and browser back/forward history remain 100% functional.
2. **Mathematical Linear Interpolation (LERP)**: Converts stepped, jagged mouse wheel ticks into continuous, silky fluid curves.
3. **Single Shared RAF Clock**: Operates in exact lockstep with GSAP's ticker (`autoRaf: false`), ensuring that ScrollTrigger values never drift or lag behind the viewport.
4. **Strict Container Isolation (`data-lenis-prevent`)**: Graph canvases (`/graph/[repoId]`), code preview drawers, and 3D WebGL viewports can freely zoom and pan without triggering accidental page scrolls.
5. **Scroll Freezing (`lenis.stop()`)**: Instantly freezes virtual scrolling when the Command Omnibox (`Cmd+K`) or sidecars open without causing horizontal layout reflows.
6. **Built-in Accessibility (`respectReducedMotion: true`)**: Forces 1:1 input tracking for users with motion sensitivities.

---

## 2. Exhaustive Directory Architecture & Reference Map

```
docs/lenis/
├── README.md                                       # [THIS FILE] Master Overview & Architecture
├── 01-lenis-engine-math-and-config.md              # Mathematical LERP, Duration, Exponential Decays & Config
├── 02-gsap-raf-ticker-synchronization.md           # Single Clock Synchronization, autoRaf: false & lagSmoothing(0)
├── 03-scroll-isolation-and-data-lenis-prevent.md   # Wheel Event Isolation, Graph Canvases & CSS Traps
├── 04-nextjs-route-transitions-and-refresh.md      # Next.js 15 App Router Navigations & scrollTo API
├── 05-lenis-snap-and-cad-anchors.md                # CAD Panel Snapping, Velocity Thresholds & Snap Curves
├── 06-production-code-recipes.tsx                  # Drop-in SmoothScrollProvider, useLenis, & useScrollTo
├── 07-scroll-locking-and-modal-management.md       # Freezing Virtual Scroll (lenis.stop) for Omnibox & Modals
├── 08-reduced-motion-and-accessibility.md          # WCAG 2.2 AA Compliance, respectReducedMotion & 1:1 Tracking
├── 09-velocity-coupled-marquee-physics.md          # Velocity-Reactive StressTicker Math & Exponential Decay
└── 10-multi-instance-nested-scrolling.md           # Independent Nested Scrollers & overscroll Control
```

---

## 3. Technology Stack & Integration Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               LENIS SMOOTH SCROLL ARCHITECTURE                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │                      Next.js Root Layout (layout.tsx)                         │    │
│   └──────────────────────────────────────┬────────────────────────────────────────┘    │
│                                          │                                             │
│                                          ▼                                             │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │               <SmoothScrollProvider> (src/components/providers/)             │    │
│   │                  <ReactLenis root autoRaf={false} options={...}>              │    │
│   └──────────────────────────────────────┬────────────────────────────────────────┘    │
│                                          │                                             │
│                 ┌────────────────────────┴────────────────────────┐                    │
│                 │                                                 │                    │
│                 ▼                                                 ▼                    │
│   ┌───────────────────────────┐                     ┌───────────────────────────┐      │
│   │      GSAP RAF Ticker      │                     │     data-lenis-prevent    │      │
│   │  gsap.ticker.add((time)   │                     │ (Isolates ReactFlow Graph,│      │
│   │  lenis.raf(time * 1000)   │                     │  Three.js Canvas, Code)   │      │
│   └─────────────┬─────────────┘                     └───────────────────────────┘      │
│                 │                                                                      │
│                 ▼                                                                      │
│   ┌───────────────────────────┐                                                        │
│   │       ScrollTrigger       │                                                        │
│   │  (Zero Drift, Zero Lag)   │                                                        │
│   └───────────────────────────┘                                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Non-Negotiable Integration Rules:
1. **Never Allow Lenis to Run Autonomous RAF**: Always set `autoRaf: false` on `<ReactLenis>`. Allow the GSAP shared ticker to drive `lenis.raf(time * 1000)`.
2. **Never Enable Smooth Touch on Mobile**: Keep `smoothTouch: false`. Direct 1:1 touch manipulation is faster and prevents mobile latency.
3. **Always Add `data-lenis-prevent` to Interactive Containers**: Any element with internal scroll (code editors, terminal logs, graph canvases) must declare `data-lenis-prevent`.
4. **Always Refresh on Route Transitions**: Next.js App Router navigations must invoke `ScrollTrigger.refresh()`.
5. **Freeze on Modals**: Call `lenis.stop()` when opening `CommandOmnibox` or fullscreen drawers.

---

## 4. Quick-Start Reference Matrix

| Feature / Goal | Lenis API / Attribute | Target Implementation | Reference Document |
|:---|:---|:---|:---|
| **Root Provider Setup** | `<ReactLenis root autoRaf={false}>` | `SmoothScrollProvider.tsx` | [02-gsap-raf-ticker-synchronization.md](file:///C:/Rishabh/traceon/docs/lenis/02-gsap-raf-ticker-synchronization.md) |
| **Isolate Graph Canvas** | `data-lenis-prevent` | `src/app/graph/[repoId]/page.tsx` | [03-scroll-isolation-and-data-lenis-prevent.md](file:///C:/Rishabh/traceon/docs/lenis/03-scroll-isolation-and-data-lenis-prevent.md) |
| **Route Change Reset** | `lenis.scrollTo(0, { immediate: true })` | `useScrollTriggerRouteRefresh` | [04-nextjs-route-transitions-and-refresh.md](file:///C:/Rishabh/traceon/docs/lenis/04-nextjs-route-transitions-and-refresh.md) |
| **Read Scroll Velocity** | `lenis.on('scroll', ({ velocity }) => ...)` | `StressTicker.tsx` | [01-lenis-engine-math-and-config.md](file:///C:/Rishabh/traceon/docs/lenis/01-lenis-engine-math-and-config.md) |
| **Smooth Anchor Jump** | `lenis.scrollTo('#features', { offset: -64 })` | Omnibox & CTA buttons | [06-production-code-recipes.tsx](file:///C:/Rishabh/traceon/docs/lenis/06-production-code-recipes.tsx) |
| **Panel Snapping** | `lenis/snap` plugin | Pinned Architecture Journey | [05-lenis-snap-and-cad-anchors.md](file:///C:/Rishabh/traceon/docs/lenis/05-lenis-snap-and-cad-anchors.md) |
| **Scroll Freezing** | `lenis.stop()` / `lenis.start()` | `CommandOmnibox.tsx` | [07-scroll-locking-and-modal-management.md](file:///C:/Rishabh/traceon/docs/lenis/07-scroll-locking-and-modal-management.md) |
| **Reduced Motion** | `respectReducedMotion: true` | WCAG 2.2 AA Compliance | [08-reduced-motion-and-accessibility.md](file:///C:/Rishabh/traceon/docs/lenis/08-reduced-motion-and-accessibility.md) |
| **Velocity Marquee** | `velocity` boost + decay | `StressTicker.tsx` | [09-velocity-coupled-marquee-physics.md](file:///C:/Rishabh/traceon/docs/lenis/09-velocity-coupled-marquee-physics.md) |
| **Nested Scroller** | `ReactLenis` with `root={false}` | `NodeDetailSidecar.tsx` | [10-multi-instance-nested-scrolling.md](file:///C:/Rishabh/traceon/docs/lenis/10-multi-instance-nested-scrolling.md) |
