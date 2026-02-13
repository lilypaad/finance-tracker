# syntax=docker.io/docker/dockerfile:1
FROM node:20-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLE=1
EXPOSE 3000
CMD ["npm", "run", "dev"]
