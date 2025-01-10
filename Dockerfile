# Base stage
ARG ENV_FILE
FROM node:20-alpine AS base

# Установка pnpm
RUN npm install -g pnpm

# Установка зависимостей
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY ${ENV_FILE} .env.production
RUN pnpm install --frozen-lockfile

# Сборка приложения
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
ARG ENV_FILE
WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Установка только продакшн-зависимостей
COPY package.json pnpm-lock.yaml ./
COPY ${ENV_FILE} .env.production
RUN pnpm install --frozen-lockfile --prod

# Копирование собранного приложения из base
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.mjs ./next.config.mjs
COPY --from=base /app/tsconfig.json ./tsconfig.json
COPY --from=base /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=base /app/tailwind.config.ts ./tailwind.config.ts

# Expose порт
EXPOSE 3000

# Команда запуска production-сервера
CMD ["pnpm", "start"]
