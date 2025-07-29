// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add @supabase/ssr to transpilePackages
  transpilePackages: ['@supabase/ssr'],
};
export default nextConfig;
