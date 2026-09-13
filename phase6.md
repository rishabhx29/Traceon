# Phase 6: Core App Views & Workstation Refactor — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `phase6.md` (and `docs/phases/phase6.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Phases 1, 2, 3, 4, and 5 Complete and Verified  
> **Authoring Team:** Visual Design, Performance, UI Critic, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

Phase 6 refactors the functional core of Traceon: the actual working application pages where developers and architects analyze repositories, explore AST graphs, and inspect telemetry:
1. **Fullscreen AST Graph Explorer (`/graph/[repoId]` and `/graph`)**: Transformed from a generic ReactFlow playground into a high-density, mission-critical CAD workstation inspired by Palantir Gotham, Bloomberg Terminal, and electronic schematic CAD tools.
2. **Analysis Telemetry Workstation (`/dashboard` and `/analyze`)**: Eradication of generic SaaS dashboards and circular spinners. Replaced with real-time lexical AST token streaming loaders, linear precision progress gauges, and phosphor-stroked telemetry charts.
3. **Deep Profile Analytics (`/profile-analytics` and `/profile`)**: Seamless composition of Phase 5's CURISM Radar, Archetype Carousel, and Squad Matcher with a new interactive **Genome Barcode** and **Verified Manifest Evidence Tree**.

### Core Non-Negotiables:
- **Zero AI-Slop Colors**: Complete elimination of generic SaaS blues (`#3B82F6`), purples (`#8B5CF6`), indigos (`#6366F1`), and pastel gradients. All nodes, edges, charts, and metrics adhere strictly to the **Obsidian Industrial Palette** (Obsidian, Carbon, Steel, Stark White, Phosphor Amber, Phosphor Emerald, Laser Vermilion).
- **No Lenis Scroll Interference (`data-lenis-prevent`)**: The ReactFlow canvas must never fight with the global Lenis smooth scroller. Mouse wheel events inside the graph workstation must zoom/pan the canvas exclusively.
- **60fps Layout Performance via Web Worker**: Dagre graph layout computations for large codebases (>1,000 files) are offloaded to `src/workers/graphLayoutWorker.ts` so the main UI thread never drops frames.
- **Zero Regressions**: All existing data contracts, ReactFlow props, `ProfileData` structures, and API integrations must remain 100% functional.

---

## 2. Color Palette & Workstation Aesthetic Tokens

The functional application views inherit the unified industrial CAD design tokens defined in Phase 1:

| Token Name | Hex Code | Workstation Application |
|:---|:---|:---|
| `--void` | `#050505` | Master screen background, canvas background |
| `--obsidian` | `#0A0A0A` | Workstation control panels, sidecar backdrops, header bar |
| `--carbon` | `#121212` | Node body cards, stat containers, drawer surfaces |
| `--slate` | `#1A1A1A` | Hover states, table row alternates, active tab fills |
| `--steel` | `#262626` | CAD grid lines, structural hairline borders, edge paths |
| `--hairline` | `#333333` | Hairline dividers, subtle crosshairs, minimap frames |
| `--text-stark`| `#FFFFFF` | Primary node labels, critical telemetry values, headers |
| `--text-bone` | `#CCCCCC` | Node file paths, metric titles, secondary metadata |
| `--text-muted`| `#777777` | Timestamps, coordinate labels, line numbers, inactive tabs |
| `--phosphor-amber` | `#FFB000` | Warning nodes, circular loop alerts, primary CTA indicators |
| `--phosphor-emerald` | `#10B981` | Clean nodes, verified tests, git branch stability, health score |
| `--laser-vermilion` | `#FF3333` | Blast radius infected nodes, high cyclomatic complexity, critical vulnerabilities |

---

