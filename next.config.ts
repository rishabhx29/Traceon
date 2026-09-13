import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Modern formats + responsive sizing for lower LCP
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for immutable avatar/logo images
  },
  // Favor dynamic imports: tree-shake big icon/3D deps more aggressively
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
  },
};

export default nextConfig;
