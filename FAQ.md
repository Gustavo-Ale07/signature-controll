# FAQ - Perguntas Frequentes

## Instalação e Setup

### Como instalo o projeto?

Siga os passos no [QUICKSTART.md](QUICKSTART.md) ou [COMANDOS.md](COMANDOS.md).

Resumo:
```bash
pnpm install
# Configure .env
docker-compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm dev
```

### Por que usar pnpm em vez de npm?

- Mais rápido (cache compartilhado)
- Economiza espaço em disco
- Workspaces nativos
- Lock file mais confiável

Você pode usar npm também, mas pnpm é recomendado.

### Como gero a chave de criptografia?

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Cole o resultado (44 caracteres) no `.env` como `ENCRYPTION_KEY`.

### Preciso configurar OAuth para testar?

Não! OAuth é opcional. Você pode usar apenas login local com email/senha.

### Como reseto o banco de dados?

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d postgres
pnpm db:migrate
pnpm db:seed
```

**ATENÇÃO**: Isso apaga TODOS os dados!

## Desenvolvimento

### Como vejo os logs da API?

```bash
# Em desenvolvimento (pnpm dev)
Os logs aparecem no terminal

# Em produção (Docker)
docker logs smilovault-api-prod -f
```

### Como adiciono uma nova coluna no banco?

1. Edite `apps/api/prisma/schema.prisma`
2. Execute `pnpm db:migrate`
3. Prisma gerará a migration automaticamente

### Como testo a API sem o frontend?

Use ferramentas como:
- Postman
- Insomnia
- Thunder Client (VS Code)
- curl

Exemplo:
```bash
curl http://localhost:3001/health
```

### Como adiciono uma nova rota?

1. Crie a rota em `apps/api/src/routes/`
2. Adicione validação Zod em `apps/api/src/validators/`
3. Importe e use em `apps/api/src/index.ts`

### Como adiciono uma nova página no frontend?

1. Crie em `apps/web/src/pages/NomeDaPagina.tsx`
2. Adicione rota em `apps/web/src/App.tsx`
3. (Opcional) Adicione link na Sidebar

## Segurança

### Como funciona a criptografia de senhas?

Usamos AES-256-GCM (padrão militar):

1. Usuário envia senha em HTTPS
2. Backend criptografa com chave secreta (ENCRYPTION_KEY)
3. Salva: ciphertext, IV e authTag no banco
4. Nunca salva senha em texto puro
5. Decriptografia apenas por endpoint específico e autenticado

### Por que Argon2 em vez de bcrypt?

Argon2 é:
- Mais recente (2015 vs 1999)
- Mais resistente a ataques GPU/ASIC
- Vencedor do Password Hashing Competition
- Recomendado pela OWASP

### Como protejo contra SQL Injection?

Prisma ORM protege automaticamente:
- Usa prepared statements
- Escapa valores automaticamente
- Type-safe (TypeScript)

### O que acontece se alguém rouba meu ENCRYPTION_KEY?

**Grave!** A pessoa pode descriptografar todas as senhas salvas.

**Proteção**:
- NUNCA commite .env no Git
- Use secrets management em produção (AWS Secrets Manager, etc.)
- Rotacione chaves periodicamente
- Monitore acessos ao servidor

### Como faço backup seguro?

```bash
# Backup do banco
docker exec smilovault-postgres pg_dump -U smilovault smilovault > backup.sql

# Backup criptografado
gpg -c backup.sql  # Vai pedir senha
```

**IMPORTANTE**: Backup também deve incluir `ENCRYPTION_KEY` (guarde separado e seguro!)

## Produção

### Quanto custa rodar em produção?

**Mínimo**:
- VPS (DigitalOcean Droplet): $6/mês
- Domínio: ~$10/ano
- SSL: Grátis (Let's Encrypt)
- **Total**: ~$7/mês

**Recomendado**:
- VPS (2GB RAM): $12/mês
- Backup automático: $2/mês
- Email service: $10/mês
- **Total**: ~$24/mês

### Qual VPS recomenda?

Todos funcionam bem:
- **DigitalOcean**: Fácil de usar, ótima documentação
- **Vultr**: Mais barato, bom desempenho
- **Linode**: Confiável, suporte excelente
- **AWS Lightsail**: Integração com AWS
- **Hetzner**: Melhor custo-benefício (Europa)

### Como faço backup automático?

**Cron job** (adicione em crontab):

```bash
# Backup diário às 3h da manhã
0 3 * * * docker exec smilovault-postgres pg_dump -U smilovault smilovault > /backups/db_$(date +\%Y\%m\%d).sql
```

**Remoção de backups antigos** (manter últimos 30 dias):
```bash
0 4 * * * find /backups -name "db_*.sql" -mtime +30 -delete
```

### Como monitoro a aplicação?

**Opções**:

1. **Logs**:
   ```bash
   docker-compose logs -f
   ```

2. **Health check**:
   ```bash
   curl https://seudominio.com/health
   ```

3. **Monitoramento externo**:
   - UptimeRobot (gratuito)
   - Pingdom
   - Better Uptime

4. **APM** (futuro):
   - New Relic
   - Datadog
   - Sentry (erros)

### Como atualizo a aplicação em produção?

```bash
cd ~/smilovault
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

