# Estrutura Completa do Projeto SmiloVault

```
smilovault/
│
├── apps/
│   ├── api/                                    # Backend Node.js + Express
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   └── api.test.ts                # Testes de integração
│   │   │   ├── config/
│   │   │   │   ├── database.ts                # Configuração Prisma
│   │   │   │   ├── index.ts                   # Config geral e env vars
│   │   │   │   └── passport.ts                # Estratégias OAuth
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts                    # Middleware de autenticação
│   │   │   │   ├── error.ts                   # Error handlers
│   │   │   │   └── validation.ts              # Validação com Zod
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts                    # Rotas de autenticação
│   │   │   │   └── items.ts                   # CRUD de itens
│   │   │   ├── utils/
│   │   │   │   ├── __tests__/
│   │   │   │   │   └── crypto.test.ts         # Testes de criptografia
│   │   │   │   └── crypto.ts                  # AES-256-GCM encryption
│   │   │   ├── validators/
│   │   │   │   └── schemas.ts                 # Schemas de validação Zod
│   │   │   └── index.ts                       # Entry point da API
│   │   ├── prisma/
│   │   │   ├── schema.prisma                  # Schema do banco
│   │   │   └── seed.ts                        # Seed de dados iniciais
│   │   ├── uploads/                           # Pasta de uploads
│   │   │   └── .gitkeep
│   │   ├── .env.example                       # Exemplo de variáveis
│   │   ├── Dockerfile                         # Docker da API
│   │   ├── jest.config.js                     # Config Jest
│   │   ├── package.json                       # Dependências API
│   │   └── tsconfig.json                      # Config TypeScript
│   │
│   └── web/                                    # Frontend React + Vite
│       ├── src/
│       │   ├── components/
│       │   │   ├── ItemCard.tsx               # Card de item
│       │   │   ├── Layout.tsx                 # Layout principal
│       │   │   ├── ProtectedRoute.tsx         # Rota protegida
│       │   │   └── Sidebar.tsx                # Barra lateral
│       │   ├── contexts/
│       │   │   └── AuthContext.tsx            # Context de autenticação
│       │   ├── lib/
│       │   │   └── api.ts                     # Configuração Axios
│       │   ├── pages/
│       │   │   ├── DashboardPage.tsx          # Dashboard principal
│       │   │   ├── ItemDetailPage.tsx         # Detalhes do item
│       │   │   ├── ItemsPage.jsx              # Lista de itens
│       │   │   ├── LoginPage.tsx              # Login
│       │   │   ├── NewItemPage.tsx            # Criar item
│       │   │   ├── RegisterPage.tsx           # Cadastro
│       │   │   └── SettingsPage.tsx           # Configurações
│       │   ├── services/
│       │   │   ├── auth.ts                    # Serviço de autenticação
│       │   │   └── items.ts                   # Serviço de itens
│       │   ├── types/
│       │   │   └── index.ts                   # TypeScript types
│       │   ├── App.tsx                        # Componente raiz
│       │   ├── index.css                      # Estilos Tailwind
│       │   ├── main.tsx                       # Entry point
│       │   └── vite-env.d.ts                  # Tipos Vite
│       ├── public/
│       ├── .env.example                       # Exemplo de variáveis
│       ├── Dockerfile                         # Docker do frontend
│       ├── index.html                         # HTML principal
│       ├── nginx.conf                         # Config Nginx
│       ├── package.json                       # Dependências web
│       ├── postcss.config.js                  # Config PostCSS
│       ├── tailwind.config.js                 # Config Tailwind
│       ├── tsconfig.json                      # Config TypeScript
│       ├── tsconfig.node.json                 # Config TS para Node
│       └── vite.config.ts                     # Config Vite
│
├── nginx/                                      # Configuração Nginx produção
│   ├── conf.d/
│   │   └── smilovault.conf                    # Virtual host
│   └── nginx.conf                             # Config principal
│
├── scripts/                                    # Scripts utilitários
│   ├── generate-secrets.bat                   # Gerar secrets (Windows)
│   ├── generate-secrets.sh                    # Gerar secrets (Linux/Mac)
│   └── setup.sh                               # Setup automático
│
├── .env.prod.example                          # Variáveis de produção
├── .eslintrc.json                             # Config ESLint
├── .gitignore                                 # Git ignore
├── .prettierrc                                # Config Prettier
├── CHANGELOG.md                               # Histórico de mudanças
├── COMANDOS.md                                # Guia de comandos
├── CONTRIBUTING.md                            # Guia de contribuição
├── docker-compose.prod.yml                    # Docker produção
├── docker-compose.yml                         # Docker desenvolvimento
├── package.json                               # Package.json raiz
├── pnpm-workspace.yaml                        # Config workspace pnpm
├── QUICKSTART.md                              # Início rápido
└── README.md                                  # Documentação principal
```