## 3. Multi-Agent Orchestration & Verification Workflow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          PHASE 6 MULTI-AGENT EXECUTION PIPELINE                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [Agent 10: Agent Orchestrator]                                                       │
│        │                                                                               │
│        ├──► Assigns Subphase 6.1: Web Worker Layout Engine ───► [Implementor Agent]    │
│        │                                                              │                │
│        │                                                              ▼                │
│        │                                                    [Agent 9: Checker Agent]   │
│        │                                                    VERIFICATION GATE 6.1      │
│        │                                                              │                │
│        ├──► Assigns Subphase 6.2: CAD Node & Edge Overhaul ───► [Implementor Agent]    │
│        │                                                              │                │
│        │                                                              ▼                │
│        │                                                    [Agent 9: Checker Agent]   │
│        │                                                    VERIFICATION GATE 6.2      │
│        │                                                              │                │
│        ├──► Assigns Subphase 6.3: Progressive Disclosure ─────► [Implementor Agent]    │
│        │                          Sidecar Panel                       │                │
│        │                                                              ▼                │
│        │                                                    [Agent 9: Checker Agent]   │
│        │                                                    VERIFICATION GATE 6.3      │
│        │                                                              │                │
│        ├──► Assigns Subphase 6.4: Fullscreen Workstation ─────► [Implementor Agent]    │
│        │                          Canvas & Blast Radius Mode          │                │
│        │                                                              ▼                │
│        │                                                    [Agent 9: Checker Agent]   │
│        │                                                    VERIFICATION GATE 6.4      │
│        │                                                              │                │
│        ├──► Assigns Subphase 6.5: Lexical Stream Loader & ────► [Implementor Agent]    │
│        │                          Telemetry Dashboard                 │                │
│        │                                                              ▼                │
│        │                                                    [Agent 9: Checker Agent]   │
│        │                                                    VERIFICATION GATE 6.5      │
│        │                                                              │                │
│        └──► Final App-Wide Zero-Slop Audit & Sign-off ────────► [Agent 9: Checker]     │
│                                                               & [Agent 6: Visual]      │
│                                                               PASS -> Unlock Phase 7   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Granular Subphases & Reference Specifications

---

### Subphase 6.1: Web Worker Layout Engine (`graphLayoutWorker.ts`)

#### Objective:
Offload heavy Dagre hierarchy computations from the browser's main JavaScript thread to a Dedicated Web Worker. Codebases with 1,000+ files cause noticeable frame drops (100ms-400ms freezing) when computed synchronously. The worker receives raw nodes and edges, runs Dagre asynchronously, and posts back exact (x, y) coordinates.

#### Resource Toolkits & Reference Paths to Access:
- `animejs/01-anime-v4-complete-api-reference.ts` — Web Worker message lifecycle coordination and non-blocking layout state callbacks.
- `lenis/06-integrated-cad-motion-controller.ts` — Zero-jank frame timing budget during heavy asynchronous graph computation.

#### Reference Implementation: `src/workers/graphLayoutWorker.ts`
```typescript
/**
 * Web Worker for Dagre Graph Layout Computation.
 * Runs completely off the main thread to guarantee 60fps UI responsiveness.
 */

import dagre from 'dagre';

export interface LayoutWorkerInput {
  nodes: Array<{
    id: string;
    width?: number;
    height?: number;
    [key: string]: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    [key: string]: any;
  }>;
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
}

export interface LayoutWorkerOutput {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    [key: string]: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    [key: string]: any;
  }>;
}

self.onmessage = (event: MessageEvent<LayoutWorkerInput>) => {
  const { nodes, edges, direction = 'TB', nodeWidth = 240, nodeHeight = 90 } = event.data;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width || nodeWidth,
      height: node.height || nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.width || nodeWidth) / 2,
        y: nodeWithPosition.y - (node.height || nodeHeight) / 2,
      },
    };
  });

  self.postMessage({ nodes: positionedNodes, edges } as LayoutWorkerOutput);
};
```

#### Checker Agent Verification Gate 6.1:
- [ ] Worker file compiles cleanly without Next.js Webpack bundler crashes.
- [ ] Main thread remains at 60fps during 2,000-node graph recalculation.
- [ ] Fallback function handles environments where Web Workers are disabled (SSR or legacy browsers).

---

### Subphase 6.2: CAD Blueprint Graph Nodes & Edges (`CustomNode.tsx`)

#### Objective:
Replace all generic rounded pill nodes and pastel blue/purple borders with precision CAD blueprint frames. Each node features:
1. Hairline `--steel` border with active selection amber glow.
2. Status LED indicator: Emerald (healthy/isolated), Amber (high fan-in/fan-out), Vermilion (critical blast radius / circular dependency).
3. Monospace file path, cyclomatic complexity tag, and transitive dependent count badge.
4. Smooth hover micro-interaction displaying exact AST signature.

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/06-graph-nodes-and-flow-canvases.tsx` — `CadNode` & `PulsingDataEdge` (CAD React Flow node geometry, reticles, and pulsing bezier dataflow edges).
- `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIAnimatedBeam` (Directional laser energy pulses across call graph edges).
- `Reference_components/01-tactile-actuators-and-buttons.tsx` — `CADCornerReticleButton` (Precision button triggers on node hover cards).
- `animejs/04-svg-and-canvas-motion.ts` — `SVGPathAnimation` for edge flow pulses and stroke dash-offset travel.
- `animejs/02-spring-and-easing-physics.ts` — `nodeSelectionSpring` (`createSpring({ stiffness: 320, damping: 20 })`).

#### Reference Implementation: `src/components/graph/CustomNode.tsx`
```tsx
'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MonoLabel } from '@/components/ui/MonoLabel';

