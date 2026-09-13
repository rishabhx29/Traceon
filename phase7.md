# Phase 7: QA, Polish & Performance Verification Gate — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `phase7.md` (and `docs/phases/phase7.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Phases 1 through 6 Complete and Verified  
> **Authoring Team:** Performance, UI Critic, Visual Design, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

Phase 7 is the final, uncompromising **Quality Assurance, Performance Hardening, Accessibility, and Motion Polish Gate** for the entire Traceon platform. 

Rather than treating testing and polish as an afterthought, Phase 7 enforces an automated and manual verification protocol across every component, screen, shader, and interaction created during Phases 1 through 6. 

### Core Objectives:
1. **Motion & Spring Physics Polish**: Audit every spring and tween across the site according to Emil Kowalski / Rauno Freiberg motion design principles (tangible mechanical weight, zero cartoon bounce, zero sluggish dampening).
2. **WCAG 2.2 AA Accessibility Compliance**: Complete keyboard operability, explicit focus reticles, ARIA compliance on 3D canvases, and strict contrast ratios (exceeding 4.5:1).
3. **60fps / 120fps Performance Hardening**: Dynamic code-splitting of Three.js/R3F, memory leak prevention (geometry disposal), WebGL fallback verification, and GPU compositor audit.
4. **Final Zero-AI-Slop Codebase Sweep**: Automated grep audit ensuring 0% presence of generic SaaS blue, purple, indigo, violet, cyan, or generic floating card templates.

---

## 2. Multi-Agent Audit & Verification Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          PHASE 7 MULTI-AGENT VERIFICATION PIPELINE                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [Agent 10: Agent Orchestrator]                                                       │
│        │                                                                               │
│        ├──► Subphase 7.1: Motion Physics & Spring Audit ─────► [Agent 1: Anime.js]     │
│        │                                                       & [Agent 2: GSAP/Lenis] │
│        │                                                       GATE 7.1 SIGN-OFF       │
│        │                                                                               │
│        ├──► Subphase 7.2: WCAG 2.2 AA Accessibility Audit ───► [Agent 9: Checker]      │
│        │                                                       & [Agent 7: UX Arch]    │
│        │                                                       GATE 7.2 SIGN-OFF       │
│        │                                                                               │
│        ├──► Subphase 7.3: WebGL & 60fps Performance Gate ────► [Agent 8: Performance]  │
│        │                                                       GATE 7.3 SIGN-OFF       │
│        │                                                                               │
│        ├──► Subphase 7.4: Mobile & Touch Ergonomics Audit ───► [Agent 7: UX Arch]      │
│        │                                                       GATE 7.4 SIGN-OFF       │
│        │                                                                               │
│        └──► Subphase 7.5: Zero-AI-Slop Final Codebase Sweep ─► [Agent 9: Checker]      │
│                                                                & [Agent 6: Visual]     │
│                                                                FINAL PRODUCTION RELEASE│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Audit Gates & Acceptance Specifications

---

### Subphase 7.1: Motion & Spring Physics Polish Audit

#### Philosophy:
Traceon is an industrial instrument. Motion must communicate mechanical reality, mass, and tension. 
- **NO**: Bouncy rubbery animations (`bounce.out`), sluggish linear easing (`linear`), or unmotivated floating elements.
- **YES**: High-tension spring snaps, crisp mechanical button depressions, and precise inertial dampening.

#### Resource Toolkits & Reference Paths to Access:
- `animejs/02-spring-and-easing-physics.ts` — Complete library of validated spring physics presets (`tactilePopButtonSpring`, `elasticSliderSpring`, `orbitalDecaySpring`, `shockwaveImpulse`).
- `animejs/06-gui-scrubber-and-devtools.ts` — Interactive timeline devtools and frame scrubber for visual spring verification.
- `lenis/06-integrated-cad-motion-controller.ts` — Unified RAF synchronization between Lenis and GSAP ScrollTrigger.
- `gsap/01-gsap-core-and-timelines.ts` — Centralized tween duration and easing verification.

#### Inspection Checklist:

