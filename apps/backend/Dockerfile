FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --filter=backend...
RUN pnpm --filter=backend build

WORKDIR /app/apps/backend

EXPOSE 9000

CMD ["pnpm", "start"]