export interface CustomNodeData {
  label: string;
  filePath: string;
  complexity?: number;
  dependentsCount?: number;
  isBlastInfected?: boolean;
  hasCircularDep?: boolean;
  type?: 'component' | 'utility' | 'hook' | 'api' | 'type';
}

export const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const isBlast = data?.isBlastInfected;
  const isCircular = data?.hasCircularDep;
  const complexity = data?.complexity || 1;

  // Determine LED and border status strictly within Obsidian palette
  let statusColor = '#10B981'; // Phosphor Emerald (Clean)
  let statusBg = 'bg-[#10B981]';
  let borderColor = 'border-[#262626]';
  let shadowGlow = '';

  if (isBlast) {
    statusColor = '#FF3333'; // Laser Vermilion (Infected)
    statusBg = 'bg-[#FF3333]';
    borderColor = 'border-[#FF3333]';
    shadowGlow = '0 0 16px rgba(255, 51, 51, 0.4)';
  } else if (isCircular || complexity > 15) {
    statusColor = '#FFB000'; // Phosphor Amber (Warning)
    statusBg = 'bg-[#FFB000]';
    borderColor = 'border-[#FFB000]';
    shadowGlow = '0 0 12px rgba(255, 176, 0, 0.25)';
  } else if (selected) {
    borderColor = 'border-[#E5E5E5]';
    shadowGlow = '0 0 12px rgba(255, 255, 255, 0.2)';
  }

  return (
    <div
      className={`relative group min-w-[220px] max-w-[280px] bg-[#121212] border ${borderColor} p-3 rounded-none transition-all duration-200`}
      style={{
        boxShadow: shadowGlow || '0 4px 20px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-[#262626] !border !border-[#444444] rounded-none !-top-1"
      />

      {/* CAD Corner Reticles */}
      <span className="absolute -top-[1px] -left-[1px] w-[3px] h-[3px] bg-white opacity-40 pointer-events-none" />
      <span className="absolute -top-[1px] -right-[1px] w-[3px] h-[3px] bg-white opacity-40 pointer-events-none" />
      <span className="absolute -bottom-[1px] -left-[1px] w-[3px] h-[3px] bg-white opacity-40 pointer-events-none" />
      <span className="absolute -bottom-[1px] -right-[1px] w-[3px] h-[3px] bg-white opacity-40 pointer-events-none" />

      {/* Header Row: LED + File Name */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusBg} flex-shrink-0 animate-pulse`}
            style={{ boxShadow: `0 0 6px ${statusColor}` }}
          />
          <span className="font-mono text-xs font-semibold text-white truncate tracking-tight">
            {data?.label || 'unnamed.ts'}
          </span>
        </div>
        {data?.type && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#777777] bg-[#1A1A1A] px-1 py-0.5 border border-[#262626]">
            {data.type}
          </span>
        )}
      </div>

      {/* Secondary Metadata Row */}
      <div className="text-[10px] font-mono text-[#777777] truncate mb-2">
        {data?.filePath || 'src/root'}
      </div>

      {/* Metrics Footer Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-[#262626]/80 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-[#888888]">
          <span>CC:</span>
          <span className={complexity > 10 ? 'text-[#FFB000] font-bold' : 'text-[#CCCCCC]'}>
            {complexity}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#888888]">
          <span>DEPS:</span>
          <span className="text-[#CCCCCC]">{data?.dependentsCount ?? 0}</span>
        </div>
        {isBlast && (
          <span className="text-[#FF3333] font-bold tracking-widest text-[9px]">
            INFECTED
          </span>
        )}
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-[#262626] !border !border-[#444444] rounded-none !-bottom-1"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
```

#### Checker Agent Verification Gate 6.2:
- [ ] No indigo, purple, or generic blue styling classes remain in `CustomNode.tsx`.
- [ ] Handles connect cleanly at top and bottom without clipping.
- [ ] Nodes scale cleanly under canvas zoom levels from 0.2x to 2.0x.

---

### Subphase 6.3: Progressive Disclosure Sidecar (`NodeDetailSidecar.tsx`)

#### Objective:
Clicking any node on the graph must immediately summon a progressive disclosure CAD inspection panel sliding in from the right edge.
- Panel uses mechanical spring physics (`power3.out`, duration 0.35s).
- Displays: AST Node Class, Cyclomatic Risk Score, Incoming Callers, Outgoing Callees, and Transitive Impact Radius.
- Interactive "Focus Node in Canvas" and "Simulate Blast Radius from Here" buttons.

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/06-graph-nodes-and-flow-canvases.tsx` — `NodeDetailSidecar` (CAD sliding sidecar panel architecture with monospace telemetry rows).
- `Reference_components/11-shadcn-cad-primitives.tsx` — `CADResizablePanels`, `CADTelemetryTable`, & `CADAccordion` (Collapsible AST property inspector).
- `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUICodeDiffInspector` & `CollectUIMetricStatCard` (Code diff preview and node metric stat tiles).
- `animejs/02-spring-and-easing-physics.ts` — Sidecar drawer slide spring physics (`createSpring({ mass: 1, stiffness: 300, damping: 24 })`).
- `gsap/01-gsap-core-and-timelines.ts` — `gsap.to(drawerRef.current, { x: 0, duration: 0.35, ease: 'power3.out' })`.

#### Reference Implementation: `src/components/graph/NodeDetailSidecar.tsx`
```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PopActuator } from '@/components/ui/PopActuator';
import { CustomNodeData } from './CustomNode';

export interface NodeDetailSidecarProps {
  node: {
    id: string;
    data: CustomNodeData;
  } | null;
  onClose: () => void;
  onSimulateBlast: (nodeId: string) => void;
  onFocusNode: (nodeId: string) => void;
}

export const NodeDetailSidecar: React.FC<NodeDetailSidecarProps> = ({
  node,
  onClose,
  onSimulateBlast,
  onFocusNode,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { x: '100%', opacity: 0.8 },
        { x: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [node]);

  if (!node) return null;

  const { data } = node;

  return (
    <div
      ref={panelRef}
      className="absolute top-0 right-0 bottom-0 w-96 bg-[#0A0A0A]/95 backdrop-blur-md border-l border-[#262626] z-50 flex flex-col shadow-2xl"
    >
      {/* CAD Header Bar */}
      <div className="flex items-center justify-between p-4 border-b border-[#262626] bg-[#121212]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFB000] animate-pulse" />
          <MonoLabel text="AST NODE INSPECTION" size="xs" color="amber" />
        </div>
        <button
          onClick={onClose}
          className="text-[#777777] hover:text-white font-mono text-xs px-2 py-1 border border-transparent hover:border-[#333333] transition-colors"
          aria-label="Close Inspector"
        >
          [ESC] ✕
        </button>
      </div>

      {/* Body Metadata Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6" data-lenis-prevent>
        {/* Node Identification */}
        <div>
          <span className="text-[10px] font-mono text-[#777777] uppercase tracking-wider block mb-1">
            File Identifier
          </span>
          <h3 className="font-mono text-base font-bold text-white break-all">
            {data.label}
          </h3>
          <p className="font-mono text-xs text-[#888888] mt-1 break-all">
            {data.filePath}
          </p>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#121212] border border-[#262626] p-3">
            <span className="text-[9px] font-mono text-[#777777] uppercase block">
              Cyclomatic Risk
            </span>
            <span className="font-mono text-xl font-bold text-white mt-0.5 block">
              {data.complexity || 1}
            </span>
            <span className="text-[9px] font-mono text-[#10B981]">
              {(data.complexity || 1) < 10 ? 'LOW COUPLING' : 'HIGH RISK'}
            </span>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-3">
            <span className="text-[9px] font-mono text-[#777777] uppercase block">
              Dependents
            </span>
            <span className="font-mono text-xl font-bold text-white mt-0.5 block">
              {data.dependentsCount || 0}
            </span>
            <span className="text-[9px] font-mono text-[#777777]">
              DOWNSTREAM CALLERS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-4 border-t border-[#262626]">
          <PopActuator
            label="Simulate Blast Radius"
            led="vermilion"
            variant="danger"
            onClick={() => onSimulateBlast(node.id)}
            className="w-full text-xs"
          />
          <PopActuator
            label="Focus Node in Canvas"
            led="amber"
            variant="secondary"
            onClick={() => onFocusNode(node.id)}
            className="w-full text-xs"
          />
        </div>
      </div>

      {/* Workstation Footer Status */}
      <div className="p-3 border-t border-[#262626] bg-[#0A0A0A] text-[9px] font-mono text-[#555555] flex justify-between">
        <span>STATUS: MOUNTED</span>
        <span>ID: {node.id.slice(0, 12)}</span>
      </div>
    </div>
  );
};
```

#### Checker Agent Verification Gate 6.3:
- [ ] Sidecar contains `data-lenis-prevent` on scrollable areas.
- [ ] Closing sidecar animates smoothly offscreen without leaving orphaned overlays.
- [ ] Pressing `Escape` on the keyboard closes the sidecar cleanly.

---

### Subphase 6.4: Fullscreen Graph Workstation Layout (`src/app/graph/[repoId]/page.tsx`)

#### Objective:
Structure the graph explorer as an edge-to-edge CAD viewport:
1. Graph container strictly carries `data-lenis-prevent` so canvas zoom/pan works seamlessly.
2. Floating CAD toolbars: Minimap toggle, layout direction switcher (TB vs LR), Blast Radius mode toggle, Search filter.
3. Canvas background uses `#050505` with subtle dot-matrix CAD grid (`#1A1A1A`).

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/10-21st-dev-specialized-primitives.tsx` — `AnimatedFileTree` & `TerminalSimulator` (Interactive file explorer side-drawer and terminal diagnostic feed).
- `Reference_components/08-vengeance-ui-specialized-primitives.tsx` — `VengeanceFolderInspect` (Monospace directory explorer with CAD notch).
- `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUIFilterFacetBar` (Facet filtering for AST node types and files).
- `lenis/06-integrated-cad-motion-controller.ts` — `data-lenis-prevent` scroll containment pattern for the active WebGL/ReactFlow canvas.

#### Key Integration Code Snippet:
```tsx
<div
  className="relative w-full h-[calc(100vh-64px)] bg-[#050505] overflow-hidden select-none"
  data-lenis-prevent
>
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    nodeTypes={nodeTypes}
    fitView
    minZoom={0.1}
    maxZoom={2.5}
    proOptions={{ hideAttribution: true }}
    className="bg-[#050505]"
  >
    <Background color="#222222" gap={20} size={1} />
    <Controls className="!bg-[#121212] !border !border-[#262626] !fill-white !text-white" />
    <MiniMap
      nodeStrokeColor="#444444"
      nodeColor="#1A1A1A"
      maskColor="rgba(0, 0, 0, 0.75)"
      className="!bg-[#0A0A0A] !border !border-[#262626]"
    />
  </ReactFlow>

  {/* Floating Workstation HUD Controls */}
  <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-[#0A0A0A]/90 border border-[#262626] p-1.5 backdrop-blur-md">
    <PopActuator
      label={blastMode ? 'Exit Blast Radius' : 'Blast Radius Mode'}
      led={blastMode ? 'vermilion' : 'amber'}
      variant={blastMode ? 'danger' : 'secondary'}
      onClick={() => setBlastMode(!blastMode)}
      className="text-xs"
    />
  </div>

  {/* Progressive Disclosure Sidecar */}
  <NodeDetailSidecar
    node={selectedNode}
    onClose={() => setSelectedNode(null)}
    onSimulateBlast={triggerBlastSimulation}
    onFocusNode={focusNodeInCanvas}
  />
</div>
```

#### Checker Agent Verification Gate 6.4:
- [ ] No page scrolling occurs when scrolling inside the graph canvas.
- [ ] Toggling Blast Radius Mode turns downstream connected nodes into vermilion states.
- [ ] Minimap and Controls match the obsidian dark theme.

---

### Subphase 6.5: Lexical Stream Loader & Telemetry Refactor (`/dashboard`, `/analyze`)

#### Objective:
Replace generic spinners in repository analysis views with the **Lexical AST Stream Loader** (`LexicalStreamLoader.tsx`).
- Simulates live tokenizer lexical stream (e.g. `TOKEN_IMPORT`, `TOKEN_IDENTIFIER`, `AST_BUILD_NODE`).
- Displays linear mechanical progress bar with micro-step diagnostics.
- Re-styles all dashboard metric cards and charts with monochrome dark borders and phosphor lines.

#### Resource Toolkits & Reference Paths to Access:
- `Reference_components/10-21st-dev-specialized-primitives.tsx` — `TerminalSimulator` & `BrailleSpinner` (Monospace terminal stream and tactile braille spinner).
- `Reference_components/02-kinetic-typography-and-ciphers.tsx` — `MonospaceDecryptionCipher` (Token decrypt scrambler on lexical completion).
- `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIHyperText` (Alphanumeric cyber scramble during tokenizer stream).
- `animejs/03-stagger-and-timeline-choreography.ts` — Staggered line reveal timeline for AST tokenizer events.

#### Reference Implementation: `src/components/dashboard/LexicalStreamLoader.tsx`
```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { MonoLabel } from '@/components/ui/MonoLabel';

const TOKENS = [
  'SCANNING: ./src/components/core/ast.ts',
  'PARSE_DECL: function traverseAST(node: ASTNode)',
  'RESOLVING: import { CatmullRomCurve3 } from "three"',
  'CYCLOMATIC: computeComplexity(weights, fanOut)',
  'CALCULATING: blast_radius_depth_matrix',
  'CURISM_GENOME: evaluating Curiosity vs Rigor',
  'COMPILATION: DAG nodes synchronized: 1,482',
  'VERIFIED: zero circular deadlocks detected',
];

export const LexicalStreamLoader: React.FC<{ progress?: number }> = ({ progress = 42 }) => {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % TOKENS.length);
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-[#0A0A0A] border border-[#262626] font-mono">
      {/* Header telemetry */}
      <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFB000] animate-pulse" />
          <MonoLabel text="LEXICAL AST COMPILATION STREAM" size="xs" color="amber" />
        </div>
        <span className="text-xs text-[#777777]">{progress}%</span>
      </div>

      {/* Terminal Token Waterfall */}
      <div className="h-28 overflow-hidden font-mono text-xs text-[#888888] space-y-1 select-none">
        {TOKENS.slice(Math.max(0, currentLine - 3), currentLine + 1).map((tok, idx) => (
          <div
            key={idx}
            className={idx === 3 || idx === currentLine ? 'text-white font-semibold' : 'opacity-60'}
          >
            <span className="text-[#FFB000] mr-2">›</span>
            {tok}
          </div>
        ))}
      </div>

      {/* Precision Industrial Progress Bar */}
      <div className="w-full h-1 bg-[#1A1A1A] mt-4 overflow-hidden relative">
        <div
          className="h-full bg-[#FFB000] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Diagnostic Subtext */}
      <div className="flex justify-between items-center mt-3 text-[10px] text-[#555555]">
        <span>AST THREAD: WORKER_POOL_#04</span>
        <span>FRAME TIME: 16.6ms (60 FPS)</span>
      </div>
    </div>
  );
};
```

#### Checker Agent Verification Gate 6.5:
- [ ] No generic circular spinning wheels on `/analyze` or `/dashboard`.
- [ ] Recharts line graphs and bar graphs utilize `#FFB000` (Amber) and `#10B981` (Emerald) strokes on dark backgrounds.
- [ ] Zero AI slop colors remain on the page.

---

## 5. Backward Compatibility & Regression Checklist

- [ ] **Route Continuity**: `/graph/[repoId]`, `/graph`, `/dashboard`, `/analyze`, and `/profile-analytics` routes load with 200 HTTP status.
- [ ] **ReactFlow Event Integrity**: Node click, drag, and edge connection events trigger expected state mutations.
- [ ] **`ProfileData` Props**: Ensure all profile subcomponents continue supporting optional `data?: ProfileData`.
- [ ] **TypeScript Strictness**: `npm run build` succeeds with 0 errors across all app routes.

---

## 6. Multi-Agent Sign-off Matrix

| Subphase | Implementor Agent | Checker Agent (Agent 9) | Visual Designer (Agent 6) | Status |
|:---|:---|:---|:---|:---|
| **6.1: Layout Worker** | Offload Dagre to worker | Main thread 60fps verified | N/A | PENDING APPROVAL |
| **6.2: CAD Nodes** | Build CustomNode & edges | Purge blue/purple confirmed | CAD style sign-off | PENDING APPROVAL |
| **6.3: Sidecar Panel** | Build NodeDetailSidecar | Escape key & lenis prevent check | Kinetic motion sign-off | PENDING APPROVAL |
| **6.4: Graph Workstation**| Assemble fullscreen view | Canvas scroll isolation verified | HUD layout sign-off | PENDING APPROVAL |
| **6.5: Telemetry Stream** | Build LexicalStreamLoader | Zero generic spinners verified | Telemetry aesthetic sign-off | PENDING APPROVAL |
