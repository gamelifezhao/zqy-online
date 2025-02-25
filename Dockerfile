# 阶段1：构建应用
FROM node:20-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --include=dev --prefer-offline && \
    npm install postcss autoprefixer tailwindcss --save-dev

# 复制配置文件
COPY postcss.config.js tailwind.config.js ./

# 复制源码并构建
COPY . .
RUN npm run build && \
    npx run export

# 阶段2：生产镜像
FROM nginx:stable-alpine

# 复制静态资源
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/public/favicon.ico /usr/share/nginx/html/

# Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]