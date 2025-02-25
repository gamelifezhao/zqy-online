/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  // 如果使用App Router需添加以下配置
  experimental: {
    appDir: true,
  }
};

export default nextConfig;
