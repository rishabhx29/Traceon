# GSAP 3.15 & Motion Architecture Guide

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Directory:** `docs/gsap/` (mirrored at root `gsap/`)  
> **Subject:** Complete Reference Manual, Motion Principles & Production Blueprints for GSAP and ScrollTrigger  
> **Author:** Antigravity AI Engineering & Motion Architecture Team  

---

## 1. Executive Summary & Strategic Role

GreenSock Animation Platform (**GSAP v3.15.0**) and its companion package (`@gsap/react`) serve as the primary **scroll-driven orchestration engine** across Traceon.

While **Anime.js v4** handles high-frequency micro-interactions, spring physics, and 3D object/shader properties, **GSAP** controls:
1. **Scroll-Scrubbed Choreographies**: Synchronizing page scroll position directly with multi-stage animations using `ScrollTrigger` with exact numerical scrubbing (`scrub: 1.2`).
2. **Pinned Horizontal Journey**: Pinned horizontal section traversal (`ArchitectureJourney.tsx`) spanning 4 viewport widths with nested `containerAnimation`.
3. **HUD Navigation Compression**: Compressing `HUDNavbar.tsx` from 64px to 48px on scroll with backdrop blur and border transitions.
4. **3D Scene Morphing Driver**: Feeding scroll progress into the Three.js Volumetric Code Nucleus to morph between Monolith, AST Exploded View, Shockwave, and DNA Double Helix.
5. **Timeline Sequencing**: Complex multi-element choreographies with label anchors, timeline relative offsets (`"-=0.4"`), and deterministic reversibility.
6. **Layout State Morphing**: Seamlessly reflowing cards and panels between grid and fullscreen using `Flip`.
7. **Multi-Input Gesture Normalization**: Capturing pointer drag and wheel ticks for scrubbers and carousels using `Observer`.

---

## 2. Directory Architecture & Reference Map

```
docs/gsap/
├── README.md                                       # [THIS FILE] Master Overview & Architecture
├── 01-scrolltrigger-deep-dive.md                   # ScrollTrigger Config, Scrubbing, Pinning & MatchMedia
├── 02-gsap-react-lifecycle-usegsap.md              # React 19 / Next.js Lifecycle, useGSAP Hook & Cleanup
├── 03-pinned-horizontal-architecture-journey.md    # 4-Stage Horizontal Journey with containerAnimation
├── 04-gsap-threejs-scroll-morphing.md              # Driving Three.js 3D Morphing from Vertical Scroll Scrub
├── 05-motion-principles-and-easing-curves.md       # Precision Easing Curves, Lag Smoothing & Frame Budget
├── 06-production-code-recipes.ts                   # Drop-in TypeScript Utilities, Hooks & Component Templates
├── 07-gsap-flip-layout-morphing.md                 # State Transitions, Card Expansion & Layout Morphing
├── 08-gsap-observer-and-gesture-physics.md         # Multi-Input Gestures, Commit Scrubbers & Swipes
├── 09-svg-path-drawing-and-blueprint-draw.md       # Pure SVG Path Drawing, Radar Blossoms & Hairline Grids
└── 10-kinetic-typography-and-scramble-text.md      # Technical Ciphers, Telemetry Scrambling & Variable Type
```

---

## 3. Technology Stack & Integration Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             GSAP SCROLL ORCHESTRATION ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │                      Lenis Virtual Smooth Scroller (RAF Master)               │    │
│   └──────────────────────────────────────┬────────────────────────────────────────┘    │
│                                          │ time * 1000                                 │
│                                          ▼                                             │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │                        GSAP Shared Ticker (lagSmoothing: 0)                   │    │
│   └──────┬───────────────────────────────┬───────────────────────────────┬────────┘    │
│          │                               │                               │             │
│          ▼                               ▼                               ▼             │
│   ┌───────────────┐               ┌───────────────┐               ┌───────────────┐    │
│   │ ScrollTrigger │               │  useGSAP()    │               │ Three.js 3D   │    │
│   │ (Pin, Scrub,  │               │ (Scoped DOM   │               │ Nucleus Scene │    │
│   │  Horizontal)  │               │  Timelines)   │               │ (Morphing)    │    │
│   └───────────────┘               └───────────────┘               └───────────────┘    │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Critical Architectural Mandates:
1. **Always Use `useGSAP()` with Scope**: Never call `gsap.to()` inside bare `useEffect()` hooks. Use `useGSAP(() => {}, { scope: containerRef })` to guarantee automatic garbage collection.
2. **Deterministic Numerical Scrubbing**: Always use numeric scrub (e.g. `scrub: 1.2`). Never use boolean `scrub: true`.
3. **ScrollTrigger.refresh() on Next.js Route Navigation**: Always refresh on pathname changes via `usePathname()`.
4. **Strict Zero AI Slop Aesthetics**: Use `power2.out`, `power3.out`, or `expo.out`. Cartoon bounces are strictly banned.

---

## 4. Quick-Start Reference Matrix

| Feature / Objective | GSAP API / Tool | Implementation Target | Reference Document |
|:---|:---|:---|:---|
| **Pinned Horizontal Section** | `pin: true`, `containerAnimation`, `xPercent` | `ArchitectureJourney.tsx` | [03-pinned-horizontal-architecture-journey.md](file:///C:/Rishabh/traceon/docs/gsap/03-pinned-horizontal-architecture-journey.md) |
| **Navbar Height Compression** | `ScrollTrigger.create({ onUpdate })` | `HUDNavbar.tsx` | [01-scrolltrigger-deep-dive.md](file:///C:/Rishabh/traceon/docs/gsap/01-scrolltrigger-deep-dive.md) |
| **React Scope Lifecycle** | `useGSAP(() => {}, { scope })` | All React UI Components | [02-gsap-react-lifecycle-usegsap.md](file:///C:/Rishabh/traceon/docs/gsap/02-gsap-react-lifecycle-usegsap.md) |
| **3D Mesh Scroll Scrub** | `ScrollTrigger({ scrub: 1.2 })` driving R3F | `CodeNucleus.tsx` | [04-gsap-threejs-scroll-morphing.md](file:///C:/Rishabh/traceon/docs/gsap/04-gsap-threejs-scroll-morphing.md) |
| **Layout State Morphing** | `Flip.getState()`, `Flip.from()` | Card expand & Lens switch | [07-gsap-flip-layout-morphing.md](file:///C:/Rishabh/traceon/docs/gsap/07-gsap-flip-layout-morphing.md) |
| **Gesture & Wheel Control** | `Observer.create({ type: 'wheel,touch' })` | `CommitScrubber.tsx` | [08-gsap-observer-and-gesture-physics.md](file:///C:/Rishabh/traceon/docs/gsap/08-gsap-observer-and-gesture-physics.md) |
| **SVG Hairline Drawing** | `strokeDashoffset: 1 -> 0` | `CURISMRadar.tsx` | [09-svg-path-drawing-and-blueprint-draw.md](file:///C:/Rishabh/traceon/docs/gsap/09-svg-path-drawing-and-blueprint-draw.md) |
| **Telemetry Decryption** | Scramble cipher engine | Commit hashes & scores | [10-kinetic-typography-and-scramble-text.md](file:///C:/Rishabh/traceon/docs/gsap/10-kinetic-typography-and-scramble-text.md) |
