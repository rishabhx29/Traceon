# Spring Physics & 3D Force Dynamics Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/02-spring-physics-and-force-dynamics.md`  
> **Topic:** Mathematical Harmonic Oscillations, Force-Directed 3D Graph Equilibrium, and Spring Tuning  

---

## 1. Mathematical Foundation of Harmonic Oscillations

In Anime.js v4, spring motion is computed using the second-order differential equation for a **damped harmonic oscillator**:

$$m \frac{d^2 x}{dt^2} + c \frac{dx}{dt} + k (x - x_{\text{target}}) = 0$$

Where:
- $m$: **Mass** (inertia of the physical component, default $1.0$).
- $c$: **Damping coefficient** (frictional drag resisting motion).
- $k$: **Stiffness** (restoring force directed toward target equilibrium).

### Core Physical Parameters:
1. **Undamped Angular Frequency ($\omega_n$)**:
   $$\omega_n = \sqrt{\frac{k}{m}}$$
2. **Damping Ratio ($\zeta$)**:
   $$\zeta = \frac{c}{2 \sqrt{k \cdot m}}$$
3. **Settling Time ($t_s$)**:
   $$t_s \approx \frac{4}{\zeta \cdot \omega_n}$$

### The Three Damping Regimes:

```
Displacement
   ▲
1.4│     Underdamped (ζ = 0.3) ── Bouncy, playful, unscientific (REJECTED)
   │       /\
1.0│──────/──\─────/\─────────────────── Target Equilibrium (1.0)
   │     /    \   /  \
   │    /      \_/    \____  Precision Mechanical (ζ = 0.75 - 0.85) (APPROVED)
   │   /                   \________ Overdamped (ζ = 1.4) ── Sluggish, muddy (REJECTED)
0.0└──┴────────────────────────────────► Time (ms)
```

1. **Underdamped ($\zeta < 0.6$)**: The system overshoots and oscillates repeatedly. In design, this creates cartoonish, rubbery, "bouncy" animations that ruin industrial authority. **Strictly banned in Traceon.**
2. **Overdamped ($\zeta > 1.0$)**: The system creeps slowly toward target without any overshoot, feeling sluggish, muddy, and unresponsive.
3. **Precision Damped ($\zeta = 0.70 - 0.85$)**: The system reaches target quickly, exhibits a microscopic (1-3%) tactile overshoot that settles in under 200ms, conveying **dense, metallic mass and mechanical tension**.

---

## 2. Anime.js v4 Spring API Specifications

Anime.js v4 exposes the `createSpring` factory function:

```typescript
import { animate, createSpring } from 'animejs';

// Factory configuration:
const spring = createSpring({
  stiffness: 240, // Spring constant k (100 to 400)
  damping: 18,    // Friction coefficient c (8 to 30)
  mass: 1,        // Mass m (default 1)
  velocity: 0,    // Initial velocity impulse
});
```

### Pre-Calculated Spring Presets for Traceon:

| Preset Name | Stiffness ($k$) | Damping ($c$) | Mass ($m$) | Calculated $\zeta$ | Tactile Character & Usage |
|:---|:---|:---|:---|:---|:---|
| **Mechanical Actuator** | `280` | `18` | `1.0` | `0.54` | PopActuator tactile depression; instant click feedback |
| **AST Satellite Orbit** | `160` | `15` | `1.0` | `0.59` | Node hover magnification and coordinate tracking |
| **Blast Shockwave Return** | `120` | `12` | `1.0` | `0.55` | Node recovery after transitive deletion ripple |
| **Gyroscopic Core Tilt**| `180` | `20` | `1.0` | `0.75` | 3D Nucleus orientation tracking mouse coordinates |
| **Sidecar Spec Drawer** | `200` | `22` | `1.0` | `0.78` | Progressive disclosure CAD drawer slide |
| **Timeline Scrubber Snap** | `150` | `10` | `1.0` | `0.41` | Commit hash notch magnetic snap |

---

## 3. Force-Directed 3D Graph Physics

When generating a 3D Abstract Syntax Tree, static layouts feel artificial. Instead, initial node spatial coordinates are computed using a **3D Force-Directed Particle Simulation** combining Hooke's Law (edges) and Coulomb's Law (nodes):

### 1. Attractive Edge Tension (Hooke's Law)
For any two connected AST nodes $i$ and $j$ connected by a dependency cable:

