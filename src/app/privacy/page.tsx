import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Shield, EyeOff, Database, Server, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | Traceon',
    description: 'Traceon privacy commitments: zero source code retention, ephemeral in-memory AST processing, and strict data protection standards.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-surface-0 pt-24 pb-20">
            <div className="mx-auto max-w-4xl px-5 sm:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/10 text-xs font-mono text-emerald mb-4">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Security & Privacy</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-0 tracking-tight mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-sm font-mono text-text-3">
                        Last updated: September 2026 • Version 2.4
                    </p>
                </div>

                {/* Core Commitment Banner */}
                <div className="p-6 rounded-2xl border border-emerald/30 bg-emerald/5 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald/10 text-emerald shrink-0 mt-0.5">
                            <EyeOff className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-display text-text-0 mb-1">
                                Our Core Philosophy: Zero Code Retention
                            </h2>
                            <p className="text-sm text-text-2 leading-relaxed">
                                Traceon was built by developers, for developers. We never store, clone, or retain
                                your raw source code on persistent storage. Code parsing happens in ephemeral,
                                isolated memory and is immediately wiped once AST graphs are computed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Privacy Sections */}
                <div className="space-y-8">
                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-5 h-5 text-emerald" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                1. Source Code & AST Processing
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                When you submit a public GitHub URL or upload a project ZIP file:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-text-2">
                                <li>
                                    <strong className="text-text-1">In-Memory Parsing:</strong> Files are parsed into abstract syntax trees (ASTs) strictly to extract import/export dependencies, module boundaries, and file sizes.
                                </li>
                                <li>
                                    <strong className="text-text-1">No Model Training:</strong> Your code is never used to train, fine-tune, or prompt public AI foundation models.
                                </li>
                                <li>
                                    <strong className="text-text-1">Ephemeral Lifecycle:</strong> Temporary buffers and unpack directories are deleted automatically as soon as graph construction finishes.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-amber" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                2. Authentication & GitHub OAuth
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                When signing in with GitHub:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-text-2">
                                <li>
                                    We request only minimal read scopes necessary to verify your developer identity and display your public repositories.
                                </li>
                                <li>
                                    Access tokens are encrypted at rest and never transmitted to or accessible by client-side browser scripts.
                                </li>
                                <li>
                                    You may revoke Traceon’s GitHub OAuth authorization at any time directly through your GitHub account security settings.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Server className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                3. Metadata & Telemetry
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                Traceon stores analytical graph metadata (node identifiers, edge counts, calculated blast radius heuristics, and commit timestamps) so you can view and share saved architecture graphs. This metadata contains structural names and metrics, never raw code contents.
                            </p>
                        </div>
                    </div>

                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <UserCheck className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                4. Your Rights & Data Deletion
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                You retain full ownership of your data at all times. If you wish to permanently delete your account, saved repositories, or computed Engineering DNA profiles, you can initiate immediate deletion from your <Link href="/profile" className="text-emerald hover:underline">Profile Settings</Link> or by filing an issue on our GitHub repository.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-12 pt-6 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-3">
                    <p>Questions regarding our privacy practices?</p>
                    <a
                        href="https://github.com/Rishabhworkspace/Traceon/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald hover:underline"
                    >
                        Open a GitHub Discussion / Issue →
                    </a>
                </div>
            </div>
        </div>
    );
}
