# Phase 2: Global Navigation & Architectural HUD — Master Blueprint

> **Platform:** Traceon — Unified Codebase AST Intelligence & Profile Engineering DNA  
> **Document:** `docs/phases/phase2.md` (and root `phase2.md`)  
> **Status:** Pending Approval before Execution  
> **Prerequisite:** Phase 1 Complete and Verified  
> **Authoring Team:** UX Navigation, Visual Design, Performance, UI Critic, and Orchestration Agents  

---

## 1. Phase Overview & Strategic Intent

Modern web design has collapsed into generic floating pill navbars with glassmorphism and rainbow borders. Phase 2 eliminates this pattern entirely, replacing it with an **Architectural Avionics HUD Telemetry Bar**. 

The HUD serves as a mission-control instrument panel for Traceon's twin core pillars:
1. **Repository Architecture Lens** (AST parsing, circular loop detection, blast radius, dependency graph).
2. **Developer Engineering DNA Lens** (CURISM vector scoring, archetypes, squad compatibility).

### Core Deliverables:
- **`HUDNavbar.tsx`**: Precision top bar with 1px `--color-steel` border, live scroll position telemetry (`SCROLL: X%`), GSAP ScrollTrigger height compression (64px to 52px), and authentication session management.
- **`LensSwitcher.tsx`**: Physical tactile toggle modeled on aerospace instrumentation, allowing one-click spatial lens switching with amber/emerald LED indicator dots.
- **`CommandOmnibox.tsx`**: Universal terminal command palette triggered via `Cmd+K` / `Ctrl+K`, parsing raw repository URLs, GitHub handles, or keyboard shortcuts without leaving the keyboard.
- **Mobile Staggered Drawer**: Fullscreen navigation drawer utilizing Anime.js v4 timeline entrance physics.

---

## 2. Multi-Agent Orchestration & Simultaneous Collaboration Matrix

During the execution of Phase 2, subagents collaborate simultaneously with step-by-step checker verification:

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 2 MULTI-AGENT EXECUTION FLOW                          │
├───────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   [Agent 10: Agent Orchestrator]                                                      │
│        │                                                                              │
│        ├──► Assigns Subphase 2.1 (LensSwitcher) ────────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 2.1           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 2.2 (CommandOmnibox) ──────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 2.2           │
│        │                                                        │                     │
│        ├──► Assigns Subphase 2.3 & 2.4 (HUDNavbar) ─────► [Implementor Agent]         │
│        │                                                        │                     │
│        │                                                        ▼                     │
│        │                                              [Agent 9: Checker Agent]        │
│        │                                              VERIFICATION GATE 2.3 & 2.4     │
│        │                                                        │                     │
│        └──► Final Phase 2 Audit ────────────────────────► [Agent 9: Checker Agent]    │
│                                                       & [Agent 4: UX Architect]       │
│                                                       PASS -> Unlock Phase 3          │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Subagent Roles & Mandates:
1. **`agent-orchestrator-workflow-mgr`**:
   - Manages state machine between subphases.
   - Ensures `layout.tsx` does not replace legacy navbar until all 3 child components pass their respective checker gates.
2. **`phase2-navigation-implementor`**:
   - Creates and integrates `LensSwitcher.tsx`, `CommandOmnibox.tsx`, and `HUDNavbar.tsx`.
3. **`ui-critic-qa-agent` (The Checker Agent)**:
   - Verifies keyboard trap prevention in `CommandOmnibox` (`Escape` exits, `Tab` cycles, arrow keys navigate).
   - Audits scroll performance of GSAP compression (verifies `gsap.to` modifies transform/height cleanly without layout thrashing).
   - Validates active lens indicator states against Next.js route changes.
4. **`ux-navigation-architect`**:
   - Ensures all internal route transitions (`/repo`, `/graph`, `/dashboard`, `/profile-analytics`, `/profile`, `/docs`) are intuitively accessible within 1 click.
