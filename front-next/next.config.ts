/** @type {import('next').NextConfig} */
const nextConfig = {
  // Outras configurações que você já tenha (ex: images, reactStrictMode, etc.)
  // reactStrictMode: true,
  // images: { ... },

  async rewrites() {
    return [
      // Proxy para pegar o CSRF cookie do Sanctum
      {
        source: '/sanctum/csrf-cookie',
        destination: 'http://localhost:8000/sanctum/csrf-cookie',
      },

      // Proxy para todas as rotas da sua API Laravel
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },

      // Opcional: para acessar imagens do storage público do Laravel
      {
        source: '/storage/:path*',
        destination: 'http://localhost:8000/storage/:path*',
      },
    ];
  },
};

module.exports = nextConfig;