/**
 * Canonical origin resolution.
 *
 * Every absolute URL the site emits — canonical link, Open Graph, Twitter card,
 * JSON-LD, sitemap, robots — flows through here so a deployment can never point
 * at a placeholder domain.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL        — set this once the property has its real domain
 *   2. Vercel's own production URL — so a Vercel deploy is correct with no config
 *   3. the configured fallback     — local development / self-hosted
 */

import { site } from '@/data';

export function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  // VERCEL_PROJECT_PRODUCTION_URL is the stable production domain of the
  // project; VERCEL_URL is the immutable per-deployment hostname.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;

  return site.url;
}

/** Host shown in operator-facing output (health check, docs). */
export function resolveDeploymentHost(): string {
  if (process.env.VERCEL_ENV) return `vercel:${process.env.VERCEL_ENV}`;
  if (process.env.NETLIFY) return 'netlify';
  return 'node-server';
}
