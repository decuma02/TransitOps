FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/prisma ./prisma/
RUN npx prisma generate

COPY backend/ .

EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
