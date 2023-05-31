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
      '/deploy': { page: '/deploy' },
      '/push': { page: '/push' },
      '/proposal': { page: '/proposal/[proposalId]/index.tsx' },
    }
  },
}

module.exports = nextConfig
