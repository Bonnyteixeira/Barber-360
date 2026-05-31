# Backend environment for Barber 360 multi-tenant SaaS services
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3001

ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
