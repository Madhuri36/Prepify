// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for @supabase/ssr
  transpilePackages: ["@supabase/ssr"],

  // Ignore ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🔥 REQUIRED for tech icons (Next/Image)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
