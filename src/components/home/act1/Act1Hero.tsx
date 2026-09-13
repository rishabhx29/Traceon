// src/components/home/act1/Act1Hero.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Copy,
  Check,
  GitBranch,
  Dna,
  Terminal,
} from 'lucide-react';

// Dynamically import Three.js WebGL canvas on client only
const Act1Canvas = dynamic(
  () => import('@/components/canvas/act1/Act1Canvas'),
  { ssr: false }
);

export function Act1Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cliCopied, setCliCopied] = useState(false);
  const [act6Mode, setAct6Mode] = useState<'repo' | 'dna'>('repo');
  const [act6Repo, setAct6Repo] = useState('facebook/react');
  const [act6User, setAct6User] = useState('octocat');
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleCliCopy = () => {
    navigator.clipboard.writeText('npx traceon@latest init');
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  const handleLaunchRepo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!act6Repo.trim()) return;
    const clean = act6Repo.replace(/^https?:\/\/github\.com\//, '').trim();
    router.push(`/repo?url=${encodeURIComponent(`https://github.com/${clean}`)}`);
  };

  const handleLaunchUser = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!act6User.trim()) return;
    const clean = act6User.replace(/^@/, '').trim();
    router.push(`/profile-analytics?username=${encodeURIComponent(clean)}`);
  };

  // Respect prefers-reduced-motion: skip the 3D scene & scroll-scrubbed transforms
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // High-performance hardware-accelerated scroll tracking
  // Works 100% natively without DOM manipulation or pin-spacer interference
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1.0, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Smooth cubic ease-in-out helper for continuous S-curve transitions
  const smoothEase = (t: number) => t * t * (3.0 - 2.0 * t);

  // Act 1 stays rock-solid [0.00 .. 0.08], then dissolves over [0.08 .. 0.16]
  const rawAct1 = Math.max(0, Math.min(1.0, (0.16 - scrollProgress) / 0.08));
  const act1Opacity = smoothEase(rawAct1);

  // Act 2 emerges over [0.14 .. 0.21], stays solid [0.21 .. 0.28], dissolves over [0.28 .. 0.35]
  const rawAct2In = Math.max(0, Math.min(1.0, (scrollProgress - 0.14) / 0.07));
  const rawAct2Out = Math.max(0, Math.min(1.0, (0.35 - scrollProgress) / 0.07));
  const act2Opacity = smoothEase(rawAct2In) * smoothEase(rawAct2Out);

  // Act 3 emerges over [0.32 .. 0.39], stays solid [0.39 .. 0.46], dissolves over [0.46 .. 0.53]
  const rawAct3In = Math.max(0, Math.min(1.0, (scrollProgress - 0.32) / 0.07));
  const rawAct3Out = Math.max(0, Math.min(1.0, (0.53 - scrollProgress) / 0.07));
  const act3Opacity = smoothEase(rawAct3In) * smoothEase(rawAct3Out);

  // Act 4 emerges over [0.50 .. 0.57], stays solid [0.57 .. 0.65], dissolves over [0.65 .. 0.72]
  const rawAct4In = Math.max(0, Math.min(1.0, (scrollProgress - 0.50) / 0.07));
  const rawAct4Out = Math.max(0, Math.min(1.0, (0.72 - scrollProgress) / 0.07));
  const act4Opacity = smoothEase(rawAct4In) * smoothEase(rawAct4Out);

  // Act 5 emerges over [0.69 .. 0.76], stays solid [0.76 .. 0.83], dissolves over [0.83 .. 0.90]
  const rawAct5In = Math.max(0, Math.min(1.0, (scrollProgress - 0.69) / 0.07));
  const rawAct5Out = Math.max(0, Math.min(1.0, (0.90 - scrollProgress) / 0.07));
  const act5Opacity = smoothEase(rawAct5In) * smoothEase(rawAct5Out);

  // Act 6 emerges over [0.87 .. 0.94] and stays rock-solid [0.94 .. 1.00]
  const rawAct6 = Math.max(0, Math.min(1.0, (scrollProgress - 0.87) / 0.07));
  const act6Opacity = smoothEase(rawAct6);

  return (
    <section
      ref={containerRef}
      className="-mt-14 relative w-full h-[1080vh] bg-[#09090b]"
    >
      {/* ─── STICKY 100VH VIEWPORT (LOCKED TO SCREEN WHILE TRACK SCROLLS) ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-[#09090b]">
        
        {/* ─── 1. 3D WEBGL LUMINOUS TIMELINE & NEBULA CANVAS ────────────────── */}
        {reducedMotion ? (
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(16,185,129,0.08), transparent 70%), radial-gradient(ellipse 60% 50% at 70% 70%, rgba(245,158,11,0.05), transparent 70%)',
            }}
            aria-hidden="true"
          />
        ) : (
          <Act1Canvas scrollProgress={scrollProgress} />
        )}

        {/* Soft Ambient Radial Lighting */}
        <div className="absolute -bottom-24 -left-24 w-[32rem] h-[32rem] bg-[#10b981]/[0.06] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[32rem] h-[32rem] bg-[#f59e0b]/[0.05] rounded-full blur-[160px] pointer-events-none" />

        {/* Act 2 Celestial Cosmic Nebula Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 -z-10"
          style={{ opacity: act2Opacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[32rem] bg-gradient-to-r from-[#10b981]/15 via-[#f59e0b]/10 to-[#06b6d4]/12 rounded-full blur-[140px]" />
        </div>

        {/* Act 3 The Entangled Monolith Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 -z-10"
          style={{ opacity: act3Opacity }}
        >
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-gradient-to-tr from-[#06b6d4]/08 via-[#f59e0b]/06 to-[#10b981]/06 rounded-full blur-[160px]" />
        </div>

        {/* Act 4 Crystalline AST Polyhedral Nucleus Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 -z-10"
          style={{ opacity: act4Opacity }}
        >
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] bg-gradient-to-tl from-[#10b981]/15 via-[#34d399]/10 to-[#06b6d4]/08 rounded-full blur-[160px]" />
        </div>

        {/* Act 5 Developer Genome DNA Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 -z-10"
          style={{ opacity: act5Opacity }}
        >
          <div className="absolute top-1/2 left-[18%] -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] bg-gradient-to-tr from-[#10b981]/12 via-[#f59e0b]/10 to-[#06b6d4]/10 rounded-full blur-[160px]" />
        </div>

        {/* Act 6 Chronos Singularity Reactor Core Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 -z-10"
          style={{ opacity: act6Opacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[54rem] bg-gradient-to-tr from-[#10b981]/15 via-[#06b6d4]/12 to-[#f59e0b]/10 rounded-full blur-[180px]" />
        </div>

        {/* ─── 2. ACT 1 OVERLAY (THE SACRED TIMELINE) ─────────────── */}
        <div 
          className="absolute inset-0 z-20 flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-14 pointer-events-none"
          style={{
            opacity: act1Opacity,
            transform: `translateY(-${(1.0 - act1Opacity) * 24}px)`,
            pointerEvents: act1Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-2xl py-16">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.05] mb-6 text-balance">
              Every codebase is a timeline.
            </h1>

            <p className="font-sans text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg">
              Trace architecture, commits, and dependencies into an interactive, observable 3D universe. Zero compile overhead.
            </p>

            {/* Quick CLI Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-md mb-8 group hover:border-zinc-700 transition-colors">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <code className="text-xs font-mono text-zinc-300">npx traceon@latest</code>
              <button
                onClick={handleCliCopy}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer active:scale-[0.92]"
                title="Copy install command"
                aria-label="Copy install command"
              >
                {cliCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Tactile Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/repo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-sm transition-all duration-150 active:scale-[0.97] cursor-pointer shadow-lg shadow-white/5"
              >
                Explore Timeline <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/profile-analytics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-800 hover:border-zinc-600 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-300 hover:text-white text-sm transition-all duration-150 active:scale-[0.97] cursor-pointer"
              >
                Developer DNA
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 3. ACT 2 OVERLAY (THE CODE UNIVERSE MANIFESTO) ────────── */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pt-16 pb-14 text-center pointer-events-none"
          style={{
            opacity: act2Opacity,
            transform: `translateY(${(1.0 - act2Opacity) * 20}px)`,
            pointerEvents: act2Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.08] mb-5 text-balance">
              Demystify code. <br />
              <span className="text-zinc-400 font-normal">Decode developers.</span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto mb-8">
              Static documentation decays the moment it is written. Traceon compiles raw git history and AST structures into an observable, living topography.
            </p>

            {/* Editorial Typographic Telemetry */}
            <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-200 font-medium">15,000+</span>
                <span>AST nodes parsed</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-zinc-200 font-medium">Deterministic</span>
                <span>call graph</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-zinc-200 font-medium">Zero</span>
                <span>compile overhead</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. ACT 3 OVERLAY (CIRCULAR DEPENDENCY & BLAST RADIUS) ── */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-end px-6 sm:px-12 lg:px-20 pt-14 pointer-events-none"
          style={{
            opacity: act3Opacity,
            transform: `translateY(${(1.0 - act3Opacity) * 20}px)`,
            pointerEvents: act3Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-lg py-16 text-left">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.08] mb-3 text-balance">
              Untangle the knot.
            </h2>
            <p className="text-sm font-sans text-rose-400/90 font-medium mb-4">
              Hidden circular loops quietly freeze refactoring.
            </p>

            <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
              Modules drift into mutual entanglement until a single change breaks distant endpoints. Traceon isolates cyclic import paths and calculates blast radius before pull requests merge.
            </p>

            {/* Dependency Micro-Trace */}
            <div className="py-3 mb-6 border-y border-zinc-800/80">
              <div className="text-[11px] font-mono text-zinc-400 mb-2 uppercase tracking-wider">
                Detected Cycle
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 flex-wrap">
                <span className="text-rose-400">auth/session</span>
                <span className="text-zinc-600">→</span>
                <span>db/pool</span>
                <span className="text-zinc-600">→</span>
                <span>middleware/rbac</span>
                <span className="text-zinc-600">→</span>
                <span className="text-rose-400 underline decoration-rose-500/50 underline-offset-4">⟳ loop</span>
              </div>
            </div>

            {/* Typographic Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <div className="text-2xl font-sans font-semibold text-white tracking-tight">18</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Files affected</div>
              </div>
              <div>
                <div className="text-2xl font-sans font-semibold text-white tracking-tight">14</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Depth hops</div>
              </div>
              <div>
                <div className="text-2xl font-sans font-semibold text-rose-400 tracking-tight">0 ms</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Runtime drag</div>
              </div>
            </div>

            {/* Action */}
            <Link
              href="/repo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-xs tracking-wide transition-all active:scale-[0.97] cursor-pointer"
            >
              Audit Blast Radius <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ─── 5. ACT 4 OVERLAY (MONOREPO TOPOLOGY & AST MAPPING) ────────── */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-start px-6 sm:px-12 lg:px-20 pt-14 pointer-events-none"
          style={{
            opacity: act4Opacity,
            transform: `translateY(${(1.0 - act4Opacity) * 20}px)`,
            pointerEvents: act4Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-lg py-16 text-left">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.08] mb-3 text-balance">
              Your architecture, <br />
              <span className="text-zinc-400 font-normal">alive in 3D.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
              Static architecture diagrams are dead the second they are exported. Traceon renders your repository as a living tree of interface contracts, runtime boundaries, and submodule dependencies.
            </p>

            {/* Spatial Hierarchy Breakdown */}
            <div className="space-y-2.5 py-3 mb-6 border-y border-zinc-800/80 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-200 font-medium">Canopy</span>
                </div>
                <span className="text-zinc-400">24,000 exported functions &amp; types</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-zinc-200 font-medium">Trunk Spine</span>
                </div>
                <span className="text-zinc-400">Deterministic AST runtime engine</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-zinc-200 font-medium">Root Foundations</span>
                </div>
                <span className="text-zinc-400">86 core package dependencies</span>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center gap-4">
              <Link
                href="/repo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-xs tracking-wide transition-all active:scale-[0.97] cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Inspect Monorepo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/profile-analytics"
                className="text-xs text-zinc-400 hover:text-white font-mono transition-colors"
              >
                View Capability Radar →
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 6. ACT 5 OVERLAY (DEVELOPER GENOME & GIT FORENSICS) ── */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-end px-6 sm:px-12 lg:px-20 pt-14 pointer-events-none"
          style={{
            opacity: act5Opacity,
            transform: `translateY(${(1.0 - act5Opacity) * 20}px)`,
            pointerEvents: act5Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="max-w-lg py-16 text-left">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.08] mb-3 text-balance">
              Commits don&apos;t lie.
            </h2>
            <p className="text-sm font-sans text-amber-400/90 font-medium mb-4">
              Measure genuine engineering craft, not resume buzzwords.
            </p>

            <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
              Resumes tell stories; git commit histories prove impact. Traceon computes forensic signals on pull request atomicity, architectural ownership, and code longevity over time.
            </p>

            {/* Typographic Contributor Genome Stats */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 py-4 mb-6 border-y border-zinc-800/80">
              <div>
                <div className="text-2xl font-sans font-semibold text-white tracking-tight">42%</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Refactoring depth (not churn)</div>
              </div>
              <div>
                <div className="text-2xl font-sans font-semibold text-white tracking-tight">~140 LOC</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Average PR atomicity</div>
              </div>
              <div>
                <div className="text-2xl font-sans font-semibold text-white tracking-tight">72%</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Core architectural ownership</div>
              </div>
              <div>
                <div className="text-2xl font-sans font-semibold text-amber-400 tracking-tight">Top 2%</div>
                <div className="text-xs text-zinc-400 font-sans mt-0.5">Code longevity across releases</div>
              </div>
            </div>

            {/* Action */}
            <Link
              href="/profile-analytics"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-medium text-xs tracking-wide transition-all active:scale-[0.97] cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Analyze Developer DNA <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ─── 7. ACT 6 OVERLAY (COSMIC GATEWAY PORTAL) ─────── */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 py-12 text-center pointer-events-none"
          style={{
            opacity: act6Opacity,
            transform: `translateY(${(1.0 - act6Opacity) * 20}px)`,
            pointerEvents: act6Opacity > 0.4 ? 'auto' : 'none',
          }}
        >
          {/* Header */}
          <div className="max-w-xl mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.08] mb-3 text-balance">
              Enter the Event Horizon.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
              Where thousands of disparate modules and git histories collapse into singular clarity. Enter any repository or GitHub handle to begin.
            </p>
          </div>

          {/* Central Command Capsule (Linear / Raycast style) */}
          <div className="w-full max-w-lg">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-full bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl mb-4">
              <button
                type="button"
                onClick={() => setAct6Mode('repo')}
                aria-pressed={act6Mode === 'repo'}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                  act6Mode === 'repo'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Repository Graph
              </button>
              <button
                type="button"
                onClick={() => setAct6Mode('dna')}
                aria-pressed={act6Mode === 'dna'}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                  act6Mode === 'dna'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Developer DNA
              </button>
            </div>

            {/* Unified Input Capsule */}
            <form
              onSubmit={act6Mode === 'repo' ? handleLaunchRepo : handleLaunchUser}
              className="relative flex items-center bg-zinc-950/80 border border-zinc-700/80 hover:border-zinc-500/80 focus-within:border-cyan-400/80 rounded-full p-1.5 backdrop-blur-2xl transition-all shadow-[0_0_50px_-15px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center gap-2 pl-4 pr-2 text-xs font-mono text-zinc-400">
                {act6Mode === 'repo' ? (
                  <>
                    <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-zinc-500 hidden sm:inline select-none">github.com/</span>
                  </>
                ) : (
                  <>
                    <Dna className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-zinc-500 select-none">@</span>
                  </>
                )}
              </div>

              <label htmlFor="act6-command-input" className="sr-only">
                {act6Mode === 'repo'
                  ? 'GitHub repository as owner/repo'
                  : 'GitHub username to analyze'}
              </label>
              <input
                id="act6-command-input"
                type="text"
                value={act6Mode === 'repo' ? act6Repo : act6User}
                onChange={(e) =>
                  act6Mode === 'repo' ? setAct6Repo(e.target.value) : setAct6User(e.target.value)
                }
                placeholder={act6Mode === 'repo' ? 'owner/repo' : 'username'}
                aria-label={
                  act6Mode === 'repo'
                    ? 'GitHub repository, for example facebook/react'
                    : 'GitHub username to analyze'
                }
                className="bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none flex-1 font-mono min-w-0"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-medium transition-all active:scale-[0.95] cursor-pointer shrink-0 shadow-sm"
              >
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-mono text-zinc-500">
              <span className="text-zinc-600">Quick explore:</span>
              {act6Mode === 'repo'
                ? ['facebook/react', 'vercel/next.js', 'fastapi/fastapi'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAct6Repo(preset)}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {preset.split('/')[1]}
                    </button>
                  ))
                : ['octocat', 'torvalds', 'shadcn'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAct6User(preset)}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      @{preset}
                    </button>
                  ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Act1Hero;
