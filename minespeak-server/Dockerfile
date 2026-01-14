# =========================
# Stage 1: Build
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# 1. 依赖
COPY package.json package-lock.json ./
RUN npm ci

# 2. 拷 build 所需文件
COPY tsconfig.json tsconfig.prod.json ./
COPY src ./src
COPY scripts ./scripts
COPY config ./config
COPY config.ts ./config.ts
COPY eslint.config.mjs ./eslint.config.mjs

# 3. 执行自定义 build
RUN npm run build


# =========================
# Stage 2: Runtime
# =========================
FROM node:20-alpine

WORKDIR /app

# 5. 只拷运行所需文件
COPY package.json package-lock.json ./

# 6. 只安装生产依赖
RUN npm ci --omit=dev

# 7. 拷编译后的 JS
COPY --from=builder /app/dist ./dist

# 8. 如果运行时需要 config（常见）
COPY --from=builder /app/config ./config

# 9. 端口（只是声明）
EXPOSE 3000

# 10. 启动
CMD ["node", "dist/index.js"]
