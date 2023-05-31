/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/deploy': { page: '/deploy' },
      '/push': { page: '/push' },
      '/proposal': { page: '/proposal/[proposalId]' },
    }
  },
}

module.exports = nextConfig
