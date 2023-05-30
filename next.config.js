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
      '/proposal': { page: '/proposal' },
      '/push': { page: '/push' },
      '/view': { page: '/view' },
    }
  },
}

module.exports = nextConfig
