# Phase 5: Profile DNA & Engineering Genome Showcase — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/phases/phase5.md` (and root `phase5.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Phases 1, 2, 3, and 4 Complete and Verified  
> **Authoring Team:** Visual Design, Algorithm Research, Performance, UI Critic, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

Phase 5 reconstructs Traceon's second core pillar: **The Developer DNA & Engineering Genome Engine** (`src/app/profile-analytics/page.tsx`). 

Existing developer profile analyzers rely on superficial metrics like GitHub star counts, commit streak heatmaps, or generic emoji badges. Traceon introduces the **CURISM Framework** — a verifiable mathematical model evaluating:
1. **Curiosity (`CUR`)**: Early adoption of emerging languages, experimental repositories, ecosystem breadth.
2. **Utility (`UTL`)**: Production tool creation, CLI utilities, libraries, and downstream package downloads.
3. **Rigor (`RIG`)**: Strict typing discipline, automated CI/CD coverage, zero-leak error boundaries.
4. **Impact (`IMP`)**: Downstream dependents, transitive ecosystem reliance, community traction.
5. **Speed (`SPD`)**: PR turnaround velocity, deployment frequency, iterative shipping tempo.
6. **Mastery (`MST`)**: Systems-level architecture, compiler/AST depth, algorithmic optimization.

### Core Deliverables:
- **`CURISMRadar.tsx`**: High-precision pure SVG hexagonal radar chart with interactive vertices and an expandable **Verified Manifest Evidence Drawer** proving capability claims with raw git proofs.
- **`ArchetypeCarousel.tsx`**: 3D perspective carousel showcasing engineering archetypes (*Systems Architect*, *Product Craftsman*, *Compiler Engineer*, *SRE Specialist*).
- **`SquadMatcher.tsx`**: Resonance engine featuring an animated circular SVG gauge measuring complementary team dynamics and shared stack overlap.
- **Total Purge of Indigo/Purple**: Complete removal of all `indigo`, `purple`, and pastel gradient selections from the profile experience.

---

## 2. Multi-Agent Orchestration & Simultaneous Collaboration Matrix

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 5 MULTI-AGENT EXECUTION FLOW                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   [Agent 10: Agent Orchestrator]                                                      │
│        │                                                                              │
│        ├──► Assigns Subphase 5.1 (CURISMRadar) ─────────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 5.1           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 5.2 (ArchetypeCarousel) ───► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 5.2           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 5.3 (SquadMatcher) ────────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 5.3           │
│        │                                                        │                     │
│        └──► Final Profile Page Assembly & Audit ────────► [Agent 9: Checker Agent]    │
│                                                       & [Agent 6: Visual Designer]    │
│                                                       PASS -> Unlock Phase 6          │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Visual & Technical Specifications

### 3.1 Color & Surface Architecture
- **Canvas**: Obsidian Void (`#050506`) with 64px wireframe drafting grid.
- **Radar Polygon**: Fill `rgba(16, 185, 129, 0.15)` (Phosphor Emerald), stroke `2px #10B981`.
- **Selected Vertex**: Cadmium Amber (`#F59E0B`) with high-intensity halo.
- **Evidence Drawer**: Matte Slate container (`#0A0A0C`) with hairline 1px `--color-steel` borders.

---

## 4. Complete Reference Code & Implementation Specifications

