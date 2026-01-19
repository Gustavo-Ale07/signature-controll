# SmiloVault

Aplicação completa e profissional para controle de assinaturas e contas com autenticação OAuth, criptografia de senhas e interface moderna.

## Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Passport.js (OAuth Google e Facebook)
- Argon2 (hash de senhas)
- AES-256-GCM (criptografia de segredos)
- Helmet, CORS, Rate Limiting

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Hook Form + Zod
- Axios
- React Router

### DevOps
- Docker + Docker Compose
- Nginx (reverse proxy)
- PostgreSQL via Docker
- Certbot (SSL/HTTPS)

## Estrutura do Projeto

```
smilovault/
├── apps/
│   ├── api/                  # Backend Node.js
│   │   ├── src/
│   │   │   ├── config/       # Configurações e Passport
│   │   │   ├── middleware/   # Auth, validação, erros
│   │   │   ├── routes/       # Rotas da API
│   │   │   ├── utils/        # Utilitários (crypto)
│   │   │   ├── validators/   # Schemas Zod
│   │   │   └── index.ts      # Entry point
│   │   ├── prisma/           # Schema e migrations
│   │   └── uploads/          # Arquivos enviados
│   └── web/                  # Frontend React
│       ├── src/
│       │   ├── components/   # Componentes reutilizáveis
│       │   ├── contexts/     # Context API (Auth)
│       │   ├── pages/        # Páginas da aplicação
│       │   ├── services/     # API services
│       │   └── lib/          # Configuração axios
│       └── public/
├── nginx/                    # Configuração Nginx produção
├── docker-compose.yml        # Docker local
├── docker-compose.prod.yml   # Docker produção
└── README.md
```

## Recursos

### Autenticação
- Login local com email/senha (hash com Argon2)
- OAuth Google
- OAuth Facebook
- Sessão persistente com cookie httpOnly
- Store de sessão no PostgreSQL

### Segurança
- **Senhas de assinaturas/contas criptografadas com AES-256-GCM**
- Chave de criptografia em variável de ambiente
- Endpoint separado para recuperar senhas descriptografadas
- Helmet para headers de segurança
- Rate limiting
- CORS configurado
- Validação de dados com Zod

### Funcionalidades
- CRUD completo de itens (assinaturas e contas)
- Upload de ícones/imagens
- Dashboard com:
  - Gasto mensal estimado (conversão de semestral/anual)
  - Próximas cobranças ordenadas
- Filtros e busca
- Página de detalhes com toggle de senha
- Multitenancy (cada usuário vê apenas seus dados)

## Instalação Local

### Pré-requisitos

- Node.js 20+
- pnpm (recomendado) ou npm
- Docker e Docker Compose

### Passo 1: Clonar e Instalar Dependências

```bash
cd c:\Dev\signatures-control

# Instalar pnpm globalmente (se não tiver)
npm install -g pnpm

# Instalar todas as dependências do monorepo
pnpm install
```

### Passo 2: Gerar Chave de Criptografia

Execute no terminal para gerar uma chave AES-256:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado (44 caracteres em base64).

### Passo 3: Configurar Variáveis de Ambiente

#### Backend (apps/api/.env)

Copie o arquivo de exemplo:

```bash
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env`:

```env
DATABASE_URL="postgresql://smilovault:smilovault@localhost:5432/smilovault?schema=public"
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-super-secret-session-key-change-in-production
ENCRYPTION_KEY=<cole-a-chave-gerada-aqui>
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/auth/facebook/callback
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SIGN_IN_URL=/login
CLERK_SIGN_UP_URL=/register
```

**IMPORTANTE**: Substitua `ENCRYPTION_KEY` pela chave gerada no Passo 2.

Para OAuth (opcional no desenvolvimento):
- Google: https://console.cloud.google.com/
- Facebook: https://developers.facebook.com/

#### Frontend (apps/web/.env)

```bash
cp apps/web/.env.example apps/web/.env
```

Edite `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Passo 4: Subir o Banco de Dados

```bash
docker-compose up -d postgres
```

Aguarde alguns segundos para o PostgreSQL iniciar.

### Passo 5: Rodar Migrations e Seed

```bash
pnpm db:migrate
pnpm db:seed
```

Isso criará as tabelas e um usuário de teste:
- Email: `test@smilovault.com`
- Senha: `Test123!`

### Passo 6: Rodar em Desenvolvimento

```bash
pnpm dev
```

Isso iniciará:
- API: http://localhost:3001
- Web: http://localhost:5173

Acesse http://localhost:5173 e faça login com as credenciais de teste.

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Roda API e Web em paralelo
pnpm --filter api dev # Apenas API
pnpm --filter web dev # Apenas Web

# Build
pnpm build           # Build completo (API + Web)

# Database
pnpm db:migrate      # Rodar migrations
pnpm db:seed         # Popular banco com dados iniciais
pnpm db:studio       # Abrir Prisma Studio

# Qualidade de Código
pnpm lint            # Lint em todos os projetos
pnpm format          # Formatar código com Prettier
pnpm test            # Rodar testes

# Docker
pnpm docker:up       # Subir containers
pnpm docker:down     # Parar containers
```

