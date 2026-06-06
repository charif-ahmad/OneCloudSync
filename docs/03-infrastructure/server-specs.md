# 🖥️ Server Requirements

## Minimum Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Any Linux distribution (Ubuntu, Debian, Mint, etc.) | Ubuntu 22.04 LTS / Debian 12 |
| **CPU** | 2 Cores | 4 Cores |
| **RAM** | 2 GB | 4 GB+ |
| **Storage** | 50 GB | 200 GB+ (depends on photo collection size) |
| **Network** | Ethernet or WiFi | Ethernet (for reliability) |

---

## Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | v20+ | Backend runtime |
| **PostgreSQL** | Latest | Photo metadata storage |
| **Nginx** | Latest | Reverse proxy |
| **PM2** | Latest | Process manager (keeps API running) |

---

## Resource Budget (Estimated)

For a low-resource server (~4 GB RAM):

| Service | RAM Usage | Priority |
|---------|-----------|----------|
| **Linux OS** | ~800 MB | System |
| **PostgreSQL** | ~200-500 MB | Critical |
| **Node.js + Express** | ~100-200 MB | Critical |
| **Nginx** | ~10-30 MB | Critical |
| **System Buffers/Cache** | ~200-400 MB | System |
| **Total Estimated** | ~1.3-1.9 GB | — |

> 💡 **Tip**: If running on a laptop or old machine, disable the desktop environment to save ~600 MB RAM:
> ```bash
> sudo systemctl set-default multi-user.target
> ```

---

## PostgreSQL Tuning (Low-Resource Servers)

If your server has limited RAM, add these settings to `/etc/postgresql/*/main/postgresql.conf`:

```ini
shared_buffers = 128MB
work_mem = 4MB
maintenance_work_mem = 64MB
effective_cache_size = 512MB
max_connections = 20            # Single user system — no need for many
```

---

## Storage Planning

| Average Photo Size | 100 GB Storage | 200 GB Storage | 400 GB Storage |
|--------------------|---------------|----------------|----------------|
| 3 MB | ~33,000 photos | ~66,000 photos | ~133,000 photos |
| 5 MB | ~20,000 photos | ~40,000 photos | ~80,000 photos |
| 8 MB | ~12,500 photos | ~25,000 photos | ~50,000 photos |

> Recommended: Keep disk usage below 80% for best filesystem performance.

### Photo Storage Structure

```
backend/uploads/
└── YYYY/
    └── MM/
        └── DD/
            ├── <uuid>.jpg
            ├── <uuid>.png
            └── <uuid>.webp
```

- **UUID-based filenames** to prevent collisions
- **Date-based folders** based on upload date
- **Original extension preserved** for proper content-type serving

---

## System Health Commands

```bash
# Check RAM usage
free -h

# Check disk usage
df -h /home

# Check service status
sudo systemctl status nginx postgresql

# Monitor real-time resource usage
htop

# Check uploads folder size
du -sh ~/OneCloudSync/backend/uploads/
```

---

> **Next**: [Tech Stack →](./tech-stack.md)
