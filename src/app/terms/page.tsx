import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | Traceon',
    description: 'Terms of service and fair usage guidelines for the Traceon codebase intelligence platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-surface-0 pt-24 pb-20">
            <div className="mx-auto max-w-4xl px-5 sm:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/10 text-xs font-mono text-emerald mb-4">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Legal Terms</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display font-bold text-text-0 tracking-tight mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-sm font-mono text-text-3">
                        Last updated: September 2026 • Version 2.4
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Section 1 */}
                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-5 h-5 text-emerald" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                1. Acceptance of Terms
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                By accessing or using Traceon (including our web application, CLI tooling, and visualization APIs), you agree to be bound by these Terms of Service. If you are using Traceon on behalf of an organization, you represent that you have authority to bind that organization to these terms.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                2. Intellectual Property & Your Code
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                <strong className="text-text-1">You own your code.</strong> Traceon does not claim any ownership, copyright, or licensing rights over the source code, repositories, or architectures you analyze. Any exported artifacts (SVG diagrams, PNG renders, PDF summaries, interactive HTML bundles) are your sole property.
                            </p>
                            <p>
                                Traceon’s web client and visualization algorithms are open-source and governed by permissive licensing (Apache 2.0 / MIT).
                            </p>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-amber" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                3. Fair Usage & Rate Limiting
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                To protect platform availability and ensure rapid response times for all developers:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-text-2">
                                <li>Public repository analysis and Engineering DNA requests are subject to fair rate limits enforced via Upstash Redis.</li>
                                <li>You agree not to bypass rate limits or deploy abusive automated scripts against analysis endpoints.</li>
                                <li>You agree only to submit repositories that you have lawful permission to view, analyze, or process.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="card p-6 sm:p-8 border border-stroke bg-surface-1 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-rose" />
                            <h2 className="text-xl font-bold font-display text-text-0">
                                4. Analytical Estimations Disclaimer
                            </h2>
                        </div>
                        <div className="text-text-2 text-sm leading-relaxed space-y-3">
                            <p>
                                Traceon provides algorithmic estimations (including dependency graphs, blast radius scores, cyclic warnings, and developer archetype tags) on an &ldquo;as is&rdquo; basis. While we strive for extreme precision, analytical metrics should be used as advisory engineering signals rather than guarantees of bug-free compilation or runtime safety.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Home CTA */}
                <div className="mt-12 pt-6 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-3">
                    <p>© {new Date().getFullYear()} Traceon Inc.</p>
                    <Link href="/home" className="text-emerald hover:underline">
                        Return to Home Page →
                    </Link>
                </div>
            </div>
        </div>
    );
}
