# Phase 3: The 3D Interactive Hero Experience & Volumetric Code Nucleus — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/phases/phase3.md` (and root `phase3.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Phase 1 and Phase 2 Complete and Verified  
> **Authoring Team:** 3D Graphics, Visual Design, Performance, UI Critic, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

The hero section defines the emotional and technical tone of Traceon. The user explicitly directed:
> *"Check if the 3d animation that we are using is not just a floating terminal card with interactive Tree but some actual 3d component which is interactive upon scroll or clicking like some cool animations."*

Phase 3 builds the **Volumetric Code Nucleus** — a bespoke, interactive 3D WebGL spatial model that mathematically visualizes an abstract syntax tree (AST), dependency tensions, and architectural blast radiuses in real time.

### Core Visual Metaphor:
A living codebase is not a static flat diagram; it is a tense, interconnected physical system.
- The **Nucleus Core** represents the central architectural kernel (framework runtime, core engine).
- The **Satellite Nodes** represent peripheral modules (`astParser.ts`, `blastRadius.ts`, `graphEngine.ts`, etc.).
- The **Tension Splines** represent structural imports and call hierarchies. When a module experiences breaking changes or circular loops, the tension splines vibrate and shift into seismic vermilion.

---

## 2. Multi-Agent Orchestration & Simultaneous Collaboration Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 3 MULTI-AGENT EXECUTION FLOW                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   [Agent 10: Agent Orchestrator]                                                      │
│        │                                                                              │
│        ├──► Assigns Subphase 3.1 (CAD Fallback) ────────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 3.1           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 3.2 (3D Nucleus Scene) ────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 3.2           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 3.3 (Morphing & Physics) ──► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 3.3           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 3.4 (Canvas Wrapper) ──────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 3.4           │
│        │                                                        │                     │
│        └──► Final 3D Performance Audit ─────────────────► [Agent 9: Checker Agent]    │
│                                                       & [Agent 8: Perf Agent]         │
│                                                       PASS -> Unlock Phase 4          │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Subagent Roles & Mandates:
1. **`agent-orchestrator-workflow-mgr`**:
   - Ensures the 2D CAD fallback is completely implemented before WebGL Canvas is initialized.
   - Prevents SSR crashes by enforcing dynamic imports with `ssr: false`.
2. **`phase3-3d-scene-implementor`**:
   - Constructs the Three.js geometries, materials, lights, and HTML billboard overlays.
3. **`ui-critic-qa-agent` (The Checker Agent)**:
   - Audits WebGL context loss handling (unplugged GPU, disabled hardware acceleration).
   - Validates that zero blue/purple/cyan colors exist in 3D materials, lights, or HTML overlays.
   - Confirms that clicking a satellite node immediately displays the HTML billboard DataHUD with cyclomatic complexity and blast score.
4. **`performance-tech-feasibility-researcher`**:
   - Measures draw calls (must remain under 35 draw calls).
   - Verifies dynamic pixel ratio (`dpr={[1, 2]}`) to prevent overheating high-DPI displays.
   - Confirms that OrbitControls has `enableZoom={false}` to prevent stealing scroll wheel gestures from Lenis.

---

## 3. 3D Architectural Architecture & State Morphing

### 3.1 The 4 Scroll-Driven Morphing States
The Nucleus dynamically reorganizes its 3D geometry based on the user's scroll progress:

| Stage | Scroll Progress | Visual Transformation | Metaphor |
| :--- | :--- | :--- | :--- |
| **Stage 1: Opaque Monolith** | `0.00 – 0.20` | Dense, contracted polyhedral core. Slow gyroscopic tumbling on X/Y axes. Amber wireframe glowing faintly. | Untraced legacy codebase |
| **Stage 2: AST Exploded View** | `0.20 – 0.50` | Satellite nodes expand outward along surface normals (1.9x factor). Tension splines stretch and illuminate in Phosphor Emerald. | Complete lexical decomposition |
| **Stage 3: Blast Shockwave** | `0.50 – 0.75` | High-frequency vertex displacement ripples. Core and affected nodes shift into Seismic Vermilion (`#EF4444`). | Blast radius impact prediction |
| **Stage 4: Genomic Double Helix** | `0.75 – 1.00` | Satellite nodes spiral and reorganize into two vertical intertwined helices. CURISM capability rungs light up. | Developer DNA mapping |

