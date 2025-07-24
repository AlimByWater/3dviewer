import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdf026bd-e2a5-4a7a-adcd-a11f0029859b.selstorage.ru',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@mantine/core'],
  },
  // Add headers for Cross-Origin Isolation (COOP only, COEP removed)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' }, // Removed COEP
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
