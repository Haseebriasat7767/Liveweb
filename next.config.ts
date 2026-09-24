import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow the hosted preview tunnel (and any *.e2b.app sandbox host) to talk to the dev server.
  allowedDevOrigins: ['**.e2b.app', '*.e2b.app', '**.e2b.dev', 'localhost'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    // Explicit quality ladder so every <Image quality={n}> in the codebase is
    // served by the optimiser without configuration warnings.
    qualities: [60, 70, 82, 84, 86, 88, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
