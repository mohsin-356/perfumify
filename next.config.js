const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  reactStrictMode: true,
  swcMinify: true, // Use SWC for faster minification
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error"] }
        : false,
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['react-icons', '@headlessui/react', 'framer-motion'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: [
      'res.cloudinary.com',
      'localhost',
      '127.0.0.1:8000',
      'maps.googleapis.com',
      's3.amazonaws.com',
      'pixabay.com',
      'images.pexels.com',
    ],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compression and performance headers
  compress: true,

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Admin APIs: never cache at CDN/browsers
        source: "/api/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
        ],
      },
      {
        // Upload API: responses must not be cached
        source: "/api/upload",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
        ],
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    // Disable filesystem cache in dev to avoid non-serializable Warning cache entries noise
    if (dev) {
      config.cache = false;
    }

    // Production optimizations
    if (!dev) {
      // Improve tree-shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        minimize: true,
      };
    }

    // Bundle analyzer (optional, for development)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    // Ignore PackFileCacheStrategy Warning serialization logs from loaders
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push((warning) => {
      return (
        typeof warning?.message === 'string' &&
        warning.message.includes('PackFileCacheStrategy') &&
        warning.message.includes('No serializer registered for Warning')
      );
    });

    return config;
  },
};

