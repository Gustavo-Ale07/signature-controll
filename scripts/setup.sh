#!/bin/bash

# Script de setup inicial do projeto

set -e

echo "==================================="
echo "SmiloVault - Setup Inicial"
echo "==================================="
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não encontrado. Instalando..."
    npm install -g pnpm
fi

echo "✅ pnpm encontrado"
echo ""

# Install dependencies
echo "📦 Instalando dependências..."
pnpm install
echo ""

# Generate secrets if .env doesn't exist
if [ ! -f "apps/api/.env" ]; then
    echo "🔑 Gerando secrets..."
    echo ""
    
    ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")
    
    cp apps/api/.env.example apps/api/.env
    
    # Update .env with generated keys (works on macOS and Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|ENCRYPTION_KEY=.*|ENCRYPTION_KEY=$ENCRYPTION_KEY|" apps/api/.env
        sed -i '' "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|" apps/api/.env
    else
        sed -i "s|ENCRYPTION_KEY=.*|ENCRYPTION_KEY=$ENCRYPTION_KEY|" apps/api/.env
        sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|" apps/api/.env
    fi
    
    echo "✅ Arquivo .env criado com secrets gerados"
else
    echo "ℹ️  Arquivo .env já existe, pulando geração de secrets"
fi
echo ""

# Setup web .env
if [ ! -f "apps/web/.env" ]; then
    cp apps/web/.env.example apps/web/.env
    echo "✅ Arquivo apps/web/.env criado"
fi
echo ""

# Start PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
docker-compose up -d postgres
echo "⏳ Aguardando PostgreSQL iniciar..."
sleep 5
echo ""

# Run migrations
echo "🗄️  Rodando migrations..."
pnpm db:migrate
echo ""

# Run seed
echo "🌱 Populando banco de dados..."
pnpm db:seed
echo ""

echo "==================================="
echo "✅ Setup concluído!"
echo "==================================="
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  pnpm dev"
echo ""
echo "Credenciais de teste:"
echo "  Email: test@smilovault.com"
echo "  Senha: Test123!"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:5173"
echo "  API: http://localhost:3001"
echo ""
