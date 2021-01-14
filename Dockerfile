# 
# Сборка - https://docs.docker.com/develop/develop-images/multistage-build/#name-your-build-stages
# 
FROM node:14-alpine3.10 as builder

WORKDIR /sources
COPY . .
RUN rm -f .env *.env
RUN npm i --ignore-scripts
RUN ./node_modules/.bin/vue-cli-service build


# 
# Запуск в продакшн
# Раздаем статические файлы сайта
# 
FROM nginx:1.15.8-alpine 
ADD ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www
COPY --from=builder /sources/dist .

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
