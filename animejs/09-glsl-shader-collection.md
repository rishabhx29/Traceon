# GLSL Shader Collection & Anime.js Uniform Binding Manual

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/animejs/09-glsl-shader-collection.md`  
> **Target:** Hardware-Accelerated Shaders for Code Nucleus, Spline Pulses, and Ambient Dust  

---

## 1. Architecture of Anime.js-Driven GLSL Shaders

WebGL shaders excel at per-vertex physical displacement and per-fragment light computation on the GPU, while Anime.js v4 excels at timing, spring dynamics, and user interaction choreographies on the CPU.

By binding Anime.js tweens directly to Three.js `material.uniforms.<name>.value`, we achieve:
1. **Zero Garbage Collection Overhead**: Uniform values mutate in-place without generating new JavaScript objects or re-allocating memory.
2. **Instant GPU Transmission**: Three.js automatically pushes modified uniforms to the active WebGL program during `renderer.render()`.
3. **True Mathematical Dynamics**: Shockwaves, ripples, and laser pulses ripple across millions of pixels without dropping below 60fps / 120fps.

---

## 2. Shader Catalog & Uniform Interfaces

### 2.1 Code Nucleus Core Shader (`nucleusCore.vert` & `nucleusCore.frag`)
Located at:
- [`docs/animejs/shaders/nucleusCore.vert`](file:///C:/Rishabh/traceon/docs/animejs/shaders/nucleusCore.vert)
- [`docs/animejs/shaders/nucleusCore.frag`](file:///C:/Rishabh/traceon/docs/animejs/shaders/nucleusCore.frag)

#### Uniform Interface:
```typescript
const coreMaterial = new THREE.ShaderMaterial({
  vertexShader: nucleusCoreVert,
  fragmentShader: nucleusCoreFrag,
  uniforms: {
    uTime: { value: 0 },
    uRippleProgress: { value: 0.0 }, // Driven by Anime.js: 0.0 -> 1.0
    uEpicenter: { value: new THREE.Vector3(0, 0, 0) },
    uWaveFrequency: { value: 6.0 },
    uWaveAmplitude: { value: 0.35 },
    uBaseColor: { value: new THREE.Color('#0A0A0C') }, // Carbon Strata
    uRimColor: { value: new THREE.Color('#F5F5F7') },  // Titanium Stark
    uShockColor: { value: new THREE.Color('#FF3333') },// Laser Vermilion
    uFresnelPower: { value: 2.8 },
  },
});
```

#### Anime.js Trigger Example:
```typescript
import { animate } from 'animejs';

export function triggerCoreRipple(
  material: THREE.ShaderMaterial,
  epicenter: THREE.Vector3
) {
  material.uniforms.uEpicenter.value.copy(epicenter);
  material.uniforms.uRippleProgress.value = 0.0;

  return animate(material.uniforms.uRippleProgress, {
    value: [0.0, 1.0],
    duration: 1200,
    ease: 'out(3)',
  });
}
```

---

### 2.2 Traveling Spline Pulse Shader (`splinePulse.vert` & `splinePulse.frag`)
Located at:
- [`docs/animejs/shaders/splinePulse.vert`](file:///C:/Rishabh/traceon/docs/animejs/shaders/splinePulse.vert)
- [`docs/animejs/shaders/splinePulse.frag`](file:///C:/Rishabh/traceon/docs/animejs/shaders/splinePulse.frag)

#### Uniform Interface:
```typescript
const splineMaterial = new THREE.ShaderMaterial({
  vertexShader: splinePulseVert,
  fragmentShader: splinePulseFrag,
  uniforms: {
    uCableColor: { value: new THREE.Color('#1E1E24') }, // Precision Steel
    uPulseColor: { value: new THREE.Color('#F59E0B') }, // Cadmium Amber
    uPulseProgress: { value: 0.0 },                     // Driven by Anime.js
    uPulseLength: { value: 0.18 },
  },
  transparent: true,
});
```

#### Anime.js Continuous Pulse Loop:
```typescript
import { animate } from 'animejs';

export function startContinuousSplinePulse(
  material: THREE.ShaderMaterial,
  duration = 2400
) {
  material.uniforms.uPulseProgress.value = 0.0;

  return animate(material.uniforms.uPulseProgress, {
    value: [0.0, 1.0],
    duration: duration,
    ease: 'inOut(2)',
    loop: true,
  });
}
```