**Zero downtime** (futuro):
- Use blue-green deployment
- Load balancer com múltiplas instâncias

## Problemas Comuns

### "Port 5173 already in use"

Outro processo está usando a porta.

**Windows**:
```powershell
netstat -ano | findstr :5173
taskkill /PID <numero> /F
```

**Linux/Mac**:
```bash
lsof -ti:5173 | xargs kill -9
```

### "Cannot connect to database"

PostgreSQL não está rodando.

```bash
docker-compose up -d postgres
# Aguarde 5 segundos
pnpm db:migrate
```

### "ENCRYPTION_KEY invalid"

Chave tem tamanho errado (precisa ter 32 bytes = 44 chars base64).

Gere nova:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### "Module not found"

Dependências não instaladas.

```bash
pnpm install
```

### "Prisma Client not generated"

```bash
pnpm --filter api db:generate
```

### Upload de imagem não funciona

Verifique:
1. Pasta `apps/api/uploads` existe e tem permissão de escrita
2. Tamanho do arquivo < 5MB (configurável em MAX_FILE_SIZE)
3. Tipo de arquivo é imagem (jpeg, png, gif, webp)

### OAuth Google não funciona

Verifique:
1. `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
2. Redirect URI cadastrado: `http://localhost:3001/api/auth/google/callback`
3. Google+ API está ativada no projeto

### Senha não aparece ao clicar "Mostrar"

Verifique:
1. Usuário está autenticado
2. Item pertence ao usuário logado
3. Senha foi salva corretamente (tem ciphertext, iv e authTag)
4. Console do navegador para erros

## Performance

### A aplicação está lenta

**Verificar**:

1. **Banco de dados**:
   ```bash
   docker stats smilovault-postgres
   ```
   Se CPU/memória alta, pode precisar de índices.

2. **API**:
   - Ative cache de queries
   - Use paginação em listas grandes
   - Otimize queries do Prisma

3. **Frontend**:
   - Use React.memo para componentes pesados
   - Lazy loading de páginas
   - Otimize imagens

### Como escalo a aplicação?

**Vertical** (mais fácil):
- Aumente RAM/CPU do servidor

**Horizontal** (mais escalável):
- Load balancer (Nginx)
- Múltiplas instâncias da API
- Redis para sessões
- CDN para frontend
- PostgreSQL read replicas

## Customização

### Como mudo as cores?

Edite `apps/web/tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#sua-cor',
    600: '#sua-cor-escura',
    // ...
  }
}
```

### Como adiciono campos no Item?

1. Edite `apps/api/prisma/schema.prisma`:
   ```prisma
   model Item {
     // ...campos existentes
     meuNovoCampo String?
   }
   ```

2. Gere migration:
   ```bash
   pnpm db:migrate
   ```

3. Atualize validators em `apps/api/src/validators/schemas.ts`
4. Atualize types em `apps/web/src/types/index.ts`
5. Atualize forms e páginas

### Como adiciono autenticação com GitHub?

1. Instale `passport-github2`
2. Crie strategy em `apps/api/src/config/passport.ts`
3. Adicione rotas em `apps/api/src/routes/auth.ts`
4. Adicione botão no frontend

## Suporte

### Encontrei um bug, o que faço?

1. Verifique se já foi reportado (Issues no GitHub)
2. Abra uma issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Logs/screenshots
   - Versão do Node.js e sistema operacional

### Quero uma feature nova

1. Abra uma issue de "Feature Request"
2. Descreva o caso de uso
3. (Opcional) Implemente e abra PR

### Onde obtenho ajuda?

1. Leia a documentação (README, QUICKSTART, etc.)
2. Consulte este FAQ
3. Procure em Issues fechadas no GitHub
4. Abra nova issue
5. (Se urgente) Email para suporte

## Licença e Uso Comercial

### Posso usar comercialmente?

**Sim!** Licença MIT permite uso comercial sem restrições.

### Preciso dar crédito?

Não é obrigatório, mas é apreciado.

### Posso vender como serviço?

**Sim!** Você pode:
- Hospedar e cobrar usuários
- Customizar e revender
- Usar como base para seu SaaS
- White label

### Tem suporte comercial?

Atualmente não, mas contribuições são bem-vindas para melhorar o projeto.

---

**Não encontrou sua pergunta?**

Abra uma issue no GitHub ou consulte a documentação completa.
