# Guia de Contribuição

## Como Contribuir

Obrigado por considerar contribuir com o SmiloVault! Este documento fornece diretrizes para contribuições.

## Processo de Desenvolvimento

1. **Fork** o repositório
2. **Clone** seu fork
3. Crie uma **branch** para sua feature: `git checkout -b feature/minha-feature`
4. **Commit** suas mudanças: `git commit -m 'feat: adiciona minha feature'`
5. **Push** para a branch: `git push origin feature/minha-feature`
6. Abra um **Pull Request**

## Padrões de Código

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

Exemplos:
```
feat: adiciona filtro por categoria
fix: corrige cálculo de gasto mensal
docs: atualiza README com instruções de deploy
```

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any`, use `unknown` se necessário
- Prefira interfaces para objetos públicos
- Use `type` para unions e intersections

### React

- Componentes funcionais com hooks
- Um componente por arquivo
- Props tipadas com TypeScript
- Use nomes descritivos

### Backend

- Controllers devem ser pequenos e focados
- Validação sempre com Zod
- Erros devem ser tratados adequadamente
- Logs não devem conter informações sensíveis

## Testes

### Rodar Testes

```bash
pnpm test                 # Todos os testes
pnpm --filter api test    # Apenas backend
```

### Escrever Testes

- Testes unitários para utils e helpers
- Testes de integração para rotas
- Mínimo 70% de cobertura para novas features

## Code Review

Todos os PRs passam por code review. Considere:

- Código limpo e legível
- Comentários quando necessário
- Testes incluídos
- Documentação atualizada
- Sem breaking changes (ou bem justificados)

## Reportar Bugs

Use as [Issues do GitHub](https://github.com/seu-repo/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots se aplicável
- Versão do Node.js e sistema operacional

## Sugerir Features

Abra uma issue com:

- Descrição da feature
- Caso de uso
- Possível implementação
- Mockups/wireframes se aplicável

## Questões de Segurança

**NÃO** abra issues públicas para vulnerabilidades de segurança.

Envie email para: security@smilovault.com (exemplo)

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).
