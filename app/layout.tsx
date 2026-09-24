import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { agent, demoMode, property, site } from '@/data';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { ChapterRail } from '@/components/navigation/ChapterRail';
import { StickyConversion } from '@/components/navigation/StickyConversion';
import { DemoDock } from '@/components/navigation/DemoDock';
import { Footer } from '@/components/footer/Footer';
import { StructuredData } from '@/components/seo/StructuredData';

/**
 * Fonts are self-hosted variable files (latin subset) — no third-party font
 * requests, no layout shift, and the whole system works offline or inside a
 * client's own infrastructure.
 */
const display = localFont({
  src: [
    { path: './fonts/cormorant-garamond-latin-variable.woff2', weight: '300 700', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-variable-italic.woff2', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const sans = localFont({
  src: [{ path: './fonts/inter-latin-variable.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: property.seo.title,
    template: `%s | ${property.name}`,
  },
  description: property.seo.description,
  keywords: [...property.seo.keywords],
  applicationName: site.brand,
  category: 'real estate',
  authors: [{ name: agent.brokerage }],
  creator: site.brand,
  publisher: agent.brokerage,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: `${property.name} — ${site.brand}`,
    title: property.seo.title,
    description: property.seo.description,
    locale: site.locale,
    images: [
      {
        url: property.hero.imageSrc,
        width: 1408,
        height: 768,
        alt: property.hero.imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: property.seo.title,
    description: property.seo.description,
    images: [property.hero.imageSrc],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: true, address: false, email: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0C0C0D',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-paper text-charcoal antialiased">
        {/*
          No-JS safety net. Scroll reveals start hidden so the motion is
          meaningful when JS is available; this restores full content for
          crawlers, reading modes and anyone with scripts disabled.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>[style*="opacity:0"]{opacity:1!important}[style*="opacity: 0"]{opacity:1!important}[style*="clip-path"]{clip-path:none!important}[style*="translateY"]{transform:none!important}[style*="scale("]{transform:none!important}</style>`,
          }}
        />

        <a
          href="#residence"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-[11px] focus:uppercase focus:tracking-[0.2em]"
        >
          Skip to content
        </a>

        <FloatingNav />
        <ChapterRail />

        <main id="top">{children}</main>

        <Footer />
        <StickyConversion />
        {demoMode && <DemoDock />}
        <StructuredData />
      </body>
    </html>
  );
}
