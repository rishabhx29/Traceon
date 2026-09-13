import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Traceon — Codebase Intelligence Platform",
    template: "%s | Traceon",
  },
  alternates: { canonical: "/" },
  description:
    "Understand any codebase instantly. Visualize architecture, trace dependencies, and predict the impact of your changes. Analyze GitHub profiles to assess engineering DNA, developer fit, and squad compatibility.",
  keywords: [
    "codebase analysis",
    "dependency graph",
    "architecture visualization",
    "developer evaluation",
    "engineering DNA",
    "GitHub profile analyzer",
    "developer assessment tool",
    "tech hiring",
    "squad compatibility",
    "code quality analysis",
    "open source contributor insights",
  ],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Traceon — Codebase Intelligence Platform",
    description:
      "Analyze codebases and GitHub profiles. Visualize architecture, trace dependencies, assess engineering DNA, and evaluate developer fit.",
    type: "website",
    siteName: "Traceon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traceon — Codebase Intelligence Platform",
    description: "Analyze codebases and GitHub profiles. Assess engineering DNA and squad compatibility.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeScript = `
(() => {
  try {
    window.localStorage.removeItem("traceon-theme");
  } catch {}
  document.documentElement.dataset.theme = "dark";
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased selection:bg-emerald/30 selection:text-emerald`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Traceon",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description:
                "Unified analysis platform that maps any codebase into an interactive dependency graph and decodes any GitHub developer's engineering capability through LLM-powered analysis.",
              url: baseUrl,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <NextAuthProvider>
          <SmoothScrollProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:px-4 focus:py-2 focus:rounded-md focus:bg-surface-3 focus:text-text-0 focus:border focus:border-emerald"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="min-h-screen pt-14">{children}</main>
            <Footer />
            <ScrollToTop />
          </SmoothScrollProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
