/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Webpack configuration for production builds
  webpack: (config, { isServer }) => {
    // Fix MediaPipe in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        bcrypt: false,
      };
    }
    // Mark bcrypt as external for server-side builds (it's a native module)
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('bcrypt');
      } else {
        config.externals = [config.externals, 'bcrypt'];
      }
    }
    return config;
  },
};

export default nextConfig;
