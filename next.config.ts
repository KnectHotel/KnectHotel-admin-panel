export default {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      }
    ]
  },
  async redirects() {
    return [
      // Redirect unauthorized or invalid routes
      {
        source: '/protected',
        destination: '/auth/login',
        permanent: false
      },
      {
        source: '/unauthorized',
        destination: '/auth/login',
        permanent: false
      }
    ];
  }
};
