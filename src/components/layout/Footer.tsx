'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on full-screen graph canvas, intro screen, and auth pages
    if (
        pathname?.startsWith('/graph/') ||
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/signup'
    ) {
        return null;
    }

    return (
        <footer className="border-t border-[#27272a]/70 bg-[#09090b] text-text-2 relative z-20">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand & Copyright */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                        <Link href="/home" className="inline-flex items-center gap-2 group">
                            <Image
                                src="/logo.png"
                                alt="Traceon Logo"
                                width={20}
                                height={20}
                                className="rounded-md group-hover:scale-105 transition-transform"
                            />
                            <span className="text-sm font-semibold font-display text-white tracking-tight">
                                traceon
                            </span>
                        </Link>
                        <span className="hidden sm:inline text-text-4 text-xs">•</span>
                        <p className="text-xs font-mono text-text-3">
                            © {new Date().getFullYear()} Traceon. All rights reserved.
                        </p>
                    </div>

                    {/* Essential Pages Navigation */}
                    <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono">
                        <Link
                            href="/about"
                            className="text-text-2 hover:text-white transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/docs"
                            className="text-text-2 hover:text-white transition-colors"
                        >
                            Documentation
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-text-2 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-text-2 hover:text-white transition-colors"
                        >
                            Terms & Conditions
                        </Link>
                    </nav>

                    {/* Socials */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/Rishabhworkspace/Traceon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-text-3 hover:text-white hover:bg-surface-2 transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a
                            href="https://twitter.com/rishabh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-text-3 hover:text-white hover:bg-surface-2 transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
