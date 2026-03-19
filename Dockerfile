FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN cp -r generated dist/generated

RUN printf '#!/bin/sh\nset -e\necho ">>> Rodando migrations..."\nnpx prisma migrate deploy\necho ">>> Iniciando Node..."\nexec node dist/src/main.js\n' > /start.sh && chmod +x /start.sh

EXPOSE 3000

CMD ["/start.sh"]