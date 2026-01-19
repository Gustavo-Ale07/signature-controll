FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/tsconfig.json apps/api/tsconfig.json
COPY apps/api/prisma apps/api/prisma
COPY apps/api/src apps/api/src

RUN pnpm install --frozen-lockfile --filter ./apps/api...
RUN pnpm --filter ./apps/api... db:generate
RUN pnpm --filter ./apps/api... build

FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --prod --frozen-lockfile --filter ./apps/api...

COPY --from=builder /app/apps/api/dist /app/apps/api/dist
COPY --from=builder /app/apps/api/prisma /app/apps/api/prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

WORKDIR /app/apps/api

RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
