# syntax=docker/dockerfile:1
FROM node:18.6.0-alpine

WORKDIR /opt/api

COPY package.json package-lock.json tsconfig.json .env .
COPY src ./src

RUN npm install
RUN npm run build
RUN npm prune --production

CMD ["node", "./dist/index.js"]

EXPOSE 8000