5. **`performance-tech-feasibility-researcher`**:
   - Audits `window.addEventListener` cleanup on unmount for all global hotkeys (`Cmd+K`).

---

## 3. Visual & Thematic Specifications

### 3.1 Color & Surface Architecture
- **HUD Frame Background**: `rgba(5, 5, 6, 0.85)` with `backdrop-blur-xl`.
- **Border**: `1px solid var(--color-steel)` (`#1E1E24`).
- **Telemetry Readout**: `font-mono text-[10px] text-[#7A7A85]`.
- **Active Lens Indicators**:
  - Architecture Lens: Cadmium Amber (`#F59E0B`) LED dot with `shadow-[0_0_6px_#F59E0B]`.
  - Engineer DNA Lens: Phosphor Emerald (`#10B981`) LED dot with `shadow-[0_0_6px_#10B981]`.
- **Active Navigation Indicator**: 1px horizontal amber phosphor underline (`#F59E0B`) with glow.

### 3.2 Dimensions & Scroll Behavior
- **Default Height**: `64px` (`h-16`).
- **Compressed Height**: `52px` (triggered after `window.scrollY > 50px`).
- **GSAP Animation**: `duration: 0.25s, ease: 'power2.out'`.
- **Safe Padding**: Root layout `<main className="min-h-screen pt-16">`.

---

## 4. Complete Reference Code & Implementation Specifications

### 4.1 `src/components/layout/LensSwitcher.tsx`
```typescript
'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function LensSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current active lens based on pathname
  const isDnaLens = pathname.startsWith('/profile') || pathname === '/profile-analytics';
  const isRepoLens = !isDnaLens;

  const handleSelectLens = (lens: 'repo' | 'dna') => {
    if (lens === 'repo' && !isRepoLens) {
      router.push('/repo');
    } else if (lens === 'dna' && !isDnaLens) {
      router.push('/profile-analytics');
    }
  };

  return (
    <div
      role="group"
      aria-label="Spatial View Lens Switcher"
      className="inline-flex items-center p-0.5 rounded-sm border border-[#1E1E24] bg-[#0A0A0C]"
    >
      {/* REPO LENS ACTUATOR */}
      <button
        type="button"
        onClick={() => handleSelectLens('repo')}
        aria-pressed={isRepoLens}
        className={cn(
          'relative flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.12em] rounded-sm transition-all duration-150 select-none cursor-pointer',
          isRepoLens
            ? 'bg-[#121215] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.5)] border border-[#1E1E24]'
            : 'text-[#7A7A85] hover:text-[#D1D1D6] hover:bg-[#121215]/50 border border-transparent'
        )}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200',
            isRepoLens ? 'bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]' : 'bg-[#7A7A85]/40'
          )}
          aria-hidden="true"
        />
        <span>Architecture</span>
      </button>

      {/* MECHANICAL SEPARATOR */}
      <div className="w-[1px] h-3.5 bg-[#1E1E24] mx-0.5" aria-hidden="true" />

      {/* DNA LENS ACTUATOR */}
      <button
        type="button"
        onClick={() => handleSelectLens('dna')}
        aria-pressed={isDnaLens}
        className={cn(
          'relative flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.12em] rounded-sm transition-all duration-150 select-none cursor-pointer',
          isDnaLens
            ? 'bg-[#121215] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.5)] border border-[#1E1E24]'
            : 'text-[#7A7A85] hover:text-[#D1D1D6] hover:bg-[#121215]/50 border border-transparent'
        )}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200',
            isDnaLens ? 'bg-[#10B981] shadow-[0_0_6px_#10B981]' : 'bg-[#7A7A85]/40'
          )}
          aria-hidden="true"
        />
        <span>Engineer DNA</span>
      </button>
    </div>
  );
}

export default LensSwitcher;
```

---