### 3.2 Lighting & Material Rig
- **Ambient Light**: `intensity={0.3}`, clean neutral illumination.
- **Directional Key Light**: `position={[5, 8, 5]}`, `intensity={0.8}`, color `#F5F5F7`.
- **Core Internal Point Light**: `position={[0, 0, 0]}`, `intensity={1.2}`, color `#F59E0B` (Cadmium Amber), distance `6`.
- **Core Material**: `MeshStandardMaterial` with `color="#0A0A0C"`, `metalness=0.9`, `roughness=0.15`, flat-shaded faceting.
- **Lattice Wireframe Cage**: `MeshBasicMaterial` with `wireframe=true`, `color="#F59E0B"`, `opacity=0.85`.

---

## 4. Complete Reference Code & Implementation Specifications

### 4.1 `src/components/hero/CodeNucleusFallback.tsx`
```typescript
'use client';

import React from 'react';
import { MonoLabel } from '@/components/ui/MonoLabel';

export function CodeNucleusFallback() {
  return (
    <div className="relative w-full h-[480px] md:h-[580px] flex items-center justify-center border border-[#1E1E24] bg-[#050506] overflow-hidden select-none">
      {/* Background CAD Grid */}
      <div className="absolute inset-0 wireframe-grid opacity-30 pointer-events-none" />

      {/* Crosshair corners */}
      <span className="absolute top-2 left-2 text-[#7A7A85] text-[10px] font-mono">+</span>
      <span className="absolute top-2 right-2 text-[#7A7A85] text-[10px] font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[#7A7A85] text-[10px] font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[#7A7A85] text-[10px] font-mono">+</span>

      {/* Telemetry coordinate stamp */}
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
        <MonoLabel className="text-[9px]">VOLUMETRIC NUCLEUS // 2D ARCHITECTURAL SCHEMATIC</MonoLabel>
      </div>

      {/* Central SVG Schematic Wireframe */}
      <svg
        viewBox="0 0 600 600"
        className="w-[320px] h-[320px] md:w-[440px] md:h-[440px] animate-[spin_60s_linear_infinite]"
      >
        <circle cx="300" cy="300" r="260" fill="none" stroke="#1E1E24" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="300" cy="300" r="200" fill="none" stroke="#1E1E24" strokeWidth="1" />
        <circle cx="300" cy="300" r="130" fill="none" stroke="#1E1E24" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="300" cy="300" r="70" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />

        <polygon
          points="300,240 352,270 352,330 300,360 248,330 248,270"
          fill="#0A0A0C"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <polygon
          points="300,255 339,277 339,323 300,345 261,323 261,277"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="0.75"
          opacity="0.6"
        />

        <line x1="300" y1="240" x2="300" y2="100" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="352" y1="270" x2="480" y2="200" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="352" y1="330" x2="470" y2="420" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="300" y1="360" x2="300" y2="500" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="248" y1="330" x2="130" y2="400" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="248" y1="270" x2="120" y2="200" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

        <circle cx="300" cy="100" r="8" fill="#121215" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="480" cy="200" r="10" fill="#121215" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="470" cy="420" r="7" fill="#121215" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="300" cy="500" r="9" fill="#121215" stroke="#EF4444" strokeWidth="1.5" />
        <circle cx="130" cy="400" r="8" fill="#121215" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="120" cy="200" r="6" fill="#121215" stroke="#10B981" strokeWidth="1.5" />
      </svg>

      <div className="absolute bottom-3 right-4 font-mono text-[10px] text-[#7A7A85] flex items-center gap-3">
        <span>NODES: 24 ACTIVE</span>
        <span className="text-[#1E1E24]">|</span>
        <span>EDGES: 48 MAPPED</span>
        <span className="text-[#1E1E24]">|</span>
        <span className="text-[#10B981]">HEALTH: 98.4%</span>
      </div>
    </div>
  );
}

export default CodeNucleusFallback;
```

