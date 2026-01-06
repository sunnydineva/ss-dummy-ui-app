# build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

# IMPORTANT: env-овете за Vite се bake-ват на build time.
# За runtime override ще трябва друга схема (template + envsubst).
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_USER_SERVICE_BASE_URL

ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_USER_SERVICE_BASE_URL=$VITE_USER_SERVICE_BASE_URL

RUN npm run build

# run stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80