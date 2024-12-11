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
  webpack: (config: WebpackConfig, options: { isServer: boolean }) => WebpackConfig;
}

const nextConfig: NextConfig = {
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
