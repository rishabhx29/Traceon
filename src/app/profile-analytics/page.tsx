import { ProfileLandingHero } from '@/components/profile/ProfileLandingHero';
import { ProfileFeaturesSection } from '@/components/profile/ProfileFeaturesSection';
import { ProfileHowItWorksSection } from '@/components/profile/ProfileHowItWorksSection';
import { ProfileCTASection } from '@/components/profile/ProfileCTASection';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const title = 'Profile DNA Checker — Traceon';
const description =
    'Enter any GitHub username to decode true engineering capability: 6-axis DNA scoring, archetype classification, domain radar, and squad compatibility powered by LLM analysis.';

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: '/profile-analytics' },
    openGraph: {
        title,
        description,
        url: `${baseUrl}/profile-analytics`,
        siteName: 'Traceon',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
    },
};

interface ProfileAnalyticsPageProps {
    searchParams: Promise<{ username?: string }>;
}

export default async function ProfileLandingPage({ searchParams }: ProfileAnalyticsPageProps) {
    const params = await searchParams;
    const initialUsername =
        typeof params.username === 'string' ? params.username.replace(/^@/, '') : '';

    return (
        <main className="min-h-screen bg-surface-0 noise dot-matrix selection:bg-emerald/30 selection:text-emerald">
            <ProfileLandingHero initialUsername={initialUsername} />
            <ProfileFeaturesSection />
            <ProfileHowItWorksSection />
            <ProfileCTASection />
        </main>
    );
}
