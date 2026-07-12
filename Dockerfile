FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install

COPY backend/ .

EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