| Component | Target Interaction | Approved Physics Configuration | Pass/Fail Criteria |
|:---|:---|:---|:---|
| `PopActuator` | Button click depression | `createSpring({ stiffness: 280, damping: 18 })`, `scale: 0.96` | Instant tactile feedback, no wobble |
| `CommandOmnibox` | Modal open / dismiss | `duration: 0.25s, ease: 'power3.out'`, `y: -10 -> 0` | Pops in crisply, dismissed under 150ms |
| `NodeDetailSidecar`| Graph drawer slide-in | `duration: 0.35s, ease: 'power3.out'`, `x: 100% -> 0%` | Seamless slide with zero frame stutter |
| `CommitScrubber` | Draggable timeline head | `createSpring({ stiffness: 150, damping: 12 })` | Snaps cleanly to nearest commit notch |
| `ArchetypeCarousel`| 3D card rotation swipe | `dampingFactor: 0.08`, `rotateY` continuous | Inertial drag with clean angular deceleration |
| `CodeNucleus` | Scroll state morphing | GSAP ScrollTrigger `scrub: 1.2` | Fluid uniform morphing synced to scroll wheel |
| Smooth Scroll | Lenis global wheel | `lerp: 0.08`, `duration: 1.2`, `smoothTouch: false` | Glides smoothly without floatiness or lag |

#### Reduced Motion Fallback:
All animated components must include:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### Subphase 7.2: WCAG 2.2 AA Accessibility & Keyboard Nav Gate

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/01-tactile-actuators-and-buttons.tsx` — Accessible focus states, active states, and keyboard activation (`aria-pressed`, `tabIndex`).
- `Reference_components/11-shadcn-cad-primitives.tsx` — `CADCommandDialog`, `CADSegmentedTabs`, `CADAccordion`, & `CADPrecisionTooltip` (Full Radix UI accessible primitives).
- `Reference_components/12-react-bits-specialized-primitives.tsx` — `ReactBitsTrueFocus` (High-contrast focus bracket indicators).

#### Contrast Audit:
Every text style and token in `globals.css` must pass a minimum contrast ratio of **4.5:1** against its backing surface:

| Text Token | Color | Surface | Calculated Ratio | WCAG Compliance |
|:---|:---|:---|:---|:---|
| `--text-stark` | `#FFFFFF` | `--void` (`#050505`) | **19.8:1** | AAA Pass |
| `--text-stark` | `#FFFFFF` | `--obsidian` (`#0A0A0A`) | **18.7:1** | AAA Pass |
| `--text-bone` | `#CCCCCC` | `--carbon` (`#121212`) | **10.9:1** | AAA Pass |
| `--text-muted` | `#777777` | `--void` (`#050505`) | **4.9:1** | AA Pass |
| `--phosphor-amber` | `#FFB000` | `--obsidian` (`#0A0A0A`) | **10.1:1** | AAA Pass |
| `--laser-vermilion`| `#FF3333` | `--obsidian` (`#0A0A0A`) | **5.4:1** | AA Pass |

#### Keyboard Navigation Matrix:
1. **Global Keyboard Shortcuts**:
   - `Cmd + K` / `Ctrl + K`: Open Command Omnibox.
   - `Escape`: Close any active modal, sidecar, or overlay.
2. **Focus Rings**:
   - Explicit 2px phosphor outline on all focused elements:
     ```css
     :focus-visible {
       outline: 2px solid #FFB000 !important;
       outline-offset: 2px !important;
     }
     ```
3. **Screen Reader ARIA Tags**:
   - `CodeNucleus`: Wrapped with `role="region" aria-label="Interactive 3D AST Code Nucleus displaying repository topology"`.
   - `CURISMRadar`: Polygons and vertices labeled with `aria-label="Curiosity: 88 points", role="graphics-document"`.
   - `PopActuator`: Native `<button>` elements preserving `aria-pressed` or `aria-expanded` attributes.

---

### Subphase 7.3: WebGL & 60fps/120fps Performance Hardening Gate

#### Resource Toolkits & Reference Paths to Access:
- `animejs/05-three-fiber-and-webgl-integration.ts` — Three.js geometry/material memory cleanup (`dispose()`), demand-based frame rendering, and context loss recovery.
- `Reference_components/07-background-grids-and-magnet-lines.tsx` — 2D vector fallback rendering when WebGL is unavailable.
- `lenis/06-integrated-cad-motion-controller.ts` — FPS monitoring and frame drop diagnostics during scroll.

#### 1. Dynamic Bundle Splitting
Three.js and React Three Fiber must NEVER be bundled into the initial layout JS bundle. They must be dynamically loaded only on routes that render the 3D viewport:
```tsx
import dynamic from 'next/dynamic';

export const CodeNucleus = dynamic(
  () => import('@/components/hero/CodeNucleus').then((mod) => mod.CodeNucleus),
  {
    ssr: false,
    loading: () => <CodeNucleusFallback />,
  }
);
```

