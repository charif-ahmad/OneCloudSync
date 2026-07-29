# 🔧 My Setup

> Personal notes for running OneCloudSync on my Toshiba server.
> For general setup, see the [main README](../README.md).

---

## 🖥️ Server

| Component | Details |
|-----------|---------|
| **Machine** | Toshiba Satellite L655 |
| **OS** | Linux Mint |
| **CPU** | 4 Cores |
| **RAM** | 4.1 GB |
| **Storage** | 430 GB HDD (~400 GB available for photos) |
| **Network** | Tailscale VPN (WireGuard) |
| **Dev Environment** | Windows + VS Code Remote-SSH |

---

## 🔐 Tailscale

Tailscale creates an encrypted WireGuard tunnel between my phone and server — no port forwarding, no router config, no HTTPS needed.

```bash
# Install (one time)
curl -fsSL https://tailscale.com/install.sh | sh

# Check your IP
tailscale ip -4
# → 100.x.x.x
```

### Restrict access to Tailscale only

In `.env`, set `BIND_IP` to your Tailscale IP:

```dotenv
BIND_IP=100.x.x.x   # app reachable only through the VPN
```

Then restart: `docker compose up -d`. Done — the app is invisible to the local network.

---

## ⚡ Start / Stop

```bash
# start-cloud
#!/bin/bash
sudo tailscale up
docker compose up -d
echo "✅ OneCloudSync is running"
```

```bash
# stop-cloud
#!/bin/bash
docker compose down
echo "🔴 OneCloudSync stopped"
```

```bash
# Make executable (first time only)
chmod +x start-cloud.sh stop-cloud.sh
```
