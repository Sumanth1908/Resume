# Multi-stage Dockerfile for building the React TypeScript app and serving with nginx

# 1) Build stage
FROM node:18-alpine AS build
WORKDIR /app

# If you have a package-lock.json, copying it here speeds install and makes it reproducible
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# 2) Production image with nginx
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Replace default nginx config to enable SPA routing (history API fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
