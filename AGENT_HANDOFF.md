# Traceon — Narrative Hero & 3D WebGL Engine: Agent Handoff Context

> **Last Updated**: 2026-09-12  
> **Workspace**: `C:\rishabh\traceon`  
> **Target Page**: `src/app/home/page.tsx` (renders `Act1Hero.tsx`)  
> **Primary Stack**: Next.js 14+ (App Router), React Three Fiber, Three.js, Custom GLSL Shaders, Tailwind CSS, Lucide React

---

## 1. Executive Summary & Context

Traceon is a developer intelligence, codebase architecture, and Git forensics platform. The homepage (`/home`) features a continuous, 6-act narrative scroll journey powered by a single, high-performance **24,000-particle WebGL GPU morphing engine**.

As the user scrolls down the `1080vh` track, a single particle buffer attribute morphs seamlessly through 6 distinct mathematical topologies representing the evolution of code complexity:

1. **Act 1: The Sacred Timeline** — Laminar particle beam with CAD coordinate axes and holographic pinch nodes.
2. **Act 2: Quantum Branching / Expansion** — 4-arm galactic harmonic loom and volumetric cosmic nebula.
3. **Act 3: The Tangled Monolith (Blast Radius)** — 3D Trefoil Knot with detected circular dependency cycles.
4. **Act 4: The Living World Tree (Yggdrasil AST)** — Slender braided spiral trunk, sinuous river roots, cantilevered fractal boughs, and dense stardust cloudlets.
5. **Act 5: The Developer Genome (Git Forensics)** — Continuous streaming Watson-Crick B-DNA double helix with major/minor grooves, sugar-phosphate rails, and nucleotide base-pair rungs.
6. **Act 6: Deep-Space Cosmic Gateway (Scattered Particle Background)** — Expansive 3D background starfield and cosmic nebula (mirroring Act 2) with gentle multi-harmonic breathing, slow galactic yaw rotation, and star twinkling. Centered glassmorphic command console for repository and developer DNA exploration.

---

## 2. Core Architecture & File Hierarchy

```
src/
├── app/
│   └── home/
│       └── page.tsx                     # Entry point for homepage, renders <Act1Hero />
├── components/
│   ├── home/
│   │   └── act1/
│   │       └── Act1Hero.tsx             # Master scroll controller, DOM text cards, tabs & input capsule
│   └── canvas/
│       └── act1/
│           ├── Act1Canvas.tsx           # R3F Canvas, camera [0, 0, 11.5], fov 46, touch texture
│           ├── Act1ParticleGeometry.ts  # Pre-computes and packs 24,000 particle attributes (Float32Arrays)
│           └── Act1Shaders.ts           # Master GLSL vertex & fragment shaders (5-stage morphing, lighting)
```

### Camera & Viewport Frustum Math
- **Camera Settings**: `position: [0, 0, 11.5]`, `fov: 46`
- **Frustum at $z = 0$**:
  - Vertical span: $Y \in [-4.88, +4.88]$ (total height $\approx 9.76$ units)
  - Horizontal span (16:9): $X \in [-8.68, +8.68]$ (total width $\approx 17.36$ units)
  - Scale factor: On a $1080\text{p}$ monitor, $1.0\text{ Three.js unit} \approx 110.6\text{ CSS pixels}$.

---

## 3. Deep Dive: Recent Work & Enhancements

### A. Act 4 — The Living World Tree (Yggdrasil AST) Rebuild

#### Original Problems
- Trunk was a squashed, dense rectangular block ($y \in [-0.32, 0.38]$) with 21 straight broomstick rays radiating from a single point ($by = 0.36$).
- Energy pulses washed the trunk out into a blinding solid white cylinder.
- When rebuilt initially, the tree was "too small" ($4.5$ units tall, occupying less than 45% of the viewport height).

#### Solutions Implemented
1. **Botanical Reference Image**: Grounded directly in `ChatGPT Image Sep 10, 2026, 09_03_53 PM.png`.
2. **Layer 0 — Braided Helical Ribbon Trunk (3,200 particles)**:
   - 24 intertwined helical ribbon strands following an organic S-curve spine.
   - Hourglass taper: waist $r \approx 0.115$, base flare $r \approx 0.24$, goblet crown junction $r \approx 0.28$.
   - Multi-strand chromatic typing: Chartreuse lime (`#84cc16`), golden amber (`#f59e0b`), emerald (`#10b981`), with 1-in-4 white conduit fibers.
   - Energy pulse white mix reduced from `0.85` to `0.35` in `Act1Shaders.ts` to preserve vivid fiber colors during pulse waves.
