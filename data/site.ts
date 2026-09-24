/**
 * Site-level configuration — brand, demo mode, analytics, legal.
 * White-label: this is the only file that needs editing to re-badge the system.
 */

export const site = {
  /** Product / system name shown in the navigation lockup and footer. */
  brand: 'LUXURY LEAD MACHINE',
  brandShort: 'LLM',
  /** Tagline used in metadata and the footer. */
  tagline: 'A private digital showroom for exceptional residences.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://luxuryleadmachine.example.com',
  locale: 'en_US',
  market: 'Miami · Palm Beach · Malibu',
} as const;

/**
 * Client-closing demo mode.
 * When true the site shows: a fictional-content notice, the demo dock
 * (lead inbox + live event stream + config inspector) and placeholder markers.
 * Set NEXT_PUBLIC_DEMO_MODE=false for a live client listing.
 */
export const demoMode = (process.env.NEXT_PUBLIC_DEMO_MODE ?? 'true') !== 'false';

/** Analytics provider is swappable without touching components. */
export type AnalyticsProvider = 'none' | 'console' | 'gtm' | 'plausible' | 'segment';
export const analytics = {
  /**
   * Defaults to console logging in demo mode (so a client can watch events fire
   * in devtools) and to silence in a live listing — change the env var once a
   * real provider is wired up.
   */
  provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ||
    (demoMode ? 'console' : 'none')) as AnalyticsProvider,
  /** Set to your GTM / Segment container id when those providers are selected. */
  containerId: '',
  plausibleDomain: '',
} as const;

export const legal = {
  privacyHref: '/privacy',
  termsHref: '/terms',
  fairHousingHref: '/fair-housing',
  disclosuresHref: '/privacy#disclosures',
  copyrightStart: 2026,
} as const;
