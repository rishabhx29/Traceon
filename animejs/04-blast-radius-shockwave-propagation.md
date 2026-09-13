# Blast Radius Shockwave Propagation & Vertex Shader Dynamics

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/04-blast-radius-shockwave-propagation.md`  
> **Target:** 3D Blast Radius Simulations, Spherical Wavefronts, and GLSL Ripple Shaders  

---

## 1. Physical Concept of 3D Blast Radius Propagation

When an engineer deletes, refactors, or mutates a foundational code module, downstream files break in cascading failure cascades. 

In Traceon, the **Blast Radius Simulation** is modeled as a **physical spherical shockwave propagating through the 3D AST constellation**:
1. **Epicenter Selection**: The user selects or clicks an AST node in 3D space as the epicenter $\vec{P}_{\text{epicenter}}$.
2. **Radial Shockwave Burst**: An initial high-frequency displacement wave ripples across the central dodecahedron mesh surface.
3. **Graph Topological Cascade**: The shockwave travels along the Catmull-Rom dependency splines to all transitive dependents, computed layer-by-layer using Breadth-First Search (BFS).
4. **Thermal Excitation & Recovery**: Affected nodes heat up from cold steel/emerald to warning amber (`#FFB000`) and laser vermilion (`#FF3333`), undergo physical spring vibration, and gradually cool or settle into an alert state.

---

## 2. Mathematical Wave Equation in 3D Space

The physical displacement $D(r, t)$ at Euclidean distance $r = \|\vec{P}_{\text{node}} - \vec{P}_{\text{epicenter}}\|$ and elapsed time $t$ follows a spherical damped traveling wave:

$$D(r, t) = \frac{A_0}{1 + \alpha r} \cdot \sin(k \cdot r - \omega \cdot t) \cdot e^{-\gamma (t - r / v)^2}$$

Where:
- $A_0$: Initial shockwave impulse amplitude.
- $\alpha$: Geometric dispersion coefficient (energy dissipates with distance).
- $v$: Wave propagation velocity through the code graph ($v = \omega / k$).
- $\gamma$: Wave packet width / temporal decay rate.

```
Displacement
   ▲
   │        Spherical Wavefront traveling outward at velocity v
   │                /\
   │               /  \
   │              /    \
   │    _________/      \__________
───┴───────────────────────────────► Distance r from Epicenter
```

---

## 3. GLSL Vertex Displacement Ripple Shader

The central mesh uses a custom vertex shader that displaces vertices along their normal vectors based on shockwave parameters fed from Anime.js:

```glsl
// rippleShader.vert
uniform float uTime;
uniform float uRippleProgress; // 0.0 -> 1.0 (animated via Anime.js)
uniform vec3 uEpicenter;      // Coordinates of shockwave origin
uniform float uWaveFrequency;
uniform float uWaveAmplitude;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  vNormal = normal;
  vPosition = position;

  // Calculate distance from shockwave epicenter
  float dist = distance(position, uEpicenter);

  // Calculate wave propagation radius
  float waveFront = uRippleProgress * 25.0;
  float waveDelta = abs(dist - waveFront);

  // Gaussian wave packet envelope
  float envelope = exp(-pow(waveDelta / 2.0, 2.0));

  // Sinusoidal displacement along surface normal
  float displacement = sin(dist * uWaveFrequency - uTime * 6.0) * uWaveAmplitude * envelope * (1.0 - uRippleProgress);

  vDisplacement = displacement;

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### Accompanying Fragment Shader:
```glsl
// rippleShader.frag
uniform vec3 uBaseColor;      // #0A0A0C
uniform vec3 uShockColor;     // #FF3333 (Laser Vermilion)
varying float vDisplacement;

void main() {
  // Blend between base obsidian and incandescent vermilion based on displacement
  float heat = clamp(abs(vDisplacement) * 4.0, 0.0, 1.0);
  vec3 finalColor = mix(uBaseColor, uShockColor, heat);

  gl_FragColor = vec4(finalColor, 1.0);
}
```

---

## 4. Anime.js Topological Shockwave Choreography

To coordinate the physical wave across satellite nodes, Anime.js computes the topological dependency depth of each node and sequences their reactions using `stagger`:

```typescript
import { animate, createTimeline, stagger, createSpring } from 'animejs';
import * as THREE from 'three';
import 'animejs/adapters/three';

export interface TopologicalNode {
  id: string;
  mesh: THREE.Object3D;
  depthFromEpicenter: number; // BFS distance (0 = epicenter, 1 = direct caller, 2 = transitive)
}

export function triggerTopologicalBlastWave(
  epicenterMesh: THREE.Object3D,
  dependentNodes: TopologicalNode[],
  shaderMaterial?: THREE.ShaderMaterial
) {
  const tl = createTimeline();

  // 1. Epicenter high-frequency shock impulse
  tl.add(epicenterMesh, {
    scale: [1, 1.4, 0.9, 1.1, 1],
    duration: 600,
    ease: createSpring({ stiffness: 320, damping: 14 }),
  });

  // 2. Animate shader ripple if present
  if (shaderMaterial && shaderMaterial.uniforms.uRippleProgress) {
    tl.add(
      shaderMaterial.uniforms.uRippleProgress,
      {
        value: [0, 1],
        duration: 1200,
        ease: 'out(3)',
      },
      '-=500'
    );
  }

  // 3. Sort dependent nodes by topological BFS depth
  const sorted = [...dependentNodes].sort((a, b) => a.depthFromEpicenter - b.depthFromEpicenter);

  // Group nodes by depth layers
  const maxDepth = Math.max(...sorted.map((n) => n.depthFromEpicenter), 1);

  for (let d = 1; d <= maxDepth; d++) {
    const layerNodes = sorted.filter((n) => n.depthFromEpicenter === d).map((n) => n.mesh);
    if (layerNodes.length === 0) continue;

    // Layer reaction: displacement push along radial vector + heat color change
    tl.add(
      layerNodes,
      {
        scale: [1, 1.25, 0.95, 1],
        duration: 800,
        delay: stagger(40), // Stagger within the same layer
        ease: createSpring({ stiffness: 220, damping: 14 }),
      },
      `-=${700 - d * 150}` // Delay between topological depth layers
    );
  }

  return tl;
}
```

---

## 5. Visual Summary of Blast Radius States

| Phase | Duration | Node Behavior | Color Palette |
|:---|:---|:---|:---|
| **0ms (Detonation)** | 0 - 80ms | Epicenter compresses and snaps outward | Titanium Stark `#FFFFFF` flash |
| **100 - 400ms (Radial Wave)** | 100 - 400ms | Surface displacement ripples; Level 1 callers react | Laser Vermilion `#FF3333` |
| **400 - 900ms (Transitive)** | 400 - 900ms | Deep callers displaced; warning tension along splines | Cadmium Amber `#F59E0B` |
| **900 - 1500ms (Settling)** | 900 - 1500ms | Spring harmonic oscillation dampens to equilibrium | Persistent Alert Vermilion badge |