3. **Layer 1 — Sinuous River Roots (2,400 particles)**:
   - 18 primary taproots + 36 bifurcated fork tendrils spreading out across $x \in [-2.15, +2.15]$ down to $y = -1.35$.
   - Firmly anchored physics: `swayHeightFactor = clamp((localTree.y + 1.10) / 6.60, 0.0, 1.0)`, so roots below $y = -1.10$ experience zero sway.
4. **Layer 2 — Cantilevered Fractal Boughs (5,000 particles)**:
   - 10 primary cantilevered limbs emerging around flared rim ($y = 0.68$) with cubic Bézier arches.
   - 30 secondary spreading limbs + 60 tertiary capillary twigs.
5. **Layer 3 — Volumetric Stardust Cloudlets & Crown (12,600 particles)**:
   - 82% clustered into spherical/ellipsoid cloudlet puffs around 600+ sampled branch nodes (`clusterR = [0.28, 0.52]`, $rDist \propto h_2^{0.52}$).
   - 18% ancient oak dome envelope reaching $y = 3.12$ with drooping lateral lobes.
   - Colors: Crown ($y > 2.25$) in electric cyan (`#06b6d4`), sky blue (`#38bdf8`), and white stars; outer lobes in golden amber stardust (`#f59e0b`); core in deep emerald.
6. **Majestic Scale-Up (1.82× linear scale / ~3.3× visual volume)**:
   - In `Act1Shaders.ts`, `localTree = aPosCrystal * 1.82`.
   - Vertical span expanded from $4.5$ units to **$8.45$ units tall** (filling ~87% of the vertical viewport).
   - Positioned at `vec3(2.95, -1.05, 0.0)`: root tips rest naturally at $Y \approx -3.73$, crown reaches $Y \approx +4.72$, and left edge stops at $X = -1.30$, leaving the left-aligned text card completely clear.
   - Base particle size multiplier increased to `1.55` with crown stars at `2.20×` and canopy cloudlets at `1.35×`.

---

### B. Act 6 — Expansive Scattered Background Cosmos & Centered Command Console

#### Evolution & User Intent
- Replaced central dense structures (Stargate, Kerr Black Hole) with an **expansive scattered background starfield and cosmic nebula (mirroring Act 2)** as requested by the user.
- **Why this design is optimal**:
  - Act 6 serves as the primary search launchpad (Repository Graph / Developer DNA analysis).
  - A dense 3D object in the center competed visually with the search command capsule and input text.
  - Dispersing the particles across the 3D depth background produces a serene, majestic cosmos where the central glassmorphic console floats cleanly and legibly.

#### Mathematical & Shader Implementation
- **Volumetric 3D Dispersion**:
  - Base coordinates: `localScatter = aPosSpread * 1.25`, spanning $X \in [-11.5, +11.5]$, $Y \in [-6.8, +6.8]$, $Z \in [-4.0, +2.5]$.
  - **Slow Galactic Rotation**: Continuous yaw rotation around the Y-axis ($\omega = 0.024\text{ rad/s}$).
  - **Subtle 3D Gyroscopic Precession**: Slow pitch precession angle ($\approx 5^\circ$) providing volumetric parallax.
  - **Multi-Harmonic Cosmic Breathing**: Dynamic triple sine-wave drift offsets along $(x, y, z)$ driven by `aProgress`, `aRadius`, and `aStrandIndex`.
- **Chromatics & Diamond Star Twinkling**:
  - `starTwinkle = sin(uTime * 2.8 + aColorSeed * 15.7 + aStrandIndex * 0.7) * 0.28 + 0.72`.
  - Starlight white diamond stars (`aColorSeed > 0.82`, `coreSizeScale = 1.65`, `alpha = 0.95`).
  - Electric cyan & sky blue stellar filaments (`aColorSeed > 0.58`, `coreSizeScale = 1.15`).
  - Golden amber stardust embers (`aColorSeed > 0.35`, `coreSizeScale = 1.05`).
  - Luminous emerald & mint nebula dust (`coreSizeScale = 0.85`, `alpha = 0.72`).
  - Base point size tuned to `uBaseSize * 1.05 * coreSizeScale * uPixelRatio` so stars are crisp, refined, and non-intrusive.
