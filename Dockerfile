FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN find . -name "main.js" -not -path "*/node_modules/*"

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js 2>&1"]