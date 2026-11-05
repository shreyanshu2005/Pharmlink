# ---- build ----
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite bakes these into the JS bundle at build time (they are public, browser-side values)
ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_CHATBOT_URL=http://localhost:5000
ARG VITE_RAZORPAY_KEY_ID=
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL \
    VITE_CHATBOT_URL=$VITE_CHATBOT_URL \
    VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# ---- serve ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
