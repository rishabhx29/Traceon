# MASTER REFERENCE COMPONENTS CATALOG
## TraceOn Obsidian Industrial CAD Motion & UI Design System

This directory houses the complete production-grade source code, architectural blueprints, styling tokens, and subagent prompts for all curated UI components selected from **Vengeance UI**, **Aceternity UI**, **React Bits**, **21st.dev**, and **Collect UI**.

Every component in this catalog has been strictly audited and refactored to eliminate generic "AI-slop" aesthetics (floating rounded purples, gradients, pastel cyan cards) in favor of the **TraceOn Obsidian Industrial CAD Specification**.

---

## 1. DESIGN TOKEN SPECIFICATION & COLOR LOCK

All components adhere strictly to this token matrix. **NO generic SaaS blue, purple, violet, indigo, or neon cyan are permitted anywhere.**

| Role | Hex Code | Tailwind Equivalent / Variable | Purpose |
| :--- | :--- | :--- | :--- |
| **Obsidian (Base)** | `#0A0A0A` | `bg-[#0A0A0A]` / `bg-neutral-950` | Deepest viewport background & canvas floor |
| **Carbon (Surface)** | `#121212` | `bg-[#121212]` / `bg-neutral-900` | Card bodies, drawer sidecars, panel containers |
| **Graphite (Elevated)**| `#1E1E1E` | `bg-[#1E1E1E]` / `bg-neutral-850` | Button surface, active slider track, popover fills |
| **Steel (Border/Hairline)**| `#262626` | `border-[#262626]` / `border-neutral-800` | 1px CAD hairline borders, crosshair reticles |
| **Stark White (Primary)**| `#FFFFFF` | `text-white` | Primary headlines, critical numerical readouts |
| **Bone (Secondary)** | `#CCCCCC` | `text-[#CCCCCC]` / `text-neutral-300` | Descriptive body copy, secondary telemetry |
| **Muted Smoke** | `#737373` | `text-[#737373]` / `text-neutral-500` | Monospace timestamps, git commit hashes, inactive units |
| **Phosphor Amber** | `#FFB000` | `text-[#FFB000]`, `bg-[#FFB000]` | Active state, energy flow, selected node, warning telemetry |
| **Phosphor Emerald** | `#10B981` | `text-[#10B981]`, `bg-[#10B981]` | Nominal status, 100% test pass, verified commit status |
| **Laser Vermilion** | `#FF3333` | `text-[#FF3333]`, `bg-[#FF3333]` | Destructive action, failed pipeline, regression alert |

---

## 2. COMPONENT DIRECTORY INDEX

