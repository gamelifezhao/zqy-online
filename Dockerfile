# 阶段1：构建应用
FROM node:18-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制所有源文件
COPY . .

# 构建
RUN npm run build

# 阶段2：生产镜像
FROM nginx:stable-alpine
# 复制整个out目录
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 确保nginx用户有正确的权限
RUN chown -R nginx:nginx /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]