---

### 4.2 `src/components/hero/NucleusScene.tsx`
```typescript
'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

export interface SatelliteData {
  id: string;
  name: string;
  complexity: number;
  blastScore: number;
  status: 'clean' | 'warning' | 'critical';
  basePos: [number, number, number];
  dnaPos: [number, number, number];
}

interface NucleusSceneProps {
  scrollProgress?: number;
  onNodeClick?: (node: SatelliteData) => void;
  shockwaveActive?: boolean;
}

const MODULES_DATA: SatelliteData[] = [
  { id: '1', name: 'astParser.ts', complexity: 14, blastScore: 32, status: 'clean', basePos: [2.2, 1.1, 0.8], dnaPos: [1.2, 2.5, 0.5] },
  { id: '2', name: 'blastRadius.ts', complexity: 28, blastScore: 88, status: 'critical', basePos: [-2.4, 0.8, -1.2], dnaPos: [-1.2, 1.8, -0.5] },
  { id: '3', name: 'curismVector.ts', complexity: 19, blastScore: 45, status: 'warning', basePos: [1.8, -1.6, 1.4], dnaPos: [1.2, 1.1, -0.5] },
  { id: '4', name: 'graphEngine.ts', complexity: 22, blastScore: 76, status: 'warning', basePos: [-1.9, -1.2, 1.8], dnaPos: [-1.2, 0.4, 0.5] },
  { id: '5', name: 'squadMatcher.ts', complexity: 11, blastScore: 18, status: 'clean', basePos: [0.6, 2.3, -1.5], dnaPos: [1.2, -0.3, 0.5] },
  { id: '6', name: 'circularDetector.ts', complexity: 34, blastScore: 92, status: 'critical', basePos: [-1.2, 2.1, 1.6], dnaPos: [-1.2, -1.0, -0.5] },
  { id: '7', name: 'halsteadMetric.ts', complexity: 16, blastScore: 38, status: 'clean', basePos: [2.4, -0.4, -1.7], dnaPos: [1.2, -1.7, -0.5] },
  { id: '8', name: 'monorepoMapper.ts', complexity: 25, blastScore: 68, status: 'warning', basePos: [-2.1, -1.8, -0.9], dnaPos: [-1.2, -2.4, 0.5] },
];

export function NucleusScene({
  scrollProgress = 0,
  onNodeClick,
  shockwaveActive = false,
}: NucleusSceneProps) {
  const coreRef = useRef<THREE.Group | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SatelliteData | null>(null);
  const [selectedNode, setSelectedNode] = useState<SatelliteData | null>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x += delta * 0.08;

      if (shockwaveActive) {
        coreRef.current.position.x = (Math.random() - 0.5) * 0.08;
        coreRef.current.position.y = (Math.random() - 0.5) * 0.08;
      } else {
        coreRef.current.position.set(0, 0, 0);
      }
    }

    if (coreMeshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const morphRatio = useMemo(() => {
    if (scrollProgress < 0.3) return 0;
    return Math.min(1, (scrollProgress - 0.3) / 0.6);
  }, [scrollProgress]);

  const explodeFactor = useMemo(() => {
    if (scrollProgress <= 0.1) return 1;
    if (scrollProgress <= 0.4) return 1 + (scrollProgress - 0.1) * 3;
    return 1.9 - (scrollProgress - 0.4) * 0.8;
  }, [scrollProgress]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#F5F5F7" />
      <pointLight position={[-4, -3, -4]} intensity={0.5} color="#F59E0B" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#F59E0B" distance={6} />

      <group ref={coreRef}>
        {/* Core Solid & Wireframe */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <group>
            <mesh ref={coreMeshRef}>
              <icosahedronGeometry args={[1.0, 0]} />
              <meshStandardMaterial color="#0A0A0C" metalness={0.9} roughness={0.15} flatShading />
            </mesh>

            <mesh>
              <icosahedronGeometry args={[1.08, 0]} />
              <meshBasicMaterial color={shockwaveActive ? '#EF4444' : '#F59E0B'} wireframe transparent opacity={0.85} />
            </mesh>

            <mesh>
              <dodecahedronGeometry args={[1.3, 0]} />
              <meshBasicMaterial color="#7A7A85" wireframe transparent opacity={0.2} />
            </mesh>
          </group>
        </Float>

        {/* Orbiting Satellites and Tension Splines */}
        {MODULES_DATA.map((node) => {
          const currentX = (node.basePos[0] * (1 - morphRatio) + node.dnaPos[0] * morphRatio) * explodeFactor;
          const currentY = (node.basePos[1] * (1 - morphRatio) + node.dnaPos[1] * morphRatio) * (morphRatio > 0.5 ? 1.2 : explodeFactor);
          const currentZ = (node.basePos[2] * (1 - morphRatio) + node.dnaPos[2] * morphRatio) * explodeFactor;

          const isHovered = hoveredNode?.id === node.id;
          const isSelected = selectedNode?.id === node.id;

          const nodeColor =
            node.status === 'critical' || shockwaveActive
              ? '#EF4444'
              : node.status === 'warning'
              ? '#F59E0B'
              : '#10B981';

          const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(currentX, currentY, currentZ)];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);

          return (
            <group key={node.id}>
              <primitive
                object={
                  new THREE.Line(
                    lineGeometry,
                    new THREE.LineBasicMaterial({
                      color: isHovered || isSelected ? '#F59E0B' : nodeColor,
                      transparent: true,
                      opacity: isHovered || isSelected ? 0.8 : 0.3,
                    })
                  )
                }
              />

              <mesh
                position={[currentX, currentY, currentZ]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredNode(node);
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  setHoveredNode(null);
                  document.body.style.cursor = 'auto';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                  onNodeClick?.(node);
                }}
                scale={isHovered || isSelected ? 1.4 : 1.0}
              >
                <octahedronGeometry args={[0.22, 0]} />
                <meshStandardMaterial
                  color="#121215"
                  emissive={nodeColor}
                  emissiveIntensity={isHovered || isSelected ? 0.9 : 0.4}
                  metalness={0.7}
                  roughness={0.2}
                />

                <mesh>
                  <octahedronGeometry args={[0.26, 0]} />
                  <meshBasicMaterial color={nodeColor} wireframe transparent opacity={0.6} />
                </mesh>

                {(isHovered || isSelected) && (
                  <Html position={[0.35, 0.35, 0]} distanceFactor={8} zIndexRange={[100, 0]}>
                    <div className="border border-[#1E1E24] bg-[#0A0A0C]/95 p-2 rounded-sm shadow-xl min-w-[140px] pointer-events-none select-none font-mono">
                      <div className="flex items-center gap-1.5 border-b border-[#1E1E24] pb-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: nodeColor }} />
                        <span className="text-[11px] font-bold text-[#F5F5F7] truncate">{node.name}</span>
                      </div>
                      <div className="space-y-0.5 text-[9px] text-[#7A7A85]">
                        <div className="flex justify-between">
                          <span>Complexity:</span>
                          <span className="text-[#D1D1D6]">{node.complexity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blast Score:</span>
                          <span className={node.blastScore > 70 ? 'text-[#EF4444] font-bold' : node.blastScore > 40 ? 'text-[#F59E0B]' : 'text-[#10B981]'}>
                            {node.blastScore}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="uppercase text-[#D1D1D6]">{node.status}</span>
                        </div>
                      </div>
                    </div>
                  </Html>
                )}
              </mesh>
            </group>
          );
        })}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.6}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

export default NucleusScene;
```

