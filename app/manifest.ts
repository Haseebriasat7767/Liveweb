import type { MetadataRoute } from 'next';
import { agent, property, site } from '@/data';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${property.name} — ${site.brand}`,
    short_name: property.name,
    description: property.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0C0D',
    theme_color: '#0C0C0D',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    lang: 'en-US',
    dir: 'ltr',
    ...(agent.brokerage ? { scope: '/' } : {}),
  };
}