| File | Category | Curated Sources | Target Page / Section |
| :--- | :--- | :--- | :--- |
| [`01-tactile-actuators-and-buttons.tsx`](./01-tactile-actuators-and-buttons.tsx) | Tactile Actuators & Buttons | Vengeance UI (`vengenceui.com`), Mil-Spec CAD | Hero CTAs, Navbar Actions, Modal Triggers, Phase 1 & Phase 7 |
| [`02-kinetic-typography-and-ciphers.tsx`](./02-kinetic-typography-and-ciphers.tsx) | Kinetic Typography & Ciphers | Aceternity UI, React Bits (`reactbits.dev`) | Section Headers, Commit Hash Badges, Live Telemetry Scramblers |
| [`03-cad-frames-and-spotlight-cards.tsx`](./03-cad-frames-and-spotlight-cards.tsx) | CAD Frames & Spotlight Cards | Aceternity UI (`ui.aceternity.com`), 21st.dev | Metric Cards, Feature Grids, CURISM Breakdown Cards |
| [`04-sliders-and-commit-scrubbers.tsx`](./04-sliders-and-commit-scrubbers.tsx) | Sliders & Time Scrubbers | React Bits Elastic Slider, Git Timeline | Commit History Scrubber, Halstead Complexity Range Scrubber |
| [`05-radar-and-telemetry-visualizations.tsx`](./05-radar-and-telemetry-visualizations.tsx) | Radar & Telemetry Visualizations | 21st.dev LoadingRadar, Visx Radar Blossom | Live AST Scanner, 6-Axis CURISM Radar, Real-Time Health Matrix |
| [`06-graph-nodes-and-flow-canvases.tsx`](./06-graph-nodes-and-flow-canvases.tsx) | Graph Nodes & Flow Canvases | React Flow CAD Nodes, Blueprint System | Interactive Call Graph, Module Dependency Visualizer, Drawer Sidecar |
| [`07-background-grids-and-magnet-lines.tsx`](./07-background-grids-and-magnet-lines.tsx) | Background Grids & Magnet Lines | React Bits Magnet Lines, Aceternity Dot Matrix | CAD Hairline Viewport Canvas, Cursor Proximity Grid, Ruler Guides |
| [`08-vengeance-ui-specialized-primitives.tsx`](./08-vengeance-ui-specialized-primitives.tsx) | Vengeance UI Primitives | Vengeance UI (`vengenceui.com`) | ASCII Ripple, Perspective Grid, Collimated Rays, Light Tracer, Folder Inspect, Notch Nav |
| [`09-aceternity-ui-specialized-primitives.tsx`](./09-aceternity-ui-specialized-primitives.tsx) | Aceternity UI Primitives | Aceternity UI (`ui.aceternity.com`) | Lens Loupe, Compare Slider, Tracing Beam, Moving Border, Card Hover Effect, Floating Dock |
| [`10-21st-dev-specialized-primitives.tsx`](./10-21st-dev-specialized-primitives.tsx) | 21st.dev Specialized Primitives | 21st.dev (`21st.dev`) | Animated File Tree, Terminal Simulator, Circular Gauge, Braille Spinner, Churn Matrix, Prompt Input |
| [`11-shadcn-cad-primitives.tsx`](./11-shadcn-cad-primitives.tsx) | shadcn CAD Primitives | shadcn/ui (`ui.shadcn.com`) | Command Dialog (⌘K), Segmented Tabs, Accordion, Telemetry Table, Precision Tooltip, Resizable Panels |
| [`12-react-bits-specialized-primitives.tsx`](./12-react-bits-specialized-primitives.tsx) | React Bits Primitives | React Bits (`reactbits.dev`) | Text Pressure, True Focus Reticle, Pixel Matrix Card, Shiny Text, Split Text Reveal, Line Waves |
| [`13-collect-ui-specialized-patterns.tsx`](./13-collect-ui-specialized-patterns.tsx) | Collect UI Patterns | Collect UI (`collectui.com`) | Metric Stat Tile w/ Sparkline, Pipeline Stepper, Code Diff Inspector, Hex Cluster, Alert Drawer, Facet Bar |
| [`14-magic-ui-specialized-primitives.tsx`](./14-magic-ui-specialized-primitives.tsx) | Magic UI Primitives | Magic UI (`magicui.design`) | Animated Beam, Orbiting Circles, Number Ticker, Bento Grid, Telemetry Marquee, Hyper Text Scramble |

---

## 3. HOW SUBAGENTS USE THIS DIRECTORY

When executing any subphase in Phase 1 through Phase 7:
1. **Identify the component needed** in your Phase blueprint (e.g. `phase1.md` specifies "Vengeance Pop Button" and "Aceternity Split-Flap").
2. **Open the corresponding reference file** in this directory.
3. **Copy the complete TypeScript component** into your target directory under `src/components/ui/` or `src/components/<feature>/`.
4. **Preserve exact animation timings & easing curves**:
   - Mechanical buttons: Spring damping `stiffness: 450, damping: 25`.
   - Radar sweeps: Constant linear angular velocity `duration: 4s, ease: "linear", repeat: Infinity`.
   - Split-flap: Staggered mechanical flip with audio-tactile snap `duration: 0.35s, ease: [0.16, 1, 0.3, 1]`.
5. **Never import external styling libraries** with pre-baked purple/blue themes. Use the Tailwind class maps and CSS custom properties defined in each component.