#### 2. Three.js Memory & GPU Resource Management
- All geometries, materials, and textures must explicitly call `.dispose()` inside `useEffect` cleanup handlers to prevent VRAM memory leaks.
- `frameloop="demand"` enabled on `<Canvas>` so Three.js renders frames strictly when state changes or when active scrolling occurs.

#### 3. WebGL Support & Context Loss Recovery
- Test with simulated WebGL failure (`canvas.getContext('webgl2') === null`).
- System must seamlessly fall back to `<CodeNucleusFallback />` without unhandled runtime exceptions.

#### 4. Performance Metrics Budget:
- **Lighthouse Performance Score**: ≥ 90 on Desktop, ≥ 80 on Mobile.
- **Largest Contentful Paint (LCP)**: < 2.2s.
- **Cumulative Layout Shift (CLS)**: 0.00.
- **Interaction to Next Paint (INP)**: < 100ms.

---

### Subphase 7.4: Mobile & Touch Ergonomics Audit

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/08-vengeance-ui-specialized-primitives.tsx` — `VengeanceNotchNavbar` (Responsive touch drawer and compact mobile header).
- `lenis/05-lenis-smooth-scroll.ts` — Mobile touch settings verification (`smoothTouch: false` to allow native inertial scroll on iOS/Android).
- `animejs/03-stagger-and-timeline-choreography.ts` — Staggered mobile navigation drawer slide-down animation (`stagger(40)`).

#### Constraints for `< 768px`:
1. **HUD Navigation**:
   - Compresses into compact mobile header with touch-friendly menu drawer.
   - Drawer items stagger-animate using Anime.js (`stagger(40)`).
2. **3D Code Nucleus**:
   - Canvas height locked to `380px` on mobile viewports.
   - Single-finger touch pans graph; dual-finger touch zooms.
   - Auto-rotates at low RPM if touch is idle.
3. **Feature Matrix**:
   - Switches from 2x2 grid to vertical stack of `BlueprintFrame` cards with swipe indicators.
4. **Touch Target Sizing**:
   - All interactive controls have a minimum touch target size of **44px x 44px**.

---

### Subphase 7.5: Zero-AI-Slop Final Codebase Sweep

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/README.md` (Section 1: Token Specification & Color Lock) — Verification of strict Obsidian, Carbon, Steel, Phosphor Amber, Emerald, and Vermilion tokens.

#### Automated Grep Verification Script:
Before production release, the following shell commands must return **0 results** across all `src/` files:
```powershell
# Check for legacy forbidden color classes
rg "text-(indigo|purple|violet|blue|cyan)-" src/
rg "bg-(indigo|purple|violet|blue|cyan)-" src/
rg "border-(indigo|purple|violet|blue|cyan)-" src/

# Check for residual generic hex codes
rg -i "#(6366f1|8b5cf6|3b82f6|06b6d4|a855f7)" src/
```

#### Visual Quality Confirmation:
- [ ] No generic floating glassmorphism cards with rainbow gradients.
- [ ] No generic emoji icons (replaced with monochrome SVG icons from Lucide/Phosphor).
- [ ] No generic rotating circular loading spinners (replaced with LexicalStreamLoader).
- [ ] Every screen feels like a cohesive, purpose-built CAD instrument.

---

## 4. Final Release Sign-off Matrix

| Area | Lead Agent | Verification Method | Sign-off Status |
|:---|:---|:---|:---|
| **Spring & Motion Physics** | Agent 1 & Agent 2 | Frame-by-frame inspection | PENDING |
| **WCAG 2.2 AA Accessibility** | Agent 9 & Agent 7 | Axe Core + Manual Keyboard Audit | PENDING |
| **WebGL & 60fps Performance** | Agent 8 (Performance) | Chrome DevTools Performance Trace | PENDING |
| **Mobile Responsiveness** | Agent 7 (UX Architect) | Viewport testing (375px to 1920px) | PENDING |
| **Zero-AI-Slop Code Sweep** | Agent 9 (UI Critic) | Automated regex & grep audit | PENDING |
| **Final Release Approval** | Agent 10 (Orchestrator)| Full multi-agent consensus | PENDING |
