#!/bin/sh
set -e

echo ">>> Rodando migrations..."
npx prisma migrate deploy
echo ">>> Migrations concluidas. Iniciando Node..."
exec node dist/src/main.js