### 4.2 `src/components/layout/CommandOmnibox.tsx`
```typescript
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, GitBranch, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/ui/MonoLabel';

interface CommandOmniboxProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickAction {
  id: string;
  category: 'NAVIGATION' | 'EXECUTION' | 'SYSTEM';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: 'amber' | 'emerald' | 'muted';
  onSelect: () => void;
}

export function CommandOmnibox({ isOpen, onClose }: CommandOmniboxProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      id: 'repo-analyze',
      category: 'EXECUTION',
      title: 'Analyze Codebase AST',
      subtitle: 'Parse architecture, calculate blast radius & circular loops',
      badge: 'AST ENGINE',
      badgeColor: 'amber',
      onSelect: () => { onClose(); router.push('/repo'); },
    },
    {
      id: 'profile-dna',
      category: 'EXECUTION',
      title: 'Scan Developer DNA',
      subtitle: 'Extract CURISM vector, archetypes & squad compatibility',
      badge: 'CURISM DNA',
      badgeColor: 'emerald',
      onSelect: () => { onClose(); router.push('/profile-analytics'); },
    },
    {
      id: 'graph-view',
      category: 'NAVIGATION',
      title: 'Interactive Dependency Graph',
      subtitle: 'Open full-viewport canvas with live blast radius simulation',
      badge: 'CANVAS',
      badgeColor: 'muted',
      onSelect: () => { onClose(); router.push('/graph'); },
    },
    {
      id: 'dashboard',
      category: 'NAVIGATION',
      title: 'Architecture Dashboard',
      subtitle: 'Repository health, Halstead metrics & modular breakdown',
      badge: 'TELEMETRY',
      badgeColor: 'muted',
      onSelect: () => { onClose(); router.push('/dashboard'); },
    },
    {
      id: 'docs',
      category: 'SYSTEM',
      title: 'System Documentation & Specs',
      subtitle: 'Algorithm papers, AST grammar rules & API endpoints',
      badge: 'DOCS',
      badgeColor: 'muted',
      onSelect: () => { onClose(); router.push('/docs'); },
    },
  ];

  const filteredActions = query.trim()
    ? quickActions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleExecute = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      if (filteredActions[selectedIndex]) filteredActions[selectedIndex].onSelect();
      return;
    }

    if (trimmed.includes('github.com') || (trimmed.includes('/') && !trimmed.startsWith('@'))) {
      onClose();
      router.push(`/analyze?repo=${encodeURIComponent(trimmed)}`);
      return;
    }

    if (trimmed.startsWith('@') || !trimmed.includes('/')) {
      const username = trimmed.replace(/^@/, '');
      onClose();
      router.push(`/profile-analytics?user=${encodeURIComponent(username)}`);
      return;
    }

    if (filteredActions[selectedIndex]) {
      filteredActions[selectedIndex].onSelect();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-[#050506]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-[#1E1E24] bg-[#0A0A0C] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-sm overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Omnibox"
      >
        {/* Corner Crosshairs */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 text-[#7A7A85] text-[10px] font-mono pointer-events-none z-20">+</div>
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 text-[#7A7A85] text-[10px] font-mono pointer-events-none z-20">+</div>
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 text-[#7A7A85] text-[10px] font-mono pointer-events-none z-20">+</div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 text-[#7A7A85] text-[10px] font-mono pointer-events-none z-20">+</div>

        {/* Telemetry Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E1E24] bg-[#050506]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
            <MonoLabel className="text-[10px] text-[#7A7A85]">
              UNIVERSAL COMMAND OMNIBOX // SYS.INPUT.V2
            </MonoLabel>
          </div>
          <span className="font-mono text-[9px] text-[#7A7A85]">ESC to close</span>
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1E1E24] bg-[#0A0A0C]">
          <Terminal className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a GitHub repo (owner/repo), @username, or command..."
            className="w-full bg-transparent text-[#F5F5F7] font-mono text-sm placeholder:text-[#52525B] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#7A7A85] hover:text-[#F5F5F7] p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 divide-y divide-[#1E1E24]/30">
          {query.trim().length > 0 && (
            <div
              onClick={handleExecute}
              className="p-3 mb-1 rounded-sm bg-[#121215] border border-[#F59E0B]/30 hover:border-[#F59E0B] cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <GitBranch className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <div>
                  <div className="text-xs font-mono text-[#F5F5F7]">
                    Execute Target: <span className="text-[#F59E0B] font-semibold">{query}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#7A7A85] mt-0.5">
                    Press Enter to parse as GitHub Repository or Developer Profile
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}

          {filteredActions.map((action, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={action.id}
                onClick={action.onSelect}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-sm cursor-pointer transition-all duration-100',
                  isSelected
                    ? 'bg-[#121215] border border-[#1E1E24] text-[#F5F5F7]'
                    : 'text-[#D1D1D6] hover:bg-[#121215]/50 border border-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full shrink-0',
                      action.badgeColor === 'amber' ? 'bg-[#F59E0B]' : action.badgeColor === 'emerald' ? 'bg-[#10B981]' : 'bg-[#7A7A85]'
                    )}
                  />
                  <div>
                    <div className="text-xs font-mono font-medium">{action.title}</div>
                    <div className="text-[10px] font-mono text-[#7A7A85] mt-0.5">{action.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border text-[#7A7A85] border-[#1E1E24] bg-[#050506]">
                    {action.badge}
                  </span>
                  <ArrowRight className={cn('w-3.5 h-3.5 transition-transform', isSelected ? 'text-[#F5F5F7] translate-x-0.5' : 'text-transparent')} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Telemetry Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1E1E24] bg-[#050506] text-[10px] font-mono text-[#7A7A85]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
          <div>STATUS: ONLINE // READY</div>
        </div>
      </div>
    </div>
  );
}

export default CommandOmnibox;
```

