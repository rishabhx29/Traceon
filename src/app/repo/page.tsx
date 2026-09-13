import { HeroSection } from '@/components/home/HeroSection';
import { LanguageTicker } from '@/components/home/LanguageTicker';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { InstallSection } from '@/components/home/InstallSection';
import { CTASection } from '@/components/home/CTASection';
import { TechStackSection } from '@/components/home/TechStackSection';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const title = 'Repository Analyzer — Traceon';
const description =
    'Paste any GitHub URL or upload a ZIP to map your codebase into an interactive dependency graph with impact analysis, blast radius, and circular dependency detection — in seconds.';

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: '/repo' },
    openGraph: {
        title,
        description,
        url: `${baseUrl}/repo`,
        siteName: 'Traceon',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
    },
};

interface RepoPageProps {
    searchParams: Promise<{ url?: string }>;
}

export default async function RepoLandingPage({ searchParams }: RepoPageProps) {
    const params = await searchParams;
    const rawUrl = typeof params.url === 'string' ? params.url : '';
    // Normalize owner/repo shorthand into a full GitHub URL for the analyzer form
    const initialRepoUrl =
        rawUrl && !rawUrl.startsWith('http')
            ? `https://github.com/${rawUrl.replace(/^\/+/, '')}`
            : rawUrl;

    return (
        <div className="noise dot-matrix">
            <HeroSection initialRepoUrl={initialRepoUrl} />
            <LanguageTicker />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <InstallSection />
            <CTASection />
            <TechStackSection />
        </div>
    );
}
