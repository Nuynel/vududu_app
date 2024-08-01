#FROM node:16-alpine
FROM node:21.2.0-alpine

WORKDIR /usr/app/server/

# Копирование файлов package.json и yarn.lock для установки зависимостей
COPY package*.json ./
COPY yarn.lock ./

# Установка зависимостей
RUN yarn install

# Копирование остальных файлов проекта
COPY . .

# Сборка TypeScript проекта
RUN yarn build

# Порт, на котором работает приложение
EXPOSE 8000

# Команда для запуска приложения
CMD ["yarn", "migrate:up"]
CMD ["yarn", "start:prod"]
