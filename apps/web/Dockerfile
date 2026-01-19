FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/web/tsconfig.json apps/web/tsconfig.json
COPY apps/web/tsconfig.node.json apps/web/tsconfig.node.json
COPY apps/web/vite.config.ts apps/web/vite.config.ts
COPY apps/web/postcss.config.cjs apps/web/postcss.config.cjs
COPY apps/web/tailwind.config.js apps/web/tailwind.config.js
COPY apps/web/index.html apps/web/index.html
COPY apps/web/src apps/web/src
COPY apps/web/nginx.conf apps/web/nginx.conf

ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN pnpm install --frozen-lockfile --filter ./apps/web...
RUN pnpm --filter ./apps/web... build

FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