$$\vec{F}_{\text{attract}}(i, j) = -k_{\text{edge}} \cdot (\|\vec{p}_i - \vec{p}_j\| - L_0) \cdot \frac{\vec{p}_i - \vec{p}_j}{\|\vec{p}_i - \vec{p}_j\|}$$

Where $L_0$ is the natural rest length of the dependency edge and $k_{\text{edge}}$ is the cable tension.

### 2. Repulsive Node Electrostatics (Coulomb's Law)
To prevent nodes from colliding or clumping, every node exerts an inverse-square repulsive force on all other nodes:

$$\vec{F}_{\text{repulse}}(i, j) = \frac{k_{\text{repulse}}}{\|\vec{p}_i - \vec{p}_j\|^2 + \epsilon} \cdot \frac{\vec{p}_i - \vec{p}_j}{\|\vec{p}_i - \vec{p}_j\|}$$

Where $\epsilon$ is a softening factor preventing infinite acceleration at close distances.

### 3. Central Gravitational Centering
To keep the entire AST tree centered around the primary root node:

$$\vec{F}_{\text{center}}(i) = -k_{\text{gravity}} \cdot \vec{p}_i$$

---

## 4. Physics Simulation Implementation Script

The following utility runs a rapid numerical simulation (Euler or Velocity-Verlet) over 120 steps to compute equilibrium coordinates, which are then passed to Anime.js for smooth visual morphing:

```typescript
import * as THREE from 'three';

export interface GraphNode {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  restLength: number;
}

export function compute3DGraphEquilibrium(
  nodes: GraphNode[],
  edges: GraphEdge[],
  iterations = 120
): Map<string, THREE.Vector3> {
  const nodeMap = new Map<string, GraphNode>(nodes.map((n) => [n.id, n]));
  const kEdge = 0.04;
  const kRepulse = 180.0;
  const kCenter = 0.01;
  const damping = 0.88;
  const dt = 0.5;

  for (let iter = 0; iter < iterations; iter++) {
    // 1. Repulsive forces between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nA = nodes[i];
        const nB = nodes[j];
        const delta = new THREE.Vector3().subVectors(nA.position, nB.position);
        const distSq = delta.lengthSq() + 0.1;
        const dist = Math.sqrt(distSq);

        const forceMagnitude = kRepulse / distSq;
        const force = delta.normalize().multiplyScalar(forceMagnitude);

        nA.velocity.add(force.clone().divideScalar(nA.mass).multiplyScalar(dt));
        nB.velocity.sub(force.divideScalar(nB.mass).multiplyScalar(dt));
      }
    }

    // 2. Attractive forces along dependency edges
    for (const edge of edges) {
      const nSource = nodeMap.get(edge.source);
      const nTarget = nodeMap.get(edge.target);
      if (!nSource || !nTarget) continue;

      const delta = new THREE.Vector3().subVectors(nTarget.position, nSource.position);
      const currentDist = delta.length();
      const displacement = currentDist - edge.restLength;
      const forceMagnitude = kEdge * displacement;
      const force = delta.normalize().multiplyScalar(forceMagnitude);

      nSource.velocity.add(force.clone().divideScalar(nSource.mass).multiplyScalar(dt));
      nTarget.velocity.sub(force.divideScalar(nTarget.mass).multiplyScalar(dt));
    }

    // 3. Central gravity & velocity update
    for (const node of nodes) {
      const centerForce = node.position.clone().multiplyScalar(-kCenter);
      node.velocity.add(centerForce.multiplyScalar(dt));
      node.velocity.multiplyScalar(damping); // Friction damping
      node.position.add(node.velocity.clone().multiplyScalar(dt));
    }
  }

  return new Map(nodes.map((n) => [n.id, n.position.clone()]));
}
```

---

## 5. Integrating Spring Physics into Three.js with Anime.js

Once equilibrium coordinates or hover targets are defined, Anime.js drives the visual position using `createSpring`:

```typescript
import { animate, createSpring } from 'animejs';
import * as THREE from 'three';
import 'animejs/adapters/three';

export function animateNodeToTarget(
  nodeMesh: THREE.Object3D,
  targetPos: THREE.Vector3
) {
  return animate(nodeMesh, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 1000,
    ease: createSpring({
      stiffness: 180,
      damping: 16,
      mass: 1,
    }),
  });
}
```