## Arquivos Chave

### Segurança
- `apps/api/src/utils/crypto.ts` - Criptografia AES-256-GCM
- `apps/api/src/config/passport.ts` - OAuth strategies
- `apps/api/src/middleware/auth.ts` - Proteção de rotas

### Backend Core
- `apps/api/src/index.ts` - Configuração Express completa
- `apps/api/src/routes/auth.ts` - Login, registro, OAuth
- `apps/api/src/routes/items.ts` - CRUD completo + stats
- `apps/api/prisma/schema.prisma` - Modelo de dados

### Frontend Core
- `apps/web/src/App.tsx` - Rotas da aplicação
- `apps/web/src/contexts/AuthContext.tsx` - Estado global auth
- `apps/web/src/pages/DashboardPage.tsx` - Dashboard principal
- `apps/web/src/services/items.ts` - API calls

### DevOps
- `docker-compose.yml` - Ambiente de desenvolvimento
- `docker-compose.prod.yml` - Ambiente de produção
- `nginx/conf.d/smilovault.conf` - Reverse proxy + SSL

### Documentação
- `README.md` - Documentação completa
- `QUICKSTART.md` - Setup rápido
- `COMANDOS.md` - Referência de comandos
- `CONTRIBUTING.md` - Guia para contribuidores

## Tecnologias por Arquivo

### TypeScript
- Todos os arquivos `.ts` e `.tsx`
- Tipos em `apps/web/src/types/`
- Validação com Zod em `apps/api/src/validators/`

### React
- Componentes em `apps/web/src/components/`
- Páginas em `apps/web/src/pages/`
- Hooks em `apps/web/src/contexts/`

### Prisma
- Schema em `apps/api/prisma/schema.prisma`
- Migrations geradas automaticamente
- Client gerado em `node_modules/.prisma/client`

### Docker
- Desenvolvimento: `docker-compose.yml`
- Produção: `docker-compose.prod.yml`
- Dockerfiles individuais em cada app

## Fluxo de Dados

```
Frontend (React)
    ↓ HTTP Request
Nginx (Reverse Proxy)
    ↓ /api/*
Express (Backend)
    ↓ Auth Middleware
Routes (auth.ts / items.ts)
    ↓ Validação (Zod)
Controllers
    ↓ Business Logic
Prisma ORM
    ↓ SQL
PostgreSQL
```

## Segurança em Camadas

1. **Transporte**: HTTPS (Nginx + Certbot)
2. **Session**: Cookie httpOnly + PostgreSQL store
3. **Headers**: Helmet middleware
4. **Rate Limit**: express-rate-limit
5. **Validação**: Zod schemas
6. **Autenticação**: Passport (local + OAuth)
7. **Senhas Login**: Argon2 hash
8. **Senhas Itens**: AES-256-GCM encryption
9. **Database**: Multitenancy com userId filter
10. **CORS**: Whitelist de origens

## Total de Arquivos

- **Backend**: ~20 arquivos TypeScript
- **Frontend**: ~20 arquivos TypeScript/React
- **Config**: ~15 arquivos de configuração
- **Docker**: 5 arquivos
- **Docs**: 5 arquivos markdown
- **Total**: ~65 arquivos

## Linhas de Código (estimado)

- Backend: ~2,000 linhas
- Frontend: ~2,500 linhas
- Config/Infra: ~500 linhas
- Docs: ~1,500 linhas
- **Total**: ~6,500 linhas
