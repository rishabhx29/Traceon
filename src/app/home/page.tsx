import type { Metadata } from 'next';
import { Act1Hero } from '@/components/home/act1/Act1Hero';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const title = 'Traceon — Codebase Intelligence Platform';
const description =
    'Every codebase is a timeline. Paste any GitHub URL to map your repository into an interactive 3D dependency graph, or enter a username to decode a developer\'s Engineering DNA.';

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: '/home' },
    openGraph: {
        title,
        description,
        url: `${baseUrl}/home`,
        siteName: 'Traceon',
        type: 'website',
        images: [{ url: `${baseUrl}/banner.png`, width: 640, height: 640, alt: 'Traceon — Codebase Intelligence Platform' }],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/banner.png`],
    },
};

export default function HomePage() {
    return (
        <div className="relative min-h-screen bg-[#09090b]">
            {/* Background that covers the entire scrolling page seamlessly */}
            <div className="fixed inset-0 noise dot-matrix z-0 pointer-events-none opacity-40 mix-blend-overlay" aria-hidden="true" />

            <div className="relative z-10">
                <Act1Hero />
            </div>

            {/* Screen-reader accessible content summary of the scroll narrative.
                Visually hidden: the cinematic overlays are animated opacity toggles
                that screen readers cannot reliably follow. */}
            <div className="sr-only">
                <h2>Traceon features</h2>
                <p>
                    Traceon compiles raw git history and AST structures into an observable, living
                    topography. It isolates cyclic import paths and calculates blast radius before
                    pull requests merge. It renders your repository as a living 3D tree of
                    interface contracts, runtime boundaries, and submodule dependencies, and
                    computes forensic signals on developer pull request atomicity, architectural
                    ownership, and code longevity.
                </p>
            </div>
        </div>
    );
}
