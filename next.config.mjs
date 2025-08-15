// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add @supabase/ssr to transpilePackages
  transpilePackages: ['@supabase/ssr'],
  eslint:{
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  }
};
export default nextConfig;
