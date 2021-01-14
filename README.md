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
```yaml
version: '3'

services:
  mongodb:
    image: mongo:latest
    container_name: localizer_mongo
    volumes:
      - ./mongo-volumes:/data/db
  backend:
    build:
      context: ./localizer-backend
    container_name: localizer_backend
    env_file:
      - ./localizer-backend/.env
    environment:
      - MONGO=mongodb://mongodb:27017/localizer
    ports:
      - "1337:1337"
    depends_on:
      - mongodb
  frontend:
    build:
      context: ./localizer-frontend
    container_name: localizer_frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

```