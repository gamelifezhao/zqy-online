/** @type {import('next').NextConfig} */
const nextConfig = {
  target: 'serverless',
  output: "export",
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  // 关闭实验性功能
  experimental: {
    appDir: false
  }
};

export default nextConfig;
