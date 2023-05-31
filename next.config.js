/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/deploy': { page: '/deploy/deploy.tsx' },
      '/push': { page: '/push' },
      // '/proposal': { page: '/proposal' },
    }
  },
}

module.exports = nextConfig
