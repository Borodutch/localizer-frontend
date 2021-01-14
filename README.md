# Localizer frontend

Run this on your server to allow users to help you with localizing your projects.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```


### Docker-compose example

docker-compose.yml
```yaml
version: '3'

services:

  mongodb:
    image: mongo:latest
    container_name: localizer_mongo
    volumes:
      - ./DATA/mongo-volumes:/data/db

  backend:
    image: alexstep/localizer-backend
    container_name: localizer_backend
    depends_on:
      - mongodb
    environment:
      - MONGO=mongodb://mongodb:27017/localizer
      - PASSWORD=123456789
      - TELEGRAM_TOKEN=123
      - TELEGRAM_ADMIN=123456789

  frontend:
    image: alexstep/localizer-frontend
    container_name: localizer_frontend
    ports:
      - "4242:80"

```
Service available on localhost:4242

