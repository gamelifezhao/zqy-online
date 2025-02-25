/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  }
};

export default nextConfig;