## Deploy em VPS (Ubuntu)

### Pré-requisitos na VPS

- Ubuntu 20.04+ ou similar
- Docker e Docker Compose instalados
- Domínio apontando para o IP da VPS
- Portas 80 e 443 abertas

### Passo 1: Instalar Docker

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Relogar para aplicar mudanças
```

### Passo 2: Clonar Repositório na VPS

```bash
cd ~
git clone <seu-repositorio> smilovault
cd smilovault
```

### Passo 3: Configurar Variáveis de Produção

```bash
cp .env.prod.example .env.prod
nano .env.prod
```

Edite com seus valores reais:

```env
DB_USER=smilovault
DB_PASSWORD=<senha-forte-aqui>
DB_NAME=smilovault
DOMAIN=seudominio.com
SESSION_SECRET=<gerar-com-pwgen-ou-openssl>
ENCRYPTION_KEY=<mesma-chave-do-dev-ou-nova>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

**Gerar secrets seguros**:

```bash
# Session secret (64 chars)
openssl rand -base64 48

# Encryption key (32 bytes = 44 chars base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Passo 4: Atualizar Configuração do Nginx

Edite `nginx/conf.d/smilovault.conf` e substitua `your-domain.com` pelo seu domínio real.

### Passo 5: Primeira Build (sem SSL)

Primeiro vamos subir sem SSL para obter o certificado:

```bash
# Comentar temporariamente as linhas SSL no nginx/conf.d/smilovault.conf
# Deixar apenas o redirect HTTP

docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Passo 6: Obter Certificado SSL

```bash
# Parar nginx temporariamente
docker stop smilovault-nginx

# Obter certificado
docker run -it --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  --email seu@email.com \
  -d seudominio.com \
  -d www.seudominio.com \
  --agree-tos

# Reiniciar nginx
docker start smilovault-nginx
```

### Passo 7: Habilitar HTTPS

Descomente as configurações SSL no `nginx/conf.d/smilovault.conf` e reinicie:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod restart nginx
```

### Passo 8: Verificar

Acesse https://seudominio.com e teste a aplicação.

### Renovação Automática SSL

O container `certbot` já está configurado para renovar automaticamente a cada 12 horas.

## Monitoramento e Logs

```bash
# Ver logs de todos os containers
docker-compose -f docker-compose.prod.yml logs -f

# Logs específicos
docker logs smilovault-api-prod -f
docker logs smilovault-web-prod -f
docker logs smilovault-nginx -f

# Status dos containers
docker ps

# Verificar saúde do banco
docker exec smilovault-postgres-prod pg_isready
```

## Backup do Banco de Dados

```bash
# Fazer backup
docker exec smilovault-postgres-prod pg_dump -U smilovault smilovault > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup_20240118.sql | docker exec -i smilovault-postgres-prod psql -U smilovault -d smilovault
```

## Manutenção

### Atualizar Aplicação

```bash
cd ~/smilovault
git pull
docker-compose -f docker-compose.prod.yml --env-file .env.prod build
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Parar Aplicação

```bash
docker-compose -f docker-compose.prod.yml down
```

### Limpar Volumes (CUIDADO!)

```bash
# Remove TODOS os dados (banco + uploads)
docker-compose -f docker-compose.prod.yml down -v
```

## Decisões Técnicas

### Por que Argon2?
Mais seguro que bcrypt contra ataques GPU/ASIC, recomendado para novas aplicações.

### Por que AES-256-GCM?
- Criptografia autenticada (garante integridade)
- Modo galois/counter mode (GCM) previne ataques
- Padrão da indústria

### Por que sessão em vez de JWT?
- Mais seguro para aplicações web tradicionais
- Permite invalidação imediata
- Cookie httpOnly previne XSS
- Store no PostgreSQL para persistência

### Por que Prisma?
- Type-safety total com TypeScript
- Migrations automáticas
- IntelliSense excelente
- Schema declarativo

## Melhorias Futuras

- [ ] Testes E2E com Playwright
- [ ] CI/CD com GitHub Actions
- [ ] Integração com S3 para uploads
- [ ] Notificações de cobrança (email/push)
- [ ] Exportação de dados (CSV/PDF)
- [ ] 2FA (autenticação de dois fatores)
- [ ] PWA (Progressive Web App)
- [ ] Análise de gastos e gráficos
- [ ] Compartilhamento de assinaturas em família

## Troubleshooting

### Erro de conexão com banco
Verifique se o PostgreSQL está rodando: `docker ps`

### Erro "ENCRYPTION_KEY invalid"
Certifique-se de que a chave tem exatamente 32 bytes (44 chars base64)

### OAuth não funciona
Verifique as URLs de callback nas configurações do Google/Facebook

### Uploads não aparecem
Verifique permissões da pasta `apps/api/uploads`

## Licença

MIT

## Autor

Desenvolvido como projeto de demonstração fullstack profissional.
