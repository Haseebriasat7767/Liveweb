import type { MetadataRoute } from 'next';
import { resolveSiteUrl } from '@/lib/siteUrl';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['/', '/privacy', '/terms', '/fair-housing'];

  return routes.map((route) => ({
    url: `${resolveSiteUrl()}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'yearly',
    priority: route === '/' ? 1 : 0.4,
  }));
}
