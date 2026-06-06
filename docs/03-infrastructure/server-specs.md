# 🖥️ Server Specifications

## Hardware Report

| Component | Specification |
|-----------|--------------|
| **Machine** | Toshiba Satellite L655 |
| **OS** | Linux Mint (Ubuntu/Debian based) |
| **CPU** | 4 Cores (25-35% idle utilization) |
| **Total RAM** | 4.1 GB |
| **Idle RAM Usage** | ~2.2 GB (55%) |
| **Available RAM** | ~1.9 GB |
| **Swap** | ~480 MB (minimal usage) |
| **Storage** | 430 GB HDD |
| **Network** | Ethernet / WiFi (Home Network) |

---

## Resource Budget

Estimated memory allocation for the server stack:

| Service | RAM Usage | Priority |
|---------|-----------|----------|
| **Linux Mint OS** | ~800 MB | System |
| **Desktop Environment** | ~600 MB | ⚠️ Can be disabled |
| **PostgreSQL** | ~200-500 MB | Critical |
| **Node.js + Express** | ~100-200 MB | Critical |
| **Nginx** | ~10-30 MB | Critical |
| **Cloudflare Tunnel** | ~30-50 MB | Critical |
| **System Buffers/Cache** | ~200-400 MB | System |
| **Total Estimated** | ~2.0-2.6 GB | — |
| **Free Remaining** | ~1.5-2.1 GB | — |

### ⚠️ Optimization Recommendations

1. **Disable Desktop Environment** if using the machine as a headless server:
   ```bash
   sudo systemctl set-default multi-user.target
   # Saves ~600 MB RAM
   ```

2. **Tune PostgreSQL** (`/etc/postgresql/*/main/postgresql.conf`):
   ```ini
   shared_buffers = 128MB          # Default is 128MB, keep it
   work_mem = 4MB                  # Reduce from default
   maintenance_work_mem = 64MB     # Reduce from default
   effective_cache_size = 512MB    # Hint for query planner
   max_connections = 20            # Low — single user system
   ```

3. **Manage services dynamically** via `systemctl`:
   ```bash
   # Stop services when not developing
   sudo systemctl stop postgresql nginx

   # Start only what you need
   sudo systemctl start postgresql nginx
   ```

---

## Storage Planning

| Metric | Value |
|--------|-------|
| Total Disk | 430 GB |
| Reserved for OS + Apps | ~30 GB |
| Available for Photos | ~400 GB |
| Average Photo Size | 3-8 MB |
| Estimated Capacity | **50,000 - 130,000 photos** |
| Recommended Max Usage | 80% (344 GB) |

### Folder Structure for Photo Storage

```
/home/<user>/OneCloudSync/backend/uploads/
├── 2026/
│   ├── 01/
│   │   ├── 01/
│   │   │   ├── a1b2c3d4.jpg
│   │   │   └── e5f6a7b8.jpg
│   │   ├── 02/
│   │   └── ...
│   ├── 02/
│   └── ...
└── ...
```

- **Format**: `/uploads/YYYY/MM/DD/<uuid>.ext`
- **Rationale**: Prevents any single directory from containing too many files (filesystem performance degrades beyond ~10,000 files per directory)

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