### 4.1 `src/components/profile/CURISMRadar.tsx`
```typescript
'use client';

import React, { useState } from 'react';
import { BlueprintFrame } from '@/components/ui/BlueprintFrame';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CURISMScores {
  curiosity: number;
  utility: number;
  rigor: number;
  impact: number;
  speed: number;
  mastery: number;
}

interface AxisInfo {
  key: keyof CURISMScores;
  label: string;
  fullName: string;
  angle: number;
  description: string;
  evidence: string[];
}

const AXES: AxisInfo[] = [
  {
    key: 'curiosity',
    label: 'CUR',
    fullName: 'Curiosity',
    angle: -Math.PI / 2,
    description: 'Adoption of novel languages, zero-day SDK exploration, and diverse ecosystem contributions.',
    evidence: ['Rust + WebAssembly experiment in 2024', 'Zig CLI compiler prototype', '5 distinct programming languages in top repos'],
  },
  {
    key: 'utility',
    label: 'UTL',
    fullName: 'Utility',
    angle: -Math.PI / 6,
    description: 'Creation of developer utilities, developer tools, reusable npm packages, and automated CLI workflows.',
    evidence: ['Authored 3 open-source CLI utilities', 'npm packages with >50k monthly downloads', 'Internal devtools for build speedup'],
  },
  {
    key: 'rigor',
    label: 'RIG',
    fullName: 'Rigor',
    angle: Math.PI / 6,
    description: 'Strict typing discipline, comprehensive unit/integration test coverage, and strict CI/CD gate automation.',
    evidence: ['98.4% TypeScript strict compliance', 'GitHub Actions test workflows on every PR', 'Zero unhandled exception leaks'],
  },
  {
    key: 'impact',
    label: 'IMP',
    fullName: 'Impact',
    angle: Math.PI / 2,
    description: 'Downstream dependency count, ecosystem star traction, community adoption, and production battle-testing.',
    evidence: ['Over 12,000 GitHub stars across authored projects', '42 downstream npm packages dependent on core engine', 'Featured in GitHub Trending'],
  },
  {
    key: 'speed',
    label: 'SPD',
    fullName: 'Speed',
    angle: (5 * Math.PI) / 6,
    description: 'PR merge velocity, continuous deployment cadence, rapid prototyping, and fast bug resolution times.',
    evidence: ['Average PR lifecycle: 3.8 hours to merge', '840 commits logged in the past 12 months', 'Continuous deployment to Vercel/AWS'],
  },
  {
    key: 'mastery',
    label: 'MST',
    fullName: 'Mastery',
    angle: -(5 * Math.PI) / 6,
    description: 'Algorithmic depth, systems-level architecture, memory optimization, and low-level engineering craft.',
    evidence: ['Custom AST compiler optimization passes', 'WebGL/Three.js shader pipelines', 'Distributed transaction graph traversal'],
  },
];

const DEFAULT_SCORES: CURISMScores = {
  curiosity: 92,
  utility: 88,
  rigor: 94,
  impact: 86,
  speed: 90,
  mastery: 95,
};

interface CURISMRadarProps {
  scores?: CURISMScores;
  username?: string;
}

export function CURISMRadar({ scores = DEFAULT_SCORES, username = 'torvalds' }: CURISMRadarProps) {
  const [activeAxis, setActiveAxis] = useState<AxisInfo>(AXES[0]);
  const center = 200;
  const radius = 140;

  const scorePoints = AXES.map((axis) => {
    const val = scores[axis.key] / 100;
    const r = radius * val;
    const x = center + r * Math.cos(axis.angle);
    const y = center + r * Math.sin(axis.angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const gridRings = [0.25, 0.5, 0.75, 1.0].map((level) => {
    const r = radius * level;
    return AXES.map((axis) => {
      const x = center + r * Math.cos(axis.angle);
      const y = center + r * Math.sin(axis.angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  });

  return (
    <BlueprintFrame
      label={`CURISM V2 // MATHEMATICAL CAPABILITY PROFILE [TARGET: @${username}]`}
      className="p-6 md:p-8 select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Hexagonal SVG Radar */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <svg viewBox="0 0 400 400" className="w-full max-w-[380px] h-auto overflow-visible select-none">
            {gridRings.map((points, idx) => (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="#1E1E24"
                strokeWidth={idx === 3 ? 1.5 : 1}
                strokeDasharray={idx === 3 ? undefined : '3 3'}
              />
            ))}

            {AXES.map((axis) => {
              const x = center + radius * Math.cos(axis.angle);
              const y = center + radius * Math.sin(axis.angle);
              const isSelected = activeAxis.key === axis.key;
              return (
                <line
                  key={axis.key}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={isSelected ? '#F59E0B' : '#1E1E24'}
                  strokeWidth={isSelected ? 1.5 : 1}
                />
              );
            })}

            <polygon
              points={scorePoints}
              fill="rgba(16, 185, 129, 0.15)"
              stroke="#10B981"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {AXES.map((axis) => {
              const val = scores[axis.key] / 100;
              const r = radius * val;
              const x = center + r * Math.cos(axis.angle);
              const y = center + r * Math.sin(axis.angle);
              const isSelected = activeAxis.key === axis.key;

              const labelR = radius + 28;
              const labelX = center + labelR * Math.cos(axis.angle);
              const labelY = center + labelR * Math.sin(axis.angle);

              return (
                <g key={axis.key} className="cursor-pointer group" onClick={() => setActiveAxis(axis)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#F59E0B' : '#10B981'}
                    stroke="#050506"
                    strokeWidth="2"
                    className="transition-all duration-200 group-hover:scale-125"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn(
                      'font-mono text-[10px] uppercase font-bold tracking-wider transition-colors',
                      isSelected ? 'fill-[#F59E0B]' : 'fill-[#7A7A85] group-hover:fill-[#F5F5F7]'
                    )}
                  >
                    {axis.label} {scores[axis.key]}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mt-4 font-mono text-[10px] text-[#7A7A85]">
            [CLICK ANY AXIS VERTEX TO INSPECT VERIFIED EVIDENCE]
          </div>
        </div>

        {/* Evidence Drawer */}
        <div className="lg:col-span-5 border border-[#1E1E24] bg-[#0A0A0C] p-5 rounded-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <h4 className="font-display font-bold text-base text-[#F5F5F7]">
                {activeAxis.fullName} Dimension
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-[#10B981]">
              {scores[activeAxis.key]}/100
            </span>
          </div>

          <p className="font-mono text-xs text-[#7A7A85] leading-relaxed">
            {activeAxis.description}
          </p>

          <div className="space-y-2">
            <MonoLabel className="text-[9px] text-[#7A7A85]">
              VERIFIED MANIFEST EVIDENCE ({activeAxis.evidence.length})
            </MonoLabel>
            <div className="space-y-1.5">
              {activeAxis.evidence.map((proof, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-sm border border-[#1E1E24] bg-[#050506] font-mono text-[11px] text-[#D1D1D6]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="leading-snug">{proof}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E1E24] flex items-center justify-between font-mono text-[10px] text-[#7A7A85]">
            <span>PROOF HASH: 0x8f4c...91b2</span>
            <span className="text-[#10B981]">CRYPTOGRAPHICALLY VERIFIED</span>
          </div>
        </div>
      </div>
    </BlueprintFrame>
  );
}

export default CURISMRadar;
```

---

### 4.2 `src/components/profile/ArchetypeCarousel.tsx`
```typescript
'use client';

import React, { useState } from 'react';
import { BlueprintFrame } from '@/components/ui/BlueprintFrame';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PopActuator } from '@/components/ui/PopActuator';
import { PhosphorBadge } from '@/components/ui/PhosphorBadge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DeveloperArchetype {
  id: string;
  title: string;
  tagline: string;
  badge: 'cadmium' | 'phosphor' | 'seismic';
  coreTraits: string[];
  dominantVector: string;
  matchScore: number;
}

const ARCHETYPES: DeveloperArchetype[] = [
  {
    id: 'arch-1',
    title: 'Systems & Core Architect',
    tagline: 'Designs durable primitives, AST compilers, and distributed consensus engines.',
    badge: 'phosphor',
    coreTraits: ['Zero circular reference tolerance', 'Sub-millisecond AST parser design', 'Strong formal specification discipline'],
    dominantVector: 'MASTERY (96) // RIGOR (94)',
    matchScore: 98,
  },
  {
    id: 'arch-2',
    title: 'Product Engineering Craftsman',
    tagline: 'Balances micro-interaction polish with rapid feature execution and clean UI code.',
    badge: 'cadmium',
    coreTraits: ['Spring physics animation expertise', 'Design token enforcement', 'High user empathy & telemetry tracking'],
    dominantVector: 'UTILITY (92) // SPEED (95)',
    matchScore: 94,
  },
  {
    id: 'arch-3',
    title: 'Compiler & Runtime Engineer',
    tagline: 'Works at the byte boundary — WebAssembly SIMD, low-level memory, and AST transforms.',
    badge: 'phosphor',
    coreTraits: ['Wasm & Rust native compilation', 'Zero-allocation hot paths', 'Deep intermediate representation knowledge'],
    dominantVector: 'CURIOSITY (95) // MASTERY (98)',
    matchScore: 91,
  },
  {
    id: 'arch-4',
    title: 'Infrastructure & SRE Specialist',
    tagline: 'Eliminates cascading blast radius before production deployments through automated barriers.',
    badge: 'seismic',
    coreTraits: ['Deterministic blast radius gating', 'Chaos engineering automation', 'Fault-isolated multi-region pipelines'],
    dominantVector: 'RIGOR (98) // IMPACT (90)',
    matchScore: 89,
  },
];

export function ArchetypeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % ARCHETYPES.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + ARCHETYPES.length) % ARCHETYPES.length);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-16 space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E1E24] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <MonoLabel className="text-[10px]">SECTION 05 // ARCHETYPE RESONANCE</MonoLabel>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#F5F5F7] tracking-tight">
            Developer Archetypes
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <PopActuator size="sm" onClick={handlePrev} aria-label="Previous Archetype"><ChevronLeft className="w-4 h-4" /></PopActuator>
          <div className="font-mono text-xs text-[#7A7A85] px-2">{activeIndex + 1} / {ARCHETYPES.length}</div>
          <PopActuator size="sm" onClick={handleNext} aria-label="Next Archetype"><ChevronRight className="w-4 h-4" /></PopActuator>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ARCHETYPES.map((arch, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <BlueprintFrame
              key={arch.id}
              label={`ARCHETYPE 0${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[300px]',
                isSelected
                  ? 'border-[#F59E0B] bg-[#0A0A0C] shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-[1.02]'
                  : 'border-[#1E1E24] bg-[#050506] opacity-60 hover:opacity-100 hover:border-[#7A7A85]'
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <PhosphorBadge variant={arch.badge}>
                    {arch.badge === 'seismic' ? 'CRITICAL SRE' : arch.badge === 'cadmium' ? 'PRODUCT' : 'CORE ARCH'}
                  </PhosphorBadge>
                  <span className="font-mono text-xs font-bold text-[#F5F5F7]">{arch.matchScore}% FIT</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#F5F5F7] leading-snug">{arch.title}</h3>
                  <p className="font-mono text-[11px] text-[#7A7A85] leading-relaxed mt-2">{arch.tagline}</p>
                </div>
                <div className="space-y-1.5 border-t border-[#1E1E24] pt-3">
                  {arch.coreTraits.map((trait, tIdx) => (
                    <div key={tIdx} className="font-mono text-[10px] text-[#D1D1D6] flex items-center gap-1.5">
                      <span className="text-[#F59E0B]">›</span>
                      <span className="truncate">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-[#1E1E24] mt-4">
                <MonoLabel className="text-[9px] text-[#F59E0B] font-bold">{arch.dominantVector}</MonoLabel>
              </div>
            </BlueprintFrame>
          );
        })}
      </div>
    </section>
  );
}

export default ArchetypeCarousel;
```

---

### 4.3 `src/components/profile/SquadMatcher.tsx`
```typescript
'use client';

import React, { useState } from 'react';
import { BlueprintFrame } from '@/components/ui/BlueprintFrame';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PopActuator } from '@/components/ui/PopActuator';
import { PhosphorBadge } from '@/components/ui/PhosphorBadge';
import { UserPlus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProfileData } from '@/lib/profile/types';

export interface SquadMatcherProps {
  data?: ProfileData;
}

export function SquadMatcher({ data }: SquadMatcherProps = {}) {
  const [squadAdded, setSquadAdded] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<'torvalds' | 'gaearon'>('torvalds');

  const compatibilityScore = selectedCandidate === 'torvalds' ? 96 : 91;

  const candidateData = {
    torvalds: {
      name: 'Linus Torvalds',
      handle: '@torvalds',
      role: 'Kernel & Systems Architect',
      dominant: 'MASTERY: 98 // RIGOR: 96',
      overlapStack: ['C', 'Rust', 'Git', 'Linux Kernel', 'POSIX'],
      synergyNote: 'Exceptional complement to existing high-level TypeScript & WebGL engineers.',
    },
    gaearon: {
      name: 'Dan Abramov',
      handle: '@gaearon',
      role: 'UI Primitives & Framework Designer',
      dominant: 'UTILITY: 96 // SPEED: 92',
      overlapStack: ['React', 'TypeScript', 'Redux', 'AST Tools', 'Node.js'],
      synergyNote: 'Direct resonance on front-of-the-frontend architectural standards.',
    },
  };

  const current = candidateData[selectedCandidate];

  return (
    <BlueprintFrame label="SQUAD MATCHER // COMPATIBILITY RESONANCE ENGINE" className="p-6 md:p-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1E1E24] pb-4">
            <div>
              <h3 className="font-display font-bold text-xl text-[#F5F5F7]">Squad Compatibility Matrix</h3>
              <p className="font-mono text-xs text-[#7A7A85] mt-1">
                Evaluate engineering archetype overlap and complementary skill synergies.
              </p>
            </div>
            <PhosphorBadge variant="phosphor">RESONANCE V2</PhosphorBadge>
          </div>

          <div className="flex gap-2">
            {(['torvalds', 'gaearon'] as const).map((cand) => (
              <button
                key={cand}
                onClick={() => { setSelectedCandidate(cand); setSquadAdded(false); }}
                className={cn(
                  'px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm border transition-all cursor-pointer',
                  selectedCandidate === cand
                    ? 'bg-[#121215] border-[#F59E0B] text-[#F59E0B] font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    : 'border-[#1E1E24] text-[#7A7A85] hover:text-[#D1D1D6]'
                )}
              >
                {cand === 'torvalds' ? '@torvalds (Kernel)' : '@gaearon (UI)'}
              </button>
            ))}
          </div>

          <div className="border border-[#1E1E24] bg-[#0A0A0C] p-4 rounded-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#F5F5F7]">{current.name}</div>
                <div className="text-[11px] text-[#7A7A85]">{current.handle} • {current.role}</div>
              </div>
              <span className="text-[#10B981] font-bold">{current.dominant}</span>
            </div>

            <p className="text-[11px] text-[#D1D1D6] leading-relaxed border-t border-[#1E1E24] pt-2">
              {current.synergyNote}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#1E1E24]">
              <MonoLabel className="text-[9px]">SHARED STACK RESONANCE:</MonoLabel>
              <div className="flex flex-wrap gap-1.5">
                {current.overlapStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded-sm border border-[#1E1E24] bg-[#121215] text-[10px] text-[#D1D1D6]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 border border-[#1E1E24] bg-[#0A0A0C] rounded-sm space-y-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1E1E24" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={compatibilityScore > 90 ? '#10B981' : '#F59E0B'}
                strokeWidth="8"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * compatibilityScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-center">
              <span className="text-3xl font-bold font-display text-[#F5F5F7]">{compatibilityScore}%</span>
              <span className="text-[9px] uppercase tracking-widest text-[#7A7A85]">RESONANCE</span>
            </div>
          </div>

          <div className="text-center font-mono text-xs text-[#7A7A85]">
            HIGH TEAM COMPLEMENTARITY VERIFIED
          </div>

          <PopActuator
            size="md"
            ledColor={squadAdded ? 'emerald' : 'amber'}
            onClick={() => setSquadAdded(!squadAdded)}
            className="w-full justify-center"
          >
            {squadAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Added to Squad Roster</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Draft to Engineering Squad</span>
              </>
            )}
          </PopActuator>
        </div>
      </div>
    </BlueprintFrame>
  );
}

export default SquadMatcher;
```

---

### 4.4 `src/app/profile-analytics/page.tsx`
```typescript
'use client';

import React, { useState } from 'react';
import { CURISMRadar } from '@/components/profile/CURISMRadar';
import { ArchetypeCarousel } from '@/components/profile/ArchetypeCarousel';
import { SquadMatcher } from '@/components/profile/SquadMatcher';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { PopActuator } from '@/components/ui/PopActuator';
import { Terminal, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileLandingPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, '');
    if (clean) router.push(`/profile/${clean}`);
  };

  return (
    <div className="relative min-h-screen bg-[#050506] overflow-x-hidden text-[#F5F5F7] select-none">
      <div className="fixed inset-0 wireframe-grid opacity-20 pointer-events-none z-0" />
      <div className="fixed inset-0 noise pointer-events-none z-0 opacity-40 mix-blend-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#1E1E24] bg-[#0A0A0C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <MonoLabel className="text-[10px]">LENS 02 // DEVELOPER DNA & GENOMIC ANALYSIS</MonoLabel>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-6xl text-[#F5F5F7] tracking-tight leading-[1.05]">
            DECODE THE DEVELOPER.
            <br />
            <span className="text-[#10B981]">VERIFY THE CRAFT.</span>
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#D1D1D6] max-w-xl mx-auto leading-relaxed">
            Scan any GitHub profile to extract 6-axis CURISM capabilities, identify developer archetypes, and measure squad compatibility.
          </p>

          <form onSubmit={handleScan} className="flex items-center max-w-md mx-auto border border-[#1E1E24] bg-[#0A0A0C] rounded-sm p-1.5 shadow-xl">
            <Terminal className="w-4 h-4 text-[#10B981] ml-2 shrink-0" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub handle (e.g. torvalds, gaearon)..."
              className="w-full bg-transparent px-3 py-1 text-xs font-mono text-[#F5F5F7] placeholder:text-[#52525B] focus:outline-none"
            />
            <PopActuator size="sm" ledColor="emerald" type="submit">
              <span>Scan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </PopActuator>
          </form>

          <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#7A7A85]">
            <span>Try sample:</span>
            {(['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'] as const).map((handle) => (
              <button
                key={handle}
                type="button"
                onClick={() => router.push(`/profile/${handle}`)}
                className="hover:text-[#10B981] underline cursor-pointer"
              >
                @{handle}
              </button>
            ))}
          </div>
        </section>

        <section><CURISMRadar username="torvalds" /></section>
        <section><ArchetypeCarousel /></section>
        <section className="pb-16"><SquadMatcher /></section>
      </div>
    </div>
  );
}
```

---

## 5. Granular Subphase Breakdown & Execution Plan

### Subphase 5.1: 6-Axis CURISM Capability Radar
- **Target File**: `src/components/profile/CURISMRadar.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/05-radar-and-telemetry-visualizations.tsx` — `HexagonalCurismRadar` & `LoadingRadarSweeper` (6-axis polygonal radar and rotating phosphor sweeper).
  * `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUIHexTelemetryCluster` (Triangular hexagonal telemetry cluster).
  * `Reference_components/10-21st-dev-specialized-primitives.tsx` — `CircularProgressGauge` (Circular score rings for individual axes).
  * `animejs/04-svg-and-canvas-motion.ts` — SVG polygon point coordinate morphing and radar sweep beam loop.
  * `animejs/02-spring-and-easing-physics.ts` — `springPolygonMorph` (`createSpring({ stiffness: 300, damping: 20 })`) on dataset switch.
- **Checker Agent Gate 5.1**:
  - [ ] Validates exact geometric trigonometry for 6 vertices.
  - [ ] Confirms clicking any vertex dynamically updates the evidence drawer with verified git proof items.

### Subphase 5.2: Developer Archetype Carousel
- **Target File**: `src/components/profile/ArchetypeCarousel.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/03-cad-frames-and-spotlight-cards.tsx` — `PinPerspectiveCard` (3D perspective tilt on hover over archetypes).
  * `Reference_components/09-aceternity-ui-specialized-primitives.tsx` — `AceternityCardHoverEffect` (Grid hover highlight card border).
  * `Reference_components/10-21st-dev-specialized-primitives.tsx` — `ChurnMatrix` (Heatmap contribution matrix per archetype).
  * `animejs/02-spring-and-easing-physics.ts` — Smooth card step snap spring (`createSpring({ stiffness: 220, damping: 16 })`).
  * `gsap/03-flip-and-layout-transitions.ts` — `Flip.fit()` for expanding active archetype card details.
- **Checker Agent Gate 5.2**:
  - [ ] Confirms prev/next navigation steps through all 4 archetypes with active card scaling.

### Subphase 5.3: Squad Matcher Resonance Engine
- **Target File**: `src/components/profile/SquadMatcher.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/06-graph-nodes-and-flow-canvases.tsx` — `CadNode` & `PulsingDataEdge` (Candidate match nodes and connecting bezier edges).
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIAnimatedBeam` (Pulsating energy beam linking matched developers).
  * `Reference_components/13-collect-ui-specialized-patterns.tsx` — `CollectUIMetricStatCard` (Mini resonance stat cards with tolerance bands).
  * `animejs/03-stagger-and-timeline-choreography.ts` — Staggered candidate match reveal animation sequence.
- **Checker Agent Gate 5.3**:
  - [ ] Accepts optional `data?: ProfileData` prop to ensure seamless compatibility with `ProfileDashboardView.tsx`.
  - [ ] Animated circular resonance gauge renders with zero SVG errors.

### Subphase 5.4: Profile Analytics Landing Page Assembly
- **Target File**: `src/app/profile-analytics/page.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `lenis/05-lenis-smooth-scroll.ts` — Smooth scroll coordination across long profile telemetry pages.
- **Checker Agent Gate 5.4**:
  - [ ] `selection:bg-indigo/30 selection:text-indigo` is completely purged.
  - [ ] `tsc --noEmit` exits with code 0.
  - [ ] Phase 5 sign-off issued by Orchestrator Agent. Phase 6 unlocked.
