#!/bin/bash

PGDATA=/home/runner/workspace/.pgdata
MIGRATION_MARKER="$PGDATA/.migrated"

# ── 1. Start local PostgreSQL if not running ──
if ! pg_isready -h localhost -p 5433 -q 2>/dev/null; then
  echo "Starting local PostgreSQL..."
  if [ ! -d "$PGDATA" ]; then
    initdb -D "$PGDATA" --auth=trust --no-locale --encoding=UTF8 >/dev/null 2>&1
    echo "port = 5433" >> "$PGDATA/postgresql.conf"
    echo "listen_addresses = 'localhost'" >> "$PGDATA/postgresql.conf"
    echo "unix_socket_directories = '/tmp'" >> "$PGDATA/postgresql.conf"
    echo "shared_buffers = 128MB" >> "$PGDATA/postgresql.conf"
    echo "work_mem = 4MB" >> "$PGDATA/postgresql.conf"
  fi
  pg_ctl -D "$PGDATA" -l "$PGDATA/logfile" start >/dev/null 2>&1
  sleep 2

  psql -h localhost -p 5433 -U runner -d postgres -c "SELECT 1 FROM pg_roles WHERE rolname='postgres'" 2>/dev/null | grep -q 1 || \
    psql -h localhost -p 5433 -U runner -d postgres -c "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'password';" >/dev/null 2>&1

  psql -h localhost -p 5433 -U runner -d postgres -c "SELECT 1 FROM pg_database WHERE datname='medusadb'" 2>/dev/null | grep -q 1 || \
    psql -h localhost -p 5433 -U runner -d postgres -c "CREATE DATABASE medusadb OWNER postgres;" >/dev/null 2>&1

  echo "Local PostgreSQL ready on port 5433"
else
  echo "Local PostgreSQL already running on port 5433"
fi

# ── 2. Override DATABASE_URL to use local PostgreSQL ──
export DATABASE_URL="postgresql://postgres:password@localhost:5433/medusadb"
export PGHOST="localhost"
export PGPORT="5433"
export PGUSER="postgres"
export PGPASSWORD="password"
export PGDATABASE="medusadb"

# ── 3. Run migrations if needed ──
TABLE_COUNT=$(psql -h localhost -p 5433 -U postgres -d medusadb -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -lt "10" ]; then
  echo "Database needs migrations (found $TABLE_COUNT tables). Running Medusa db:migrate..."
  cd /home/runner/workspace/apps/backend
  NODE_OPTIONS="--max-old-space-size=768" npx medusa db:migrate 2>&1 | tail -20
  echo "Migrations complete."
  cd /home/runner/workspace
fi

# ── 4. Kill any stale processes on our ports ──
fuser -k 9000/tcp 2>/dev/null
fuser -k 5000/tcp 2>/dev/null
sleep 1

# ── 5. Start Medusa backend in background ──
cd /home/runner/workspace/apps/backend
NODE_OPTIONS="--max-old-space-size=512" npx medusa develop &
BACKEND_PID=$!

echo "Waiting for Medusa backend to start..."
for i in $(seq 1 60); do
  if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo "Medusa backend is ready on port 9000"
    break
  fi
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend process died. Cleaning port and retrying..."
    fuser -k 9000/tcp 2>/dev/null
    sleep 2
    NODE_OPTIONS="--max-old-space-size=512" npx medusa develop &
    BACKEND_PID=$!
  fi
  sleep 2
done

# ── 6. Start storefront ──
cd /home/runner/workspace/apps/storefront
echo "Starting storefront on port 5000..."
NODE_OPTIONS="--max-old-space-size=1024" exec npx vite dev --host 0.0.0.0 --port 5000 --strictPort
