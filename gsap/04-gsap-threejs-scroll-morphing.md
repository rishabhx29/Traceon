# GSAP Driving Three.js 3D Morphing Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/gsap/04-gsap-threejs-scroll-morphing.md`  
> **Target:** Hero 3D Volumetric Code Nucleus 4-Stage Scroll Morphing Engine  

---

## 1. Concept: Scroll-Driven 4-Stage Spatial Morphing

The central 3D Code Nucleus does not remain static during page scroll. Instead, user scroll progress drives the physical transformation of the 3D scene graph across 4 distinct architectural states:

```
Scroll Range:   0% ──────────► 25% ──────────► 50% ──────────► 75% ──────────► 100%
Stage:          [1. MONOLITH]   [2. AST EXPLODED]   [3. BLAST SHOCKWAVE]   [4. DNA HELIX]
Geometry:       Dense Core      Satellites Float    Shockwave Ripples      Double Helix
Splines:        Contracted      Tension Cables      Vermilion Heated       CURISM Rungs
```

---

## 2. Mathematical State Mapping & Interval Normalization

Given global scroll progress $p \in [0, 1]$ provided by `ScrollTrigger.progress`:

To calculate local sub-progress $\tau_k \in [0, 1]$ within interval $[a, b]$:

$$\tau_k = \text{clamp}\left(\frac{p - a}{b - a}, 0.0, 1.0\right)$$

### Keyframe Interval Breakdown:
1. **Interval 1: Monolith $\to$ AST Exploded ($0.0 \to 0.33$)**:
   - Satellite radius expands: $r = r_{\text{min}} + (r_{\text{max}} - r_{\text{min}}) \cdot \tau_1$
   - Core wireframe opacity decreases: $\alpha = 0.9 - 0.5 \cdot \tau_1$
2. **Interval 2: AST Exploded $\to$ Blast Shockwave ($0.33 \to 0.66$)**:
   - Camera sweeps inward: $z_{\text{cam}} = 16 - 6 \cdot \tau_2$
   - Shader uniform `uRippleProgress` sweeps: $0.0 \to 1.0$
   - Dependent nodes heat up: `color` interpolates to `#FF3333`
3. **Interval 3: Blast Shockwave $\to$ DNA Double Helix ($0.66 \to 1.0$)**:
   - Satellite positions interpolate to double helix parametric equations:
     $$x = R \cos(\theta), \quad y = h \cdot (i - N/2), \quad z = R \sin(\theta)$$
     Where $\theta = 2\pi \cdot \text{turns} \cdot (i / N) + \text{strandPhase}$.

---

## 3. Reference Implementation: `useNucleusMorphing.ts`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MorphTargets {
  monolith: THREE.Vector3[];
  exploded: THREE.Vector3[];
  helix: THREE.Vector3[];
}

export function useNucleusMorphing(
  satelliteMeshes: THREE.Object3D[],
  targets: MorphTargets,
  shaderMaterial?: THREE.ShaderMaterial
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (satelliteMeshes.length === 0) return;

    // Timeline scrubbed directly to hero scroll section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-scroll-container',
        start: 'top top',
        end: '+=2500',
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;

          // Stage 1 -> 2: Monolith -> Exploded AST
          if (p <= 0.33) {
            const t = p / 0.33;
            satelliteMeshes.forEach((mesh, idx) => {
              const start = targets.monolith[idx] || new THREE.Vector3(0, 0, 0);
              const dest = targets.exploded[idx] || start;
              mesh.position.lerpVectors(start, dest, t);
            });
          }
          // Stage 2 -> 3: Exploded AST -> Blast Radius Shockwave
          else if (p > 0.33 && p <= 0.66) {
            const t = (p - 0.33) / 0.33;
            if (shaderMaterial && shaderMaterial.uniforms.uRippleProgress) {
              shaderMaterial.uniforms.uRippleProgress.value = t;
            }
          }
          // Stage 3 -> 4: Blast Radius -> DNA Double Helix
          else {
            const t = (p - 0.66) / 0.34;
            satelliteMeshes.forEach((mesh, idx) => {
              const start = targets.exploded[idx] || new THREE.Vector3(0, 0, 0);
              const dest = targets.helix[idx] || start;
              mesh.position.lerpVectors(start, dest, t);
            });
          }
        },
      },
    });

    triggerRef.current = tl.scrollTrigger || null;

    return () => {
      tl.kill();
      if (triggerRef.current) triggerRef.current.kill();
    };
  }, [satelliteMeshes, targets, shaderMaterial]);
}
```
