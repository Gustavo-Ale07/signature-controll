# Changelog

## [1.0.0] - 2026-01-18

### Inicial Release

#### Funcionalidades
- ✅ Autenticação completa (local + OAuth Google/Facebook)
- ✅ CRUD de itens (assinaturas e contas)
- ✅ Criptografia AES-256-GCM para senhas
- ✅ Upload de ícones/imagens
- ✅ Dashboard com estatísticas
- ✅ Cálculo automático de gastos mensais
- ✅ Sistema de próximas cobranças
- ✅ Filtros e busca de itens
- ✅ Página de detalhes com toggle de senha

#### Segurança
- ✅ Hash de senhas com Argon2
- ✅ Sessão segura com cookie httpOnly
- ✅ Rate limiting
- ✅ Helmet headers
- ✅ CORS configurado
- ✅ Validação com Zod
- ✅ Multitenancy (isolamento de dados por usuário)

#### DevOps
- ✅ Docker Compose para desenvolvimento
- ✅ Docker Compose para produção
- ✅ Configuração Nginx com SSL
- ✅ Scripts de setup automatizado
- ✅ Migrations e seeds
- ✅ Testes unitários e de integração

#### Tecnologias
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Frontend: React, Vite, TypeScript, TailwindCSS
- Auth: Passport.js, Argon2
- Crypto: AES-256-GCM
- DevOps: Docker, Nginx, Certbot

### Próximas Versões

#### [1.1.0] - Planejado
- [ ] Notificações de cobrança (email)
- [ ] Exportação de dados (CSV/PDF)
- [ ] Categorias de assinaturas
- [ ] Gráficos de gastos

#### [1.2.0] - Planejado
- [ ] 2FA (Two-Factor Authentication)
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Integração com S3 para uploads

#### [2.0.0] - Futuro
- [ ] Compartilhamento familiar
- [ ] Aplicativo móvel (React Native)
- [ ] Webhooks para integrações
- [ ] API pública
