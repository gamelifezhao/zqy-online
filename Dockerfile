FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install && \
    npm cache clean --force

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl --fail http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]