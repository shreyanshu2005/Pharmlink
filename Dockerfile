FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first so Docker can cache this layer
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
