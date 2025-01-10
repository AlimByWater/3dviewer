# Base stage
FROM node:20-alpine AS base
ARG ENV_FILE

# Установка pnpm
RUN npm install -g pnpm

# Установка зависимостей
WORKDIR /app

# Сначала копируем только файлы, необходимые для установки зависимостей
COPY package.json pnpm-lock.yaml ./

# Копируем env файл до копирования всех остальных файлов
COPY ${ENV_FILE} .env

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Теперь копируем остальные файлы проекта
COPY . .
# Удаляем лишние env файлы, чтобы не было конфликта с проектом
RUN rm -f .env.production .env.development

# Сборка приложения
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
ARG ENV_FILE
WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Копируем файлы для продакшена
COPY package.json pnpm-lock.yaml ./
COPY ${ENV_FILE} .env
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
