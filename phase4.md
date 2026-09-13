# Phase 4: Homepage Narrative & Draftsman Feature Matrix — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/phases/phase4.md` (and root `phase4.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Phases 1, 2, and 3 Complete and Verified  
> **Authoring Team:** Product Design, Visual Design, Performance, UI Critic, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

Phase 4 reconstructs the entire homepage (`src/app/home/page.tsx`). The existing homepage suffered from common clichés: generic bento grids with rounded pastel boxes, a generic logo marquee, and gradient fade-in headlines.

### Core Upgrades:
1. **Purge Generic Bento Grids**: Replaced with the **CAD Draftsman Feature Matrix** (`FeatureMatrix.tsx`) containing 4 live interactive micro-sandboxes (Transitive Blast Radius simulator, Lexical AST decomposition, Tarjan circular loop detector, and CURISM genome barcode).
2. **Purge Generic Logo Marquee**: Replaced with the **Live Open-Source Architectural Stress Ticker** (`StressTicker.tsx`) displaying real-time Halstead metrics, dependency counts, and circular cycle health for iconic open-source repositories (`facebook/react`, `vercel/next.js`, `torvalds/linux`, etc.).
3. **Pave the Architecture Journey** (`ArchitectureJourney.tsx`): A 4-stage sequential journey guiding the user through the exact lifecycle of codebase intelligence: Ingestion $\rightarrow$ Lexical AST Decomposition $\rightarrow$ Seismic Blast Radius $\rightarrow$ Developer DNA.
4. **Install Tactile Time-Travel Git Scrubber** (`CommitScrubber.tsx`): A scrubbable timeline allowing users to step through git commit hashes and inspect architectural graph sutures and blast radius deltas in real time.

---

## 2. Multi-Agent Orchestration & Simultaneous Collaboration Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 4 MULTI-AGENT EXECUTION FLOW                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   [Agent 10: Agent Orchestrator]                                                      │
│        │                                                                              │
│        ├──► Assigns Subphase 4.1 (MasterHero) ──────────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 4.1           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 4.2 (StressTicker) ────────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 4.2           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 4.3 (ArchitectureJourney) ─► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 4.3           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 4.4 (FeatureMatrix) ───────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 4.4           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 4.5 (CommitScrubber) ──────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 4.5           │
│        │                                                        │                     │
│        └──► Final Homepage Composition & Audit ─────────► [Agent 9: Checker Agent]    │
│                                                       & [Agent 2: Product Strategist] │
│                                                       PASS -> Unlock Phase 5          │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Visual & Technical Specifications

### 3.1 Layout Rhythm & Section Boundaries
- **Section Dividers**: Full-width 1px lines in `--color-steel` (`#1E1E24`) with centered CAD measurement tick marks (`CADDivider`).
- **Surface Elevation**: Deep Void background (`#050506`) overlaid with a subtle 64px drafting wireframe grid and 8px baseline units.
- **Card Containers**: `BlueprintFrame` with 1px borders, `+` crosshair corner marks in `#52525B`, and top-left telemetry labels in `10px` JetBrains Mono.

---

## 4. Complete Reference Code & Implementation Specifications

