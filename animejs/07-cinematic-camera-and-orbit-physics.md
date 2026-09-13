# Cinematic Camera, Dolly Zoom & Orbit Physics Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/07-cinematic-camera-and-orbit-physics.md`  
> **Target:** 3D Camera Choreography, Smooth Focus Transitions, and Inertial Orbit Controls  

---

## 1. Physical Camera Model in 3D Space

In a mission-critical 3D AST visualization, the camera is not a static observer. It acts as an active physical probe navigating a complex volumetric network:
1. **Node Focus Dolly-In**: Clicking any satellite node smoothly translates the camera along a 3D spline to frame the target node at optimal viewing distance, while reorienting the camera look-at target.
2. **FOV Dynamic Warping**: During blast radius detonations or high-speed navigation, the camera's Field of View (FOV) temporarily widens (e.g. from $50^\circ \to 68^\circ$) to simulate physical acceleration, then springs back to $50^\circ$.
3. **Idle Cinematic Precession**: When the user is not actively interacting, the camera slowly orbits the scene graph at low angular velocity ($0.002\text{ rad/frame}$). User touch/click instantly interrupts and hands control over to inertial `OrbitControls`.

---

## 2. Camera Interpolation Mathematics

### 1. Vector Position Slerp & Smooth Step:
To avoid abrupt camera jerks, camera position $\vec{P}_{\text{cam}}$ and look-at target $\vec{T}_{\text{target}}$ are animated using cubic Hermite interpolation or Anime.js spring mechanics:

$$\vec{P}_{\text{cam}}(t) = \vec{P}_{\text{start}} + (\vec{P}_{\text{dest}} - \vec{P}_{\text{start}}) \cdot S(t)$$

Where $S(t) = 3t^2 - 2t^3$ (SmoothStep) or driven by `createSpring({ stiffness: 140, damping: 18 })`.

### 2. Camera Offset Vector Calculation:
When framing a target node located at $\vec{P}_{\text{node}}$ with bounding radius $R_{\text{node}}$:

$$\text{Distance} = \frac{R_{\text{node}}}{\tan(\text{FOV} / 2)} \cdot 1.8$$

$$\vec{P}_{\text{camera\_dest}} = \vec{P}_{\text{node}} + \vec{U}_{\text{view}} \cdot \text{Distance}$$

Where $\vec{U}_{\text{view}}$ is the normalized direction vector from the scene origin toward the target node.

---

## 3. Anime.js Camera Dolly & Look-At Transition Engine

```typescript
import * as THREE from 'three';
import { animate, createTimeline, createSpring } from 'animejs';
import type { OrbitControls } from 'three-stdlib';

export interface CameraTransitionOptions {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  targetNodePos: THREE.Vector3;
  targetLookAt?: THREE.Vector3;
  duration?: number;
  onComplete?: () => void;
}

export function focusCameraOnNode({
  camera,
  controls,
  targetNodePos,
  duration = 1200,
  onComplete,
}: CameraTransitionOptions) {
  // 1. Calculate camera destination position
  const offsetDirection = targetNodePos.clone().normalize();
  if (offsetDirection.lengthSq() < 0.001) offsetDirection.set(0, 0, 1);

  const desiredDistance = 6.5; // Optimal inspection distance
  const targetCamPos = targetNodePos.clone().add(offsetDirection.multiplyScalar(desiredDistance));

  // 2. Disable OrbitControls during programmatic tween
  controls.enabled = false;

  // 3. Proxy object for simultaneous position and target interpolation
  const camProxy = {
    posX: camera.position.x,
    posY: camera.position.y,
    posZ: camera.position.z,
    targetX: controls.target.x,
    targetY: controls.target.y,
    targetZ: controls.target.z,
    fov: camera.fov,
  };

  const tl = createTimeline({
    onUpdate: () => {
      camera.position.set(camProxy.posX, camProxy.posY, camProxy.posZ);
      controls.target.set(camProxy.targetX, camProxy.targetY, camProxy.targetZ);
      camera.fov = camProxy.fov;
      camera.updateProjectionMatrix();
      controls.update();
    },
    onComplete: () => {
      controls.enabled = true;
      onComplete?.();
    },
  });

  // Camera translation with mechanical spring
  tl.add(camProxy, {
    posX: targetCamPos.x,
    posY: targetCamPos.y,
    posZ: targetCamPos.z,
    targetX: targetNodePos.x,
    targetY: targetNodePos.y,
    targetZ: targetNodePos.z,
    duration: duration,
    ease: createSpring({ stiffness: 140, damping: 18 }),
  });

  // Subtle cinematic FOV pulse (widens slightly then contracts)
  tl.add(
    camProxy,
    {
      fov: [camera.fov, camera.fov + 8, camera.fov],
      duration: duration * 0.8,
      ease: 'inOut(2)',
    },
    0
  );

  return tl;
}
```

---

## 4. Inertial Orbit Controls Configuration

When using `OrbitControls` from `three-stdlib` or `@react-three/drei`:

```typescript
export function configurePrecisionOrbitControls(controls: OrbitControls) {
  // Inertial dampening (smooth deceleration when mouse is released)
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Zoom distance constraints (prevents clipping through nucleus)
  controls.minDistance = 4.0;
  controls.maxDistance = 50.0;

  // Polar angle constraints (prevents disorienting camera flip at poles)
  controls.minPolarAngle = Math.PI * 0.1; // 18 degrees
  controls.maxPolarAngle = Math.PI * 0.9; // 162 degrees

  // Auto-rotation (cinematic idle drift)
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6; // Subtle 0.6 RPM
}
```

---

## 5. Seamless Idle Precession & User Takeover Logic

```typescript
let isUserInteracting = false;
let idleTimer: NodeJS.Timeout | null = null;

export function handleUserInteractionStart(controls: OrbitControls) {
  isUserInteracting = true;
  controls.autoRotate = false;
  if (idleTimer) clearTimeout(idleTimer);
}

export function handleUserInteractionEnd(controls: OrbitControls, idleDelayMs = 4000) {
  isUserInteracting = false;
  if (idleTimer) clearTimeout(idleTimer);

  // Resume gentle auto-rotation after 4 seconds of idle time
  idleTimer = setTimeout(() => {
    if (!isUserInteracting) {
      controls.autoRotate = true;
    }
  }, idleDelayMs);
}
```
