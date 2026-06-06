<p align="center">
  <h1 align="center">☁️ OneCloudSync</h1>
  <p align="center">
    <strong>Personal Cloud Infrastructure for Photo Sync</strong>
  </p>
  <p align="center">
    A self-hosted photo storage system powered by a React PWA and a Node.js home server.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/status-in--development-orange" alt="Status">
    <img src="https://img.shields.io/badge/node.js-v20-green?logo=nodedotjs" alt="Node.js">
    <img src="https://img.shields.io/badge/react-v19-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/postgresql-latest-336791?logo=postgresql" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa" alt="PWA">
  </p>
</p>

---

## 🖥️ Dashboard Preview

![Dashboard Preview](./design/stitch/dashboard/screen.png)

---

## 🌟 Overview

OneCloudSync is a **personal cloud system** that lets you upload and store photos from your smartphone to your home server.

### Key Features

- 📤 **Photo Upload** — Single and batch upload with drag & drop
- 🖼️ **Gallery** — Browse and manage your photo collection
- 🔒 **Secure** — HTTPS, API key auth, Cloudflare Tunnel
- 💰 **Zero Cost** — Runs entirely on owned hardware + free-tier services

---

## 🏗️ Architecture

```
📱 Phone (React PWA on Vercel)
      │
      └─ HTTPS ──► Cloudflare Tunnel ──► Nginx ──► Express API
                                                     │
                                                ┌────┴────┐
                                                │         │
                                             Photos   PostgreSQL
                                           (Filesystem) (Metadata)
```

---

## 📁 Project Structure

```
OneCloudSync/
├── backend/              # Node.js + Express REST API
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── uploads/          # Photo storage (date-organized)
│   ├── package.json
│   └── .env
│
├── frontend/             # React PWA (Vite)
│   ├── public/
│   ├── src/
│   └── package.json
│
├── docs/                 # Full technical documentation
│   ├── 01-project-vision/
│   ├── 02-architecture/
│   ├── 03-infrastructure/
│   ├── 04-features/
│   ├── 05-deployment/
│   └── 06-roadmap/
│
└── README.md             ← You are here
```

---

## 📚 Documentation

Full technical documentation is available in the [`docs/`](./docs/README.md) directory:

| Section | What's Inside |
|---------|--------------|
| [Project Vision](./docs/01-project-vision/project-overview.md) | Goals, scope, design principles |
| [Architecture](./docs/02-architecture/system-architecture.md) | System topology, component design |
| [API Design](./docs/02-architecture/api-design.md) | All REST endpoints with schemas |
| [Server Specs](./docs/03-infrastructure/server-specs.md) | Hardware report, resource budgeting |
| [Tech Stack](./docs/03-infrastructure/tech-stack.md) | All technologies and why they were chosen |
| [Dev Setup](./docs/03-infrastructure/remote-ssh-setup.md) | VS Code Remote-SSH configuration |
| [Storage](./docs/04-features/hybrid-storage.md) | Filesystem + PostgreSQL hybrid approach |
| [Deployment](./docs/05-deployment/deployment-strategy.md) | Vercel, Cloudflare Tunnel, PM2, Nginx |
| [Roadmap](./docs/06-roadmap/implementation-plan.md) | Phased implementation plan |

---

## 🖥️ Requirements

| Component | Minimum |
|-----------|---------|
| **OS** | Any Linux distribution (Ubuntu, Debian, Mint, etc.) |
| **RAM** | 2 GB+ |
| **Storage** | 50 GB+ (depends on your photo collection) |
| **Runtime** | Node.js v20+ |
| **Database** | PostgreSQL |
| **Web Server** | Nginx (reverse proxy) |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd OneCloudSync

# 2. Set up the backend
cd backend
cp .env.example .env    # Edit with your own values
npm install
npm run dev

# 3. Set up the frontend
cd ../frontend
npm install
npm run dev
```

> See [.env.example](./backend/.env.example) for all configuration options.

---

MIT License — see the [LICENSE](LICENSE) file for details.

---

> Built with ☕ by Sharif
