# 🚀 Deployment

OneCloudSync runs on **any device** — an old laptop, a Raspberry Pi, a mini PC, or a VPS. There are two ways to run it:

## 🐳 Option A — Docker Compose (recommended)

Runs PostgreSQL, the API, and the web app with one command. Requires Docker + Docker Compose.

```bash
cp .env.example .env    # set a real DB_PASSWORD and API_KEY (both required)
docker compose up -d --build
docker compose run --rm backend node src/config/db-init.js   # first run only

# → open http://<device-ip>:8080 and log in with your API_KEY
```

**Where your data lives:**

| Data | Location |
|------|----------|
| Photos | `./photos/` on the host (plain files — back up with `rsync`/`cp`) |
| Metadata | `pgdata` Docker volume (back up with `pg_dump`, see below) |

> ⚠️ If uploads fail with a permission error, the `photos/` directory was created by root: `sudo chown -R $USER:$USER photos`

**Everyday commands:**

```bash
docker compose logs -f backend                     # logs
docker compose build --pull && docker compose up -d  # update after new code
docker compose exec db pg_dump -U postgres onecloudsync | gzip > backup.sql.gz  # DB backup
docker compose down                                # stop (data is kept)
```

### Tailscale hardening

By default the app listens on all interfaces (port 8080). To make it reachable **only** through your Tailscale VPN, set in `.env`:

```dotenv
BIND_IP=<your Tailscale IP>   # find it with: tailscale ip -4
```

and run `docker compose up -d` again. The API and database are never exposed to the network in either case — only the web app's port is published.

## 🔧 Option B — Manual

Requires Node.js v20+ and a running PostgreSQL server.

```bash
# Backend
cd backend
cp .env.example .env      # DB credentials, API_KEY, etc.
npm install
npm run db:init           # create database and tables
npm start                 # API on port 3000

# Frontend
cd ../frontend
npm install
npm run build             # static files in dist/
```

Serve `frontend/dist/` with any static file server, and proxy `/api` to `localhost:3000` (see `frontend/nginx.conf` for a ready-made nginx example). For development, `npm run dev` in both directories is enough — the Vite dev server proxies `/api` automatically.
