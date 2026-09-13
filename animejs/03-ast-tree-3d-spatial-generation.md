# 3D AST Spatial Generation & Catmull-Rom Spline Architecture

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/03-ast-tree-3d-spatial-generation.md`  
> **Target:** 3D Abstract Syntax Tree, Volumetric Constellations, and Cable Tension Routing  

---

## 1. The Principle of True 3D Spatial Topology

Most software visualizations flatten hierarchical codebases into 2D diagrams (boxes and arrows) enclosed in an HTML `<div>` or canvas card. 

Traceon builds an **authentic 3D Spatial AST Topology**:
1. **Volumetric Depth ($\mathbb{R}^3$)**: Nodes inhabit true 3D space with continuous $(x, y, z)$ coordinates. As the camera orbits, nodes occlude each other naturally, perspective foreshortening reveals depth, and parallax conveys dependency distances.
2. **Concentric Spherical Shells**: Hierarchical depth maps directly to radial distance $r$ from the central repository core:
   - $r = 0$: Repository Monolith Core (Dodecahedron).
   - $r = 6 - 8$: Primary Entrypoints & Core Architectural Interfaces.
   - $r = 12 - 16$: Business Logic Engines, Services, and State Stores.
   - $r = 20 - 24$: Transitive Leaf Utilities, Types, and Helper Modules.
3. **Catmull-Rom Tension Splines**: Dependency edges are rendered as smooth, tensioned 3D curves with physics-inspired slack and pulse propagation.

---

## 2. Spherical Fibonacci Coordinate Distribution

To evenly distribute $N$ orbital AST satellite nodes around a central core without polar clumping, we utilize the **Spherical Fibonacci Spiral Algorithm**:

For node index $i \in [0, N-1]$ on a sphere of radius $r$:

$$\phi = \arccos\left(1 - \frac{2(i + 0.5)}{N}\right)$$

$$\theta = \pi \cdot (1 + \sqrt{5}) \cdot i \quad (\text{where } \pi(1 + \sqrt{5}) \approx 10.166407 \text{ is the Golden Angle})$$

Converting spherical coordinates $(\phi, \theta, r)$ to Cartesian coordinates $(x, y, z)$:

$$x = r \cdot \sin(\phi) \cdot \cos(\theta)$$
$$y = r \cdot \cos(\phi)$$
$$z = r \cdot \sin(\phi) \cdot \sin(\theta)$$

```typescript
import * as THREE from 'three';

export function calculateFibonacciSpherePositions(
  count: number,
  radius: number
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

  for (let i = 0; i < count; i++) {
    // Height along Y-axis from 1 to -1
    const y = 1 - (i / (count - 1)) * 2;
    // Radius at height Y
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    positions.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return positions;
}
```

---

## 3. Catmull-Rom Tension Splines for Dependency Cables

Linear line segments (`THREE.LineSegments`) look rigid and artificial. Traceon models dependency connections as **curved tension cables** using `THREE.CatmullRomCurve3`.

Each cable has 3 or 4 control points:
1. **$P_0$**: Source node center position.
2. **$P_1$**: Intermediate arc point pushed outward along the radial normal vector to simulate centrifugal slack:
   $$\vec{P}_1 = \frac{\vec{P}_0 + \vec{P}_2}{2} + \vec{N}_{\text{arc}} \cdot \text{slack}$$
3. **$P_2$**: Target node center position.

```typescript
import * as THREE from 'three';

export function createTensionCable(
  start: THREE.Vector3,
  end: THREE.Vector3,
  slackFactor = 1.5
): { curve: THREE.CatmullRomCurve3; lineGeometry: THREE.BufferGeometry } {
  // Compute midpoint
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Compute outward normal vector from center (0,0,0) to midpoint
  const normal = mid.clone().normalize();
  mid.add(normal.multiplyScalar(slackFactor));

  // Build smooth cubic Catmull-Rom spline
  const curve = new THREE.CatmullRomCurve3([start, mid, end]);
  curve.curveType = 'centripetal'; // Prevents self-intersections and loops

  // Sample 50 points along the curve for rendering
  const points = curve.getPoints(50);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return { curve, lineGeometry };
}
```

---

## 4. Volumetric Staggered Blooming Animation

When the 3D AST visualization initializes, all nodes and splines must not abruptly pop into existence. They perform a **physical volumetric bloom**:

1. Core monolith appears with high-stiffness spring.
2. Satellite nodes burst outward from the singularity using radial distance staggering.
3. Tension cables draw themselves outward from parent to child.

```typescript
import { animate, createTimeline, stagger, createSpring } from 'animejs';
import * as THREE from 'three';
import 'animejs/adapters/three';

export function animateVolumetricTreeBloom(
  coreMesh: THREE.Object3D,
  satelliteMeshes: THREE.Object3D[],
  finalPositions: THREE.Vector3[]
) {
  const tl = createTimeline({
    defaults: { ease: 'out(3)' },
  });

  // 1. Core pop-in
  coreMesh.scale.set(0.001, 0.001, 0.001);
  tl.add(coreMesh, {
    scale: 1,
    duration: 800,
    ease: createSpring({ stiffness: 240, damping: 18 }),
  });

  // 2. Collapse satellites to center initially
  satelliteMeshes.forEach((mesh) => {
    mesh.position.set(0, 0, 0);
    mesh.scale.set(0.001, 0.001, 0.001);
  });

  // 3. Staggered radial explosion to final positions
  satelliteMeshes.forEach((mesh, index) => {
    const target = finalPositions[index];
    tl.add(
      mesh,
      {
        x: target.x,
        y: target.y,
        z: target.z,
        scale: 1,
        duration: 1000,
        ease: createSpring({ stiffness: 160, damping: 14 }),
      },
      `-=${800 - index * 40}` // Overlapping stagger
    );
  });

  return tl;
}
```

---

## 5. Dynamic Subtree Collapse & Expansion

Clicking an architectural node toggles the visibility of its downstream subtree. Rather than hiding children instantly (`visible = false`), Anime.js collapses the child nodes physically into the parent position:

```typescript
import { animate, createSpring } from 'animejs';
import * as THREE from 'three';
import 'animejs/adapters/three';

export function collapseSubtreeIntoParent(
  childNodes: THREE.Object3D[],
  parentPos: THREE.Vector3,
  onComplete?: () => void
) {
  return animate(childNodes, {
    x: parentPos.x,
    y: parentPos.y,
    z: parentPos.z,
    scale: 0.001,
    duration: 500,
    ease: createSpring({ stiffness: 220, damping: 18 }),
    onComplete,
  });
}
```
