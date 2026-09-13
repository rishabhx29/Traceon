# Raycasting, 3D Billboards & Spatial Telemetry Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/05-raycasting-and-spatial-telemetry.md`  
> **Target:** 3D Interaction, Cursor Magnetic Attraction, and Drei Billboard Data HUDs  

---

## 1. Overview of 3D Interaction Architecture

Interacting with an Abstract Syntax Tree in 3D requires continuous coordination between 2D screen pointer coordinates and 3D Euclidean space.

In Traceon, interactivity encompasses:
1. **Raycaster Proximity Detection**: Continuous casting of rays from the camera through Normalized Device Coordinates (NDC) to identify hovered and clicked AST nodes.
2. **Magnetic Cursor Attraction**: Nodes within a proximity threshold $\delta < 4.0$ units undergo subtle spring-driven attraction toward the cursor ray, providing physical "stickiness".
3. **Gyroscopic Camera / Core Tilt**: Subtle cursor parallax rotates the entire 3D nucleus, communicating physical depth without disorienting the user.
4. **3D Billboard HTML Data HUDs**: High-density CAD telemetry cards rendered via `@react-three/drei`'s `<Html>` component, pinned to 3D world coordinates while maintaining crisp vector typography.

---

## 2. Screen-to-World Raycasting & Normalized Device Coordinates

Mouse events $(e.clientX, e.clientY)$ must be normalized to NDC $[-1, 1]$ before testing against Three.js mesh bounds:

$$x_{\text{ndc}} = \left(\frac{e.clientX}{\text{window.innerWidth}}\right) \cdot 2 - 1$$

$$y_{\text{ndc}} = -\left(\frac{e.clientY}{\text{window.innerHeight}}\right) \cdot 2 + 1$$

```typescript
import * as THREE from 'three';

export function createRaycasterManager(
  camera: THREE.Camera,
  interactiveMeshes: THREE.Object3D[]
) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(interactiveMeshes, false);

    if (intersects.length > 0) {
      const topHit = intersects[0];
      return topHit.object;
    }
    return null;
  }

  return { onPointerMove, pointer, raycaster };
}
```

---

## 3. Magnetic Node Attraction Physics

When the cursor hovers near a satellite node, rather than snapping rigidly, Anime.js applies a spring force displacing the node toward the ray intersection point:

$$\vec{P}_{\text{hovered}} = \vec{P}_{\text{original}} + (\vec{P}_{\text{ray}} - \vec{P}_{\text{original}}) \cdot \kappa_{\text{attract}}$$

```typescript
import { animate, createSpring } from 'animejs';
import * as THREE from 'three';
import 'animejs/adapters/three';

export class MagneticNodeController {
  private originalPos: THREE.Vector3;
  private currentTween: any = null;

  constructor(public mesh: THREE.Object3D) {
    this.originalPos = mesh.position.clone();
  }

  onHoverEnter(hitPoint: THREE.Vector3) {
    const pullDirection = new THREE.Vector3()
      .subVectors(hitPoint, this.originalPos)
      .normalize()
      .multiplyScalar(1.2);

    const targetPos = this.originalPos.clone().add(pullDirection);

    if (this.currentTween) this.currentTween.pause();

    this.currentTween = animate(this.mesh, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      scale: 1.25,
      duration: 350,
      ease: createSpring({ stiffness: 220, damping: 14 }),
    });
  }

  onHoverLeave() {
    if (this.currentTween) this.currentTween.pause();

    this.currentTween = animate(this.mesh, {
      x: this.originalPos.x,
      y: this.originalPos.y,
      z: this.originalPos.z,
      scale: 1.0,
      duration: 500,
      ease: createSpring({ stiffness: 180, damping: 16 }),
    });
  }
}
```

---

## 4. 3D Billboard HTML Data HUDs (Drei `<Html>`)

When a node is hovered or clicked, a high-density CAD spec card floats directly adjacent to the node in 3D world space. 

By utilizing Drei's `<Html>` with `distanceFactor` and `occlude`, the card scales naturally with camera distance, clips behind foreground objects, and preserves crisp DOM typography:

```tsx
'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { MonoLabel } from '@/components/ui/MonoLabel';

export interface DataHUDProps {
  nodeId: string;
  filePath: string;
  complexity: number;
  dependents: number;
  visible: boolean;
  onSimulateBlast: () => void;
}

export const BillboardDataHUD: React.FC<DataHUDProps> = ({
  nodeId,
  filePath,
  complexity,
  dependents,
  visible,
  onSimulateBlast,
}) => {
  if (!visible) return null;

  return (
    <Html
      position={[0, 1.8, 0]}
      center
      distanceFactor={18}
      occlude
      className="pointer-events-auto select-none"
    >
      <div className="w-64 bg-[#0A0A0C]/95 border border-[#1E1E24] p-3 shadow-2xl backdrop-blur-md rounded-none">
        {/* Header telemetry */}
        <div className="flex items-center justify-between border-b border-[#1E1E24] pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <MonoLabel text="AST TELEMETRY" size="xs" color="amber" />
          </div>
          <span className="font-mono text-[9px] text-[#52525B]">ID:{nodeId.slice(0, 6)}</span>
        </div>

        {/* File Path */}
        <div className="font-mono text-xs font-semibold text-white truncate mb-2">
          {filePath}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-3">
          <div className="bg-[#121215] border border-[#1E1E24] p-1.5">
            <span className="text-[#7A7A85] block text-[8px]">CYCLOMATIC</span>
            <span className={complexity > 10 ? 'text-[#F59E0B] font-bold' : 'text-white'}>
              {complexity}
            </span>
          </div>
          <div className="bg-[#121215] border border-[#1E1E24] p-1.5">
            <span className="text-[#7A7A85] block text-[8px]">DEPENDENTS</span>
            <span className="text-white font-bold">{dependents}</span>
          </div>
        </div>

        {/* Action Trigger */}
        <button
          onClick={onSimulateBlast}
          className="w-full py-1 text-[10px] font-mono uppercase tracking-wider bg-[#1E1E24] hover:bg-[#EF4444] text-white border border-[#2A2A32] transition-colors"
        >
          Simulate Blast Radius
        </button>
      </div>
    </Html>
  );
};
```

---

## 5. Gyroscopic Cursor Parallax on the 3D Nucleus

In the Three.js render loop, the cursor NDC coordinates gently steer the root scene rotation with inertial dampening:

```typescript
import * as THREE from 'three';

export function applyGyroscopicParallax(
  rootGroup: THREE.Group,
  pointerNDC: THREE.Vector2,
  lerpFactor = 0.05,
  maxTiltDegrees = 12
) {
  const maxTiltRad = (maxTiltDegrees * Math.PI) / 180;
  const targetRotX = -pointerNDC.y * maxTiltRad;
  const targetRotY = pointerNDC.x * maxTiltRad;

  // Inertial lerp dampening
  rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * lerpFactor;
  rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * lerpFactor;
}
```
