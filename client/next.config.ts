/** @type {import('next').NextConfig} */
interface WebpackConfig {
  resolve: {
    fallback: {
      fs: boolean;
      net: boolean;
      tls: boolean;
    };
  };
}

interface NextConfig {
  eslint?: {
    ignoreDuringBuilds: boolean;
  };
  typescript?: {
    ignoreBuildErrors: boolean;
  };
  webpack: (config: WebpackConfig, options: { isServer: boolean }) => WebpackConfig;
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,  // Add this to ignore TypeScript errors
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  }
};

module.exports = nextConfig;
