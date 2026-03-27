FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --filter=storefront...
RUN pnpm --filter=storefront build

WORKDIR /app/apps/storefront

EXPOSE 8000

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "8000"]
