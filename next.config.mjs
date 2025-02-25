/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  // 禁用所有运行时检查和警告
  reactStrictMode: false,
  // 配置静态页面生成
  trailingSlash: true,
  // 允许客户端组件使用
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // 禁用所有控制台警告
  webpack: (config, { isServer }) => {
    // 禁用所有警告
    config.optimization = {
      ...config.optimization,
      minimize: true
    }
    return config
  }
};

export default nextConfig;
