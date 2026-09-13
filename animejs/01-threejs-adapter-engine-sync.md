# Anime.js v4 Three.js Adapter & Engine Synchronization Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/01-threejs-adapter-engine-sync.md`  
> **Target:** 3D Volumetric Code Nucleus, AST Spatial Constellations, and R3F Render Loops  

---

## 1. Overview of the Anime.js v4 Three.js Adapter

Anime.js v4 introduces a native, built-in **Three.js Adapter** located at `animejs/dist/modules/adapters/three` (or accessible via `import 'animejs/adapters/three'`).

Instead of writing verbose manual tween handlers that mutate `mesh.position.x += dx` inside requestAnimationFrame, the adapter registers Three.js `Object3D`, `Material`, `Light`, `Camera`, and `InstancedMesh` directly into Anime.js's property resolver pipeline.

### Supported Properties Out of the Box:

| Flat Property | Target Three.js Field | Unit / Conversion |
|:---|:---|:---|
| `x`, `y`, `z` | `target.position.x`, `target.position.y`, `target.position.z` | World units (meters/floats) |
| `rotateX`, `rotateY`, `rotateZ` | `target.rotation.x`, `target.rotation.y`, `target.rotation.z` | **Degrees** (automatically converted to radians by the adapter) |
| `scale` | `target.scale.set(val, val, val)` | Uniform scaling multiplier |
| `scaleX`, `scaleY`, `scaleZ` | `target.scale.x`, `target.scale.y`, `target.scale.z` | Axis-specific scale |
| `opacity` | `target.material.opacity` (or fallback symbol for Groups) | `0.0` to `1.0` (auto toggles `target.visible`) |
| `color` | `target.material.color` or `target.color` (Lights) | Hex string (`#FFB000`), RGB, or `THREE.Color` |
| `roughness`, `metalness` | `target.material.roughness`, `target.material.metalness` | `0.0` to `1.0` |
| `skewX`, `skewY`, `skewZ` | Custom `updateMatrix` patch installed on `target` | Angles in degrees |

---

## 2. Engine Frame Synchronization: The Single RAF Rule

### The Danger of Independent Loops:
By default, Anime.js runs its own internal `requestAnimationFrame` ticker (`engine.useDefaultMainLoop = true`). If Three.js runs its own rendering loop (via `renderer.setAnimationLoop` or React Three Fiber's `useFrame`), two independent tickers fire out-of-phase:
1. **Frame Tearing & Jitter**: Anime.js updates object positions at timestamp $T_1$, but Three.js renders at $T_2$, resulting in micro-stuttering on 120Hz/144Hz ProMotion displays.
2. **Wasteful VRAM Consumption**: When the Three.js canvas is scrolled out of view or tabbed away, Anime.js continues firing RAF events, wasting battery and CPU.

### The Solution: Manual Engine Update:
Disable the default loop and manually invoke `engine.update()` from within the Three.js render loop.

```typescript
import { engine, animate } from 'animejs';
import * as THREE from 'three';
import 'animejs/adapters/three';

// STEP 1: Disable Anime.js internal RAF
engine.useDefaultMainLoop = false;

// STEP 2: Setup Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// STEP 3: Single synchronized render loop
renderer.setAnimationLoop((time) => {
  // Update all Anime.js tweens, springs, and timelines exactly once per frame
  engine.update();

  // Render scene graph to WebGL framebuffer
  renderer.render(scene, camera);
});
```

### React Three Fiber (R3F) Integration Pattern:
In React Three Fiber, the canvas manages its own render loop. Use a child component with `useFrame`:

```tsx
'use client';

import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { engine } from 'animejs';
import 'animejs/adapters/three';

export function AnimeEngineSync() {
  useEffect(() => {
    // Disable default loop when mounting R3F canvas
    engine.useDefaultMainLoop = false;

    return () => {
      // Restore default loop if canvas unmounts
      engine.useDefaultMainLoop = true;
    };
  }, []);

  useFrame(() => {
    // Synchronize Anime.js engine ticks to R3F frame clock
    engine.update();
  });

  return null;
}
```

---

## 3. High-Performance InstancedMesh Animation

When rendering an Abstract Syntax Tree with thousands of nodes, creating individual `THREE.Mesh` objects causes massive draw-call overhead. 

`THREE.InstancedMesh` renders thousands of identical geometries in a single GPU draw call. Anime.js v4 provides `getInstances` and `commitChanges` to animate individual instances seamlessly:

```typescript
import * as THREE from 'three';
import { animate, createTimeline, stagger } from 'animejs';
import { getInstances, commitChanges } from 'animejs/adapters/three';

export function createAnimatedInstancedTree(
  nodeCount: number,
  geometry: THREE.BufferGeometry,
  material: THREE.Material
) {
  const instancedMesh = new THREE.InstancedMesh(geometry, material, nodeCount);

  // 1. Get proxy instances from Anime.js adapter
  const instances = getInstances(instancedMesh);

  // 2. Initialize instance positions in spherical or hierarchical coordinates
  instances.forEach((instance, index) => {
    const phi = Math.acos(-1 + (2 * index) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;
    const radius = 12 + Math.random() * 4;

    instance.x = radius * Math.cos(theta) * Math.sin(phi);
    instance.y = radius * Math.sin(theta) * Math.sin(phi);
    instance.z = radius * Math.cos(phi);
    instance.scale = 0.01; // Start collapsed
  });

  // Commit initial matrix buffer to GPU
  commitChanges(instancedMesh);

  // 3. Staggered volumetric bloom animation
  animate(instances, {
    scale: 1,
    duration: 1200,
    delay: stagger(15, { from: 'center' }),
    ease: 'out(3)',
    onUpdate: () => {
      // Crucial: update instance matrix buffer on every tween frame
      commitChanges(instancedMesh);
    },
  });

  return instancedMesh;
}
```

---

## 4. Animating Custom Shader Uniforms

Anime.js v4 can animate custom GLSL uniform values in `THREE.ShaderMaterial` or `THREE.RawShaderMaterial`.

```typescript
import * as THREE from 'three';
import { animate } from 'animejs';

export function animateShockwaveRipple(
  material: THREE.ShaderMaterial,
  duration = 1400
) {
  // Direct tween on uniform float value
  return animate(material.uniforms.uRippleProgress, {
    value: [0, 1],
    duration: duration,
    ease: 'out(4)',
    onUpdate: () => {
      material.uniformsNeedUpdate = true;
    },
  });
}
```

---

## 5. Summary of Best Practices for Phase Build
1. Always import `'animejs/adapters/three'` at the top of 3D component files.
2. In React components, ensure `engine.useDefaultMainLoop = false` inside `useEffect`.
3. Animate angles directly in degrees using `rotateX`, `rotateY`, `rotateZ`.
4. For single node hover/click, animate `mesh.scale` and `mesh.material.color`.
5. For large AST graphs (>100 nodes), use `THREE.InstancedMesh` with `getInstances(mesh)` and `commitChanges(mesh)`.
