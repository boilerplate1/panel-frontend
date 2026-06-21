FROM node:23-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ARG VITE_TURNSTILE_SITE_KEY
ARG VITE_ANDROID_APK_URL
ARG VITE_BASE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
ENV VITE_ANDROID_APK_URL=$VITE_ANDROID_APK_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.container.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
