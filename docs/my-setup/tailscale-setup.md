# 🔐 Tailscale VPN Setup & Security Hardening

> My personal notes for setting up Tailscale on the Toshiba server and securing the system.

## Why Tailscale?

- **No port forwarding** — works behind NAT without touching the router
- **WireGuard encryption** — military-grade tunnel between phone and server
- **Fixed private IP** — each device gets a stable `100.x.x.x` address
- **Free tier** — supports up to 100 devices

---

## Installation (on the Toshiba server)

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start and authenticate
sudo tailscale up

# Check your Tailscale IP
tailscale ip -4
# Example output: 100.103.154.10
```

---

## Security Hardening (What I Did)

> 🐳 **Running with Docker?** Steps 1 and 2 below apply to the **manual (PM2 + host Nginx) setup only**. In the [Docker deployment](../05-deployment/docker-deployment.md#tailscale-hardening), the same result is one line in `.env`:
>
> ```dotenv
> BIND_IP=100.x.x.x   # your Tailscale IP → app reachable only via the VPN
> ```
>
> Port 3000 and PostgreSQL need no extra hardening in Docker — they are never published to the host at all. Steps 3 and 4 apply to both setups.

### 1. Nginx — Listen only on Tailscale IP *(manual setup)*

File: `/etc/nginx/sites-available/onecloudsync`

```nginx
server {
    listen 100.x.x.x:80;   # Replace with your Tailscale IP
    # ...rest of config
}
```

**Why?** This blocks anyone on the local WiFi from accessing the server. Only devices connected via Tailscale can reach it.

### 2. Node.js — Bind to Tailscale IP only *(manual setup)*

In `backend/src/server.js`, instead of `0.0.0.0`:

```javascript
app.listen(config.port, '100.x.x.x', () => {
    // Server only accepts connections from Tailscale network
});
```

**Why?** Prevents direct access to port 3000 from the local network, forcing all traffic through Nginx.

### 3. API Key in Headers (not URL)

All requests use `X-API-Key` header instead of query parameters.

**Why?** Prevents the key from leaking in browser history or server access logs.

### 4. Helmet.js + Rate Limiting

- **Helmet.js** — secures HTTP headers against common attacks
- **Rate Limiting** — prevents brute force and DoS attacks

---

## Secure Request Flow (How It Works)

```
1. Phone sends request via Tailscale app (encrypted tunnel)
2. Router sees only encrypted data — can't read anything
3. Nginx receives request on Tailscale IP → forwards to Express :3000
4. Node.js validates X-API-Key → responds with data
5. Result: 100% secure against external and internal snoopers
```

---

## Why No HTTPS?

Since all traffic goes through a **Tailscale (WireGuard) tunnel**, data is already encrypted. Access is restricted to devices that hold my private encryption keys. Traditional SSL is an extra layer for aesthetics, not a security necessity at this stage.

---

## Automation Scripts

### start-cloud.sh
Starts the entire system with one command:
- Activates Tailscale
- Wakes up PM2 (Node.js backend)
- Enables Nginx

### stop-cloud.sh
Kill switch — shuts down all services to save laptop power.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't reach server from phone | Check `tailscale status` on both devices |
| Tailscale IP changed | Run `tailscale ip -4` and update Nginx + Node.js configs |
| Connection timeout | Ensure Tailscale is running: `sudo systemctl status tailscaled` |
| Nginx refusing connections | Verify `listen` directive matches your current Tailscale IP |
