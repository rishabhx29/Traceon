'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const defaultNavLinks = [
    { label: 'Repo Analysis', href: '/repo' },
    { label: 'Profile DNA', href: '/profile-analytics' },
    { label: 'Docs', href: '/docs' },
];

const repoNavLinks = [
    { label: 'Features', href: '/repo#features' },
    { label: 'How it Works', href: '/repo#how-it-works' },
    { label: 'Docs', href: '/docs' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const navLinks = pathname === '/repo' ? repoNavLinks : defaultNavLinks;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname === '/') {
        return null;
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-[#27272a]/50 bg-[#09090b]/80 backdrop-blur-xl shadow-2xl shadow-black/80'
                    : 'border-b border-transparent bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/40 to-transparent backdrop-blur-[2px]'
            }`}
        >
            {/* Ambient Emerald Hairline Glow on Scroll */}
            {scrolled && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent pointer-events-none" />
            )}

            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/home"
                        className="flex items-center gap-2.5 group"
                        onClick={() => {
                            if (window.location.pathname === '/home') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-[#10b981]/30 bg-[#10b981]/10 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_18px_rgba(16,185,129,0.35)] transition-all">
                            <Image
                                src="/logo.png"
                                alt="Traceon Logo"
                                width={24}
                                height={24}
                                className="rounded-md group-hover:scale-105 transition-transform"
                            />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[15px] font-semibold tracking-tight font-display text-white">
                                traceon
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-[#10b981] hover:bg-white/[0.04] transition-all rounded-md"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2.5 text-sm font-medium">
                        {status === 'loading' ? (
                            <div className="w-20 h-8 rounded bg-[#18181b] animate-pulse border border-[#27272a]" />
                        ) : session ? (
                            <>
                                {pathname === '/repo' && (
                                    <Link
                                        href="/dashboard"
                                        className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className="px-2.5 py-1.5 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-2 rounded-md hover:bg-white/[0.04]"
                                >
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt="Profile" width={20} height={20} className="w-5 h-5 rounded-full object-cover border border-[#27272a]" unoptimized />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center text-[10px] font-bold font-mono">
                                            {session.user?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-1.5 rounded-md hover:bg-white/[0.04] cursor-pointer"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Sign out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-black font-semibold text-xs font-mono tracking-wider uppercase transition-all duration-200 shadow-md shadow-[#10b981]/25 hover:shadow-lg hover:shadow-[#10b981]/40 cursor-pointer"
                                >
                                    <span>Get Started</span>
                                    <span className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono font-bold text-black/80 border border-black/10">⌘K</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-1.5 text-[#a1a1aa] hover:text-white rounded-md hover:bg-[#18181b] border border-[#27272a]/50 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-[#27272a]/60 bg-[#09090b]/95 backdrop-blur-2xl shadow-2xl">
                    <div className="px-5 py-4 space-y-1.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="block px-3 py-2 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-[#10b981] hover:bg-white/[0.04] rounded-md transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 mt-2 border-t border-[#27272a]/50 flex flex-col gap-2">
                            {status === 'loading' ? (
                                <div className="h-9 w-full rounded bg-[#18181b] animate-pulse border border-[#27272a]" />
                            ) : session ? (
                                <>
                                    {pathname === '/repo' && (
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex justify-center text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white py-2 px-3 rounded-md border border-[#27272a]/50 hover:bg-[#18181b] transition-colors w-full"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="inline-flex justify-center items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white py-2 px-3 rounded-md border border-[#27272a]/50 hover:bg-[#18181b] transition-colors w-full cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="inline-flex justify-center text-xs font-mono tracking-wider uppercase text-[#a1a1aa] hover:text-white py-2 px-3 rounded-md border border-[#27272a]/50 hover:bg-[#18181b] transition-colors w-full"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-to-r from-[#10b981] to-[#059669] text-black font-semibold text-xs font-mono tracking-wider uppercase shadow-md shadow-[#10b981]/25 w-full"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