---

### 4.3 `src/components/hero/CodeNucleus.tsx`
```typescript
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PopActuator } from '@/components/ui/PopActuator';
import { CodeNucleusFallback } from './CodeNucleusFallback';
import type { SatelliteData } from './NucleusScene';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

const NucleusScene = dynamic(() => import('./NucleusScene').then((m) => m.NucleusScene), {
  ssr: false,
  loading: () => <CodeNucleusFallback />,
});

interface CodeNucleusProps {
  scrollProgress?: number;
  className?: string;
}

export function CodeNucleus({ scrollProgress = 0, className = '' }: CodeNucleusProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [inspectedNode, setInspectedNode] = useState<SatelliteData | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleTriggerShockwave = () => {
    if (shockwaveActive) return;
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 1800);
  };

  if (hasWebGL === false) return <CodeNucleusFallback />;

  return (
    <div className={`relative w-full h-[480px] md:h-[620px] border border-[#1E1E24] bg-[#050506] rounded-sm overflow-hidden select-none ${className}`}>
      {/* 4 Corner Crosshairs */}
      <span className="absolute top-2 left-2 text-[#7A7A85] text-[10px] font-mono leading-none z-20 pointer-events-none">+</span>
      <span className="absolute top-2 right-2 text-[#7A7A85] text-[10px] font-mono leading-none z-20 pointer-events-none">+</span>
      <span className="absolute bottom-2 left-2 text-[#7A7A85] text-[10px] font-mono leading-none z-20 pointer-events-none">+</span>
      <span className="absolute bottom-2 right-2 text-[#7A7A85] text-[10px] font-mono leading-none z-20 pointer-events-none">+</span>

      <div className="absolute inset-0 wireframe-grid opacity-25 pointer-events-none z-0" />

      {/* TOP HUD */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0A0A0C]/90 px-2.5 py-1 border border-[#1E1E24] rounded-sm backdrop-blur-sm">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              shockwaveActive ? 'bg-[#EF4444] shadow-[0_0_8px_#EF4444] animate-ping' : 'bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]'
            }`}
          />
          <MonoLabel className="text-[9px]">
            VOLUMETRIC NUCLEUS // STAGE: {scrollProgress > 0.6 ? 'GENOME.HELIX' : scrollProgress > 0.2 ? 'AST.EXPLODED' : 'OPAQUE.MONOLITH'}
          </MonoLabel>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-[#0A0A0C]/90 px-2.5 py-1 border border-[#1E1E24] rounded-sm backdrop-blur-sm text-[9px] font-mono text-[#7A7A85]">
          <span>FPS: 60 LCK</span>
          <span className="text-[#1E1E24]">|</span>
          <span>SATELLITES: 8</span>
          <span className="text-[#1E1E24]">|</span>
          <span>CAM: PERSPECTIVE</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
        {hasWebGL && (
          <Suspense fallback={<CodeNucleusFallback />}>
            <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
              <NucleusScene
                scrollProgress={scrollProgress}
                onNodeClick={(node) => setInspectedNode(node)}
                shockwaveActive={shockwaveActive}
              />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* BOTTOM HUD */}
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#0A0A0C]/90 p-1 border border-[#1E1E24] rounded-sm backdrop-blur-sm">
          <PopActuator
            size="sm"
            ledColor={shockwaveActive ? 'seismic' : 'amber'}
            onClick={handleTriggerShockwave}
            disabled={shockwaveActive}
          >
            {shockwaveActive ? 'Propagating Shockwave...' : 'Simulate Blast Radius'}
          </PopActuator>
        </div>

        {inspectedNode ? (
          <div className="hidden sm:flex items-center gap-3 bg-[#0A0A0C]/95 border border-[#1E1E24] px-3 py-1.5 rounded-sm shadow-xl font-mono text-xs">
            <div className="flex items-center gap-1.5 text-[#F5F5F7] font-bold">
              {inspectedNode.status === 'critical' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
              ) : inspectedNode.status === 'warning' ? (
                <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              )}
              <span>{inspectedNode.name}</span>
            </div>
            <span className="text-[#1E1E24]">|</span>
            <span className="text-[10px] text-[#7A7A85]">
              Blast: <span className="text-[#F5F5F7]">{inspectedNode.blastScore}/100</span>
            </span>
            <span className="text-[#1E1E24]">|</span>
            <span className="text-[10px] text-[#7A7A85]">
              Complexity: <span className="text-[#F5F5F7]">{inspectedNode.complexity}</span>
            </span>
            <button onClick={() => setInspectedNode(null)} className="text-[#7A7A85] hover:text-[#F5F5F7] ml-2 text-[10px] cursor-pointer">
              [CLOSE]
            </button>
          </div>
        ) : (
          <div className="hidden sm:block font-mono text-[9px] text-[#7A7A85] bg-[#0A0A0C]/90 px-2.5 py-1 border border-[#1E1E24] rounded-sm backdrop-blur-sm pointer-events-none">
            [CLICK & DRAG TO ORBIT // CLICK NODES TO INSPECT]
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeNucleus;
```

---

## 5. Granular Subphase Breakdown & Execution Plan

### Subphase 3.1: 2D CAD Blueprint Fallback
- **Target File**: `src/components/hero/CodeNucleusFallback.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/07-background-grids-and-magnet-lines.tsx` — `MagnetLinesGrid` & `AceternityCanvasRevealDots` (Precision 2D drafting matrix and coordinate dots).
  * `Reference_components/12-react-bits-specialized-primitives.tsx` — `ReactBitsLineWaves` (Canvas wireframe oscillating waveform mesh).
  * `Reference_components/08-vengeance-ui-specialized-primitives.tsx` — `VengeancePerspectiveGridFloor` (Hairline isometric CAD floor projection).
  * `animejs/04-svg-and-canvas-motion.ts` — `Canvas2DRadialParticleSystem` and SVG path animation loops.
- **Checker Agent Gate 3.1**:
  - [ ] Verifies purely vector-based SVG rendering without dependencies on WebGL or R3F.
  - [ ] Confirms exact dimensional match with Canvas container (`480px` / `620px`).

### Subphase 3.2: 3D Nucleus Scene & Geometries
- **Target File**: `src/components/hero/NucleusScene.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIOrbitingCircles` (Concentric orbital radius mathematical projection).
  * `Reference_components/05-radar-and-telemetry-visualizations.tsx` — `HexagonalCurismRadar` (Multi-axis 3D wireframe radar vertices).
  * `animejs/05-three-fiber-and-webgl-integration.ts` — `ThreeFiberAnimeController`, `animateMeshPosition`, and R3F frame loop binding.
  * `animejs/02-spring-and-easing-physics.ts` — `orbitalDecaySpring` for satellite inertia and mouse repulsion damping.
- **Checker Agent Gate 3.2**:
  - [ ] Verifies icosahedron core, 8 octahedron satellites, and Catmull-Rom tension lines.
  - [ ] Confirms OrbitControls zoom is disabled to prevent scroll collision.

### Subphase 3.3: Interactive Shockwave & HTML Billboard DataHUD
- **Target Files**: `src/components/hero/NucleusScene.tsx`, `src/components/hero/CodeNucleus.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/08-vengeance-ui-specialized-primitives.tsx` — `VengeanceASCIIGlitchRipple` (Laser shockwave and ASCII ripple dispersion).
  * `Reference_components/09-aceternity-ui-specialized-primitives.tsx` — `AceternityLensLoupe` (Optical loupe magnification on hover over AST satellites).
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIAnimatedBeam` (Phosphor laser beam connection between nucleus and HUD billboard).
  * `animejs/02-spring-and-easing-physics.ts` — `shockwaveImpulse` spring physics (`createSpring({ mass: 1, stiffness: 400, damping: 18 })`).
  * `gsap/01-gsap-core-and-timelines.ts` — `gsap.timeline()` for coordinating 1800ms vermilion pulse and shockwave dispersion.
- **Checker Agent Gate 3.3**:
  - [ ] "Simulate Blast Radius" trigger initiates 1800ms vibration and vermilion pulse.
  - [ ] Hovering or clicking a node billboards the HTML DataHUD with LOC, complexity, and status.

### Subphase 3.4: Final 3D Compilation & Performance Audit
- **Resource Toolkits & Reference Paths to Access**:
  * `animejs/06-gui-scrubber-and-devtools.ts` — Real-time motion timeline debugging, FPS monitor, and frame drop diagnosis.
- **Checker Agent Gate 3.4**:
  - [ ] `tsc --noEmit` exits with code 0.
  - [ ] Zero layout shift on initial mount.
  - [ ] Phase 3 sign-off issued by Orchestrator Agent. Phase 4 unlocked.
