<p align="center">
  <h1 align="center">☁️ OneCloudSync</h1>
  <p align="center"><strong>Personal Cloud Infrastructure — Technical Documentation</strong></p>
  <p align="center">
    <img src="https://img.shields.io/badge/status-in--development-orange" alt="Status">
    <img src="https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green" alt="Backend">
    <img src="https://img.shields.io/badge/frontend-React%20PWA-blue" alt="Frontend">
    <img src="https://img.shields.io/badge/database-PostgreSQL-336791" alt="Database">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </p>
</p>

---

## 📚 Documentation Index

| # | Section | Description | Path |
|---|---------|-------------|------|
| 01 | [Project Vision](./01-project-vision/project-overview.md) | Core idea, goals, and project scope | `01-project-vision/` |
| 02 | [Architecture](./02-architecture/) | System design, API contracts, and data flow | `02-architecture/` |
| 03 | [Infrastructure](./03-infrastructure/) | Server specs, tech stack, and dev environment setup | `03-infrastructure/` |
| 04 | [Features](./04-features/) | Hybrid storage strategy and filesystem design | `04-features/` |
| 05 | [Deployment](./05-deployment/) | Docker Compose setup (recommended) and manual hosting | `05-deployment/` |
| 06 | [Roadmap](./06-roadmap/) | Phased implementation plan and priorities | `06-roadmap/` |
| — | [Personal Setup](./my-setup/) | Author's server specs, Tailscale hardening, automation scripts | `my-setup/` |

---

## 🏗️ Project Structure

```
OneCloudSync/
├── docs/                   ← You are here
│   ├── 01-project-vision/
│   ├── 02-architecture/
│   ├── 03-infrastructure/
│   ├── 04-features/
│   ├── 05-deployment/
│   ├── 06-roadmap/
│   └── my-setup/           ← Author's personal server notes
│
├── backend/                ← Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── config/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               ← React PWA (Vite + nginx in Docker)
│   ├── public/
│   ├── src/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml      ← One-command deployment
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

Setup instructions live in **one place** — the [root README](../README.md#-quick-start):

- **Docker (recommended)** — one command for the full stack; details in the [Deployment Guide](./05-deployment/README.md)
- **Manual** — Node.js + local PostgreSQL for development

---

> **Author**: Sharif
