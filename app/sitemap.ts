import type { MetadataRoute } from 'next';
import { site } from '@/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['/', '/privacy', '/terms', '/fair-housing'];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'yearly',
    priority: route === '/' ? 1 : 0.4,
  }));
}
