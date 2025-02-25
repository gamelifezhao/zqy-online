# ------ 构建阶段 ------
  FROM node:20-alpine AS builder

  WORKDIR /app
  
  # 优先复制依赖文件以利用缓存
  COPY package.json package-lock.json* ./
  
  # 安装生产依赖并清理缓存
  RUN npm ci --omit=dev && \
      npm cache clean --force
  
  # 复制源码
  COPY . .
  
  # 构建项目（内存限制防止 OOM）
  ENV NODE_OPTIONS="--max-old-space-size=4096"
  RUN npm run build
  
  # ------ 生产镜像阶段 ------
  FROM nginx:stable-alpine
  
  # 安装健康检查工具
  RUN apk add --no-cache curl
  
  # 复制构建产物和配置
  COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
  COPY --from=builder /app/public /usr/share/nginx/html
  COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
  
  # 权限修复（Nginx 默认使用 nginx 用户）
  RUN chown -R nginx:nginx /usr/share/nginx/html
  
  EXPOSE 80
  
  HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl --fail http://localhost || exit 1
  
  CMD ["nginx", "-g", "daemon off;"]