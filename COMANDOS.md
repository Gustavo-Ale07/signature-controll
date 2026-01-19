# Comandos para Iniciar o SmiloVault

## Passo a Passo Completo (Windows)

Abra o PowerShell ou CMD e execute os seguintes comandos na ordem:

```powershell
# 1. Navegar até a pasta do projeto
cd c:\Dev\signatures-control

# 2. Instalar pnpm globalmente (se não tiver)
npm install -g pnpm

# 3. Instalar todas as dependências
pnpm install

# 4. Gerar chave de criptografia (copie o resultado)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 5. Gerar session secret (copie o resultado)
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# 6. Copiar arquivos de exemplo
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env

# 7. IMPORTANTE: Edite apps\api\.env e substitua:
#    - ENCRYPTION_KEY=<cole-a-chave-do-passo-4>
#    - SESSION_SECRET=<cole-o-secret-do-passo-5>
notepad apps\api\.env

# 8. Subir o PostgreSQL com Docker
docker-compose up -d postgres

# 9. Aguardar 10 segundos para o banco iniciar
timeout /t 10

# 10. Rodar migrations do Prisma
pnpm db:migrate

# 11. Popular banco com dados iniciais (usuário teste)
pnpm db:seed

# 12. Iniciar aplicação em modo desenvolvimento
pnpm dev
```

## Após executar todos os comandos

A aplicação estará disponível em:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001

Login de teste:
- **Email**: test@smilovault.com
- **Senha**: Test123!

## Comandos úteis após setup inicial

```powershell
# Parar tudo
Ctrl+C (no terminal que rodou pnpm dev)

# Iniciar novamente (depois do primeiro setup)
pnpm dev

# Ver banco de dados visualmente
pnpm db:studio

# Ver logs do Docker
docker-compose logs -f

# Parar Docker
docker-compose down

# Recomeçar do zero (CUIDADO: apaga dados)
docker-compose down -v
pnpm db:migrate
pnpm db:seed
```

## Em caso de erro

### "Cannot find module"
```powershell
pnpm install
```

### "Port 5173 already in use"
```powershell
# Matar processo na porta 5173
netstat -ano | findstr :5173
taskkill /PID <numero-do-pid> /F
```

### "Cannot connect to database"
```powershell
# Reiniciar PostgreSQL
docker-compose restart postgres
timeout /t 5
pnpm db:migrate
```

### "ENCRYPTION_KEY invalid"
```powershell
# Gerar nova chave e atualizar no .env
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
notepad apps\api\.env
```

## Configurar OAuth (Opcional)

### Google OAuth

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto
3. Ative "Google+ API"
4. Crie credenciais OAuth 2.0
5. Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
6. Copie Client ID e Client Secret
7. Cole no arquivo `apps\api\.env`:
   ```
   GOOGLE_CLIENT_ID=seu-client-id
   GOOGLE_CLIENT_SECRET=seu-client-secret
   ```

### Facebook OAuth

1. Acesse: https://developers.facebook.com/
2. Crie um novo app
3. Adicione "Facebook Login"
4. Valid OAuth Redirect URIs: `http://localhost:3001/api/auth/facebook/callback`
5. Copie App ID e App Secret
6. Cole no arquivo `apps\api\.env`:
   ```
   FACEBOOK_APP_ID=seu-app-id
   FACEBOOK_APP_SECRET=seu-app-secret
   ```

## Próximos Passos

1. Explore a aplicação em http://localhost:5173
2. Crie novas assinaturas e contas
3. Teste o upload de ícones
4. Veja o dashboard de gastos
5. Leia a documentação completa no README.md
