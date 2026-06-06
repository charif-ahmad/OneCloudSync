# 📅 Implementation Plan — Roadmap

## Phase Overview

```
Phase 1 ──────► Phase 2 ──────► Phase 3
 Backend         Frontend         Deploy +
 API Core        React UI         Test

 🔴 Critical     🔴 Critical     🟠 Final
```

---

## Phase 1: Backend API Core 🔴

> **Goal**: A working REST API that can receive, store, and serve photos.

| # | Task | Status |
|---|------|--------|
| 1.1 | Initialize Node.js project (`npm init`) | ⬜ |
| 1.2 | Install dependencies (Express, pg, multer, cors, helmet, etc.) | ⬜ |
| 1.3 | Create project structure (`src/`, `routes/`, `controllers/`, `middleware/`, `config/`) | ⬜ |
| 1.4 | Set up environment config (`.env` + `config/index.js`) | ⬜ |
| 1.5 | Create PostgreSQL database and `photos` table | ⬜ |
| 1.6 | Implement `GET /api/health` endpoint | ⬜ |
| 1.7 | Implement API Key authentication middleware | ⬜ |
| 1.8 | Implement `POST /api/photos/upload` (single upload) | ⬜ |
| 1.9 | Implement SHA-256 hash verification + deduplication | ⬜ |
| 1.10 | Implement `GET /api/photos` (list with pagination) | ⬜ |
| 1.11 | Implement `GET /api/photos/:id` (download photo) | ⬜ |
| 1.12 | Implement `DELETE /api/photos/:id` | ⬜ |
| 1.13 | Implement `POST /api/photos/batch` | ⬜ |
| 1.14 | Implement `GET /api/storage/stats` | ⬜ |
| 1.15 | Add error handling middleware | ⬜ |
| 1.16 | Add rate limiting middleware | ⬜ |
| 1.17 | Test all endpoints (Thunder Client / curl) | ⬜ |

### Deliverables
- [ ] Working API on `localhost:3000`
- [ ] PostgreSQL database with photos table
- [ ] All CRUD endpoints tested

---

## Phase 2: Frontend React UI 🔴

> **Goal**: A React application with upload and gallery features.

| # | Task | Status |
|---|------|--------|
| 2.1 | Initialize React project with Vite | ⬜ |
| 2.2 | Set up project structure (`components/`, `pages/`, `hooks/`, `services/`) | ⬜ |
| 2.3 | Create API service layer (`services/api.js`) | ⬜ |
| 2.4 | Build Login page (API key input) | ⬜ |
| 2.5 | Build Dashboard page (storage stats + recent uploads) | ⬜ |
| 2.6 | Build Upload page (drag & drop + file picker) | ⬜ |
| 2.7 | Build Gallery page (photo grid with lazy loading) | ⬜ |
| 2.8 | Build Photo Viewer (full-screen view + delete) | ⬜ |
| 2.9 | Add responsive design (mobile-first) | ⬜ |
| 2.10 | Add loading states and error handling | ⬜ |
| 2.11 | Add upload progress indicator | ⬜ |

### Deliverables
- [ ] React app connecting to backend API
- [ ] Upload, browse, view, and delete photos
- [ ] Mobile-responsive layout

---

## Phase 3: Deploy + Production 🟠

> **Goal**: Make the entire system accessible from anywhere.

| # | Task | Status |
|---|------|--------|
| 3.1 | Configure Nginx reverse proxy on Toshiba | ⬜ |
| 3.2 | Install and configure Cloudflare Tunnel | ⬜ |
| 3.3 | Set up PM2 process manager for Node.js | ⬜ |
| 3.4 | Deploy frontend to Vercel | ⬜ |
| 3.5 | Configure environment variables on Vercel | ⬜ |
| 3.6 | Test full end-to-end flow (phone → Vercel → tunnel → server) | ⬜ |
| 3.7 | Set up auto-start for all services on reboot | ⬜ |
| 3.8 | Create backup script for photos + database | ⬜ |

### Deliverables
- [ ] System accessible from phone via public URL
- [ ] All services auto-start on server reboot
- [ ] Backup strategy in place

---

## Timeline Estimate

| Phase | Estimated Duration | Dependency |
|-------|-------------------|------------|
| Phase 1 | 3-5 days | None |
| Phase 2 | 4-6 days | Phase 1 |
| Phase 3 | 2-3 days | Phase 1 + 2 |
| **Total** | **~9-14 days** | — |

---

## Current Focus

> 🎯 **Phase 1: Backend API Core** — Starting with the foundation.

---

> **Back to**: [Documentation Index →](../README.md)
