/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper asset loading
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://freelancex-backend.vercel.app/api'
        : 'http://localhost:5001/api'),
  },
}

export default nextConfig
