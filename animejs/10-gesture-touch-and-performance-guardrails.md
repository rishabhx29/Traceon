# Touch Gestures, Mobile Physics & Performance Guardrails

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/10-gesture-touch-and-performance-guardrails.md`  
> **Target:** Mobile Responsiveness, Multi-touch Physics, VRAM Lifecycle, and Context Loss  

---

## 1. Multi-Touch Mobile Interaction Physics

Rendering an interactive 3D scene on touchscreens introduces unique physiological constraints:
1. **Touch-Action Canvas Isolation**: Mobile browsers automatically intercept touch gestures to scroll the page. The 3D canvas must declare `touch-action: none;` and include `data-lenis-prevent` to prevent touch-drag events from fighting the page scroller.
2. **Pinch-to-Zoom Dynamic Friction**: Pinch gestures calculate Euclidean distance between two touch points $T_1, T_2$:
   $$D_{\text{pinch}} = \|\vec{T}_1 - \vec{T}_2\|$$
   Changes in $D_{\text{pinch}}$ interpolate camera distance using exponential dampening.
3. **Single-Finger Gyroscopic Drift**: On touch-end, residual angular velocity spins the scene with continuous exponential friction ($v_{t+1} = v_t \cdot 0.92$) until settling.

---

## 2. Hardware Performance & GPU Fill-Rate Guardrails

### 1. Device Pixel Ratio (DPR) Clamping:
Modern mobile devices frequently possess 3x or 4x Retina screens (e.g. iPhone 15 Pro, Samsung Galaxy S24). Rendering a full-screen WebGL scene at native 3x resolution requires rendering **9 times** the pixel count of a standard display, causing thermal throttling and battery drain.

**The Golden Rule**: Always clamp DPR to a maximum of `2.0`:
```tsx
<Canvas
  dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
  // ...
/>
```

### 2. Demand-Driven Frame Rendering (`frameloop="demand"`):
When the user is not actively interacting and no Anime.js timeline is executing, the renderer should not draw redundant frames:
- Set `frameloop="demand"` on R3F `<Canvas>`.
- Call `invalidate()` from within Anime.js `onUpdate` callbacks to request frame renders strictly when animated values mutate.

---

## 3. WebGL Context Loss & Graceful Recovery

Mobile OS memory managers will kill WebGL contexts when memory pressure spikes (e.g. switching between browser tabs or opening camera). The application must intercept context events:

```typescript
export function attachWebGLContextGuards(
  canvas: HTMLCanvasElement,
  onContextLost: () => void,
  onContextRestored: () => void
) {
  function handleContextLost(event: Event) {
    event.preventDefault(); // Prevents default browser abort
    console.warn('[Traceon 3D] WebGL Context Lost. Pausing render loop.');
    onContextLost();
  }

  function handleContextRestored() {
    console.info('[Traceon 3D] WebGL Context Restored. Rebuilding scene graph.');
    onContextRestored();
  }

  canvas.addEventListener('webglcontextlost', handleContextLost, false);
  canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  return () => {
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);
  };
}
```

---

## 4. Complete Three.js Scene VRAM Disposal Pattern

When unmounting a 3D component in Next.js, failing to dispose geometries and materials causes VRAM leaks that persist across client-side route navigations.

```typescript
import * as THREE from 'three';

export function disposeThreeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    // Dispose geometry buffer
    if (object.geometry) {
      object.geometry.dispose();
    }

    // Dispose material(s) and textures
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(object.material);
      }
    }
  });
}

function disposeMaterial(material: THREE.Material) {
  // Dispose all associated textures
  for (const key of Object.keys(material)) {
    const value = (material as any)[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose();
    }
  }
  material.dispose();
}
```
