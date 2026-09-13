# Anime.js v4 & 3D Spatial Physics Architecture Guide

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Directory:** `docs/animejs/` (mirrored at root `animejs/`)  
> **Subject:** Authoritative Reference Manual, Physics Principles & Complete Implementations for 3D Interactive AST Components  
> **Author:** Antigravity AI Engineering & Motion Architecture Team  

---

## 1. Executive Summary & Purpose

This repository of reference documents, shader assets, and code recipes serves as the authoritative, exhaustive guide for building and animating **true 3D spatial components** in Traceon — specifically the **3D Volumetric Code Nucleus** and the **Interactive 3D Abstract Syntax Tree (AST)**.

Too many contemporary interfaces claim to offer "3D experiences" by merely wrapping flat 2D cards inside CSS perspective tilts (`rotateX(10deg)`), or floating static PNG illustrations in a canvas. Traceon rejects this approach.

In Traceon, the 3D AST is a **living, physical, volumetric graph**:
- Nodes are physical geometric bodies (dodecahedrons, icosahedrons, and instanced octahedrons) arranged in 3D Euclidean space $(\mathbb{R}^3)$.
- Edges are volumetric Catmull-Rom spline tension cables that transmit dependency signals and visual pulses.
- Motion is governed by **Anime.js v4 spring physics** (Hooke's Law, harmonic damping, and Coulomb electrostatic force-directed equilibrium) combined with **Three.js / React Three Fiber (R3F)** WebGL acceleration.
- User interactions (click, hover, drag, scroll) trigger physical shockwaves, magnetic cursor attraction, gyroscopic inertial tilt, and transitive blast radius cascade waves.

---

## 2. Exhaustive Directory Architecture & Reference Map

```
docs/animejs/
├── README.md                                       # [THIS FILE] Master Overview & Architecture
├── 01-threejs-adapter-engine-sync.md               # Anime.js v4 Three.js Adapter, Object3D & Engine Sync
├── 02-spring-physics-and-force-dynamics.md         # Spring Equations, Force-Directed AST Graphs & Dampening
├── 03-ast-tree-3d-spatial-generation.md            # 3D Tree Geometries, Fibonacci Spheres & Catmull-Rom Splines
├── 04-blast-radius-shockwave-propagation.md        # Blast Radius Radial Shockwaves & Ripple Shaders
├── 05-raycasting-and-spatial-telemetry.md          # Raycasting, 3D Billboards, Magnetic HUDs & Cursor Tilt
├── 06-production-code-recipes.ts                   # Drop-in TypeScript Utilities & Complete Implementations
├── 07-cinematic-camera-and-orbit-physics.md        # Camera Dolly-in, Smooth Look-at, FOV Warping & Inertial Orbit
├── 08-edge-signal-pulses-and-particle-flows.md     # Spline Photons, Ambient Particle Dust & Data Cascade Bursts
├── 09-glsl-shader-collection.md                    # Hardware-Accelerated Shaders & Anime.js Uniform Binding
├── 10-gesture-touch-and-performance-guardrails.md  # Multi-Touch Mobile Physics, DPR Clamping & VRAM Disposal
├── 11-interactive-3d-tree-complete-blueprint.tsx   # Complete End-to-End Working R3F + Anime.js 3D Tree Component
└── shaders/
    ├── nucleusCore.vert                            # Vertex displacement shader for central Code Nucleus
    ├── nucleusCore.frag                            # Fresnel rim glow & thermal vermilion incandescent frag shader
    ├── splinePulse.vert                            # Vertex shader for animated dependency spline cables
    └── splinePulse.frag                            # Traveling photon pulse fragment shader with Gaussian falloff
```

---

## 3. Technology Stack & Integration Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               TRACEO 3D SPATIAL ARCHITECTURE                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │                              Next.js App Router (React 19)                    │    │
│   └──────────────────────────────────────┬────────────────────────────────────────┘    │
│                                          │                                             │
│                                          ▼                                             │
│   ┌───────────────────────────────────────────────────────────────────────────────┐    │
│   │                      React Three Fiber (<Canvas>) Container                   │    │
│   │                 (frameloop="demand" | WebGL2 | Anti-aliasing)                 │    │
│   └──────┬───────────────────────────────┬───────────────────────────────┬────────┘    │
│          │                               │                               │             │
│          ▼                               ▼                               ▼             │
│   ┌───────────────┐               ┌───────────────┐               ┌───────────────┐    │
│   │ Three.js Core │               │  Anime.js v4  │               │ GSAP / Lenis  │    │
│   │  Scene Graph  │               │ Spring Engine │               │ Scroll Driver │    │
│   │ (Mesh, Spline,│◄──────────────┤(Adapters, RAF │◄──────────────┤(ScrollTrigger,│    │
│   │  Instanced)   │  Tween Target │ engine.update)│  Scroll scrub │  Smooth RAF)  │    │
│   └───────────────┘               └───────────────┘               └───────────────┘    │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Integration Rules:
1. **Single Unified RAF Loop**:
   - Anime.js v4 must **not** run its own autonomous `requestAnimationFrame` loop when animating Three.js objects.
   - Set `engine.useDefaultMainLoop = false;`.
   - Tick the engine inside the Three.js render loop or R3F's `useFrame((_, delta) => engine.update())`. This guarantees frame synchronization, eliminates micro-stuttering, and allows pausing when off-screen.
2. **Native Three.js Adapter**:
   - Use `import 'animejs/adapters/three';` (or `import { threeAdapter } from 'animejs/adapters/three';`).
   - Enables direct animation of `position` (`x, y, z`), `rotation` (`rotateX, rotateY, rotateZ` in degrees), `scale`, `opacity`, `color`, and custom GLSL uniforms.
3. **InstancedMesh for Scalability**:
   - For codebases with hundreds or thousands of AST nodes, individual `THREE.Mesh` instances degrade draw call performance.
   - Anime.js v4 provides `getInstances(instancedMesh)` and `commitChanges(instancedMesh)` to animate thousands of nodes in a single draw call.
4. **Physical Precision over Cartoon Bounce**:
   - Use `createSpring({ stiffness: 120-280, damping: 12-24, mass: 1 })`.
   - Never use `ease: 'bounce.out'` or wild elastic overshoots. Motion must feel like high-tensile carbon steel, beryllium copper springs, and precision mechanical servos.

---

## 4. Quick-Start Reference Matrix

| Goal / Effect | Anime.js v4 Feature | Three.js Target | Reference Document |
|:---|:---|:---|:---|
| **Sync engine with render loop** | `engine.useDefaultMainLoop = false`, `engine.update()` | `useFrame` or `renderer.setAnimationLoop` | [01-threejs-adapter-engine-sync.md](file:///C:/Rishabh/traceon/docs/animejs/01-threejs-adapter-engine-sync.md) |
| **Mechanical button/node depression**| `createSpring({ stiffness: 280, damping: 18 })` | `mesh.scale` or `translateY` | [02-spring-physics-and-force-dynamics.md](file:///C:/Rishabh/traceon/docs/animejs/02-spring-physics-and-force-dynamics.md) |
| **Hierarchical AST tree bloom** | `stagger([from, to], { from: 'center', axis: 'y' })` | Node array `position` / `scale` | [03-ast-tree-3d-spatial-generation.md](file:///C:/Rishabh/traceon/docs/animejs/03-ast-tree-3d-spatial-generation.md) |
| **Radial blast radius shockwave** | `stagger(50, { start: 0, from: infectedNodeIndex })` | Vertex displacement & node color | [04-blast-radius-shockwave-propagation.md](file:///C:/Rishabh/traceon/docs/animejs/04-blast-radius-shockwave-propagation.md) |
| **Magnetic cursor hover attraction**| `createSpring({ stiffness: 150, damping: 14 })` | Mesh position toward Raycaster hit | [05-raycasting-and-spatial-telemetry.md](file:///C:/Rishabh/traceon/docs/animejs/05-raycasting-and-spatial-telemetry.md) |
| **High-density node cluster (1,000+)**| `getInstances(mesh)`, `commitChanges(mesh)` | `THREE.InstancedMesh` | [06-production-code-recipes.ts](file:///C:/Rishabh/traceon/docs/animejs/06-production-code-recipes.ts) |
| **Camera Dolly & Look-At Focus** | `createSpring({ stiffness: 140, damping: 18 })` | Camera position & OrbitControls target | [07-cinematic-camera-and-orbit-physics.md](file:///C:/Rishabh/traceon/docs/animejs/07-cinematic-camera-and-orbit-physics.md) |
| **Traveling spline energy pulses** | `curve.getPointAt(progress)` with `inOut(2)` | `THREE.CatmullRomCurve3` | [08-edge-signal-pulses-and-particle-flows.md](file:///C:/Rishabh/traceon/docs/animejs/08-edge-signal-pulses-and-particle-flows.md) |
| **GPU surface displacement & Fresnel**| Uniform float tweening (`uRippleProgress`) | `THREE.ShaderMaterial` | [09-glsl-shader-collection.md](file:///C:/Rishabh/traceon/docs/animejs/09-glsl-shader-collection.md) |
| **Mobile multi-touch & context guards**| Clamped DPR, `touch-action: none` | Canvas event listeners & cleanup | [10-gesture-touch-and-performance-guardrails.md](file:///C:/Rishabh/traceon/docs/animejs/10-gesture-touch-and-performance-guardrails.md) |
| **Full 3D Interactive Component** | Complete R3F + Anime.js + Drei assembly | Complete `<Interactive3DTreeCanvas />` | [11-interactive-3d-tree-complete-blueprint.tsx](file:///C:/Rishabh/traceon/docs/animejs/11-interactive-3d-tree-complete-blueprint.tsx) |

---

All reference documents and shaders are ready to be utilized during implementation phases.
