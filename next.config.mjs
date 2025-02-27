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
  // 缓存优化
  generateEtags: true,
  // 构建优化
  optimizeFonts: true,
  // 实验性功能
  experimental: {
    optimizePackageImports: ['framer-motion'],
    scrollRestoration: true
  }
}

export default nextConfig
