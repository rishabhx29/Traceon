# Lenis Engine Mathematics, Configuration & Telemetry Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/01-lenis-engine-math-and-config.md`  
> **Target:** Virtual Scroll Mechanics, LERP Mathematics, and Velocity-Reactive Telemetry  

---

## 1. Mathematical Foundation of Virtual Smooth Scrolling

Native browser scrolling jumps in discrete steps (typically 100px to 120px per wheel notch). Lenis intercepts wheel input and computes a continuous, differentiable trajectory.

### The LERP (Linear Interpolation) Equation:
In Lerp mode, the current scroll position $y_t$ approaches the target position $y_{\text{target}}$ each frame according to:

$$y_{t+1} = y_t + (y_{\text{target}} - y_t) \cdot \lambda$$

Where $\lambda \in (0, 1)$ is the interpolation factor (typically $\lambda = 0.08$):
- At $\lambda = 0.08$, the viewport closes $8\%$ of the remaining distance on every 16.6ms frame.
- As $y_t \to y_{\text{target}}$, velocity decays exponentially, creating a smooth mechanical stop without sudden deceleration shocks.

### The Duration & Exponential Decay Mode:
When using `duration` mode (e.g. `duration: 1.2`), Lenis evaluates the exponential easing function:

$$E(t) = \min\left(1.0, 1.001 - 2^{-10t}\right) \quad \text{for } t \in [0, 1]$$

This produces an instant initial response followed by a long, silky tail.

---

## 2. Master Configuration Object

```typescript
export const TRACEON_LENIS_OPTIONS = {
  autoRaf: false,              // Mandatory: Driven exclusively by GSAP shared ticker
  duration: 1.2,               // 1.2s smooth deceleration
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,           // Smooth wheel ticks
  touchMultiplier: 2.0,        // 1:1 responsive touch
  wheelMultiplier: 1.0,        // Standard wheel sensitivity
  infinite: false,             // Strict bound scrolling
};
```

---

## 3. Real-Time Telemetry & Velocity Coupling

Lenis emits a high-frequency `scroll` event containing critical telemetry metrics:

```typescript
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  // scroll: Current scroll position in pixels (float)
  // limit: Maximum scroll height (document.body.scrollHeight - window.innerHeight)
  // velocity: Current velocity in pixels/ms (signed: positive down, negative up)
  // direction: 1 (scrolling down), -1 (scrolling up), 0 (stationary)
  // progress: Normalized scroll position from 0.0 to 1.0
});
```

### Velocity-Reactive Components in Traceon:
1. **Live Architectural Stress Ticker (`StressTicker.tsx`)**:
   - The marquee scroll speed dynamically accelerates proportionally to `Math.abs(velocity)`:
     $$\text{Speed}_{\text{ticker}} = \text{BaseSpeed} \cdot (1 + \min(5.0, |\text{velocity}| \cdot 0.4))$$
   - When the user scrolls fast, the ticker races ahead; when the user stops, it smoothly decelerates back to base velocity.
2. **HUD Navbar Collapse**:
   - Compresses when `scroll > 40` and `direction === 1` (user scrolling down into content).