---

### 4.3 `src/components/layout/HUDNavbar.tsx`
```typescript
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, Terminal, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LensSwitcher } from './LensSwitcher';
import { CommandOmnibox } from './CommandOmnibox';
import { PopActuator } from '@/components/ui/PopActuator';
import { MonoLabel } from '@/components/ui/MonoLabel';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';

export function HUDNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [omniboxOpen, setOmniboxOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOmniboxOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // GSAP scroll compression and telemetry tracker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const nav = navRef.current;
    if (!nav) return;

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        const pct = Math.round(self.progress * 100);
        setScrollProgress(pct);

        if (self.scroll() > 50) {
          gsap.to(nav, {
            height: 52,
            backgroundColor: 'rgba(5, 5, 6, 0.92)',
            duration: 0.25,
            ease: 'power2.out',
          });
        } else {
          gsap.to(nav, {
            height: 64,
            backgroundColor: 'rgba(5, 5, 6, 0.80)',
            duration: 0.25,
            ease: 'power2.out',
          });
        }
      },
    });

    return () => st.kill();
  }, [pathname]);

  // Mobile menu stagger animation using Anime.js
  useEffect(() => {
    if (mobileOpen) {
      try {
        animate('.mobile-nav-item', {
          opacity: [0, 1],
          translateX: [-12, 0],
          duration: 250,
          delay: ((_el: unknown, i: number = 0) => i * 40) as any,
          ease: 'outQuad',
        });
      } catch {
        // Handled by CSS
      }
    }
  }, [mobileOpen]);

  if (pathname === '/') return null;

  const isDna = pathname.startsWith('/profile') || pathname === '/profile-analytics';

  const repoNavLinks = [
    { label: 'Ingest', href: '/repo' },
    { label: 'Graph', href: '/graph' },
    { label: 'Telemetry', href: '/dashboard' },
    { label: 'Spec', href: '/docs' },
  ];

  const dnaNavLinks = [
    { label: 'DNA Engine', href: '/profile-analytics' },
    { label: 'Profile', href: '/profile' },
    { label: 'Spec', href: '/docs' },
  ];

  const navLinks = isDna ? dnaNavLinks : repoNavLinks;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#1E1E24] bg-[#050506]/80 backdrop-blur-xl transition-colors select-none"
      >
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* LEFT ZONE: TRACEON Logotype + Version Tag */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/home" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-6 h-6 rounded-sm bg-[#121215] border border-[#1E1E24] flex items-center justify-center group-hover:border-[#F59E0B] transition-colors">
                <GitBranch className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-[15px] tracking-tight text-[#F5F5F7]">
                  TRACEON
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A7A85] px-1 py-0.2 rounded-sm border border-[#1E1E24] bg-[#0A0A0C]">
                  v2.0
                </span>
              </div>
            </Link>

            {/* DUAL-LENS SPATIAL SWITCHER */}
            <div className="hidden lg:flex items-center ml-2">
              <LensSwitcher />
            </div>
          </div>

          {/* CENTER ZONE: Nav Links + Live Telemetry */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'relative px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] transition-colors',
                      isActive ? 'text-[#F5F5F7] font-semibold' : 'text-[#7A7A85] hover:text-[#D1D1D6]'
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[#1E1E24] bg-[#0A0A0C] font-mono text-[10px] text-[#7A7A85]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>SYS.READY</span>
              <span className="text-[#1E1E24]">|</span>
              <span>SCROLL: {scrollProgress}%</span>
            </div>
          </div>

          {/* RIGHT ZONE: Omnibox Trigger + Auth Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setOmniboxOpen(true)}
              aria-label="Open Command Omnibox"
              className="flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[#1E1E24] bg-[#0A0A0C] hover:border-[#7A7A85]/50 text-[#7A7A85] hover:text-[#D1D1D6] transition-all cursor-pointer font-mono text-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Search</span>
              <span className="font-mono text-[9px] border border-[#1E1E24] px-1 bg-[#050506] rounded-sm text-[#7A7A85]">⌘K</span>
            </button>

            {status === 'loading' ? (
              <div className="w-16 h-7 rounded-sm bg-[#121215] animate-pulse border border-[#1E1E24]" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-2 py-1 rounded-sm border border-[#1E1E24] bg-[#0A0A0C] hover:bg-[#121215] text-[#D1D1D6] font-mono text-xs transition-colors"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={18}
                      height={18}
                      className="w-4 h-4 rounded-full object-cover border border-[#1E1E24]"
                      unoptimized
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#10B981]/20 text-[#10B981] text-[9px] font-mono font-bold flex items-center justify-center">
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-[11px]">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="p-1.5 rounded-sm border border-[#1E1E24] bg-[#0A0A0C] hover:bg-[#121215] text-[#7A7A85] hover:text-[#EF4444] transition-colors cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-[#7A7A85] hover:text-[#F5F5F7] transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/signup">
                  <PopActuator size="sm" ledColor="amber">
                    Launch
                  </PopActuator>
                </Link>
              </div>
            )}

            <button
              type="button"
              className="md:hidden p-1.5 rounded-sm border border-[#1E1E24] bg-[#0A0A0C] text-[#7A7A85] hover:text-[#F5F5F7] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1E1E24] bg-[#050506]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
            <div className="pb-2 border-b border-[#1E1E24]">
              <LensSwitcher />
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="mobile-nav-item flex items-center justify-between px-3 py-2 rounded-sm text-xs font-mono uppercase tracking-wider text-[#D1D1D6] hover:bg-[#121215] hover:text-[#F5F5F7] transition-colors border border-transparent hover:border-[#1E1E24]"
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] text-[#7A7A85]">→</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1E1E24] flex items-center justify-between text-[10px] font-mono text-[#7A7A85]">
              <span>STATUS: ONLINE</span>
              <span>SCROLL POS: {scrollProgress}%</span>
            </div>
          </div>
        )}
      </nav>

      <CommandOmnibox isOpen={omniboxOpen} onClose={() => setOmniboxOpen(false)} />
    </>
  );
}

export default HUDNavbar;
```