### 4.1 `src/components/home/MasterHero.tsx`
```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { PopActuator } from '@/components/ui/PopActuator';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { CodeNucleus } from '@/components/hero/CodeNucleus';
import { ArrowRight, GitBranch, Dna } from 'lucide-react';

export function MasterHero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 pt-8 pb-16 space-y-10 select-none">
      {/* Top Telemetry Stamp */}
      <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3 text-[10px] font-mono text-[#7A7A85]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <MonoLabel className="text-[10px]">TRACEON // ARCHITECTURAL RECONNAISSANCE ENGINE</MonoLabel>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>SPEC: CAD-V2.0</span>
          <span className="text-[#1E1E24]">|</span>
          <span>COMPILER: V8-AST</span>
          <span className="text-[#1E1E24]">|</span>
          <span className="text-[#F59E0B]">STATUS: NOMINAL</span>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl text-[#F5F5F7] tracking-tight leading-[1.05]">
          TRACE THE ARCHITECTURE.
          <br />
          <span className="text-[#F59E0B]">MAP THE ENGINEER.</span>
        </h1>

        <p className="font-mono text-xs sm:text-sm text-[#D1D1D6] max-w-2xl mx-auto leading-relaxed">
          High-precision codebase intelligence and developer DNA synthesis. Decompose monolithic ASTs, calculate transitive blast radius, and map engineering capability vectors with zero fluff.
        </p>

        {/* Primary Action Actuators */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/repo">
            <PopActuator size="lg" ledColor="amber">
              <GitBranch className="w-4 h-4 mr-1 text-[#F59E0B]" />
              <span>Analyze Codebase AST</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </PopActuator>
          </Link>

          <Link href="/profile-analytics">
            <PopActuator size="lg" ledColor="emerald">
              <Dna className="w-4 h-4 mr-1 text-[#10B981]" />
              <span>Scan Developer DNA</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </PopActuator>
          </Link>
        </div>
      </div>

      {/* 3D Code Nucleus */}
      <div className="w-full">
        <CodeNucleus />
      </div>

      {/* Twin Architectural Launch Blueprints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="border border-[#1E1E24] bg-[#0A0A0C] p-6 rounded-sm relative group hover:border-[#7A7A85] transition-colors">
          <span className="absolute top-1.5 right-2 text-[#7A7A85] text-[9px] font-mono">[LENS: ARCH]</span>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <h3 className="font-display font-bold text-lg text-[#F5F5F7]">Repository Analyzer</h3>
          </div>
          <p className="font-mono text-xs text-[#7A7A85] leading-relaxed mb-4">
            Compiles full AST dependency graph, flags circular cycles via Tarjan algorithm, and calculates file impact scores (0–100).
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-[#1E1E24] text-xs font-mono">
            <span className="text-[#F59E0B]">AST PARSER // BLAST COMPLIANT</span>
            <Link href="/repo" className="text-[#F5F5F7] hover:text-[#F59E0B] flex items-center gap-1 font-bold">
              <span>Ingest</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="border border-[#1E1E24] bg-[#0A0A0C] p-6 rounded-sm relative group hover:border-[#7A7A85] transition-colors">
          <span className="absolute top-1.5 right-2 text-[#7A7A85] text-[9px] font-mono">[LENS: GENOME]</span>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <h3 className="font-display font-bold text-lg text-[#F5F5F7]">Developer DNA Synthesizer</h3>
          </div>
          <p className="font-mono text-xs text-[#7A7A85] leading-relaxed mb-4">
            Evaluates GitHub activity across Curiosity, Utility, Rigor, Impact, Speed, and Mastery with verifiable package manifest proofs.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-[#1E1E24] text-xs font-mono">
            <span className="text-[#10B981]">CURISM V2 // REPUTATION VERIFIED</span>
            <Link href="/profile-analytics" className="text-[#F5F5F7] hover:text-[#10B981] flex items-center gap-1 font-bold">
              <span>Synthesize</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MasterHero;
```

---

