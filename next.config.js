/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  exportTrailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/deploy': { page: '/deploy' },
    }
  },
}

module.exports = nextConfig
