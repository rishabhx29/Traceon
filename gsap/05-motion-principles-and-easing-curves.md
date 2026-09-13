# Motion Principles, Precision Easing & Ticker Calibration

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/05-motion-principles-and-easing-curves.md`  
> **Target:** Mathematical Easing Curves, Zero-Bounce Mandate, and Ticker Calibration  

---

## 1. The CAD Motion Manifesto

Traceon is a diagnostic instrument for software architecture. Every animation must communicate:
1. **Mechanical Precision**: Elements move with decisive momentum, zero looseness, and immediate responsiveness.
2. **Deterministic Weight**: Large structural panels (drawers, canvases) have more inertia than lightweight telemetry tags.
3. **Zero Cartoon Playfulness**: Rubbery bounces (`bounce.out`) and jelly-like elastic oscillations are strictly forbidden.

---

## 2. Mathematical Easing Curves

```
Normalized Value
   ▲
1.0│                         ┌──────────────── power3.out (Approved)
   │                    ┌────┘
   │                ┌───┘
   │            ┌───┘
   │         ┌──┘             ┌─────────────── linear (Banned)
   │       ┌─┘           ┌────┘
   │     ┌─┘        ┌────┘
   │   ┌─┘     ┌────┘
0.0└───┴───────┴──────────────┴───────────────► Normalized Time (0.0 to 1.0)
```

### Approved Curves:
1. **`power3.out` ($1 - (1 - t)^4$)**:
   - High initial velocity with exponential deceleration.
   - Ideal for: Drawer slides, modal presentations, and progressive disclosure cards.
2. **`power2.out` ($1 - (1 - t)^3$)**:
   - Balanced, natural deceleration curve.
   - Ideal for: Hover highlights, border color transitions, and tab switches.
3. **`expo.out` ($1 - 2^{-10t}$)**:
   - Razor-sharp stop.
   - Ideal for: Laser scanner line sweeps and high-velocity HUD reveals.
4. **`none` (Linear)**:
   - Permitted **only** on continuous ambient infinite tickers (`StressTicker.tsx`) or direct scroll-scrubbed timelines where the scroll wheel itself provides the curve.

---

## 3. The `lagSmoothing(0)` Ticker Optimization

By default, GSAP includes an internal lag smoothing mechanism (`lagSmoothing(500, 33)`). If a browser tab stutters or drops frames during heavy WebGL rendering, GSAP pauses time to prevent animations from jumping ahead violently.

### The Problem with Smooth Scrollers:
When paired with **Lenis**, default lag smoothing creates visual stuttering: when the user scrolls rapidly, GSAP interprets the burst as a lag spike, dampening the scroll progress artificially and creating noticeable rubber-banding.

### The Solution:
Disable lag smoothing in the root provider:
```typescript
// SmoothScrollProvider.tsx
gsap.ticker.lagSmoothing(0);
```
Setting `lagSmoothing(0)` ensures that GSAP computes exact mathematical coordinates matching the Lenis virtual scroll position without artificial latency.

---

## 4. Easing Selection Matrix for Traceon Components

| Component | Target Property | Duration | Easing Curve | Purpose |
|:---|:---|:---|:---|:---|
| `HUDNavbar` | `height`, `backdrop-blur` | `0.3s` | `power2.out` | Seamless compression on scroll |
| `CommandOmnibox` | `opacity`, `y: -10 -> 0` | `0.2s` | `power3.out` | Instant keyboard spotlight summon |
| `NodeDetailSidecar`| `x: 100% -> 0%` | `0.35s`| `power3.out` | Smooth mechanical drawer entry |
| `StressTicker` | `x: 0 -> -50%` | `30s` | `none` | Continuous linear open-source telemetry loop |
| `FeatureMatrix` | `scaleX` border draw | `0.8s` | `power2.inOut`| Architectural CAD drawing reveal |
| `CURISMRadar` | Polygon vertex expansion | `1.0s` | `power3.out` | Mathematical radar blossom |