### 4.2 `src/components/home/StressTicker.tsx`
```typescript
'use client';

import React from 'react';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PhosphorBadge } from '@/components/ui/PhosphorBadge';
import { Cpu } from 'lucide-react';

interface RepoTelemetry {
  repo: string;
  files: number;
  dependencies: number;
  halstead: string;
  circularLoops: number;
  status: 'cadmium' | 'phosphor' | 'seismic';
}

const LIVE_STRESS_FEED: RepoTelemetry[] = [
  { repo: 'facebook/react', files: 1420, dependencies: 42, halstead: 'E: 4.2M', circularLoops: 0, status: 'phosphor' },
  { repo: 'vercel/next.js', files: 8940, dependencies: 118, halstead: 'E: 18.9M', circularLoops: 2, status: 'cadmium' },
  { repo: 'tailwindlabs/tailwindcss', files: 980, dependencies: 14, halstead: 'E: 1.8M', circularLoops: 0, status: 'phosphor' },
  { repo: 'nodejs/node', files: 14820, dependencies: 260, halstead: 'E: 52.4M', circularLoops: 7, status: 'seismic' },
  { repo: 'torvalds/linux', files: 78200, dependencies: 840, halstead: 'E: 310M', circularLoops: 12, status: 'seismic' },
  { repo: 'astral-sh/uv', files: 1240, dependencies: 38, halstead: 'E: 3.1M', circularLoops: 0, status: 'phosphor' },
  { repo: 'golang/go', files: 9100, dependencies: 94, halstead: 'E: 24.2M', circularLoops: 1, status: 'cadmium' },
];

export function StressTicker() {
  return (
    <section className="relative w-full border-y border-[#1E1E24] bg-[#0A0A0C] py-2 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <MonoLabel className="text-[9px] text-[#7A7A85]">
            LIVE ARCHITECTURAL STRESS INDEX // GLOBAL OPEN-SOURCE REPOSITORIES
          </MonoLabel>
        </div>
        <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-[#7A7A85]">
          <span>CYCLE: REALTIME</span>
          <span className="text-[#1E1E24]">|</span>
          <span>PARSER: V8-AST</span>
        </div>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-marquee gap-3 whitespace-nowrap will-change-transform">
          {LIVE_STRESS_FEED.concat(LIVE_STRESS_FEED).map((item, idx) => (
            <div
              key={`${item.repo}-${idx}`}
              className="inline-flex items-center gap-3 px-3 py-1.5 border border-[#1E1E24] bg-[#050506] rounded-sm font-mono text-xs"
            >
              <span className="text-[#F5F5F7] font-semibold flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-[#7A7A85]" />
                {item.repo}
              </span>
              <span className="text-[#1E1E24]">|</span>
              <span className="text-[#7A7A85] text-[11px]">{item.files} files</span>
              <span className="text-[#1E1E24]">|</span>
              <span className="text-[#7A7A85] text-[11px]">{item.halstead}</span>
              <span className="text-[#1E1E24]">|</span>
              <PhosphorBadge variant={item.status}>
                {item.circularLoops > 0 ? `${item.circularLoops} Loops` : 'Optimal'}
              </PhosphorBadge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StressTicker;
```

---

