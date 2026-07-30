/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');
const nextConfig = {
  i18n,
  output: 'standalone',
  reactStrictMode: false,
  compress: true,
  webpack: (config, { isServer }) => {
    config.module.rules = config.module.rules.concat([
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack']
      }
    ]);
    config.plugins = [...config.plugins];
    return config;
  },
  transpilePackages: [
    '@labring/sealos-ui',
    '@labring/sealos-shared-sdk',
    '@labring/sealos-desktop-sdk'
  ],
  experimental: {
    outputFileTracingRoot: path.join(__dirname),
    instrumentationHook: true
  },
  async rewrites() {
    return [
      {
        source: '/healthz',
        destination: '/api/healthz'
      }
    ];
  }
};

module.exports = nextConfig;
