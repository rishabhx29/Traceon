# Velocity-Coupled Marquee Physics Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/lenis/09-velocity-coupled-marquee-physics.md`  
> **Target:** Live Open-Source Stress Ticker (`StressTicker.tsx`) Velocity Reactive Math  

---

## 1. Architectural Concept

A static infinite ticker scrolling at constant speed feels generic. 
In Traceon, the **Live Architectural Stress Ticker** (`StressTicker.tsx`) responds dynamically to the user's scrolling velocity:
- When the user is stationary, the ticker glides slowly at base speed ($1.0\times$).
- When the user scrolls vigorously, the ticker accelerates up to $4.5\times$ speed in sympathy with the scroll stream.
- When the user stops scrolling, the ticker smoothly decelerates back to base speed over an exponential relaxation curve.

---

## 2. Mathematical Velocity Coupling & Relaxation Equations

Let $v_t$ be the instantaneous scroll velocity reported by `lenis.velocity` (pixels per millisecond).

### 1. Velocity Boost Calculation:
$$\text{Target Speed Factor } F_{\text{target}} = 1.0 + \text{clamp}(|v_t| \cdot 0.35, 0.0, 3.5)$$

### 2. Exponential Relaxation (Decay):
On each animation frame, the current speed factor $F_t$ interpolates toward $F_{\text{target}}$:

$$F_{t+1} = F_t + (F_{\text{target}} - F_t) \cdot \lambda_{\text{decay}}$$

Where $\lambda_{\text{decay}} = 0.06$ provides a silky 500ms smooth return to base speed when scrolling halts.

---

## 3. Drop-in React Hook: `useVelocityMarquee`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

export function useVelocityMarquee(trackRef: React.RefObject<HTMLElement | null>, baseSpeed = 1.0) {
  const currentOffset = useRef(0);
  const currentSpeedMultiplier = useRef(1.0);
  const targetSpeedMultiplier = useRef(1.0);

  // Read instantaneous scroll velocity from Lenis
  useLenis(({ velocity }) => {
    const boost = Math.min(3.5, Math.abs(velocity) * 0.35);
    targetSpeedMultiplier.current = 1.0 + boost;
  });

  useEffect(() => {
    let animId: number;

    function tick() {
      // Exponential decay toward target multiplier
      currentSpeedMultiplier.current +=
        (targetSpeedMultiplier.current - currentSpeedMultiplier.current) * 0.06;

      // When user stops, target multiplier slowly returns to 1.0
      targetSpeedMultiplier.current += (1.0 - targetSpeedMultiplier.current) * 0.03;

      // Advance marquee position
      currentOffset.current -= baseSpeed * currentSpeedMultiplier.current;

      // Wrap around seamlessly at -50% (assuming content is duplicated)
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentOffset.current % 50}%, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [trackRef, baseSpeed]);
}
```
