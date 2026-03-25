import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/becas', destination: '/projects/becas', permanent: true },
      {
        source: '/gifexpert',
        destination: '/projects/gifexpert',
        permanent: true,
      },
      { source: '/gobdo', destination: '/projects/gobdo', permanent: true },
      {
        source: '/linkspace',
        destination: '/projects/linkspace',
        permanent: true,
      },
      {
        source: '/thatseries',
        destination: '/projects/thatseries',
        permanent: true,
      },
      {
        source: '/thoughthub',
        destination: '/projects/thoughthub',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