### 4.3 `src/components/home/FeatureMatrix.tsx`
```typescript
'use client';

import React, { useState } from 'react';
import { BlueprintFrame } from '@/components/ui/BlueprintFrame';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PhosphorBadge } from '@/components/ui/PhosphorBadge';
import { ShieldAlert, GitFork, Dna, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export function FeatureMatrix() {
  const [selectedModule, setSelectedModule] = useState<'auth' | 'database' | 'router'>('auth');
  const [loopDetected, setLoopDetected] = useState(true);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-16 space-y-12 select-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E1E24] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            <MonoLabel className="text-[10px]">SECTION 03 // ARCHITECTURAL SPEC-SHEET</MonoLabel>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#F5F5F7] tracking-tight">
            CAD Draftsman Feature Matrix
          </h2>
        </div>
        <p className="font-mono text-xs text-[#7A7A85] max-w-md">
          Zero marketing fluff. High-density, deterministic analysis engines engineered for complex production codebases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: BLAST RADIUS */}
        <BlueprintFrame label="SPEC.01 // REALTIME BLAST RADIUS COMPILATION" className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-sm bg-[#121215] border border-[#1E1E24] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              </div>
              <PhosphorBadge variant="seismic">SEISMIC ENGINE</PhosphorBadge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#F5F5F7]">Deterministic Blast Radius</h3>
            <p className="font-mono text-xs text-[#7A7A85] leading-relaxed">
              Calculates exact transitive dependency blast radius when any file is modified or deleted. Prevents breaking downstream services before code review.
            </p>
            <div className="border border-[#1E1E24] bg-[#0A0A0C] p-3 rounded-sm space-y-3 font-mono text-xs">
              <div className="text-[10px] text-[#7A7A85] uppercase tracking-wider">Simulate Target Modification:</div>
              <div className="flex gap-2">
                {(['auth', 'database', 'router'] as const).map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setSelectedModule(mod)}
                    className={`px-2.5 py-1 text-[11px] rounded-sm border transition-all cursor-pointer ${
                      selectedModule === mod
                        ? 'bg-[#121215] border-[#EF4444] text-[#EF4444] font-bold shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                        : 'border-[#1E1E24] text-[#7A7A85] hover:text-[#D1D1D6]'
                    }`}
                  >
                    {mod}.ts
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E1E24] text-[11px]">
                <span className="text-[#7A7A85]">Transitive Impact:</span>
                <span className="text-[#EF4444] font-bold">
                  {selectedModule === 'auth' ? '18 downstream files (84/100)' : selectedModule === 'database' ? '42 downstream files (98/100)' : '6 downstream files (28/100)'}
                </span>
              </div>
            </div>
          </div>
          <Link href="/graph" className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] hover:underline">
            <span>Explore in Full Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </BlueprintFrame>

        {/* CARD 2: AST PARSING */}
        <BlueprintFrame label="SPEC.02 // LEXICAL TREE DECOMPOSITION" className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-sm bg-[#121215] border border-[#1E1E24] flex items-center justify-center">
                <GitFork className="w-4 h-4 text-[#10B981]" />
              </div>
              <PhosphorBadge variant="phosphor">V8 WEB WORKER</PhosphorBadge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#F5F5F7]">Multi-Threaded AST Parsing</h3>
            <p className="font-mono text-xs text-[#7A7A85] leading-relaxed">
              Extracts import bindings, exported symbols, and call hierarchies directly in isolated Web Workers without freezing the main rendering thread.
            </p>
            <div className="border border-[#1E1E24] bg-[#0A0A0C] p-3 rounded-sm font-mono text-[11px] space-y-1.5">
              <div className="text-[#10B981] flex items-center gap-2">
                <span>ROOT</span>
                <span className="text-[#7A7A85]">──→</span>
                <span>Program (SourceType: Module)</span>
              </div>
              <div className="pl-4 text-[#D1D1D6] border-l border-[#1E1E24] space-y-1">
                <div className="text-[#F59E0B]">├── ImportDeclaration (react, next)</div>
                <div className="text-[#F59E0B]">├── ExportNamedDeclaration (ASTNode)</div>
                <div className="text-[#10B981]">└── FunctionDeclaration (calculateImpactScore)</div>
              </div>
            </div>
          </div>
          <Link href="/repo" className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-[#10B981] hover:underline">
            <span>Ingest GitHub Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </BlueprintFrame>

        {/* CARD 3: CIRCULAR LOOPS */}
        <BlueprintFrame label="SPEC.03 // TOPOLOGICAL LOOP DETECTOR" className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-sm bg-[#121215] border border-[#1E1E24] flex items-center justify-center">
                <RefreshCw className={`w-4 h-4 ${loopDetected ? 'text-[#EF4444]' : 'text-[#10B981]'}`} />
              </div>
              <PhosphorBadge variant={loopDetected ? 'seismic' : 'phosphor'}>
                {loopDetected ? 'LOOP DETECTED' : 'HEALED'}
              </PhosphorBadge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#F5F5F7]">Tarjan Strongly-Connected Loops</h3>
            <p className="font-mono text-xs text-[#7A7A85] leading-relaxed">
              Detects circular dependency loops that cause bundling bloat, memory leaks, and undefined runtime imports across micro-frontends and monorepos.
            </p>
            <div className="border border-[#1E1E24] bg-[#0A0A0C] p-3 rounded-sm font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#7A7A85]">A.ts → B.ts → C.ts → A.ts</span>
                <button onClick={() => setLoopDetected(!loopDetected)} className="text-[10px] text-[#F59E0B] hover:underline cursor-pointer">
                  [{loopDetected ? 'RESOLVE LOOP' : 'RESTORE LOOP'}]
                </button>
              </div>
              <div className={`p-2 rounded-sm border text-[11px] ${loopDetected ? 'border-[#EF4444]/30 bg-[#EF4444]/5 text-[#EF4444]' : 'border-[#10B981]/30 bg-[#10B981]/5 text-[#10B981]'}`}>
                {loopDetected ? 'CRITICAL: 1 circular loop detected in graph topology.' : 'VERIFIED: Zero topological cycles. Clean DAG compilation.'}
              </div>
            </div>
          </div>
          <Link href="/graph" className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] hover:underline">
            <span>Inspect Circular Nodes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </BlueprintFrame>

        {/* CARD 4: DEVELOPER DNA */}
        <BlueprintFrame label="SPEC.04 // CURISM CAPABILITY GENOME" className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-sm bg-[#121215] border border-[#1E1E24] flex items-center justify-center">
                <Dna className="w-4 h-4 text-[#10B981]" />
              </div>
              <PhosphorBadge variant="cadmium">CURISM V2</PhosphorBadge>
            </div>
            <h3 className="font-display font-bold text-xl text-[#F5F5F7]">Developer Engineering DNA</h3>
            <p className="font-mono text-xs text-[#7A7A85] leading-relaxed">
              Synthesizes 6-axis mathematical vectors (Curiosity, Utility, Rigor, Impact, Speed, Mastery) from genuine commit history, PR diffs, and package manifests.
            </p>
            <div className="border border-[#1E1E24] bg-[#0A0A0C] p-3 rounded-sm font-mono text-xs space-y-2">
              <div className="text-[10px] text-[#7A7A85]">SIX CAPABILITY VECTORS:</div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-1.5 bg-[#121215] border border-[#1E1E24] rounded-sm text-center">
                  <div className="text-[#7A7A85]">CUR</div>
                  <div className="text-[#10B981] font-bold">94/100</div>
                </div>
                <div className="p-1.5 bg-[#121215] border border-[#1E1E24] rounded-sm text-center">
                  <div className="text-[#7A7A85]">UTL</div>
                  <div className="text-[#F59E0B] font-bold">88/100</div>
                </div>
                <div className="p-1.5 bg-[#121215] border border-[#1E1E24] rounded-sm text-center">
                  <div className="text-[#7A7A85]">RIG</div>
                  <div className="text-[#10B981] font-bold">92/100</div>
                </div>
              </div>
            </div>
          </div>
          <Link href="/profile-analytics" className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-[#10B981] hover:underline">
            <span>Analyze Developer Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </BlueprintFrame>
      </div>
    </section>
  );
}

export default FeatureMatrix;
```

---

### 4.4 `src/components/home/CommitScrubber.tsx`
```typescript
'use client';

import React, { useState } from 'react';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PopActuator } from '@/components/ui/PopActuator';
import { BlueprintFrame } from '@/components/ui/BlueprintFrame';
import { GitCommit, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommitState {
  hash: string;
  msg: string;
  date: string;
  author: string;
  addedNodes: string[];
  removedNodes: string[];
  blastDelta: string;
}

const COMMITS: CommitState[] = [
  {
    hash: 'd4a8f9',
    msg: 'refactor(core): decouple AST worker thread from renderer',
    date: '2 hours ago',
    author: 'rishabh@traceon.dev',
    addedNodes: ['astParserWorker.ts', 'tokenStream.ts'],
    removedNodes: ['legacyParser.js'],
    blastDelta: '-18.4% RISK REDUCTION',
  },
  {
    hash: '9c3b1e',
    msg: 'feat(graph): add real-time circular dependency detection loop',
    date: 'Yesterday',
    author: 'arch-lead@traceon.dev',
    addedNodes: ['tarjanCycleDetector.ts'],
    removedNodes: [],
    blastDelta: 'CYCLE HEALING DETECTED',
  },
  {
    hash: 'e702a4',
    msg: 'perf(dna): vectorize CURISM scoring with WebAssembly SIMD',
    date: '3 days ago',
    author: 'genome@traceon.dev',
    addedNodes: ['curismWasm.wasm', 'radarShader.glsl'],
    removedNodes: ['curismScoreLegacy.ts'],
    blastDelta: 'COMPUTE LATENCY: 1.2ms',
  },
  {
    hash: '118b5c',
    msg: 'fix(engine): isolate blast shockwave boundary in monorepo packages',
    date: '5 days ago',
    author: 'sre@traceon.dev',
    addedNodes: ['monorepoBoundary.ts'],
    removedNodes: ['globalScope.ts'],
    blastDelta: 'BLAST BOUNDARY RESTRICTED',
  },
];

export function CommitScrubber() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeCommit = COMMITS[activeIdx];

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % COMMITS.length);
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + COMMITS.length) % COMMITS.length);

  return (
    <BlueprintFrame label="GIT SUTURE SCRUBBER // TEMPORAL ARCHITECTURE DIFF" className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E24] pb-4 mb-6">
        <div>
          <h3 className="font-display font-bold text-lg text-[#F5F5F7]">Tactile Time-Travel Dependency Scrubber</h3>
          <p className="font-mono text-xs text-[#7A7A85] mt-1">
            Scrub along commit history to observe architectural graph healings and blast radius evolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PopActuator size="sm" onClick={handlePrev} aria-label="Previous commit"><ChevronLeft className="w-3.5 h-3.5" /></PopActuator>
          <PopActuator size="sm" ledColor={isPlaying ? 'emerald' : 'amber'} onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'PAUSE' : 'AUTOPLAY'}</span>
          </PopActuator>
          <PopActuator size="sm" onClick={handleNext} aria-label="Next commit"><ChevronRight className="w-3.5 h-3.5" /></PopActuator>
        </div>
      </div>

      <div className="relative my-8 px-2">
        <div className="h-[2px] bg-[#1E1E24] w-full relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#F59E0B] transition-all duration-300 shadow-[0_0_8px_#F59E0B]"
            style={{ width: `${(activeIdx / (COMMITS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between -mt-2.5">
          {COMMITS.map((c, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button key={c.hash} onClick={() => setActiveIdx(idx)} className="group flex flex-col items-center cursor-pointer focus:outline-none">
                <span
                  className={cn(
                    'w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200',
                    isActive ? 'bg-[#0A0A0C] border-[#F59E0B] shadow-[0_0_10px_#F59E0B] scale-125' : 'bg-[#121215] border-[#1E1E24] hover:border-[#7A7A85]'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full transition-colors', isActive ? 'bg-[#F59E0B]' : 'bg-[#7A7A85]/50 group-hover:bg-[#D1D1D6]')} />
                </span>
                <span className={cn('font-mono text-[10px] mt-2 uppercase tracking-wider', isActive ? 'text-[#F59E0B] font-bold' : 'text-[#7A7A85]')}>
                  {c.hash}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#1E1E24] bg-[#0A0A0C] p-4 rounded-sm">
        <div className="space-y-1.5 font-mono text-xs border-b md:border-b-0 md:border-r border-[#1E1E24] pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2 text-[#F5F5F7] font-bold">
            <GitCommit className="w-4 h-4 text-[#F59E0B]" />
            <span>COMMIT {activeCommit.hash}</span>
          </div>
          <div className="text-[11px] text-[#D1D1D6] leading-relaxed">{activeCommit.msg}</div>
          <div className="text-[10px] text-[#7A7A85]">By {activeCommit.author} • {activeCommit.date}</div>
        </div>

        <div className="space-y-2 font-mono text-xs border-b md:border-b-0 md:border-r border-[#1E1E24] pb-4 md:pb-0 md:pr-4">
          <MonoLabel className="text-[9px]">SUTURED NODES</MonoLabel>
          <div className="space-y-1">
            {activeCommit.addedNodes.map((n) => (<div key={n} className="flex items-center gap-1.5 text-[11px] text-[#10B981]"><span>+</span><span className="truncate">{n}</span></div>))}
            {activeCommit.removedNodes.map((n) => (<div key={n} className="flex items-center gap-1.5 text-[11px] text-[#EF4444]"><span>-</span><span className="truncate">{n}</span></div>))}
            {activeCommit.addedNodes.length === 0 && activeCommit.removedNodes.length === 0 && (<div className="text-[11px] text-[#7A7A85]">Internal refactor only</div>)}
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs flex flex-col justify-between">
          <div>
            <MonoLabel className="text-[9px]">SEISMIC IMPACT DELTA</MonoLabel>
            <div className="mt-1 font-bold text-sm text-[#F59E0B]">{activeCommit.blastDelta}</div>
          </div>
          <div className="text-[10px] text-[#7A7A85]">Graph verified with zero circular reference leaks.</div>
        </div>
      </div>
    </BlueprintFrame>
  );
}

export default CommitScrubber;
```

---

### 4.5 `src/app/home/page.tsx`
```typescript
import { MasterHero } from '@/components/home/MasterHero';
import { StressTicker } from '@/components/home/StressTicker';
import { ArchitectureJourney } from '@/components/home/ArchitectureJourney';
import { FeatureMatrix } from '@/components/home/FeatureMatrix';
import { CommitScrubber } from '@/components/home/CommitScrubber';
import { TerminalInteractCTA } from '@/components/home/TerminalInteractCTA';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#050506] overflow-x-hidden">
      <div className="fixed inset-0 wireframe-grid opacity-20 pointer-events-none z-0" />
      <div className="fixed inset-0 noise pointer-events-none z-0 opacity-40 mix-blend-overlay" />

      <div className="relative z-10 flex flex-col gap-12 pb-32">
        <MasterHero />
        <StressTicker />
        <ArchitectureJourney />
        <FeatureMatrix />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <CommitScrubber />
        </div>
        <TerminalInteractCTA />
      </div>
    </div>
  );
}
```

---

## 5. Granular Subphase Breakdown & Execution Plan

### Subphase 4.1: MasterHero & 3D Nucleus Integration
- **Target File**: `src/components/home/MasterHero.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/02-kinetic-typography-and-ciphers.tsx` — `AceternitySplitFlapDisplay` (Staggered mechanical headline flip).
  * `Reference_components/12-react-bits-specialized-primitives.tsx` — `ReactBitsTextPressure` & `ReactBitsTrueFocus` (Cursor-distance variable typography & snapping CAD focus reticles).
  * `Reference_components/01-tactile-actuators-and-buttons.tsx` — `VengeancePopActuator` (Twin CTA launch buttons with LED pips).
  * `animejs/03-stagger-and-timeline-choreography.ts` — Staggered hero entrance sequence and timeline delays.
  * `gsap/02-scrolltrigger-and-pinning.ts` — ScrollTrigger hero exit pin and opacity fade on downward scroll.
- **Checker Agent Gate 4.1**:
  - [ ] Confirms Space Grotesk headline: `TRACE THE ARCHITECTURE. MAP THE ENGINEER.`
  - [ ] Validates twin launch cards link to `/repo` and `/profile-analytics`.
  - [ ] Confirms zero purple/blue/cyan colors.

### Subphase 4.2: Live Stress Ticker
- **Target File**: `src/components/home/StressTicker.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIMarquee` & `MagicUINumberTicker` (Hardware-accelerated infinite commit/stress ticker and rolling LOC counters).
  * `Reference_components/05-radar-and-telemetry-visualizations.tsx` — `CurismRadarSweeper` (Continuous scanning radar beam indicator).
  * `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUIMetricStatCard` (Mini metric stat chips with sparklines).
  * `animejs/02-spring-and-easing-physics.ts` — `tickerSpring` for smooth interpolation on data refreshes.
- **Checker Agent Gate 4.2**:
  - [ ] Marquee animation runs infinitely without layout shifts.
  - [ ] Real open source repo telemetry data displayed correctly.

### Subphase 4.3: Architecture Journey
- **Target File**: `src/components/home/ArchitectureJourney.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/09-aceternity-ui-specialized-primitives.tsx` — `AceternityTracingBeam` (Scroll-scrubbed laser beam traveling along journey path).
  * `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUIPipelineStepper` (4-step linear architecture pipeline: Ingestion $\to$ AST $\to$ Blast $\to$ Genome).
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIAnimatedBeam` (Directional laser connecting stage nodes).
  * `gsap/02-scrolltrigger-and-pinning.ts` — Multi-stage section pinning with scrubbed SVG draw-in (`pin: true`, `scrub: 1`).
  * `lenis/05-lenis-smooth-scroll.ts` — Smooth scroll coordination during pinned sequence.
- **Checker Agent Gate 4.3**:
  - [ ] Confirms 4-step sequence (Ingestion $\rightarrow$ AST $\rightarrow$ Blast $\rightarrow$ Genome).
  - [ ] GSAP ScrollTrigger stagger animation works smoothly.

### Subphase 4.4: CAD Spec-Sheet Feature Matrix
- **Target File**: `src/components/home/FeatureMatrix.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/03-cad-frames-and-spotlight-cards.tsx` — `IndustrialBlueprintFrame` & `AceternityCardSpotlight` (1px steel CAD cards with cursor illumination).
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIBentoGrid` & `MagicUIBentoCard` (High-density CAD modular bento layout with corner crosshairs).
  * `Reference_components/12-react-bits-specialized-primitives.tsx` — `ReactBitsPixelCard` (Pixel dissipation matrix card on hover).
  * `animejs/02-spring-and-easing-physics.ts` — 3D card tilt and magnetic cursor pull spring physics.
- **Checker Agent Gate 4.4**:
  - [ ] Confirms interactive state toggles work (target module selection & circular loop toggle).
  - [ ] Zero generic bento grids detected.

### Subphase 4.5: Tactile Git Scrubber
- **Target File**: `src/components/home/CommitScrubber.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/04-sliders-and-commit-scrubbers.tsx` — `ElasticCommitScrubber` & `CADRangeScrubber` (Elastic commit notch scrubber with inertia).
  * `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUICodeDiffInspector` (Hunk code comparison showing additions/deletions at scrubbed commit).
  * `Reference_components/09-aceternity-ui-specialized-primitives.tsx` — `AceternityCompareSlider` (Before/after code state slider).
  * `animejs/02-spring-and-easing-physics.ts` — `elasticSliderSpring` (`createSpring({ stiffness: 280, damping: 14 })`).
- **Checker Agent Gate 4.5**:
  - [ ] Scrubbing between commits updates the added/removed nodes and seismic impact metrics.

### Subphase 4.6: Final Homepage Assembly & Type Verification
- **Target File**: `src/app/home/page.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `lenis/06-integrated-cad-motion-controller.ts` — Universal RAF controller binding all homepage motion.
- **Checker Agent Gate 4.6**:
  - [ ] `tsc --noEmit` exits with code 0.
  - [ ] Phase 4 sign-off issued by Orchestrator Agent. Phase 5 unlocked.
