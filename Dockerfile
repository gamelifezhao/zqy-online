# 阶段1：构建应用
FROM node:20-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --include=dev --prefer-offline

# 复制源码并构建
COPY . .
RUN npm run build && \
    npm run export

# 阶段2：生产镜像
FROM nginx:stable-alpine

# 复制静态文件
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/public/favicon.ico /usr/share/nginx/html/

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 设置容器健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["nginx", "-g", "daemon off;"]