---

## 5. Granular Subphase Breakdown & Execution Plan

### Subphase 2.1: Dual-Lens Spatial Switcher
- **Target File**: `src/components/layout/LensSwitcher.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/08-vengeance-ui-specialized-primitives.tsx` — `VengeanceNotchNavbar` (Tactile tab notch geometry and LED indicator).
  * `Reference_components/11-shadcn-cad-primitives.tsx` — `CADSegmentedTabs` (Tab state persistence and active pill slider).
  * `Reference_components/09-aceternity-ui-specialized-primitives.tsx` — `AceternityFloatingDock` (Spatial lens hover magnification and layout spring).
  * `animejs/02-spring-and-easing-physics.ts` — Mechanical sliding tab spring physics (`createSpring({ stiffness: 350, damping: 22 })`).
  * `gsap/03-flip-and-layout-transitions.ts` — `Flip.from()` layout transition for the active phosphor indicator.
- **Checker Agent Gate 2.1**:
  - [ ] Validates route detection: checks `/profile` and `/profile-analytics` activate DNA lens, while other routes activate Architecture lens.
  - [ ] Confirms mechanical border and LED dots are rendered without purple/blue colors.

### Subphase 2.2: Universal Command Omnibox
- **Target File**: `src/components/layout/CommandOmnibox.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/11-shadcn-cad-primitives.tsx` — `CADCommandDialog` (⌘K palette modal, shortcut badges, and backdrop).
  * `Reference_components/02-kinetic-typography-and-ciphers.tsx` — `MonospaceDecryptionCipher` (Cipher decrypt search result animation).
  * `Reference_components/14-magic-ui-specialized-primitives.tsx` — `MagicUIHyperText` (Alphanumeric cyber scramble on keyboard cursor focus).
  * `animejs/03-stagger-and-timeline-choreography.ts` — Staggered spring entrance choreography for query search results.
  * `gsap/04-split-text-and-scramble.ts` — Real-time monospace text scramble effect for active command suggestions.
