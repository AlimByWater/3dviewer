import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
};

export default withNextIntl(nextConfig);
