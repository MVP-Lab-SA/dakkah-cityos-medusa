FROM public.ecr.aws/docker/library/node:20-alpine

RUN corepack enable

WORKDIR /app

COPY . .

ARG VITE_MEDUSA_BACKEND_URL=http://127.0.0.1:9000
ARG VITE_MEDUSA_PUBLISHABLE_KEY=
ARG VITE_STOREFRONT_URL=http://127.0.0.1:8000
ENV VITE_MEDUSA_BACKEND_URL=$VITE_MEDUSA_BACKEND_URL
ENV VITE_MEDUSA_PUBLISHABLE_KEY=$VITE_MEDUSA_PUBLISHABLE_KEY
ENV VITE_STOREFRONT_URL=$VITE_STOREFRONT_URL

RUN pnpm install --frozen-lockfile --filter=storefront...
RUN pnpm --filter=storefront build

WORKDIR /app/apps/storefront

EXPOSE 8000

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "8000"]
