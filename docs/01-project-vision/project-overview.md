# 📋 Project Overview — OneCloudSync

## What is OneCloudSync?

A **personal cloud infrastructure** that connects a smartphone application (React PWA) to a home server (Toshiba Satellite L655 running Linux Mint). The system enables **photo upload, storage, and synchronization** between the smartphone and the home server.

---

## 🎯 Core Goals

| Goal | Description |
|------|-------------|
| **Personal Photo Cloud** | Upload, store, and browse photos from phone to home server |
| **Zero Cost** | Entire stack runs on owned hardware + free-tier services |
| **Single User** | Designed for personal use — no multi-tenancy overhead |

---

## 🧩 Design Principles

### 1. Data Integrity
Every photo is validated via checksums (SHA-256) to prevent corruption during transfer or storage duplication.

### 2. Minimal Resource Footprint
The server has limited resources (4.1 GB RAM, 430 GB storage). Every architectural decision prioritizes low memory usage and efficient I/O.

### 3. Separation of Concerns
- **Frontend (React PWA)** → Hosted on Vercel (free CDN, HTTPS, global edge network)
- **Backend (Node.js API)** → Runs on the home server (handles data and file storage)

### 4. Security by Simplicity
Single-user system with API key authentication. No complex OAuth flows — security comes from HTTPS, Cloudflare Tunnel, and access control at the network level.

---

## 🔄 High-Level Data Flow

```
📱 Phone (React PWA on Vercel)
    │
    └─ POST /api/photos/upload → Server stores photo + metadata
```

---

## 📊 Project Scope

### In Scope (v1.0)
- [x] Photo upload (single + batch)
- [x] Photo gallery/viewer
- [x] Storage statistics dashboard

### Out of Scope (Future)
- [ ] Video upload support
- [ ] Photo editing / filters
- [ ] Multi-user / sharing features
- [ ] Mobile native app (React Native)
- [ ] End-to-end encryption
- [ ] Thumbnail generation / image optimization

---

> **Next**: [System Architecture →](../02-architecture/system-architecture.md)
