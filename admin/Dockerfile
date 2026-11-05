# ---- build ----
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_CURRENCY=₹
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL \
    VITE_CURRENCY=$VITE_CURRENCY
RUN npm run build

# ---- serve ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
