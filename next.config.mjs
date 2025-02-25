/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // 生产环境优化
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // 缓存优化啊啊啊啊
  generateEtags: true,
  // 构建优化
  optimizeFonts: true,
  // 安全配置
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate'
        }
      ]
    }
  ],
  // 实验性功能
  experimental: {
    optimizePackageImports: ['framer-motion'],
    scrollRestoration: true
  }
}

export default nextConfig
