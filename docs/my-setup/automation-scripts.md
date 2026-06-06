# ⚙️ Automation Scripts

> Scripts I use to start/stop the entire OneCloudSync system on my Toshiba server.

## start-cloud.sh

Starts everything with one command:

```bash
#!/bin/bash
echo "☁️  Starting OneCloudSync..."

# 1. Ensure Tailscale is running
sudo systemctl start tailscaled
sleep 2

# 2. Start PostgreSQL
sudo systemctl start postgresql

# 3. Start Nginx
sudo systemctl start nginx

# 4. Start Node.js API via PM2
pm2 start onecloudsync-api

echo "✅  All systems online!"
pm2 status
```

---

## stop-cloud.sh

Kill switch — shuts everything down:

```bash
#!/bin/bash
echo "🔴  Stopping OneCloudSync..."

# 1. Stop Node.js API
pm2 stop onecloudsync-api

# 2. Stop Nginx
sudo systemctl stop nginx

# 3. Stop PostgreSQL
sudo systemctl stop postgresql

echo "✅  All services stopped. Safe to power off."
```

---

## Usage

```bash
# Make scripts executable (first time only)
chmod +x start-cloud.sh stop-cloud.sh

# Start everything
./start-cloud.sh

# Stop everything
./stop-cloud.sh
```
