/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      }
    ],
    // Remove unoptimized for better performance in production
    unoptimized: process.env.NODE_ENV === 'development'
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  },
  // Optimize production builds
  swcMinify: true,
  // Better error handling in production
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig

