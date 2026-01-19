# SmiloVault - Início Rápido

## Setup Inicial (5 minutos)

### Windows

```powershell
# 1. Instalar pnpm
npm install -g pnpm

# 2. Instalar dependências
pnpm install

# 3. Gerar secrets
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(48).toString('base64'))"

# 4. Copiar e configurar .env
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env

# Edite apps\api\.env e cole os secrets gerados acima

# 5. Subir banco de dados
docker-compose up -d postgres

# Aguarde 5 segundos...

# 6. Rodar migrations e seed
pnpm db:migrate
pnpm db:seed

# 7. Iniciar desenvolvimento
pnpm dev
```

### Linux/Mac

```bash
# 1. Instalar pnpm
npm install -g pnpm

# 2. Rodar script de setup automático
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Iniciar desenvolvimento
pnpm dev
```

## Acessar Aplicação

- Frontend: http://localhost:5173
- API: http://localhost:3001

## Credenciais de Teste

- Email: `test@smilovault.com`
- Senha: `Test123!`

## Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Rodar tudo

# Database
pnpm db:studio              # Abrir Prisma Studio
pnpm db:migrate             # Criar nova migration
pnpm db:seed                # Popular dados

# Docker
docker-compose up -d        # Subir tudo
docker-compose down         # Parar tudo
docker-compose logs -f api  # Ver logs da API

# Código
pnpm lint                   # Verificar erros
pnpm format                 # Formatar código
pnpm test                   # Rodar testes
```

## Estrutura de Pastas

```
apps/
├── api/          → Backend (Express + Prisma)
│   ├── src/
│   │   ├── routes/      → Rotas da API
│   │   ├── config/      → Configurações
│   │   └── utils/       → Utilitários (crypto)
│   └── prisma/          → Schema e migrations
│
└── web/          → Frontend (React + Vite)
    └── src/
        ├── pages/       → Páginas
        ├── components/  → Componentes
        └── services/    → API calls
```

## Próximos Passos

1. Configure OAuth (opcional):
   - Google: https://console.cloud.google.com/
   - Facebook: https://developers.facebook.com/

2. Explore o código:
   - Veja como funciona a criptografia em `apps/api/src/utils/crypto.ts`
   - Teste o CRUD de itens
   - Verifique o dashboard de gastos

3. Customize:
   - Ajuste cores no `apps/web/tailwind.config.js`
   - Adicione novos campos no `apps/api/prisma/schema.prisma`

## Problemas Comuns

**Erro: ENCRYPTION_KEY invalid**
→ Verifique se a chave tem 44 caracteres (32 bytes em base64)

**Erro: Cannot connect to database**
→ `docker-compose up -d postgres` e aguarde alguns segundos

**Porta 5173 já em uso**
→ Mude a porta no `apps/web/vite.config.ts`

## Documentação Completa

Veja [README.md](./README.md) para instruções detalhadas de deploy em VPS.