- **Centered UI Layout (`Act1Hero.tsx`)**:
  - Replaced split `justify-between` layout with `justify-center px-6 py-12`.
  - Added `mb-8 sm:mb-10` to the header so the title, subtitle, mode switcher, and input capsule form a unified, balanced center console surrounded by the 3D starfield.

---

## 4. Master Scroll Progress Timing & Morph Intervals

In `Act1Hero.tsx`, scroll progress $t \in [0.0, 1.0]$ maps to the following opacity and shader intervals:

| Act | Name | Overlay Opacity Active Interval | Vertex Shader Morph Interval (`Act1Shaders.ts`) | Layout Alignment |
|---|---|---|---|---|
| **Act 1** | The Sacred Timeline | `[0.00 .. 0.16]` (solid `0.00-0.08`) | Baseline state | Left-aligned text (`max-w-lg`) |
| **Act 2** | Quantum Branching | `[0.14 .. 0.35]` (solid `0.21-0.28`) | Stage 1: `[0.08 .. 0.24]` | Center-aligned text (`max-w-xl`) |
| **Act 3** | The Tangled Monolith | `[0.32 .. 0.53]` (solid `0.39-0.46`) | Stage 2: `[0.26 .. 0.42]` | Right-docked text (`justify-end`) |
| **Act 4** | World Tree (Yggdrasil AST) | `[0.50 .. 0.72]` (solid `0.57-0.65`) | Stage 3: `[0.45 .. 0.61]` | Left-docked text (`justify-start`), Tree at $X = +2.95$ |
| **Act 5** | Developer Genome (DNA) | `[0.69 .. 0.90]` (solid `0.76-0.83`) | Stage 4: `[0.64 .. 0.80]` | Right-docked text (`justify-end`), DNA at $X = -3.45$ |
| **Act 6** | Cosmic Gateway (Scattered Cosmos) | `[0.87 .. 1.00]` (solid `0.94-1.00`) | Stage 5: `[0.82 .. 0.97]` | Centered console (`justify-center`), 3D Scattered Starfield |

---

## 5. Shader Attributes & Buffer Layout

In `Act1Canvas.tsx` and `Act1ParticleGeometry.ts`, the `THREE.BufferGeometry` uses these attributes:

| Attribute | Dimensions | Purpose |
|---|---|---|
| `position` | `vec3` | Act 1 initial timeline positions |
| `aPosSpread` | `vec3` | Act 2 cosmic nebula coordinates |
| `aPosCrystal` | `vec3` | Act 4 canonical World Tree local coordinates |
| `aKnotData` | `vec4` | Act 3 Trefoil Knot parameters ($x$=progress, $y$=angle, $z$=radius, $w$=role) |
| `aParticleProps` | `vec4` | Generic particle properties ($x$=speed, $y$=size, $z$=angle, $w$=colorSeed) |
| `aCrystalData` | `vec4` | Act 4 botanical roles ($x$=layerRole, $y$=splineT, $z$=branchId, $w$=colorType) |
| `aTimelineData` | `vec3` | Act 1 & generic progression ($x$=progress, $y$=strandIndex, $z$=radius) |

---

## 6. How to Run & Verify

1. **Type Safety & Shader Validation**:
   ```bash
   npx tsc --noEmit
   ```
   *Currently passes with 0 errors (exit code 0).*

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000/home`.

3. **Production Build**:
   ```bash
   npm run build
   ```
   *Note: On Windows, ensure no orphaned `node.exe` processes have `.next/` directory locks before building.*

---

## 7. Recommended Next Steps for Successor Agent

1. **Mobile / Viewport Responsiveness Fine-Tuning**:
   - Verify mobile screens ($< 640\text{px}$): On mobile portrait, test whether the Kerr Black Hole and World Tree scale down appropriately using canvas resize hooks or a uniform `uIsMobile` flag in the shader.
2. **Interactive Event Horizon Interaction**:
   - Currently, mouse interaction triggers VengeanceUI `uTouch` fluid ripples. You can optionally tie cursor coordinates into the Kerr Black Hole's pitch/yaw angles for interactive parallax tilt when hovering in Act 6.
3. **Repository Graph / DNA Navigation**:
   - The Act 6 command capsule routes to `/repo?url=...` and `/profile-analytics?username=...`. Ensure those pages seamlessly inherit the repository data entered in the hero capsule.
