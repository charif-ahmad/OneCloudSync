# 🐳 Docker Deployment

Run the entire stack — PostgreSQL, the Express API, and the React PWA — with a single command. This is the recommended way to deploy OneCloudSync on the home server: it replaces the manually installed PostgreSQL, PM2, and Nginx with three containers.

## Architecture

```
Browser ──► :8080  frontend (nginx)
                     ├── serves the built React PWA
                     └── proxies /api ──► backend (Express, internal)
                                             │
                                             ├── ./photos  (bind mount on host)
                                             └── db (PostgreSQL 17, internal)
                                                   └── pgdata (named volume)
```

Only port **8080** is published. The API and database are reachable solely on Docker's internal network — no open database or API ports, which fits the zero-open-ports Tailscale posture. Point Tailscale Serve or a Cloudflare Tunnel at port 8080.

## Quick Start

```bash
# 1. Configure secrets (both values are required — compose refuses to start without them)
cp .env.example .env
nano .env            # set a real DB_PASSWORD and API_KEY

# 2. Build and start everything
docker compose up -d --build

# 3. Initialize the database schema (first run only)
docker compose run --rm backend node src/config/db-init.js

# 4. Open the app
#    http://localhost:8080  (log in with your API_KEY)
```

## Configuration

All settings live in the root `.env` file (see `.env.example`):

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DB_PASSWORD` | ✅ | — | PostgreSQL password |
| `API_KEY` | ✅ | — | Login key for the app |
| `DB_NAME` | | `onecloudsync` | Database name |
| `DB_USER` | | `postgres` | Database user |
| `CORS_ORIGIN` | | `http://localhost:8080` | Allowed origin in production |
| `BIND_IP` | | `0.0.0.0` | Interface the app listens on (see [Tailscale hardening](#tailscale-hardening)) |
| `BIND_PORT` | | `8080` | Host port the app is published on |

## Where the data lives

| Data | Location | Why |
|------|----------|-----|
| **Photos** | `./photos/` on the host (bind mount) | The irreplaceable data — directly visible and backupable with plain `rsync`/`cp` |
| **Metadata** | `pgdata` named Docker volume | PostgreSQL internals; back up via `pg_dump` (below) |

> ⚠️ The `photos/` directory must be owned by your host user. Docker creates missing bind-mount directories as **root**, which makes uploads fail with `EACCES` (the backend runs as a non-root user). If that happens: `sudo chown -R $USER:$USER photos`.

## Tailscale hardening

By default the app is published on **all interfaces** (`0.0.0.0:8080`), so anyone on the local network can reach the login page (still protected by the API key). To restore the zero-LAN-exposure posture from the [Tailscale setup guide](../my-setup/tailscale-setup.md), bind the published port to the server's Tailscale IP in `.env`:

```bash
tailscale ip -4        # e.g. 100.103.154.10
```

```dotenv
BIND_IP=100.103.154.10
```

```bash
docker compose up -d   # re-create the frontend with the new binding
```

Now the app is reachable **only** from devices on your tailnet, at `http://<tailscale-ip>:8080`. Nothing else needs restricting: the API (port 3000) and PostgreSQL are never published to the host at all — they exist only on Docker's internal network.

> If the Tailscale IP ever changes, update `BIND_IP` and run `docker compose up -d` again. Note that Docker must start **after** Tailscale on boot, otherwise the bind fails; if that happens, `docker compose up -d` once `tailscale status` is up.

## Day-2 Operations

```bash
# Logs
docker compose logs -f backend

# Update after pulling new code
docker compose build --pull && docker compose up -d

# Stop / start
docker compose stop
docker compose up -d

# Backup (add to cron)
docker compose exec db pg_dump -U postgres onecloudsync | gzip > backup-$(date +%F).sql.gz
rsync -a photos/ /path/to/backup/photos/

# Full teardown — ⚠️ -v also deletes the database volume
docker compose down        # keeps data
docker compose down -v     # deletes metadata (photos on disk survive)
```

## Resource limits (for low-RAM servers)

On a small machine (e.g. the 4 GB Toshiba), cap each service by adding under the respective service in `docker-compose.yml`:

```yaml
    mem_limit: 512m    # backend
    mem_limit: 768m    # db
    mem_limit: 128m    # frontend
```

## Local development

Docker is not required for development — `npm run dev` still works exactly as before (the Vite dev server proxies `/api` to `localhost:3000`). A handy middle ground is running **only** PostgreSQL in Docker:

```bash
docker compose up -d db
cd backend && npm run dev
```
