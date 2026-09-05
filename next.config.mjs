/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only hosts we actually load images from.
    //
    // This used to be `hostname: "**"` on both http and https, which made
    // /_next/image an open proxy: anyone could ask our server to fetch, resize
    // and cache any URL on the internet, on our bandwidth and from our IP.
    //
    // User uploads are served same-origin from /uploads/... and need no entry
    // here. When uploads move to Cloudinary/S3, add that hostname below.
    //
    // An image from a host that is not listed will not render -- that is the
    // point. Add the host here rather than widening the pattern.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
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
      };
    }
    return config;
  },
};

export default nextConfig;
