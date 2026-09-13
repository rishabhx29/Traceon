import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, Cpu, Dna, GitBranch, Github, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Traceon — 3D Codebase Intelligence & Engineering DNA',
    description: 'Learn about Traceon: an open-source platform that compiles raw git history and AST structures into living 3D dependency topographies and developer forensic telemetry.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-surface-0 pt-24 pb-20">
            <div className="mx-auto max-w-4xl px-5 sm:px-8">
                {/* Header */}
                <div className="mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/10 text-xs font-mono text-emerald mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>About Traceon</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-0 tracking-tight mb-4">
                        Codebases are living timelines.
                    </h1>
                    <p className="text-lg text-text-2 max-w-2xl leading-relaxed">
                        Traceon compiles abstract syntax trees, dependency graphs, and git histories into
                        interactive 3D topographies—giving engineering teams total architectural clarity.
                    </p>
                </div>

                {/* Mission Card */}
                <div className="card p-8 border border-stroke bg-surface-1 rounded-2xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald/5 rounded-full blur-[100px] pointer-events-none" />
                    <h2 className="text-2xl font-bold font-display text-text-0 mb-4">
                        Why We Built Traceon
                    </h2>
                    <div className="space-y-4 text-text-2 leading-relaxed text-[15px]">
                        <p>
                            Modern software engineering has outgrown 2D file trees and flat pull request diffs.
                            When you review a 40-file pull request or onboard to a monorepo with 500,000 lines of code,
                            understanding how an interface change cascades across boundary contracts is nearly impossible
                            with text alone.
                        </p>
                        <p>
                            We built Traceon to treat codebases as dimensional topologies. By parsing ASTs across
                            JavaScript, TypeScript, React, and polyglot dependencies, Traceon constructs a living graph
                            that visualizes imports, calculates exact blast radius scores, and isolates cyclic bottlenecks
                            before code merges to production.
                        </p>
                    </div>
                </div>

                {/* Core Pillars */}
                <h2 className="text-xl font-mono text-emerald uppercase tracking-wider mb-6">
                    Core Pillars
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 mb-14">
                    <div className="p-6 rounded-xl border border-stroke bg-surface-1/60 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald mb-4">
                                <GitBranch className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-text-0 mb-2 font-display">3D Dependency Topography</h3>
                            <p className="text-sm text-text-2 leading-relaxed">
                                GPU-accelerated WebGL graph rendering maps import cycles, cluster density, and
                                architectural layers in an intuitive three-dimensional space.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-stroke bg-surface-1/60 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center text-amber mb-4">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-text-0 mb-2 font-display">Topological Blast Radius</h3>
                            <p className="text-sm text-text-2 leading-relaxed">
                                Proprietary graph heuristics measure transitive dependent depth and centrality,
                                identifying high-risk bottleneck modules before breaking changes happen.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-stroke bg-surface-1/60 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                                <Dna className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-text-0 mb-2 font-display">Engineering DNA</h3>
                            <p className="text-sm text-text-2 leading-relaxed">
                                Forensic commit analysis generates deep developer telemetry: PR atomicity,
                                domain specialization, architecture ownership, and code longevity.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-stroke bg-surface-1/60 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-text-0 mb-2 font-display">Zero-Retention Security</h3>
                            <p className="text-sm text-text-2 leading-relaxed">
                                Your source code never persists on our servers. Analysis is performed on in-memory
                                AST representations and immediately purged once graphs are built.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Open Source Ethos */}
                <div className="p-8 rounded-2xl border border-stroke bg-surface-1 mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <Code2 className="w-6 h-6 text-emerald" />
                        <h2 className="text-2xl font-bold font-display text-text-0">
                            Built in Public & Open Source
                        </h2>
                    </div>
                    <p className="text-text-2 leading-relaxed text-[15px] mb-6">
                        Traceon is open-source software built for developers, architects, and engineering leaders.
                        We believe critical developer infrastructure should be auditable, extensible, and transparent.
                        Contribute plugins, inspect our AST parser algorithms, or self-host your own instance.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="https://github.com/Rishabhworkspace/Traceon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-0 text-sm font-medium border border-stroke transition-all"
                        >
                            <Github className="w-4 h-4" />
                            <span>Star on GitHub</span>
                        </a>
                        <Link
                            href="/repo"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald hover:bg-emerald-dim text-black text-sm font-medium transition-all"
                        >
                            <span>Explore 3D Graph</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