- **Checker Agent Gate 2.2**:
  - [ ] Global `Cmd+K` / `Ctrl+K` keydown listener properly attaches and detaches on unmount.
  - [ ] `Escape` key immediately closes the dialog.
  - [ ] Input correctly routes GitHub URLs to `/analyze?repo=...` and user handles to `/profile-analytics?user=...`.

### Subphase 2.3: HUD Telemetry Navigation Bar & GSAP Compression
- **Target File**: `src/components/layout/HUDNavbar.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `Reference_components/08-vengeance-ui-specialized-primitives.tsx` — `VengeanceNotchNavbar` (Avionics HUD notch geometry and status reticle).
  * `Reference_components/01-tactile-actuators-and-buttons.tsx` — `CADCornerReticleButton` (Precision button triggers on navbar right wing).
  * `Reference_components/12-react-bits-specialized-primitives.tsx` — `ReactBitsTrueFocus` (Precision corner brackets around active route link).
  * `gsap/02-scrolltrigger-and-pinning.ts` — `ScrollTrigger.create()` for navbar height compression (64px $\to$ 52px) and scroll progress binding.
  * `lenis/05-lenis-smooth-scroll.ts` — `useLenis()` for tracking scroll velocity and direction without layout jitter.
- **Checker Agent Gate 2.3**:
  - [ ] ScrollTrigger updates telemetry scroll percentage accurately without CPU lockup.
  - [ ] Height smoothly compresses from 64px to 52px on scroll.

### Subphase 2.4: Layout Integration & Verification
- **Target File**: `src/app/layout.tsx`.
- **Resource Toolkits & Reference Paths to Access**:
  * `lenis/06-integrated-cad-motion-controller.ts` — Verifying universal RAF binding and route transition coordination.
- **Checker Agent Gate 2.4**:
  - [ ] Replace legacy `Navbar` with `HUDNavbar`.
  - [ ] Run `tsc --noEmit` -> Must exit with code 0.
  - [ ] Phase 2 sign-off issued by Orchestrator Agent. Phase 3 unlocked.
