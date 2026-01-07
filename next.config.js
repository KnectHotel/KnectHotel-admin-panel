/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['example.com', '13.127.80.211', 'dibstestbucket0403.s3.ap-south-1.amazonaws.com',],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 