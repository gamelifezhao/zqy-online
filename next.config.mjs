/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  // 启用App Router
  experimental: {
    appDir: true
  },
  // 禁用严格模式以避免开发时的双重渲染
  reactStrictMode: false,
  // 配置静态页面生成
  trailingSlash: true,
  // 允许客户端组件使用
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
