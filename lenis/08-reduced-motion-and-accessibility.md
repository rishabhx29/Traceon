# Reduced Motion & Accessibility Compliance Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/08-reduced-motion-and-accessibility.md`  
> **Target:** WCAG 2.2 AA Compliance, prefers-reduced-motion, and 1:1 Input Tracking  

---

## 1. Accessibility Mandate: Vestibular Disorders & Motion Sensitivity

Smooth scrolling and inertial momentum can cause nausea, dizziness, and vestibular disorientation in users with motion sensitivities. 

WCAG 2.2 Success Criterion **2.3.3 (Animation from Interactions)** requires that motion triggered by user interaction can be disabled unless the animation is essential.

---

## 2. Lenis `respectReducedMotion` Option

Lenis v1.3 includes built-in support for the browser's `prefers-reduced-motion` media query:

```typescript
// SmoothScrollProvider.tsx
<ReactLenis
  root
  options={{
    autoRaf: false,
    duration: 1.2,
    respectReducedMotion: true, // Automatically enforces 1:1 input tracking!
  }}
>
```

### What Happens When Reduced Motion is Active:
1. **LERP Forced to 1.0**: Interpolation dampening is disabled. The scroll position follows mouse wheel ticks and touch input directly with zero artificial lag or inertial tail.
2. **Instant Programmatic Scroll**: Any call to `lenis.scrollTo('#section')` jumps immediately without animating over 1.2 seconds.
3. **No Coordinate Breakage**: Scroll coordinates still compute properly, so layout and sticky elements function normally without JavaScript errors.

---

## 3. Accompanying Global CSS Override

In `src/app/globals.css`, we pair Lenis's reduced motion mode with instant CSS transitions:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
