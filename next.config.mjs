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
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default withNextIntl(nextConfig);
