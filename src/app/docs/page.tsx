import { Layers, Zap, GitBranch, Terminal, Shield, Cpu } from 'lucide-react';

export const metadata = {
    title: 'Documentation | Traceon',
    description: 'Learn how to use Traceon to analyze your codebases, explore 3D dependency topographies, and decode developer Engineering DNA.',
};

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-surface-0 pt-24 pb-20">
            <div className="mx-auto max-w-4xl px-5">
                <div className="mb-12">
                    <h1 className="text-4xl font-display font-bold text-text-0 mb-4">
                        Documentation
                    </h1>
                    <p className="text-text-2 text-lg">
                        Everything you need to know about using Traceon effectively.
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* Section 1: Getting Started / How it Works */}
                    <div id="getting-started" className="scroll-mt-24 card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald/10 text-emerald">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 id="how-it-works" className="text-xl font-bold text-text-0">
                                Getting Started & How It Works
                            </h2>
                        </div>
                        <div className="space-y-4 text-text-2 leading-relaxed">
                            <p>
                                Traceon provides instant codebase intelligence without any complex agent installations or continuous build servers.
                                You can analyze repositories in three ways:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-text-1">Public GitHub URL:</strong> Simply paste the URL or repo slug of any public repository (e.g., <code>facebook/react</code>) on the home or repo page.
                                </li>
                                <li>
                                    <strong className="text-text-1">Developer Username:</strong> Enter any GitHub username to decode their commit cadence, code atomicity, and domain specialization.
                                </li>
                                <li>
                                    <strong className="text-text-1">ZIP Upload:</strong> For local workspaces or proprietary code, drag-and-drop a ZIP archive into the upload zone for ephemeral in-memory AST extraction.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 2: Understanding the Graph & Architecture */}
                    <div id="architecture" className="scroll-mt-24 card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-amber/10 text-amber">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h2 id="understanding-graph" className="text-xl font-bold text-text-0">
                                Understanding the 3D Dependency Graph
                            </h2>
                        </div>
                        <div className="space-y-4 text-text-2 leading-relaxed">
                            <p>
                                The interactive graph visualizes AST import and export relationships in dimensional space:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Nodes:</strong> Represent discrete source files in your codebase. Color denotes architectural role (Entry Points, Components, Utilities, State Stores, Services).</li>
                                <li><strong>Edges:</strong> Directed connections between nodes showing runtime and compilation import paths.</li>
                                <li><strong>Cyclic Detection:</strong> Interdependent dependency loops are highlighted with crimson warning vectors.</li>
                                <li><strong>File Inspector:</strong> Select any node to view exact lines of code (LOC), imported symbols, outgoing contracts, and topological gravity.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3: Impact Analysis & Blast Radius */}
                    <div id="impact-analysis" className="scroll-mt-24 card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-rose/10 text-rose">
                                <GitBranch className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-text-0">
                                Impact Analysis & Blast Radius
                            </h2>
                        </div>
                        <div className="space-y-4 text-text-2 leading-relaxed">
                            <p>
                                Determine the architectural blast radius of modifying or refactoring specific modules before opening a PR:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Calculates a composite Risk Score (0-100) combining direct downstream consumers and deep transitive closures.</li>
                                <li>Identifies <strong>Critical Bottlenecks</strong>—central modules whose modification poses high destabilization risks.</li>
                                <li>Reveals orphaned or dead modules with zero incoming connections for codebase pruning.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 4: Advanced Tools */}
                    <div id="advanced-tools" className="scroll-mt-24 card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-indigo/10 text-indigo">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-text-0">Advanced Tools</h2>
                        </div>
                        <div className="space-y-4 text-text-2 leading-relaxed">
                            <p>
                                Traceon provides specialized tools for monorepo analysis and architectural refactoring:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Traceon AI Assistant:</strong> Ask natural-language questions about codebase boundaries, request automated architecture summaries, or identify refactoring targets.</li>
                                <li><strong>Time-Travel Diffs:</strong> Scrub the commit timeline slider to observe architectural drift between git releases.</li>
                                <li><strong>Monorepo Boundaries:</strong> Visualize workspace boundaries across Turborepo, Nx, and pnpm packages.</li>
                                <li><strong>High-Fidelity Exports:</strong> Export diagrams as vectorized SVG, high-res PNG, executive PDF, or standalone interactive HTML.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 5: CLI & Automation */}
                    <div id="cli" className="scroll-mt-24 card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-text-0">CLI & Local Analysis</h2>
                        </div>
                        <div className="space-y-4 text-text-2 leading-relaxed">
                            <p>
                                Run Traceon directly inside your terminal or CI/CD pipeline:
                            </p>
                            <div className="p-3.5 rounded-lg bg-surface-0 border border-stroke font-mono text-sm text-emerald flex items-center justify-between">
                                <code>npx traceon-analyzer</code>
                            </div>
                            <p className="text-xs text-text-3">
                                Automatically scans project ASTs, validates cyclic rules, and generates a local topology report.
                            </p>
                        </div>
                    </div>

                    {/* Section 6: Security & Zero Retention */}
                    <div id="security" className="scroll-mt-24 card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald/10 text-emerald">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-text-0">Security & Zero Retention</h2>
                        </div>
                        <div className="space-y-4 text-text-2 leading-relaxed">
                            <p>
                                We prioritize developer privacy and enterprise code security:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Ephemeral Memory Only:</strong> Source code is processed into abstract syntax trees in memory and immediately discarded.</li>
                                <li><strong>No AI Model Training:</strong> Your private code is never retained or fed into public training corpuses.</li>
                                <li><strong>Token Encryption:</strong> OAuth credentials are encrypted at rest using AES-256 and never surfaced to client scripts.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
