/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Para PWA
  },
  reactStrictMode: true,
}

module.exports = nextConfig

