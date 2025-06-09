/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['tldraw'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig; 