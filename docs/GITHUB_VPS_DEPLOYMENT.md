# GitHub Docker to VPS Deployment

This repository has an automated Docker deployment workflow at:

- `.github/workflows/deploy-vps.yml`

It runs on:

- Push to `main`
- Manual trigger from GitHub Actions (`workflow_dispatch`)

## Required GitHub Secrets

Set these in **GitHub → Settings → Secrets and variables → Actions**:

- `VPS_HOST` - VPS IP or hostname (example: `72.62.29.11`)
- `VPS_USER` - SSH user (example: `root`)
- `VPS_SSH_PRIVATE_KEY` - Private SSH key content for the VPS user
- `GHCR_USERNAME` - GitHub username that can pull GHCR images
- `GHCR_TOKEN` - GitHub token/PAT with at least `read:packages`

The workflow deploys to:

- `/srv/apps/marketplace/kashif-medusa`

## What the Workflow Does

1. Builds backend and storefront Docker images
2. Pushes images to GitHub Container Registry (`ghcr.io`)
3. SSHes to VPS and ensures `/srv/apps/marketplace/kashif-medusa` exists
4. Writes `docker-compose.yml` on VPS with the new image tag
5. Runs `docker compose pull` and `docker compose up -d`

## Notes

- The workflow deploys two services: `backend` on `9000` and `storefront` on `8000`.
- Create these files on VPS before first run:
  - `/srv/apps/marketplace/kashif-medusa/backend.env`
  - `/srv/apps/marketplace/kashif-medusa/storefront.env`
- The server must have Docker + Docker Compose plugin installed (`docker compose` command).
