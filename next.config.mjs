/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, '@next/swc-darwin-arm64'];
    return config;
  },
};

export default nextConfig;